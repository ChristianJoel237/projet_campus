import { api } from "./apiConfig";

export interface ReponseConnexion {
    token: string;
}

export const authService = {
    seConnecter: async (email: string, password: string): Promise<ReponseConnexion> => {
        // 1. Debug : Vérification explicite de ce qui est transmis avant l'appel API
        console.log("DEBUG - Envoi vers API :", { email, password });

        // 2. Appel de l'API
        // Assure-toi que ton api.post gère bien le format JSON
        const reponse = await api.post<any>(
            "/auth/login",
            {
                email,
                password,
            },
            false,
        );

        // 3. Debug : Visualiser la réponse brute pour identifier la structure réelle
        console.log("DEBUG - Réponse brute du serveur :", reponse);

        // 4. Extraction sécurisée
        // Vérifie bien dans l'onglet Network de ton F12 la structure réelle renvoyée
        const token = reponse?.token || reponse?.access_token || reponse?.accessToken || reponse?.data?.token || null;

        if (!token) {
            throw new Error("Authentification échouée : Le serveur n'a pas retourné de jeton (token).");
        }

        // 5. Stockage persistant
        localStorage.setItem("token", token);
        localStorage.setItem("estConnecte", "true");

        return { token };
    },

    deconnexion: async (): Promise<void> => {
        try {
            await api.post("/auth/logout", null, true);
        } catch (erreur) {
            console.warn("Déconnexion serveur impossible, nettoyage local forcé :", erreur);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("estConnecte");
            localStorage.removeItem("nomAdmin");
            localStorage.removeItem("emailAdmin");
            window.location.href = "/connexion";
        }
    },
};

export default authService;
