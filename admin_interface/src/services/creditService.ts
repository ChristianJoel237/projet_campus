import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les crédits
export interface Credit {
<<<<<<< HEAD
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  montant: number;
  taux: number;
  duree: number;
  dateDebut?: string;
  dateEcheance: string;
  statut: "en_attente" | "en_cours" | "rembourse" | "en_retard" | "rejete";
  remboursement?: number;
  prochainEcheance?: string;
}

export interface CreditCree {
  id: string;
  utilisateurId: string;
  montant: number;
  statut: string;
  dateEcheance: string;
}

export interface ReponseListeCredits {
  credits: Credit[];
  total: number;
  page: number;
  pages: number;
}

export interface ReponseCredit {
  credit: Credit;
}

export interface ReponseCreditCree {
  credit: CreditCree;
}

export interface ReponseMessage {
  message: string;
=======
    id: string;
    utilisateurId: string;
    utilisateurNom?: string;
    montant: number;
    taux: number;
    duree: number;
    dateDebut?: string;
    dateEcheance: string;
    statut: "en_attente" | "en_cours" | "rembourse" | "en_retard" | "rejete";
    remboursement?: number;
    prochainEcheance?: string;
}

export interface CreditCree {
    id: string;
    utilisateurId: string;
    montant: number;
    statut: string;
    dateEcheance: string;
}

export interface ReponseListeCredits {
    credits: Credit[];
    total: number;
    page: number;
    pages: number;
}

export interface ReponseCredit {
    credit: Credit;
}

export interface ReponseCreditCree {
    credit: CreditCree;
}

export interface ReponseMessage {
    message: string;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour les paramètres
export interface ParamsCredits {
<<<<<<< HEAD
  page?: number;
  limite?: number;
  statut?: string;
  recherche?: string;
  utilisateurId?: string;
=======
    page?: number;
    limite?: number;
    statut?: string;
    recherche?: string;
    utilisateurId?: string;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour la création d'un crédit
export interface DonneesCreationCredit {
<<<<<<< HEAD
  utilisateurId: string;
  montant: number;
  taux: number;
  duree: number;
  dateEcheance: string;
=======
    utilisateurId: string;
    montant: number;
    taux: number;
    duree: number;
    dateEcheance: string;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour la modification d'un crédit
export interface DonneesModificationCredit {
<<<<<<< HEAD
  montant?: number;
  taux?: number;
  duree?: number;
  dateEcheance?: string;
=======
    montant?: number;
    taux?: number;
    duree?: number;
    dateEcheance?: string;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// Types pour le rejet d'un crédit
export interface DonneesRejetCredit {
<<<<<<< HEAD
  raison: string;
=======
    raison: string;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

// ============================================
// SERVICE
// ============================================

export const creditService = {
<<<<<<< HEAD

  /**
   * Liste tous les crédits
   * GET /api/credits?page=1&limite=20&statut=en_cours&recherche=
   * @param params - Paramètres de filtrage et pagination
   * @returns Liste des crédits avec pagination
   */
  listerTous: (params: ParamsCredits = {}): Promise<ReponseListeCredits> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.limite !== undefined) query.append("limite", String(params.limite));
    if (params.statut) query.append("statut", params.statut);
    if (params.recherche) query.append("recherche", params.recherche);
    if (params.utilisateurId) query.append("utilisateurId", params.utilisateurId);
    
    const queryString = query.toString();
    const url = queryString ? `/credits?${queryString}` : "/credits";
    return api.get<ReponseListeCredits>(url);
  },

  /**
   * Détail d'un crédit
   * GET /api/credits/:id
   * @param id - Identifiant du crédit
   * @returns Détails du crédit
   */
  obtenir: (id: string): Promise<ReponseCredit> =>
    api.get<ReponseCredit>(`/credits/${id}`),

  /**
   * Créer un crédit
   * POST /api/credits
   * @param donnees - Données du crédit à créer
   * @returns Crédit créé
   */
  creer: (donnees: DonneesCreationCredit): Promise<ReponseCreditCree> =>
    api.post<ReponseCreditCree>("/credits", donnees),

  /**
   * Modifier un crédit
   * PUT /api/credits/:id
   * @param id - Identifiant du crédit
   * @param donnees - Données à modifier
   * @returns Crédit modifié
   */
  modifier: (id: string, donnees: DonneesModificationCredit): Promise<ReponseCredit> =>
    api.put<ReponseCredit>(`/credits/${id}`, donnees),

  /**
   * Approuver un crédit
   * PATCH /api/credits/:id/approuver
   * @param id - Identifiant du crédit
   * @returns Crédit approuvé (statut: "en_cours")
   */
  approuver: (id: string): Promise<ReponseCredit> =>
    api.patch<ReponseCredit>(`/credits/${id}/approuver`, null),

  /**
   * Rejeter un crédit
   * PATCH /api/credits/:id/rejeter
   * @param id - Identifiant du crédit
   * @param raison - Raison du rejet
   * @returns Crédit rejeté (statut: "rejete")
   */
  rejeter: (id: string, raison: string): Promise<ReponseCredit> =>
    api.patch<ReponseCredit>(`/credits/${id}/rejeter`, { raison }),

  /**
   * Supprimer un crédit
   * DELETE /api/credits/:id
   * @param id - Identifiant du crédit
   * @returns Message de confirmation
   */
  supprimer: (id: string): Promise<ReponseMessage> =>
    api.delete<ReponseMessage>(`/credits/${id}`),
};

export default creditService;
=======
    /**
     * Liste tous les crédits
     * GET /api/credits?page=1&limite=20&statut=en_cours&recherche=
     * @param params - Paramètres de filtrage et pagination
     * @returns Liste des crédits avec pagination
     */
    listerTous: (params: ParamsCredits = {}): Promise<ReponseListeCredits> => {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append("page", String(params.page));
        if (params.limite !== undefined) query.append("limite", String(params.limite));
        if (params.statut) query.append("statut", params.statut);
        if (params.recherche) query.append("recherche", params.recherche);
        if (params.utilisateurId) query.append("utilisateurId", params.utilisateurId);

        const queryString = query.toString();
        const url = queryString ? `/credits?${queryString}` : "/credits";
        return api.get<ReponseListeCredits>(url);
    },

    /**
     * Détail d'un crédit
     * GET /api/credits/:id
     * @param id - Identifiant du crédit
     * @returns Détails du crédit
     */
    obtenir: (id: string): Promise<ReponseCredit> => api.get<ReponseCredit>(`/credits/${id}`),

    /**
     * Créer un crédit
     * POST /api/credits
     * @param donnees - Données du crédit à créer
     * @returns Crédit créé
     */
    creer: (donnees: DonneesCreationCredit): Promise<ReponseCreditCree> =>
        api.post<ReponseCreditCree>("/credits", donnees),

    /**
     * Modifier un crédit
     * PUT /api/credits/:id
     * @param id - Identifiant du crédit
     * @param donnees - Données à modifier
     * @returns Crédit modifié
     */
    modifier: (id: string, donnees: DonneesModificationCredit): Promise<ReponseCredit> =>
        api.put<ReponseCredit>(`/credits/${id}`, donnees),

    /**
     * Approuver un crédit
     * PATCH /api/credits/:id/approuver
     * @param id - Identifiant du crédit
     * @returns Crédit approuvé (statut: "en_cours")
     */
    approuver: (id: string): Promise<ReponseCredit> => api.patch<ReponseCredit>(`/credits/${id}/approuver`, null),

    /**
     * Rejeter un crédit
     * PATCH /api/credits/:id/rejeter
     * @param id - Identifiant du crédit
     * @param raison - Raison du rejet
     * @returns Crédit rejeté (statut: "rejete")
     */
    rejeter: (id: string, raison: string): Promise<ReponseCredit> =>
        api.patch<ReponseCredit>(`/credits/${id}/rejeter`, { raison }),

    /**
     * Supprimer un crédit
     * DELETE /api/credits/:id
     * @param id - Identifiant du crédit
     * @returns Message de confirmation
     */
    supprimer: (id: string): Promise<ReponseMessage> => api.delete<ReponseMessage>(`/credits/${id}`),
};

// ============================================
// SCORING IA — TYPES
// ============================================

export interface DonneesScoring {
    utilisateurId: string;
    montant: number;
    duree: number; // en mois
    taux: number;
    revenuMensuel?: number;
    historiquePaiements?: number; // 0 à 1 (ratio de paiements à temps)
}

export interface FacteurRisque {
    nom: string; // ex: "Montant élevé"
    impact: "positif" | "negatif";
}

export interface ResultatScoring {
    score: number; // 0 à 100
    niveau: "faible" | "moyen" | "eleve";
    probabiliteDefaut: number; // 0 à 1
    facteurs: FacteurRisque[]; // 3 facteurs principaux
    recommandation: "approuver" | "examiner" | "rejeter";
}

export interface ReponseScoring {
    scoring: ResultatScoring;
}

// ============================================
// SCORING IA — SERVICE
// ============================================

export const scoringService = {
    /**
     * Analyse le risque d'un crédit via le modèle IA
     * POST /api/scoring/predict
     * @param donnees - Données du client et du crédit
     * @returns Résultat du scoring avec niveau de risque
     */

    analyser: async (donnees: DonneesScoring): Promise<ReponseScoring> => {
        const response = await fetch("/scoring/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donnees),
        });
        if (!response.ok) throw new Error(`Erreur scoring : ${response.status}`);
        return response.json();
    },
    /**
     * Scoring rapide à partir d'un crédit existant
     * POST /api/scoring/predict/:creditId
     * @param creditId - ID du crédit à analyser
     * @returns Résultat du scoring
     */
    analyserCredit: (creditId: string): Promise<ReponseScoring> =>
        api.post<ReponseScoring>(`/scoring/predict/${creditId}`, null),
};

export default creditService;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
