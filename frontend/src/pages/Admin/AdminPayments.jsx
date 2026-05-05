import { useContext, useState } from "react";
import {
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  RefreshCcw,
  X,
  User,
  Hash,
  CalendarDays,
  DollarSign,
  Landmark,
  ArrowUpDown,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { PaymentContext } from "@/context/payment/PaymentContext";
import { PageHeader } from "@/components/Admin/PageHeader";

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#10b981",
    badgeClass: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
    badgeClass: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  refunded: {
    label: "Refunded",
    color: "#f43f5e",
    badgeClass: "bg-red-50 text-red-500",
    icon: RefreshCcw,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${cfg.badgeClass}`}
    >
      {cfg.label}
    </span>
  );
}

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function PaymentDetailsModal({ payment, paidBy, onClose }) {
  const isOpen = !!payment;
  const cfg = payment
    ? (STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending)
    : null;

  return (
    <div
      className={`fixed inset-0 z-70 overflow-hidden
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute top-4 bottom-4 bg-gray-50 rounded-2xl
          shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden
          inset-x-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Preview Panel
            </p>
            <h2 className="text-base font-bold text-gray-800 mt-0.5">
              Payment Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center
              justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5 space-y-3">
          {payment && (
            <>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center text-center border border-gray-100">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${cfg.color}15` }}
                >
                  <DollarSign size={26} style={{ color: cfg.color }} />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ${payment.amount.toLocaleString()}
                  <span className="text-sm font-medium text-gray-400 ml-1">
                    {payment.currency}
                  </span>
                </p>
                <div className="mt-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              {paidBy && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Paid By
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={15} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {paidBy.firstName} {paidBy.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{paidBy.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Transaction Info
                </p>
                {[
                  {
                    icon: Hash,
                    label: "Transaction ID",
                    value: payment.transactionId,
                  },
                  {
                    icon: Hash,
                    label: "Payment ID",
                    value: payment._id.toUpperCase(),
                  },
                  {
                    icon: Landmark,
                    label: "Provider",
                    value: payment.provider,
                  },
                  { icon: CreditCard, label: "Method", value: payment.method },
                  {
                    icon: CalendarDays,
                    label: "Date",
                    value: fmt(payment.createdAt),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5 text-sm">
                    <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium">
                        {label}
                      </p>
                      <p className="text-gray-700 font-medium truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {payment.refundStatus !== "none" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                    Refund
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    ${payment.refundAmount.toLocaleString()} {payment.currency}
                  </p>
                  <p className="text-xs text-blue-400 capitalize">
                    {payment.refundStatus}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPayments() {
  const { payments = [], summary = {} } = useContext(PaymentContext) || {};
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const STAT_CARDS = [
    { label: "Total Transactions", value: summary.total ?? payments.length,                                   icon: CreditCard, color: "#6366f1" },
    { label: "Collected Revenue",  value: `${(summary.totalRevenue ?? 0).toLocaleString()} EGP`,              icon: TrendingUp, color: "#10b981" },
    { label: "Pending Amount",     value: `${(summary.pendingAmount ?? 0).toLocaleString()} EGP`,             icon: Clock,      color: "#f59e0b" },
    { label: "Refunded",           value: summary.refunded ?? 0,                                              icon: Banknote,   color: "#f43f5e" },
  ];

  const filtered = payments.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.status === activeFilter;
    const q = search.toLowerCase();
    const paidBy = p.paidBy;
    const matchesSearch =
      !search ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.provider?.toLowerCase().includes(q) ||
      `${paidBy?.firstName ?? ""} ${paidBy?.lastName ?? ""}`.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const FILTERS = [
    { key: "all",       label: "All",       count: summary.total     ?? payments.length },
    { key: "completed", label: "Completed", count: summary.completed ?? 0 },
    { key: "pending",   label: "Pending",   count: summary.pending   ?? 0 },
    { key: "refunded",  label: "Refunded",  count: summary.refunded  ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Track and review all platform transactions."
        subtitleClassName="text-sm text-white/60 mt-1"
        stats={STAT_CARDS}
        statsGridClassName="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        statCardProps={{
          cardClassName: "duration-500 min-w-0",
          animationDuration: "0.5s",
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-150 cursor-pointer border
                  ${
                    activeFilter === f.key
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }`}
              >
                {f.label}
                <span
                  className={`text-xs font-semibold ${activeFilter === f.key ? "text-white/80" : "text-gray-400"}`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or transaction"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {[
                  "Transaction ID",
                  "Paid By",
                  "Amount",
                  "Provider",
                  "Method",
                  "Date",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <ArrowUpDown
                      size={32}
                      className="mx-auto mb-2 opacity-30"
                    />
                    <p className="text-sm">No payments found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const u = p.paidBy;
                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50/70 transition-colors duration-100 cursor-pointer group"
                      onClick={() => setSelected(p)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <CreditCard size={13} className="text-gray-400" />
                          </div>
                          <span className="font-mono text-xs text-gray-700 cursor-pointer transition-colors group-hover:text-(--color-primary)">
                            {p.transactionId}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {u ? (
                          <div>
                            <p className="font-medium text-gray-700">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ${p.amount.toLocaleString()}
                        <span className="text-xs text-gray-400 font-normal ml-1">
                          {p.currency}
                        </span>
                      </td>
                      <td className="px-5 py-4 capitalize text-gray-500">
                        {p.provider}
                      </td>
                      <td className="px-5 py-4 capitalize text-gray-500">
                        {p.method}
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {fmt(p.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-400">
          Showing {filtered.length} of {payments.length} payments
        </div>
      </div>

      <PaymentDetailsModal
        payment={selected}
        paidBy={selected?.paidBy ?? null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default AdminPayments;
