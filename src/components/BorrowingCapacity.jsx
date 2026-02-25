import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import RatesFetcher from "@/components/RatesFetcher";

export default function BorrowingCapacity() {
  const [income, setIncome] = useState(3000);
  const [expenses, setExpenses] = useState(500);
  const [debtRatio, setDebtRatio] = useState(33);
  const [loanDuration, setLoanDuration] = useState(240);
  const [interestRate, setInterestRate] = useState(3.5);

  const capacity = useMemo(() => {
    // Capacité mensuelle = (revenus × taux d'endettement) - charges
    const monthlyCapacity = (income * debtRatio / 100) - expenses;
    
    if (monthlyCapacity <= 0) {
      return { monthlyCapacity: 0, maxLoan: 0, valid: false };
    }

    // Calcul du montant empruntable avec formule standard
    const monthlyRate = interestRate / 100 / 12;
    const maxLoan = monthlyCapacity * ((Math.pow(1 + monthlyRate, loanDuration) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, loanDuration)));

    return {
      monthlyCapacity: Math.round(monthlyCapacity * 100) / 100,
      maxLoan: Math.round(maxLoan * 100) / 100,
      valid: true
    };
  }, [income, expenses, debtRatio, loanDuration, interestRate]);

  const fmt = (n) => Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-400" />
          Calculez votre capacité d'emprunt
        </h2>
        <p className="text-slate-400">
          Estimez le montant maximum que vous pouvez emprunter selon vos revenus et charges
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulaire */}
        <div className="space-y-6">
          {/* Revenus mensuels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                Revenus mensuels nets
              </Label>
              <span className="text-lg font-semibold text-white">
                {Number(income).toLocaleString("fr-FR")} €
              </span>
            </div>
            <Slider
              value={[income]}
              onValueChange={([v]) => setIncome(v)}
              min={1000}
              max={15000}
              step={100}
              className="py-2"
            />
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="bg-slate-800/50 border-slate-700 text-white text-right"
              min={0}
            />
          </div>

          {/* Charges mensuelles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-400">
                Charges mensuelles existantes
              </Label>
              <span className="text-lg font-semibold text-white">
                {Number(expenses).toLocaleString("fr-FR")} €
              </span>
            </div>
            <Slider
              value={[expenses]}
              onValueChange={([v]) => setExpenses(v)}
              min={0}
              max={5000}
              step={50}
              className="py-2"
            />
            <Input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="bg-slate-800/50 border-slate-700 text-white text-right"
              min={0}
            />
          </div>

          {/* Taux d'endettement */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-400">
                Taux d'endettement maximum
              </Label>
              <span className="text-lg font-semibold text-white">{debtRatio} %</span>
            </div>
            <Slider
              value={[debtRatio]}
              onValueChange={([v]) => setDebtRatio(v)}
              min={20}
              max={40}
              step={1}
              className="py-2"
            />
            <Input
              type="number"
              value={debtRatio}
              onChange={(e) => setDebtRatio(Number(e.target.value))}
              className="bg-slate-800/50 border-slate-700 text-white text-right"
              min={1}
              max={50}
            />
          </div>

          {/* Durée du prêt */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-400">
                Durée souhaitée
              </Label>
              <span className="text-lg font-semibold text-white">
                {loanDuration} mois
                <span className="text-sm text-slate-500 ml-2">
                  ({(loanDuration / 12).toFixed(1)} ans)
                </span>
              </span>
            </div>
            <Slider
              value={[loanDuration]}
              onValueChange={([v]) => setLoanDuration(v)}
              min={12}
              max={360}
              step={12}
              className="py-2"
            />
            <Input
              type="number"
              value={loanDuration}
              onChange={(e) => setLoanDuration(Number(e.target.value))}
              className="bg-slate-800/50 border-slate-700 text-white text-right"
              min={1}
            />
          </div>

          {/* Taux d'intérêt */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-400">
                Taux d'intérêt estimé
              </Label>
              <span className="text-lg font-semibold text-white">{interestRate} %</span>
            </div>
            <Slider
              value={[interestRate * 100]}
              onValueChange={([v]) => setInterestRate(v / 100)}
              min={100}
              max={800}
              step={10}
              className="py-2"
            />
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="bg-slate-800/50 border-slate-700 text-white text-right"
              min={0.1}
              step={0.1}
            />
            <RatesFetcher duration={loanDuration} onRateSelect={setInterestRate} />
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-4">
          {!capacity.valid ? (
            <Card className="p-6 bg-rose-500/10 border-rose-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-rose-400 mb-1">
                    Capacité d'emprunt insuffisante
                  </h3>
                  <p className="text-sm text-slate-400">
                    Vos charges dépassent votre capacité d'endettement. Réduisez vos charges ou augmentez vos revenus pour emprunter.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:scale-[1.02] transition-transform">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Montant maximum empruntable</h3>
                  </div>
                </div>
                <p className="text-4xl font-bold text-amber-400 mb-1">
                  {fmt(capacity.maxLoan)} €
                </p>
                <p className="text-sm text-slate-400">
                  Sur {loanDuration} mois ({(loanDuration / 12).toFixed(1)} ans) à {interestRate}%
                </p>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-slate-700/50">
                <h3 className="font-semibold text-white mb-4">Détails de votre capacité</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Revenus mensuels</span>
                    <span className="text-white font-semibold">{fmt(income)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Charges actuelles</span>
                    <span className="text-rose-400 font-semibold">- {fmt(expenses)} €</span>
                  </div>
                  <div className="h-px bg-slate-700"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Capacité mensuelle ({debtRatio}%)</span>
                    <span className="text-green-400 font-semibold">{fmt(capacity.monthlyCapacity)} €</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 <strong className="text-blue-400">Bon à savoir :</strong> Les banques recommandent généralement un taux d'endettement maximum de 33%. Cette estimation est indicative et peut varier selon votre profil et votre établissement bancaire.
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}