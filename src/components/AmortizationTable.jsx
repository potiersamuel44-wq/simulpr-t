import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AmortizationTable({ schedule }) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? schedule : schedule.slice(0, 12);
  const fmt = (n) => Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="text-white font-semibold">Tableau d'amortissement</h3>
        <p className="text-slate-500 text-sm mt-1">Détail mois par mois</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-transparent">
              <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Mois</TableHead>
              <TableHead className="text-slate-400 text-xs uppercase tracking-wider text-right">Mensualité</TableHead>
              <TableHead className="text-slate-400 text-xs uppercase tracking-wider text-right">Capital</TableHead>
              <TableHead className="text-slate-400 text-xs uppercase tracking-wider text-right">Intérêts</TableHead>
              <TableHead className="text-slate-400 text-xs uppercase tracking-wider text-right">Solde restant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((row) => (
              <TableRow key={row.month} className="border-slate-700/30 hover:bg-slate-800/50">
                <TableCell className="text-white font-medium">{row.month}</TableCell>
                <TableCell className="text-white text-right">{fmt(row.monthly)} €</TableCell>
                <TableCell className="text-amber-400 text-right">{fmt(row.principalPart)} €</TableCell>
                <TableCell className="text-rose-400 text-right">{fmt(row.interestPart)} €</TableCell>
                <TableCell className="text-slate-300 text-right">{fmt(row.remaining)} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {schedule.length > 12 && (
        <div className="p-4 flex justify-center border-t border-slate-700/30">
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white gap-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Réduire
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Voir les {schedule.length - 12} mois restants
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}