import * as Yup from "yup";

export const profileSchema = Yup.object({
  firstName: Yup.string()
    .required("Required")
    .min(2, "Min 2 characters")
    .max(30, "Max 30 characters"),
  lastName: Yup.string()
    .required("Required")
    .min(2, "Min 2 characters")
    .max(30, "Max 30 characters"),
  email: Yup.string().required("Required").email("Invalid email"),
  phone: Yup.string()
    .required("Required")
    .matches(
      /^\+\d{9,}$/,
      "Use international format, e.g. +201012345678",
    ),
});
