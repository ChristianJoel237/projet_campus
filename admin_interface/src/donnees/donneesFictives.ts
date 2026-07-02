// src/donnees/donneesFictives.ts
import { Utilisateur } from "../types/donnees.types";
import { Agent } from "../context/AgentsContext";

export interface Statisiques {
    totalUtilisateurs: number;
    creditsActifs: number;
    epargnesActives: number;
    transactionsAujourdhui: number;
    revenusTotal: number;
    tauxRemboursement: number;
}

export interface CreditMock {
    id: number;
    utilisateur: string;
    montant: number;
    statut: "en_cours" | "rembourse" | "en_retard" | "en_attente";
    dateDebut: string | null;
    dateEcheance: string | null;
    remboursement: number;
    taux: number;
    duree: number;
}

export interface EpargneMock {
    id: number;
    utilisateur: string;
    solde: number;
    typeEpargne: "quotidienne" | "hebdomadaire" | "mensuelle";
    dernierDepot: string;
    nombreDepots: number;
}

export interface TransactionMock {
    id: number;
    utilisateur: string;
    type: "depot" | "transfert" | "remboursement" | "retrait";
    montant: number;
    canal: "Orange Money" | "MTN Mobile Money" | "Virement" | "Cash";
    date: string;
    statut: "reussi" | "echoue" | "en_attente";
}

export interface DonneesGraphiqueMock {
    mois: string;
    credits: number;
    epargnes: number;
    transactions: number;
}

export const statistiquesGenerales: Statisiques = {
    totalUtilisateurs: 1248,
    creditsActifs: 326,
    epargnesActives: 892,
    transactionsAujourdhui: 147,
    revenusTotal: 4850000,
    tauxRemboursement: 94,
};

export const utilisateurs: Utilisateur[] = [
    {
        id: 1,
        nom: "Mballa Marie",
        telephone: "6XX-XXX-001",
        ville: "Yaoundé",
        statut: "actif",
        credits: 2,
        epargne: 45000,
        dateInscription: "2024-01-15",
    },
    {
        id: 2,
        nom: "Nguema Paul",
        telephone: "6XX-XXX-002",
        ville: "Douala",
        statut: "nouveau",
        credits: 0,
        epargne: 120000, // Corrigé : Alignement avec le solde du tableau epargnes
        dateInscription: "2026-06-10",
    },
    {
        id: 3,
        nom: "Biya Célestine",
        telephone: "6XX-XXX-003",
        ville: "Bafoussam",
        statut: "inactif",
        credits: 0,
        epargne: 15000,
        dateInscription: "2024-03-10",
    },
    {
        id: 4,
        nom: "Tamba Jean",
        telephone: "6XX-XXX-004",
        ville: "Garoua",
        statut: "bloque",
        credits: 3,
        epargne: 200000,
        dateInscription: "2024-01-28",
    },
    {
        id: 6,
        nom: "Etoa Bernard",
        telephone: "6XX-XXX-006",
        ville: "Yaoundé",
        statut: "actif",
        credits: 2,
        epargne: 75000,
        dateInscription: "2024-02-14",
    },
    {
        id: 7,
        nom: "Nkomo Grace",
        telephone: "6XX-XXX-007",
        ville: "Douala",
        statut: "actif",
        credits: 1,
        epargne: 95000,
        dateInscription: "2024-03-22",
    },
    {
        id: 8,
        nom: "Abena Michel",
        telephone: "6XX-XXX-008",
        ville: "Bertoua",
        statut: "inactif",
        credits: 0,
        epargne: 30000,
        dateInscription: "2024-05-01",
    },
];

export const credits: CreditMock[] = [
    {
        id: 1,
        utilisateur: "Mballa Marie",
        montant: 50000,
        statut: "en_cours",
        dateDebut: "2024-11-01",
        dateEcheance: "2025-02-01",
        remboursement: 35000,
        taux: 8,
        duree: 3,
    },
    {
        id: 2,
        utilisateur: "Nguema Paul",
        montant: 150000,
        statut: "en_cours",
        dateDebut: "2024-10-15",
        dateEcheance: "2025-01-15",
        remboursement: 100000,
        taux: 7,
        duree: 3,
    },
    {
        id: 3,
        utilisateur: "Tamba Jean",
        montant: 200000,
        statut: "rembourse",
        dateDebut: "2024-08-01",
        dateEcheance: "2024-11-01",
        remboursement: 200000,
        taux: 8,
        duree: 3,
    },
    {
        id: 4,
        utilisateur: "Foko Sandrine",
        montant: 20000,
        statut: "en_retard",
        dateDebut: "2024-09-01",
        dateEcheance: "2024-12-01",
        remboursement: 5000,
        taux: 10,
        duree: 3,
    },
    {
        id: 5,
        utilisateur: "Etoa Bernard",
        montant: 75000,
        statut: "en_cours",
        dateDebut: "2024-11-15",
        dateEcheance: "2025-02-15",
        remboursement: 25000,
        taux: 8,
        duree: 3,
    },
    {
        id: 6,
        utilisateur: "Nkomo Grace",
        montant: 80000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 3,
        duree: 6,
    },
    {
        id: 7,
        utilisateur: "Djomo Hervé",
        montant: 150000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 4,
        duree: 12,
    },
    {
        id: 8,
        utilisateur: "Essomba Clarisse",
        montant: 300000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 6,
        duree: 24,
    },
    {
        id: 9,
        utilisateur: "Atangana Roméo",
        montant: 450000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 8,
        duree: 18,
    },
    {
        id: 10,
        utilisateur: "Mfou Bertrand",
        montant: 800000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 12,
        duree: 36,
    },
    {
        id: 11,
        utilisateur: "Bikele Sylvie",
        montant: 1200000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 10,
        duree: 48,
    },
    {
        id: 12,
        utilisateur: "Owono Francine",
        montant: 15000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 2,
        duree: 3,
    },
    {
        id: 13,
        utilisateur: "Ndi Pascal",
        montant: 200000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 15,
        duree: 12,
    },
    {
        id: 14,
        utilisateur: "Zoa Henriette",
        montant: 250000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 5,
        duree: 60,
    },
    {
        id: 15,
        utilisateur: "Manga Cédric",
        montant: 380000,
        statut: "en_attente",
        dateDebut: null,
        dateEcheance: null,
        remboursement: 0,
        taux: 7,
        duree: 20,
    },
];

export const epargnes: EpargneMock[] = [
    {
        id: 1,
        utilisateur: "Mballa Marie",
        solde: 45000,
        typeEpargne: "quotidienne",
        dernierDepot: "2025-01-10",
        nombreDepots: 90,
    },
    {
        id: 2,
        utilisateur: "Nguema Paul",
        solde: 120000,
        typeEpargne: "hebdomadaire",
        dernierDepot: "2025-01-08",
        nombreDepots: 48,
    },
    {
        id: 3,
        utilisateur: "Tamba Jean",
        solde: 200000,
        typeEpargne: "quotidienne",
        dernierDepot: "2025-01-10",
        nombreDepots: 180,
    },
    {
        id: 4,
        utilisateur: "Etoa Bernard",
        solde: 75000,
        typeEpargne: "hebdomadaire",
        dernierDepot: "2025-01-06",
        nombreDepots: 30,
    },
    {
        id: 5,
        utilisateur: "Nkomo Grace",
        solde: 95000,
        typeEpargne: "quotidienne",
        dernierDepot: "2025-01-10",
        nombreDepots: 120,
    },
    {
        id: 6,
        utilisateur: "Abena Michel",
        solde: 30000,
        typeEpargne: "hebdomadaire",
        dernierDepot: "2024-12-30",
        nombreDepots: 12,
    },
];

export const transactions: TransactionMock[] = [
    {
        id: 1,
        utilisateur: "Mballa Marie",
        type: "depot",
        montant: 5000,
        canal: "Orange Money",
        date: "2025-01-10",
        statut: "reussi",
    },
    {
        id: 2,
        utilisateur: "Nguema Paul",
        type: "transfert",
        montant: 25000,
        canal: "MTN Mobile Money",
        date: "2025-01-10",
        statut: "reussi",
    },
    {
        id: 3,
        utilisateur: "Tamba Jean",
        type: "remboursement",
        montant: 50000,
        canal: "Orange Money",
        date: "2025-01-09",
        statut: "reussi",
    },
    {
        id: 4,
        utilisateur: "Foko Sandrine",
        type: "retrait",
        montant: 10000,
        canal: "MTN Mobile Money",
        date: "2025-01-09",
        statut: "echoue",
    },
    {
        id: 5,
        utilisateur: "Etoa Bernard",
        type: "depot",
        montant: 15000,
        canal: "Orange Money",
        date: "2025-01-08",
        statut: "reussi",
    },
    {
        id: 6,
        utilisateur: "Nkomo Grace",
        type: "transfert",
        montant: 30000,
        canal: "MTN Mobile Money",
        date: "2025-01-08",
        statut: "en_attente",
    },
    {
        id: 7,
        utilisateur: "Abena Michel",
        type: "depot",
        montant: 5000,
        canal: "Orange Money",
        date: "2025-01-07",
        statut: "reussi",
    },
];

export const donneesGraphique: DonneesGraphiqueMock[] = [
    { mois: "Août", credits: 850000, epargnes: 620000, transactions: 430000 },
    { mois: "Sep", credits: 920000, epargnes: 710000, transactions: 520000 },
    { mois: "Oct", credits: 1100000, epargnes: 830000, transactions: 610000 },
    { mois: "Nov", credits: 1350000, epargnes: 950000, transactions: 720000 },
    { mois: "Déc", credits: 1200000, epargnes: 1100000, transactions: 890000 },
    { mois: "Jan", credits: 1480000, epargnes: 1250000, transactions: 980000 },
];

export const agents: Agent[] = [
    {
        id: "AGT-2026-001",
        nom: "Kamga",
        prenom: "Jean-Paul",
        telephone: "677-XX-XX-XX",
        ville: "Bafoussam",
        login: "jp.kamga",
        statut: "actif",
        dossiers: 42,
        dateInscription: "2024-02-15",
        email: "jp.kamga@microfinance.local",
    },
    {
        id: "AGT-2026-002",
        nom: "Fotso",
        prenom: "Hubert",
        telephone: "699-XX-XX-XX",
        ville: "Douala",
        login: "h.fotso",
        statut: "suspendu", // Modifié pour être conforme au type strict 'actif' | 'suspendu' d'AgentsContext
        dossiers: 28,
        dateInscription: "2024-05-10",
        email: "h.fotso@microfinance.local",
    },
    {
        id: "AGT-2026-003",
        nom: "Ndi",
        prenom: "Serge",
        telephone: "655-XX-XX-XX",
        ville: "Yaoundé",
        login: "s.ndi",
        statut: "suspendu", // Modifié 'inactif' -> 'suspendu' pour respecter le type strict
        dossiers: 12,
        dateInscription: "2025-01-18",
        email: "s.ndi@microfinance.local",
    },
];
