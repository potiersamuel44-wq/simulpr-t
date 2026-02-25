import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.2';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { capital, duration, rate, insurance, monthly, totalCost, totalInterest, totalInsurance, taeg, schedule } = await req.json();

        const doc = new jsPDF();
        doc.setFont('helvetica');
        
        // Format numbers without special characters
        const fmt = (n) => {
            const parts = Number(n).toFixed(2).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            return parts.join(',');
        };

        // Fond d'en-tête avec dégradé simulé
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 50, 'F');
        
        // Badge "Simulateur financier"
        doc.setFillColor(245, 158, 11, 0.1); // amber transparent
        doc.setDrawColor(245, 158, 11, 0.3);
        doc.roundedRect(75, 12, 60, 6, 2, 2, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(245, 158, 11); // amber-400
        doc.setFont('helvetica', 'bold');
        doc.text('SIMULATEUR FINANCIER', 105, 16, { align: 'center' });
        
        // Titre principal
        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Calculateur de ', 105, 28, { align: 'center' });
        doc.setTextColor(251, 191, 36); // amber-400
        doc.text('Pret', 105, 37, { align: 'center' });
        
        // Date
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.setFont('helvetica', 'normal');
        doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, 105, 44, { align: 'center' });

        // Carte "Paramètres du prêt"
        let y = 58;
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.roundedRect(15, y, 85, 42, 3, 3, 'FD');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('Parametres du pret', 20, y + 8);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // slate-600
        
        y += 16;
        doc.setFont('helvetica', 'bold');
        doc.text('Capital emprunte', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${fmt(capital)} EUR`, 70, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Duree', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${duration} mois (${(duration / 12).toFixed(1)} ans)`, 70, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Taux d\'interet', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${rate} %`, 70, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Taux d\'assurance', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${insurance} %`, 70, y);

        // Carte "Récapitulatif"
        y = 58;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(110, y, 85, 42, 3, 3, 'FD');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Recapitulatif financier', 115, y + 8);
        
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        
        y += 16;
        doc.setFont('helvetica', 'bold');
        doc.text('Mensualite', 115, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${fmt(monthly)} EUR`, 165, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('TAEG', 115, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${taeg.toFixed(2)} %`, 165, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Cout total', 115, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${fmt(totalCost)} EUR`, 165, y);
        
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Interets', 115, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${fmt(totalInterest)} EUR`, 165, y);

        // Section "Tableau d'amortissement"
        y = 108;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Tableau d\'amortissement', 15, y);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFont('helvetica', 'normal');
        doc.text('Detail mois par mois', 15, y + 5);

        y += 12;
        
        // En-tête du tableau avec fond
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(15, y - 3, 180, 7, 'F');
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105); // slate-600
        
        const col1 = 18;
        const col2 = 38;
        const col3 = 70;
        const col4 = 100;
        const col5 = 130;
        const col6 = 165;

        doc.text('MOIS', col1, y + 1);
        doc.text('MENSUALITE', col2, y + 1);
        doc.text('CAPITAL', col3, y + 1);
        doc.text('INTERETS', col4, y + 1);
        doc.text('ASSURANCE', col5, y + 1);
        doc.text('SOLDE RESTANT', col6, y + 1);

        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85); // slate-700

        // Lignes du tableau
        for (let i = 0; i < schedule.length; i++) {
            const row = schedule[i];
            
            if (y > 275) {
                doc.addPage();
                y = 20;
                
                // Répéter les en-têtes
                doc.setFillColor(248, 250, 252);
                doc.rect(15, y - 3, 180, 7, 'F');
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(71, 85, 105);
                doc.text('MOIS', col1, y + 1);
                doc.text('MENSUALITE', col2, y + 1);
                doc.text('CAPITAL', col3, y + 1);
                doc.text('INTERETS', col4, y + 1);
                doc.text('ASSURANCE', col5, y + 1);
                doc.text('SOLDE RESTANT', col6, y + 1);
                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(51, 65, 85);
            }

            // Alternance de fond pour les lignes
            if (i % 2 === 0) {
                doc.setFillColor(249, 250, 251); // gray-50
                doc.rect(15, y - 2.5, 180, 4.5, 'F');
            }

            doc.setFontSize(7);
            doc.text(String(row.month), col1, y);
            doc.text(`${fmt(row.monthly)}`, col2, y);
            
            // Capital en amber
            doc.setTextColor(245, 158, 11);
            doc.text(`${fmt(row.principalPart)}`, col3, y);
            
            // Intérêts en rose
            doc.setTextColor(244, 63, 94);
            doc.text(`${fmt(row.interestPart)}`, col4, y);
            
            // Assurance en bleu
            doc.setTextColor(59, 130, 246);
            doc.text(`${fmt(row.insurancePart)}`, col5, y);
            
            // Solde en gris
            doc.setTextColor(100, 116, 139);
            doc.text(`${fmt(row.remaining)}`, col6, y);
            
            doc.setTextColor(51, 65, 85);
            y += 4.5;
        }
        
        // Footer
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('Simulation indicative - Consultez un conseiller financier pour un engagement contractuel', 105, 285, { align: 'center' });

        const pdfBytes = doc.output('arraybuffer');

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=simulation-pret-${new Date().toISOString().split('T')[0]}.pdf`
            }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});