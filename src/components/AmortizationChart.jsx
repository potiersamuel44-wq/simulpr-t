import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AmortizationChart({ schedule }) {
  const data = schedule.map((row) => ({
    mois: row.month,
    capital: Math.round(row.principalPart * 100) / 100,
    intérêts: Math.round(row.interestPart * 100) / 100,
    solde: Math.round(row.remaining * 100) / 100,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1.5 font-medium">Mois {label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}</span>
            <span className="font-semibold">{Number(entry.value).toLocaleString("fr-FR")} €</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6">
      <h3 className="text-white font-semibold mb-6">Évolution du remboursement</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="mois" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1).toLocaleString("fr-FR")}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="capital" name="Capital" stroke="#f59e0b" fill="url(#colorCapital)" strokeWidth={2} />
            <Area type="monotone" dataKey="intérêts" name="Intérêts" stroke="#f43f5e" fill="url(#colorInterest)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}