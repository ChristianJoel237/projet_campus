import { useState } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, LucideIcon } from "lucide-react";
import Badge from "../component/ui/Badge";
import { transactions } from "../donnees/donneesFictives";
import { useLangue } from "../context/LangueContext";
import { Transaction } from "../types/donnees.types";

// Types pour les cartes résumé
interface CarteResume {
  id: string;
  label: string;
  valeur: string;
  icone: LucideIcon;
  couleur: string;
  fond: string;
}

// Types pour les icônes
type TypeTransaction = "depot" | "retrait" | "transfert" | "remboursement";

const Transactions = () => {
  const { t } = useLangue();
  const [recherche, setRecherche] = useState<string>("");
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreCanal, setFiltreCanal] = useState<string>("tous");

  const transactionsFiltrees = (transactions as Transaction[]).filter((tx) => {
    const correspondRecherche = tx.utilisateur.toLowerCase().includes(recherche.toLowerCase());
    const correspondType  = filtreType  === "tous" || tx.type  === filtreType;
    const correspondCanal = filtreCanal === "tous" || tx.canal === filtreCanal;
    return correspondRecherche && correspondType && correspondCanal;
  });

  const totalDepots         = transactions.filter((t) => t.type === "depot"         && t.statut === "reussi").reduce((acc, t) => acc + t.montant, 0);
  const totalTransferts     = transactions.filter((t) => t.type === "transfert"     && t.statut === "reussi").reduce((acc, t) => acc + t.montant, 0);
  const totalRetraits       = transactions.filter((t) => t.type === "retrait"       && t.statut === "reussi").reduce((acc, t) => acc + t.montant, 0);
  const totalRemboursements = transactions.filter((t) => t.type === "remboursement" && t.statut === "reussi").reduce((acc, t) => acc + t.montant, 0);

  const cartesResume: CarteResume[] = [
    { id: "depots",          label: t.transactions?.totalDepots || "Total Dépôts",     valeur: `${new Intl.NumberFormat("fr-FR").format(totalDepots)} FCFA`,         icone: ArrowDownLeft, couleur: "#16a34a", fond: "rgba(22,163,74,0.1)" },
    { id: "transferts",      label: t.transactions?.totalTransferts || "Total Transferts", valeur: `${new Intl.NumberFormat("fr-FR").format(totalTransferts)} FCFA`,     icone: RefreshCw,     couleur: "#0891b2", fond: "rgba(8,145,178,0.1)" },
    { id: "retraits",        label: t.transactions?.totalRetraits || "Total Retraits",   valeur: `${new Intl.NumberFormat("fr-FR").format(totalRetraits)} FCFA`,       icone: ArrowUpRight,  couleur: "#f97316", fond: "rgba(249,115,22,0.1)" },
    { id: "remboursements",  label: t.transactions?.remboursements || "Remboursements",  valeur: `${new Intl.NumberFormat("fr-FR").format(totalRemboursements)} FCFA`, icone: TrendingUp,    couleur: "#8b5cf6", fond: "rgba(139,92,246,0.1)" },
  ];

  const iconeType = (type: TypeTransaction): JSX.Element | null => {
    switch (type) {
      case "depot":         return <ArrowDownLeft size={14} style={{ color: "#16a34a" }} aria-hidden="true" />;
      case "retrait":       return <ArrowUpRight  size={14} style={{ color: "#f97316" }} aria-hidden="true" />;
      case "transfert":     return <RefreshCw     size={14} style={{ color: "#0891b2" }} aria-hidden="true" />;
      case "remboursement": return <TrendingUp    size={14} style={{ color: "#8b5cf6" }} aria-hidden="true" />;
      default:              return null;
    }
  };

  return (
    <div className="space-y-6">

      {/* Titre */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.transactions?.titre || "Transactions"}</h2>
        <p className="sous-titre">{t.transactions?.description || "Suivi des transactions"}</p>
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
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-0.5">{item.valeur}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="barre-recherche flex-1">
          <Search size={16} className="shrink-0" style={{ color: "#0891b2" }} aria-hidden="true" />
          <input
            type="search"
            placeholder={t.transactions?.recherche || "Rechercher..."}
            aria-label={t.transactions?.recherche || "Rechercher"}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200
            outline-none w-full placeholder-gray-400"
          />
        </div>

        {/* Filtre type */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
          <Filter size={16} className="shrink-0" style={{ color: "#0891b2" }} aria-hidden="true" />
          <select
            value={filtreType}
            aria-label={t.commun?.filtrer || "Filtrer"}
            onChange={(e) => setFiltreType(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="tous">{t.transactions?.tousTypes || "Tous les types"}</option>
            <option value="depot">{t.transactions?.depot || "Dépôt"}</option>
            <option value="retrait">{t.transactions?.retrait || "Retrait"}</option>
            <option value="transfert">{t.transactions?.transfert || "Transfert"}</option>
            <option value="remboursement">{t.transactions?.remboursement || "Remboursement"}</option>
          </select>
        </div>

        {/* Filtre canal */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
          <Filter size={16} className="shrink-0" style={{ color: "#f97316" }} aria-hidden="true" />
          <select
            value={filtreCanal}
            aria-label={t.commun?.filtrer || "Filtrer"}
            onChange={(e) => setFiltreCanal(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="tous">{t.transactions?.tousCanaux || "Tous les canaux"}</option>
            <option value="Orange Money">Orange Money</option>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label={t.transactions?.titre || "Transactions"}>
            <thead>
              <tr>
                {[
                  { id: "commercant", label: t.transactions?.commercant || "Commerçant" },
                  { id: "type",       label: t.transactions?.type || "Type" },
                  { id: "montant",    label: t.transactions?.montant || "Montant" },
                  { id: "canal",      label: t.transactions?.canal || "Canal" },
                  { id: "date",       label: t.transactions?.date || "Date" },
                  { id: "statut",     label: t.transactions?.statut || "Statut" },
                ].map((col) => (
                  <th key={col.id} className="entete-tableau">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {transactionsFiltrees.length > 0 ? (
                transactionsFiltrees.map((tx) => (
                  <tr key={tx.id} className="ligne-tableau">
                    <td className="cellule-tableau">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center
                          text-white font-bold text-xs shrink-0"
                          style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)" }}
                        >
                          {tx.utilisateur.charAt(0)}
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white">{tx.utilisateur}</p>
                      </div>
                    </td>
                    <td className="cellule-tableau">
                      <div className="flex items-center gap-2">
                        {iconeType(tx.type as TypeTransaction)}
                        <Badge statut={tx.type} />
                      </div>
                    </td>
                    <td className="cellule-tableau font-bold text-gray-800 dark:text-white">
                      {new Intl.NumberFormat("fr-FR").format(tx.montant)} FCFA
                    </td>
                    <td className="cellule-tableau">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={tx.canal === "Orange Money"
                          ? { background: "rgba(249,115,22,0.1)", color: "#f97316" }
                          : { background: "rgba(245,158,11,0.1)", color: "#d97706" }
                        }
                      >
                        {tx.canal}
                      </span>
                    </td>
                    <td className="cellule-tableau text-gray-500 dark:text-gray-400">{tx.date}</td>
                    <td className="cellule-tableau"><Badge statut={tx.statut} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(8,145,178,0.1)" }}
                    >
                      <RefreshCw size={22} style={{ color: "#0891b2" }} aria-hidden="true" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.transactions?.aucuneTransaction || "Aucune transaction trouvée."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pied-tableau">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {transactionsFiltrees.length} {t.commun?.trouve || "trouvé(s)"} {t.commun?.sur || "sur"} {transactions.length} {t.commun?.total || "total"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transactions;