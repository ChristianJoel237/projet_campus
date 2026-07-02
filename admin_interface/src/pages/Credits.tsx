// pages/Credits.tsx
import { useState, useEffect } from "react";
import { Search, Filter, Check, X, AlertTriangle, CreditCard, TrendingUp, Clock, AlertCircle } from "lucide-react";
import Badge from "../component/ui/Badge";
import { useCredits } from "../hooks/useCredits";
import { useLangue } from "../context/LangueContext";
import { Credit } from "../types/donnees.types";

// Types pour la modale de confirmation
interface ModaleConfirmationProps {
    type: "approbation" | "rejet";
    credit: Credit;
    onConfirmer: () => void;
    onAnnuler: () => void;
    t: any;
}

const ModaleConfirmation = ({ type, credit, onConfirmer, onAnnuler, t }: ModaleConfirmationProps) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* En-tête */}
            <div className={`px-6 py-5 ${type === "approbation" ? "bg-primary-600" : "bg-red-500"}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                        {type === "approbation" ? (
                            <Check size={20} className="text-white" aria-hidden="true" />
                        ) : (
                            <X size={20} className="text-white" aria-hidden="true" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">
                            {type === "approbation"
                                ? t.credits?.confirmationApprouver || "Approuver ce crédit ?"
                                : t.credits?.confirmationRejeter || "Rejeter ce crédit ?"}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Corps */}
            <div className="px-6 py-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {type === "approbation"
                        ? t.credits?.approuverIntro || "Vous êtes sur le point d'approuver ce crédit."
                        : t.credits?.rejeterIntro || "Vous êtes sur le point de rejeter ce crédit."}
                </p>

                {/* Détails */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 mb-5">
                    {[
                        { label: t.credits?.commercant || "Commerçant", valeur: credit.utilisateur },
                        {
                            label: t.credits?.montant || "Montant",
                            valeur: `${new Intl.NumberFormat("fr-FR").format(credit.montant)} FCFA`,
                        },
                        {
                            label: t.credits?.tauxInteret || "Taux",
                            valeur: `${credit.taux}%`,
                        },
                    ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.valeur}</span>
                        </div>
                    ))}
                </div>

                {/* Actions boutons */}
                <div className="flex gap-3">
                    <button
                        onClick={onAnnuler}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        {t.commun?.annuler || "Annuler"}
                    </button>
                    <button
                        onClick={onConfirmer}
                        className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold ${
                            type === "approbation"
                                ? "bg-primary-600 hover:bg-primary-700"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {type === "approbation"
                            ? t.credits?.confirmerApprobation || "Approuver"
                            : t.credits?.confirmerRejet || "Rejeter"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Credits = () => {
    const { t } = useLangue();
    const { data: creditsServeur } = useCredits();
    const [recherche, setRecherche] = useState<string>("");
    const [filtreStatut, setFiltreStatut] = useState<string>("tous");
    const [listeCredits, setListeCredits] = useState<Credit[]>([]);
    const [confirmation, setConfirmation] = useState<{
        type: "approbation" | "rejet";
        credit: Credit;
    } | null>(null);

    useEffect(() => {
        if (creditsServeur) {
            setListeCredits(creditsServeur);
        }
    }, [creditsServeur]);

    // Filtrage
    const creditsFiltres = listeCredits.filter((c) => {
        const correspondRecherche = c.utilisateur.toLowerCase().includes(recherche.toLowerCase());
        const correspondStatut = filtreStatut === "tous" || c.statut === filtreStatut;
        return correspondRecherche && correspondStatut;
    });

    const demanderApprobation = (credit: Credit) => setConfirmation({ type: "approbation", credit });
    const demanderRejet = (credit: Credit) => setConfirmation({ type: "rejet", credit });

    const confirmerAction = () => {
        if (!confirmation) return;
        setListeCredits((prev) =>
            prev.map((c) =>
                c.id === confirmation.credit.id
                    ? { ...c, statut: confirmation.type === "approbation" ? "en_cours" : "inactif" }
                    : c,
            ),
        );
        setConfirmation(null);
    };

    // Indicateurs globaux
    const totalCredits = listeCredits.reduce((acc, c) => acc + c.montant, 0);
    const totalRembourse = listeCredits.reduce((acc, c) => acc + (c.remboursement ?? 0), 0);
    const enAttente = listeCredits.filter((c) => c.statut === "en_attente").length;
    const enRetard = listeCredits.filter((c) => c.statut === "en_retard").length;

    const cartesResume = [
        {
            id: "totalCredits",
            label: t.credits?.totalCredits || "Encours total",
            valeur: `${new Intl.NumberFormat("fr-FR").format(totalCredits)} FCFA`,
            icone: CreditCard,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
        },
        {
            id: "totalRembourse",
            label: t.credits?.totalRembourse || "Remboursé",
            valeur: `${new Intl.NumberFormat("fr-FR").format(totalRembourse)} FCFA`,
            icone: TrendingUp,
            couleur: "#0891b2",
            fond: "rgba(8,145,178,0.1)",
        },
        {
            id: "enAttente",
            label: t.credits?.enAttente || "En attente",
            valeur: `${enAttente}`,
            icone: Clock,
            couleur: "#f59e0b",
            fond: "rgba(245,158,11,0.1)",
        },
        {
            id: "enRetard",
            label: t.credits?.enRetard || "En retard",
            valeur: `${enRetard}`,
            icone: AlertCircle,
            couleur: "#ef4444",
            fond: "rgba(239,68,68,0.1)",
        },
    ];

    const colonnes = [
        { id: "commercant", label: t.credits?.commercant || "Commerçant" },
        { id: "montant", label: t.credits?.montant || "Montant" },
        { id: "rembourse", label: t.credits?.rembourse || "Remboursé" },
        { id: "taux", label: t.credits?.taux || "Taux" },
        { id: "echeance", label: t.credits?.echeance || "Échéance" },
        { id: "statut", label: t.credits?.statut || "Statut" },
        { id: "actions", label: t.credits?.actions || "Actions" },
    ];

    return (
        <div className="space-y-6">
            {confirmation && (
                <ModaleConfirmation
                    type={confirmation.type}
                    credit={confirmation.credit}
                    onConfirmer={confirmerAction}
                    onAnnuler={() => setConfirmation(null)}
                    t={t}
                />
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.credits?.titre || "Crédits"}</h2>
                <p className="sous-titre">{t.credits?.description || "Gestion des crédits"}</p>
            </div>

            {/* Cartes résumé */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {cartesResume.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-3"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: item.fond }}
                        >
                            <item.icone size={18} style={{ color: item.couleur }} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                                {item.label}
                            </p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">{item.valeur}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recherche et filtre */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder={t.credits?.recherche || "Rechercher..."}
                        aria-label={t.credits?.recherche || "Rechercher"}
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Filter size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <select
                        value={filtreStatut}
                        aria-label={t.commun?.filtrer || "Filtrer"}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
                    >
                        <option value="tous">{t.credits?.tousStatuts || "Tous les statuts"}</option>
                        <option value="en_cours">{t.credits?.actif || "Actif"}</option>
                        <option value="en_attente">{t.credits?.enAttente_statut || "En attente"}</option>
                        <option value="en_retard">{t.credits?.enRetard_statut || "En retard"}</option>
                        <option value="rembourse">{t.credits?.rembourse_statut || "Remboursé"}</option>
                    </select>
                </div>
            </div>

            {/* Tableau */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" role="table" aria-label={t.credits?.titre || "Crédits"}>
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {colonnes.map((col) => (
                                    <th key={col.id} className="entete-tableau">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {creditsFiltres.length > 0 ? (
                                creditsFiltres.map((c) => (
                                    <tr key={c.id} className="ligne-tableau">
                                        <td className="cellule-tableau">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs shrink-0">
                                                    {c.utilisateur.charAt(0)}
                                                </div>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {c.utilisateur}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="cellule-tableau font-semibold text-gray-800 dark:text-white">
                                            {new Intl.NumberFormat("fr-FR").format(c.montant)} FCFA
                                        </td>
                                        <td className="cellule-tableau">
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {new Intl.NumberFormat("fr-FR").format(c.remboursement ?? 0)} FCFA
                                                </p>
                                                <div
                                                    className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-1.5"
                                                    role="progressbar"
                                                    aria-valuenow={Math.round(
                                                        ((c.remboursement ?? 0) / c.montant) * 100,
                                                    )}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                >
                                                    <div
                                                        className="h-2 bg-primary-500 rounded-full"
                                                        style={{
                                                            width: `${Math.min(((c.remboursement ?? 0) / c.montant) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cellule-tableau">{c.taux}%</td>
                                        <td className="cellule-tableau">{c.dateEcheance ?? "N/A"}</td>
                                        <td className="cellule-tableau">
                                            <Badge statut={c.statut} />
                                        </td>
                                        <td className="cellule-tableau">
                                            {c.statut === "en_attente" ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => demanderApprobation(c)}
                                                        aria-label={`${t.credits?.approuver || "Approuver"} ${c.utilisateur}`}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors text-xs font-medium"
                                                    >
                                                        <Check size={14} aria-hidden="true" />
                                                        <span>{t.credits?.approuver || "Approuver"}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => demanderRejet(c)}
                                                        aria-label={`${t.credits?.rejeter || "Rejeter"} ${c.utilisateur}`}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-xs font-medium"
                                                    >
                                                        <X size={14} aria-hidden="true" />
                                                        <span>{t.credits?.rejeter || "Rejeter"}</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                        <CreditCard size={32} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
                                        <p>{t.credits?.aucunCredit || "Aucun crédit trouvé."}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pied-tableau">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {creditsFiltres.length} {t.commun?.trouve || "trouvé(s)"} {t.commun?.sur || "sur"}{" "}
                        {listeCredits.length} {t.commun?.total || "total"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Credits;
