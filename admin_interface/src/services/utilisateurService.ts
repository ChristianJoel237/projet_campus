import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les utilisateurs
export interface Utilisateur {
  id: string;
  nom: string;
  telephone: string;
  ville: string;
  statut: "actif" | "inactif" | "suspendu";
  epargne: number;
  credits: number;
  dateInscription: string;
  email?: string;
}

export interface UtilisateurCree {
  id: string;
  nom: string;
  telephone: string;
  ville: string;
  statut: string;
  dateInscription: string;
}

export interface ReponseListeUtilisateurs {
  utilisateurs: Utilisateur[];
  total: number;
  page: number;
  pages: number;
}

export interface ReponseUtilisateur {
  utilisateur: Utilisateur;
}

export interface ReponseUtilisateurCree {
  utilisateur: UtilisateurCree;
}

export interface ReponseMessage {
  message: string;
}

export interface ReponseChangementStatut {
  utilisateur: {
    id: string;
    statut: string;
  };
}

// Types pour les paramètres
export interface ParamsUtilisateurs {
  page?: number;
  limite?: number;
  statut?: string;
  recherche?: string;
}

// Types pour la création d'un utilisateur
export interface DonneesCreationUtilisateur {
  nom: string;
  telephone: string;
  ville: string;
  statut?: "actif" | "inactif" | "suspendu";
  email?: string;
}

// Types pour la modification d'un utilisateur
export interface DonneesModificationUtilisateur {
  nom?: string;
  telephone?: string;
  ville?: string;
  email?: string;
}

// Types pour le changement de statut
export type StatutUtilisateur = "actif" | "inactif" | "suspendu";

// ============================================
// SERVICE
// ============================================

export const utilisateurService = {

  /**
   * Liste tous les utilisateurs
   * GET /api/utilisateurs?page=1&limite=20&statut=actif&recherche=
   * @param params - Paramètres de filtrage et pagination
   * @returns Liste des utilisateurs avec pagination
   */
  listerTous: (params: ParamsUtilisateurs = {}): Promise<ReponseListeUtilisateurs> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.limite !== undefined) query.append("limite", String(params.limite));
    if (params.statut) query.append("statut", params.statut);
    if (params.recherche) query.append("recherche", params.recherche);
    
    const queryString = query.toString();
    const url = queryString ? `/utilisateurs?${queryString}` : "/utilisateurs";
    return api.get<ReponseListeUtilisateurs>(url);
  },

  /**
   * Détail d'un utilisateur
   * GET /api/utilisateurs/:id
   * @param id - Identifiant de l'utilisateur
   * @returns Détails de l'utilisateur
   */
  obtenir: (id: string): Promise<ReponseUtilisateur> =>
    api.get<ReponseUtilisateur>(`/utilisateurs/${id}`),

  /**
   * Créer un utilisateur
   * POST /api/utilisateurs
   * @param donnees - Données de l'utilisateur à créer
   * @returns Utilisateur créé
   */
  creer: (donnees: DonneesCreationUtilisateur): Promise<ReponseUtilisateurCree> =>
    api.post<ReponseUtilisateurCree>("/utilisateurs", donnees),

  /**
   * Modifier un utilisateur
   * PUT /api/utilisateurs/:id
   * @param id - Identifiant de l'utilisateur
   * @param donnees - Données à modifier
   * @returns Utilisateur modifié
   */
  modifier: (id: string, donnees: DonneesModificationUtilisateur): Promise<ReponseUtilisateur> =>
    api.put<ReponseUtilisateur>(`/utilisateurs/${id}`, donnees),

  /**
   * Changer statut (actif/suspendu)
   * PATCH /api/utilisateurs/:id/statut
   * @param id - Identifiant de l'utilisateur
   * @param statut - Nouveau statut ("actif" | "suspendu" | "inactif")
   * @returns Utilisateur avec statut mis à jour
   */
  changerStatut: (id: string, statut: StatutUtilisateur): Promise<ReponseChangementStatut> =>
    api.patch<ReponseChangementStatut>(`/utilisateurs/${id}/statut`, { statut }),

  /**
   * Supprimer un utilisateur
   * DELETE /api/utilisateurs/:id
   * @param id - Identifiant de l'utilisateur
   * @returns Message de confirmation
   */
  supprimer: (id: string): Promise<ReponseMessage> =>
    api.delete<ReponseMessage>(`/utilisateurs/${id}`),
};

export default utilisateurService;