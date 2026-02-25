import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { duration } = await req.json();

        // Convertir la durée en années pour la recherche
        const years = Math.round(duration / 12);

        // Utiliser InvokeLLM avec recherche web pour obtenir les taux actuels
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Quels sont les taux d'intérêt immobiliers moyens actuels en France pour un prêt de ${years} ans ? 
            
            Donne-moi une estimation réaliste basée sur les données actuelles du marché français.
            Réponds uniquement avec un objet JSON contenant les informations suivantes :
            - excellent_rate : taux pour un excellent profil (en pourcentage, ex: 3.2)
            - good_rate : taux pour un bon profil (en pourcentage, ex: 3.5)
            - average_rate : taux moyen (en pourcentage, ex: 3.8)
            - source : source de l'information
            - date : date de la donnée`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    excellent_rate: { type: "number" },
                    good_rate: { type: "number" },
                    average_rate: { type: "number" },
                    source: { type: "string" },
                    date: { type: "string" }
                }
            }
        });

        return Response.json({
            rates: result,
            duration: duration,
            durationYears: years
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});