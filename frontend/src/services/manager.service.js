import api from "../utils/axios.js";
import { assetUrl } from "../utils/assetUrl.js";

const MANAGER_HOTEL_ID_KEY = "managerHotelId";
let cachedManagerHotelId = null;

const getStoredManagerHotelId = () => {
  if (cachedManagerHotelId) return cachedManagerHotelId;
  const id = localStorage.getItem(MANAGER_HOTEL_ID_KEY);
  if (id) cachedManagerHotelId = id;
  return id;
};

const setStoredManagerHotelId = (hotelId) => {
  if (!hotelId) return;
  cachedManagerHotelId = hotelId;
  localStorage.setItem(MANAGER_HOTEL_ID_KEY, hotelId);
};

const clearStoredManagerHotelId = () => {
  cachedManagerHotelId = null;
  localStorage.removeItem(MANAGER_HOTEL_ID_KEY);
};


const mapBookingForManagerUI = (booking) => {
  const guestName = [booking.customer?.firstName, booking.customer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const subtotal = Number(booking.subtotal ?? 0);

  return {
    id: booking._id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    bookingStatus: booking.status,
    paymentStatus: booking.paymentStatus,
    roomType: booking.roomType?.type || "N/A",
    numRooms: 1,
    numGuests: booking.numGuests ?? 1,
    totalPrice: subtotal,
    guest: {
      name: guestName || "Guest",
      email: booking.customer?.email || "N/A",
      phone: booking.customer?.phone || "N/A",
    },
    payment: {
      method: booking.paymentMethod || "N/A",
      provider: "N/A",
      transactionStatus: booking.paymentStatus || "N/A",
      refundStatus: null,
    },
    priceBreakdown: {
      roomCost: subtotal,
      taxes: 0,
      fees: 0,
    },
    specialRequests: "",
  };
};

const mapReviewForManagerUI = (review) => {
  const fullName = [review.customer?.firstName, review.customer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const rating = Number(review.rating ?? 0);

  return {
    id: review._id,
    _id: review._id,
    name: fullName || "Guest",
    rating,
    comment: review.comment || "",
    createdAt: review.createdAt,
    status: review.status || "published",
    helpful: rating >= 4,
    reviewType: rating >= 4 ? "positive" : rating <= 2 ? "critical" : "neutral",
  };
};

const findManagedHotel = async () => {
  const storedHotelId = getStoredManagerHotelId();
  if (storedHotelId) {
    try {
      await api.get(`/hotels/${storedHotelId}`);
      return { _id: storedHotelId };
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        clearStoredManagerHotelId();
      } else {
        throw error;
      }
    }
  }

  try {
    const { data } = await api.get("/hotels/mine");
    const managerHotels = data?.data || [];
    const firstHotel = managerHotels[0];
    if (firstHotel?._id) {
      setStoredManagerHotelId(firstHotel._id);
      return firstHotel;
    }
    clearStoredManagerHotelId();
    throw new Error("No managed hotel found for this account");
  } catch (error) {
    if (error.response?.status !== 404) {
      throw error;
    }
  }

  throw new Error("No managed hotel found for this account");
};

const getManagedHotelDetails = async (hotelId) => {
  const { data: hotelRes } = await api.get(`/hotels/${hotelId}`);
  const hotel = hotelRes?.data;

  if (!hotel?._id) {
    throw new Error("Failed to load managed hotel details");
  }

  return hotel;
};

export const getManagedHotelProfile = async () => {
  const baseHotel = await findManagedHotel();
  const hotel = await getManagedHotelDetails(baseHotel._id);

  const photos = Array.isArray(hotel.photos) ? hotel.photos : [];
  const primaryPhoto = photos.length > 0 ? photos[photos.length - 1] : "";

  return {
    id: hotel._id,
    name: hotel.name || "",
    description: hotel.description || "",
    city: hotel.address?.city || "",
    address: hotel.address?.street || "",
    country: hotel.address?.country || "Egypt",
    phone: hotel.phone || "",
    email: hotel.email || "",
    rating: Number(hotel.stars || 0),
    amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
    numberOfRooms: Number(hotel.numberOfRooms || 0),
    status: hotel.status || "",
    photos: photos.map(assetUrl),
    image: assetUrl(primaryPhoto),
  };
};

export const getManagedHotelBookings = async (status) => {
  const hotel = await findManagedHotel();
  const { data } = await api.get(`/hotels/${hotel._id}/bookings`, {
    params: status ? { status } : undefined,
  });
  const bookings = data?.data || [];
  return bookings.map(mapBookingForManagerUI);
};

export const getManagedHotelReviews = async () => {
  const hotel = await findManagedHotel();
  const { data } = await api.get(`/reviews/hotel/${hotel._id}`);
  const reviews = data?.data || [];
  return reviews.map(mapReviewForManagerUI);
};

export const updateManagedHotel = async (hotelData) => {
  const hotel = await findManagedHotel();
  const { photoFiles, ...rest } = hotelData || {};
  const files = Array.isArray(photoFiles) ? photoFiles.filter(Boolean) : [];

  if (files.length > 0) {
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      if (typeof value === "undefined" || value === null) return;
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
        return;
      }
      formData.append(key, String(value));
    });
    files.forEach((file) => formData.append("photos", file));
    return api.patch(`/hotels/${hotel._id}`, formData);
  }

  return api.patch(`/hotels/${hotel._id}`, rest);
};

export const updateManagedBookingStatus = async (bookingId, status) =>
  api.patch(`/bookings/${bookingId}/status`, { status });

