import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingDown, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";

export default function RatesFetcher({ duration, onRateSelect }) {
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState(null);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('getCurrentRates', { duration });
      setRates(response.data.rates);
    } catch (err) {
      setError("Impossible de récupérer les taux actuels");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={fetchRates}
        disabled={loading}
        variant="outline"
        className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-white gap-2"
        size="sm"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Récupération des taux...' : 'Obtenir les taux actuels du marché'}
      </Button>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {rates && (
        <Card className="p-4 bg-slate-800/50 border-slate-700/50 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-2">
                Taux moyens actuels pour {Math.round(duration / 12)} ans
                {rates.source && ` • ${rates.source}`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onRateSelect(rates.excellent_rate)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-green-500/10 border border-green-500/20 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Excellent profil</span>
              </div>
              <span className="text-green-400 font-semibold">{rates.excellent_rate}%</span>
            </button>

            <button
              onClick={() => onRateSelect(rates.good_rate)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-500/10 border border-blue-500/20 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Bon profil</span>
              </div>
              <span className="text-blue-400 font-semibold">{rates.good_rate}%</span>
            </button>

            <button
              onClick={() => onRateSelect(rates.average_rate)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-500/10 border border-amber-500/20 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">Profil moyen</span>
              </div>
              <span className="text-amber-400 font-semibold">{rates.average_rate}%</span>
            </button>
          </div>

          {rates.date && (
            <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700/50">
              Données du {rates.date}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}