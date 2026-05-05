import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { login as loginService } from "../../services/auth.service.js";
import { getAllUsers } from "../../services/admin.service.js";
import api from "../../utils/axios.js";

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getUserFromStorage() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;
  return decodeToken(accessToken);
}

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(getUserFromStorage);
  const [users, setUsers] = useState([]);
  const [usersSummary, setUsersSummary] = useState({});
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const isAdmin = loggedInUser?.role === "admin";

  const fetchUsers = async () => {
    if (!isAdmin) return;

    setUsersLoading(true);
    setUsersError(null);
    try {
      const { data } = await getAllUsers();
      setUsers(data.data.users);
      setUsersSummary(data.data.totalUsersCount);
    } catch (err) {
      setUsersError(err.response?.data?.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setUsers([]);
      setUsersSummary({});
      setUsersError(null);
      setUsersLoading(false);
      return;
    }

    fetchUsers();
  }, [isAdmin]);

  function refreshUser() {
    setLoggedInUser(getUserFromStorage());
  }

  async function login(email, password) {
    const { data } = await loginService({ email, password });
    const { accessToken, refreshToken } = data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.removeItem("managerHotelId");
    const user = decodeToken(accessToken);
    setLoggedInUser(user);
    return user;
  }

  async function logout({ skipServer = false } = {}) {
    if (!skipServer) {
      try {
        await api.post("/auth/logout", { flag: "current" });
      } catch {}
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("managerHotelId");
    setLoggedInUser(null);
  }

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        refreshUser,
        users,
        usersSummary,
        usersLoading,
        usersError,
        refreshUsers: fetchUsers,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
