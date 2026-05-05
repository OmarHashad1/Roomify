import { useNavigate } from "react-router-dom";
import {
  User,
  ShieldCheck,
  BookOpen,
  Star,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { id: "personal", label: "Personal Details", icon: <User size={15} />, path: "/user/profile" },
  { id: "security", label: "Security", icon: <ShieldCheck size={15} />, path: "/user/profile/security" },
  { id: "bookings", label: "My Bookings", icon: <BookOpen size={15} />, path: "/user/profile/bookings" },
  { id: "reviews", label: "My Reviews", icon: <Star size={15} />, path: "/user/profile/reviews" },
];

export default function ProfileSidebar({
  tab,
  setEditing,
  initials,
  saved,
  onLogout,
}) {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    navigate(item.path);
    setEditing(false);
  };

  return (
    <aside className="hidden md:block w-64 shrink-0 bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-(--color-primary) flex items-center justify-center text-white text-xl font-bold mb-3">
          {initials}
        </div>
        <p className="font-semibold text-gray-800 text-sm text-center leading-snug">
          {saved?.firstName} {saved?.lastName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 text-center truncate w-full px-2">
          {saved?.email}
        </p>
      </div>

      <nav className="py-2">
        {NAV.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors
                ${active ? "bg-primary/8 text-(--color-primary) border-r-2 border-(--color-primary)" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {!active && (
                <ChevronRight size={13} className="ml-auto opacity-30" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 py-2">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
