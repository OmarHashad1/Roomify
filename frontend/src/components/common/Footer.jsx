import { Link } from "react-router-dom";
import { useAuth } from "@/context/user/UserContext";

const guestLinks = [
  { label: "Browse stays", to: "/search/rooms" },
  { label: "About", to: "/about" },
  { label: "Become a host", to: "/host" },
  { label: "Sign in", to: "/login" },
  { label: "Create account", to: "/register" },
];

const customerLinks = [
  { label: "Browse stays", to: "/search/rooms" },
  { label: "About", to: "/about" },
  { label: "My profile", to: "/user/profile" },
  { label: "My bookings", to: "/user/profile/bookings" },
  { label: "My reviews", to: "/user/profile/reviews" },
];

const managerLinks = [
  { label: "Dashboard", to: "/manager/dashboard" },
  { label: "Bookings", to: "/manager/bookings" },
  { label: "Rooms", to: "/manager/rooms" },
  { label: "Hotel profile", to: "/manager/hotel-profile" },
  { label: "Reviews", to: "/manager/reviews" },
];

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Hotels", to: "/admin/hotels" },
  { label: "Applications", to: "/admin/hotels/applications" },
  { label: "Users", to: "/admin/users" },
  { label: "Booking history", to: "/admin/booking-history" },
];

function getNavLinks(role) {
  if (role === "admin") return adminLinks;
  if (role === "hotel_manager") return managerLinks;
  if (role === "customer") return customerLinks;
  return guestLinks;
}

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.32-6.96L4.8 22H1.54l8.03-9.18L1 2h6.91l4.81 6.36L18.244 2zm-1.19 18h1.88L7.04 4H5.06l11.994 16z" />
  </svg>
);

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Twitter", href: "#", Icon: TwitterIcon },
];

function Footer() {
  const { loggedInUser } = useAuth();
  const navLinks = getNavLinks(loggedInUser?.role);

  return (
    <footer className="bg-(--color-primary) text-white">
      <div className="container px-6 py-10 flex flex-col items-center text-center">
        <Link to="/" className="inline-flex items-center -ml-2">
          <img
            src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
            alt="Roomify logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white -ml-3">
            oomify
          </span>
        </Link>

        <p className="mt-3 text-sm text-white/70 max-w-md">
          Find your next stay across hand-picked hotels — book in minutes,
          relax for days.
        </p>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex items-center gap-3">
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 flex items-center justify-center rounded-full
                bg-white/10 text-white/85 hover:bg-white hover:text-(--color-primary)
                transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        <div className="mt-8 pt-5 w-full border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Roomify. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <a
              href="mailto:hello@roomify.app"
              className="hover:text-white transition-colors"
            >
              hello@roomify.app
            </a>
            <span className="opacity-40">·</span>
            <span>Cairo, Egypt</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
