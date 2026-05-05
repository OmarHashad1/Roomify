import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/user/UserContext";
import { toast } from "sonner";
import {
  Users,
  Hotel,
  FileText,
  Star,
  ScrollText,
  CalendarCheck,
  BedDouble,
  LogOut,
  ChevronRight,
  X,
  Gauge,
  DollarSign,
} from "lucide-react";

const sections = [
  {
    label: "Dashboard",
    items: [{ name: "Dashboard", path: "/admin", icon: Gauge }],
  },
  {
    label: "Users",
    items: [
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "Payments", path: "/admin/payments", icon: DollarSign },
    ],
  },
  {
    label: "Hotels",
    items: [
      { name: "Hotels", path: "/admin/hotels", icon: Hotel },
      {
        name: "Applications",
        path: "/admin/hotels/applications",
        icon: FileText,
      },
    ],
  },
  {
    label: "Reviews",
    items: [{ name: "Reviews", path: "/admin/reviews", icon: Star }],
  },

  {
    label: "Bookings",
    items: [
      { name: "Bookings", path: "/admin/booking-history", icon: CalendarCheck },
    ],
  },

  {
    label: "System Logs",
    items: [{ name: "Logs", path: "/admin/logs", icon: ScrollText }],
  },
];

function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("You've been logged out.");
    navigate("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-55 bg-black/40 lg:hidden h-screen"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-60 w-64 flex flex-col h-screen overflow-y-auto no-scrollbar
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto lg:shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex items-center gap-0 px-4 py-4 border-b border-white/15">
          <Link to="/admin" className="flex items-center gap-0 shrink-0">
            <img
              src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
              alt="Roomify logo"
              className="h-14 w-14 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-white -ml-4">
              oomify
            </span>
          </Link>

          <span
            className="ml-2 text-xs font-semibold text-white/70 bg-white/10 border border-white/20
              px-2 py-0.5 rounded-md uppercase tracking-wider"
          >
            Admin
          </span>

          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 px-2 mb-1">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={
                        item.path === "/admin" || item.path === "/admin/hotels"
                      }
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={17} strokeWidth={1.8} className="shrink-0" />
                      <span>{item.name}</span>
                      <ChevronRight
                        size={14}
                        className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity"
                      />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-3 pb-5 border-t border-white/15 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150 cursor-pointer"
          >
            <LogOut size={17} strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
