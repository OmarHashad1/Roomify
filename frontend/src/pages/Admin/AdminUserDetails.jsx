import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { UserCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  getUserById,
  forceLogoutUser,
  updateUserStatus,
} from "@/services/admin.service";
import { UserDetailsHeader } from "@/components/Admin/UserDetailsHeader";
import { UserDetailsSections } from "@/components/Admin/UserDetailsSections";
import { UserStatusPanel } from "@/components/Admin/UserStatusPanel";

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUserById(id)
      .then(({ data }) => {
        setUser(data.data);
        setStatus(data.data.status ?? "active");
      })
      .catch((err) => {
        const s = err.response?.status;
        setError(
          s === 404
            ? "User not found"
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        {error === "User not found" ? (
          <UserCircle2 size={40} className="text-gray-300 mb-3" />
        ) : (
          <AlertCircle size={32} className="text-gray-200 mb-3" />
        )}
        <p className="text-gray-500 font-medium">{error ?? "User not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-blue-500 hover:underline cursor-pointer"
        >
          Go back
        </button>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const newStatus = status === "active" ? "suspended" : "active";
    try {
      await updateUserStatus(user._id, newStatus);
      setStatus(newStatus);
      if (newStatus === "suspended") {
        toast.error("User suspended", {
          description: `${user.firstName} ${user.lastName} has been suspended. This account is now restricted.`,
          position: "top-center",
        });
      } else {
        toast.success("User reactivated", {
          description: `${user.firstName} ${user.lastName} is now active again.`,
          position: "top-center",
        });
      }
    } catch (err) {
      const s = err.response?.status;
      const msg = err.response?.data?.message;
      toast.error(
        s === 400 || s === 404
          ? msg
          : "Something went wrong. Please try again.",
        { position: "top-center" },
      );
    }
  };

  const handleForceLogout = async () => {
    try {
      await forceLogoutUser(user._id);
      toast.error("Sessions revoked", {
        description: `All active sessions for ${user.firstName} ${user.lastName} were logged out.`,
        position: "top-center",
      });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      toast.error(
        status === 400 || status === 404
          ? msg
          : "Something went wrong. Please try again.",
        { position: "top-center" },
      );
    }
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user._id);
      toast.success("User ID copied", {
        description: "User ID copied to clipboard.",
        position: "top-center",
      });
    } catch {
      toast.error("Copy failed", {
        description: "Could not copy user ID.",
        position: "top-center",
      });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email);
      toast.success("Email copied", {
        description: "User email copied to clipboard.",
        position: "top-center",
      });
    } catch {
      toast.error("Copy failed", {
        description: "Could not copy user email.",
        position: "top-center",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <UserDetailsHeader
        user={user}
        role={user.role}
        status={status}
        onBack={() => navigate(-1)}
        onGoUsers={() => navigate("/admin/users")}
      />

      <UserDetailsSections
        user={user}
        status={status}
        actionsPanel={
          <UserStatusPanel
            userId={user._id}
            status={status}
            onToggle={handleToggleStatus}
            onForceLogout={handleForceLogout}
            onCopyUserId={handleCopyUserId}
            onCopyEmail={handleCopyEmail}
          />
        }
      />
    </div>
  );
}

export default AdminUserDetails;
