import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  User,
  ShieldCheck,
  BookOpen,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { UserContext } from "@/context/user/UserContext";
import { HotelContext } from "@/context/hotel/HotelContext";
import { BookingContext } from "@/context/booking/BookingContext";
import { profileSchema } from "@/Schemas/Customer/Profile.validation";
import { passwordSchema } from "@/Schemas/Customer/Password.validation";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/services/user.service";
import WriteReviewSidebar from "@/components/Customer/WriteReviewSidebar";
import ProfileSidebar from "@/components/Customer/ProfileSidebar";

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser, refreshUser, logout } = useContext(UserContext) || {};
  const { hotels: hotelsRaw = [] } = useContext(HotelContext) || {};
  const { bookings: allBookings } = useContext(BookingContext) || [];
  const [editing, setEditing] = useState(false);
  const [reviewSidebarBooking, setReviewSidebarBooking] = useState(null);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProfile()
      .then(({ data }) => setSaved(data.data))
      .catch(() => {
        if (
          loggedInUser?.firstName &&
          loggedInUser?.lastName &&
          loggedInUser?.email
        ) {
          setSaved(loggedInUser);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [loggedInUser]);

  // Determine current tab from URL
  const currentPath = location.pathname;
  const tab = useMemo(() => {
    if (currentPath.includes("security")) return "security";
    if (currentPath.includes("bookings")) return "bookings";
    if (currentPath.includes("reviews")) return "reviews";
    return "personal";
  }, [currentPath]);

  const hotelMap = useMemo(() => {
    return (hotelsRaw || []).reduce((acc, h) => {
      acc[h._id] = h;
      return acc;
    }, {});
  }, [hotelsRaw]);

  const formik = useFormik({
    initialValues: {
      firstName: saved?.firstName || "",
      lastName: saved?.lastName || "",
      email: saved?.email || "",
      phone: saved?.phone || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await updateProfile(values);
        const { changes, user, accessToken } = data.data;

        if ("email" in changes) {
          await logout?.({ skipServer: true });
          toast.info("Email changed — please log in again.");
          navigate("/login");
          return;
        }

        if (accessToken) localStorage.setItem("accessToken", accessToken);
        refreshUser?.();
        setSaved(user);
        toast.success("Profile updated.");
        setEditing(false);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        toast.error(
          status === 400 || status === 403
            ? msg
            : "Something went wrong. Please try again.",
        );
      }
    },
    enableReinitialize: true,
  });

  const pwFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        await logout?.({ skipServer: true });
        toast.info("Password changed — please log in again.");
        navigate("/login");
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        toast.error(
          status === 400 || status === 403
            ? msg
            : "Something went wrong. Please try again.",
        );
      }
    },
  });

  const handleLogout = () => {
    logout?.();
    toast.success("You've been logged out.");
    navigate("/login");
  };

  const initials =
    `${saved?.firstName?.[0] || ""}${saved?.lastName?.[0] || ""}`.toUpperCase();

  const mobileTabs = [
    {
      id: "personal",
      label: "Details",
      icon: <User size={13} />,
      path: "/user/profile",
    },
    {
      id: "security",
      label: "Security",
      icon: <ShieldCheck size={13} />,
      path: "/user/profile/security",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <BookOpen size={13} />,
      path: "/user/profile/bookings",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={13} />,
      path: "/user/profile/reviews",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-3">
        <AlertCircle size={32} className="text-gray-200" />
        <p className="text-sm font-semibold text-gray-400">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 md:py-10">
      <div className="max-w-4xl mx-auto flex gap-5 items-start">
        <ProfileSidebar
          tab={tab}
          setEditing={setEditing}
          initials={initials}
          saved={saved}
          onLogout={handleLogout}
        />

        <main className="flex-1 min-w-0 w-full">
          <div className="flex md:hidden items-center gap-2 mb-4 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-xs">
            {mobileTabs.map(({ id, label, icon, path }) => {
              const cls = `flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
                ${tab === id ? "bg-(--color-primary) text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    navigate(path);
                    setEditing(false);
                  }}
                  className={cls}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>

          <Outlet
            context={{
              editing,
              setEditing,
              saved,
              formik,
              pwFormik,
              allBookings,
              loggedInUser,
              hotelMap,
              setReviewSidebarBooking,
            }}
          />
        </main>
      </div>

      {reviewSidebarBooking && (
        <WriteReviewSidebar
          booking={reviewSidebarBooking}
          hotelName={reviewSidebarBooking.hotel?.name || "Hotel"}
          onClose={() => setReviewSidebarBooking(null)}
        />
      )}
    </div>
  );
}
