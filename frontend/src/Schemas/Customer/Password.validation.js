import * as Yup from "yup";

export const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string()
    .required("Required")
    .min(8, "Min 8 characters")
    .max(128, "Max 128 characters"),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("newPassword")], "Passwords don't match"),
});
