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
  Moon,
  Globe,
  LogOut,
  LucideIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLangue } from "../context/LangueContext";

// Types pour les onglets
interface Onglet {
  id: string;
  label: string;
  icone: LucideIcon;
  couleur: string;
}

// Types pour les items FAQ
interface FaqItem {
  question: string;
  reponse: string;
}

// Types pour les props des composants réutilisables
interface AstuceProps {
  texte: string;
}

interface ImportantProps {
  texte: string;
}

interface EtapeProps {
  numero: number | string;
  titre: string;
  description: string;
}

interface SimulationEcranProps {
  children: React.ReactNode;
  titre: string;
}

// Composants réutilisables
const Astuce = ({ texte }: AstuceProps) => (
  <div
    className="flex items-start gap-3 p-4 rounded-xl mt-4"
    style={{
      background: "rgba(22,163,74,0.08)",
      border: "1px solid rgba(22,163,74,0.2)",
    }}
  >
    <Lightbulb
      size={16}
      className="shrink-0 mt-0.5"
      style={{ color: "#16a34a" }}
    />
    <p className="text-sm text-gray-700 dark:text-gray-300">
      <span className="font-semibold" style={{ color: "#16a34a" }}>
        💡 Astuce —{" "}
      </span>
      {texte}
    </p>
  </div>
);

const Important = ({ texte }: ImportantProps) => (
  <div
    className="flex items-start gap-3 p-4 rounded-xl mt-4"
    style={{
      background: "rgba(245,158,11,0.08)",
      border: "1px solid rgba(245,158,11,0.2)",
    }}
  >
    <AlertTriangle
      size={16}
      className="shrink-0 mt-0.5"
      style={{ color: "#F59E0B" }}
    />
    <p className="text-sm text-gray-700 dark:text-gray-300">
      <span className="font-semibold" style={{ color: "#F59E0B" }}>
        ⚠️ Important —{" "}
      </span>
      {texte}
    </p>
  </div>
);

const Etape = ({ numero, titre, description }: EtapeProps) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
    >
      {numero}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800 dark:text-white">
        {titre}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        {description}
      </p>
    </div>
  </div>
);

const SimulationEcran = ({ children, titre }: SimulationEcranProps) => (
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

// Données pour le graphique de simulation
const simulationData = [
  { mois: "Aoû", credits: 120000, epargnes: 80000, transactions: 95000 },
  { mois: "Sep", credits: 145000, epargnes: 95000, transactions: 110000 },
  { mois: "Oct", credits: 130000, epargnes: 105000, transactions: 125000 },
  { mois: "Nov", credits: 160000, epargnes: 115000, transactions: 140000 },
  { mois: "Déc", credits: 175000, epargnes: 130000, transactions: 155000 },
  { mois: "Jan", credits: 190000, epargnes: 145000, transactions: 170000 },
];

const Aide = () => {
  const { t } = useLangue();
  const [ongletActif, setOngletActif] = useState<string>("demarrage");
  const [recherche, setRecherche] = useState<string>("");
  const [faqOuverte, setFaqOuverte] = useState<number | null>(null);

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

  // Données FAQ
  const faqItems: FaqItem[] = [
    {
      question: t.aide?.faq1Q || "Comment me connecter ?",
      reponse:
        t.aide?.faq1R || "Utilisez vos identifiants pour vous connecter.",
    },
    {
      question: t.aide?.faq2Q || "Comment approuver un crédit ?",
      reponse:
        t.aide?.faq2R || "Filtrez par 'En attente' et cliquez sur Approuver.",
    },
    {
      question: t.aide?.faq3Q || "Comment me déconnecter ?",
      reponse:
        t.aide?.faq3R || "Cliquez sur le bouton de déconnexion en bas du menu.",
    },
    {
      question: t.aide?.faq4Q || "Comment activer le mode sombre ?",
      reponse:
        t.aide?.faq4R || "Allez dans Paramètres et activez le mode sombre.",
    },
    {
      question: t.aide?.faq5Q || "Comment changer la langue ?",
      reponse:
        t.aide?.faq5R || "Dans Paramètres, sélectionnez votre langue préférée.",
    },
    {
      question: t.aide?.faq6Q || "Que faire si un crédit est en retard ?",
      reponse:
        t.aide?.faq6R ||
        "Contactez le client et suivez la procédure de recouvrement.",
    },
    {
      question: t.aide?.faq7Q || "Comment exporter les rapports ?",
      reponse: t.aide?.faq7R || "Dans la page Rapports, cliquez sur Exporter.",
    },
  ];

  // Recherche
  const rechercheLower = recherche.toLowerCase();
  const ongletsFiltres = recherche
    ? onglets.filter((o) => o.label.toLowerCase().includes(rechercheLower))
    : onglets;
  const faqFiltrees = recherche
    ? faqItems.filter(
        (f) =>
          f.question.toLowerCase().includes(rechercheLower) ||
          f.reponse.toLowerCase().includes(rechercheLower),
      )
    : faqItems;

  const afficherRecherche = recherche.trim().length > 0;

  // Contenu par onglet
  const contenu: Record<string, JSX.Element> = {
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
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
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
                    <p className="text-xs text-gray-500 truncate">
                      {carte.label}
                    </p>
                  </div>
                  <p
                    className="text-base font-bold"
                    style={{ color: carte.couleur }}
                  >
                    {carte.valeur}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  📈{" "}
                  {t.tableauDeBord?.evolutionActivites ||
                    "Évolution des activités"}
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
                <LineChart
                  data={simulationData}
                  margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v: number) =>
                      new Intl.NumberFormat("fr-FR").format(v) + " FCFA"
                    }
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      fontSize: "11px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={6}
                    wrapperStyle={{ fontSize: "10px" }}
                  />
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
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  💸{" "}
                  {t.tableauDeBord?.dernieresTransactions ||
                    "Dernières Transactions"}
                </p>
              </div>
              {[
                {
                  nom: "Fatou Diallo",
                  montant: "25 000",
                  type: t.transactions?.depot || "Dépôt",
                  couleur: "#16a34a",
                },
                {
                  nom: "Jean Nkomo",
                  montant: "50 000",
                  type: t.transactions?.transfert || "Transfert",
                  couleur: "#0891b2",
                },
                {
                  nom: "Awa Mbeki",
                  montant: "15 000",
                  type: t.transactions?.retrait || "Retrait",
                  couleur: "#f97316",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: tx.couleur }}
                    >
                      {tx.nom.charAt(0)}
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                        style={{ fontSize: "10px" }}
                      >
                        {tx.nom}
                      </p>
                      <p
                        className="text-xs text-gray-400"
                        style={{ fontSize: "9px" }}
                      >
                        {tx.type}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: tx.couleur, fontSize: "10px" }}
                  >
                    {tx.montant} FCFA
                  </p>
                </div>
              ))}
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
              description={
                t.aide?.etape3Desc || "Accédez aux différentes sections"
              }
            />
            <Etape
              numero="4"
              titre={t.aide?.etape4Titre || "Personnalisez l'interface"}
              description={t.aide?.etape4Desc || "Configurez vos préférences"}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            {t.aide?.vueEnsemble || "Vue d'ensemble"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icone: Users,
                couleur: "#0891b2",
                titre: t.navigation?.utilisateurs || "Utilisateurs",
                desc: t.aide?.vueUtilisateurs || "Gérer les utilisateurs",
              },
              {
                icone: CreditCard,
                couleur: "#16a34a",
                titre: t.navigation?.credits || "Crédits",
                desc: t.aide?.vueCredits || "Gérer les crédits",
              },
              {
                icone: PiggyBank,
                couleur: "#F59E0B",
                titre: t.navigation?.epargnes || "Épargnes",
                desc: t.aide?.vueEpargnes || "Suivre les épargnes",
              },
              {
                icone: ArrowLeftRight,
                couleur: "#0891b2",
                titre: t.navigation?.transactions || "Transactions",
                desc: t.aide?.vueTransactions || "Historique des transactions",
              },
            ].map((item, i) => {
              const Icone = item.icone;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.couleur}15` }}
                  >
                    <Icone size={18} style={{ color: item.couleur }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.titre}
                    </p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Astuce
          texte={
            t.aide?.astuceDeMarrage ||
            "Consultez le tableau de bord chaque matin"
          }
        />
      </div>
    ),

    // Les autres onglets suivent la même structure...
    // Pour gagner de l'espace, je continue avec la structure complète dans le prochain message
    utilisateurs: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            👥 {t.aide?.gestionUtilisateurs || "Utilisateurs"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.aide?.utilisateursDesc || "Gérez les utilisateurs"}
          </p>
        </div>
        {/* ... contenu de la section utilisateurs ... */}
      </div>
    ),
    // ... (les autres sections suivent le même modèle)
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.aide?.titre || "Centre d'aide"}
          </h2>
          <p className="sous-titre">
            {t.aide?.description || "Guide d'utilisation"}
          </p>
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
          aria-label={t.aide?.recherche || "Rechercher"}
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
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                FAQ
              </p>
              {faqFiltrees.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-2"
                >
                  <button
                    onClick={() => setFaqOuverte(faqOuverte === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-white pr-4">
                      {item.question}
                    </span>
                    {faqOuverte === i ? (
                      <ChevronUp size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-gray-400 shrink-0"
                      />
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
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
                  <Icone
                    size={14}
                    aria-hidden="true"
                    style={{ color: actif ? "white" : onglet.couleur }}
                  />
                  {onglet.label}
                </button>
              );
            })}
          </div>

          {/* Contenu onglet */}
          <div className="carte">
            {contenu[ongletActif] || (
              <div>Contenu en cours de chargement...</div>
            )}
          </div>
        </>
      )}

      {/* Pied */}
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
            {t.aide?.besoinAide || "Besoin d'aide ?"}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {t.aide?.contactSupport ||
              "Contactez le support : support@microfinance.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aide;
