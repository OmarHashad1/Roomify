import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/user/UserContext";
import { ArrowRight, UserCircle } from "lucide-react";

const ROLE_BADGE = {
  customer: "bg-blue-50 text-blue-600",
  hotel_manager: "bg-amber-50 text-amber-600",
};

const STATUS_BADGE = {
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-red-50 text-red-400",
  suspended: "bg-gray-100 text-gray-400",
};

export function RecentUsersTable() {
  const navigate = useNavigate();
  const { users = [] } = useContext(UserContext) || {};

  const recent = users
    .filter((u) => u.role === "customer" || u.role === "hotel_manager")
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Recent Users</h2>
        <Link
          to="/admin/users"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Show all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-5 py-3 text-left font-medium">User</th>
              <th className="px-5 py-3 text-left font-medium">Role</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigate(`/admin/users/${user._id}`)}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <UserCircle size={15} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate cursor-pointer transition-colors group-hover:underline group-hover:text-(--color-primary)">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${ROLE_BADGE[user.role] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {user.role === "hotel_manager" ? "Manager" : user.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${STATUS_BADGE[user.status] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
