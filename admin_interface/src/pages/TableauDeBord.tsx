// pages/TableauDeBord.tsx
import { useState, useEffect, useMemo } from "react";
import { Users, CreditCard, PiggyBank, ArrowLeftRight, TrendingUp, AlertTriangle, LucideIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CarteStatistique from "../component/ui/CarteStatique";
import Badge from "../component/ui/Badge";
import useDashboard from "../hooks/useDashboard";
import { useLangue } from "../context/LangueContext";
import { Transaction, Credit } from "../types/donnees.types";

interface Carte {
    titre: string;
    valeur: string | number;
    icone: LucideIcon;
    couleur: string;
    sousTitre: string;
}

interface TableauDeBordProps {
    termeRecherche?: string;
}

const TableauDeBord = ({ termeRecherche = "" }: TableauDeBordProps) => {
    const { t, langue } = useLangue();
    const [maintenant, setMaintenant] = useState<Date>(new Date());
    const { data: dashboardDonnees, chargement: chargementDashboard } = useDashboard();

    // Horloge temps réel
    useEffect(() => {
        const intervalle = setInterval(() => {
            setMaintenant(new Date());
        }, 60000);
        return () => clearInterval(intervalle);
    }, []);

    const formaterMontant = (montant: number): string => new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";

    const obtenirSalutation = (): string => {
        const heure = maintenant.getHours();
        if (heure >= 5 && heure < 12) return t.commun?.bonjour || "Bonjour";
        if (heure >= 12 && heure < 18) return t.commun?.bonApresMidi || "Bon après-midi";
        return t.commun?.bonsoir || "Bonsoir";
    };

    const locale = langue === "fr" ? "fr-FR" : "en-US";

    // Extraction et sécurisation des données statistiques
    const stats = useMemo(
        () =>
            dashboardDonnees?.statistiquesGenerales ?? {
                totalUtilisateurs: 0,
                creditsActifs: 0,
                epargnesActives: 0,
                transactionsAujourdhui: 0,
                revenusTotal: 0,
                tauxRemboursement: 0,
            },
        [dashboardDonnees],
    );

    const txRecents: Transaction[] = dashboardDonnees?.transactionsRecents ?? [];
    const creditsRecents: Credit[] = dashboardDonnees?.creditsRecents ?? [];
    const donneesGraphique = dashboardDonnees?.donneesGraphique ?? [];

    // Filtrage en temps réel basé sur le type Transaction (utilisateur ou canal)
    const transactionsFiltrees = useMemo(() => {
        const rechercheLower = termeRecherche.toLowerCase().trim();
        if (!rechercheLower) return txRecents;
        return txRecents.filter((tx: Transaction) => {
            const utilisateur = String(tx?.utilisateur || "").toLowerCase();
            const canal = String(tx?.canal || "").toLowerCase();
            return utilisateur.includes(rechercheLower) || canal.includes(rechercheLower);
        });
    }, [txRecents, termeRecherche]);

    // Filtrage en temps réel basé sur le type Credit (utilisateur)
    const creditsFiltres = useMemo(() => {
        const rechercheLower = termeRecherche.toLowerCase().trim();
        if (!rechercheLower) return creditsRecents;
        return creditsRecents.filter((c: Credit) => {
            const utilisateur = String(c?.utilisateur || "").toLowerCase();
            return utilisateur.includes(rechercheLower);
        });
    }, [creditsRecents, termeRecherche]);

    const tauxFormate = typeof stats.tauxRemboursement === "number" ? Math.round(stats.tauxRemboursement) : 0;

    const cartes: Carte[] = [
        {
            titre: t.tableauDeBord?.totalUtilisateurs || "Total Utilisateurs",
            valeur: stats.totalUtilisateurs,
            icone: Users,
            couleur: "bg-primary-600",
            sousTitre: t.tableauDeBord?.commercantsInscrits || "Commerçants inscrits",
        },
        {
            titre: t.tableauDeBord?.creditsActifs || "Crédits Actifs",
            valeur: stats.creditsActifs,
            icone: CreditCard,
            couleur: "bg-teal-600",
            sousTitre: t.tableauDeBord?.pretsEnCours || "Prêts en cours",
        },
        {
            titre: t.tableauDeBord?.epargnesActives || "Épargnes Actives",
            valeur: stats.epargnesActives,
            icone: PiggyBank,
            couleur: "bg-gold-500",
            sousTitre: t.tableauDeBord?.comptesEpargne || "Comptes d'épargne",
        },
        {
            titre: t.tableauDeBord?.transactionsAujourdhui || "Transactions Aujourd'hui",
            valeur: stats.transactionsAujourdhui,
            icone: ArrowLeftRight,
            couleur: "bg-blue-500",
            sousTitre: t.tableauDeBord?.canalsMobile || "Orange Money & MTN",
        },
        {
            titre: t.tableauDeBord?.revenusTotal || "Revenus Total",
            valeur: formaterMontant(stats.revenusTotal),
            icone: TrendingUp,
            couleur: "bg-primary-700",
            sousTitre: t.tableauDeBord?.ceMois || "Ce mois-ci",
        },
        {
            titre: t.tableauDeBord?.tauxRemboursement || "Taux de Remboursement",
            valeur: `${tauxFormate} %`,
            icone: AlertTriangle,
            couleur: "bg-orange-500",
            sousTitre: t.tableauDeBord?.sixDerniersMois || "Sur les 6 derniers mois",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Bannière bienvenue */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #052e16 0%, #15803d 50%, #0c4a6e 100%)",
                    boxShadow: "0 4px 20px rgba(22,163,74,0.25)",
                }}
            >
                <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
                    aria-hidden="true"
                />
                <div
                    className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #0891b2, transparent)" }}
                    aria-hidden="true"
                />

                <div className="relative flex items-center gap-4">
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-sm font-medium">
                            {obtenirSalutation()} 👋
                        </p>
                        <h2 className="text-xl font-bold text-white">{t.commun?.administrateur || "Administrateur"}</h2>
                        <p style={{ color: "rgba(255,255,255,0.55)" }} className="text-sm mt-0.5">
                            {t.tableauDeBord?.description || "Bienvenue sur votre tableau de bord"}
                        </p>
                    </div>

                    <div
                        className="ml-auto hidden md:flex flex-col items-end"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                        <p className="text-xs font-medium capitalize">
                            {maintenant.toLocaleDateString(locale, { weekday: "long" })}
                        </p>
                        <p className="text-lg font-bold text-white">
                            {maintenant.toLocaleDateString(locale, { day: "numeric", month: "long" })}
                        </p>
                        <p className="text-xs font-medium mt-0.5">
                            {maintenant.toLocaleTimeString(locale, {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: langue !== "fr",
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {cartes.map((carte, index) => (
                    <CarteStatistique
                        key={index}
                        titre={carte.titre}
                        valeur={chargementDashboard ? "..." : carte.valeur}
                        icone={carte.icone}
                        couleur={carte.couleur}
                        sousTitre={carte.sousTitre}
                    />
                ))}
            </div>

            {/* Graphique */}
            <div className="carte">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="titre-section">
                            {t.tableauDeBord?.evolutionActivites || "Évolution des activités"}
                        </h3>
                        <p className="sous-titre">
                            {t.tableauDeBord?.evolutionDesc || "Crédits, épargnes et transactions sur 6 mois"}
                        </p>
                    </div>
                    <div
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
                    >
                        {t.tableauDeBord?.sixDerniersMois || "6 derniers mois"}
                    </div>
                </div>
                {chargementDashboard ? (
                    <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
                        Chargement du graphique...
                    </div>
                ) : (
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
                                tickFormatter={(v: number) =>
                                    new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(v)
                                }
                            />
                            <Tooltip
                                formatter={(value: unknown) => {
                                    const numericValue =
                                        typeof value === "number" ? value : parseFloat(String(value)) || 0;
                                    return formaterMontant(numericValue);
                                }}
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
                                name={t.navigation?.credits || "Crédits"}
                            />
                            <Line
                                type="monotone"
                                dataKey="epargnes"
                                stroke="#F59E0B"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#F59E0B" }}
                                name={t.navigation?.epargnes || "Épargnes"}
                            />
                            <Line
                                type="monotone"
                                dataKey="transactions"
                                stroke="#0891b2"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#0891b2" }}
                                name={t.navigation?.transactions || "Transactions"}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Tableaux récents filtrés */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Dernières transactions */}
                <div className="carte">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="titre-section">
                                {t.tableauDeBord?.dernieresTransactions || "Dernières Transactions"}
                            </h3>
                            <p className="sous-titre">
                                {t.tableauDeBord?.cinqDernieresOperations || "5 dernières opérations"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {chargementDashboard ? (
                            <p className="text-sm text-gray-400 p-3">Chargement des transactions...</p>
                        ) : transactionsFiltrees.length === 0 ? (
                            <p className="text-sm text-gray-400 p-3">
                                {t.commun?.aucunResultat || "Aucune transaction trouvée"}
                            </p>
                        ) : (
                            transactionsFiltrees.slice(0, 5).map((tx: Transaction) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                                            style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
                                        >
                                            {String(tx.utilisateur || "U").charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                                {tx.utilisateur || ""}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {tx.canal || ""} • {tx.date || ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                                            {formaterMontant(tx.montant)}
                                        </span>
                                        <Badge statut={tx.statut} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Crédits récents */}
                <div className="carte">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="titre-section">{t.tableauDeBord?.creditsRecents || "Crédits Récents"}</h3>
                            <p className="sous-titre">
                                {t.tableauDeBord?.cinqDerniersMicroCredits || "5 derniers microcrédits"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {chargementDashboard ? (
                            <p className="text-sm text-gray-400 p-3">Chargement des crédits...</p>
                        ) : creditsFiltres.length === 0 ? (
                            <p className="text-sm text-gray-400 p-3">
                                {t.commun?.aucunResultat || "Aucun crédit trouvé"}
                            </p>
                        ) : (
                            creditsFiltres.slice(0, 5).map((c: Credit) => (
                                <div
                                    key={c.id}
                                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                                            style={{ background: "linear-gradient(135deg, #F59E0B, #d97706)" }}
                                        >
                                            {String(c.utilisateur || "U").charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                                {c.utilisateur || ""}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {t.credits?.taux || "Taux"} : {c.taux}% •{" "}
                                                {t.credits?.echeance || "Échéance"} : {c.dateEcheance ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                                            {formaterMontant(c.montant)}
                                        </span>
                                        <Badge statut={c.statut} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableauDeBord;
