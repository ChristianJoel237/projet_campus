<<<<<<< HEAD
// src/services/agents.service.ts
import { api, ApiResponse } from './apiConfig';
import type { Agent } from '../context/AgentsContext';

export interface CreateAgentDTO {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  motDePasse: string;
}

export const agentsService = {
  /**
   * Récupérer tous les agents
   */
  getAll: async (): Promise<Agent[]> => {
    const response = await api.get<ApiResponse<Agent[]>>('/agents');
    return response.donnees || [];
  },

  /**
   * Récupérer un agent par ID
   */
  getById: async (id: string): Promise<Agent> => {
    const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
    if (!response.donnees) throw new Error('Agent non trouvé');
    return response.donnees;
  },

  /**
   * Créer un nouvel agent
   */
  create: async (data: CreateAgentDTO): Promise<Agent> => {
    const response = await api.post<ApiResponse<Agent>>('/agents', data);
    if (!response.donnees) throw new Error('Erreur lors de la création');
    return response.donnees;
  },

  /**
   * Mettre à jour un agent
   */
  update: async (id: string, data: Partial<CreateAgentDTO>): Promise<Agent> => {
    const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
    if (!response.donnees) throw new Error('Erreur lors de la mise à jour');
    return response.donnees;
  },

  /**
   * Supprimer un agent
   */
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/agents/${id}`);
  },
=======
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

    getById: async (id: string): Promise<Agent> => {
        const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
        if (!response.donnees) throw new Error("Agent non trouvé");
        return response.donnees;
    },

    create: async (data: CreateAgentDTO): Promise<Agent | null> => {
        const response = await api.post<any>("/auth/create-agent-terrain", data);
        const agentCree =
            response?.donnees || response?.agent || response?.data || response?.user || response?.utilisateur || null;
        if (agentCree && typeof agentCree === "object" && agentCree.id) {
            return agentCree as Agent;
        }
        if (response?.message) return null;
        throw new Error("Format de réponse inattendu");
    },

    delete: async (email: string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/auth/deleteUser?email=${encodeURIComponent(email)}`);
    },

    suspendre: async (email: string): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/auth/suspendUser?email=${encodeURIComponent(email)}`);
    },
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
};
