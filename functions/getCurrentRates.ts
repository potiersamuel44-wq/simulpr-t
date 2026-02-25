import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { duration } = await req.json();

        // Convertir la durée en années
        const years = Math.round(duration / 12);

        // Taux de référence basés sur la durée (données indicatives février 2026)
        let excellentRate, goodRate, averageRate;

        if (years <= 10) {
            excellentRate = 3.10;
            goodRate = 3.40;
            averageRate = 3.70;
        } else if (years <= 15) {
            excellentRate = 3.30;
            goodRate = 3.60;
            averageRate = 3.90;
        } else if (years <= 20) {
            excellentRate = 3.50;
            goodRate = 3.80;
            averageRate = 4.10;
        } else if (years <= 25) {
            excellentRate = 3.70;
            goodRate = 4.00;
            averageRate = 4.30;
        } else {
            excellentRate = 3.90;
            goodRate = 4.20;
            averageRate = 4.50;
        }

        const result = {
            excellent_rate: excellentRate,
            good_rate: goodRate,
            average_rate: averageRate,
            source: "Taux indicatifs basés sur le marché français",
            date: new Date().toLocaleDateString('fr-FR')
        };

        return Response.json({
            rates: result,
            duration: duration,
            durationYears: years
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});