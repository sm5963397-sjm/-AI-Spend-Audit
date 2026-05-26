"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const chartColors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#22D3EE"];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#F9FAFB"
};

export function AuditCharts({
  spendDistribution,
  savingsData
}: {
  spendDistribution: Array<{ name: string; value: number }>;
  savingsData: Array<{ name: string; savings: number }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">Spend distribution</p>
        <div className="mt-3 h-52 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={spendDistribution} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={4}>
                {spendDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Spend"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">Optimization impact</p>
        <div className="mt-3 h-52 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={savingsData}>
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Savings"]} />
              <Bar dataKey="savings" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
