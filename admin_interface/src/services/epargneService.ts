import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les épargnes
export interface Epargne {
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  typeEpargne: "quotidienne" | "hebdomadaire";
  solde: number;
  nombreDepots: number;
  dernierDepot?: string;
  objectif?: number;
  progression?: number;
}

export interface EpargneCreee {
  id: string;
  utilisateurId: string;
  typeEpargne: string;
  solde: number;
}

export interface ReponseListeEpargnes {
  epargnes: Epargne[];
  total: number;
  page: number;
  pages: number;
}

export interface ReponseEpargne {
  epargne: Epargne;
}

export interface ReponseEpargneCreee {
  epargne: EpargneCreee;
}

export interface ReponseMessage {
  message: string;
}

export interface ReponseDepotRetrait {
  epargne: {
    id: string;
    solde: number;
    nombreDepots?: number;
  };
}

// Types pour les paramètres
export interface ParamsEpargnes {
  page?: number;
  limite?: number;
  type?: string;
  recherche?: string;
  utilisateurId?: string;
}

// Types pour la création d'une épargne
export interface DonneesCreationEpargne {
  utilisateurId: string;
  typeEpargne: "quotidienne" | "hebdomadaire";
  soldeInitial?: number;
  objectif?: number;
}

// Types pour la modification d'une épargne
export interface DonneesModificationEpargne {
  typeEpargne?: "quotidienne" | "hebdomadaire";
  objectif?: number;
}

// Types pour un dépôt/retrait
export interface DonneesDepotRetrait {
  montant: number;
  canal: "orange_money" | "mtn_money";
}

// ============================================
// SERVICE
// ============================================

export const epargneService = {

  /**
   * Liste toutes les épargnes
   * GET /api/epargnes?page=1&limite=20&type=quotidienne&recherche=
   * @param params - Paramètres de filtrage et pagination
   * @returns Liste des épargnes avec pagination
   */
  listerTous: (params: ParamsEpargnes = {}): Promise<ReponseListeEpargnes> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.limite !== undefined) query.append("limite", String(params.limite));
    if (params.type) query.append("type", params.type);
    if (params.recherche) query.append("recherche", params.recherche);
    if (params.utilisateurId) query.append("utilisateurId", params.utilisateurId);
    
    const queryString = query.toString();
    const url = queryString ? `/epargnes?${queryString}` : "/epargnes";
    return api.get<ReponseListeEpargnes>(url);
  },

  /**
   * Détail d'une épargne
   * GET /api/epargnes/:id
   * @param id - Identifiant de l'épargne
   * @returns Détails de l'épargne
   */
  obtenir: (id: string): Promise<ReponseEpargne> =>
    api.get<ReponseEpargne>(`/epargnes/${id}`),

  /**
   * Créer un compte épargne
   * POST /api/epargnes
   * @param donnees - Données de l'épargne à créer
   * @returns Épargne créée
   */
  creer: (donnees: DonneesCreationEpargne): Promise<ReponseEpargneCreee> =>
    api.post<ReponseEpargneCreee>("/epargnes", donnees),

  /**
   * Modifier une épargne
   * PUT /api/epargnes/:id
   * @param id - Identifiant de l'épargne
   * @param donnees - Données à modifier
   * @returns Épargne modifiée
   */
  modifier: (id: string, donnees: DonneesModificationEpargne): Promise<ReponseEpargne> =>
    api.put<ReponseEpargne>(`/epargnes/${id}`, donnees),

  /**
   * Effectuer un dépôt
   * POST /api/epargnes/:id/depot
   * @param id - Identifiant de l'épargne
   * @param montant - Montant à déposer
   * @param canal - Canal de paiement
   * @returns Épargne mise à jour
   */
  depot: (id: string, montant: number, canal: string): Promise<ReponseDepotRetrait> =>
    api.post<ReponseDepotRetrait>(`/epargnes/${id}/depot`, { montant, canal }),

  /**
   * Effectuer un retrait
   * POST /api/epargnes/:id/retrait
   * @param id - Identifiant de l'épargne
   * @param montant - Montant à retirer
   * @param canal - Canal de paiement
   * @returns Épargne mise à jour
   */
  retrait: (id: string, montant: number, canal: string): Promise<ReponseDepotRetrait> =>
    api.post<ReponseDepotRetrait>(`/epargnes/${id}/retrait`, { montant, canal }),

  /**
   * Supprimer une épargne
   * DELETE /api/epargnes/:id
   * @param id - Identifiant de l'épargne
   * @returns Message de confirmation
   */
  supprimer: (id: string): Promise<ReponseMessage> =>
    api.delete<ReponseMessage>(`/epargnes/${id}`),
};

export default epargneService;