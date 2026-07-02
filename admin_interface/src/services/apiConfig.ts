// src/services/apiConfig.ts
import * as db from "../donnees/donneesFictives";

// Configuration du mode mock
const USE_MOCK_GLOBAL: boolean = import.meta.env.VITE_USE_MOCK === "true";
const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ApiResponse<T = unknown> {
    succes: boolean;
    donnees?: T;
    message?: string;
    erreurs?: string[];
    [key: string]: any;
}

// ── Helpers Mock ─────────────────────────────────────────────────────────────
const formaterListePaginee = (cle: string, liste: any[]) => ({
    [cle]: liste,
    total: liste.length,
    page: 1,
    pages: 1,
});

const reponsesMock: Record<string, (corps: any) => any> = {
    "GET /agents": () => ({ donnees: db.agents || [], ...formaterListePaginee("agents", db.agents || []) }),
    "GET /utilisateurs": () => ({
        donnees: db.utilisateurs || [],
        ...formaterListePaginee("utilisateurs", db.utilisateurs || []),
    }),
    "GET /credits": () => ({ donnees: db.credits || [], ...formaterListePaginee("credits", db.credits || []) }),
    "POST /auth/login": () => ({ token: "mock-token-" + Date.now(), succes: true }),
};

// ── Moteur de requête ────────────────────────────────────────────────────────
const requete = async <T = unknown>(
    methode: string,
    endpoint: string,
    corps: unknown = null,
    avecAuth: boolean = true,
): Promise<T> => {
    // Mode Mock
    if (USE_MOCK_GLOBAL) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        const cle = `${methode} ${endpoint}`;
        if (reponsesMock[cle]) return reponsesMock[cle](corps) as T;
        return { succes: true, donnees: corps } as unknown as T;
    }

    // Mode Réel
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

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/connexion";
        throw new Error("Session expirée");
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);
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
