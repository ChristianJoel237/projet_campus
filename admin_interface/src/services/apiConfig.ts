// src/services/apiConfig.ts
import * as db from "../donnees/donneesFictives";

const USE_MOCK_GLOBAL: boolean = import.meta.env.VITE_USE_MOCK === "true";
const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ApiResponse<T = unknown> {
    succes: boolean;
    donnees?: T;
    message?: string;
    erreurs?: string[];
    [key: string]: any;
}

// ─── Simulation de l'authentification en mode mock ────────────────────────────
const MOCK_TOKEN_DURATION_MS = 30_000; // 30 secondes (pour tester l'expiration)
const MOCK_REFRESH_TOKEN_DURATION_MS = 120_000; // 2 minutes

// Stockage simulé des tokens (en mémoire car on utilise déjà sessionStorage)
let mockAccessToken: string | null = null;
let mockRefreshToken: string | null = null;
let mockAccessTokenExpiry: number | null = null;

// Génère un faux token avec une date d'expiration
function generateMockToken(): string {
    const now = Date.now();
    mockAccessTokenExpiry = now + MOCK_TOKEN_DURATION_MS;
    // Le token contient une date d'expiration pour vérification ultérieure
    return `mock-access-${now}-expire-${mockAccessTokenExpiry}`;
}

// Vérifie si le token mock est expiré
function isMockTokenExpired(): boolean {
    if (!mockAccessTokenExpiry) return true;
    return Date.now() > mockAccessTokenExpiry;
}

// Rafraîchit le token mock (renouvelle l'expiration)
function refreshMockToken(): string {
    const newToken = generateMockToken();
    mockAccessToken = newToken;
    mockRefreshToken = `mock-refresh-${Date.now() + MOCK_REFRESH_TOKEN_DURATION_MS}`;
    // Persiste dans sessionStorage pour être cohérent avec le mode réel
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("refreshToken", mockRefreshToken);
    return newToken;
}

// Initialisation : si on a déjà des tokens en session (après une connexion mock),
// on les restaure dans les variables mock
const savedToken = sessionStorage.getItem("token");
const savedRefresh = sessionStorage.getItem("refreshToken");
if (savedToken && savedRefresh) {
    mockAccessToken = savedToken;
    mockRefreshToken = savedRefresh;
    // On ne peut pas retrouver l'expiration exacte, on suppose qu'elle est encore valide
    // (pour simplifier, on la considérera valide)
    mockAccessTokenExpiry = null; // l'expiration sera gérée différemment
}

// ─── Réponses mock (inclut maintenant les endpoints d'authentification) ──────
const reponsesMock: Record<string, (corps: any) => any> = {
    "GET /agents": () => ({ donnees: db.agents || [], succes: true }),

    "POST /auth/login": (corps: any) => {
        // Accepte n'importe quel email/password en mock
        const token = generateMockToken();
        mockAccessToken = token;
        mockRefreshToken = `mock-refresh-${Date.now() + MOCK_REFRESH_TOKEN_DURATION_MS}`;
        // Stockage dans sessionStorage pour que le frontend puisse le récupérer
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("refreshToken", mockRefreshToken);
        return {
            token,
            refreshToken: mockRefreshToken,
            succes: true,
        };
    },

    "POST /auth/refresh": (corps: any) => {
        // Simule le renouvellement du token (si le refresh token est valide)
        const refreshToken = corps?.token || corps?.refreshToken;
        if (refreshToken && refreshToken === mockRefreshToken) {
            const newToken = refreshMockToken(); // met à jour sessionStorage et les variables mock
            return {
                accessToken: newToken,
                refreshToken: mockRefreshToken,
                succes: true,
            };
        } else {
            return { succes: false, message: "Refresh token invalide" };
        }
    },

    "POST /auth/logout": () => {
        mockAccessToken = null;
        mockRefreshToken = null;
        mockAccessTokenExpiry = null;
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
        return { succes: true };
    },
};

// ─── Refresh token réel/mock ──────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

async function refreshAccessToken(): Promise<string> {
    if (USE_MOCK_GLOBAL) {
        // En mock, on appelle la réponse mock directement
        if (!mockRefreshToken) throw new Error("Aucun refresh token");
        // Simule l'appel au endpoint de refresh
        const reponse = reponsesMock["POST /auth/refresh"]({ token: mockRefreshToken });
        if (!reponse.succes) throw new Error("Refresh token invalide");
        return reponse.accessToken;
    }

    // Mode réel
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Aucun refresh token");

    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh token invalide");

    const data = await response.json();
    const newAccessToken = data.accessToken || data.token;
    if (!newAccessToken) throw new Error("Token manquant dans la réponse");

    sessionStorage.setItem("token", newAccessToken);
    if (data.refreshToken) {
        sessionStorage.setItem("refreshToken", data.refreshToken);
    }
    return newAccessToken;
}

// ─── Requête générique ────────────────────────────────────────────────────────
const requete = async <T = unknown>(
    methode: string,
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true,
): Promise<T> => {
    // 1. Mode Mock
    if (USE_MOCK_GLOBAL) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        const cle = `${methode} ${endpoint}`;

        // Vérification de l'authentification mock
        if (avecAuth && !cle.includes("/auth/login") && !cle.includes("/auth/refresh")) {
            const token = sessionStorage.getItem("token");
            if (!token || isMockTokenExpired()) {
                // Si pas de token ou token expiré, tente un refresh silencieux
                try {
                    await refreshAccessToken();
                } catch (e) {
                    // Refresh échoué → déconnexion
                    sessionStorage.clear();
                    window.location.href = "/connexion";
                    throw new Error("Session expirée");
                }
            }
        }

        // Exécute la réponse mock si elle existe, sinon retourne un succès générique
        if (reponsesMock[cle]) {
            return reponsesMock[cle](corps) as T;
        }

        // Pour les endpoints inconnus, on simule une réponse réussie avec les données fournies
        return { succes: true, donnees: corps } as unknown as T;
    }

    // 2. Mode Réel (inchangé)
    const getHeaders = (): HeadersInit => {
        const token = sessionStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(avecAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    const makeRequest = (headers: HeadersInit) =>
        fetch(`${API_URL}${endpoint}`, {
            method: methode,
            headers,
            ...(corps !== null ? { body: JSON.stringify(corps) } : {}),
        });

    let response = await makeRequest(getHeaders());

    if (response.status === 401 && avecAuth && !endpoint.includes("/auth/login")) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshAccessToken();
                processQueue(null, newToken);
                const newHeaders = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                };
                response = await makeRequest(newHeaders);
            } catch (refreshError) {
                processQueue(refreshError, null);
                sessionStorage.clear();
                window.location.href = "/connexion";
                throw new Error("Session expirée, veuillez vous reconnecter.");
            } finally {
                isRefreshing = false;
            }
        } else {
            try {
                const newToken = await new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve: resolve as any, reject });
                });
                const newHeaders = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                };
                response = await makeRequest(newHeaders);
            } catch (err) {
                sessionStorage.clear();
                window.location.href = "/connexion";
                throw new Error("Session expirée.");
            }
        }
    }

    const texteReponse = await response.text();
    let data: any;
    try {
        data = texteReponse ? JSON.parse(texteReponse) : {};
    } catch (e) {
        console.error("Erreur parsing JSON:", e);
        data = { message: "Erreur serveur inattendue" };
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || `Erreur ${response.status}`);
    }

    return data as T;
};

// ─── Export de l'objet api ────────────────────────────────────────────────────
export const api = {
    get: <T>(e: string, a: boolean = true) => requete<T>("GET", e, null, a),
    post: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("POST", e, c, a),
    put: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PUT", e, c, a),
    patch: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PATCH", e, c, a),
    delete: <T>(e: string, a: boolean = true) => requete<T>("DELETE", e, null, a),
};

export default api;
