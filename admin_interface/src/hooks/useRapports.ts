// hooks/useRapports.ts
import { useServerData } from "./useServerData";
import { rapportService } from "../services/rapportService";
import { donneesGraphique, credits, transactions, epargnes } from "../donnees/donneesFictives";
import { Credit, Transaction, Epargne } from "../types/donnees.types";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DonneesStatutsCredits {
    nom: string;
    valeur: number;
}

export interface DonneesCanaux {
    canal: string;
    transactions: number;
    montant: number;
}

export interface DonneesEvolution {
    mois: string;
    credits: number;
    epargnes: number;
    transactions: number;
}

export interface RapportResume {
    totalCredits: number;
    totalEpargnes: number;
    totalTransactions: number;
    tauxReussite: number;
    statutsCredits: DonneesStatutsCredits[];
    evolutionMensuelle: DonneesEvolution[];
    canauxPaiement: DonneesCanaux[];
}

// ─── Données fictives calculées (fallback) ────────────────────────────────────
const calculerDonneesFictives = (): RapportResume => {
    const totalCredits = credits.reduce((acc: number, c: Credit) => acc + c.montant, 0);
    const totalEpargnes = epargnes.reduce((acc: number, e: Epargne) => acc + e.solde, 0);
    const totalTransactions = transactions.reduce((acc: number, tx: Transaction) => acc + tx.montant, 0);
    const transactionsReussies = transactions.filter((tx: Transaction) => tx.statut === "reussi").length;
    const tauxReussite = transactions.length > 0 ? Math.round((transactionsReussies / transactions.length) * 100) : 0;

    return {
        totalCredits,
        totalEpargnes,
        totalTransactions,
        tauxReussite,
        statutsCredits: [
            { nom: "Actif", valeur: credits.filter((c: Credit) => c.statut === "en_cours").length },
            { nom: "Remboursé", valeur: credits.filter((c: Credit) => c.statut === "rembourse").length },
            { nom: "En attente", valeur: credits.filter((c: Credit) => c.statut === "en_attente").length },
            { nom: "En retard", valeur: credits.filter((c: Credit) => c.statut === "en_retard").length },
        ],
        evolutionMensuelle: donneesGraphique,
        canauxPaiement: [
            {
                canal: "Orange Money",
                transactions: transactions.filter((tx: Transaction) => tx.canal === "Orange Money").length,
                montant: transactions
                    .filter((tx: Transaction) => tx.canal === "Orange Money")
                    .reduce((acc, tx) => acc + tx.montant, 0),
            },
            {
                canal: "MTN Mobile Money",
                transactions: transactions.filter((tx: Transaction) => tx.canal === "MTN Mobile Money").length,
                montant: transactions
                    .filter((tx: Transaction) => tx.canal === "MTN Mobile Money")
                    .reduce((acc, tx) => acc + tx.montant, 0),
            },
        ],
    };
};

// ─── Hook principal ───────────────────────────────────────────────────────────
export const useRapports = () =>
    useServerData<RapportResume>(async () => rapportService.resume(), calculerDonneesFictives, 30_000);
