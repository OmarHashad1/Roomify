import { useState, useEffect } from "react";
import { Menu, X, UserCircle, LogOut, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/user/UserContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Stays", to: "/search/rooms" },
  { label: "About Us", to: "/about" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleLogout() {
    logout();
    toast.success("You've been logged out.");
    navigate("/");
  }

  return (
    <>
      <nav className="w-full bg-(--color-primary) shadow-md sticky top-0 z-40">
        <div className="container px-6 py-2 flex items-center justify-between">
          <div className="flex gap-5">
            <Link to="/" className="flex items-center gap-0 shrink-0">
              <img
                src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
                alt="Roomify logo"
                className="h-20 w-20 object-contain -my-3"
              />
              <span className="text-2xl font-bold tracking-tight text-white -ml-6">oomify</span>
            </Link>

            <ul className="hidden md:flex items-center">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `relative text-md font-medium px-4 py-2 group transition-colors duration-300 cursor-pointer flex items-center ${
                        isActive ? "text-white" : "text-white/70 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        <span
                          className={`absolute bottom-0.5 left-4 right-4 h-0.5 bg-white rounded-full transition-transform duration-300 origin-left ${
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/host"
              className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 px-2 cursor-pointer group"
            >
              Host Your Space
              <span className="absolute -bottom-0.5 left-2 right-2 h-px bg-white rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            {loggedInUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-1.5
                    rounded-full border border-white/30 hover:border-white hover:bg-white/10
                    transition-all duration-300 cursor-pointer focus:outline-none group">
                    <UserCircle size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium">{loggedInUser.firstName}</span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-56 p-0 overflow-hidden border border-white/15 bg-(--color-primary) text-white shadow-2xl shadow-black/30"
                >
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                      <UserCircle size={22} strokeWidth={1.5} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {loggedInUser.firstName} {loggedInUser.lastName}
                      </p>
                      <p className="text-xs text-white/50 truncate">{loggedInUser.email}</p>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/user/profile"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/80
                          cursor-pointer hover:bg-white/10 hover:text-white transition-colors duration-150"
                      >
                        <User size={15} />
                        My Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                        text-red-300 cursor-pointer focus:bg-red-500/15 focus:text-red-200
                        transition-colors duration-150"
                    >
                      <LogOut size={15} />
                      Log out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white border border-white/40 rounded-full px-4 py-1.5
                    hover:bg-white/15 hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-(--color-primary) bg-white rounded-full px-4 py-1.5
                    hover:shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-(--color-primary) z-50 md:hidden flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-2xl ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 z-[60] p-2 rounded-full text-white/70
            hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        <div className="flex items-center px-6 pt-4 pb-4 border-b border-white/10">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-0">
            <img
              src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
              alt="Roomify logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-white -ml-3">oomify</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-4 flex-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive ? "text-white bg-white/20" : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/host"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-white/70 hover:text-white hover:bg-white/10
              px-4 py-3 rounded-xl transition-all duration-200"
          >
            Host Your Space
          </Link>
        </nav>

        <div className="flex flex-col gap-3 px-6 pb-8 pt-4 border-t border-white/10">
          {loggedInUser ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <UserCircle size={20} strokeWidth={1.5} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {loggedInUser.firstName} {loggedInUser.lastName}
                  </p>
                  <p className="text-xs text-white/50 truncate">{loggedInUser.email}</p>
                </div>
              </div>
              <Link
                to="/user/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-center text-sm font-medium text-white border border-white/40
                  rounded-full px-4 py-2.5 hover:bg-white/15 hover:border-white transition-all duration-200"
              >
                <User size={15} />
                My Profile
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-red-300 border border-red-400/40
                  rounded-full px-4 py-2.5 hover:bg-red-500/15 hover:border-red-300 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={15} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium text-white border border-white/40 rounded-full px-4 py-2.5
                  hover:bg-white/15 hover:border-white transition-all duration-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium text-(--color-primary) bg-white rounded-full px-4 py-2.5
                  hover:bg-white/90 transition-all duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
