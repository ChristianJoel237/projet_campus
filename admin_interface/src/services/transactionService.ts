import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

// Types pour les transactions
export interface Transaction {
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  montant: number;
  type: "depot" | "retrait" | "transfert" | "remboursement";
  canal: "orange_money" | "mtn_money";
  statut: "reussie" | "en_attente" | "echouee" | "annulee";
  date: string;
  reference?: string;
  description?: string;
}

export interface TransactionCreee {
  id: string;
  utilisateurId: string;
  montant: number;
  type: string;
  statut: string;
  date: string;
  reference: string;
}

export interface ReponseListeTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  pages: number;
}

export interface ReponseTransaction {
  transaction: Transaction;
}

export interface ReponseTransactionCreee {
  transaction: TransactionCreee;
}

export interface ReponseMessage {
  message: string;
}

// Types pour les paramètres
export interface ParamsTransactions {
  page?: number;
  limite?: number;
  type?: string;
  canal?: string;
  statut?: string;
  recherche?: string;
  utilisateurId?: string;
  dateDebut?: string;
  dateFin?: string;
}

// Types pour la création d'une transaction
export interface DonneesCreationTransaction {
  utilisateurId: string;
  montant: number;
  type: "depot" | "retrait" | "transfert" | "remboursement";
  canal: "orange_money" | "mtn_money";
  description?: string;
}

// ============================================
// SERVICE
// ============================================

export const transactionService = {

  /**
   * Liste toutes les transactions
   * GET /api/transactions?page=1&limite=20&type=depot&canal=Orange Money&recherche=
   * @param params - Paramètres de filtrage et pagination
   * @returns Liste des transactions avec pagination
   */
  listerTous: (params: ParamsTransactions = {}): Promise<ReponseListeTransactions> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.limite !== undefined) query.append("limite", String(params.limite));
    if (params.type) query.append("type", params.type);
    if (params.canal) query.append("canal", params.canal);
    if (params.statut) query.append("statut", params.statut);
    if (params.recherche) query.append("recherche", params.recherche);
    if (params.utilisateurId) query.append("utilisateurId", params.utilisateurId);
    if (params.dateDebut) query.append("dateDebut", params.dateDebut);
    if (params.dateFin) query.append("dateFin", params.dateFin);
    
    const queryString = query.toString();
    const url = queryString ? `/transactions?${queryString}` : "/transactions";
    return api.get<ReponseListeTransactions>(url);
  },

  /**
   * Détail d'une transaction
   * GET /api/transactions/:id
   * @param id - Identifiant de la transaction
   * @returns Détails de la transaction
   */
  obtenir: (id: string): Promise<ReponseTransaction> =>
    api.get<ReponseTransaction>(`/transactions/${id}`),

  /**
   * Créer une transaction manuelle
   * POST /api/transactions
   * @param donnees - Données de la transaction à créer
   * @returns Transaction créée
   */
  creer: (donnees: DonneesCreationTransaction): Promise<ReponseTransactionCreee> =>
    api.post<ReponseTransactionCreee>("/transactions", donnees),

  /**
   * Annuler une transaction
   * PATCH /api/transactions/:id/annuler
   * @param id - Identifiant de la transaction
   * @returns Transaction annulée (statut: "annulee")
   */
  annuler: (id: string): Promise<ReponseTransaction> =>
    api.patch<ReponseTransaction>(`/transactions/${id}/annuler`, null),
};

export default transactionService;