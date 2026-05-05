function DashboardStatCard({ icon: Icon, label, value, color, sublabel }) {
  return (
    <div className="bg-white border border-border rounded-lg px-4 sm:px-5 py-4 flex items-center gap-4">
      <div className="rounded-lg p-2.5" style={{ backgroundColor: `${color}18` }}>
        <Icon className="size-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

export default DashboardStatCard;
