import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const { pathname } = useLocation();

  const isAdmin = pathname.startsWith("/admin");
  const isManager = pathname.startsWith("/manager");

  const backLink = isAdmin ? "/admin" : isManager ? "/manager/dashboard" : "/";
  const backLabel = isAdmin
    ? "Back to Admin Dashboard"
    : isManager
    ? "Back to Dashboard"
    : "Back to Home";

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={backLink}
        className="px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-hover) transition-colors"
      >
        {backLabel}
      </Link>
    </div>
  );
}

export default NotFound;
