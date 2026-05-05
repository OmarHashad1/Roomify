import * as Yup from "yup";

export const hotelManagerApplicationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(/^[^0-9]+$/, "First name cannot contain numbers"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[^0-9]+$/, "Last name cannot contain numbers"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(
      /^\+\d{9,}$/,
      "Enter a valid phone number starting with + (e.g. +201001234567)",
    ),
  hotelName: Yup.string().trim().required("Hotel name is required"),
  stars: Yup.number()
    .integer("Stars must be a whole number")
    .typeError("Stars must be a number")
    .required("Star rating is required")
    .min(1, "Minimum 1 star")
    .max(5, "Maximum 5 stars"),
  street: Yup.string().trim().required("Street address is required"),
  city: Yup.string().trim().required("City is required"),
  country: Yup.string().trim().required("Country is required"),
  numberOfRooms: Yup.number()
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .min(1, "At least 1 room is required")
    .required("Number of rooms is required"),
  description: Yup.string()
    .trim()
    .required("Hotel description is required")
    .min(20, "Please provide at least 20 characters"),
  documents: Yup.array().min(1, "Upload at least one verification document"),
});
