// src/services/agents.service.ts
import { api, ApiResponse } from "./apiConfig";
import type { Agent } from "../context/AgentsContext";

export interface CreateAgentDTO {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    ville: string;
    password: string;
}

export const agentsService = {
    /**
     * Récupérer tous les agents de terrain
     */
    getAll: async (): Promise<Agent[]> => {
        const response = await api.get<any>("/auth/get-by-role?role=ROLE_AGENT_DE_TERRAIN");
        const liste =
            response?.donnees ||
            response?.agents ||
            response?.data ||
            response?.utilisateurs ||
            response?.users ||
            (Array.isArray(response) ? response : []);
        return liste || [];
    },

    /**
     * Récupérer un agent par son ID
     */
    getById: async (id: string): Promise<Agent> => {
        const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
        if (!response.donnees) throw new Error("Agent non trouvé");
        return response.donnees;
    },

    /**
     * Créer un nouvel agent de terrain
     */
    create: async (data: CreateAgentDTO): Promise<Agent | null> => {
        const response = await api.post<any>("/auth/create-agent-terrain", data);
        const agentCree =
            response?.donnees || response?.agent || response?.data || response?.user || response?.utilisateur || null;

        if (agentCree && typeof agentCree === "object" && agentCree.id) {
            return agentCree as Agent;
        }
        if (response?.message) return null;
        throw new Error("Format de réponse inattendu lors de la création");
    },

    /**
     * Mettre à jour les informations d'un agent
     */
    update: async (id: string, data: Partial<CreateAgentDTO> & { statut?: string }): Promise<Agent> => {
        const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
        if (!response.donnees) throw new Error("Erreur lors de la mise à jour de l'agent");
        return response.donnees;
    },

    /**
     * Supprimer un agent par son email
     */
    delete: async (email: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/auth/deleteUser?email=${encodeURIComponent(email)}`);
    },

    /**
     * Suspendre un agent par son email
     */
    suspendre: async (email: string): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/auth/suspendUser?email=${encodeURIComponent(email)}`);
    },
};
