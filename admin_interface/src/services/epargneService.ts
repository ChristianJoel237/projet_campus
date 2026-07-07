import { api } from "./apiConfig";
import { Epargne, TypeEpargne } from "../types/donnees.types";

// ============================================
// TYPES
// ============================================
// Le type Epargne n'est plus redéfini ici — il vient de types/donnees.types.ts,
// seule source de vérité. Avant : ce fichier avait sa propre définition
// (id: string, typeEpargne: "quotidienne"|"hebdomadaire") incompatible avec
// le reste de l'app. Ça masquait des bugs de typage silencieusement.

export interface EpargneCreee {
    id: number;
    utilisateurId: string;
    typeEpargne: TypeEpargne;
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
        id: number;
        solde: number;
        nombreDepots?: number;
    };
}

export interface ParamsEpargnes {
    page?: number;
    limite?: number;
    type?: TypeEpargne;
    recherche?: string;
    utilisateurId?: string;
}

export interface DonneesCreationEpargne {
    utilisateurId: string;
    typeEpargne: TypeEpargne;
    soldeInitial?: number;
    objectif?: number;
}

export interface DonneesModificationEpargne {
    typeEpargne?: TypeEpargne;
    objectif?: number;
}

export interface DonneesDepotRetrait {
    montant: number;
    canal: "orange_money" | "mtn_money";
}

// ============================================
// SERVICE
// ============================================
// ATTENTION : ces routes (/epargnes, /depot, /retrait, pagination) ne sont
// PAS vérifiées contre le backend Java réel (SavingsService, /api/saving).
// Elles ne fonctionneront que tant que VITE_USE_MOCK=true.
// Avant de passer en mode réel, il faut soit :
//   - que le backend expose ces mêmes routes sous /api/epargnes, soit
//   - réécrire ce service pour taper sur /api/saving avec les routes
//     réellement existantes (createSaving, modifySaving, soldeSaving,
//     + le futur endpoint de listing qu'on a esquissé).

export const epargneService = {
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

    obtenir: (id: number): Promise<ReponseEpargne> => api.get<ReponseEpargne>(`/epargnes/${id}`),

    creer: (donnees: DonneesCreationEpargne): Promise<ReponseEpargneCreee> =>
        api.post<ReponseEpargneCreee>("/epargnes", donnees),

    modifier: (id: number, donnees: DonneesModificationEpargne): Promise<ReponseEpargne> =>
        api.put<ReponseEpargne>(`/epargnes/${id}`, donnees),

    depot: (id: number, montant: number, canal: string): Promise<ReponseDepotRetrait> =>
        api.post<ReponseDepotRetrait>(`/epargnes/${id}/depot`, { montant, canal }),

    retrait: (id: number, montant: number, canal: string): Promise<ReponseDepotRetrait> =>
        api.post<ReponseDepotRetrait>(`/epargnes/${id}/retrait`, { montant, canal }),

    supprimer: (id: number): Promise<ReponseMessage> => api.delete<ReponseMessage>(`/epargnes/${id}`),
};

export default epargneService;
