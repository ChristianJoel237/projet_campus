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
    getAll: async (): Promise<Agent[]> => {
        const response = await api.get<any>("/Admin/get-users-by-role?role=ROLE_AGENT_TERRAIN");
        const liste =
            response?.donnees ||
            response?.agents ||
            response?.data ||
            response?.utilisateurs ||
            response?.users ||
            (Array.isArray(response) ? response : []);
        return liste || [];
    },

    getById: async (id: string): Promise<Agent> => {
        const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
        if (!response.donnees) throw new Error("Agent non trouvé");
        return response.donnees;
    },

    create: async (data: CreateAgentDTO): Promise<Agent | null> => {
        const response = await api.post<any>("/Admin/create-agent", data);
        const agentCree =
            response?.donnees || response?.agent || response?.data || response?.user || response?.utilisateur || null;
        if (agentCree && typeof agentCree === "object" && agentCree.id) return agentCree as Agent;
        if (response?.message) return null;
        throw new Error("Format de réponse inattendu lors de la création");
    },

    update: async (id: string, data: Partial<CreateAgentDTO> & { statut?: string }): Promise<Agent> => {
        const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
        if (!response.donnees) throw new Error("Erreur lors de la mise à jour de l'agent");
        return response.donnees;
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/auth/delete-user/${id}`);
    },

    changerStatutAgent: async (email: string, statut: string): Promise<void> => {
        await api.patch<ApiResponse<void>>(
            `/Admin/change-status?email=${encodeURIComponent(email)}&status=${encodeURIComponent(statut.toUpperCase())}`,
        );
    },
};
