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
};

export default authService;
