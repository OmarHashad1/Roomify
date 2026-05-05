import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ManagerLayout from "@/layouts/ManagerLayout";

// Route Guards
import {
  ProtectedRoute,
  AdminRoute,
  ManagerRoute,
  GuestRoute,
  NoManagerRoute,
  PublicRoute,
} from "./ProtectedRoute";

// Public Pages
import Home from "../pages/Public/Home";
import RoomDetails from "../pages/Public/RoomDetails";
import SearchResults from "../pages/Public/SearchResults";
import AboutUs from "../pages/Public/AboutUs";
import HotelManagerApplication from "@/pages/Public/HotelManagerApplication";
import ApplicationSubmitted from "@/pages/Public/ApplicationSubmitted";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";

// User Pages
import UserBookingDetails from "@/pages/User/UserBookingDetails";
import UserProfile from "@/pages/User/UserProfile";
import PersonalDetailsPage from "@/pages/User/PersonalDetailsPage";
import SecuritySettingsPage from "@/pages/User/SecuritySettingsPage";
import BookingsListPage from "@/pages/User/BookingsListPage";
import ReviewsListPage from "@/pages/User/ReviewsListPage";
import WriteReviews from "@/pages/User/WriteReviews";
import BookingPage from "@/pages/User/BookingPage";
import BookingSelectionPage from "@/pages/User/BookingSelectionPage";
import BookingGuestDetailsPage from "@/pages/User/BookingGuestDetailsPage";
import BookingPaymentPage from "@/pages/User/BookingPaymentPage";

// Manager Pages
import ManagerDashboard from "@/pages/Manager/ManagerDashboard";
import HotelBookings from "@/pages/Manager/HotelBookings";
import HotelProfile from "@/pages/Manager/HotelProfile";
import HotelRooms from "@/pages/Manager/HotelRooms";
import ManageRoom from "@/pages/Manager/ManageRoom";
import RoomAvailability from "@/pages/Manager/RoomAvailability";
import ManagerReviews from "@/pages/Manager/ManagerReviews";

// Admin pages
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminApplications from "@/pages/Admin/AdminApplications";
import BookingHistory from "@/pages/Admin/BookingHistory";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminUserDetails from "@/pages/Admin/AdminUserDetails";
import AdminHotels from "@/pages/Admin/AdminHotels";
import AdminHotelDetails from "@/pages/Admin/AdminHotelDetails";
import AdminPayments from "@/pages/Admin/AdminPayments";
import AdminReviews from "@/pages/Admin/AdminReviews";
import AdminLogs from "@/pages/Admin/AdminLogs";
import ApplicationDetails from "@/pages/Admin/ApplicationDetails";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "*", element: <NotFound /> },

      {
        element: <GuestRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },

      {
        children: [
          { path: "/", element: <Home /> },
          { path: "/home", element: <Home /> },
          { path: "/about", element: <AboutUs /> },
        ],
      },

      {
        element: <NoManagerRoute />,
        children: [
          { path: "/search/rooms", element: <SearchResults /> },
          { path: "/hotels/:id", element: <RoomDetails /> },
          { path: "/about", element: <AboutUs /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/user/profile",
            element: <UserProfile />,
            children: [
              { index: true, element: <PersonalDetailsPage /> },
              { path: "security", element: <SecuritySettingsPage /> },
              { path: "bookings", element: <BookingsListPage /> },
              { path: "reviews", element: <ReviewsListPage /> },
            ],
          },
          { path: "/user/bookings/:id", element: <UserBookingDetails /> },
          { path: "/booking/:roomId/*", element: <BookingPage /> },
        ],
      },
      {
        element: <PublicRoute />,
        children: [
          { path: "/host", element: <HotelManagerApplication /> },
          { path: "/host/submitted", element: <ApplicationSubmitted /> },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "hotels", element: <AdminHotels /> },
          { path: "hotels/applications", element: <AdminApplications /> },
          { path: "hotels/applications/:id", element: <ApplicationDetails /> },
          { path: "hotels/:id", element: <AdminHotelDetails /> },
          { path: "booking-history", element: <BookingHistory /> },
          { path: "users", element: <AdminUsers /> },
          { path: "users/:id", element: <AdminUserDetails /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "logs", element: <AdminLogs /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },

  {
    path: "/manager",
    element: <ManagerRoute />,
    children: [
      {
        element: <ManagerLayout />,
        children: [
          { index: true, element: <ManagerDashboard /> },
          { path: "dashboard", element: <ManagerDashboard /> },
          { path: "bookings", element: <HotelBookings /> },
          { path: "hotel-profile", element: <HotelProfile /> },
          { path: "rooms", element: <HotelRooms /> },
          { path: "rooms/:id/availability", element: <RoomAvailability /> },
          { path: "manage-room", element: <ManageRoom /> },
          { path: "manage-room/:id", element: <ManageRoom /> },
          { path: "reviews", element: <ManagerReviews /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);

export default router;
