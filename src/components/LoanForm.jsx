import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Banknote, Clock, Percent, Shield } from "lucide-react";
import RatesFetcher from "@/components/RatesFetcher";

export default function LoanForm({ capital, setCapital, duration, setDuration, rate, setRate, insurance, setInsurance }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-amber-400" />
            Capital emprunté
          </Label>
          <span className="text-lg font-semibold text-white">
            {Number(capital).toLocaleString("fr-FR")} €
          </span>
        </div>
        <Slider
          value={[capital]}
          onValueChange={([v]) => setCapital(v)}
          min={5000}
          max={1000000}
          step={5000}
          className="py-2"
        />
        <Input
          type="number"
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          className="bg-slate-800/50 border-slate-700 text-white text-right"
          min={1000}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Durée
          </Label>
          <span className="text-lg font-semibold text-white">
            {duration} mois
            <span className="text-sm text-slate-500 ml-2">
              ({(duration / 12).toFixed(1)} ans)
            </span>
          </span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          min={6}
          max={360}
          step={6}
          className="py-2"
        />
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="bg-slate-800/50 border-slate-700 text-white text-right"
          min={1}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400" />
            Taux d'intérêt annuel
          </Label>
          <span className="text-lg font-semibold text-white">{rate} %</span>
        </div>
        <Slider
          value={[rate * 100]}
          onValueChange={([v]) => setRate(v / 100)}
          min={10}
          max={1500}
          step={5}
          className="py-2"
        />
        <Input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="bg-slate-800/50 border-slate-700 text-white text-right"
          min={0.01}
          step={0.01}
        />
        <RatesFetcher duration={duration} onRateSelect={setRate} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Taux d'assurance annuel
          </Label>
          <span className="text-lg font-semibold text-white">{insurance} %</span>
        </div>
        <Slider
          value={[insurance * 100]}
          onValueChange={([v]) => setInsurance(v / 100)}
          min={0}
          max={100}
          step={1}
          className="py-2"
        />
        <Input
          type="number"
          value={insurance}
          onChange={(e) => setInsurance(Number(e.target.value))}
          className="bg-slate-800/50 border-slate-700 text-white text-right"
          min={0}
          step={0.01}
        />
      </div>
    </div>
  );
}