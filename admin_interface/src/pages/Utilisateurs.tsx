import { useState } from "react";
import { Search, Filter, Eye, Lock, Unlock, Users, X, Phone, MapPin, CreditCard, PiggyBank, Calendar } from "lucide-react";
import Badge from "../component/ui/Badge";
import { utilisateurs } from "../donnees/donneesFictives";
import { useLangue } from "../context/LangueContext";
import { useTheme } from "../context/ThemeContext";
import { Utilisateur } from "../types/donnees.types";

// Props pour la modale
interface ModaleUtilisateurProps {
  utilisateur: Utilisateur | null;
  onFermer: () => void;
  t: any;
}

// Composant ModaleUtilisateur
const ModaleUtilisateur = ({ utilisateur, onFermer, t }: ModaleUtilisateurProps) => {
  const { theme } = useTheme();
  if (!utilisateur) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.utilisateurs.profil} ${utilisateur.nom}`}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: theme === "dark" ? "#111827" : "#ffffff",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          border: theme === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(22,163,74,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div
          className="p-6 relative"
          style={{ background: "linear-gradient(135deg, #052e16, #15803d, #0c4a6e)" }}
        >
          <button
            onClick={onFermer}
            aria-label={t.commun.fermer}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center
            justify-center text-white transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <X size={16} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center
              text-white font-bold text-2xl shrink-0"
              style={{
                background: "rgba(255,255,255,0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {utilisateur.nom.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{utilisateur.nom}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge statut={utilisateur.statut} />
                <span className="text-xs text-white/60">
                  {t.utilisateurs.membreDepuis} {utilisateur.dateInscription}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-5">

          {/* Infos personnelles */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#16a34a" }}>
              📋 {t.utilisateurs.informationsPersonnelles}
            </p>
            <div className="space-y-3">
              {[
                { icone: Phone,    label: t.utilisateurs.telephone,  valeur: utilisateur.telephone,      couleur: "#0891b2" },
                { icone: MapPin,   label: t.utilisateurs.ville,       valeur: utilisateur.ville,          couleur: "#8b5cf6" },
                { icone: Calendar, label: t.utilisateurs.inscription, valeur: utilisateur.dateInscription, couleur: "#6b7280" },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${info.couleur}15` }}
                  >
                    <info.icone size={14} style={{ color: info.couleur }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{info.label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {info.valeur}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Séparateur */}
          <div
            className="h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.2), transparent)" }}
          />

          {/* Finances */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#16a34a" }}>
              💰 {t.utilisateurs.donneesFinancieres}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icone: PiggyBank,
                  label: t.utilisateurs.epargnetotale,
                  valeur: `${new Intl.NumberFormat("fr-FR").format(utilisateur.epargne)} FCFA`,
                  couleur: "#F59E0B",
                  fond: "rgba(245,158,11,0.08)",
                },
                {
                  icone: CreditCard,
                  label: t.utilisateurs.creditsActifs,
                  valeur: utilisateur.credits,
                  couleur: "#16a34a",
                  fond: "rgba(22,163,74,0.08)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl"
                  style={{
                    background: stat.fond,
                    border: `1px solid ${stat.couleur}25`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icone size={14} style={{ color: stat.couleur }} aria-hidden="true" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                  <p className="text-base font-bold" style={{ color: stat.couleur }}>
                    {stat.valeur}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={onFermer}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold
            transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #16a34a, #0891b2)",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            }}
          >
            {t.utilisateurs.fermerProfil}
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale Utilisateurs
const Utilisateurs = () => {
  const { t } = useLangue();
  const [recherche, setRecherche] = useState<string>("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [listeUtilisateurs, setListeUtilisateurs] = useState<Utilisateur[]>(utilisateurs as Utilisateur[]);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<Utilisateur | null>(null);

  const utilisateursFiltres = listeUtilisateurs.filter((u) => {
    const correspondRecherche =
      u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.telephone.includes(recherche) ||
      u.ville.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === "tous" || u.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  const changerStatut = (id: number) => {
    setListeUtilisateurs((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, statut: u.statut === "actif" ? "suspendu" : "actif" }
          : u
      )
    );
  };

  const totalActifs    = listeUtilisateurs.filter((u) => u.statut === "actif").length;
  const totalInactifs  = listeUtilisateurs.filter((u) => u.statut === "inactif").length;
  const totalSuspendus = listeUtilisateurs.filter((u) => u.statut === "suspendu").length;

  const cartesResume = [
    { id: "actifs",    label: t.utilisateurs?.actif || "Actif",    valeur: totalActifs,    couleur: "#16a34a", fond: "rgba(22,163,74,0.1)" },
    { id: "inactifs",  label: t.utilisateurs?.inactif || "Inactif",  valeur: totalInactifs,  couleur: "#6b7280", fond: "rgba(107,114,128,0.1)" },
    { id: "suspendus", label: t.utilisateurs?.suspendu || "Suspendu", valeur: totalSuspendus, couleur: "#ef4444", fond: "rgba(239,68,68,0.1)" },
  ];

  return (
    <div className="space-y-6">

      {/* Modale */}
      {utilisateurSelectionne && (
        <ModaleUtilisateur
          utilisateur={utilisateurSelectionne}
          onFermer={() => setUtilisateurSelectionne(null)}
          t={t}
        />
      )}

      {/* Titre */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t.utilisateurs?.titre || "Utilisateurs"}
        </h2>
        <p className="sous-titre">{t.utilisateurs?.description || "Gestion des utilisateurs"}</p>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cartesResume.map((item) => (
          <div key={item.id} className="carte flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.fond }}
            >
              <Users size={20} style={{ color: item.couleur }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.valeur}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recherche et filtre */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="barre-recherche flex-1">
          <Search size={16} className="shrink-0" style={{ color: "#16a34a" }} aria-hidden="true" />
          <input
            type="search"
            placeholder={t.utilisateurs?.recherche || "Rechercher..."}
            aria-label={t.utilisateurs?.recherche || "Rechercher"}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200
            outline-none w-full placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
          <Filter size={16} className="shrink-0" style={{ color: "#16a34a" }} aria-hidden="true" />
          <select
            value={filtreStatut}
            aria-label={t.commun?.filtrer || "Filtrer"}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="tous">{t.utilisateurs?.tousStatuts || "Tous les statuts"}</option>
            <option value="actif">{t.utilisateurs?.actif || "Actif"}</option>
            <option value="inactif">{t.utilisateurs?.inactif || "Inactif"}</option>
            <option value="suspendu">{t.utilisateurs?.suspendu || "Suspendu"}</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label={t.utilisateurs?.titre || "Utilisateurs"}>
            <thead>
              <tr>
                {[
                  { id: "nom",       label: t.utilisateurs?.nom || "Nom" },
                  { id: "telephone", label: t.utilisateurs?.telephone || "Téléphone" },
                  { id: "ville",     label: t.utilisateurs?.ville || "Ville" },
                  { id: "epargne",   label: t.utilisateurs?.epargne || "Épargne" },
                  { id: "credits",   label: t.utilisateurs?.credits || "Crédits" },
                  { id: "statut",    label: t.utilisateurs?.statut || "Statut" },
                  { id: "actions",   label: t.utilisateurs?.actions || "Actions" },
                ].map((col) => (
                  <th key={col.id} className="entete-tableau">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {utilisateursFiltres.length > 0 ? (
                utilisateursFiltres.map((u) => (
                  <tr key={u.id} className="ligne-tableau">
                    <td className="cellule-tableau">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center
                          text-white font-bold text-xs shrink-0"
                          style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
                        >
                          {u.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{u.nom}</p>
                          <p className="text-xs text-gray-400">{u.dateInscription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="cellule-tableau">{u.telephone}</td>
                    <td className="cellule-tableau">{u.ville}</td>
                    <td className="cellule-tableau font-semibold" style={{ color: "#16a34a" }}>
                      {new Intl.NumberFormat("fr-FR").format(u.epargne)} FCFA
                    </td>
                    <td className="cellule-tableau font-semibold text-gray-700 dark:text-gray-300">
                      {u.credits}
                    </td>
                    <td className="cellule-tableau">
                      <Badge statut={u.statut} />
                    </td>
                    <td className="cellule-tableau">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setUtilisateurSelectionne(u)}
                          aria-label={`${t.utilisateurs?.voir || "Voir"} ${u.nom}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                          text-xs font-medium transition-colors"
                          style={{ color: "#0891b2" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(8,145,178,0.1)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Eye size={14} aria-hidden="true" />
                          <span>{t.utilisateurs?.voir || "Voir"}</span>
                        </button>

                        <button
                          onClick={() => changerStatut(u.id)}
                          aria-label={u.statut === "actif"
                            ? `${t.utilisateurs?.suspendre || "Suspendre"} ${u.nom}`
                            : `${t.utilisateurs?.activer || "Activer"} ${u.nom}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                          text-xs font-medium transition-colors"
                          style={{ color: u.statut === "actif" ? "#ef4444" : "#16a34a" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = u.statut === "actif"
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(22,163,74,0.1)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          {u.statut === "actif"
                            ? <><Lock size={14} aria-hidden="true" /><span>{t.utilisateurs?.suspendre || "Suspendre"}</span></>
                            : <><Unlock size={14} aria-hidden="true" /><span>{t.utilisateurs?.activer || "Activer"}</span></>
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(22,163,74,0.1)" }}
                    >
                      <Users size={22} style={{ color: "#16a34a" }} aria-hidden="true" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.utilisateurs?.aucunUtilisateur || "Aucun utilisateur trouvé."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pied-tableau">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {utilisateursFiltres.length} {t.commun?.trouve || "trouvé(s)"} {t.commun?.sur || "sur"} {listeUtilisateurs.length} {t.commun?.total || "total"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Utilisateurs;