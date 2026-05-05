import { StatCard } from "@/components/Admin/StatCard";

export function PageHeader({
  title,
  subtitle,
  stats = [],
  backgroundColor = "var(--color-primary)",
  className = "",
  subtitleClassName = "text-sm text-white/70 mt-1",
  statsGridClassName = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
  statCardVariant = "simple",
  statCardProps = {},
  children,
}) {
  return (
    <div
      className={`rounded-2xl px-8 py-6 space-y-6 ${className}`}
      style={{ backgroundColor }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
      </div>

      {stats.length > 0 ? (
        <div className={statsGridClassName}>
          {stats.map((stat, i) => (
            <StatCard
              key={`${stat.label}-${i}`}
              variant={statCardVariant}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              icon={stat.icon}
              color={stat.color}
              iconTint={stat.iconTint}
              index={i}
              {...statCardProps}
              {...stat}
            />
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}
