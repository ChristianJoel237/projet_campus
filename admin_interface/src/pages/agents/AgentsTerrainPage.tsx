import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    Filter,
    Eye,
    Ban,
    Trash2,
    Plus,
    Users,
    MapPin,
    Phone,
    Calendar,
    Briefcase,
    X,
    CheckCircle,
    AlertCircle,
    LayoutGrid,
    List,
    Loader2,
    UserCheck,
    UserX,
    ShieldOff,
} from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../../component/ui/Badge";
import { agentsService } from "../../services/agentService";

// Types
type Statut = "actif" | "suspendu" | "bloque";
type Vue = "tableau" | "cartes";
type ActionAgent = "activer" | "suspendre" | "bloquer" | "supprimer";

interface Agent {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    ville: string;
    statut: Statut;
    login: string;
    dateInscription: string;
    email?: string;
}

// Données mockées (inchangées, avec statuts en minuscules)
const AGENTS_MOCK: Agent[] = [
    {
        id: "AGT-001",
        prenom: "Jean-Pierre",
        nom: "Mballa",
        telephone: "+237 677 123 456",
        ville: "Yaoundé",
        statut: "actif",
        login: "jea.mballa",
        dateInscription: "2024-11-03",
        email: "jp.mballa@microfinance.cm",
    },
    {
        id: "AGT-002",
        prenom: "Aïcha",
        nom: "Bello",
        telephone: "+237 699 234 567",
        ville: "Douala",
        statut: "actif",
        login: "aic.bello",
        dateInscription: "2024-12-10",
        email: "a.bello@microfinance.cm",
    },
    {
        id: "AGT-003",
        prenom: "Samuel",
        nom: "Nkoa",
        telephone: "+237 655 345 678",
        ville: "Bafoussam",
        statut: "actif",
        login: "sam.nkoa",
        dateInscription: "2024-10-21",
        email: "s.nkoa@microfinance.cm",
    },
    {
        id: "AGT-004",
        prenom: "Fatima",
        nom: "Moussa",
        telephone: "+237 670 456 789",
        ville: "Garoua",
        statut: "suspendu",
        login: "fat.moussa",
        dateInscription: "2025-01-15",
        email: "f.moussa@microfinance.cm",
    },
    {
        id: "AGT-005",
        prenom: "Pierre",
        nom: "Essomba",
        telephone: "+237 691 567 890",
        ville: "Yaoundé",
        statut: "actif",
        login: "pie.essomba",
        dateInscription: "2024-09-08",
        email: "p.essomba@microfinance.cm",
    },
    {
        id: "AGT-006",
        prenom: "Marie",
        nom: "Atangana",
        telephone: "+237 677 678 901",
        ville: "Ebolowa",
        statut: "actif",
        login: "mar.atangana",
        dateInscription: "2025-02-01",
        email: "m.atangana@microfinance.cm",
    },
    {
        id: "AGT-007",
        prenom: "Hamidou",
        nom: "Oumarou",
        telephone: "+237 698 789 012",
        ville: "Ngaoundéré",
        statut: "suspendu",
        login: "ham.oumarou",
        dateInscription: "2025-01-28",
        email: "h.oumarou@microfinance.cm",
    },
    {
        id: "AGT-008",
        prenom: "Cécile",
        nom: "Fouda",
        telephone: "+237 655 890 123",
        ville: "Yaoundé",
        statut: "actif",
        login: "cec.fouda",
        dateInscription: "2024-08-14",
        email: "c.fouda@microfinance.cm",
    },
];

function mapServerAgent(serverAgent: any): Agent {
    return {
        id: String(serverAgent.id),
        prenom: serverAgent.prenom,
        nom: serverAgent.nom,
        telephone: serverAgent.telephone,
        ville: serverAgent.ville,
        statut:
            serverAgent.statut?.toLowerCase() === "actif"
                ? "actif"
                : serverAgent.statut?.toLowerCase() === "bloque"
                  ? "bloque"
                  : "suspendu",
        login: serverAgent.login ?? serverAgent.email ?? "",
        dateInscription: serverAgent.date_inscription ?? "",
        email: serverAgent.email ?? "",
    };
}

function getInitials(prenom: string, nom: string): string {
    return ((prenom[0] ?? "") + (nom[0] ?? "")).toUpperCase();
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return dateStr;
    }
}

// Modale de confirmation générique
interface ModaleConfirmationProps {
    action: ActionAgent;
    agent: Agent;
    onConfirmer: () => void;
    onAnnuler: () => void;
    t: any;
}

const iconesAction: Record<ActionAgent, React.ElementType> = {
    activer: UserCheck,
    suspendre: UserX,
    bloquer: ShieldOff,
    supprimer: Trash2,
};

const couleursAction: Record<ActionAgent, { bg: string; text: string; button: string }> = {
    activer: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        button: "linear-gradient(135deg, #16a34a, #0891b2)",
    },
    suspendre: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
        button: "#f59e0b",
    },
    bloquer: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", button: "#ef4444" },
    supprimer: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", button: "#ef4444" },
};

const ModaleConfirmation = ({ action, agent, onConfirmer, onAnnuler, t }: ModaleConfirmationProps) => {
    const { theme } = useTheme();
    const at = t.agentsTerrain ?? {};

    const Icone = iconesAction[action];
    const couleurs = couleursAction[action];

    const messages: Record<ActionAgent, string> = {
        activer: at.confirmerActiver || "Activer l'agent ?",
        suspendre: at.confirmerSuspendre || "Suspendre l'agent ?",
        bloquer: at.confirmerBloquer || "Bloquer l'agent ?",
        supprimer: at.confirmerSupprimer || "Supprimer l'agent ?",
    };

    const sousTitres: Record<ActionAgent, string> = {
        activer: at.confirmationActiver || "L'agent pourra se connecter et travailler.",
        suspendre: at.confirmationSuspendre || "L'agent ne pourra plus accéder à la plateforme.",
        bloquer: at.confirmationBloquer || "L'agent sera bloqué définitivement.",
        supprimer: at.confirmationSupprimer || "Cette action est irréversible.",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onAnnuler}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-5 space-y-4"
                style={{
                    background: theme === "dark" ? "#111827" : "#ffffff",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(22,163,74,0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${couleurs.bg}`}>
                    <Icone size={22} className={couleurs.text} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{messages[action]}</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {agent.prenom} {agent.nom}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sousTitres[action]}</p>
                </div>
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={onAnnuler}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        {t.commun?.annuler || "Annuler"}
                    </button>
                    <button
                        onClick={onConfirmer}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                        style={{ background: couleurs.button }}
                    >
                        {t.commun?.confirmer || "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modale profil agent (inchangée, mais bouton toggle modifié pour utiliser changerStatutAgent)
interface ModaleProfilAgentProps {
    agent: Agent | null;
    onFermer: () => void;
    onChangerStatut: (agent: Agent, nouveauStatut: Statut) => void;
    onSupprimer: (agent: Agent) => void;
    t: any;
}

const ModaleProfilAgent = ({ agent, onFermer, onChangerStatut, onSupprimer, t }: ModaleProfilAgentProps) => {
    const { theme } = useTheme();
    const at = t.agentsTerrain ?? {};

    if (!agent) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onFermer}
        >
            <div
                className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                    background: theme === "dark" ? "#111827" : "#ffffff",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(22,163,74,0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="p-6 relative"
                    style={{ background: "linear-gradient(135deg, #052e16, #15803d, #0c4a6e)" }}
                >
                    <button
                        onClick={onFermer}
                        className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                            style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                        >
                            {getInitials(agent.prenom, agent.nom)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {agent.prenom} {agent.nom}
                            </h3>
                            <p className="text-xs font-mono text-white/60 mt-0.5">{agent.id}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge statut={agent.statut} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#16a34a" }}>
                            📋 {at.informationsAgent || "Informations de l'agent"}
                        </p>
                        <div className="space-y-3">
                            {[
                                {
                                    icone: Phone,
                                    label: at.telephone || "Téléphone",
                                    valeur: agent.telephone,
                                    couleur: "#0891b2",
                                },
                                { icone: MapPin, label: at.ville || "Ville", valeur: agent.ville, couleur: "#8b5cf6" },
                                {
                                    icone: Briefcase,
                                    label: at.login || "Login",
                                    valeur: agent.login,
                                    couleur: "#F59E0B",
                                    mono: true,
                                },
                                {
                                    icone: Calendar,
                                    label: at.dateInscription || "Inscription",
                                    valeur: formatDate(agent.dateInscription),
                                    couleur: "#6b7280",
                                },
                            ].map((info) => (
                                <div key={info.label} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: `${info.couleur}15` }}
                                    >
                                        <info.icone size={14} style={{ color: info.couleur }} />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <p className="text-xs text-gray-400">{info.label}</p>
                                        <p
                                            className={`text-sm font-semibold text-gray-800 dark:text-white ${info.mono ? "font-mono" : ""}`}
                                        >
                                            {info.valeur}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className="h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.2), transparent)" }}
                    />
                    <div className="flex gap-2 pt-2">
                        {agent.statut === "actif" ? (
                            <button
                                onClick={() => {
                                    onChangerStatut(agent, "suspendu");
                                    onFermer();
                                }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                            >
                                <UserX size={14} /> Suspendre
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onChangerStatut(agent, "actif");
                                    onFermer();
                                }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                <UserCheck size={14} /> Activer
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onSupprimer(agent);
                                onFermer();
                            }}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AgentsTerrainPage() {
    const { t } = useLangue();
    const navigate = useNavigate();
    const location = useLocation();
    const at = (t as any).agentsTerrain ?? {};
    const tc = (t as any).commun ?? {};
    const useMock = import.meta.env.VITE_USE_MOCK === "true";

    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [vue, setVue] = useState<Vue>("tableau");
    const [recherche, setRecherche] = useState("");
    const [filtreStatut, setFiltreStatut] = useState<"tous" | Statut>("tous");
    const [agentSelectionne, setAgentSelectionne] = useState<Agent | null>(null);
    const [confirmation, setConfirmation] = useState<{ action: ActionAgent; agent: Agent } | null>(null);
    const [messageSucces, setMessageSucces] = useState<string | null>(null);

    useEffect(() => {
        if (useMock) {
            setAgents(AGENTS_MOCK);
            setLoading(false);
        } else {
            agentsService
                .getAll()
                .then((data) => {
                    setAgents(data.map(mapServerAgent));
                    setLoading(false);
                })
                .catch(() => {
                    setAgents([]);
                    setLoading(false);
                });
        }
    }, [useMock]);

    useEffect(() => {
        const state = location.state as { nouvelAgent?: Agent; message?: string } | null;
        if (state?.nouvelAgent) {
            if (!agents.some((a) => a.id === state.nouvelAgent!.id)) {
                setAgents((prev) => [state.nouvelAgent!, ...prev]);
                setMessageSucces(state.message || "✅ Agent créé avec succès !");
                setTimeout(() => setMessageSucces(null), 5000);
            }
            window.history.replaceState({}, document.title);
        }
    }, [location.state, agents]);

    const agentsFiltres = useMemo(() => {
        return agents.filter((a) => {
            const q = recherche.toLowerCase();
            const matchRecherche =
                !q ||
                `${a.prenom} ${a.nom}`.toLowerCase().includes(q) ||
                a.ville.toLowerCase().includes(q) ||
                a.login.toLowerCase().includes(q) ||
                a.telephone.includes(q);
            return matchRecherche && (filtreStatut === "tous" || a.statut === filtreStatut);
        });
    }, [agents, recherche, filtreStatut]);

    const changerStatutAgent = async (agent: Agent, nouveauStatut: Statut) => {
        if (!agent.email) {
            setMessageSucces("❌ Email manquant.");
            return;
        }
        try {
            await agentsService.changerStatutAgent(agent.email, nouveauStatut);
            setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, statut: nouveauStatut } : a)));
            if (agentSelectionne?.id === agent.id)
                setAgentSelectionne((prev) => (prev ? { ...prev, statut: nouveauStatut } : null));
            setMessageSucces(
                `✅ Agent ${nouveauStatut === "actif" ? "activé" : nouveauStatut === "suspendu" ? "suspendu" : "bloqué"} avec succès.`,
            );
            setTimeout(() => setMessageSucces(null), 3000);
        } catch (err) {
            setMessageSucces("❌ Erreur lors du changement de statut.");
            setTimeout(() => setMessageSucces(null), 3000);
        } finally {
            setConfirmation(null);
        }
    };

    const supprimerAgent = async (agent: Agent) => {
        try {
            await agentsService.delete(agent.id);
            setAgents((prev) => prev.filter((a) => a.id !== agent.id));
            if (agentSelectionne?.id === agent.id) setAgentSelectionne(null);
            setMessageSucces("✅ Agent supprimé avec succès.");
            setTimeout(() => setMessageSucces(null), 3000);
        } catch {
            setMessageSucces("❌ Erreur lors de la suppression.");
            setTimeout(() => setMessageSucces(null), 3000);
        } finally {
            setConfirmation(null);
        }
    };

    const executerAction = () => {
        if (!confirmation) return;
        const { action, agent } = confirmation;
        if (action === "supprimer") supprimerAgent(agent);
        else changerStatutAgent(agent, action === "suspendre" ? "suspendu" : action === "bloquer" ? "bloque" : "actif");
    };

    const totalActifs = agents.filter((a) => a.statut === "actif").length;
    const totalSuspendus = agents.filter((a) => a.statut === "suspendu").length;
    const totalBloques = agents.filter((a) => a.statut === "bloque").length;

    const cartesResume = [
        {
            id: "total",
            label: at.totalAgents || "Total agents",
            valeur: agents.length,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
            icone: Users,
        },
        {
            id: "actifs",
            label: at.agentsActifs || "Actifs",
            valeur: totalActifs,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
            icone: UserCheck,
        },
        {
            id: "suspendus",
            label: at.agentsSuspendus || "Suspendus",
            valeur: totalSuspendus,
            couleur: "#F59E0B",
            fond: "rgba(245,158,11,0.1)",
            icone: UserX,
        },
        {
            id: "bloques",
            label: at.agentsBloques || "Bloqués",
            valeur: totalBloques,
            couleur: "#ef4444",
            fond: "rgba(239,68,68,0.1)",
            icone: ShieldOff,
        },
    ];

    if (loading)
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-600" size={32} />
                <span className="ml-3 text-gray-500">Chargement...</span>
            </div>
        );

    return (
        <div className="space-y-6">
            {agentSelectionne && (
                <ModaleProfilAgent
                    agent={agentSelectionne}
                    onFermer={() => setAgentSelectionne(null)}
                    onChangerStatut={changerStatutAgent}
                    onSupprimer={supprimerAgent}
                    t={t}
                />
            )}
            {confirmation && (
                <ModaleConfirmation
                    action={confirmation.action}
                    agent={confirmation.agent}
                    onConfirmer={executerAction}
                    onAnnuler={() => setConfirmation(null)}
                    t={t}
                />
            )}
            {messageSucces && (
                <div
                    className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
                    style={{
                        background: messageSucces.includes("❌") ? "rgba(239,68,68,0.08)" : "rgba(22,163,74,0.08)",
                        border: messageSucces.includes("❌")
                            ? "1px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(22,163,74,0.25)",
                        color: messageSucces.includes("❌") ? "#ef4444" : "#16a34a",
                    }}
                >
                    {messageSucces.includes("❌") ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                    <span>{messageSucces}</span>
                    <button
                        onClick={() => setMessageSucces(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {at.listeTitre || "Agents de terrain"}
                    </h2>
                    <p className="sous-titre">
                        {at.listeDescription || "Gérez les agents chargés des vérifications sur le terrain."}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/agents/nouveau")}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200"
                    style={{
                        background: "linear-gradient(135deg, #16a34a, #0891b2)",
                        boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                    }}
                >
                    <Plus size={15} />
                    {at.nouvelAgent || "Nouvel agent"}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cartesResume.map((item) => (
                    <div key={item.id} className="carte flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: item.fond }}
                        >
                            <item.icone size={20} style={{ color: item.couleur }} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.valeur}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="barre-recherche flex-1">
                    <Search size={16} className="shrink-0" style={{ color: "#16a34a" }} />
                    <input
                        type="search"
                        placeholder={at.recherche || "Rechercher par nom, ville, login..."}
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder-gray-400"
                    />
                    {recherche && (
                        <button onClick={() => setRecherche("")} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Filter size={16} style={{ color: "#16a34a" }} />
                    <select
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value as typeof filtreStatut)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
                    >
                        <option value="tous">{at.tousStatuts || "Tous les statuts"}</option>
                        <option value="actif">{at.statutActif || "Actif"}</option>
                        <option value="suspendu">{at.statutSuspendu || "Suspendu"}</option>
                        <option value="bloque">{at.agentsBloques || "Bloqué"}</option>
                    </select>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 shrink-0">
                    <button
                        onClick={() => setVue("tableau")}
                        className={`p-2 rounded-lg transition-all ${vue === "tableau" ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <List size={15} />
                    </button>
                    <button
                        onClick={() => setVue("cartes")}
                        className={`p-2 rounded-lg transition-all ${vue === "cartes" ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <LayoutGrid size={15} />
                    </button>
                </div>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
                {agentsFiltres.length} {tc.trouve || "trouvé(s)"} {tc.sur || "sur"} {agents.length}{" "}
                {tc.total || "total"}
            </p>

            {/* Vue Tableau */}
            {vue === "tableau" && (
                <div className="table-container">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="entete-tableau">{at.colAgent || "Agent"}</th>
                                    <th className="entete-tableau hidden md:table-cell">{at.colVille || "Ville"}</th>
                                    <th className="entete-tableau">{at.colStatut || "Statut"}</th>
                                    <th className="entete-tableau">{at.colActions || "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {agentsFiltres.length > 0 ? (
                                    agentsFiltres.map((agent) => (
                                        <tr key={agent.id} className="ligne-tableau">
                                            <td className="cellule-tableau">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                                                        style={{
                                                            background: "linear-gradient(135deg, #16a34a, #0891b2)",
                                                        }}
                                                    >
                                                        {getInitials(agent.prenom, agent.nom)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-white">
                                                            {agent.prenom} {agent.nom}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-mono">{agent.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cellule-tableau hidden md:table-cell">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-gray-400 shrink-0" />
                                                    <span>{agent.ville}</span>
                                                </div>
                                            </td>
                                            <td className="cellule-tableau">
                                                <Badge statut={agent.statut} />
                                            </td>
                                            <td className="cellule-tableau">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    <button
                                                        onClick={() => setAgentSelectionne(agent)}
                                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                                                    >
                                                        <Eye size={14} />
                                                        <span className="hidden sm:inline">{at.voir || "Voir"}</span>
                                                    </button>

                                                    {agent.statut !== "actif" && (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmation({ action: "activer", agent })
                                                            }
                                                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                                                        >
                                                            <UserCheck size={14} />
                                                            <span className="hidden sm:inline">
                                                                {at.activer || "Activer"}
                                                            </span>
                                                        </button>
                                                    )}
                                                    {agent.statut === "actif" && (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmation({ action: "suspendre", agent })
                                                            }
                                                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                                        >
                                                            <UserX size={14} />
                                                            <span className="hidden sm:inline">
                                                                {at.suspendre || "Suspendre"}
                                                            </span>
                                                        </button>
                                                    )}
                                                    {agent.statut !== "bloque" && (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmation({ action: "bloquer", agent })
                                                            }
                                                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        >
                                                            <Ban size={14} />
                                                            <span className="hidden sm:inline">
                                                                {at.bloquer || "Bloquer"}
                                                            </span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setConfirmation({ action: "supprimer", agent })}
                                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span className="hidden sm:inline">
                                                            {at.supprimer || "Supprimer"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                                                style={{ background: "rgba(22,163,74,0.1)" }}
                                            >
                                                <Users size={22} style={{ color: "#16a34a" }} />
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {at.aucunAgent || "Aucun agent trouvé."}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pied-tableau">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {agentsFiltres.length} {tc.trouve || "trouvé(s)"} {tc.sur || "sur"} {agents.length}{" "}
                            {tc.total || "total"}
                        </p>
                    </div>
                </div>
            )}

            {/* Vue Cartes (simplifiée) */}
            {vue === "cartes" &&
                (agentsFiltres.length === 0 ? (
                    <div className="carte text-center py-12">
                        <Users size={22} style={{ color: "#16a34a" }} />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {at.aucunAgent || "Aucun agent trouvé."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {agentsFiltres.map((agent) => (
                            <div key={agent.id} className="carte space-y-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
                                        style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
                                    >
                                        {getInitials(agent.prenom, agent.nom)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {agent.prenom} {agent.nom}
                                        </p>
                                        <p className="text-xs text-gray-400 font-mono">{agent.id}</p>
                                    </div>
                                    <Badge statut={agent.statut} />
                                </div>
                                <div className="separateur pt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <MapPin size={12} />
                                        <span>{agent.ville}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Briefcase size={12} />
                                        <span className="font-mono">{agent.login}</span>
                                    </div>
                                </div>
                                <div className="separateur pt-3 flex items-center gap-2">
                                    <button
                                        onClick={() => setAgentSelectionne(agent)}
                                        className="btn-secondary flex-1 text-xs py-2"
                                    >
                                        <Eye size={13} />
                                        {at.voir || "Voir"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmation({ action: "suspendre", agent })}
                                        className="p-2 rounded-xl border"
                                    >
                                        <UserX size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
