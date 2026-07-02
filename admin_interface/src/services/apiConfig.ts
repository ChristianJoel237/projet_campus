// ============================================
// CONFIGURATION CENTRALE DE L'API
// ============================================
<<<<<<< HEAD

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  succes: boolean;
  donnees?: T;
  message?: string;
  erreurs?: string[];
}

// URL de base de l'API
const API_URL: string = import.meta.env.VITE_API_URL;
// Récupérer le token stocké
const getToken = (): string | null => localStorage.getItem('token');

// Headers communs
const headers = (avecAuth: boolean = true): HeadersInit => ({
  'Content-Type': 'application/json',
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
    localStorage.removeItem('token');
    localStorage.removeItem('estConnecte');
    localStorage.removeItem('nomAdmin');
    localStorage.removeItem('emailAdmin');
    window.location.href = '/connexion';
    throw new Error('Session expirée');
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
    requete<T>('GET', endpoint, null, avecAuth),

  /**
   * Requête POST
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête (peut être null)
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  post: <T = unknown>(
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true
  ): Promise<T> => requete<T>('POST', endpoint, corps, avecAuth),

  /**
   * Requête PUT
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  put: <T = unknown>(
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true
  ): Promise<T> => requete<T>('PUT', endpoint, corps, avecAuth),

  /**
   * Requête PATCH
   * @param endpoint - Chemin de l'endpoint
   * @param corps - Corps de la requête
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  patch: <T = unknown>(
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true
  ): Promise<T> => requete<T>('PATCH', endpoint, corps, avecAuth),

  /**
   * Requête DELETE
   * @param endpoint - Chemin de l'endpoint
   * @param avecAuth - Si true, inclut le token d'authentification
   * @returns Promise avec les données typées
   */
  delete: <T = unknown>(
    endpoint: string,
    avecAuth: boolean = true
  ): Promise<T> => requete<T>('DELETE', endpoint, null, avecAuth),
=======
import * as db from "../donnees/donneesFictives";

/**
 * Contrat de réponse standardisé de l'API.
 * Exporté pour résoudre l'erreur d'importation dans les fichiers de services.
 */
export interface ApiResponse<T> {
    donnees?: T;
    succes?: boolean;
    message?: string;
    [key: string]: any; // Tolère les métadonnées de pagination sans générer d'erreurs de typage
}

const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8080";
const USE_MOCK_GLOBAL: boolean = import.meta.env.VITE_USE_MOCK === "true";

/**
 * Construit une réponse paginée standard pour les listes.
 * Respecte le contrat { [cle]: T[], total, page, pages } attendu par les services.
 */
const formaterListePaginee = (cle: string, liste: any[]) => ({
    [cle]: liste,
    total: liste.length,
    page: 1,
    pages: 1,
});

// Map des routes HTTP simulées
const reponsesMock: Record<string, (corps: unknown) => unknown> = {
    "POST /auth/login": () => ({
        token: "mock-jwt-token-dev-" + Date.now(),
    }),

    "POST /auth/logout": () => ({
        succes: true,
        message: "Session mockée détruite localement.",
    }),

    // Mis à jour pour inclure la propriété 'donnees' lue par agentsService.getAll()
    "GET /agents": () => ({
        ...formaterListePaginee("agents", db.agents || []),
        donnees: db.agents || [],
    }),

    "GET /rapports/dashboard": () => ({
        succes: true,
        ...(db.statistiquesGenerales || {}),
    }),

    "GET /utilisateurs": () => ({
        ...formaterListePaginee("utilisateurs", db.utilisateurs || []),
        donnees: db.utilisateurs || [],
    }),

    "GET /credits": () => ({
        ...formaterListePaginee("credits", db.credits || []),
        donnees: db.credits || [],
    }),

    "GET /epargnes": () => ({
        ...formaterListePaginee("epargnes", db.epargnes || []),
        donnees: db.epargnes || [],
    }),

    "GET /transactions": () => ({
        ...formaterListePaginee("transactions", db.transactions || []),
        donnees: db.transactions || [],
    }),

    "GET /notifications": () => ({
        ...formaterListePaginee("notifications", []),
        donnees: [],
    }),
};

/**
 * Simulateur de requêtes réseau pour le mode de développement hors-ligne
 */
const requeteMock = async <T = unknown>(methode: string, endpoint: string, corps: unknown): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const cle = `${methode} ${endpoint}`;
    const generateur = reponsesMock[cle];

    if (!generateur) {
        if (["PATCH", "DELETE", "PUT"].includes(methode)) {
            return {
                succes: true,
                message: `Opération ${methode} simulée avec succès.`,
                donnees: corps, // Renvoie le corps simulé pour les besoins du PUT/PATCH
            } as T;
        }

        console.warn(`[MOCK] Aucun point d'accès simulé trouvé pour "${cle}".`);
        return {} as T;
    }

    console.info(`[MOCK ACTIF] ${cle}`);
    return generateur(corps) as T;
};

/**
 * Routeur principal : Aiguille les requêtes vers le serveur réel ou vers le simulateur Mock.
 * Bascule contrôlée uniquement par VITE_USE_MOCK.
 */
const requete = async <T = unknown>(
    methode: string,
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true,
): Promise<T> => {
    if (USE_MOCK_GLOBAL) {
        return requeteMock<T>(methode, endpoint, corps);
    }

    const options: RequestInit = {
        method: methode,
        headers: {
            "Content-Type": "application/json",
            ...(avecAuth && localStorage.getItem("token")
                ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
                : {}),
        },
        ...(corps !== null ? { body: JSON.stringify(corps) } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/connexion";
        throw new Error("Session expirée ou non autorisée.");
    }

    const texte = await response.text();
    const data = texte ? JSON.parse(texte) : {};

    if (!response.ok) {
        throw new Error(data.message || `Code d'erreur serveur : ${response.status}`);
    }

    return data as T;
};

export const api = {
    get: <T = unknown>(endpoint: string, avecAuth: boolean = true): Promise<T> =>
        requete<T>("GET", endpoint, null, avecAuth),
    post: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
        requete<T>("POST", endpoint, corps, avecAuth),
    put: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
        requete<T>("PUT", endpoint, corps, avecAuth),
    patch: <T = unknown>(endpoint: string, corps: unknown = null, avecAuth: boolean = true): Promise<T> =>
        requete<T>("PATCH", endpoint, corps, avecAuth),
    delete: <T = unknown>(endpoint: string, avecAuth: boolean = true): Promise<T> =>
        requete<T>("DELETE", endpoint, null, avecAuth),
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
};

export default api;
