import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

function FloatingInput({
  id,
  type = "text",
  label,
  value,
  onChange,
  autoComplete,
  icon: Icon,
  suffix,
}) {
  return (
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
      />
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="peer w-full pl-10 pr-11 pt-5 pb-2 text-sm rounded-xl border border-gray-200
          bg-white text-gray-900 outline-none transition-all duration-200
          focus:border-(--color-primary) focus:ring-2 focus:ring-primary/20"
      />
      <label
        htmlFor={id}
        className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400
          pointer-events-none bg-white px-0.5 transition-all duration-200
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-(--color-primary) peer-focus:px-1
          peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs
          peer-[:not(:placeholder-shown)]:text-gray-500 peer-[:not(:placeholder-shown)]:px-1"
      >
        {label}
      </label>
      {suffix}
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  }

  return (
    <div className="w-full max-w-md">
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
          Sign in to your account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && (
          <div
            className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200
            px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <FloatingInput
          id="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          autoComplete="email"
          icon={Mail}
        />

        <div>
          <FloatingInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoComplete="current-password"
            icon={Lock}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                  hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2
            hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-gray-500 text-center pt-1">
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
  );
}

export default LoginForm;
