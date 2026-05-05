import { ArrowLeft, CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InputField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function BookingPaymentPage({
  acceptTerms,
  cardErrors,
  cardValues,
  completeBooking,
  paymentMethod,
  roomId,
  selectedHotel,
  setAcceptTerms,
  setCardErrors,
  setCardValues,
  setPaymentMethod,
  submitting,
}) {
  const navigate = useNavigate();

  const validateCardField = (field, value) => {
    const next = { ...cardErrors };
    if (field === "cardNumber") {
      const d = value.replace(/\D/g, "");
      d.length !== 16 ? (next.cardNumber = "Must be exactly 16 digits") : delete next.cardNumber;
    } else if (field === "expiryDate") {
      !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)
        ? (next.expiryDate = "Use MM/YY format")
        : delete next.expiryDate;
    } else if (field === "cvc") {
      const d = value.replace(/\D/g, "");
      d.length < 3 || d.length > 4 ? (next.cvc = "Must be 3 or 4 digits") : delete next.cvc;
    } else if (field === "holderName") {
      !value.trim() ? (next.holderName = "Cardholder name is required") : delete next.holderName;
    }
    setCardErrors(next);
  };

  const handleCardChange = (field, value) => {
    setCardValues((prev) => ({ ...prev, [field]: value }));
    validateCardField(field, value);
  };

  const inputClass = (err) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
      err
        ? "border-red-300 bg-red-50 focus:border-red-400"
        : "border-gray-200 bg-white focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
    }`;

  return (
    <div className="space-y-4">
      {/* back */}
      <button
        type="button"
        onClick={() => navigate(`/booking/${roomId}/details`)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to your details
      </button>

      {/* payment method */}
      <SectionCard title="Payment method">
        <div className="space-y-3">
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
            paymentMethod === "credit_card"
              ? "border-(--color-primary) bg-blue-50/50"
              : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-(--color-primary)"
            />
            <CreditCard size={18} className={paymentMethod === "credit_card" ? "text-(--color-primary)" : "text-gray-400"} />
            <div>
              <p className="text-sm font-semibold text-gray-900">Credit / Debit Card</p>
              <p className="text-xs text-gray-400">Pay now securely online</p>
            </div>
          </label>

          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
            paymentMethod === "cash"
              ? "border-(--color-primary) bg-blue-50/50"
              : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-(--color-primary)"
            />
            <ShieldCheck size={18} className={paymentMethod === "cash" ? "text-(--color-primary)" : "text-gray-400"} />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pay at hotel</p>
              <p className="text-xs text-gray-400">No payment required now</p>
            </div>
          </label>
        </div>

        {paymentMethod === "credit_card" && (
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-4">
            <InputField label="Cardholder name" error={cardErrors.holderName}>
              <input
                type="text"
                value={cardValues.holderName}
                onChange={(e) => handleCardChange("holderName", e.target.value)}
                className={inputClass(cardErrors.holderName)}
                placeholder="John Doe"
              />
            </InputField>

            <InputField label="Card number" error={cardErrors.cardNumber}>
              <input
                type="text"
                value={cardValues.cardNumber}
                onChange={(e) =>
                  handleCardChange("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                className={inputClass(cardErrors.cardNumber)}
                placeholder="1234 5678 9012 3456"
              />
            </InputField>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Expiry date" error={cardErrors.expiryDate}>
                <input
                  type="text"
                  value={cardValues.expiryDate}
                  onChange={(e) => handleCardChange("expiryDate", e.target.value)}
                  className={inputClass(cardErrors.expiryDate)}
                  placeholder="MM/YY"
                />
              </InputField>

              <InputField label="CVC" error={cardErrors.cvc}>
                <input
                  type="text"
                  value={cardValues.cvc}
                  onChange={(e) =>
                    handleCardChange("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={inputClass(cardErrors.cvc)}
                  placeholder="123"
                />
              </InputField>
            </div>
          </div>
        )}
      </SectionCard>

      {/* terms */}
      <SectionCard title="Booking conditions">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-(--color-primary)"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            I agree to the{" "}
            <span className="font-semibold text-gray-800">terms and conditions</span>,{" "}
            <span className="font-semibold text-gray-800">privacy policy</span>, and{" "}
            <span className="font-semibold text-gray-800">{selectedHotel.name}&apos;s cancellation policy</span>.
          </span>
        </label>
      </SectionCard>

      {/* nav */}
      <div className="flex items-center justify-between pb-6">
        <button
          type="button"
          onClick={() => navigate(`/booking/${roomId}/details`)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          type="button"
          onClick={completeBooking}
          disabled={!acceptTerms || submitting}
          className={`flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-semibold shadow-sm transition-opacity ${
            acceptTerms && !submitting
              ? "text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={acceptTerms && !submitting ? { backgroundColor: "var(--color-primary)" } : {}}
        >
          {submitting
            ? <><Loader2 size={15} className="animate-spin" /> Processing...</>
            : <><CheckCircle2 size={15} /> Complete booking</>
          }
        </button>
      </div>
    </div>
  );
}
