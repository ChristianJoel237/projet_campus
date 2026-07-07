// types/donnees.types.ts
export type StatutUtilisateur = "nouveau" | "actif" | "inactif" | "suspendu" | "bloque";

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
    utilisateurId?: string;
    montant: number;
    taux: number;
    duree?: number;
    dateEcheance: string | null;
    statut: string;
    remboursement: number;
}

export interface Utilisateur {
    id: number;
    nom: string;
    telephone: string;
    ville: string;
    statut: StatutUtilisateur;
    credits: number;
    epargne: number;
    dateInscription: string;
    email?: string;
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

export interface DashboardData {
    statistiquesGenerales: StatistiquesGenerales;
    donneesGraphique: DonneesGraphique[];
    transactionsRecents: Transaction[];
    creditsRecents: Credit[];
}

export interface ParametresMicrofinance {
    soldeMinimumRetrait: number;
    tauxEpargneAnnuel: number;
    tauxInteretCreditAnnuel: number;
    dateModification: string;
}
