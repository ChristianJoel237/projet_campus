import { api } from "./apiConfig";

export interface ReponseConnexion {
    token: string;
}

export const authService = {
    /**
     * Connecte l'utilisateur avec email et mot de passe.
     * Stocke le token d'accès et le refresh token (si fourni) dans sessionStorage.
     */
    seConnecter: async (email: string, password: string): Promise<ReponseConnexion> => {
        // Appel à l'API de connexion (sans authentification préalable)
        const reponse = await api.post<any>("/auth/login", { email, password }, false);

        // Extraction sécurisée du token (plusieurs formes possibles)
        const token = reponse?.token || reponse?.access_token || reponse?.accessToken || reponse?.data?.token || null;
        const refreshToken = reponse?.refreshToken || reponse?.refresh_token || null;

        if (!token) {
            throw new Error("Authentification échouée : le serveur n'a pas retourné de jeton d'accès.");
        }

        // Stockage dans sessionStorage (détruit automatiquement à la fermeture de l'onglet/navigateur)
        sessionStorage.setItem("token", token);
        if (refreshToken) {
            sessionStorage.setItem("refreshToken", refreshToken);
        }
        sessionStorage.setItem("estConnecte", "true");

        return { token };
    },

    /**
     * Déconnecte l'utilisateur (appel API + nettoyage local).
     * Redirige vers la page de connexion.
     */
    deconnexion: async (): Promise<void> => {
        try {
            await api.post("/auth/logout", null, true);
        } catch (erreur) {
            console.warn("Déconnexion serveur impossible, nettoyage local forcé :", erreur);
        } finally {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("estConnecte");
            sessionStorage.removeItem("nomAdmin");
            sessionStorage.removeItem("emailAdmin");
        }
    },
};

export default authService;
