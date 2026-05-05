import api from "../utils/axios.js";

export const login = ({ email, password }) => {
  return api.post("/auth/login", { email, password });
};

export const register = ({
  firstName,
  lastName,
  email,
  age,
  nationality,
  password,
  phone,
}) => {
  return api.post("/auth/signup", {
    firstName,
    lastName,
    email,
    age,
    nationality,
    password,
    phone,
  });
};
