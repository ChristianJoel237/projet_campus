// AgentsContext.tsx - Version compatible API
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api'; // Votre service API

export interface Agent {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  zone: string;
  role: 'verification' | 'validation' | 'admin';
  statut: 'actif' | 'inactif' | 'en_conge';
  dossiers: number;
  login: string;
  dateInscription: string;
  email?: string;
}

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  ajouterAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
  modifierAgent: (id: string, agent: Partial<Agent>) => Promise<void>;
  supprimerAgent: (id: string) => Promise<void>;
  getAgentById: (id: string) => Agent | undefined;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const useAgents = () => {
  const context = useContext(AgentsContext);
  if (!context) throw new Error('useAgents doit être utilisé dans un AgentsProvider');
  return context;
};

export const AgentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les agents au démarrage
  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/agents');
      setAgents(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des agents');
      console.error('Fetch agents error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un agent via API
  const ajouterAgent = async (nouvelAgent: Omit<Agent, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/agents', nouvelAgent);
      setAgents(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création de l\'agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modifier un agent via API
  const modifierAgent = async (id: string, updates: Partial<Agent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/agents/${id}`, updates);
      setAgents(prev => prev.map(agent => 
        agent.id === id ? response.data : agent
      ));
    } catch (err) {
      setError('Erreur lors de la modification de l\'agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un agent via API
  const supprimerAgent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/agents/${id}`);
      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAgentById = (id: string) => {
    return agents.find(agent => agent.id === id);
  };

  // Chargement initial
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <AgentsContext.Provider value={{
      agents,
      loading,
      error,
      fetchAgents,
      ajouterAgent,
      modifierAgent,
      supprimerAgent,
      getAgentById,
    }}>
      {children}
    </AgentsContext.Provider>
  );
};