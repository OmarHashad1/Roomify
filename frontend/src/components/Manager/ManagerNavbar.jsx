import { UserCircle, ShieldCheck, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/user/UserContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ManagerNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("You've been logged out.");
    navigate("/login");
  }

  return (
    <nav className="w-full bg-white border-b border-border shrink-0 sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center p-2 rounded-lg
            text-white/70 hover:text-white hover:bg-(--color-primary-hover) transition-all duration-150 cursor-pointer bg-(--color-primary)"
        >
          <Menu size={22} />
        </button>

        <div className="hidden lg:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 text-white/70 hover:text-white px-3 py-1.5
                rounded-full border border-transparent hover:border-white/30 hover:bg-(--color-primary-hover)
                transition-all duration-300 cursor-pointer focus:outline-none group bg-(--color-primary)"
            >
              <UserCircle
                size={26}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-medium">{loggedInUser?.firstName ?? "Manager"}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-56 p-0 overflow-hidden border border-white/15
              bg-(--color-primary) text-white shadow-2xl shadow-black/30"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <UserCircle
                  size={22}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : "Manager"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={11} className="text-white/50 shrink-0" />
                  <p className="text-xs text-white/50">Manager</p>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                  text-red-300 cursor-pointer
                  focus:bg-red-500/15 focus:text-red-200
                  transition-colors duration-150"
              >
                <LogOut size={15} />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default ManagerNavbar;
