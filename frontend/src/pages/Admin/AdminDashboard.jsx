import { useContext } from "react";
import {
  Users,
  UserX,
  Hotel,
  FileText,
  Star,
  CalendarCheck,
  Clock3,
  DollarSign,
} from "lucide-react";

import { UserContext } from "@/context/user/UserContext";
import { HotelContext } from "@/context/hotel/HotelContext";
import { HotelApplicationContext } from "@/context/hotelApplication/HotelApplicationContext";
import { BookingContext } from "@/context/booking/BookingContext";
import { ReviewContext } from "@/context/review/ReviewContext";
import { PaymentContext } from "@/context/payment/PaymentContext";

import { PageHeader } from "@/components/Admin/PageHeader";
import { RecentUsersTable } from "@/components/Admin/RecentUsersTable";
import { RecentHotelsTable } from "@/components/Admin/RecentHotelsTable";
import { RecentReviewsTable } from "@/components/Admin/RecentReviewsTable";
import { PendingPanel } from "@/components/Admin/PendingPanel";
import { BookingStatusDonut } from "@/components/Admin/BookingStatusDonut";
import { ReviewsRatingBar } from "@/components/Admin/ReviewsRatingBar";
import { groupByMonth, groupByKey } from "@/utils/chartHelpers";

export default function AdminDashboard() {
  const { users = [] } = useContext(UserContext) || {};
  const { hotels = [] } = useContext(HotelContext) || {};
  const { applications = [] } = useContext(HotelApplicationContext) || {};
  const { bookings = [] } = useContext(BookingContext) || {};
  const { reviews = [] } = useContext(ReviewContext) || {};
  const { payments = [] } = useContext(PaymentContext) || {};

  const totalPayments = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const suspendedUsers = users.filter((u) => u.status === "suspended");

  const cards = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length,
      chartData: groupByKey(users, "role"),
      chartType: "bar",
      color: "#6366f1",
      to: "/admin/users",
    },
    {
      icon: Hotel,
      label: "Hotels",
      value: hotels.length,
      chartData: groupByKey(
        hotels.map((hotel) => ({
          ...hotel,
          stars: Math.round(Number(hotel.stars) || 0),
        })),
        "stars",
      ).map((d) => ({
        ...d,
        name: `${d.name}★`,
      })),
      chartValueLabel: "Hotels",
      chartType: "bar",
      color: "#0ea5e9",
      to: "/admin/hotels",
    },
    {
      icon: CalendarCheck,
      label: "Bookings",
      value: bookings.length,
      chartData: groupByMonth(bookings, "checkIn"),
      chartType: "area",
      color: "#10b981",
      to: "/admin/booking-history",
    },
    {
      icon: DollarSign,
      label: "Total Payments",
      value: `$${totalPayments.toLocaleString()}`,
      chartData: groupByKey(payments, "status"),
      chartType: "bar",
      color: "#059669",
      to: "/admin/payments",
    },
    {
      icon: FileText,
      label: "Applications",
      value: applications.length,
      chartData: groupByKey(applications, "status"),
      chartType: "bar",
      color: "#f59e0b",
      to: "/admin/hotels/applications",
    },
    {
      icon: Clock3,
      label: "Pending Payments",
      value: pendingPayments.length,
      chartData: groupByMonth(pendingPayments, "createdAt"),
      chartType: "bar",
      color: "#8b5cf6",
      to: "/admin/payments",
    },
    {
      icon: Star,
      label: "Reviews",
      value: reviews.length,
      chartData: groupByKey(reviews, "status"),
      chartType: "bar",
      color: "#f43f5e",
      to: "/admin/reviews",
    },
    {
      icon: UserX,
      label: "Suspended Users",
      value: suspendedUsers.length,
      chartData: groupByKey(suspendedUsers, "role"),
      chartType: "bar",
      color: "#ef4444",
      to: "/admin/users",
    },
  ];

  return (
    <>
      <PageHeader
        title="Good morning, Admin"
        subtitle="Here's what's happening on Roomify today."
        subtitleClassName="text-white/60 text-sm mt-1"
        stats={cards}
        statsGridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        statCardVariant="chart"
      />
      <div className="py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PendingPanel />
          <BookingStatusDonut />
          <ReviewsRatingBar />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RecentUsersTable />
          <RecentHotelsTable />
        </div>

        <RecentReviewsTable />
      </div>
    </>
  );
}
