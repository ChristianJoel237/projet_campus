import { api } from "./apiConfig";
<<<<<<< HEAD
=======
import { DashboardData } from "../types/donnees.types";
import { RapportResume } from "../hooks/useRapports";
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)

// ============================================
// TYPES
// ============================================

// Types pour les statistiques
export interface Statistiques {
<<<<<<< HEAD
  totalUtilisateurs: number;
  creditsActifs: number;
  epargnesActives: number;
  transactionsAujourdhui: number;
  revenusTotal: number;
  tauxRemboursement: number;
=======
    totalUtilisateurs: number;
    creditsActifs: number;
    epargnesActives: number;
    transactionsAujourdhui: number;
    revenusTotal: number;
    tauxRemboursement: number;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour l'évolution
export interface DonneesEvolution {
<<<<<<< HEAD
  mois: string;
  credits: number;
  epargnes: number;
  transactions: number;
}

export interface ReponseEvolution {
  donnees: DonneesEvolution[];
=======
    mois: string;
    credits: number;
    epargnes: number;
    transactions: number;
}

export interface ReponseEvolution {
    donnees: DonneesEvolution[];
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour les crédits par statut
export interface CreditParStatut {
<<<<<<< HEAD
  nom: string;
  valeur: number;
}

export interface ReponseCreditsParStatut {
  donnees: CreditParStatut[];
=======
    nom: string;
    valeur: number;
}

export interface ReponseCreditsParStatut {
    donnees: CreditParStatut[];
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour les canaux de paiement
export interface CanalPaiement {
<<<<<<< HEAD
  canal: string;
  transactions: number;
  montant: number;
}

export interface ReponseCanauxPaiement {
  donnees: CanalPaiement[];
=======
    canal: string;
    transactions: number;
    montant: number;
}

export interface ReponseCanauxPaiement {
    donnees: CanalPaiement[];
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour les indicateurs
export interface Indicateurs {
<<<<<<< HEAD
  tauxRemboursement: number;
  tauxReussite: number;
  epargneReguliere: number;
  creditsEnRetard: number;
=======
    tauxRemboursement: number;
    tauxReussite: number;
    epargneReguliere: number;
    creditsEnRetard: number;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour les paramètres d'évolution
export interface ParamsEvolution {
<<<<<<< HEAD
  mois?: number;
}

=======
    mois?: number;
}

// Note : RapportResume n'est plus défini ici.
// Il vient de hooks/useRapports.ts, qui est la source de vérité
// pour la forme des données affichées par la page Rapports.
// Quand le backend sera prêt, vérifie que GET /api/rapports/resume
// renvoie bien : totalCredits, totalEpargnes, totalTransactions,
// tauxReussite, statutsCredits, evolutionMensuelle, canauxPaiement.

>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
// ============================================
// SERVICE
// ============================================

export const rapportService = {
<<<<<<< HEAD

  /**
   * Statistiques générales du dashboard
   * GET /api/rapports/statistiques
   * @returns Statistiques pour le tableau de bord
   */
  statistiques: (): Promise<Statistiques> =>
    api.get<Statistiques>("/rapports/statistiques"),

  /**
   * Données graphique évolution (6 mois)
   * GET /api/rapports/evolution?mois=6
   * @param mois - Nombre de mois à afficher (défaut: 6)
   * @returns Données d'évolution par mois
   */
  evolution: (mois: number = 6): Promise<ReponseEvolution> =>
    api.get<ReponseEvolution>(`/rapports/evolution?mois=${mois}`),

  /**
   * Répartition crédits par statut
   * GET /api/rapports/credits-statuts
   * @returns Répartition des crédits par statut
   */
  creditsParStatut: (): Promise<ReponseCreditsParStatut> =>
    api.get<ReponseCreditsParStatut>("/rapports/credits-statuts"),

  /**
   * Répartition par canal de paiement
   * GET /api/rapports/canaux
   * @returns Répartition des transactions par canal
   */
  canauxPaiement: (): Promise<ReponseCanauxPaiement> =>
    api.get<ReponseCanauxPaiement>("/rapports/canaux"),

  /**
   * Indicateurs de performance
   * GET /api/rapports/indicateurs
   * @returns Indicateurs clés de performance
   */
  indicateurs: (): Promise<Indicateurs> =>
    api.get<Indicateurs>("/rapports/indicateurs"),

  /**
   * Exporter rapport PDF
   * GET /api/rapports/export/pdf
   * @returns Télécharge le fichier PDF
   */
  exporterPDF: async (): Promise<void> => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await fetch(`${apiUrl}/rapports/export/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport_${new Date().toISOString().split("T")[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Exporter rapport CSV
   * GET /api/rapports/export/csv
   * @returns Télécharge le fichier CSV
   */
  exporterCSV: async (): Promise<void> => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await fetch(`${apiUrl}/rapports/export/csv`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
=======
    /**
     * Statistiques générales du dashboard
     * GET /api/rapports/statistiques
     * @returns Statistiques pour le tableau de bord
     */
    statistiques: (): Promise<Statistiques> => api.get<Statistiques>("/rapports/statistiques"),

    /**
     * Données graphique évolution (6 mois)
     * GET /api/rapports/evolution?mois=6
     * @param mois - Nombre de mois à afficher (défaut: 6)
     * @returns Données d'évolution par mois
     */
    evolution: (mois: number = 6): Promise<ReponseEvolution> =>
        api.get<ReponseEvolution>(`/rapports/evolution?mois=${mois}`),

    /**
     * Répartition crédits par statut
     * GET /api/rapports/credits-statuts
     * @returns Répartition des crédits par statut
     */
    creditsParStatut: (): Promise<ReponseCreditsParStatut> =>
        api.get<ReponseCreditsParStatut>("/rapports/credits-statuts"),

    /**
     * Dashboard complet
     * GET /api/rapports/dashboard
     * @returns Statistiques, évolution, transactions récentes et crédits récents
     */
    dashboard: (): Promise<DashboardData> => api.get<DashboardData>("/rapports/dashboard"),

    /**
     * Répartition par canal de paiement
     * GET /api/rapports/canaux
     * @returns Répartition des transactions par canal
     */
    canauxPaiement: (): Promise<ReponseCanauxPaiement> => api.get<ReponseCanauxPaiement>("/rapports/canaux"),

    /**
     * Indicateurs de performance
     * GET /api/rapports/indicateurs
     * @returns Indicateurs clés de performance
     */
    indicateurs: (): Promise<Indicateurs> => api.get<Indicateurs>("/rapports/indicateurs"),

    /**
     * Exporter rapport PDF
     * GET /api/rapports/export/pdf
     * @returns Télécharge le fichier PDF
     */
    exporterPDF: async (): Promise<void> => {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const response = await fetch(`${apiUrl}/rapports/export/pdf`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Echec de l'export PDF (statut ${response.status})`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport_${new Date().toISOString().split("T")[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Exporter rapport CSV
     * GET /api/rapports/export/csv
     * @returns Télécharge le fichier CSV
     */
    exporterCSV: async (): Promise<void> => {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const response = await fetch(`${apiUrl}/rapports/export/csv`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Echec de l'export CSV (statut ${response.status})`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Résumé des rapports
     * GET /api/rapports/resume
     */
    resume: (): Promise<RapportResume> => api.get<RapportResume>("/rapports/resume"),
};

export default rapportService;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
