// src/services/agents.service.ts
import { api, ApiResponse } from './api';
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
};