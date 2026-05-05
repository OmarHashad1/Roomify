import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registerSchema } from "@/Schemas/Auth/register.validation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  MapPinHouse,
  Star,
  MapPin,
} from "lucide-react";
import FloatingInput from "@/components/Public/FloatingInput";
import { register as registerUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

function getPasswordStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Fair", color: "bg-amber-400" };
  return { level: 3, label: "Strong", color: "bg-green-500" };
}

const PREVIEW_CARDS = [
  {
    photo:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    name: "Nile Grand Hotel",
    city: "Cairo",
    price: 150,
    stars: 5,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
    name: "Sharm Oasis Hotel",
    city: "Sharm El-Sheikh",
    price: 80,
    stars: 4,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
    name: "Alexandria Pearl Resort",
    city: "Alexandria",
    price: 120,
    stars: 4,
  },
];

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationality: "",
      age: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword: _cp, ...payload } = values;
        await registerUser(payload);
        toast.success("Account created! Please sign in.");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
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
              src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
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
                Join thousands
                <br />
                of happy travelers.
              </h2>
              <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-xs">
                Create your free account and unlock exclusive rates across
                Egypt's finest hotels.
              </p>
            </div>

            <div className="space-y-3">
              {PREVIEW_CARDS.map((card) => (
                <div
                  key={card.name}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15"
                >
                  <img
                    src={card.photo}
                    alt={card.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {card.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-white/50" />
                      <span className="text-white/50 text-xs">{card.city}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: card.stars }).map((_, i) => (
                        <Star
                          key={i}
                          size={9}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-white text-sm font-bold">
                      ${card.price}
                    </p>
                    <p className="text-white/40 text-[10px]">/ night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-0 mb-8">
              <img
                src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd.jpeg"
                alt="Roomify logo"
                className="h-12 w-12 object-contain"
              />
              <span
                className="text-xl font-bold tracking-tight -ml-3"
                style={{ color: "var(--color-primary)" }}
              >
                oomify
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Create your account
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Sign up to start booking your perfect stay.
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

              <FloatingInput
                id="nationality"
                type="text"
                label="Nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                icon={MapPinHouse}
                error={formik.touched.nationality && formik.errors.nationality}
              />

              <FloatingInput
                id="age"
                type="number"
                label="Age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                icon={Calendar}
                error={formik.touched.age && formik.errors.age}
              />

              <div className="space-y-2">
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                  icon={Lock}
                  error={formik.touched.password && formik.errors.password}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {formik.values.password &&
                  (() => {
                    const strength = getPasswordStrength(
                      formik.values.password,
                    );
                    return (
                      <div className="space-y-1 px-1">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs font-medium ${strength.level === 1 ? "text-red-500" : strength.level === 2 ? "text-amber-500" : "text-green-500"}`}
                        >
                          {strength.label}
                        </p>
                      </div>
                    );
                  })()}
              </div>

              <FloatingInput
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                label="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="new-password"
                icon={Lock}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {formik.isSubmitting ? (
                <Button
                  disabled
                  className="w-full py-3 rounded-xl text-white text-sm font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </Button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white text-sm font-bold
                    hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Create account
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
                  border border-gray-200 bg-white text-sm font-semibold text-gray-700
                  hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Continue with Google
              </button> */}

              <p className="text-sm text-gray-400 text-center pt-1">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
