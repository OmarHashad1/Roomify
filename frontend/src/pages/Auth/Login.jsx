import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "@/Schemas/Auth/login.validation";
import { useAuth } from "@/context/user/UserContext";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Star, MapPin } from "lucide-react";
import FloatingInput from "@/components/Public/FloatingInput";
import { Button } from "@/components/ui/button";

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

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const user = await login(values.email, values.password);
        toast.success("Welcome back!");
        if (user.role === "hotel_manager") navigate("/manager/dashboard");
        else if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/");
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
                Your perfect stay
                <br />
                starts here.
              </h2>
              <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-xs">
                Discover handpicked hotels across Egypt — from the Nile to the
                Red Sea.
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
              <h1 className="text-2xl font-extrabold text-gray-900">Sign in</h1>
              <p className="text-sm text-gray-400 mt-1">
                Welcome back — enter your details below.
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1">
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
              </div>

              <div>
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="current-password"
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
              </div>

              {formik.isSubmitting ? (
                <Button
                  disabled
                  className="w-full py-3 rounded-xl text-white text-sm font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </Button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white text-sm font-bold
                    hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Login
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
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Continue with Google
              </button> */}

              <p className="text-sm text-gray-400 text-center pt-1">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  Create one for free
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
