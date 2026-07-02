<<<<<<< HEAD
 import { api } from './apiConfig';

export interface ReponseConnexion {
  token: string;
}

export const authService = {
  seConnecter: async(
    email: string,
    motDePasse: string
  ): Promise<ReponseConnexion> => {
    // Backend not connected yet. Use mock data locally for development.
    // When ready, uncomment the API call below and remove the mock implementation.

    const donnees = await api.post<ReponseConnexion>('/auth/login', { email, motDePasse }, false);
    if (donnees && donnees.token){
      localStorage.setItem('token',donnees.token)
      localStorage.setItem('estConnecte','true')
    }
    return donnees 
    //return new Promise((resolve) => {
      //setTimeout(() => {
       // resolve({ token: 'mock-jwt-token-1234567890' });
     // }, 500);
    //});
  },

  deconnexion :() =>{
    localStorage.removeItem('token');
    localStorage.removeItem('estConnecte');
    window.location.href='/connexion'
  }
=======
import { api } from "./apiConfig";

export interface ReponseConnexion {
    token: string;
}

export const authService = {
    seConnecter: async (email: string, password: string): Promise<ReponseConnexion> => {
        // Appel sans authentification préalable (le token n'existe pas encore)
        const reponse = await api.post<any>("/auth/login", { email, password }, false);
        console.log("Réponse brute login :", reponse);

        // Cherche le token à différents endroits possibles
        const token =
            reponse?.access_token || // <-- c'est celui que le serveur envoie
            reponse?.token ||
            reponse?.donnees?.token ||
            reponse?.data?.token ||
            reponse?.accessToken ||
            null;

        if (!token) {
            throw new Error("Aucun token reçu du serveur");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("estConnecte", "true");
        return { token };
    },

    deconnexion: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } catch (erreur) {
            console.warn("Déconnexion côté serveur impossible :", erreur);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("estConnecte");
            localStorage.removeItem("nomAdmin");
            localStorage.removeItem("emailAdmin");
            window.location.href = "/connexion";
        }
    },
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
};

export default authService;
