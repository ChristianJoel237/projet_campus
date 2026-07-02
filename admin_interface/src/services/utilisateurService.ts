import { api } from "./apiConfig";
import { ApiResponse } from "./apiConfig";

// TYPES
export type StatutUtilisateur = "nouveau" | "actif" | "inactif" | "suspendu" | "bloque";

export interface Utilisateur {
    id: string | number;
    nom: string;
    telephone: string;
    ville: string;
    statut: StatutUtilisateur;
    epargne: number;
    credits: number;
    dateInscription: string;
    email?: string;
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
    utilisateur: any;
}
export interface ReponseMessage {
    message: string;
}
export interface ReponseChangementStatut {
    utilisateur: { id: string | number; statut: StatutUtilisateur };
}

export interface ParamsUtilisateurs {
    page?: number;
    limite?: number;
    statut?: string;
    recherche?: string;
}

export const utilisateurService = {
    /**
     * Liste les utilisateurs par rôle
     * GET /Admin/get-users-by-role?role=...
     */
    listerTous: async (
        role: string = "ROLE_UTILISATEUR",
        params: ParamsUtilisateurs = {},
    ): Promise<ReponseListeUtilisateurs> => {
        const query = new URLSearchParams({
            role,
            ...Object.fromEntries(
                Object.entries(params)
                    .filter(([_, v]) => v !== undefined)
                    .map(([k, v]) => [k, String(v)]),
            ),
        });

        const reponse = await api.get<any>(`/Admin/get-users-by-role?${query.toString()}`);

        const utilisateurs = Array.isArray(reponse)
            ? reponse
            : reponse?.utilisateurs || reponse?.donnees || reponse?.data || [];

        return {
            utilisateurs,
            total: reponse?.total ?? utilisateurs.length,
            page: reponse?.page ?? 1,
            pages: reponse?.pages ?? 1,
        };
    },

    obtenir: (id: string | number): Promise<ReponseUtilisateur> => api.get<ReponseUtilisateur>(`/utilisateurs/${id}`),

    creer: (donnees: any): Promise<ReponseUtilisateurCree> =>
        api.post<ReponseUtilisateurCree>("/utilisateurs", donnees),

    modifier: (id: string | number, donnees: any): Promise<ReponseUtilisateur> =>
        api.put<ReponseUtilisateur>(`/utilisateurs/${id}`, donnees),

    /**
     * Change le statut d'un utilisateur (actif, suspendu, bloqué, etc.)
     */
    changerStatut: async (email: string, statut: string): Promise<void> => {
        await api.patch(
            `/Admin/change-status?email=${encodeURIComponent(email)}&status=${encodeURIComponent(statut.toUpperCase())}`,
        );
    },
    /**
     * Supprime un utilisateur
     */
    supprimer: (id: string | number): Promise<ReponseMessage> => api.delete<ReponseMessage>(`/auth/delete-user/${id}`),
};

export default utilisateurService;
