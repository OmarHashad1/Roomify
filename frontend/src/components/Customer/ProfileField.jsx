export default function ProfileField({ label, name, type = "text", icon: Icon, formik, right }) {
  const err = formik.errors[name] && formik.touched[name];
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />}
        <input
          name={name} type={type}
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} ${right ? "pr-10" : "pr-3.5"} py-2.5 text-sm rounded-lg border bg-white outline-none transition-all
            ${err ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus:border-(--color-primary) focus:ring-2 focus:ring-primary/20"}`}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      {err && <p className="text-[11px] text-red-500">{formik.errors[name]}</p>}
    </div>
  );
}
