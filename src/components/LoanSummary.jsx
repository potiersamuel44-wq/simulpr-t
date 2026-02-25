import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, CircleDollarSign } from "lucide-react";

function SummaryCard({ label, value, icon: Icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6 ${color}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-opacity-20 ${color}`}>
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
      </div>
    </motion.div>
  );
}

export default function LoanSummary({ monthly, totalCost, totalInterest }) {
  const fmt = (n) => Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        label="Mensualité"
        value={`${fmt(monthly)} €`}
        icon={Wallet}
        color="bg-amber-500"
        delay={0}
      />
      <SummaryCard
        label="Coût total du crédit"
        value={`${fmt(totalCost)} €`}
        icon={CircleDollarSign}
        color="bg-emerald-500"
        delay={0.1}
      />
      <SummaryCard
        label="Intérêts totaux"
        value={`${fmt(totalInterest)} €`}
        icon={TrendingUp}
        color="bg-rose-500"
        delay={0.2}
      />
    </div>
  );
}