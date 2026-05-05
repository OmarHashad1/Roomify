import { Link, Navigate, useLocation } from "react-router-dom";
import { BadgeCheck, MailCheck } from "lucide-react";

function ApplicationSubmitted() {
  const { state } = useLocation();

  if (!state?.fromHotelApplication || !state?.submittedSuccessfully) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-7 sm:p-9 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BadgeCheck color={"#22C55E"} size={30} className="text-primary" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mt-5">
          Application submitted
        </h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-md mx-auto">
          Your application is now under review. We'll send you an email with
          more details shortly.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-start gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shrink-0 flex items-center justify-center">
              <MailCheck size={16} className="text-primary" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Make sure to check both your inbox and spam folder for more
              details.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-(--color-primary) text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Back to Home
          </Link>
          <Link
            to="/search/rooms"
            className="text-xs font-medium text-gray-500 hover:text-primary transition-colors"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicationSubmitted;
