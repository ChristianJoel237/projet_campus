import { api } from "./apiConfig";
import { DashboardData } from "../types/donnees.types";
import { RapportResume } from "../hooks/useRapports";

// ============================================
// TYPES
// ============================================

export interface Statistiques {
    totalUtilisateurs: number;
    creditsActifs: number;
    epargnesActives: number;
    transactionsAujourdhui: number;
    revenusTotal: number;
    tauxRemboursement: number;
}

export interface DonneesEvolution {
    mois: string;
    credits: number;
    epargnes: number;
    transactions: number;
}

export interface ReponseEvolution {
    donnees: DonneesEvolution[];
}

export interface CreditParStatut {
    nom: string;
    valeur: number;
}

export interface ReponseCreditsParStatut {
    donnees: CreditParStatut[];
}

export interface CanalPaiement {
    canal: string;
    transactions: number;
    montant: number;
}

export interface ReponseCanauxPaiement {
    donnees: CanalPaiement[];
}

export interface Indicateurs {
    tauxRemboursement: number;
    tauxReussite: number;
    epargneReguliere: number;
    creditsEnRetard: number;
}

export interface ParamsEvolution {
    mois?: number;
}

// ============================================
// SERVICE
// ============================================

export const rapportService = {
    statistiques: (): Promise<Statistiques> => api.get<Statistiques>("/rapports/statistiques"),

    evolution: (mois: number = 6): Promise<ReponseEvolution> =>
        api.get<ReponseEvolution>(`/rapports/evolution?mois=${mois}`),

    creditsParStatut: (): Promise<ReponseCreditsParStatut> =>
        api.get<ReponseCreditsParStatut>("/rapports/credits-statuts"),

    dashboard: (): Promise<DashboardData> => api.get<DashboardData>("/rapports/dashboard"),

    canauxPaiement: (): Promise<ReponseCanauxPaiement> => api.get<ReponseCanauxPaiement>("/rapports/canaux"),

    indicateurs: (): Promise<Indicateurs> => api.get<Indicateurs>("/rapports/indicateurs"),

    resume: (): Promise<RapportResume> => api.get<RapportResume>("/rapports/resume"),

    // Exports (Utilisent fetch natif pour gérer le blob/téléchargement)
    exporterPDF: async (): Promise<void> => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rapports/export/pdf`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Échec export PDF");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport_${new Date().toISOString().split("T")[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    },

    exporterCSV: async (): Promise<void> => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rapports/export/csv`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Échec export CSV");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },
};

export default rapportService;
