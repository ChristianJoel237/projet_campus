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

    // 2. Mode Réel
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(avecAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: methode,
        headers,
        ...(corps !== null ? { body: JSON.stringify(corps) } : {}),
    });

    // 3. Gestion session expirée
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/connexion";
        throw new Error("Session expirée");
    }

    // 4. Gestion robuste de la réponse (Anti-Crash JSON)
    const texteReponse = await response.text();
    let data: any;

    try {
        data = texteReponse ? JSON.parse(texteReponse) : {};
    } catch (e) {
        console.error("Erreur parsing JSON:", e);
        data = { message: "Erreur serveur inattendue" };
    }

    if (!response.ok) {
        // Retourne le message d'erreur spécifique du backend (ex: 403 Forbidden)
        throw new Error(data.message || data.error || `Erreur ${response.status}`);
    }

    return data as T;
};

export const api = {
    get: <T>(e: string, a: boolean = true) => requete<T>("GET", e, null, a),
    post: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("POST", e, c, a),
    put: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PUT", e, c, a),
    patch: <T>(e: string, c: any = null, a: boolean = true) => requete<T>("PATCH", e, c, a),
    delete: <T>(e: string, a: boolean = true) => requete<T>("DELETE", e, null, a),
};

export default api;
