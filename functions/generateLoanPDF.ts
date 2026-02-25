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
        const fmt = (n) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // En-tête
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('Simulateur de Prêt', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 28, { align: 'center' });

        // Paramètres du prêt
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0);
        doc.text('Paramètres du prêt', 20, 45);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        let y = 55;
        doc.text(`Capital emprunté : ${fmt(capital)} €`, 25, y);
        y += 7;
        doc.text(`Durée : ${duration} mois (${(duration / 12).toFixed(1)} ans)`, 25, y);
        y += 7;
        doc.text(`Taux d'intérêt : ${rate} %`, 25, y);
        y += 7;
        doc.text(`Taux d'assurance : ${insurance} %`, 25, y);

        // Récapitulatif
        y += 15;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Récapitulatif financier', 20, y);

        y += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Mensualité : ${fmt(monthly)} €`, 25, y);
        y += 7;
        doc.text(`TAEG : ${taeg.toFixed(2)} %`, 25, y);
        y += 7;
        doc.text(`Coût total du crédit : ${fmt(totalCost)} €`, 25, y);
        y += 7;
        doc.text(`Intérêts totaux : ${fmt(totalInterest)} €`, 25, y);
        y += 7;
        doc.text(`Assurance totale : ${fmt(totalInsurance)} €`, 25, y);

        // Tableau d'amortissement
        y += 15;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Tableau d\'amortissement', 20, y);

        y += 8;
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        
        // En-têtes du tableau
        const col1 = 20;
        const col2 = 45;
        const col3 = 75;
        const col4 = 105;
        const col5 = 135;
        const col6 = 165;

        doc.text('Mois', col1, y);
        doc.text('Mensualité', col2, y);
        doc.text('Capital', col3, y);
        doc.text('Intérêts', col4, y);
        doc.text('Assurance', col5, y);
        doc.text('Solde', col6, y);

        y += 5;
        doc.setFont(undefined, 'normal');

        // Lignes du tableau
        for (let i = 0; i < schedule.length; i++) {
            const row = schedule[i];
            
            if (y > 270) {
                doc.addPage();
                y = 20;
                
                // Répéter les en-têtes
                doc.setFont(undefined, 'bold');
                doc.text('Mois', col1, y);
                doc.text('Mensualité', col2, y);
                doc.text('Capital', col3, y);
                doc.text('Intérêts', col4, y);
                doc.text('Assurance', col5, y);
                doc.text('Solde', col6, y);
                y += 5;
                doc.setFont(undefined, 'normal');
            }

            doc.text(String(row.month), col1, y);
            doc.text(`${fmt(row.monthly)} €`, col2, y);
            doc.text(`${fmt(row.principalPart)} €`, col3, y);
            doc.text(`${fmt(row.interestPart)} €`, col4, y);
            doc.text(`${fmt(row.insurancePart)} €`, col5, y);
            doc.text(`${fmt(row.remaining)} €`, col6, y);
            
            y += 5;
        }

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