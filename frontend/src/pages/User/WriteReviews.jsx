import React, { useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserContext } from "@/context/user/UserContext";
import { BookingContext } from "@/context/booking/BookingContext";
import { HotelContext } from "@/context/hotel/HotelContext";
import { Star } from "lucide-react";

const categories = [
  "Staff",
  "Facilities",
  "Cleanliness",
  "Comfort",
  "Value for Money",
  "Location",
];

function getTravelerType(numGuests) {
  if (numGuests === 1) return "Solo traveler";
  if (numGuests === 2) return "Couple";
  if (numGuests === 3) return "Family";
  return "Group of friends";
}

function WriteReviews() {
  const navigate = useNavigate();
  const userId = "64a1f2c3e4b5d6789012abcd";
  const { users: usersData = [] } = useContext(UserContext) || {};
  const { bookings = [] } = useContext(BookingContext) || {};
  const { hotels = [] } = useContext(HotelContext) || {};

  const user = usersData.find((u) => u._id === userId);
  const booking = bookings.find((b) => b.userId === userId);
  const hotel = hotels.find((h) => h._id === booking?.hotelId);

  const roomType = booking?.roomType || "N/A";

  const travelerType = getTravelerType(booking?.numGuests);

  const [ratings, setRatings] = useState({
    Staff: 0,
    Facilities: 0,
    Cleanliness: 0,
    Comfort: 0,
    "Value for Money": 0,
    Location: 0,
  });

  const [comment, setComment] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleRating(category, value) {
    if (submitted) return;

    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  }

  const allRated = Object.values(ratings).every((v) => v > 0);

  const averageScore = useMemo(() => {
    if (!allRated) return 0;

    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);

    return ((sum / values.length) * 2).toFixed(1);
  }, [ratings, allRated]);

  function submitReview() {
    if (!comment.trim()) {
      toast.error("Comment Required", {
        description: "Please write your experience before submitting.",
        duration: 4000,
      });
      return;
    }

    if (!allRated) {
      toast.warning("Incomplete Rating", {
        description: "Please rate all categories before submitting.",
        duration: 4000,
      });
      return;
    }

    setSubmitted(true);
    toast.success("Review Submitted!", {
      description: "Thank you for sharing your experience.",
      duration: 4000,
    });
    const review = {
      customer: userId,
      booking: booking?._id || null,
      hotel: hotel?._id || booking?.hotelId || null,
      ratings,
      averageScore,
      comment,
      travelerType,
      status: "published",
      createdAt: new Date(),
    };

  }

  if (!booking) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Write a Review</h1>
        <p className="text-red-600">
          No completed booking found for current user.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Write a Review</h1>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* LEFT SCORE PANEL */}

        <div className="border rounded-xl p-6 h-fit bg-muted">
          <h3 className="font-semibold mb-4">Your Score</h3>

          {allRated ? (
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600">{averageScore}</p>

              <p className="text-sm text-muted-foreground">out of 10</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Rate all categories to see your score
            </p>
          )}
        </div>

        {/* RIGHT CONTENT */}

        <div className="space-y-6">
          {/* GUEST INFO */}

          <div className="border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Guest Information</h2>

            <p>
              <b>Name:</b>{" "}
              {booking?.guest?.name ||
                `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "Unknown"}
            </p>

            <p>
              <b>Email:</b> {booking?.guest?.email || user?.email || "N/A"}
            </p>

            <p>
              <b>Phone:</b> {booking?.guest?.phone || user?.phone || "N/A"}
            </p>

            <p>
              <b>Room:</b> {roomType}
            </p>

            <p>
              <b>Traveler Type:</b> {travelerType}
            </p>

            <p>
              <b>Check-in:</b> {booking?.checkIn}
            </p>

            <p>
              <b>Check-out:</b> {booking?.checkOut}
            </p>

            <p>
              <b>Country:</b> {hotel?.address?.country || "N/A"}
            </p>
          </div>

          {/* RATING */}

          <div className="border rounded-xl p-6">
            <h2 className="font-semibold mb-5">Rate Your Stay</h2>

            {categories.map((category) => (
              <div key={category} className="mb-4">
                <p className="mb-2 font-medium">{category}</p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = ratings[category] >= star;

                    return (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => handleRating(category, star)}
                        className={`cursor-pointer ${
                          active
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } ${submitted && "pointer-events-none"}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* COMMENT */}

          <div className="border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Write Your Review</h2>

            <textarea
              className="w-full border rounded p-3"
              rows="4"
              value={comment}
              disabled={submitted}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers about your experience..."
            />
          </div>

          {/* BUTTONS */}

          {!submitted ? (
            <Button
              onClick={submitReview}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            >
              Submit Review
            </Button>
          ) : (
            <Button
              disabled
              className="w-full bg-gray-400 text-white cursor-not-allowed"
            >
              Review Submitted
            </Button>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/user/profile")}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteReviews;