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

const reponsesMock: Record<string, (corps: any) => any> = {
    "GET /agents": () => ({ donnees: db.agents || [], succes: true }),
    "POST /auth/login": () => ({ token: "mock-token-" + Date.now(), succes: true }),
};

// ══════════════════════════════════════════════════════════════════════════════
// 🔁 Logique de refresh token
// ══════════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════════
// 📡 Requête générique
// ══════════════════════════════════════════════════════════════════════════════
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
        if (reponsesMock[cle]) return reponsesMock[cle](corps) as T;
        return { succes: true, donnees: corps } as unknown as T;
    }

    // 2. Construction dynamique des headers (lecture du token dans sessionStorage)
    const getHeaders = (): HeadersInit => {
        const token = sessionStorage.getItem("token"); // ← sessionStorage
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

    // 3. Si 401 → tentative de refresh silencieux
    if (response.status === 401 && avecAuth && !endpoint.includes("/auth/login")) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshAccessToken();
                processQueue(null, newToken);
                // Réessayer la requête avec le nouveau token
                const newHeaders = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                };
                response = await makeRequest(newHeaders);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Échec du refresh → déconnexion propre
                sessionStorage.clear();
                window.location.href = "/connexion";
                throw new Error("Session expirée, veuillez vous reconnecter.");
            } finally {
                isRefreshing = false;
            }
        } else {
            // Un refresh est déjà en cours → mettre la requête en file d'attente
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

    // 4. Lecture et parsing de la réponse (protection anti-json vide)
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

// ══════════════════════════════════════════════════════════════════════════════
// 🛠️ Export de l'objet api
// ══════════════════════════════════════════════════════════════════════════════
export const api = {
    get: <T>(e: string, a: boolean = true) => requete<T>("GET", e, null, a),
    post: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("POST", e, c, a),
    put: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PUT", e, c, a),
    patch: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PATCH", e, c, a),
    delete: <T>(e: string, a: boolean = true) => requete<T>("DELETE", e, null, a),
};

export default api;
