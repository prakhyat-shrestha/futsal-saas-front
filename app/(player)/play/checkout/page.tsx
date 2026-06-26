"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, CreditCard, ArrowRight } from "lucide-react";
import { useBookingDraftStore } from "@/store/bookingDraftStore";
import { useAuthStore } from "@/store/authStore";

type PaymentMethod = "esewa" | "khalti";

export default function CheckoutPage() {
  const router = useRouter();
  const draft = useBookingDraftStore((s) => s.draft);
  const { user } = useAuthStore();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft) router.replace("/play");
  }, [draft, router]);

  if (!draft) return null;

  async function handleConfirmAndPay() {
    setIsSubmitting(true);
    try {
      // Next step: POST booking to backend, then redirect to eSewa/Khalti payment session
      console.log("Confirming booking:", { draft, fullName, phone, paymentMethod });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-gray-900 mb-1">Complete your booking</h1>
        <p className="font-dm text-sm text-gray-400">
          Review your details and confirm payment to secure the pitch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-5">
          <FormCard icon={User} title="Player Details">
            <Field label="Full Name">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </Field>
          </FormCard>

          <FormCard icon={CreditCard} title="Payment Method">
            <div className="space-y-3">
              <PaymentOption
                method="esewa"
                label="eSewa"
                selected={paymentMethod === "esewa"}
                onSelect={() => setPaymentMethod("esewa")}
              />
              <PaymentOption
                method="khalti"
                label="Khalti"
                selected={paymentMethod === "khalti"}
                onSelect={() => setPaymentMethod("khalti")}
              />
            </div>
          </FormCard>
        </div>

        {/* Right: summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="rounded-2xl overflow-hidden bg-gray-900 mb-4">
              <div className="relative h-28">
                <img src={draft.imageUrl} alt={draft.venueName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              </div>

              <div className="px-5 -mt-6 relative z-10">
                <span className="inline-block bg-green-400 text-black text-[10px] font-dm font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2">
                  Selected Pitch
                </span>
                <h3 className="font-syne font-bold text-white text-lg mb-4">{draft.venueName}</h3>
              </div>

              <div className="px-5 pb-5 space-y-3">
                <SummaryRow icon={Calendar} label="Date" value={draft.dateLabel} />
                <SummaryRow icon={Clock} label="Time" value={draft.timeRange} />

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="font-dm text-xs text-gray-400">Total due</span>
                  <span className="font-syne font-bold text-green-400 text-lg">
                    ₨{draft.totalDue}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmAndPay}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-bold py-3.5 rounded-xl text-sm transition-colors mb-3"
            >
              {isSubmitting ? "Processing..." : "Confirm & Pay"}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>

            <p className="font-dm text-xs text-gray-400 text-center">
              By confirming, you agree to our{" "}
              <a href="/cancellation-policy" className="underline hover:text-gray-600">
                Cancellation Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0">
          <Icon size={14} />
        </span>
        <h2 className="font-syne font-semibold text-base text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block font-dm text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function PaymentOption({
  method,
  label,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors ${
        selected ? "border-gray-900" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected ? "border-gray-900" : "border-gray-300"
          }`}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-gray-900" />}
        </span>
        <span className="font-dm text-sm font-medium text-gray-900">{label}</span>
      </div>
    </button>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={14} className="text-green-400 shrink-0" />
      <div>
        <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
        <p className="font-dm text-sm text-white">{value}</p>
      </div>
    </div>
  );
}