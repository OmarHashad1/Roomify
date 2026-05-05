import { STATUS_CONFIG } from "@/components/Admin/UsersTable";
import { PageHeader } from "@/components/Admin/PageHeader";

export function UsersHeader({ users }) {
  const counts = {
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    deleted: users.filter((u) => u.status === "deleted").length,
  };

  const stats = Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
    const total = users.length;
    const percent = total === 0 ? 0 : Math.round((counts[key] / total) * 100);

    return {
      label: cfg.label,
      value: counts[key],
      icon: cfg.icon,
      color: cfg.color,
      footer: (
        <div
          className="text-xs font-medium px-2 py-0.5 rounded-full self-start"
          style={{
            backgroundColor: `${cfg.color}15`,
            color: cfg.color,
          }}
        >
          {percent}% of total
        </div>
      ),
    };
  });

  return (
    <PageHeader
      title="Users"
      subtitle="Manage and monitor all platform users across roles and statuses."
      subtitleClassName="text-sm text-white/60 mt-1"
      stats={stats}
      statsGridClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
      statCardProps={{
        cardClassName: "duration-500 min-w-0",
        animationDuration: "0.5s",
      }}
    />
  );
}
