import { ArrowLeft, ChevronRight, UserCircle2 } from "lucide-react";
import { ROLE_CONFIG, STATUS_CONFIG } from "@/components/Admin/UsersTable";

export function UserDetailsHeader({ user, role, status, onBack, onGoUsers }) {
  const roleCfg = ROLE_CONFIG[role] || ROLE_CONFIG.customer;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={onGoUsers}
          >
            Users
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>

      <div
        className="rounded-2xl px-8 py-6 text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20
              flex items-center justify-center shrink-0"
            >
              <UserCircle2 size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {user.firstName} {user.lastName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${roleCfg.badgeClass}`}
            >
              {roleCfg.label}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}
            >
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
