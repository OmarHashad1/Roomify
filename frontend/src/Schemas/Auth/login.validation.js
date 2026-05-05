import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Please enter your email address.")
    .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Please enter a valid email address."),

  password: Yup.string()
    .required("Please enter your password.")
});
