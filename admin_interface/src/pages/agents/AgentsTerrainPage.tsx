import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    Filter,
    Eye,
    UserCheck,
    UserX,
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
} from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../../component/ui/Badge";

// Types
type Statut = "actif" | "suspendu";
type Vue = "tableau" | "cartes";

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

// Données mockées (utilisées SEULEMENT si VITE_USE_MOCK=true)
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

// Utilitaires
function getInitials(prenom: string, nom: string): string {
    return ((prenom[0] ?? "") + (nom[0] ?? "")).toUpperCase();
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Composant ModaleProfilAgent (simplifié, sans dossiers)
interface ModaleProfilAgentProps {
    agent: Agent | null;
    onFermer: () => void;
    onToggleStatut: (agent: Agent) => void;
    onSupprimer: (agent: Agent) => void;
    t: any;
}

const ModaleProfilAgent = ({ agent, onFermer, onToggleStatut, onSupprimer, t }: ModaleProfilAgentProps) => {
    const { theme } = useTheme();
    const at = t.agentsTerrain ?? {};

    if (!agent) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onFermer}
            role="dialog"
            aria-modal="true"
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
                        aria-label={t.commun?.fermer || "Fermer"}
                        className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                    >
                        <X size={16} aria-hidden="true" />
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
                                        <info.icone size={14} style={{ color: info.couleur }} aria-hidden="true" />
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
                        <button
                            onClick={() => {
                                onToggleStatut(agent);
                                onFermer();
                            }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                            style={{
                                background: agent.statut === "actif" ? "rgba(239,68,68,0.1)" : "rgba(22,163,74,0.1)",
                                border:
                                    agent.statut === "actif"
                                        ? "1px solid rgba(239,68,68,0.3)"
                                        : "1px solid rgba(22,163,74,0.3)",
                                color: agent.statut === "actif" ? "#ef4444" : "#16a34a",
                            }}
                        >
                            {agent.statut === "actif" ? <UserX size={14} /> : <UserCheck size={14} />}
                            {agent.statut === "actif" ? at.suspendre || "Suspendre" : at.activer || "Activer"}
                        </button>
                        <button
                            onClick={() => {
                                onSupprimer(agent);
                                onFermer();
                            }}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                            style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                color: "#ef4444",
                            }}
                        >
                            <Trash2 size={14} />
                            {at.supprimer || "Supprimer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant ModaleConfirmation
interface ModaleConfirmationProps {
    type: "supprimer" | "statut";
    agent: Agent;
    onConfirmer: () => void;
    onAnnuler: () => void;
    t: any;
}

const ModaleConfirmation = ({ type, agent, onConfirmer, onAnnuler, t }: ModaleConfirmationProps) => {
    const { theme } = useTheme();
    const at = t.agentsTerrain ?? {};

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
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${type === "supprimer" ? "bg-red-100 dark:bg-red-900/30" : agent.statut === "actif" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"}`}
                >
                    {type === "supprimer" ? (
                        <Trash2 size={22} className="text-red-500 dark:text-red-400" />
                    ) : agent.statut === "actif" ? (
                        <UserX size={22} className="text-amber-600 dark:text-amber-400" />
                    ) : (
                        <UserCheck size={22} className="text-green-600 dark:text-green-400" />
                    )}
                </div>

                <div className="text-center space-y-1">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                        {type === "supprimer"
                            ? at.confirmerSupprimer || "Supprimer l'agent ?"
                            : agent.statut === "actif"
                              ? at.confirmerSuspendre || "Suspendre l'agent ?"
                              : at.confirmerActiver || "Activer l'agent ?"}
                    </p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {agent.prenom} {agent.nom}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {type === "supprimer"
                            ? at.confirmationSupprimer || "Cette action est irréversible."
                            : at.confirmationStatut || "Vous pouvez modifier ce statut à tout moment."}
                    </p>
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
                        style={{
                            background: type === "supprimer" ? "#ef4444" : "linear-gradient(135deg, #16a34a, #0891b2)",
                        }}
                    >
                        {t.commun?.confirmer || "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant Principal
export default function AgentsTerrainPage() {
    const { t } = useLangue();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const at = (t as any).agentsTerrain ?? {};
    const tc = (t as any).commun ?? {};

    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.9.228:8081/api";

    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vue, setVue] = useState<Vue>("tableau");
    const [recherche, setRecherche] = useState("");
    const [filtreStatut, setFiltreStatut] = useState<"tous" | Statut>("tous");
    const [agentSelectionne, setAgentSelectionne] = useState<Agent | null>(null);
    const [confirmation, setConfirmation] = useState<{
        type: "supprimer" | "statut";
        agent: Agent;
    } | null>(null);
    const [messageSucces, setMessageSucces] = useState<string | null>(null);

    // Chargement initial
    useEffect(() => {
        if (useMock) {
            setAgents(AGENTS_MOCK);
            setLoading(false);
        } else {
            setLoading(true);
            fetch(apiUrl)
                .then((res) => {
                    if (!res.ok) throw new Error(`Erreur ${res.status}`);
                    return res.json();
                })
                .then((data: Agent[]) => {
                    setAgents(data); // même vide
                    setLoading(false);
                })
                .catch((err) => {
                    // En cas d'erreur réseau/serveur, on affiche une liste vide
                    console.warn("API indisponible, liste vide :", err);
                    setAgents([]);
                    setLoading(false);
                });
        }
    }, [useMock, apiUrl]);

    // Récupération après création
    useEffect(() => {
        const state = location.state as { nouvelAgent?: Agent; message?: string } | null;

        if (state?.nouvelAgent) {
            const agentExiste = agents.some((a) => a.id === state.nouvelAgent!.id);
            if (!agentExiste) {
                setAgents((prev) => [state.nouvelAgent!, ...prev]);
                setMessageSucces(state.message || "✅ Agent créé avec succès !");
                setTimeout(() => setMessageSucces(null), 5000);
            }
            window.history.replaceState({}, document.title);
        }
    }, [location.state, agents]);

    // Filtrage
    const agentsFiltres = useMemo(() => {
        return agents.filter((a) => {
            const q = recherche.toLowerCase();
            const matchRecherche =
                !q ||
                `${a.prenom} ${a.nom}`.toLowerCase().includes(q) ||
                a.ville.toLowerCase().includes(q) ||
                a.login.toLowerCase().includes(q) ||
                a.telephone.includes(q);
            const matchStatut = filtreStatut === "tous" || a.statut === filtreStatut;
            return matchRecherche && matchStatut;
        });
    }, [agents, recherche, filtreStatut]);

    const totalActifs = agents.filter((a) => a.statut === "actif").length;
    const totalSuspendus = agents.filter((a) => a.statut === "suspendu").length;

    function toggleStatut(agent: Agent) {
        setAgents((prev) =>
            prev.map((a) => (a.id === agent.id ? { ...a, statut: a.statut === "actif" ? "suspendu" : "actif" } : a)),
        );
        setConfirmation(null);
        if (agentSelectionne?.id === agent.id) {
            setAgentSelectionne((prev) =>
                prev ? { ...prev, statut: prev.statut === "actif" ? "suspendu" : "actif" } : null,
            );
        }
    }

    function supprimerAgent(agent: Agent) {
        setAgents((prev) => prev.filter((a) => a.id !== agent.id));
        setConfirmation(null);
        if (agentSelectionne?.id === agent.id) setAgentSelectionne(null);
    }

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
            icone: CheckCircle,
        },
        {
            id: "suspendus",
            label: at.agentsSuspendus || "Suspendus",
            valeur: totalSuspendus,
            couleur: "#F59E0B",
            fond: "rgba(245,158,11,0.1)",
            icone: AlertCircle,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-600" size={32} />
                <span className="ml-3 text-gray-500">Chargement des agents...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {agentSelectionne && (
                <ModaleProfilAgent
                    agent={agentSelectionne}
                    onFermer={() => setAgentSelectionne(null)}
                    onToggleStatut={toggleStatut}
                    onSupprimer={supprimerAgent}
                    t={t}
                />
            )}

            {confirmation && (
                <ModaleConfirmation
                    type={confirmation.type}
                    agent={confirmation.agent}
                    onConfirmer={() =>
                        confirmation.type === "supprimer"
                            ? supprimerAgent(confirmation.agent)
                            : toggleStatut(confirmation.agent)
                    }
                    onAnnuler={() => setConfirmation(null)}
                    t={t}
                />
            )}

            {messageSucces && (
                <div
                    className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
                    style={{
                        background: "rgba(22,163,74,0.08)",
                        border: "1px solid rgba(22,163,74,0.25)",
                        color: "#16a34a",
                    }}
                >
                    <CheckCircle size={16} />
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
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(22,163,74,0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.3)";
                    }}
                >
                    <Plus size={15} />
                    {at.nouvelAgent || "Nouvel agent"}
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {cartesResume.map((item) => (
                    <div key={item.id} className="carte flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: item.fond }}
                        >
                            <item.icone size={20} style={{ color: item.couleur }} aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.valeur}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="barre-recherche flex-1">
                    <Search size={16} className="shrink-0" style={{ color: "#16a34a" }} aria-hidden="true" />
                    <input
                        type="search"
                        placeholder={at.recherche || "Rechercher par nom, ville, login..."}
                        aria-label={at.recherche || "Rechercher"}
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder-gray-400"
                    />
                    {recherche && (
                        <button
                            onClick={() => setRecherche("")}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Filter size={16} className="shrink-0" style={{ color: "#16a34a" }} aria-hidden="true" />
                    <select
                        value={filtreStatut}
                        aria-label={tc.filtrer || "Filtrer par statut"}
                        onChange={(e) => setFiltreStatut(e.target.value as typeof filtreStatut)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
                    >
                        <option value="tous">{at.tousStatuts || "Tous les statuts"}</option>
                        <option value="actif">{at.statutActif || "Actif"}</option>
                        <option value="suspendu">{at.statutSuspendu || "Suspendu"}</option>
                    </select>
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 shrink-0">
                    <button
                        onClick={() => setVue("tableau")}
                        className={`p-2 rounded-lg transition-all ${vue === "tableau" ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        title={at.vueTableau || "Vue tableau"}
                    >
                        <List size={15} />
                    </button>
                    <button
                        onClick={() => setVue("cartes")}
                        className={`p-2 rounded-lg transition-all ${vue === "cartes" ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        title={at.vueCartes || "Vue cartes"}
                    >
                        <LayoutGrid size={15} />
                    </button>
                </div>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
                {agentsFiltres.length} {tc.trouve || "trouvé(s)"} {tc.sur || "sur"} {agents.length}{" "}
                {tc.total || "total"}
            </p>

            {vue === "tableau" && (
                <div className="table-container">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" role="table">
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
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setAgentSelectionne(agent)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                        style={{ color: "#0891b2" }}
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.background = "rgba(8,145,178,0.1)")
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.background = "transparent")
                                                        }
                                                    >
                                                        <Eye size={14} />
                                                        <span>{at.voir || "Voir"}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmation({ type: "statut", agent })}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                        style={{
                                                            color: agent.statut === "actif" ? "#ef4444" : "#16a34a",
                                                        }}
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.background =
                                                                agent.statut === "actif"
                                                                    ? "rgba(239,68,68,0.1)"
                                                                    : "rgba(22,163,74,0.1)")
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.background = "transparent")
                                                        }
                                                    >
                                                        {agent.statut === "actif" ? (
                                                            <UserX size={14} />
                                                        ) : (
                                                            <UserCheck size={14} />
                                                        )}
                                                        <span>
                                                            {agent.statut === "actif"
                                                                ? at.suspendre || "Suspendre"
                                                                : at.activer || "Activer"}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmation({ type: "supprimer", agent })}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                        style={{ color: "#ef4444" }}
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.background = "transparent")
                                                        }
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
                                                <Users size={22} style={{ color: "#16a34a" }} aria-hidden="true" />
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

            {vue === "cartes" &&
                (agentsFiltres.length === 0 ? (
                    <div className="carte text-center py-12 space-y-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                            style={{ background: "rgba(22,163,74,0.1)" }}
                        >
                            <Users size={22} style={{ color: "#16a34a" }} aria-hidden="true" />
                        </div>
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
                                        <MapPin size={12} className="shrink-0 text-gray-400" />
                                        <span>{agent.ville}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Briefcase size={12} className="shrink-0 text-gray-400" />
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
                                        onClick={() => setConfirmation({ type: "statut", agent })}
                                        className="p-2 rounded-xl border transition-all"
                                    ></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
