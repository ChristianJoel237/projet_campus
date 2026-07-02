import { useServerData } from "./useServerData";
import { creditService, Credit as CreditApi } from "../services/creditService";
import { credits } from "../donnees/donneesFictives";
import { Credit } from "../types/donnees.types";

const mapperCredit = (c: CreditApi): Credit => ({
    id: Number(c.id),
    utilisateur: c.utilisateurNom ?? c.utilisateurId,
    utilisateurId: c.utilisateurId,
    montant: c.montant,
    taux: c.taux,
    duree: c.duree,
    dateEcheance: c.dateEcheance,
    statut: c.statut,
    remboursement: c.remboursement ?? 0,
});

export const useCredits = () =>
    useServerData<Credit[]>(
        async () => {
            const reponse = await creditService.listerTous();
            return reponse.credits.map(mapperCredit);
        },
        () => credits,
        30_000,
    );
