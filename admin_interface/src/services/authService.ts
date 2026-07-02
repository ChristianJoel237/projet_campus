import { api } from "./apiConfig";

export interface ReponseConnexion {
    token: string;
}

export const authService = {
    seConnecter: async (email: string, password: string): Promise<ReponseConnexion> => {
        // On appelle l'API sans authentification (le token n'existe pas encore)
        const reponse = await api.post<any>("/auth/login", { email, password }, false);

        // Extraction robuste du token selon le format renvoyé par le backend
        const token =
            reponse?.access_token ||
            reponse?.token ||
            reponse?.donnees?.token ||
            reponse?.data?.token ||
            reponse?.accessToken ||
            null;

        if (!token) {
            throw new Error("Authentification échouée : Aucun token reçu.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("estConnecte", "true");
        return { token };
    },

    deconnexion: async (): Promise<void> => {
        try {
            // Tentative d'invalidation de la session côté serveur
            await api.post("/auth/logout", null, true);
        } catch (erreur) {
            console.warn("Déconnexion serveur impossible, nettoyage local forcé :", erreur);
        } finally {
            // Nettoyage complet des données de session locales
            localStorage.removeItem("token");
            localStorage.removeItem("estConnecte");
            localStorage.removeItem("nomAdmin");
            localStorage.removeItem("emailAdmin");
            window.location.href = "/connexion";
        }
    },
};

export default authService;
