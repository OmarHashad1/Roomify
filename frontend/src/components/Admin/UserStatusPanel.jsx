import { ShieldAlert, ShieldOff, Copy, LogOut } from "lucide-react";

export function UserStatusPanel({
  userId,
  status,
  onToggle,
  onForceLogout,
  onCopyUserId,
  onCopyEmail,
}) {
  const isActive = status === "active";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
          User Admin Actions
        </h2>
        <p className="text-sm text-gray-500">
          {isActive
            ? "This user is currently active. You can suspend this account temporarily."
            : "This user is currently suspended. You can reactivate this account now."}
        </p>
      </div>

      <div className="space-y-3">
        {/* Primary Action Button */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
            transition-all active:scale-95 cursor-pointer border
            ${
              isActive
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
            }`}
        >
          {isActive ? (
            <>
              <ShieldOff size={16} /> Suspend User
            </>
          ) : (
            <>
              <ShieldAlert size={16} /> Reactivate User
            </>
          )}
        </button>

        {/* Session Management Buttons */}
        <div className="pt-1">
          <button
            onClick={onForceLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border
              border-blue-200 text-blue-600 bg-blue-50
              hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut size={14} /> Force Logout
          </button>
        </div>

        {/* Copy Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={onCopyEmail}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border
              border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 cursor-pointer"
          >
            <Copy size={14} /> Email
          </button>

          <button
            onClick={onCopyUserId}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border
              border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 cursor-pointer"
          >
            <Copy size={14} /> User ID
          </button>
        </div>

        {/* User ID Display */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
            User ID
          </p>
          <p className="text-xs font-mono text-gray-600 truncate">{userId}</p>
        </div>
      </div>
    </div>
  );
}
