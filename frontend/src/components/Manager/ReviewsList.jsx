import ReviewCard from "./ReviewCard";

function ReviewsList({ reviews = [], onOpen }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id || review._id}
          review={review}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export default ReviewsList;
