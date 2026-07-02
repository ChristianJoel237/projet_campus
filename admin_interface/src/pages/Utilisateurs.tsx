// pages/Utilisateurs.tsx
import { useState, useEffect } from "react";
import { Search, Filter, Eye, Lock, Unlock, Users, X, Phone, MapPin, PiggyBank, Calendar } from "lucide-react";
import Badge from "../component/ui/Badge";
import { useUtilisateurs } from "../hooks/useUtilisateurs";
import { useLangue } from "../context/LangueContext";
import { useTheme } from "../context/ThemeContext";
import { Utilisateur, StatutUtilisateur } from "../types/donnees.types";
import { utilisateurService } from "../services/utilisateurService";

// ─── Modale profil utilisateur ───
interface ModaleUtilisateurProps {
    utilisateur: Utilisateur | null;
    onFermer: () => void;
    t: any;
}

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
            aria-label={`${t.utilisateurs?.profil || "Profil"} ${utilisateur.nom}`}
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
                    >
                        <X size={16} aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                        >
                            {(utilisateur.nom || "?").charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{utilisateur.nom}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge statut={utilisateur.statut} />
                                <span className="text-xs text-white/60">
                                    {t.utilisateurs?.membreDepuis || "Membre depuis"} {utilisateur.dateInscription}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#16a34a" }}>
                            📋 {t.utilisateurs?.informationsPersonnelles || "Informations Personnelles"}
                        </p>
                        <div className="space-y-3">
                            {[
                                {
                                    icone: Phone,
                                    label: t.utilisateurs?.telephone || "Téléphone",
                                    valeur: utilisateur.telephone,
                                    couleur: "#0891b2",
                                },
                                {
                                    icone: MapPin,
                                    label: t.utilisateurs?.ville || "Ville",
                                    valeur: utilisateur.ville,
                                    couleur: "#8b5cf6",
                                },
                                {
                                    icone: Calendar,
                                    label: t.utilisateurs?.inscription || "Inscription",
                                    valeur: utilisateur.dateInscription,
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

                    <div
                        className="h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.2), transparent)" }}
                    />

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#16a34a" }}>
                            💰 {t.utilisateurs?.donneesFinancieres || "Données Financières"}
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    background: "rgba(245,158,11,0.08)",
                                    border: "1px solid rgba(245,158,11,0.25)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <PiggyBank size={14} style={{ color: "#F59E0B" }} aria-hidden="true" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t.utilisateurs?.epargnetotale || "Épargne Totale"}
                                    </p>
                                </div>
                                <p className="text-base font-bold" style={{ color: "#F59E0B" }}>
                                    {new Intl.NumberFormat("fr-FR").format(utilisateur.epargne || 0)} FCFA
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onFermer}
                        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #16a34a, #0891b2)",
                            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                        }}
                    >
                        {t.utilisateurs?.fermerProfil || "Fermer le profil"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Page principale ───
const Utilisateurs = () => {
    const { t } = useLangue();
    const { data: utilisateursServeur } = useUtilisateurs();
    const [recherche, setRecherche] = useState<string>("");
    const [filtreStatut, setFiltreStatut] = useState<string>("tous");
    const [listeUtilisateurs, setListeUtilisateurs] = useState<Utilisateur[]>([]);
    const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<Utilisateur | null>(null);

    useEffect(() => {
        if (utilisateursServeur) {
            const utilisateursSecurises: Utilisateur[] = utilisateursServeur.map((u) => ({
                id: u.id,
                nom: u.nom ?? "Nom inconnu",
                telephone: u.telephone ?? "",
                ville: u.ville ?? "",
                statut: u.statut ?? "nouveau",
                epargne: u.epargne ?? 0,
                dateInscription: u.dateInscription ?? "",
                credits: u.credits ?? 0, // Résout l'erreur de propriété manquante
            }));
            setListeUtilisateurs(utilisateursSecurises);
        }
    }, [utilisateursServeur]);

    const utilisateursFiltres = listeUtilisateurs.filter((u) => {
        const correspondRecherche =
            u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            u.telephone.includes(recherche) ||
            u.ville.toLowerCase().includes(recherche.toLowerCase());
        const correspondStatut = filtreStatut === "tous" || u.statut.toLowerCase() === filtreStatut.toLowerCase();
        return correspondRecherche && correspondStatut;
    });

    const changerStatut = async (id: string | number) => {
        const utilisateur = listeUtilisateurs.find((u) => u.id === id);
        if (!utilisateur) return;

        const prochainStatut: StatutUtilisateur = utilisateur.statut === "actif" ? "suspendu" : "actif";

        setListeUtilisateurs((prev) => prev.map((u) => (u.id === id ? { ...u, statut: prochainStatut } : u)));

        try {
            // Résout l'erreur d'assignation string | number
            await utilisateurService.changerStatut(id.toString(), prochainStatut);
        } catch (error) {
            console.error("Erreur lors de la modification du statut:", error);
            setListeUtilisateurs((prev) => prev.map((u) => (u.id === id ? { ...u, statut: utilisateur.statut } : u)));
        }
    };

    const totalNouveaux = listeUtilisateurs.filter((u) => u.statut === "nouveau").length;
    const totalActifs = listeUtilisateurs.filter((u) => u.statut === "actif").length;
    const totalInactifs = listeUtilisateurs.filter((u) => u.statut === "inactif").length;
    const totalSuspendus = listeUtilisateurs.filter((u) => u.statut === "suspendu").length;
    const totalBloques = listeUtilisateurs.filter((u) => u.statut === "bloque").length;

    const cartesResume = [
        {
            id: "total",
            label: "Total",
            valeur: listeUtilisateurs.length,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
        },
        {
            id: "nouveau",
            label: t.utilisateurs?.nouveau || "Nouveau",
            valeur: totalNouveaux,
            couleur: "#0891b2",
            fond: "rgba(8,145,178,0.1)",
        },
        {
            id: "actifs",
            label: t.utilisateurs?.actif || "Actif",
            valeur: totalActifs,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
        },
        {
            id: "inactifs",
            label: t.utilisateurs?.inactif || "Inactif",
            valeur: totalInactifs,
            couleur: "#6b7280",
            fond: "rgba(107,114,128,0.1)",
        },
        {
            id: "suspendus",
            label: t.utilisateurs?.suspendu || "Suspendu",
            valeur: totalSuspendus,
            couleur: "#f59e0b",
            fond: "rgba(245,158,11,0.1)",
        },
        {
            id: "bloques",
            label: t.utilisateurs?.bloque || "Bloqué",
            valeur: totalBloques,
            couleur: "#ef4444",
            fond: "rgba(239,68,68,0.1)",
        },
    ];

    const colonnes = [
        { id: "nom", label: t.utilisateurs?.nom || "Nom" },
        { id: "telephone", label: t.utilisateurs?.telephone || "Téléphone" },
        { id: "ville", label: t.utilisateurs?.ville || "Ville" },
        { id: "epargne", label: t.utilisateurs?.epargne || "Épargne" },
        { id: "statut", label: t.utilisateurs?.statut || "Statut" },
        { id: "actions", label: t.utilisateurs?.actions || "Actions" },
    ];

    return (
        <div className="space-y-6">
            {utilisateurSelectionne && (
                <ModaleUtilisateur
                    utilisateur={utilisateurSelectionne}
                    onFermer={() => setUtilisateurSelectionne(null)}
                    t={t}
                />
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {t.utilisateurs?.titre || "Utilisateurs"}
                </h2>
                <p className="sous-titre">{t.utilisateurs?.description || "Gestion des utilisateurs"}</p>
            </div>

            {/* Cartes Résumé */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {cartesResume.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: item.fond }}
                        >
                            <Users size={18} style={{ color: item.couleur }} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                                {item.label}
                            </p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{item.valeur}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recherche et Filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder={t.utilisateurs?.recherche || "Rechercher..."}
                        aria-label={t.utilisateurs?.recherche || "Rechercher"}
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
                        <option value="tous">{t.utilisateurs?.tousStatuts || "Tous les statuts"}</option>
                        <option value="nouveau">{t.utilisateurs?.nouveau || "Nouveau"}</option>
                        <option value="actif">{t.utilisateurs?.actif || "Actif"}</option>
                        <option value="inactif">{t.utilisateurs?.inactif || "Inactif"}</option>
                        <option value="suspendu">{t.utilisateurs?.suspendu || "Suspendu"}</option>
                        <option value="bloque">{t.utilisateurs?.bloque || "Bloqué"}</option>
                    </select>
                </div>
            </div>

            {/* Tableau */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" role="table" aria-label={t.utilisateurs?.titre || "Utilisateurs"}>
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
                            {utilisateursFiltres.length > 0 ? (
                                utilisateursFiltres.map((u) => (
                                    <tr key={u.id} className="ligne-tableau">
                                        <td className="cellule-tableau">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                                                    style={{ background: "linear-gradient(135deg, #16a34a, #0891b2)" }}
                                                >
                                                    {u.nom.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white">
                                                        {u.nom}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{u.dateInscription}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cellule-tableau">{u.telephone}</td>
                                        <td className="cellule-tableau">{u.ville}</td>
                                        <td className="cellule-tableau font-semibold" style={{ color: "#16a34a" }}>
                                            {new Intl.NumberFormat("fr-FR").format(u.epargne)} FCFA
                                        </td>
                                        <td className="cellule-tableau">
                                            <Badge statut={u.statut} />
                                        </td>
                                        <td className="cellule-tableau">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setUtilisateurSelectionne(u)}
                                                    aria-label={`${t.utilisateurs?.voir || "Voir"} ${u.nom}`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                                                >
                                                    <Eye size={14} aria-hidden="true" />
                                                    <span>{t.utilisateurs?.voir || "Voir"}</span>
                                                </button>

                                                <button
                                                    onClick={() => changerStatut(u.id)}
                                                    aria-label={
                                                        u.statut === "actif"
                                                            ? `${t.utilisateurs?.suspendre || "Suspendre"} ${u.nom}`
                                                            : `${t.utilisateurs?.activer || "Activer"} ${u.nom}`
                                                    }
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        u.statut === "actif"
                                                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                            : "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                                                    }`}
                                                >
                                                    {u.statut === "actif" ? (
                                                        <>
                                                            <Lock size={14} aria-hidden="true" />
                                                            <span>{t.utilisateurs?.suspendre || "Suspendre"}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Unlock size={14} aria-hidden="true" />
                                                            <span>{t.utilisateurs?.activer || "Activer"}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
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
                        {utilisateursFiltres.length} {t.commun?.trouve || "trouvé(s)"} {t.commun?.sur || "sur"}{" "}
                        {listeUtilisateurs.length} {t.commun?.total || "total"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Utilisateurs;
