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

        // Utiliser InvokeLLM avec recherche web pour obtenir les taux actuels depuis meilleurstaux.com
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Va sur le site meilleurstaux.com et récupère les taux d'intérêt immobiliers actuels en France pour un prêt de ${years} ans.
            
            Cherche les informations sur meilleurstaux.com uniquement. Si tu trouves différents profils ou tranches de taux, prends :
            - Le taux le plus bas comme "excellent_rate" (excellent profil)
            - Le taux médian comme "good_rate" (bon profil)  
            - Le taux le plus haut ou moyen comme "average_rate" (profil moyen)
            
            Réponds uniquement avec un objet JSON contenant :
            - excellent_rate : taux pour un excellent profil (en pourcentage, ex: 3.2)
            - good_rate : taux pour un bon profil (en pourcentage, ex: 3.5)
            - average_rate : taux moyen (en pourcentage, ex: 3.8)
            - source : "meilleurstaux.com"
            - date : date de la donnée au format jj/mm/aaaa`,
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