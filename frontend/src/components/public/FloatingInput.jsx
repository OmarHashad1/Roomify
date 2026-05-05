function FloatingInput({ id, type = "text", label, value, onChange, onBlur, autoComplete, icon: Icon, suffix, error }) {
  return (
    <div className="space-y-1">
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
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={`peer w-full pl-10 pr-11 py-3.5 text-sm rounded-xl border bg-white text-gray-900 outline-none transition-all duration-200
            focus:ring-2
            ${error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-(--color-primary) focus:ring-primary/20"
            }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-10 top-1/2 -translate-y-1/2 text-sm pointer-events-none bg-white px-0.5 transition-all duration-200
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2
            peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-1
            ${error
              ? "text-red-400 peer-focus:text-red-400 peer-[:not(:placeholder-shown)]:text-red-400"
              : "text-gray-400 peer-focus:text-(--color-primary) peer-[:not(:placeholder-shown)]:text-gray-500"
            }`}
        >
          {label}
        </label>
        {suffix}
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

export default FloatingInput;
