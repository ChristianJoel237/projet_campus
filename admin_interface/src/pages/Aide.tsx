import { useState } from "react";
import {
    HelpCircle,
    LayoutDashboard,
    Users,
    CreditCard,
    PiggyBank,
    ArrowLeftRight,
    Settings,
    ChevronDown,
    ChevronUp,
    Search,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    LogOut,
    Save,
    LucideIcon,
    UserPlus,
    Eye,
    EyeOff,
    UserCheck,
    UserX,
    Trash2,
    Plus,
    Pencil,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLangue } from "../context/LangueContext";
import { useTheme } from "../context/ThemeContext";
import Badge from "../component/ui/Badge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Onglet {
    id: string;
    label: string;
    icone: LucideIcon;
    couleur: string;
}

interface FaqItem {
    question: string;
    reponse: string;
}

interface NotificationsState {
    nouveauCredit: boolean;
    remboursement: boolean;
    retard: boolean;
    nouvelUtilisateur: boolean;
    rapportHebdo: boolean;
}

// ─── Composants réutilisables ────────────────────────────────────────────────

const Astuce = ({ texte }: { texte: string }) => (
    <div
        className="flex items-start gap-3 p-4 rounded-xl mt-4"
        style={{
            background: "rgba(22,163,74,0.08)",
            border: "1px solid rgba(22,163,74,0.2)",
        }}
    >
        <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
        <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold" style={{ color: "#16a34a" }}>
                💡 {useLangue().t?.aide?.astuce || "Astuce"} —{" "}
            </span>
            {texte}
        </p>
    </div>
);

const Important = ({ texte }: { texte: string }) => (
    <div
        className="flex items-start gap-3 p-4 rounded-xl mt-4"
        style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
        }}
    >
        <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
        <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold" style={{ color: "#F59E0B" }}>
                ⚠️ {useLangue().t?.aide?.important || "Important"} —{" "}
            </span>
            {texte}
        </p>
    </div>
);

const Etape = ({ numero, titre, description }: { numero: number | string; titre: string; description: string }) => (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
        >
            {numero}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{titre}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
    </div>
);

const SimulationEcran = ({ children, titre }: { children: React.ReactNode; titre: string }) => (
    <div
        className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mt-4 mb-2"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
    >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
            <span className="text-xs text-gray-400 ml-2">{titre}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900">{children}</div>
    </div>
);

const ToggleIOS = ({
    actif,
    onChange,
    couleurActif = "linear-gradient(135deg, #16a34a, #0891b2)",
    iconeActif,
    iconeInactif,
    ariaLabel,
}: {
    actif: boolean;
    onChange: () => void;
    couleurActif?: string;
    iconeActif?: string;
    iconeInactif?: string;
    ariaLabel: string;
}) => (
    <button
        onClick={onChange}
        aria-label={ariaLabel}
        className="relative shrink-0 transition-all duration-300"
        style={{
            width: "52px",
            height: "28px",
            borderRadius: "999px",
            background: actif ? couleurActif : "#D1D5DB",
            boxShadow: actif
                ? "0 0 0 3px rgba(22,163,74,0.15), inset 0 1px 3px rgba(0,0,0,0.15)"
                : "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
    >
        <span
            className="absolute top-0.5 flex items-center justify-center bg-white rounded-full shadow-md transition-all duration-300"
            style={{
                width: "23px",
                height: "23px",
                transform: actif ? "translateX(25px)" : "translateX(3px)",
                fontSize: "11px",
            }}
        >
            {actif ? iconeActif || "" : iconeInactif || ""}
        </span>
    </button>
);

// ─── Simulation du formulaire de création d'agent ─────────────────────────────

const SimulationFormulaireAgent = () => {
    const { t } = useLangue();
    const [afficherMdp, setAfficherMdp] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const at = (t as any).agentsTerrain ?? {};

    return (
        <div className="space-y-3">
            {formSubmitted ? (
                <div
                    className="p-4 rounded-xl text-center"
                    style={{
                        background: "rgba(22,163,74,0.08)",
                        border: "1px solid rgba(22,163,74,0.2)",
                    }}
                >
                    <CheckCircle size={24} className="mx-auto mb-2" style={{ color: "#16a34a" }} />
                    <p className="text-sm font-semibold" style={{ color: "#16a34a" }}>
                        {at.succesCreation || "✅ Agent créé avec succès !"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {t.aide?.redirection || "Redirection vers la liste des agents..."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.nom || "Nom"} *
                            </label>
                            <input
                                type="text"
                                className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                value="Diallo"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.prenom || "Prénom"} *
                            </label>
                            <input
                                type="text"
                                className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                value="Fatou"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.telephone || "Téléphone"} *
                            </label>
                            <input
                                type="tel"
                                className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                value="+237 677 123 456"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.zone || "Ville"} *
                            </label>
                            <input
                                type="text"
                                className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                value="Douala"
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                            value="fatou.diallo@microfinance.cm"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.motDePasse || "Mot de passe"} *
                            </label>
                            <div className="relative">
                                <input
                                    type={afficherMdp ? "text" : "password"}
                                    className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 pr-6 text-gray-700 dark:text-gray-200"
                                    value="********"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={() => setAfficherMdp(!afficherMdp)}
                                    className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                                >
                                    {afficherMdp ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                {at.confirmer || "Confirmer"} *
                            </label>
                            <input
                                type="password"
                                className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                value="********"
                                readOnly
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setFormSubmitted(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white mt-2 transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
                    >
                        <UserPlus size={12} /> {at.creer || "Créer l'agent"}
                    </button>
                </>
            )}
        </div>
    );
};

// ─── Données graphique ────────────────────────────────────────────────────────

const simulationData = [
    { mois: "Aoû", credits: 120000, epargnes: 80000, transactions: 95000 },
    { mois: "Sep", credits: 145000, epargnes: 95000, transactions: 110000 },
    { mois: "Oct", credits: 130000, epargnes: 105000, transactions: 125000 },
    { mois: "Nov", credits: 160000, epargnes: 115000, transactions: 140000 },
    { mois: "Déc", credits: 175000, epargnes: 130000, transactions: 155000 },
    { mois: "Jan", credits: 190000, epargnes: 145000, transactions: 170000 },
];

// Données pour la simulation des agents de terrain
const agentsDemo = [
    {
        id: "AGT-001",
        nom: "Fatou Diallo",
        ville: "Douala",
        statut: "actif" as const,
        dossiers: 24,
        telephone: "+237 677 123 456",
        login: "fatou.diallo",
    },
    {
        id: "AGT-002",
        nom: "Jean Nkomo",
        ville: "Yaoundé",
        statut: "suspendu" as const,
        dossiers: 7,
        telephone: "+237 699 234 567",
        login: "jean.nkomo",
    },
    {
        id: "AGT-003",
        nom: "Awa Mbeki",
        ville: "Bafoussam",
        statut: "actif" as const,
        dossiers: 41,
        telephone: "+237 655 345 678",
        login: "awa.mbeki",
    },
    {
        id: "AGT-004",
        nom: "Samuel Essomba",
        ville: "Garoua",
        statut: "actif" as const,
        dossiers: 18,
        telephone: "+237 670 456 789",
        login: "samuel.essomba",
    },
];

// Données pour les utilisateurs (clients)
const utilisateursDemo = [
    {
        nom: "Abdoulaye Kane",
        ville: "Douala",
        statut: "actif" as const,
        credits: 2,
    },
    { nom: "Mariam Sow", ville: "Yaoundé", statut: "actif" as const, credits: 1 },
    {
        nom: "Paul Tchatchoua",
        ville: "Bafoussam",
        statut: "suspendu" as const,
        credits: 0,
    },
    { nom: "Claire Ngo", ville: "Douala", statut: "actif" as const, credits: 3 },
];

// ─── Composant principal ──────────────────────────────────────────────────────

const Aide = () => {
    const { t } = useLangue();
    const { theme } = useTheme();

    const [ongletActif, setOngletActif] = useState<string>("demarrage");
    const [recherche, setRecherche] = useState<string>("");
    const [faqOuverte, setFaqOuverte] = useState<number | null>(null);
    const [vueAgents, setVueAgents] = useState<"tableau" | "cartes">("tableau");

    // État interne de la démo interactive Paramètres
    const [ongletParam, setOngletParam] = useState<string>("notifications");
    const [notifications, setNotifications] = useState<NotificationsState>({
        nouveauCredit: true,
        remboursement: true,
        retard: true,
        nouvelUtilisateur: false,
        rapportHebdo: true,
    });
    const [themeDemoSombre, setThemeDemoSombre] = useState<boolean>(false);
    const [langueDemo, setLangueDemo] = useState<string>("fr");
    const [deviseDemo, setDeviseDemo] = useState<string>("FCFA");
    const [messageDemo, setMessageDemo] = useState<string>("");

    const afficherMessageDemo = (msg: string) => {
        setMessageDemo(msg);
        setTimeout(() => setMessageDemo(""), 3000);
    };

    const onglets: Onglet[] = [
        {
            id: "demarrage",
            label: t.aide?.demarrage || "Démarrage",
            icone: LayoutDashboard,
            couleur: "#16a34a",
        },
        {
            id: "utilisateurs",
            label: t.aide?.gestionUtilisateurs || "Utilisateurs",
            icone: Users,
            couleur: "#0891b2",
        },
        {
            id: "agentsTerrain",
            label: t.navigation?.agentsTerrain || "Agents de terrain",
            icone: Users,
            couleur: "#8b5cf6",
        },
        {
            id: "credits",
            label: t.aide?.gestionCredits || "Crédits",
            icone: CreditCard,
            couleur: "#16a34a",
        },
        {
            id: "epargnes",
            label: t.aide?.gestionEpargnes || "Épargnes",
            icone: PiggyBank,
            couleur: "#F59E0B",
        },
        {
            id: "transactions",
            label: t.aide?.gestionTransactions || "Transactions",
            icone: ArrowLeftRight,
            couleur: "#0891b2",
        },
        {
            id: "parametres",
            label: t.aide?.gestionParametres || "Paramètres",
            icone: Settings,
            couleur: "#6b7280",
        },
        {
            id: "faq",
            label: t.aide?.faq || "FAQ",
            icone: HelpCircle,
            couleur: "#8b5cf6",
        },
    ];

    const faqItems: FaqItem[] = [
        {
            question: t.aide?.faq1Q || "Comment créer un agent de terrain ?",
            reponse:
                t.aide?.faq1R ||
                "Allez dans la page 'Agents de terrain', cliquez sur 'Nouvel agent', remplissez le formulaire et validez.",
        },
        {
            question: t.aide?.faq2Q || "Comment approuver un crédit ?",
            reponse: t.aide?.faq2R || "Filtrez par 'En attente' et cliquez sur Approuver.",
        },
        {
            question: t.aide?.faq3Q || "Comment suspendre un agent ?",
            reponse: t.aide?.faq3R || "Depuis la page Agents, cliquez sur 'Suspendre' ou depuis son profil.",
        },
        {
            question: t.aide?.faq4Q || "Comment activer le mode sombre ?",
            reponse: t.aide?.faq4R || "Allez dans Paramètres et activez le mode sombre.",
        },
        {
            question: t.aide?.faq5Q || "Comment changer la langue ?",
            reponse: t.aide?.faq5R || "Dans Paramètres, sélectionnez votre langue préférée.",
        },
        {
            question: t.aide?.faq6Q || "Que faire si un crédit est en retard ?",
            reponse: t.aide?.faq6R || "Contactez le client et suivez la procédure de recouvrement.",
        },
        {
            question: t.aide?.faq7Q || "Comment exporter les rapports ?",
            reponse: t.aide?.faq7R || "Dans la page Rapports, cliquez sur Exporter.",
        },
    ];

    const rechercheLower = recherche.toLowerCase();
    const ongletsFiltres = recherche ? onglets.filter((o) => o.label.toLowerCase().includes(rechercheLower)) : onglets;
    const faqFiltrees = recherche
        ? faqItems.filter(
              (f) =>
                  f.question.toLowerCase().includes(rechercheLower) || f.reponse.toLowerCase().includes(rechercheLower),
          )
        : faqItems;

    const afficherRecherche = recherche.trim().length > 0;

    const notifItems: {
        cle: keyof NotificationsState;
        emoji: string;
        label: string;
        description: string;
    }[] = [
        {
            cle: "nouveauCredit",
            emoji: "💳",
            label: t.parametres?.notifNouveauCredit || "Nouveau crédit",
            description: t.parametres?.notifNouveauCreditDesc || "Alertes pour chaque nouvelle demande",
        },
        {
            cle: "remboursement",
            emoji: "✅",
            label: t.parametres?.notifRemboursement || "Remboursement",
            description: t.parametres?.notifRemboursementDesc || "Confirmer les paiements reçus",
        },
        {
            cle: "retard",
            emoji: "⚠️",
            label: t.parametres?.notifRetard || "Retard",
            description: t.parametres?.notifRetardDesc || "Alertes pour les retards de paiement",
        },
        {
            cle: "nouvelUtilisateur",
            emoji: "👤",
            label: t.parametres?.notifNouvelUtilisateur || "Nouvel utilisateur",
            description: t.parametres?.notifNouvelUtilisateurDesc || "Notification à chaque inscription",
        },
        {
            cle: "rapportHebdo",
            emoji: "📊",
            label: t.parametres?.notifRapportHebdo || "Rapport hebdomadaire",
            description: t.parametres?.notifRapportHebdoDesc || "Résumé automatique chaque semaine",
        },
    ];

    // ─── Contenu par onglet ─────────────────────────────────────────────────────

    const contenu: Record<string, JSX.Element> = {
        // ── DÉMARRAGE ─────────────────────────────────────────────────────────────
        demarrage: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        🚀 {t.aide?.demarrageTitre || "Bienvenue sur MicroFinance Admin"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.aide?.démarrageDesc || "Gérez vos opérations de microfinance"}
                    </p>
                </div>

                <SimulationEcran titre={t.aide?.simulationTDB || "Tableau de bord"}>
                    <div className="space-y-3">
                        <div
                            className="rounded-xl p-3 flex items-center gap-3"
                            style={{
                                background: "linear-gradient(135deg, #052e16, #15803d)",
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                                style={{ background: "rgba(255,255,255,0.2)" }}
                            >
                                A
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">
                                    {t.aide?.simulationBonjour || "Bonjour, Admin"} 👋
                                </p>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                                    {t.aide?.simulationDate || "Tableau de bord"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {
                                    icone: "👥",
                                    label: t.navigation?.utilisateurs || "Utilisateurs",
                                    valeur: "124",
                                    couleur: "#16a34a",
                                },
                                {
                                    icone: "💳",
                                    label: t.navigation?.credits || "Crédits",
                                    valeur: "38",
                                    couleur: "#0891b2",
                                },
                                {
                                    icone: "🐷",
                                    label: t.navigation?.epargnes || "Épargnes",
                                    valeur: "89",
                                    couleur: "#F59E0B",
                                },
                            ].map((carte, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl p-2.5 border"
                                    style={{
                                        background: `${carte.couleur}08`,
                                        border: `1px solid ${carte.couleur}20`,
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-sm">{carte.icone}</span>
                                        <p className="text-xs text-gray-500 truncate">{carte.label}</p>
                                    </div>
                                    <p className="text-base font-bold" style={{ color: carte.couleur }}>
                                        {carte.valeur}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl p-3 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    📈 {t.tableauDeBord?.evolutionActivites || "Évolution des activités"}
                                </p>
                                <span
                                    className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                                    style={{
                                        background: "rgba(22,163,74,0.1)",
                                        color: "#16a34a",
                                    }}
                                >
                                    {t.rapports?.sixMois || "6 mois"}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                                <LineChart data={simulationData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="mois"
                                        tick={{ fontSize: 9, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        formatter={(v) =>
                                            typeof v === "number"
                                                ? new Intl.NumberFormat("fr-FR").format(v) + " FCFA"
                                                : "—"
                                        }
                                        contentStyle={{
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "11px",
                                        }}
                                    />
                                    <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: "10px" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="credits"
                                        stroke="#16a34a"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name={t.navigation?.credits || "Crédits"}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="epargnes"
                                        stroke="#F59E0B"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name={t.navigation?.epargnes || "Épargnes"}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="transactions"
                                        stroke="#0891b2"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name={t.navigation?.transactions || "Transactions"}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </SimulationEcran>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        {t.aide?.etapesDemarrage || "Étapes de démarrage"}
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre={t.aide?.etape1Titre || "Connectez-vous"}
                            description={t.aide?.etape1Desc || "Entrez vos identifiants"}
                        />
                        <Etape
                            numero="2"
                            titre={t.aide?.etape2Titre || "Explorez le tableau de bord"}
                            description={t.aide?.etape2Desc || "Visualisez les statistiques"}
                        />
                        <Etape
                            numero="3"
                            titre={t.aide?.etape3Titre || "Naviguez via le menu"}
                            description={t.aide?.etape3Desc || "Accédez aux différentes sections"}
                        />
                        <Etape
                            numero="4"
                            titre={t.aide?.etape4Titre || "Personnalisez l'interface"}
                            description={t.aide?.etape4Desc || "Configurez vos préférences"}
                        />
                    </div>
                </div>

                <Astuce texte={t.aide?.astuceDeMarrage || "Consultez le tableau de bord chaque matin"} />
            </div>
        ),

        // ── UTILISATEURS (clients/commerçants) ────────────────────────────────────
        utilisateurs: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        👥 {t.utilisateurs?.titre || "Utilisateurs"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.utilisateurs?.description || "Gérez les commerçants inscrits sur la plateforme."}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        {t.aide?.actionsDisponibles || "Actions disponibles"}
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre={t.aide?.uEtape1Titre || "Rechercher un utilisateur"}
                            description={
                                t.aide?.uEtape1Desc ||
                                "Utilisez la barre de recherche pour trouver un commerçant par nom."
                            }
                        />
                        <Etape
                            numero="2"
                            titre={t.aide?.uEtape2Titre || "Filtrer par statut"}
                            description={
                                t.aide?.uEtape2Desc || "Filtrez la liste par statut : Actif, Inactif ou Suspendu."
                            }
                        />
                        <Etape
                            numero="3"
                            titre={t.aide?.uEtape3Titre || "Voir le profil"}
                            description={
                                t.aide?.uEtape3Desc ||
                                "Cliquez sur 'Voir' pour consulter les détails complets d'un commerçant."
                            }
                        />
                        <Etape
                            numero="4"
                            titre={t.aide?.uEtape4Titre || "Suspendre / Activer"}
                            description={
                                t.aide?.uEtape4Desc ||
                                "Utilisez le bouton 'Suspendre' pour bloquer temporairement un compte."
                            }
                        />
                    </div>
                </div>

                <SimulationEcran titre={t.navigation?.utilisateurs || "Utilisateurs"}>
                    <div className="space-y-2">
                        {utilisateursDemo.map((u, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                        style={{
                                            background: u.statut === "actif" ? "#16a34a" : "#f97316",
                                        }}
                                    >
                                        {u.nom.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            {u.nom}
                                        </p>
                                        <p className="text-xs text-gray-400">{u.ville}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge statut={u.statut} />
                                    <span className="text-xs text-gray-400">
                                        {u.credits} {t.credits?.creditsLabel || "crédits"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SimulationEcran>

                <Important
                    texte={
                        t.aide?.importantUtilisateurs ||
                        "La suspension d'un compte empêche le commerçant d'accéder à ses services."
                    }
                />
                <Astuce
                    texte={
                        t.aide?.astuceUtilisateurs ||
                        "Utilisez le filtre 'Suspendu' régulièrement pour vérifier les comptes à surveiller."
                    }
                />
            </div>
        ),

        // ── AGENTS DE TERRAIN (NOUVEL ONGLET) ─────────────────────────────────────
        agentsTerrain: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        👥 {t.agentsTerrain?.listeTitre || "Agents de terrain"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.agentsTerrain?.listeDescription ||
                            "Gérez les agents chargés des vérifications sur le terrain"}
                    </p>
                </div>

                {/* Processus de création */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        📋 {t.aide?.processusCreation || "Processus de création d'un agent"}
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre={t.agentsTerrain?.etape1Titre || "Accéder à la page Agents"}
                            description={
                                t.agentsTerrain?.etape1Desc || "Dans le menu latéral, cliquez sur 'Agents de terrain'"
                            }
                        />
                        <Etape
                            numero="2"
                            titre={t.agentsTerrain?.etape2Titre || "Cliquer sur 'Nouvel agent'"}
                            description={t.agentsTerrain?.etape2Desc || "Le bouton vert en haut à droite de la page"}
                        />
                        <Etape
                            numero="3"
                            titre={t.agentsTerrain?.etape3Titre || "Remplir le formulaire"}
                            description={
                                t.agentsTerrain?.etape3Desc || "Nom, prénom, téléphone, ville, email et mot de passe"
                            }
                        />
                        <Etape
                            numero="4"
                            titre={t.agentsTerrain?.etape4Titre || "Valider la création"}
                            description={t.agentsTerrain?.etape4Desc || "Cliquez sur 'Créer l'agent' pour finaliser"}
                        />
                    </div>
                </div>

                {/* Interface de gestion des agents */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        🖥️ {t.aide?.interfaceGestion || "Interface de gestion des agents"}
                    </h4>

                    {/* Sélecteur vue Tableau/Cartes */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                            <button
                                onClick={() => setVueAgents("tableau")}
                                className={`px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                                    vueAgents === "tableau"
                                        ? "bg-white dark:bg-gray-700 text-green-600 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                📋 {t.aide?.vueTableau || "Tableau"}
                            </button>
                            <button
                                onClick={() => setVueAgents("cartes")}
                                className={`px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                                    vueAgents === "cartes"
                                        ? "bg-white dark:bg-gray-700 text-green-600 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                🃏 {t.agentsTerrain?.vueCartes || "Vue cartes"}
                            </button>
                        </div>
                        <button
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-white"
                            style={{
                                background: "linear-gradient(135deg, #16a34a, #0891b2)",
                            }}
                        >
                            <Plus size={12} /> {t.agentsTerrain?.nouvelAgent || "Nouvel agent"}
                        </button>
                    </div>

                    <SimulationEcran titre={t.agentsTerrain?.listeTitre || "Agents de terrain"}>
                        {vueAgents === "tableau" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="text-left py-2 px-2 text-gray-500 font-semibold">
                                                {t.agentsTerrain?.colAgent || "Agent"}
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-500 font-semibold hidden md:table-cell">
                                                {t.agentsTerrain?.colZone || "Ville"}
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-500 font-semibold">
                                                {t.agentsTerrain?.colStatut || "Statut"}
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-500 font-semibold hidden lg:table-cell">
                                                {t.agentsTerrain?.colDossiers || "Dossiers"}
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-500 font-semibold">
                                                {t.agentsTerrain?.colActions || "Actions"}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agentsDemo.map((agent) => (
                                            <tr key={agent.id} className="border-b border-gray-50 dark:border-gray-800">
                                                <td className="py-2 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                            style={{
                                                                background: "linear-gradient(135deg, #16a34a, #0891b2)",
                                                            }}
                                                        >
                                                            {agent.nom.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                                {agent.nom}
                                                            </p>
                                                            <p className="text-xs text-gray-400 font-mono">
                                                                {agent.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 hidden md:table-cell">{agent.ville}</td>
                                                <td className="py-2 px-2">
                                                    <Badge statut={agent.statut} />
                                                </td>
                                                <td className="py-2 px-2 hidden lg:table-cell">{agent.dossiers}</td>
                                                <td className="py-2 px-2">
                                                    <div className="flex items-center gap-1">
                                                        <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <Eye size={12} style={{ color: "#0891b2" }} />
                                                        </button>
                                                        <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            {agent.statut === "actif" ? (
                                                                <UserX size={12} style={{ color: "#ef4444" }} />
                                                            ) : (
                                                                <UserCheck size={12} style={{ color: "#16a34a" }} />
                                                            )}
                                                        </button>
                                                        <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <Trash2 size={12} style={{ color: "#ef4444" }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {agentsDemo.map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="p-2 rounded-xl border border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                    style={{
                                                        background: "linear-gradient(135deg, #16a34a, #0891b2)",
                                                    }}
                                                >
                                                    {agent.nom.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-800 dark:text-white">
                                                        {agent.nom}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{agent.ville}</p>
                                                </div>
                                            </div>
                                            <Badge statut={agent.statut} />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>📞 {agent.telephone}</span>
                                            <span>
                                                📁 {agent.dossiers} {t.agentsTerrain?.dossiers || "dossiers"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SimulationEcran>
                </div>

                {/* Formulaire de création */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        ➕ {t.agentsTerrain?.creerTitre || "Créer un nouvel agent"}
                    </h4>
                    <SimulationEcran titre={t.agentsTerrain?.titre || "Nouvel agent de terrain"}>
                        <SimulationFormulaireAgent />
                    </SimulationEcran>
                </div>

                {/* Résumé des statuts */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20">
                        <UserCheck size={14} className="text-green-600" />
                        <span className="text-xs text-green-700 dark:text-green-300">
                            {t.agentsTerrain?.agentsActifs || "Actifs"} :{" "}
                            {agentsDemo.filter((a) => a.statut === "actif").length}{" "}
                            {t.agentsTerrain?.agents || "agents"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                        <UserX size={14} className="text-amber-600" />
                        <span className="text-xs text-amber-700 dark:text-amber-300">
                            {t.agentsTerrain?.agentsSuspendus || "Suspendus"} :{" "}
                            {agentsDemo.filter((a) => a.statut === "suspendu").length}{" "}
                            {t.agentsTerrain?.agents || "agents"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <CreditCard size={14} className="text-blue-600" />
                        <span className="text-xs text-blue-700 dark:text-blue-300">
                            {t.agentsTerrain?.totalDossiers || "Total dossiers"} :{" "}
                            {agentsDemo.reduce((sum, a) => sum + a.dossiers, 0)}
                        </span>
                    </div>
                </div>

                <Important
                    texte={
                        t.agentsTerrain?.confirmationTexteStatut ||
                        "La suspension d'un agent bloque immédiatement son accès à la plateforme. La suppression est définitive et irréversible."
                    }
                />
                <Astuce
                    texte={
                        t.agentsTerrain?.astuce ||
                        "Utilisez le filtre par statut pour identifier rapidement les agents suspendus et réévaluer leur situation."
                    }
                />
            </div>
        ),

        // ── CRÉDITS ───────────────────────────────────────────────────────────────
        credits: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        💳 {t.credits?.titre || "Crédits"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.credits?.description || "Gérez les microcrédits accordés aux commerçants."}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        {t.aide?.processusApprobation || "Processus d'approbation"}
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre={t.aide?.cEtape1Titre || "Identifier les demandes en attente"}
                            description={
                                t.aide?.cEtape1Desc ||
                                "Filtrez par statut 'En attente' pour voir toutes les nouvelles demandes."
                            }
                        />
                        <Etape
                            numero="2"
                            titre={t.aide?.cEtape2Titre || "Vérifier les informations"}
                            description={
                                t.aide?.cEtape2Desc ||
                                "Consultez le montant demandé, le taux d'intérêt et la date d'échéance."
                            }
                        />
                        <Etape
                            numero="3"
                            titre={t.aide?.cEtape3Titre || "Approuver ou rejeter"}
                            description={
                                t.aide?.cEtape3Desc ||
                                "Cliquez sur 'Approuver' ou 'Rejeter'. Une modale de confirmation s'affiche."
                            }
                        />
                        <Etape
                            numero="4"
                            titre={t.aide?.cEtape4Titre || "Confirmation"}
                            description={
                                t.aide?.cEtape4Desc || "Confirmez votre décision. Les fonds sont débloqués sous 24h."
                            }
                        />
                    </div>
                </div>

                <Important
                    texte={
                        t.aide?.importantCredits ||
                        "Les crédits en retard doivent être traités en priorité. Contactez le commerçant concerné pour trouver une solution."
                    }
                />
            </div>
        ),

        // ── ÉPARGNES ──────────────────────────────────────────────────────────────
        epargnes: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        🐷 {t.epargnes?.titre || "Épargnes"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.epargnes?.description || "Suivez les comptes d'épargne des commerçants."}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        {t.aide?.comprendreEpargnes || "Comprendre les types d'épargne"}
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre={t.aide?.eEtape1Titre || "Épargne quotidienne"}
                            description={t.aide?.eEtape1Desc || "Le commerçant effectue un dépôt chaque jour."}
                        />
                        <Etape
                            numero="2"
                            titre={t.aide?.eEtape2Titre || "Épargne hebdomadaire"}
                            description={t.aide?.eEtape2Desc || "Le commerçant effectue un dépôt chaque semaine."}
                        />
                        <Etape
                            numero="3"
                            titre={t.aide?.eEtape3Titre || "Suivi de la progression"}
                            description={
                                t.aide?.eEtape3Desc ||
                                "La barre de progression indique le pourcentage atteint par rapport à l'objectif."
                            }
                        />
                    </div>
                </div>

                <Astuce
                    texte={
                        t.aide?.astuceEpargnes ||
                        "Encouragez les commerçants à maintenir une épargne régulière — cela améliore leur score de crédit."
                    }
                />
            </div>
        ),

        // ── TRANSACTIONS ──────────────────────────────────────────────────────────
        transactions: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        💸 {t.transactions?.titre || "Transactions"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.transactions?.description || "Suivi de toutes les opérations financières."}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { nom: "Orange Money", emoji: "🟠" },
                        { nom: "MTN Mobile Money", emoji: "🟡" },
                    ].map((canal, i) => (
                        <div key={i} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                            <span className="text-2xl">{canal.emoji}</span>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">{canal.nom}</p>
                        </div>
                    ))}
                </div>

                <Astuce
                    texte={
                        t.aide?.astuceTransactions ||
                        "Utilisez le double filtre (type + canal) pour analyser rapidement les performances par canal."
                    }
                />
            </div>
        ),

        // ── PARAMÈTRES ────────────────────────────────────────────────────────────
        // ── PARAMÈTRES ────────────────────────────────────────────────────────────
        parametres: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                        ⚙️ {t.parametresMicrofinance?.titre || "Paramètres"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.parametresMicrofinance?.description || "Configuration des règles de la microfinance."}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        📋 Règles configurables
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="💰"
                            titre={t.parametresMicrofinance?.soldeMinimum || "Solde minimum après retrait"}
                            description={
                                t.parametresMicrofinance?.soldeMinimumDescription ||
                                "Montant que chaque client doit conserver sur son compte après un retrait."
                            }
                        />
                        <Etape
                            numero="🐷"
                            titre={t.parametresMicrofinance?.tauxEpargne || "Taux d'épargne annuel"}
                            description={
                                t.parametresMicrofinance?.tauxEpargneDescription ||
                                "Intérêts versés aux clients sur leur épargne. Ne peut pas dépasser le taux d'intérêt des crédits."
                            }
                        />
                        <Etape
                            numero="💳"
                            titre={t.parametresMicrofinance?.tauxInteret || "Taux d'intérêt des crédits"}
                            description={
                                t.parametresMicrofinance?.tauxInteretDescription ||
                                "Taux appliqué à tous les nouveaux crédits accordés. Doit rester supérieur ou égal au taux d'épargne."
                            }
                        />
                    </div>
                </div>

                <SimulationEcran titre={t.parametresMicrofinance?.titre || "Paramètres"}>
                    <div className="space-y-3">
                        {[
                            {
                                icone: "💰",
                                label: t.parametresMicrofinance?.soldeMinimum || "Solde minimum après retrait",
                                valeur: "5 000",
                                unite: t.parametresMicrofinance?.FCFA || "FCFA",
                                couleur: "#3b82f6",
                            },
                            {
                                icone: "🐷",
                                label: t.parametresMicrofinance?.tauxEpargne || "Taux d'épargne annuel",
                                valeur: "3,5",
                                unite: t.parametresMicrofinance?.pourcentageParAn || "% par an",
                                couleur: "#16a34a",
                            },
                            {
                                icone: "💳",
                                label: t.parametresMicrofinance?.tauxInteret || "Taux d'intérêt des crédits",
                                valeur: "12",
                                unite: t.parametresMicrofinance?.pourcentageParAn || "% par an",
                                couleur: "#f59e0b",
                            },
                        ].map((bloc, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                                        style={{ background: `${bloc.couleur}18` }}
                                    >
                                        {bloc.icone}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                        {bloc.label}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                                        {bloc.valeur}
                                    </span>
                                    <span className="text-xs text-gray-400">{bloc.unite}</span>
                                    <button
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label={t.parametresMicrofinance?.modifier || "Modifier"}
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                            <AlertTriangle size={12} className="shrink-0" />
                            <span>Taux épargne (3,5%) doit rester ≤ Taux crédit (12%)</span>
                        </div>
                    </div>
                </SimulationEcran>

                <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                        ✏️ Comment modifier un paramètre
                    </h4>
                    <div className="carte">
                        <Etape
                            numero="1"
                            titre="Cliquer sur le crayon"
                            description={
                                "Repérez le paramètre à modifier et cliquez sur l'icône crayon ✏️ à droite du bloc."
                            }
                        />
                        <Etape
                            numero="2"
                            titre="Saisir la nouvelle valeur"
                            description={
                                "Le champ passe en mode édition. Saisissez la nouvelle valeur. Pour les taux, la valeur de référence de l'autre taux s'affiche en dessous."
                            }
                        />
                        <Etape
                            numero="3"
                            titre="Valider ou annuler"
                            description={
                                "Cliquez sur ✓ pour valider ou ✕ pour annuler. La validation est immédiate pour le solde minimum."
                            }
                        />
                        <Etape
                            numero="4"
                            titre="Confirmer le changement (taux uniquement)"
                            description={
                                "Pour les taux, une modale de confirmation s'affiche avec l'ancienne et la nouvelle valeur. Confirmez pour appliquer le changement à tous les futurs crédits et épargnes."
                            }
                        />
                    </div>
                </div>

                <Important
                    texte={
                        "Le taux d'épargne ne peut jamais dépasser le taux d'intérêt des crédits. Cette règle protège la microfinance contre les pertes. Si vous devez augmenter le taux d'épargne, assurez-vous que le taux de crédit reste supérieur ou égal."
                    }
                />

                <Astuce
                    texte={
                        "Les modifications de taux sont irréversibles pour les nouveaux crédits. Les crédits en cours conservent leur taux d'origine jusqu'à leur terme."
                    }
                />
            </div>
        ),
        // ── FAQ ───────────────────────────────────────────────────────────────────
        faq: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">❓ {t.aide?.faq || "FAQ"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.aide?.faqDesc || "Retrouvez les réponses aux questions les plus posées."}
                    </p>
                </div>

                <div className="space-y-2">
                    {faqItems.map((item, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <button
                                onClick={() => setFaqOuverte(faqOuverte === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-sm font-semibold text-gray-800 dark:text-white pr-4">
                                    {item.question}
                                </span>
                                {faqOuverte === i ? (
                                    <ChevronUp size={16} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-400" />
                                )}
                            </button>
                            {faqOuverte === i && (
                                <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle
                                            size={15}
                                            className="shrink-0 mt-0.5"
                                            style={{ color: "#16a34a" }}
                                        />
                                        <p>{item.reponse}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        ),
    };

    // ─── Rendu principal ─────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Titre */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t.aide?.titre || "Centre d'aide"}
                    </h2>
                    <p className="sous-titre">{t.aide?.description || "Guide d'utilisation"}</p>
                </div>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                        boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                    }}
                >
                    <HelpCircle size={20} className="text-white" />
                </div>
            </div>

            {/* Barre de recherche */}
            <div className="barre-recherche">
                <Search size={15} style={{ color: "#16a34a" }} className="shrink-0" />
                <input
                    type="search"
                    placeholder={t.aide?.recherche || "Rechercher..."}
                    value={recherche}
                    onChange={(e) => {
                        setRecherche(e.target.value);
                        setFaqOuverte(null);
                    }}
                    className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder-gray-400"
                />
            </div>

            {/* Mode recherche active */}
            {afficherRecherche ? (
                <div className="carte space-y-4">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        🔍 {t.aide?.resultatsRecherche || "Résultats pour"} :{" "}
                        <span style={{ color: "#16a34a" }}>"{recherche}"</span>
                    </p>
                    {ongletsFiltres.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                                {t.aide?.sections || "Sections"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {ongletsFiltres.map((o) => {
                                    const Icone = o.icone;
                                    return (
                                        <button
                                            key={o.id}
                                            onClick={() => {
                                                setOngletActif(o.id);
                                                setRecherche("");
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                                            style={{
                                                background: `${o.couleur}15`,
                                                color: o.couleur,
                                                border: `1px solid ${o.couleur}30`,
                                            }}
                                        >
                                            <Icone size={13} />
                                            {o.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {faqFiltrees.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">FAQ</p>
                            {faqFiltrees.map((item, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-2"
                                >
                                    <button
                                        onClick={() => setFaqOuverte(faqOuverte === i ? null : i)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                                    >
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {item.question}
                                        </span>
                                        {faqOuverte === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {faqOuverte === i && (
                                        <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-3">
                                            <p>{item.reponse}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {ongletsFiltres.length === 0 && faqFiltrees.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">
                            {t.aide?.aucunResultat || "Aucun résultat trouvé."}
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {/* Onglets */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {onglets.map((onglet) => {
                            const Icone = onglet.icone;
                            const actif = ongletActif === onglet.id;
                            return (
                                <button
                                    key={onglet.id}
                                    onClick={() => setOngletActif(onglet.id)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0"
                                    style={
                                        actif
                                            ? {
                                                  background: `linear-gradient(135deg, ${onglet.couleur}, ${onglet.couleur}cc)`,
                                                  color: "white",
                                                  boxShadow: `0 2px 8px ${onglet.couleur}50`,
                                              }
                                            : {
                                                  background: "white",
                                                  color: "#6b7280",
                                                  border: "1px solid #e5e7eb",
                                              }
                                    }
                                >
                                    <Icone size={14} style={{ color: actif ? "white" : onglet.couleur }} />
                                    {onglet.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Contenu actif */}
                    <div className="carte">{contenu[ongletActif]}</div>
                </>
            )}

            {/* Pied de page support */}
            <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, #052e16, #14532d)" }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                >
                    <HelpCircle size={20} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">
                        {t.aide?.besoinAide || "Besoin d'aide supplémentaire ?"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {t.aide?.contactSupport || "support@microfinance.com"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Aide;
