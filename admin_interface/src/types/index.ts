// ============================================
// TYPES UTILISATEUR
// ============================================

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  ville?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateInscription: Date | string;
  epargneTotale?: number;
  creditsActifs?: number;
}

// ============================================
// TYPES CRÉDIT
// ============================================

export interface Credit {
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  montant: number;
  montantRembourse: number;
  tauxInteret: number;
  dureeMois: number;
  dateDebut: Date | string;
  dateEcheance: Date | string;
  statut: 'en_cours' | 'rembourse' | 'en_retard' | 'en_attente' | 'rejete';
  prochainEcheance?: Date | string;
}

// ============================================
// TYPES ÉPARGNE
// ============================================

export interface Epargne {
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  type: 'quotidienne' | 'hebdomadaire';
  solde: number;
  objectif?: number;
  dernierDepot?: Date | string;
  nbDepots?: number;
}

// ============================================
// TYPES TRANSACTION
// ============================================

export interface Transaction {
  id: string;
  utilisateurId: string;
  utilisateurNom?: string;
  type: 'depot' | 'retrait' | 'transfert' | 'remboursement';
  montant: number;
  canal: 'orange_money' | 'mtn_money';
  date: Date | string;
  statut: 'reussie' | 'echouee' | 'en_attente';
  reference: string;
  description?: string;
}

// ============================================
// TYPES NOTIFICATION
// ============================================

export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'succes' | 'avertissement' | 'erreur';
  lu: boolean;
  date: Date | string;
}

// ============================================
// TYPES STATISTIQUES
// ============================================

export interface StatistiquesDashboard {
  totalUtilisateurs: number;
  commercantsInscrits: number;
  creditsActifs: number;
  pretsEnCours: number;
  epargnesActives: number;
  comptesEpargne: number;
  transactionsAujourdhui: number;
  revenusTotal: number;
  tauxRemboursement: number;
}

// ============================================
// TYPES FORMULAIRES
// ============================================

export interface ConnexionFormData {
  email: string;
  motDePasse: string;
}

export interface ChangementMotDePasseData {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmationMotDePasse: string;
}

export interface ProfilFormData {
  nom: string;
  email: string;
  telephone?: string;
}

// ============================================
// TYPES API
// ============================================

export interface ApiResponse<T = unknown> {
  succes: boolean;
  donnees?: T;
  message?: string;
  erreurs?: string[];
  
}

export interface PaginationParams {
  page: number;
  limite: number;
  recherche?: string;
  statut?: string;
}

export interface PaginationResult<T> {
  donnees: T[];
  total: number;
  page: number;
  pagesTotales: number;
}




// ─── AGENT DE TERRAIN ───────────────────────────────────────────
export type AgentTerrain = {
  id: string
  nom: string
  prenom: string
  telephone: string
  email: string              // pour la connexion
  motDePasse?: string        // jamais retourné par l'API
  zoneIntervention: string   // ex: "Douala-Akwa", "Yaoundé-Mfoundi"
  statut: 'actif' | 'inactif' | 'suspendu'
  dateCreation: string       // ISO 8601
  creePar: string            // id de l'admin
}

// ─── MISSION DE VÉRIFICATION ────────────────────────────────────
export type MissionVerification = {
  id: string
  agentId: string
  clientId: string
  dossierPretId: string
  statut: 'en_attente' | 'en_cours' | 'effectuee' | 'annulee'
  dateAssignation: string
  dateVisite?: string
  rapport?: RapportSolvabilite
}

// ─── RAPPORT STRUCTURÉ ──────────────────────────────────────────
export type RapportSolvabilite = {
  id: string
  missionId: string
  agentId: string
  dateRedaction: string

  // Revenus
  revenuMensuelEstime: number      // FCFA
  sourceRevenu: string             // ex: "Commerce détail", "Transport"
  regulariteRevenu: 'stable' | 'variable' | 'irregulier'

  // Charges
  chargesFixesMensuelles: number   // loyer, scolarité...
  nombrePersonnesCharge: number

  // Garanties
  typeGarantie: 'bien_mobilier' | 'bien_immobilier' | 'caution' | 'aucune'
  descriptionGarantie?: string
  valeurEstimeeGarantie?: number

  // Avis final
  avis: 'favorable' | 'defavorable' | 'favorable_avec_reserve'
  commentaire: string
}

// ─── STATS ADMIN (page suivi) ───────────────────────────────────
export type StatsAgent = {
  agentId: string
  totalMissions: number
  missionsEffectuees: number
  missionsEnAttente: number
  missionsAnnulees: number
  tauxFavorable: number            // pourcentage
  zoneIntervention: string
}
