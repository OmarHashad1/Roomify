import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Pencil, X, Check, User, Mail, Phone, Loader2 } from "lucide-react";
import ProfileField from "@/components/Customer/ProfileField";

export default function PersonalDetailsPage() {
  const { editing, setEditing, saved, formik } = useOutletContext();

  const profileCards = [
    {
      label: "First Name",
      value: saved?.firstName,
      icon: <User size={15} />,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Last Name",
      value: saved?.lastName,
      icon: <User size={15} />,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Email Address",
      value: saved?.email,
      icon: <Mail size={15} />,
      color: "bg-amber-50 text-amber-500",
    },
    {
      label: "Phone Number",
      value: saved?.phone,
      icon: <Phone size={15} />,
      color: "bg-green-50 text-green-500",
    },
  ];

  const cancel = useCallback(() => {
    formik.resetForm();
    setEditing(false);
  }, [formik, setEditing]);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="relative h-20 bg-linear-to-r from-(--color-primary) to-[#1a6a96]">
        <div className="absolute -bottom-6 left-6">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
            <User size={20} className="text-(--color-primary)" />
          </div>
        </div>
        <div className="absolute top-3 right-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all"
            >
              <Pencil size={12} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => formik.handleSubmit()}
                disabled={
                  !formik.isValid || !formik.dirty || formik.isSubmitting
                }
                className={`flex items-center gap-1.5 text-xs font-semibold bg-white text-(--color-primary) px-3 py-1.5 rounded-lg transition-all shadow-sm ${
                  !formik.isValid || !formik.dirty || formik.isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/90"
                }`}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Check size={12} /> Save
                  </>
                )}
              </button>
              <button
                onClick={cancel}
                disabled={formik.isSubmitting}
                className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <h2 className="font-bold text-gray-900 text-base">Personal Details</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">
          Your profile information
        </p>

        {(saved?.age || saved?.nationality) && (
          <div className="mt-3 mb-6 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-4 text-[11px]">
            {saved?.age && (
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold uppercase tracking-wide text-gray-400">
                  Age
                </span>
                <span className="text-gray-600">{saved.age}</span>
              </div>
            )}
            {saved?.age && saved?.nationality && (
              <span className="text-gray-300">•</span>
            )}
            {saved?.nationality && (
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="font-semibold uppercase tracking-wide text-gray-400">
                  Nationality
                </span>
                <span className="text-gray-600 truncate">
                  {saved.nationality}
                </span>
              </div>
            )}
          </div>
        )}

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileCards.map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                    {value || (
                      <span className="text-gray-300 italic font-normal text-xs">
                        Not set
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField
              label="First Name"
              name="firstName"
              icon={User}
              formik={formik}
            />
            <ProfileField
              label="Last Name"
              name="lastName"
              icon={User}
              formik={formik}
            />
            <ProfileField
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              formik={formik}
            />
            <ProfileField
              label="Phone Number"
              name="phone"
              type="tel"
              icon={Phone}
              formik={formik}
            />
          </div>
        )}
      </div>
    </div>
  );
}
