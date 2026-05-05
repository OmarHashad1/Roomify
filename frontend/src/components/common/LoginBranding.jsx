import { Link } from "react-router-dom";
import { BedDouble, Star, Shield } from "lucide-react";

const FEATURES = [
  { icon: BedDouble, text: "Browse hundreds of unique room types" },
  { icon: Star, text: "Trusted reviews from real guests" },
  { icon: Shield, text: "Secure and easy booking process" },
];

function LoginBranding() {
  return (
    <div className="hidden lg:flex relative w-[45%] shrink-0 min-h-145 rounded-l-3xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
        alt="Luxury hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/25 to-black/65" />

      <div className="relative z-10 flex flex-col justify-between h-full p-9">
        <Link to="/" className="flex items-center gap-0 shrink-0">
          <img
            src="/photos/a-flat-vector-logo-icon-featuring-a-whit_C5MeOFpaRd6XJcBTR86acA_IjcIwn8MR0qKcVPUFLt8kw_cover_sd-Photoroom.png"
            alt="Roomify logo"
            className="h-14 w-14 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-white -ml-4">
            oomify
          </span>
        </Link>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-white/50">
              Welcome back
            </p>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Your next stay
              <br />
              is one step away.
            </h2>
            <p className="text-white/55 mt-2.5 text-sm leading-relaxed">
              Sign in to manage your bookings and explore new stays.
            </p>
          </div>

          <ul className="space-y-2.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-white/75 text-sm"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="size-3.5" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Roomify™. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginBranding;
