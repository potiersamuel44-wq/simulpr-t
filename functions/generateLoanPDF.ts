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
        
        // Configuration de l'encodage pour supporter les accents
        doc.setFont('helvetica');
        
        const fmt = (n) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // En-tête
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Simulateur de Pret', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, 105, 28, { align: 'center' });

        // Paramètres du prêt
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('Parametres du pret', 20, 45);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let y = 55;
        doc.text(`Capital emprunte : ${fmt(capital)} EUR`, 25, y);
        y += 7;
        doc.text(`Duree : ${duration} mois (${(duration / 12).toFixed(1)} ans)`, 25, y);
        y += 7;
        doc.text(`Taux d'interet : ${rate} %`, 25, y);
        y += 7;
        doc.text(`Taux d'assurance : ${insurance} %`, 25, y);

        // Récapitulatif
        y += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recapitulatif financier', 20, y);

        y += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Mensualite : ${fmt(monthly)} EUR`, 25, y);
        y += 7;
        doc.text(`TAEG : ${taeg.toFixed(2)} %`, 25, y);
        y += 7;
        doc.text(`Cout total du credit : ${fmt(totalCost)} EUR`, 25, y);
        y += 7;
        doc.text(`Interets totaux : ${fmt(totalInterest)} EUR`, 25, y);
        y += 7;
        doc.text(`Assurance totale : ${fmt(totalInsurance)} EUR`, 25, y);

        // Tableau d'amortissement
        y += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tableau d\'amortissement', 20, y);

        y += 8;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        
        // En-têtes du tableau
        const col1 = 20;
        const col2 = 45;
        const col3 = 75;
        const col4 = 105;
        const col5 = 135;
        const col6 = 165;

        doc.text('Mois', col1, y);
        doc.text('Mensualite', col2, y);
        doc.text('Capital', col3, y);
        doc.text('Interets', col4, y);
        doc.text('Assurance', col5, y);
        doc.text('Solde', col6, y);

        y += 5;
        doc.setFont('helvetica', 'normal');

        // Lignes du tableau
        for (let i = 0; i < schedule.length; i++) {
            const row = schedule[i];
            
            if (y > 270) {
                doc.addPage();
                y = 20;
                
                // Répéter les en-têtes
                doc.setFont('helvetica', 'bold');
                doc.text('Mois', col1, y);
                doc.text('Mensualite', col2, y);
                doc.text('Capital', col3, y);
                doc.text('Interets', col4, y);
                doc.text('Assurance', col5, y);
                doc.text('Solde', col6, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
            }

            doc.text(String(row.month), col1, y);
            doc.text(`${fmt(row.monthly)} EUR`, col2, y);
            doc.text(`${fmt(row.principalPart)} EUR`, col3, y);
            doc.text(`${fmt(row.interestPart)} EUR`, col4, y);
            doc.text(`${fmt(row.insurancePart)} EUR`, col5, y);
            doc.text(`${fmt(row.remaining)} EUR`, col6, y);
            
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