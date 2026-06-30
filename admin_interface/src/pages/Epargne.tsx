import { useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  PiggyBank,
  Calendar,
  Users,
  LucideIcon,
} from "lucide-react";
import { epargnes } from "../donnees/donneesFictives";
import { useLangue } from "../context/LangueContext";
import { Epargne } from "../types/donnees.types";

// Types pour les cartes résumé
interface CarteResume {
  id: string;
  label: string;
  valeur: string | number;
  icone: LucideIcon;
  couleur: string;
  fond: string;
}

const Epargnes = () => {
  const { t } = useLangue();
  const [recherche, setRecherche] = useState<string>("");
  const [filtreType, setFiltreType] = useState<string>("tous");

  const epargnesFiltrees = (epargnes as Epargne[]).filter((e) => {
    const correspondRecherche = e.utilisateur
      .toLowerCase()
      .includes(recherche.toLowerCase());
    const correspondType =
      filtreType === "tous" || e.typeEpargne === filtreType;
    return correspondRecherche && correspondType;
  });

  const totalEpargne = epargnesFiltrees.reduce(
    (acc: number, e: Epargne) => acc + e.solde,
    0,
  );
  const totalDepots = epargnesFiltrees.reduce(
    (acc: number, e: Epargne) => acc + e.nombreDepots,
    0,
  );
  const moyenneEpargne =
    epargnesFiltrees.length > 0
      ? Math.round(totalEpargne / epargnesFiltrees.length)
      : 0;

  const epargnantActif = epargnesFiltrees.reduce(
    (max: Epargne | null, e: Epargne) => {
      if (!max) return e;
      return e.solde > max.solde ? e : max;
    },
    null as Epargne | null,
  );

  const cartesResume: CarteResume[] = [
    {
      id: "total",
      label: t.epargnes?.totalEpargnes || "Total Épargnes",
      valeur: `${new Intl.NumberFormat("fr-FR").format(totalEpargne)} FCFA`,
      icone: PiggyBank,
      couleur: "#F59E0B",
      fond: "rgba(245,158,11,0.1)",
    },
    {
      id: "epargnants",
      label: t.epargnes?.epargnants || "Épargnants",
      valeur: epargnesFiltrees.length,
      icone: Users,
      couleur: "#16a34a",
      fond: "rgba(22,163,74,0.1)",
    },
    {
      id: "moyenne",
      label: t.epargnes?.moyenneParCompte || "Moyenne par compte",
      valeur: `${new Intl.NumberFormat("fr-FR").format(moyenneEpargne)} FCFA`,
      icone: TrendingUp,
      couleur: "#0891b2",
      fond: "rgba(8,145,178,0.1)",
    },
    {
      id: "depots",
      label: t.epargnes?.totalDepots || "Total Dépôts",
      valeur: totalDepots,
      icone: Calendar,
      couleur: "#8b5cf6",
      fond: "rgba(139,92,246,0.1)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t.epargnes?.titre || "Épargnes"}
        </h2>
        <p className="sous-titre">
          {t.epargnes?.description || "Suivi des comptes d'épargne"}
        </p>
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
                <Icone
                  size={20}
                  style={{ color: item.couleur }}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">
                  {item.valeur}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meilleur épargnant */}
      {epargnantActif && (
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #78350f, #d97706, #F59E0B)",
            boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
          }}
        >
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, white, transparent)",
            }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
              text-white font-bold text-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {epargnantActif.utilisateur.charAt(0)}
            </div>
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                ⭐{" "}
                {t.epargnes?.meilleurEpargnant || "Meilleur épargnant du mois"}
              </p>
              <p className="text-lg font-bold text-white">
                {epargnantActif.utilisateur}
              </p>
              <p
                className="text-sm mt-0.5"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {new Intl.NumberFormat("fr-FR").format(epargnantActif.solde)}{" "}
                FCFA • {epargnantActif.nombreDepots}{" "}
                {t.epargnes?.nbDepots || "dépôts"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recherche et filtre */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="barre-recherche flex-1">
          <Search
            size={16}
            className="shrink-0"
            style={{ color: "#F59E0B" }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={t.epargnes?.recherche || "Rechercher..."}
            aria-label={t.epargnes?.recherche || "Rechercher"}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200
            outline-none w-full placeholder-gray-400"
          />
        </div>
        <div
          className="flex items-center gap-2 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5"
        >
          <Filter
            size={16}
            className="shrink-0"
            style={{ color: "#F59E0B" }}
            aria-hidden="true"
          />
          <select
            value={filtreType}
            aria-label={t.commun?.filtrer || "Filtrer"}
            onChange={(e) => setFiltreType(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="tous">
              {t.epargnes?.tousTypes || "Tous les types"}
            </option>
            <option value="quotidienne">
              {t.epargnes?.quotidienne || "Quotidienne"}
            </option>
            <option value="hebdomadaire">
              {t.epargnes?.hebdomadaire || "Hebdomadaire"}
            </option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            role="table"
            aria-label={t.epargnes?.titre || "Épargnes"}
          >
            <thead>
              <tr>
                {[
                  {
                    id: "epargnant",
                    label: t.epargnes?.epargnants || "Épargnants",
                  },
                  {
                    id: "type",
                    label: t.epargnes?.typeEpargne || "Type d'épargne",
                  },
                  { id: "solde", label: t.epargnes?.solde || "Solde" },
                  {
                    id: "progression",
                    label: t.epargnes?.progression || "Progression",
                  },
                  { id: "depots", label: t.epargnes?.nbDepots || "Nb. Dépôts" },
                  {
                    id: "dernier",
                    label: t.epargnes?.dernierDepot || "Dernier Dépôt",
                  },
                ].map((col) => (
                  <th key={col.id} className="entete-tableau">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {epargnesFiltrees.length > 0 ? (
                epargnesFiltrees.map((e) => (
                  <tr key={e.id} className="ligne-tableau">
                    <td className="cellule-tableau">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center
                          text-white font-bold text-xs shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #F59E0B, #d97706)",
                          }}
                        >
                          {e.utilisateur.charAt(0)}
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {e.utilisateur}
                        </p>
                      </div>
                    </td>
                    <td className="cellule-tableau">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={
                          e.typeEpargne === "quotidienne"
                            ? {
                                background: "rgba(8,145,178,0.1)",
                                color: "#0891b2",
                              }
                            : {
                                background: "rgba(139,92,246,0.1)",
                                color: "#8b5cf6",
                              }
                        }
                      >
                        {e.typeEpargne === "quotidienne"
                          ? t.epargnes?.quotidienne || "Quotidienne"
                          : t.epargnes?.hebdomadaire || "Hebdomadaire"}
                      </span>
                    </td>
                    <td
                      className="cellule-tableau font-bold"
                      style={{ color: "#16a34a" }}
                    >
                      {new Intl.NumberFormat("fr-FR").format(e.solde)} FCFA
                    </td>
                    <td className="cellule-tableau">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>0</span>
                          <span style={{ color: "#F59E0B" }}>
                            {Math.round((e.solde / 200000) * 100)}%
                          </span>
                        </div>
                        <div
                          className="w-full h-2 rounded-full"
                          style={{ background: "rgba(245,158,11,0.15)" }}
                          role="progressbar"
                          aria-valuenow={Math.round((e.solde / 200000) * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min((e.solde / 200000) * 100, 100)}%`,
                              background:
                                "linear-gradient(135deg, #F59E0B, #d97706)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="cellule-tableau font-semibold text-gray-700 dark:text-gray-300">
                      {e.nombreDepots}
                    </td>
                    <td className="cellule-tableau text-gray-500 dark:text-gray-400">
                      {e.dernierDepot}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(245,158,11,0.1)" }}
                    >
                      <PiggyBank
                        size={22}
                        style={{ color: "#F59E0B" }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.epargnes?.aucuneEpargne || "Aucune épargne trouvée."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pied-tableau">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {epargnesFiltrees.length} {t.commun?.trouve || "trouvé(s)"}{" "}
            {t.commun?.sur || "sur"} {epargnes.length}{" "}
            {t.commun?.total || "total"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Epargnes;
