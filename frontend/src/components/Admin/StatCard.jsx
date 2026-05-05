import { TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";
import { pctChange } from "@/utils/chartHelpers";

function formatSparklineLabel(point, fallbackLabel) {
  const raw = point?.month ?? point?.name ?? fallbackLabel ?? "";
  if (typeof raw === "string" && /^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en", {
      month: "short",
      year: "numeric",
    });
  }
  return String(raw);
}

function Sparkline({
  data,
  color,
  type = "area",
  height = 56,
  valueLabel = "Count",
}) {
  if (!data || data.length === 0) return null;
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} />
          <Tooltip
            cursor={false}
            contentStyle={{
              fontSize: 11,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
            formatter={(v) => [v, valueLabel]}
            labelFormatter={(label, payload) =>
              formatSparklineLabel(payload?.[0]?.payload, label)
            }
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient
            id={`grad-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace("#", "")})`}
          dot={false}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            fontSize: 11,
            borderRadius: 8,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          formatter={(v) => [v, valueLabel]}
          labelFormatter={(label, payload) =>
            formatSparklineLabel(payload?.[0]?.payload, label)
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  chartData,
  chartType,
  color,
  index = 0,
  to,
  variant = "chart",
  hint,
  iconTint,
  footer,
  chartValueLabel = "Count",
  sparklineHeight = 56,
  animationDuration = "0.4s",
  cardClassName = "",
  contentClassName = "",
  valueClassName = "",
  className = "",
}) {
  const change = variant === "chart" ? pctChange(chartData) : null;
  const positive = change === null || change >= 0;

  const card = (
    <div
      className={`animate-in fade-in slide-in-from-bottom-4 bg-white rounded-2xl p-5 flex-1 min-w-48
        shadow-sm border border-gray-100 flex flex-col gap-3
        hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${to ? "cursor-pointer" : ""} ${cardClassName} ${className}`}
      style={{
        animationDuration,
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
    >
      <div className={`flex items-start justify-between ${contentClassName}`}>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        {Icon ? (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconTint ?? `${color}18` }}
          >
            <Icon
              size={17}
              strokeWidth={2}
              style={{ color: color ?? "#4b5563" }}
            />
          </div>
        ) : null}
      </div>

      <span
        className={`text-3xl font-bold text-gray-800 leading-none ${valueClassName}`}
      >
        {value}
      </span>

      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}

      {footer ? footer : null}

      <div className="h-5">
        {change !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}
          >
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>
              {positive ? "+" : ""}
              {change.toFixed(1)}% vs prev period
            </span>
          </div>
        )}
      </div>

      {variant === "chart" ? (
        <Sparkline
          data={chartData}
          color={color}
          type={chartType}
          height={sparklineHeight}
          valueLabel={chartValueLabel}
        />
      ) : null}
    </div>
  );

  if (to) {
    return <Link to={to}>{card}</Link>;
  }

  return card;
}
