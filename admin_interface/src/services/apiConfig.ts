// ============================================
// CONFIGURATION CENTRALE DE L'API
// ============================================

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  succes: boolean;
  donnees?: T;
  message?: string;
  erreurs?: string[];
}

// URL de base de l'API
const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Récupérer le token stocké
const getToken = (): string | null => localStorage.getItem("token");

// Headers communs
const headers = (avecAuth: boolean = true): HeadersInit => ({
  "Content-Type": "application/json",
  ...(avecAuth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Requête générique typée
const requete = async <T = unknown>(
  methode: string,
  endpoint: string,
  corps: unknown = null,
  avecAuth: boolean = true
): Promise<T> => {
  const options: RequestInit = {
    method: methode,
    headers: headers(avecAuth),
    ...(corps !== null ? { body: JSON.stringify(corps) } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  // Token expiré → déconnexion automatique
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("estConnecte");
    localStorage.removeItem("nomAdmin");
    localStorage.removeItem("emailAdmin");
    window.location.href = "/connexion";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error(data.message || `Erreur ${response.status}`);
  }

  return data as T;
};

// API avec méthodes typées
export const api = {
  /**
   * Requête GET
   * @param endpoint - Chemin de l'endpoint
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  get: <T = unknown>(endpoint: string, avecAuth: boolean = true): Promise<T> =>
    requete<T>("GET", endpoint, null, avecAuth),

  /**
   * Requête POST
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête (peut être null)
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  post: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
    requete<T>("POST", endpoint, corps, avecAuth),

  /**
   * Requête PUT
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  put: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
    requete<T>("PUT", endpoint, corps, avecAuth),

  /**
   * Requête PATCH
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  patch: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
    requete<T>("PATCH", endpoint, corps, avecAuth),

  /**
   * Requête DELETE
   * @param endpoint - Chemin de l'endpoint
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  delete: <T = unknown>(endpoint: string, avecAuth: boolean = true): Promise<T> =>
    requete<T>("DELETE", endpoint, null, avecAuth),
};

export default api;