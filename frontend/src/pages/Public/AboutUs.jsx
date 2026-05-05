import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Users, Star, Building2, ChevronDown,
  Search, CalendarCheck, ShieldCheck, HeartHandshake,
  Zap, Globe, Mail, ArrowRight,
} from "lucide-react";

const STATS = [
  { icon: Building2, value: "500+", label: "Hotels Listed" },
  { icon: MapPin,    value: "4",    label: "Cities Covered" },
  { icon: Users,     value: "12K+", label: "Happy Guests" },
  { icon: Star,      value: "4.8",  label: "Average Rating" },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Search",
    desc: "Enter your destination, dates and number of guests to browse available rooms in seconds.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book",
    desc: "Compare prices, read real guest reviews and confirm your reservation with a few clicks.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Stay",
    desc: "Check in with confidence knowing your booking is confirmed and our support team is available 24/7.",
  },
];

const VALUES = [
  { icon: HeartHandshake, title: "Guest First",        desc: "Every decision we make starts with the traveller's comfort and trust." },
  { icon: Zap,            title: "Speed & Simplicity", desc: "Booking a room should take seconds, not minutes. We obsess over every click." },
  { icon: Globe,          title: "Wider Reach",        desc: "Connecting small and large properties to guests they'd never reach alone." },
  { icon: ShieldCheck,    title: "Transparency",       desc: "No hidden fees, no surprises. What you see is exactly what you pay." },
];

const FAQ = [
  {
    q: "How does Roomify work?",
    a: "Roomify connects travellers with hotels across Egypt. Search by city and dates, compare options, and book in real time — no middlemen, no hidden costs.",
  },
  {
    q: "Is my payment secure?",
    a: "All transactions are processed through secure, encrypted payment gateways. Your financial details are never stored on our servers.",
  },
  {
    q: "Can I cancel or modify a booking?",
    a: "Yes. You can manage your bookings from your profile. Cancellation policies vary by property and are clearly shown before you confirm.",
  },
  {
    q: "How do I list my hotel on Roomify?",
    a: "Hotel managers can register for a manager account and access a dedicated dashboard to list properties, manage availability, and track bookings.",
  },
  {
    q: "How do I contact support?",
    a: "Reach us any time at support@roomify.com. We reply within minutes.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">

      <section className="relative bg-(--color-primary) text-white">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-white/15 px-4 py-1.5 rounded-full mb-6">
            Est. 2024 · Cairo, Egypt
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Travel smarter.<br />Stay better.
          </h1>
          <p className="text-white/75 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Roomify makes finding and booking the perfect hotel room effortless —
            whether you're planning a quick weekend getaway or a long business trip.
          </p>
          <Link
            to="/search/rooms"
            className="inline-flex items-center gap-2 bg-white text-(--color-primary) text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition"
          >
            Explore hotels <ArrowRight size={15} />
          </Link>
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pb-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 translate-y-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white rounded-2xl px-5 py-5 flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center">
                  <Icon size={18} className="text-(--color-primary)" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-xs text-gray-400 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16" />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest">Our Story</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Built for Egyptian travellers</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Roomify was born out of a simple frustration: finding and booking quality hotel rooms
              in Egypt was scattered across dozens of platforms, each with inconsistent information and hidden costs.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              We built a single, unified platform focused on the cities Egyptians love most —
              Cairo, Alexandria, Sharm El-Sheikh and Luxor — bringing hotels and guests together with full transparency.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Today, hundreds of hotels trust Roomify to reach their guests, and thousands of
              travellers use us every month to find their perfect stay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-40">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" alt="Hotel" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 mt-6">
              <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80" alt="Hotel lobby" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40">
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" alt="Pool" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 mt-6">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" alt="Room" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest">How It Works</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Three steps to your perfect stay</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-(--color-primary)/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-(--color-primary)" />
                </div>
                <span className="text-xs font-bold text-(--color-primary) tracking-widest">{step}</span>
                <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest">What We Stand For</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-(--color-primary)" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest">FAQ</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="bg-gray-50 rounded-2xl px-6 divide-y divide-gray-100">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-(--color-primary) rounded-3xl px-8 py-12 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
              <Mail size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Our support team is available 24/7. Drop us a line and we'll get back to you within minutes.
            </p>
            <a
              href="mailto:support@roomify.com"
              className="inline-flex items-center gap-2 bg-white text-(--color-primary) text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition"
            >
              support@roomify.com <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
