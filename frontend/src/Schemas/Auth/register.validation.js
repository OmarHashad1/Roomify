import * as Yup from "yup";

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("Please enter your first name.")
    .min(2, "First name must be at least 2 characters.")
    .max(30, "First name cannot be longer than 30 characters.")
    .matches(/^[^0-9]+$/, "First name cannot contain numbers."),

  lastName: Yup.string()
    .trim()
    .required("Please enter your last name.")
    .min(2, "Last name must be at least 2 characters.")
    .max(30, "Last name cannot be longer than 30 characters.")
    .matches(/^[^0-9]+$/, "Last name cannot contain numbers."),

  email: Yup.string()
    .trim()
    .required("Please enter your email address.")
    .email("Please enter a valid email address.")
    .matches(
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      "Please enter a valid email address.",
    ),

  password: Yup.string()
    .required("Please enter a password.")
    .min(8, "Password must be at least 8 characters.")
    .max(30, "Password cannot be longer than 30 characters."),

  confirmPassword: Yup.string()
    .required("Please confirm your password.")
    .oneOf([Yup.ref("password")], "Passwords do not match."),

  phone: Yup.string()
    .trim()
    .required("Please enter your phone number.")
    .matches(
      /^\+\d{9,}$/,
      "Please enter a valid phone number in the format +20100000000.",
    ),

  nationality: Yup.string()
    .trim()
    .required("Please enter your nationality.")
    .matches(/^[^0-9]+$/, "Nationality cannot contain numbers."),

  age: Yup.number()
    .typeError("Age must be a number.")
    .required("Please enter your age.")
    .min(18, "You must be at least 16 years old.")
    .max(100, "Please enter a valid age."),
});
