import { useContext, useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import BookingSidebar from "@/components/Booking/BookingSidebar";
import BookingSelectionPage from "@/pages/User/BookingSelectionPage";
import BookingGuestDetailsPage from "@/pages/User/BookingGuestDetailsPage";
import BookingPaymentPage from "@/pages/User/BookingPaymentPage";
import { UserContext } from "@/context/user/UserContext";
import api from "@/utils/axios";

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getNights(checkIn, checkOut) {
  const diff = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86_400_000);
  return diff > 0 ? diff : 1;
}

export function toCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Quarter-based seasonal pricing keyed off the check-in date.
const SEASONS = [
  { mult: 0.9,  label: "Off-season saving",      note: "Quieter travel period — reduced rates applied to your stay." },
  { mult: 0.85, label: "Limited-time offer",     note: "Limited-time discount applied — book now to lock in this price." },
  { mult: 1.2,  label: "Peak-season demand",     note: "High demand right now — rates are above standard." },
  { mult: 1.05, label: "Holiday-season pricing", note: "Slightly elevated rates due to holiday-season demand." },
];

export function getSeason(checkIn) {
  return SEASONS[Math.floor(new Date(checkIn).getMonth() / 3)];
}

export function getRoomTitle(rt) {
  if (!rt) return "Room";
  const count = rt.bedroomCount ?? rt.bedroom ?? null;
  const label =
    count === 1
      ? "1 Bedroom"
      : count
        ? `${count} Bedrooms`
        : (rt.type ?? "Room");
  return rt.view ? `${label} · ${rt.view}` : label;
}

const STEPS = [
  { id: 1, label: "Select room" },
  { id: 2, label: "Your details" },
  { id: 3, label: "Payment" },
];

const tomorrow = addDays(new Date().toISOString().slice(0, 10), 1);
const defaultCheckOut = addDays(tomorrow, 3);

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { loggedInUser } = useContext(UserContext) || {};

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || tomorrow,
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || defaultCheckOut,
  );

  const [roomType, setRoomType] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/hotels/room-types/${roomId}`)
      .then(({ data }) => {
        const rt = data.data;
        setRoomType(rt);
        return Promise.all([
          api.get(
            `/hotels/room-types/hotel/${rt.hotel._id}?checkIn=${checkIn}&checkOut=${checkOut}`,
          ),
          api.get(`/reviews/hotel/${rt.hotel._id}`),
        ]);
      })
      .then(([roomsRes, reviewsRes]) => {
        setHotelRooms(roomsRes.data.data);
        setReviews(reviewsRes.data.data);
      })
      .catch((err) => setFetchError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [roomId, checkIn, checkOut]);

  const selectedHotel = roomType?.hotel ?? null;
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [adults, setAdults] = useState(
    parseInt(searchParams.get("adults") || "2", 10),
  );
  const [children, setChildren] = useState(
    parseInt(searchParams.get("children") || "0", 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardValues, setCardValues] = useState({
    holderName:
      `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}`.trim(),
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [cardErrors, setCardErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roomType) setSelectedRoomId(roomType._id);
  }, [roomType]);

  const detailsFormik = useFormik({
    initialValues: {
      email: loggedInUser?.email || "",
      phone: loggedInUser?.phone || "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email"),
      phone: Yup.string()
        .required("Phone is required")
        .matches(/^\+?[0-9\s-]{8,15}$/, "Enter a valid phone number"),
    }),
    onSubmit: () => {},
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
  });

  const selectedRoom = useMemo(
    () => hotelRooms.find((r) => r._id === selectedRoomId) || roomType,
    [hotelRooms, selectedRoomId, roomType],
  );
  const nights = getNights(checkIn, checkOut);
  const pricePerNight = selectedRoom?.pricePerNight ?? 0;
  const basePrice = pricePerNight * selectedQuantity * nights;
  const { mult: seasonMultiplier, label: seasonLabel, note: seasonNote } = getSeason(checkIn);
  const seasonPercent = Math.round((seasonMultiplier - 1) * 100);
  const totalPrice = Math.max(0, basePrice * seasonMultiplier);

  const currentStep = useMemo(() => {
    if (location.pathname.endsWith("/payment")) return 3;
    if (location.pathname.endsWith("/details")) return 2;
    return 1;
  }, [location.pathname]);

  const goToDetailsStep = (rtId, qty) => {
    if (!rtId) return toast.error("Please choose a room type.");
    if (checkOut <= checkIn)
      return toast.error("Check-out must be after check-in.");
    const rt = hotelRooms.find((r) => r._id === rtId);
    if (rt && adults + children > rt.maxGuests * qty)
      return toast.error(
        `Capacity exceeded. Max ${rt.maxGuests * qty} guest(s).`,
      );
    setSelectedRoomId(rtId);
    setSelectedQuantity(qty);
    const qs = `?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
    navigate(`/booking/${roomId}/details${qs}`);
  };

  const goToPaymentStep = async () => {
    const errors = await detailsFormik.validateForm();
    detailsFormik.setTouched({ email: true, phone: true }, true);
    if (Object.keys(errors).length > 0)
      return toast.error("Please fill in all required fields.");
    const qs = `?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
    navigate(`/booking/${roomId}/payment${qs}`);
  };

  const validatePayment = () => {
    if (paymentMethod !== "credit_card") {
      setCardErrors({});
      return true;
    }
    const next = {};
    const digits = cardValues.cardNumber.replace(/\D/g, "");
    const cvc = cardValues.cvc.replace(/\D/g, "");
    if (!cardValues.holderName.trim())
      next.holderName = "Cardholder name is required";
    if (!/^\d{16}$/.test(digits)) next.cardNumber = "Must be exactly 16 digits";
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardValues.expiryDate))
      next.expiryDate = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(cvc)) next.cvc = "Must be 3 or 4 digits";
    setCardErrors(next);
    return Object.keys(next).length === 0;
  };

  const completeBooking = async () => {
    if (!acceptTerms)
      return toast.error("You must agree to the booking conditions.");
    if (!validatePayment()) return toast.error("Please fix payment details.");

    setSubmitting(true);
    try {
      const { data: bookingData } = await api.post("/bookings/create-booking", {
        roomTypeId: selectedRoomId,
        checkIn,
        checkOut,
        numGuests: adults + children,
        paymentMethod,
      });

      const bookingId = bookingData.data._id;

      if (paymentMethod === "credit_card") {
        await api.post(`/payments/${bookingId}/pay`);
        toast.success("Booking confirmed and payment processed!");
      } else {
        toast.success("Booking confirmed! Pay at the hotel.");
      }

      navigate("/user/profile/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const pageProps = {
    addDays,
    adults,
    acceptTerms,
    basePrice,
    cardErrors,
    cardValues,
    checkIn,
    checkOut,
    children,
    completeBooking,
    currentUser: loggedInUser,
    detailsFormik,
    formatDateLabel,
    getRoomTitle,
    submitting,
    goToDetailsStep,
    goToPaymentStep,
    hotelRooms,
    nights,
    paymentMethod,
    reviews,
    roomId,
    selectedHotel,
    selectedQuantity,
    selectedRoom,
    selectedRoomId,
    setAdults,
    setAcceptTerms,
    setCardErrors,
    setCardValues,
    setChildren,
    setCheckIn,
    setCheckOut,
    setPaymentMethod,
    setSelectedQuantity,
    setSelectedRoomId,
    toCurrency,
    seasonLabel,
    seasonNote,
    seasonPercent,
    totalPrice,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={36} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (fetchError || !selectedHotel || !selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-lg font-bold text-gray-900">Room not found</p>
          <p className="text-sm text-gray-400 mt-2">
            {fetchError || "We couldn't load this room."}
          </p>
          <button
            onClick={() => navigate("/search/rooms")}
            className="mt-6 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${
                      currentStep >= step.id
                        ? "text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    style={
                      currentStep >= step.id
                        ? { backgroundColor: "var(--color-primary)" }
                        : {}
                    }
                  >
                    {step.id}
                  </span>
                  <span
                    className={`text-sm font-semibold hidden sm:block transition-colors
                    ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-px mx-3 transition-colors
                    ${currentStep > step.id ? "bg-gray-300" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <div>
            {currentStep === 1 && <BookingSelectionPage {...pageProps} />}
            {currentStep === 2 && <BookingGuestDetailsPage {...pageProps} />}
            {currentStep === 3 && <BookingPaymentPage {...pageProps} />}
          </div>

          <BookingSidebar
            selectedHotel={selectedHotel}
            checkIn={formatDateLabel(checkIn)}
            checkOut={formatDateLabel(checkOut)}
            adults={adults}
            children={children}
            nights={nights}
            selectedRoom={selectedRoom}
            selectedQuantity={selectedQuantity}
            pricePerNight={pricePerNight}
            basePrice={basePrice}
            seasonLabel={seasonLabel}
            seasonNote={seasonNote}
            seasonPercent={seasonPercent}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
