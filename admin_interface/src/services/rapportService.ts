import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les statistiques
export interface Statistiques {
  totalUtilisateurs: number;
  creditsActifs: number;
  epargnesActives: number;
  transactionsAujourdhui: number;
  revenusTotal: number;
  tauxRemboursement: number;
}

// Types pour l'évolution
export interface DonneesEvolution {
  mois: string;
  credits: number;
  epargnes: number;
  transactions: number;
}

export interface ReponseEvolution {
  donnees: DonneesEvolution[];
}

// Types pour les crédits par statut
export interface CreditParStatut {
  nom: string;
  valeur: number;
}

export interface ReponseCreditsParStatut {
  donnees: CreditParStatut[];
}

// Types pour les canaux de paiement
export interface CanalPaiement {
  canal: string;
  transactions: number;
  montant: number;
}

export interface ReponseCanauxPaiement {
  donnees: CanalPaiement[];
}

// Types pour les indicateurs
export interface Indicateurs {
  tauxRemboursement: number;
  tauxReussite: number;
  epargneReguliere: number;
  creditsEnRetard: number;
}

// Types pour les paramètres d'évolution
export interface ParamsEvolution {
  mois?: number;
}

// ============================================
// SERVICE
// ============================================

export const rapportService = {

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