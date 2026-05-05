import { useContext, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { UsersTable } from "@/components/Admin/UsersTable";
import { UsersHeader } from "@/components/Admin/UsersHeader";
import InformationModal from "@/components/Admin/InformationModal";
import { UserContext } from "@/context/user/UserContext";

function AdminUsers() {
  const {
    users = [],
    usersLoading: loading,
    usersError: error,
  } = useContext(UserContext) || {};
  const [selectedUser, setSelectedUser] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <AlertCircle size={32} className="text-gray-200" />
        <p className="text-sm font-semibold text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader users={users} />
      <UsersTable users={users} onSelectUser={setSelectedUser} />
      <InformationModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

export default AdminUsers;
