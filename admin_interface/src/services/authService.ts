// import { api } from './apiConfig';

export interface ReponseConnexion {
  token: string;
}

export const authService = {
  seConnecter: (
    email: string,
    motDePasse: string
  ): Promise<ReponseConnexion> => {
    // Backend not connected yet. Use mock data locally for development.
    // When ready, uncomment the API call below and remove the mock implementation.

    // return api.post<ReponseConnexion>('/auth/login', { email, motDePasse }, false);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'mock-jwt-token-1234567890' });
      }, 500);
    });
  },
};

export default authService;
