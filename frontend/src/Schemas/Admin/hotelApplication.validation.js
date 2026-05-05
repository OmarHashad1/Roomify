import { object, string } from "yup";

export const rejectionSchema = object({
  rejectionReason: string()
    .trim()
    .required("Rejection reason is required")
    .min(10, "Please provide at least 10 characters")
    .max(500, "Reason must be 500 characters or less"),
});
