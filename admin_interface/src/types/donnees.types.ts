// Types pour les données fictives
export interface Transaction {
  id: number;
  utilisateur: string;
  type: string;
  montant: number;
  canal: string;
  date: string;
  statut: string;
}


export interface Epargne {
  id: number;
  utilisateur: string;
  typeEpargne: string; 
  solde: number;
  nombreDepots: number;
  dernierDepot: string;
}

export interface Credit {
  id: number;
  utilisateur: string;
  montant: number;
  taux: number;
  dateEcheance: string | null;
  statut: string;
  remboursement: number;
}

export interface Utilisateur {
  id: number;
  nom: string;
  telephone: string;
  ville: string;
  statut: string;
  credits: number;
  epargne: number;
  dateInscription: string;
}

export interface DonneesGraphique {
  mois: string;
  credits: number;
  epargnes: number;
  transactions: number;
}

export interface StatistiquesGenerales {
  totalUtilisateurs: number;
  creditsActifs: number;
  epargnesActives: number;
  transactionsAujourdhui: number;
  revenusTotal: number;
  tauxRemboursement: number;
}
