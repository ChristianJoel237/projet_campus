// services/notificationService.ts
import { api } from "./apiConfig";
import { USE_MOCK } from "../hooks/useMock";

// ============================================
// TYPES
// ============================================

export interface Notification {
    id: string;
    titre: string;
    message: string;
    type: "info" | "succes" | "avertissement" | "erreur";
    lu: boolean;
    date: string;
    icone?: string;
    couleur?: string;
}

export interface ReponseListeNotifications {
    notifications: Notification[];
    nombreNonLus: number;
}

export interface ReponseNotificationLue {
    notification: {
        id: string;
        lu: boolean;
    };
}

export interface ReponseMessage {
    message: string;
}

export interface ParamsNotifications {
    lu?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
}

export type WebSocketMessageHandler = (notification: Notification) => void;

// ============================================
// SERVICE
// ============================================

export const notificationService = {
    /**
     * Liste toutes les notifications (avec gestion alternative du mode MOCK)
     * GET /api/notifications?lu=false
     */
    listerTous: async (params: ParamsNotifications = {}): Promise<ReponseListeNotifications> => {
        if (USE_MOCK) {
            console.log("%c[MOCK] Récupération de la liste des notifications", "color: #10b981; font-weight: bold;");
            const now = new Date();
            return {
                notifications: [
                    {
                        id: "mock-1",
                        titre: "Nouveau crédit en attente",
                        message: "Kenfack Paul demande 250 000 FCFA",
                        type: "avertissement",
                        lu: false,
                        date: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
                        icone: "credit",
                        couleur: "#F59E0B",
                    },
                    {
                        id: "mock-2",
                        titre: "Crédit en retard",
                        message: "Kamdem Marie — 120 000 FCFA non remboursé",
                        type: "erreur",
                        lu: false,
                        date: new Date(now.getTime() - 120 * 60 * 1000).toISOString(),
                        icone: "retard",
                        couleur: "#ef4444",
                    },
                ],
                nombreNonLus: 2,
            };
        }

        const query = new URLSearchParams();
        if (params.lu !== undefined) query.append("lu", String(params.lu));
        if (params.type) query.append("type", params.type);
        if (params.limit) query.append("limit", String(params.limit));
        if (params.offset) query.append("offset", String(params.offset));

        const queryString = query.toString();
        const url = queryString ? `/notifications?${queryString}` : "/notifications";
        return api.get<ReponseListeNotifications>(url);
    },

    /**
     * Marquer une notification comme lue
     * PATCH /api/notifications/:id/lire
     */
    marquerCommeLu: async (id: string): Promise<ReponseNotificationLue> => {
        if (USE_MOCK) return { notification: { id, lu: true } };
        return api.patch<ReponseNotificationLue>(`/notifications/${id}/lire`, null);
    },

    /**
     * Marquer toutes les notifications comme lues
     * PATCH /api/notifications/lire-tout
     */
    marquerToutCommeLu: async (): Promise<ReponseMessage> => {
        if (USE_MOCK) return { message: "Toutes les notifications ont été marquées comme lues" };
        return api.patch<ReponseMessage>("/notifications/lire-tout", null);
    },

    /**
     * Supprimer une notification
     * DELETE /api/notifications/:id
     */
    supprimer: async (id: string): Promise<ReponseMessage> => {
        if (USE_MOCK) return { message: "Notification supprimée" };
        return api.delete<ReponseMessage>(`/notifications/${id}`);
    },

    /**
     * Connexion WebSocket pour écouter les notifications en temps réel
     * WS /ws/notifications?token=...
     */
    connecterWebSocket: (onMessage: WebSocketMessageHandler): (() => void) => {
        if (USE_MOCK) {
            console.log("%c[MOCK WS] Connexion WebSocket simulée active", "color: #10b981; font-weight: bold;");
            return () => console.log("%c[MOCK WS] Connexion WebSocket simulée fermée", "color: #ef4444;");
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Aucun jeton d'authentification disponible, reconnexion WebSocket avortée.");
            return () => {};
        }

        const wsBase = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";
        const wsUrl = `${wsBase.replace(/\/$/, "")}/notifications?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event: MessageEvent) => {
            try {
                const notification: Notification = JSON.parse(event.data);
                onMessage(notification);
            } catch {
                console.error("Erreur de décodage de la notification reçue par WebSocket");
            }
        };

        ws.onerror = (err: Event) => console.error("Dysfonctionnement de la passerelle WebSocket:", err);

        return () => ws.close();
    },
};

export default notificationService;
