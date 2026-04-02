import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les crédits
export interface Credit {
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
}

// Types pour les paramètres
export interface ParamsCredits {
  page?: number;
  limite?: number;
  statut?: string;
  recherche?: string;
  utilisateurId?: string;
}

// Types pour la création d'un crédit
export interface DonneesCreationCredit {
  utilisateurId: string;
  montant: number;
  taux: number;
  duree: number;
  dateEcheance: string;
}

// Types pour la modification d'un crédit
export interface DonneesModificationCredit {
  montant?: number;
  taux?: number;
  duree?: number;
  dateEcheance?: string;
}

// Types pour le rejet d'un crédit
export interface DonneesRejetCredit {
  raison: string;
}

// ============================================
// SERVICE
// ============================================

export const creditService = {

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