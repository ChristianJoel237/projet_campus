// types/scoring.types.ts
// ─────────────────────────────────────────────────────────────
// Types alignés sur schemas.py (API FastAPI)
// ─────────────────────────────────────────────────────────────

export interface DonneesScoring {
    utilisateurId: string;
    montant: number;
    duree: number;
    taux: number;
}

export interface Facteur {
    nom: string;
    impact: "positif" | "negatif";
}

export interface ResultatScoring {
    score: number; // 0 à 100
    niveau: "faible" | "moyen" | "eleve";
    recommandation: "approuver" | "examiner" | "rejeter";
    probabiliteDefaut: number; // 0 à 1
    facteurs: Facteur[];
}

export interface ReponseScoring {
    scoring: ResultatScoring;
}
