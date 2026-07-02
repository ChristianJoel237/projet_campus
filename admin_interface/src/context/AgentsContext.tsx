<<<<<<< HEAD
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
=======
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { agentsService, CreateAgentDTO } from "../services/agentService";
import * as db from "../donnees/donneesFictives";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface Agent {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    ville: string;
    email: string;
    statut: "actif" | "suspendu";
    dateInscription?: string;
    zone?: string;
    role?: "verification" | "validation" | "admin";
}

interface AgentsContextType {
    agents: Agent[];
    loading: boolean;
    error: string | null;
    fetchAgents: () => Promise<void>;
    ajouterAgent: (
        agent: Omit<Agent, "id" | "dateInscription" | "statut"> & {
            password?: string;
            statut?: "actif" | "suspendu";
        },
    ) => Promise<void>;
    supprimerAgent: (email: string) => Promise<void>;
    suspendreAgent: (email: string) => Promise<void>;
    getAgentById: (id: string) => Agent | undefined;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const useAgents = () => {
<<<<<<< HEAD
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
=======
    const context = useContext(AgentsContext);
    if (!context) throw new Error("useAgents doit être utilisé dans un AgentsProvider");
    return context;
};

export const AgentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const normaliserStatuts = (liste: any[]): Agent[] => {
        return (liste || []).map((a: any) => ({
            ...a,
            id: String(a.id ?? a.userId ?? a.idUser ?? a.agentId ?? ""),
            statut: a?.statut === "suspendu" ? "suspendu" : "actif",
        }));
    };

    const fetchAgents = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (USE_MOCK) {
            setAgents(normaliserStatuts(db.agents || []));
            setLoading(false);
            return;
        }
        try {
            const data = await agentsService.getAll();
            setAgents(normaliserStatuts(data));
        } catch (err: any) {
            console.error("Erreur fetchAgents:", err);
            setAgents([]);
            setError(
                err?.message?.includes("403")
                    ? "Accès refusé. Vérifiez vos droits."
                    : "Impossible de charger les agents.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const ajouterAgent = async (
        nouvelAgent: Omit<Agent, "id" | "dateInscription" | "statut"> & {
            password?: string;
            statut?: "actif" | "suspendu";
        },
    ) => {
        setLoading(true);

        // ==========================================
        // COMPORTEMENT SI USE_MOCK = TRUE
        // ==========================================
        if (USE_MOCK) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    const agentSimule: Agent = {
                        id: String(Math.floor(Math.random() * 10000)),
                        prenom: nouvelAgent.prenom,
                        nom: nouvelAgent.nom,
                        email: nouvelAgent.email,
                        telephone: nouvelAgent.telephone,
                        ville: nouvelAgent.ville,
                        statut: nouvelAgent.statut || "actif",
                        dateInscription: new Date().toISOString().split("T")[0],
                    };

                    // Ajout en haut de la liste locale pour affichage immédiat
                    setAgents((prev) => [agentSimule, ...prev]);
                    setLoading(false);
                    resolve();
                }, 600);
            });
        }

        // ==========================================
        // COMPORTEMENT EN MODE RÉEL (SERVEUR)
        // ==========================================
        try {
            const dto: CreateAgentDTO = {
                prenom: nouvelAgent.prenom,
                nom: nouvelAgent.nom,
                email: nouvelAgent.email,
                telephone: nouvelAgent.telephone,
                ville: nouvelAgent.ville,
                password: nouvelAgent.password || "defaultPassword",
            };
            const agentCreeBrut = await agentsService.create(dto);
            if (agentCreeBrut) {
                const [agentNormalise] = normaliserStatuts([agentCreeBrut]);
                setAgents((prev) => [agentNormalise, ...prev]);
            } else {
                await fetchAgents();
            }
        } catch (err) {
            console.error("Erreur lors de la création de l'agent", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const supprimerAgent = async (email: string) => {
        setLoading(true);
        if (USE_MOCK) {
            setAgents((prev) => prev.filter((a) => a.email !== email));
            setLoading(false);
            return;
        }
        try {
            await agentsService.delete(email);
            setAgents((prev) => prev.filter((a) => a.email !== email));
        } catch (err) {
            console.error("Erreur suppression agent", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const suspendreAgent = async (email: string) => {
        setLoading(true);
        if (USE_MOCK) {
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: "suspendu" } : a)));
            setLoading(false);
            return;
        }
        try {
            await agentsService.suspendre(email);
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: "suspendu" } : a)));
        } catch (err) {
            console.error("Erreur suspension agent", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAgentById = (id: string) => agents.find((a) => a.id === id);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    return (
        <AgentsContext.Provider
            value={{
                agents,
                loading,
                error,
                fetchAgents,
                ajouterAgent,
                supprimerAgent,
                suspendreAgent,
                getAgentById,
            }}
        >
            {children}
        </AgentsContext.Provider>
    );
};

export default AgentsProvider;
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
