import { useContext, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { LogContext } from "@/context/log/LogContext";
import { PageHeader } from "@/components/Admin/PageHeader";
import { LogsFilters } from "@/components/Admin/LogsFilters";
import { LogsActivityList } from "@/components/Admin/LogsActivityList";

function AdminLogs() {
  const {
    logs = [],
    summary = {},
    loading,
    error,
  } = useContext(LogContext) || {};
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return sortedLogs.filter((log) => {
      const matchesLevel = level === "all" || log.level === level;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        log.action.toLowerCase().includes(q) ||
        (log.message || "").toLowerCase().includes(q) ||
        (log.targetId || "").toLowerCase().includes(q) ||
        (log.actor?.type || "").toLowerCase().includes(q) ||
        (log.actor?.id
          ? String(log.actor.id).toLowerCase().includes(q)
          : false);

      return matchesLevel && matchesQuery;
    });
  }, [sortedLogs, level, query]);

  const counts = useMemo(() => {
    return {
      total: summary.logCount ?? 0,
      info: summary.infoCount ?? 0,
      warn: summary.warnCount ?? 0,
      error: summary.errorCount ?? 0,
      shownTotal: summary.shownLogCount ?? logs.length,
      shownInfo: summary.shownInfoCount ?? 0,
      shownWarn: summary.shownWarnCount ?? 0,
      shownError: summary.shownErrorCount ?? 0,
      filtered: filteredLogs.length,
    };
  }, [summary, logs.length, filteredLogs.length]);

  const stats = [
    {
      label: "Total Events",
      value: counts.total,
      hint: `Showing ${counts.shownTotal} most recent`,
      icon: ShieldCheck,
      color: "#4b5563",
      iconTint: "#ffffff33",
    },
    {
      label: "Info",
      value: counts.info,
      hint: `Showing ${counts.shownInfo} most recent`,
      icon: CheckCircle2,
      color: "#0369a1",
      iconTint: "#7dd3fc55",
    },
    {
      label: "Warnings",
      value: counts.warn,
      hint: `Showing ${counts.shownWarn} most recent`,
      icon: AlertTriangle,
      color: "#b45309",
      iconTint: "#fcd34d55",
    },
    {
      label: "Errors",
      value: counts.error,
      hint: `Showing ${counts.shownError} most recent`,
      icon: ShieldAlert,
      color: "#be123c",
      iconTint: "#fb718555",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <AlertCircle size={32} className="text-gray-200" />
        <p className="text-sm font-semibold text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        subtitle="The most recent 40 errors, 20 warnings, and 10 info events — newest first."
        stats={stats}
      />

      <LogsFilters
        query={query}
        onQueryChange={setQuery}
        level={level}
        onLevelChange={setLevel}
        filteredCount={counts.filtered}
        totalCount={counts.total}
      />

      <LogsActivityList logs={filteredLogs} />
    </div>
  );
}

export default AdminLogs;
