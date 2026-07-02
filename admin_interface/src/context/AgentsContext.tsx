import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { agentsService, CreateAgentDTO } from "../services/agentService";
import * as db from "../donnees/donneesFictives";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// 🔧 Ajout de "bloque" dans le type de statut
export interface Agent {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    ville: string;
    email: string;
    statut: "actif" | "suspendu" | "inactif" | "en_conge" | "bloque"; // <-- "bloque" ajouté
    dossiers?: number;
    login?: string;
    dateInscription?: string;
    zone?: string;
    role?:
        | "verification"
        | "validation"
        | "admin"
        | "roleVerificateur"
        | "roleCollecteur"
        | "roleSuperviseur"
        | "roleComplet";
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
    modifierAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
    supprimerAgent: (email: string) => Promise<void>;
    suspendreAgent: (email: string) => Promise<void>;
    getAgentById: (id: string) => Agent | undefined;
    changerStatutAgent: (email: string, nouveauStatut: "actif" | "suspendu" | "bloque") => Promise<void>;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const useAgents = () => {
    const context = useContext(AgentsContext);
    if (!context) throw new Error("useAgents doit être utilisé dans un AgentsProvider");
    return context;
};

// 🔧 Fonction de normalisation qui conserve tous les statuts valides
const statutsValides = ["actif", "suspendu", "inactif", "en_conge", "bloque"];

function normaliserStatuts(liste: any[]): Agent[] {
    return (liste || []).map((a: any) => {
        const statutRecu = (a?.statut ?? "").toLowerCase();
        const statutNormalise = statutsValides.includes(statutRecu) ? statutRecu : "actif";
        return {
            ...a,
            id: String(a.id ?? a.userId ?? a.idUser ?? a.agentId ?? ""),
            statut: statutNormalise as Agent["statut"],
        };
    });
}

export const AgentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setError(null);

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
                    setAgents((prev) => [agentSimule, ...prev]);
                    setLoading(false);
                    resolve();
                }, 600);
            });
        }

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
            setError("Erreur lors de la création de l'agent");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const modifierAgent = async (id: string, updates: Partial<Agent>) => {
        setLoading(true);
        setError(null);

        if (USE_MOCK) {
            setAgents((prev) => prev.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent)));
            setLoading(false);
            return;
        }

        try {
            const agentModifieBrut = await agentsService.update(id, updates);
            if (agentModifieBrut) {
                const [agentNormalise] = normaliserStatuts([agentModifieBrut]);
                setAgents((prev) => prev.map((agent) => (agent.id === id ? agentNormalise : agent)));
            } else {
                await fetchAgents();
            }
        } catch (err) {
            console.error("Erreur lors de la modification de l'agent", err);
            setError("Erreur lors de la modification de l'agent");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const supprimerAgent = async (email: string) => {
        setLoading(true);
        setError(null);
        if (USE_MOCK) {
            setAgents((prev) => prev.filter((a) => a.email !== email));
            setLoading(false);
            return;
        }
        try {
            const agentCible = agents.find((a) => a.email === email);
            if (!agentCible) throw new Error("Agent introuvable");
            await agentsService.delete(agentCible.id);
            setAgents((prev) => prev.filter((a) => a.email !== email));
        } catch (err) {
            console.error("Erreur suppression agent", err);
            setError("Erreur lors de la suppression de l'agent");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const suspendreAgent = async (email: string) => {
        setLoading(true);
        setError(null);
        if (USE_MOCK) {
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: "suspendu" } : a)));
            setLoading(false);
            return;
        }
        try {
            await agentsService.changerStatutAgent(email, "suspendu");
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: "suspendu" } : a)));
        } catch (err) {
            console.error("Erreur suspension agent", err);
            setError("Erreur lors de la suspension de l'agent");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changerStatutAgent = async (email: string, nouveauStatut: "actif" | "suspendu" | "bloque") => {
        setLoading(true);
        setError(null);
        if (USE_MOCK) {
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: nouveauStatut } : a)));
            setLoading(false);
            return;
        }
        try {
            await agentsService.changerStatutAgent(email, nouveauStatut);
            setAgents((prev) => prev.map((a) => (a.email === email ? { ...a, statut: nouveauStatut } : a)));
        } catch (err) {
            console.error("Erreur changement de statut agent", err);
            setError("Erreur lors du changement de statut de l'agent");
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
                modifierAgent,
                supprimerAgent,
                suspendreAgent,
                getAgentById,
                changerStatutAgent,
            }}
        >
            {children}
        </AgentsContext.Provider>
    );
};

export default AgentsProvider;
