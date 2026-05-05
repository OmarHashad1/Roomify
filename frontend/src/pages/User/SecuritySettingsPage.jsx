import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ShieldCheck, Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";

export default function SecuritySettingsPage() {
  const { pwFormik } = useOutletContext();
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="relative h-20 bg-linear-to-r from-(--color-primary) to-[#1a6a96]">
        <div className="absolute -bottom-6 left-6">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
            <ShieldCheck size={20} className="text-(--color-primary)" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <h2 className="font-bold text-gray-900 text-base">
          Security Settings
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          Keep your account safe with a strong password
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {[
              {
                key: "currentPassword",
                label: "Current Password",
                showKey: "current",
              },
              {
                key: "newPassword",
                label: "New Password",
                showKey: "new",
              },
              {
                key: "confirmPassword",
                label: "Confirm New Password",
                showKey: "confirm",
              },
            ].map(({ key, label, showKey }) => {
              const err = pwFormik.errors[key] && pwFormik.touched[key];
              return (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    {label}
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border transition-all
                    ${err ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus-within:border-(--color-primary) focus-within:ring-2 focus-within:ring-primary/15"}`}
                  >
                    <Lock
                      size={14}
                      className={`shrink-0 ${err ? "text-red-400" : "text-gray-300"}`}
                    />
                    <input
                      name={key}
                      type={show[showKey] ? "text" : "password"}
                      value={pwFormik.values[key]}
                      onChange={pwFormik.handleChange}
                      onBlur={pwFormik.handleBlur}
                      placeholder="********"
                      className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShow((s) => ({
                          ...s,
                          [showKey]: !s[showKey],
                        }))
                      }
                      className={`shrink-0 transition-colors ${err ? "text-red-300 hover:text-red-400" : "text-gray-300 hover:text-gray-500"}`}
                    >
                      {show[showKey] ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                  {err && (
                    <p className="text-[11px] text-red-500">
                      {pwFormik.errors[key]}
                    </p>
                  )}
                  {key === "newPassword" && !err && (() => {
                    const pw = pwFormik.values.newPassword;
                    const score =
                      (pw.length >= 8 ? 1 : 0) +
                      (/[A-Z]/.test(pw) ? 1 : 0) +
                      (/[0-9]/.test(pw) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
                    const colors = [
                      "bg-red-400",
                      "bg-orange-400",
                      "bg-yellow-400",
                      "bg-green-500",
                    ];
                    return (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score - 1] || "bg-gray-200" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Min 8 characters
                        </p>
                      </div>
                    );
                  })()}
                </div>
              );
            })}

            <button
              onClick={() => pwFormik.handleSubmit()}
              disabled={
                !pwFormik.isValid || !pwFormik.dirty || pwFormik.isSubmitting
              }
              className="w-full bg-(--color-primary) text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
            >
              {pwFormik.isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Update Password
                </>
              )}
            </button>
          </div>

          <div className="w-full lg:w-52 shrink-0 space-y-3">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-xs font-bold text-(--color-primary) mb-2">
                Password tips
              </p>
              <ul className="space-y-1.5">
                {[
                  "At least 8 characters",
                  "One uppercase letter",
                  "One number",
                  "Avoid personal info",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-[11px] text-gray-500"
                  >
                    <Check
                      size={11}
                      className="text-(--color-primary) mt-0.5 shrink-0"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-600 mb-1">
                Remember
              </p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Never share your password with anyone, including support
                staff.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
