import { Logs } from "lucide-react";

const LEVEL_STYLES = {
  info: {
    label: "Info",
    pill: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
  },
  warn: {
    label: "Warning",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  error: {
    label: "Error",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

function formatDate(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LogsActivityList({ logs }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Recent Activity
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {logs.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">
            <Logs size={32} className="mx-auto mb-2 opacity-30" />
            No logs found
          </div>
        ) : (
          logs.slice(0, 50).map((log) => {
            const levelStyle = LEVEL_STYLES[log.level] || LEVEL_STYLES.info;

            return (
              <div key={log._id} className="px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${levelStyle.dot}`}
                      />
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${levelStyle.pill}`}
                      >
                        {levelStyle.label}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {log.action}
                      </span>
                      {log.targetModel ? (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50">
                          {log.targetModel}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-gray-700 wrap-break-word">
                      {log.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>ID: {log._id}</span>
                      {log.targetId ? (
                        <span>Target: {log.targetId}</span>
                      ) : null}
                      {log.ip ? <span>IP: {log.ip}</span> : null}
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 shrink-0">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
