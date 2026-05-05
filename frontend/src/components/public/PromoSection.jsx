import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, BadgePercent, ShieldCheck, Clock } from "lucide-react";

const PERKS = [
  { icon: BadgePercent, text: "Exclusive deals — only on Roomify" },
  { icon: ShieldCheck,  text: "Free cancellation on most hotels" },
  { icon: Clock,        text: "Instant confirmation, no waiting" },
];

function PromoSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl overflow-hidden flex flex-col lg:flex-row items-stretch"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="flex-1 p-10 lg:p-14 text-white flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase
              tracking-widest bg-white/15 border border-white/20 px-3 py-1 rounded-full mb-6 self-start">
              <BadgePercent size={12} />
              Limited time offer
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Your next stay,<br />at the best price.
            </h2>

            <p className="text-white/70 text-base leading-relaxed mb-7 max-w-md">
              Book directly through Roomify and unlock member-only rates, flexible
              cancellations, and hand-picked hotels across Egypt's most beautiful destinations.
            </p>

            <ul className="space-y-3 mb-8">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/search/rooms")}
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-6 py-3.5
                rounded-xl hover:bg-white/90 active:scale-95 transition-all cursor-pointer self-start"
              style={{ color: "var(--color-primary)" }}
            >
              Explore deals
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="relative w-full lg:w-[55%] shrink-0 min-h-64">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/Offer video.mp4" type="video/mp4" />
            </video>

            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-56
              bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3
              flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-gray-400 font-medium">Starting from</p>
                <p className="text-base font-extrabold text-gray-900">$50 / night</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50
                text-emerald-600 border border-emerald-100">
                Best price
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default PromoSection;
