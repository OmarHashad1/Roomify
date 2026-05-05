import * as Yup from "yup";

export const searchSchema = Yup.object({
  location: Yup.string()
    .trim()
    .required("Please enter a destination")
    .matches(/^[^0-9]+$/, { message: "Destination cannot contain numbers", excludeEmptyString: true }),

  checkIn: Yup.string()
    .required("Please select a check-in date")
    .test("not-past", "Check-in cannot be in the past", (value) => {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),

  checkOut: Yup.string()
    .required("Please select a check-out date")
    .test("after-checkin", "Check-out must be on or after check-in", function (value) {
      const { checkIn } = this.parent;
      if (!checkIn || !value) return true;
      return new Date(value) >= new Date(checkIn);
    }),

  adults: Yup.number()
    .min(1, "At least 1 adult is required")
    .max(10, "Maximum 10 adults")
    .required(),

  children: Yup.number()
    .min(0)
    .max(6, "Maximum 6 children")
    .required(),

  rooms: Yup.number()
    .min(1, "At least 1 room is required")
    .max(5, "Maximum 5 rooms")
    .required(),
});
