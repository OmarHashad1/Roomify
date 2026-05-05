import { Link } from "react-router-dom";

function QuickActionLink({ icon: Icon, label, to, color }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
    >
      <div className="rounded-lg p-2.5" style={{ backgroundColor: `${color}18` }}>
        <Icon className="size-5" style={{ color }} />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </Link>
  );
}

function QuickActionsCard({ actions }) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5 h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs text-muted-foreground">Jump to key management pages</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
        {actions.map((action) => (
          <QuickActionLink key={action.to} {...action} />
        ))}
      </div>
    </div>
  );
}

export default QuickActionsCard;
