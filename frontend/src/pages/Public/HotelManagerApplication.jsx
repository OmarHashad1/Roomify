import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Hotel,
  Star,
  MapPin,
  BedDouble,
  FileText,
  Upload,
} from "lucide-react";
import FloatingInput from "@/components/Public/FloatingInput";
import { Spinner } from "@/components/ui/spinner";
import { hotelManagerApplicationSchema } from "@/Schemas/Public/hotelManagerApplication.validation";
import { submitHotelApplication } from "@/services/hotelApplication.service";

const HIGHLIGHTS = [
  {
    icon: BedDouble,
    title: "List your property",
    desc: "Reach thousands of travelers across Egypt.",
  },
  {
    icon: Star,
    title: "Earn more revenue",
    desc: "Set your own rates and availability.",
  },
  {
    icon: MapPin,
    title: "Full control",
    desc: "Manage bookings, reviews, and payouts.",
  },
];

function HotelManagerApplication() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hotelName: "",
      stars: "",
      street: "",
      city: "",
      country: "",
      numberOfRooms: "",
      description: "",
      documents: [],
    },
    validationSchema: hotelManagerApplicationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await submitHotelApplication(values);
        resetForm();
        toast.success("Application submitted successfully.", {
          description: "Your request is now under  review.",
        });
        navigate("/host/submitted", {
          state: {
            fromHotelApplication: true,
            submittedSuccessfully: true,
          },
          replace: true,
        });
      } catch (err) {
        const message =
          err.response?.data?.message ??
          "Something went wrong. Please try again.";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl flex items-stretch gap-6">
        <div
          className="hidden lg:flex flex-col justify-start gap-10 w-[45%] shrink-0 p-10 relative overflow-hidden rounded-3xl"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 bg-white" />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-0 shrink-0"
          >
            <img
              src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd-Photoroom.png"
              alt="Roomify logo"
              className="h-14 w-14 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-white -ml-4">
              oomify
            </span>
          </Link>

          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Partner with us.
                <br />
                Grow your hotel.
              </h2>
              <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-xs">
                Join Egypt's fastest-growing hotel platform and connect with
                guests looking for their perfect stay.
              </p>
            </div>

            <div className="space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 py-12 overflow-y-auto">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <img
                src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
                alt="Roomify logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--color-primary)" }}
              >
                Roomify
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Hotel application
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Fill in your details to apply as a hotel manager.
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <FloatingInput
                  id="firstName"
                  type="text"
                  label="First name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="given-name"
                  icon={User}
                  error={formik.touched.firstName && formik.errors.firstName}
                />
                <FloatingInput
                  id="lastName"
                  type="text"
                  label="Last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="family-name"
                  icon={User}
                  error={formik.touched.lastName && formik.errors.lastName}
                />
              </div>

              <FloatingInput
                id="email"
                type="email"
                label="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="email"
                icon={Mail}
                error={formik.touched.email && formik.errors.email}
              />

              {/* Phone */}
              <FloatingInput
                id="phone"
                type="tel"
                label="Phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="tel"
                icon={Phone}
                error={formik.touched.phone && formik.errors.phone}
              />

              <div className="grid grid-cols-2 gap-3">
                <FloatingInput
                  id="hotelName"
                  type="text"
                  label="Hotel name"
                  value={formik.values.hotelName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  icon={Hotel}
                  error={formik.touched.hotelName && formik.errors.hotelName}
                />
                <FloatingInput
                  id="stars"
                  type="number"
                  label="Stars (1–5)"
                  value={formik.values.stars}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  icon={Star}
                  error={formik.touched.stars && formik.errors.stars}
                />
              </div>

              <FloatingInput
                id="street"
                type="text"
                label="Street address"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="street-address"
                icon={MapPin}
                error={formik.touched.street && formik.errors.street}
              />

              <div className="grid grid-cols-2 gap-3">
                <FloatingInput
                  id="city"
                  type="text"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="address-level2"
                  icon={MapPin}
                  error={formik.touched.city && formik.errors.city}
                />
                <FloatingInput
                  id="country"
                  type="text"
                  label="Country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="address-level1"
                  icon={MapPin}
                  error={formik.touched.country && formik.errors.country}
                />
              </div>

              <FloatingInput
                id="numberOfRooms"
                type="number"
                label="Number of rooms"
                value={formik.values.numberOfRooms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                icon={BedDouble}
                error={
                  formik.touched.numberOfRooms && formik.errors.numberOfRooms
                }
              />

              <div className="space-y-1">
                <div className="relative">
                  <FileText
                    size={15}
                    className="absolute left-3.5 top-4 text-gray-400 z-10 pointer-events-none"
                  />
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder=" "
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`peer w-full pl-10 pr-4 pt-4 pb-3 text-sm rounded-xl border bg-white text-gray-900 outline-none transition-all duration-200 resize-none focus:ring-2
                      ${
                        formik.touched.description && formik.errors.description
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-(--color-primary) focus:ring-primary/20"
                      }`}
                  />
                  <label
                    htmlFor="description"
                    className={`absolute left-10 top-4 text-sm pointer-events-none bg-white px-0.5 transition-all duration-200
                      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:px-1
                      peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2
                      peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-1
                      ${
                        formik.touched.description && formik.errors.description
                          ? "text-red-400 peer-focus:text-red-400 peer-[:not(:placeholder-shown)]:text-red-400"
                          : "text-gray-400 peer-focus:text-(--color-primary) peer-[:not(:placeholder-shown)]:text-gray-500"
                      }`}
                  >
                    Hotel description
                  </label>
                </div>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-red-500 pl-1">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="documents"
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border text-sm cursor-pointer transition-all duration-200
                    ${
                      formik.touched.documents && formik.errors.documents
                        ? "border-red-400 bg-red-50 text-red-400"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <Upload size={15} className="shrink-0" />
                  <span className="truncate">
                    {formik.values.documents.length > 0
                      ? `${formik.values.documents.length} file${formik.values.documents.length > 1 ? "s" : ""} selected`
                      : "Upload verification documents"}
                  </span>
                  <input
                    id="documents"
                    name="documents"
                    type="file"
                    multiple
                    className="hidden"
                    onBlur={formik.handleBlur}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "documents",
                        Array.from(e.target.files ?? []),
                      )
                    }
                  />
                </label>
                <p className="text-xs text-gray-400 pl-1">
                  Hotel license, ownership proof, or legal documents.
                </p>
                {formik.touched.documents && formik.errors.documents && (
                  <p className="text-xs text-red-500 pl-1">
                    {formik.errors.documents}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold
                  hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer
                  disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {formik.isSubmitting && <Spinner className="size-4" />}
                {formik.isSubmitting ? "Submitting…" : "Submit application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelManagerApplication;
