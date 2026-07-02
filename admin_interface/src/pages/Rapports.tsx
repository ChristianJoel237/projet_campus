import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useState, useRef, useEffect } from "react";
import {
    TrendingUp,
    CreditCard,
    PiggyBank,
    ArrowLeftRight,
    Download,
    FileText,
    ChevronDown,
    LucideIcon,
} from "lucide-react";
import { donneesGraphique, credits, transactions, epargnes } from "../donnees/donneesFictives";
import { exporterPDF, exporterCSV } from "../utilitaires/exportRapport";
import { useLangue } from "../context/LangueContext";
import { Credit, Transaction, Epargne } from "../types/donnees.types";

// Constantes
const COULEURS = ["#0891b2", "#16a34a", "#F59E0B", "#ef4444"];

// Types
interface DonneesStatutsCredits {
    nom: string;
    valeur: number;
}

interface DonneesCanaux {
    canal: string;
    transactions: number;
    montant: number;
}

interface Indicateur {
    label: string;
    valeur: number;
    couleur: string;
}

interface CarteResume {
    id: string;
    titre: string;
    valeur: string;
    sousTitre: string;
    icone: LucideIcon;
    couleur: string;
    fond: string;
}

// Formatage sans caractères spéciaux
const formaterNombre = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatTooltipValue = (value: unknown): string => {
    const num =
        typeof value === "number"
            ? value
            : typeof value === "string"
              ? parseFloat(value)
              : Array.isArray(value) && value.length > 0
                ? parseFloat(String(value[0]))
                : NaN;
    if (isNaN(num)) return "—";
    return formaterNombre(num) + " FCFA";
};

const formatTooltipCount = (value: unknown): string => {
    const num =
        typeof value === "number"
            ? value
            : typeof value === "string"
              ? parseFloat(value)
              : Array.isArray(value) && value.length > 0
                ? parseFloat(String(value[0]))
                : NaN;
    if (isNaN(num)) return "—";
    return formaterNombre(num);
};

const Rapports = () => {
    const { t } = useLangue();
    const [menuExportOuvert, setMenuExportOuvert] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuExportOuvert(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Calculs
    const totalCredits = credits.reduce((acc: number, c: Credit) => acc + c.montant, 0);
    const totalEpargnes = epargnes.reduce((acc: number, e: Epargne) => acc + e.solde, 0);
    const totalTransactions = transactions.reduce((acc: number, tx: Transaction) => acc + tx.montant, 0);
    const transactionsReussies = transactions.filter((tx: Transaction) => tx.statut === "reussi").length;
    const tauxReussite = transactions.length > 0 ? Math.round((transactionsReussies / transactions.length) * 100) : 0;

    // Données pour les graphiques
    const donneesStatutsCredits: DonneesStatutsCredits[] = [
        {
            nom: t.credits?.actif || "Actif",
            valeur: credits.filter((c: Credit) => c.statut === "en_cours").length,
        },
        {
            nom: t.credits?.rembourse_statut || "Remboursé",
            valeur: credits.filter((c: Credit) => c.statut === "rembourse").length,
        },
        {
            nom: t.credits?.enAttente_statut || "En attente",
            valeur: credits.filter((c: Credit) => c.statut === "en_attente").length,
        },
        {
            nom: t.credits?.enRetard_statut || "En retard",
            valeur: credits.filter((c: Credit) => c.statut === "en_retard").length,
        },
    ];

    const donneesCanaux: DonneesCanaux[] = [
        {
            canal: "Orange Money",
            transactions: transactions.filter((tx: Transaction) => tx.canal === "Orange Money").length,
            montant: transactions
                .filter((tx: Transaction) => tx.canal === "Orange Money")
                .reduce((acc, tx) => acc + tx.montant, 0),
        },
        {
            canal: "MTN Mobile Money",
            transactions: transactions.filter((tx: Transaction) => tx.canal === "MTN Mobile Money").length,
            montant: transactions
                .filter((tx: Transaction) => tx.canal === "MTN Mobile Money")
                .reduce((acc, tx) => acc + tx.montant, 0),
        },
    ];

    const indicateurs: Indicateur[] = [
        {
            label: t.rapports?.tauxRemboursement || "Taux de remboursement",
            valeur: 94,
            couleur: "#16a34a",
        },
        {
            label: t.rapports?.transactionsReussies || "Transactions réussies",
            valeur: tauxReussite,
            couleur: "#0891b2",
        },
        {
            label: t.rapports?.epargneReguliere || "Épargne régulière",
            valeur: 72,
            couleur: "#F59E0B",
        },
        {
            label: t.rapports?.creditsEnRetard || "Crédits en retard",
            valeur: 17,
            couleur: "#ef4444",
        },
    ];

    const formaterMontant = (montant: number): string => formaterNombre(montant) + " FCFA";

    const cartesResume: CarteResume[] = [
        {
            id: "credits",
            titre: t.rapports?.volumeCredits || "Volume de Crédits",
            valeur: formaterMontant(totalCredits),
            sousTitre: t.rapports?.totalMicroCredits || "Total des microcrédits",
            icone: CreditCard,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
        },
        {
            id: "epargnes",
            titre: t.rapports?.totalEpargnes || "Total Épargnes",
            valeur: formaterMontant(totalEpargnes),
            sousTitre: t.rapports?.soldeCumule || "Solde cumulé des épargnants",
            icone: PiggyBank,
            couleur: "#F59E0B",
            fond: "rgba(245,158,11,0.1)",
        },
        {
            id: "transactions",
            titre: t.rapports?.volumeTransactions || "Volume Transactions",
            valeur: formaterMontant(totalTransactions),
            sousTitre: t.rapports?.toutesOperations || "Toutes opérations confondues",
            icone: ArrowLeftRight,
            couleur: "#0891b2",
            fond: "rgba(8,145,178,0.1)",
        },
        {
            id: "taux",
            titre: t.rapports?.tauxReussite || "Taux de Réussite",
            valeur: `${tauxReussite}%`,
            sousTitre: t.rapports?.transactionsReussies || "Transactions réussies",
            icone: TrendingUp,
            couleur: "#8b5cf6",
            fond: "rgba(139,92,246,0.1)",
        },
    ];

    const handleExportPDF = () => {
        exporterPDF();
        setMenuExportOuvert(false);
    };
    const handleExportCSV = () => {
        exporterCSV();
        setMenuExportOuvert(false);
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t.rapports?.titre || "Rapports & Analyses"}
                    </h2>
                    <p className="sous-titre">{t.rapports?.description || "Vue d'ensemble des performances"}</p>
                </div>

                {/* Bouton export */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuExportOuvert(!menuExportOuvert)}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #16a34a, #0891b2)",
                            boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
                        }}
                    >
                        <Download size={16} aria-hidden="true" />
                        {t.rapports?.exporterRapport || "Exporter le rapport"}
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${menuExportOuvert ? "rotate-180" : ""}`}
                            aria-hidden="true"
                        />
                    </button>

                    {menuExportOuvert && (
                        <div
                            className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden"
                            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                        >
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.07)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(239,68,68,0.1)" }}
                                >
                                    <FileText size={14} style={{ color: "#ef4444" }} aria-hidden="true" />
                                </div>
                                {t.rapports?.exporterPDF || "Exporter en PDF"}
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-3" />
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(22,163,74,0.07)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(22,163,74,0.1)" }}
                                >
                                    <FileText size={14} style={{ color: "#16a34a" }} aria-hidden="true" />
                                </div>
                                {t.rapports?.exporterExcel || "Télécharger le tableau Excel"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Cartes résumé */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cartesResume.map((item) => {
                    const Icone = item.icone;
                    return (
                        <div key={item.id} className="carte flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: item.fond }}
                            >
                                <Icone size={20} style={{ color: item.couleur }} aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.titre}</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5 truncate">
                                    {item.valeur}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.sousTitre}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Évolution */}
            <div className="carte">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="titre-section">{t.rapports?.evolutionActivites || "Évolution des Activités"}</h3>
                        <p className="sous-titre">{t.rapports?.evolutionDesc || "Tendances sur les 6 derniers mois"}</p>
                    </div>
                    <div
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
                    >
                        {t.rapports?.sixMois || "6 mois"}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={donneesGraphique} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="mois"
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v: number) => formaterNombre(v)}
                        />
                        <Tooltip
                            formatter={(value: unknown) => formatTooltipValue(value)}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                fontSize: "13px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend iconType="circle" iconSize={8} />
                        <Line
                            type="monotone"
                            dataKey="credits"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#16a34a" }}
                            activeDot={{ r: 6 }}
                            name={t.navigation?.credits || "Crédits"}
                        />
                        <Line
                            type="monotone"
                            dataKey="epargnes"
                            stroke="#F59E0B"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#F59E0B" }}
                            activeDot={{ r: 6 }}
                            name={t.navigation?.epargnes || "Épargnes"}
                        />
                        <Line
                            type="monotone"
                            dataKey="transactions"
                            stroke="#0891b2"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#0891b2" }}
                            activeDot={{ r: 6 }}
                            name={t.navigation?.transactions || "Transactions"}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Analyse détaillée */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Répartition crédits */}
                <div className="carte">
                    <h3 className="titre-section mb-1">
                        {t.rapports?.repartitionCredits || "Répartition des Crédits"}
                    </h3>
                    <p className="sous-titre mb-4">
                        {t.rapports?.parStatutRemboursement || "Par statut de remboursement"}
                    </p>
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={donneesStatutsCredits}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    dataKey="valeur"
                                    paddingAngle={3}
                                >
                                    {donneesStatutsCredits.map((_, index) => (
                                        <Cell key={index} fill={COULEURS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: unknown) => {
                                        const count =
                                            typeof value === "number"
                                                ? value
                                                : typeof value === "string"
                                                  ? parseFloat(value)
                                                  : 0;
                                        return `${count} ${t.rapports?.creditLabel || "crédit(s)"}`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2.5 w-full lg:w-auto shrink-0">
                            {donneesStatutsCredits.map((item, index) => (
                                <div key={index} className="flex items-center gap-2.5">
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ background: COULEURS[index] }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.nom}</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white ml-auto pl-4">
                                        {item.valeur}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Canaux de paiement */}
                <div className="carte">
                    <h3 className="titre-section mb-1">{t.rapports?.canauxPaiement || "Canaux de Paiement"}</h3>
                    <p className="sous-titre mb-4">{t.rapports?.canauxDesc || "Orange Money vs MTN Mobile Money"}</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={donneesCanaux} barSize={36}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="canal"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(value: unknown) => formatTooltipCount(value)}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                    fontSize: "13px",
                                }}
                            />
                            <Legend iconType="circle" iconSize={8} />
                            <Bar
                                dataKey="transactions"
                                fill="#f97316"
                                name={t.rapports?.nbTransactions || "Nb. Transactions"}
                                radius={[6, 6, 0, 0]}
                            />
                            <Bar
                                dataKey="montant"
                                fill="#16a34a"
                                name={t.rapports?.montantFCFA || "Montant (FCFA)"}
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Indicateurs de performance */}
            <div className="carte">
                <h3 className="titre-section mb-1">{t.rapports?.indicateurs || "Indicateurs de Performance"}</h3>
                <p className="sous-titre mb-5">{t.rapports?.indicateursDesc || "Taux clés de la plateforme"}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {indicateurs.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.label}
                                </span>
                                <span
                                    className="text-sm font-bold px-2 py-0.5 rounded-lg"
                                    style={{
                                        background: `${item.couleur}15`,
                                        color: item.couleur,
                                    }}
                                >
                                    {item.valeur}%
                                </span>
                            </div>
                            <div
                                className="w-full h-2.5 rounded-full"
                                style={{ background: `${item.couleur}15` }}
                                role="progressbar"
                                aria-valuenow={item.valeur}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="h-2.5 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${item.valeur}%`,
                                        background: `linear-gradient(135deg, ${item.couleur}, ${item.couleur}99)`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {item.valeur >= 80
                                    ? t.commun?.excellent || "✅ Excellent"
                                    : item.valeur >= 60
                                      ? t.commun?.satisfaisant || "⚠️ Satisfaisant"
                                      : t.commun?.ameliorer || "❌ À améliorer"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rapports;
