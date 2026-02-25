import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import LoanForm from "@/components/LoanForm";
import LoanSummary from "@/components/LoanSummary";
import AmortizationChart from "@/components/AmortizationChart";
import AmortizationTable from "@/components/AmortizationTable";

function calculateLoan(capital, durationMonths, annualRate) {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthly = capital / durationMonths;
    const schedule = [];
    let remaining = capital;
    for (let i = 1; i <= durationMonths; i++) {
      remaining -= monthly;
      schedule.push({
        month: i,
        monthly,
        principalPart: monthly,
        interestPart: 0,
        remaining: Math.max(remaining, 0),
      });
    }
    return { monthly, totalCost: capital, totalInterest: 0, schedule };
  }

  const monthly =
    (capital * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1);

  const schedule = [];
  let remaining = capital;

  for (let i = 1; i <= durationMonths; i++) {
    const interestPart = remaining * monthlyRate;
    const principalPart = monthly - interestPart;
    remaining -= principalPart;
    schedule.push({
      month: i,
      monthly,
      principalPart,
      interestPart,
      remaining: Math.max(remaining, 0),
    });
  }

  const totalCost = monthly * durationMonths;
  const totalInterest = totalCost - capital;

  return { monthly, totalCost, totalInterest, schedule };
}

export default function Home() {
  const [capital, setCapital] = useState(200000);
  const [duration, setDuration] = useState(240);
  const [rate, setRate] = useState(3.5);

  const { monthly, totalCost, totalInterest, schedule } = useMemo(
    () => calculateLoan(capital, duration, rate),
    [capital, duration, rate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs uppercase tracking-widest mb-6">
            Simulateur financier
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Calculateur de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Prêt</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Estimez vos mensualités et visualisez votre plan de remboursement
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 md:p-8"
          >
            <h2 className="text-white font-semibold text-lg mb-6">Paramètres du prêt</h2>
            <LoanForm
              capital={capital}
              setCapital={setCapital}
              duration={duration}
              setDuration={setDuration}
              rate={rate}
              setRate={setRate}
            />
          </motion.div>

          {/* Right: Summary + Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            <LoanSummary
              monthly={monthly}
              totalCost={totalCost}
              totalInterest={totalInterest}
            />
            <AmortizationChart schedule={schedule} />
          </motion.div>
        </div>

        {/* Amortization Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AmortizationTable schedule={schedule} />
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-12">
          Simulation indicative — Consultez un conseiller financier pour un engagement contractuel
        </p>
      </div>
    </div>
  );
}