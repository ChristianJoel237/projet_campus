import { useServerData } from "./useServerData";
import { epargneService } from "../services/epargneService";
import { epargnes as epargnesMock } from "../donnees/donneesFictives";
import { Epargne, TypeEpargne } from "../types/donnees.types";

// ─── Adaptateur : traduit un format brut (mock ou API) vers le type canonique ──
// Toute divergence de nommage entre sources de données se règle ICI,
// jamais dans le composant.

const MAPPING_TYPE_EPARGNE: Record<string, TypeEpargne> = {
    quotidienne: "JOURNALIERE",
    hebdomadaire: "HEBDOMADAIRE",
    // Le mock actuel ne couvre pas ces deux valeurs, mais l'enum réel
    // côté backend Java les inclut — on les mappe en prévision.
    mensuelle: "MENSUELLE",
    aucune: "AUCUNE",
};

function normaliserTypeEpargne(valeurBrute: string): TypeEpargne {
    const cle = valeurBrute.toLowerCase();
    return MAPPING_TYPE_EPARGNE[cle] ?? (valeurBrute.toUpperCase() as TypeEpargne);
}

function adapterEpargne(brut: any): Epargne {
    return {
        id: Number(brut.id),
        utilisateur: brut.utilisateur ?? brut.utilisateurNom ?? undefined,
        typeEpargne: normaliserTypeEpargne(brut.typeEpargne ?? brut.frequence ?? "AUCUNE"),
        solde: Number(brut.solde ?? brut.montant ?? 0),
        nombreDepots: brut.nombreDepots,
        dernierDepot: brut.dernierDepot,
    };
}

export const useEpargnes = () =>
    useServerData<Epargne[]>(
        async () => {
            const reponse = await epargneService.listerTous();
            return (reponse.epargnes ?? []).map(adapterEpargne);
        },
        () => epargnesMock.map(adapterEpargne),
        30_000,
    );
