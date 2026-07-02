import { api } from "./apiConfig";

// ============================================
// TYPES : CRÉDITS
// ============================================
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

export interface ParamsCredits {
    page?: number;
    limite?: number;
    statut?: string;
    recherche?: string;
    utilisateurId?: string;
}

export interface DonneesCreationCredit {
    utilisateurId: string;
    montant: number;
    taux: number;
    duree: number;
    dateEcheance: string;
}

export interface DonneesModificationCredit {
    montant?: number;
    taux?: number;
    duree?: number;
    dateEcheance?: string;
}

// ============================================
// TYPES : SCORING IA
// ============================================
export interface DonneesScoring {
    utilisateurId: string;
    montant: number;
    duree: number;
    taux: number;
    revenuMensuel?: number;
    historiquePaiements?: number;
}

export interface FacteurRisque {
    nom: string;
    impact: "positif" | "negatif";
}

export interface ResultatScoring {
    score: number;
    niveau: "faible" | "moyen" | "eleve";
    probabiliteDefaut: number;
    facteurs: FacteurRisque[];
    recommandation: "approuver" | "examiner" | "rejeter";
}

export interface ReponseScoring {
    scoring: ResultatScoring;
}

// ============================================
// SERVICES
// ============================================

export const creditService = {
    listerTous: (params: ParamsCredits = {}): Promise<ReponseListeCredits> => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
        return api.get<ReponseListeCredits>(`/credits?${query.toString()}`);
    },

    obtenir: (id: string): Promise<ReponseCredit> => api.get<ReponseCredit>(`/credits/${id}`),
    creer: (donnees: DonneesCreationCredit): Promise<ReponseCreditCree> =>
        api.post<ReponseCreditCree>("/credits", donnees),
    modifier: (id: string, donnees: DonneesModificationCredit): Promise<ReponseCredit> =>
        api.put<ReponseCredit>(`/credits/${id}`, donnees),
    approuver: (id: string): Promise<ReponseCredit> => api.patch<ReponseCredit>(`/credits/${id}/approuver`),
    rejeter: (id: string, raison: string): Promise<ReponseCredit> =>
        api.patch<ReponseCredit>(`/credits/${id}/rejeter`, { raison }),
    supprimer: (id: string): Promise<ReponseMessage> => api.delete<ReponseMessage>(`/credits/${id}`),
};

export const scoringService = {
    analyser: (donnees: DonneesScoring): Promise<ReponseScoring> =>
        api.post<ReponseScoring>("/scoring/predict", donnees),

    analyserCredit: (creditId: string): Promise<ReponseScoring> =>
        api.post<ReponseScoring>(`/scoring/predict/${creditId}`),
};
