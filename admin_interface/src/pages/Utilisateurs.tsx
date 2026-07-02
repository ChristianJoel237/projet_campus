import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    Ban,
    Trash2,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    UserMinus,
    ShieldOff,
    X,
    Phone,
    MapPin,
    PiggyBank,
    Calendar,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import Badge from "../component/ui/Badge";
import { useUtilisateurs } from "../hooks/useUtilisateurs";
import { useLangue } from "../context/LangueContext";
import { useTheme } from "../context/ThemeContext";
import { Utilisateur, StatutUtilisateur } from "../types/donnees.types";
import { utilisateurService } from "../services/utilisateurService";

// Types d'actions
type ActionUtilisateur = "activer" | "desactiver" | "bloquer" | "supprimer";

// Modale de confirmation générique
interface ModaleConfirmationProps {
    action: ActionUtilisateur;
    utilisateur: Utilisateur;
    onConfirmer: () => void;
    onAnnuler: () => void;
    t: any;
}

const iconesAction: Record<ActionUtilisateur, React.ElementType> = {
    activer: UserCheck,
    desactiver: UserX,
    bloquer: ShieldOff,
    supprimer: Trash2,
};

const couleursAction: Record<ActionUtilisateur, { bg: string; text: string; button: string }> = {
    activer: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        button: "linear-gradient(135deg, #16a34a, #0891b2)",
    },
    desactiver: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
        button: "#f59e0b",
    },
    bloquer: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        button: "#ef4444",
    },
    supprimer: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        button: "#ef4444",
    },
};

const ModaleConfirmation = ({ action, utilisateur, onConfirmer, onAnnuler, t }: ModaleConfirmationProps) => {
    const { theme } = useTheme();
    const ut = t.utilisateurs ?? {};

    const Icone = iconesAction[action];
    const couleurs = couleursAction[action];

    const messages: Record<ActionUtilisateur, string> = {
        activer: ut.confirmerActiver || "Activer l'utilisateur ?",
        desactiver: ut.confirmerDesactiver || "Désactiver l'utilisateur ?",
        bloquer: ut.confirmerBloquer || "Bloquer l'utilisateur ?",
        supprimer: ut.confirmerSupprimer || "Supprimer l'utilisateur ?",
    };

    const sousTitres: Record<ActionUtilisateur, string> = {
        activer: ut.confirmationActiver || "L'utilisateur pourra se connecter et utiliser les services.",
        desactiver: ut.confirmationDesactiver || "L'utilisateur ne pourra plus se connecter.",
        bloquer: ut.confirmationBloquer || "L'utilisateur sera bloqué définitivement.",
        supprimer: ut.confirmationSupprimer || "Cette action est irréversible.",
    };

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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${couleurs.bg}`}>
                    <Icone size={22} className={couleurs.text} />
                </div>

                <div className="text-center space-y-1">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{messages[action]}</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{utilisateur.nom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sousTitres[action]}</p>
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
                        style={{ background: couleurs.button }}
                    >
                        {t.commun?.confirmer || "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modale profil utilisateur (inchangée)
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

// Page principale
const Utilisateurs = () => {
    const { t } = useLangue();
    const { data: utilisateursServeur } = useUtilisateurs();
    const [recherche, setRecherche] = useState<string>("");
    const [filtreStatut, setFiltreStatut] = useState<string>("tous");
    const [listeUtilisateurs, setListeUtilisateurs] = useState<Utilisateur[]>([]);
    const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<Utilisateur | null>(null);
    const [confirmation, setConfirmation] = useState<{
        action: ActionUtilisateur;
        utilisateur: Utilisateur;
    } | null>(null);
    const [messageSucces, setMessageSucces] = useState<string | null>(null);

    // Normalisation des statuts en minuscules
    useEffect(() => {
        if (utilisateursServeur) {
            const utilisateursSecurises: Utilisateur[] = utilisateursServeur.map((u) => ({
                id: u.id,
                nom: u.nom ?? "Nom inconnu",
                telephone: u.telephone ?? "",
                ville: u.ville ?? "",
                statut: (u.statut ?? "nouveau").toLowerCase() as StatutUtilisateur,
                epargne: u.epargne ?? 0,
                dateInscription: u.dateInscription ?? "",
                credits: u.credits ?? 0,
            }));
            setListeUtilisateurs(utilisateursSecurises);
        }
    }, [utilisateursServeur]);

    // Filtrage
    const utilisateursFiltres = listeUtilisateurs.filter((u) => {
        const correspondRecherche =
            u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            u.telephone.includes(recherche) ||
            u.ville.toLowerCase().includes(recherche.toLowerCase());
        const correspondStatut = filtreStatut === "tous" || u.statut.toLowerCase() === filtreStatut.toLowerCase();
        return correspondRecherche && correspondStatut;
    });

    // Exécution de l'action confirmée
    const executerAction = async () => {
        if (!confirmation) return;
        const { action, utilisateur } = confirmation;
        try {
            switch (action) {
                case "activer":
                    await utilisateurService.changerStatut(utilisateur.id.toString(), "actif");
                    setListeUtilisateurs((prev) =>
                        prev.map((u) => (u.id === utilisateur.id ? { ...u, statut: "actif" } : u)),
                    );
                    setMessageSucces("✅ Utilisateur activé avec succès.");
                    break;
                case "desactiver":
                    await utilisateurService.changerStatut(utilisateur.id.toString(), "suspendu");
                    setListeUtilisateurs((prev) =>
                        prev.map((u) => (u.id === utilisateur.id ? { ...u, statut: "suspendu" } : u)),
                    );
                    setMessageSucces("✅ Utilisateur désactivé avec succès.");
                    break;
                case "bloquer":
                    await utilisateurService.changerStatut(utilisateur.id.toString(), "bloque");
                    setListeUtilisateurs((prev) =>
                        prev.map((u) => (u.id === utilisateur.id ? { ...u, statut: "bloque" } : u)),
                    );
                    setMessageSucces("✅ Utilisateur bloqué avec succès.");
                    break;
                case "supprimer":
                    await utilisateurService.supprimer(utilisateur.id.toString());
                    setListeUtilisateurs((prev) => prev.filter((u) => u.id !== utilisateur.id));
                    setMessageSucces("✅ Utilisateur supprimé avec succès.");
                    break;
            }
            setTimeout(() => setMessageSucces(null), 3000);
        } catch (error) {
            console.error(`Erreur ${action} :`, error);
            setMessageSucces("❌ Erreur lors de l'action.");
            setTimeout(() => setMessageSucces(null), 3000);
        } finally {
            setConfirmation(null);
        }
    };

    // Totaux dynamiques
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
            icone: Users,
        },
        {
            id: "nouveau",
            label: t.utilisateurs?.nouveau || "Nouveau",
            valeur: totalNouveaux,
            couleur: "#0891b2",
            fond: "rgba(8,145,178,0.1)",
            icone: UserPlus,
        },
        {
            id: "actifs",
            label: t.utilisateurs?.actif || "Actif",
            valeur: totalActifs,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
            icone: UserCheck,
        },
        {
            id: "inactifs",
            label: t.utilisateurs?.inactif || "Inactif",
            valeur: totalInactifs,
            couleur: "#6b7280",
            fond: "rgba(107,114,128,0.1)",
            icone: UserMinus,
        },
        {
            id: "suspendus",
            label: t.utilisateurs?.suspendu || "Suspendu",
            valeur: totalSuspendus,
            couleur: "#f59e0b",
            fond: "rgba(245,158,11,0.1)",
            icone: UserX,
        },
        {
            id: "bloques",
            label: t.utilisateurs?.bloque || "Bloqué",
            valeur: totalBloques,
            couleur: "#ef4444",
            fond: "rgba(239,68,68,0.1)",
            icone: ShieldOff,
        },
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

            {confirmation && (
                <ModaleConfirmation
                    action={confirmation.action}
                    utilisateur={confirmation.utilisateur}
                    onConfirmer={executerAction}
                    onAnnuler={() => setConfirmation(null)}
                    t={t}
                />
            )}

            {messageSucces && (
                <div
                    className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
                    style={{
                        background: messageSucces.includes("❌") ? "rgba(239,68,68,0.08)" : "rgba(22,163,74,0.08)",
                        border: messageSucces.includes("❌")
                            ? "1px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(22,163,74,0.25)",
                        color: messageSucces.includes("❌") ? "#ef4444" : "#16a34a",
                    }}
                >
                    {messageSucces.includes("❌") ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                    <span>{messageSucces}</span>
                    <button
                        onClick={() => setMessageSucces(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {t.utilisateurs?.titre || "Utilisateurs"}
                </h2>
                <p className="sous-titre">{t.utilisateurs?.description || "Gestion des utilisateurs"}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {cartesResume.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: item.fond }}
                        >
                            <item.icone size={18} style={{ color: item.couleur }} />
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

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        type="search"
                        placeholder={t.utilisateurs?.recherche || "Rechercher..."}
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
                    <Filter size={16} className="text-gray-400 shrink-0" />
                    <select
                        value={filtreStatut}
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="entete-tableau">{t.utilisateurs?.nom || "Nom"}</th>
                                <th className="entete-tableau">{t.utilisateurs?.telephone || "Téléphone"}</th>
                                <th className="entete-tableau">{t.utilisateurs?.ville || "Ville"}</th>
                                <th className="entete-tableau">{t.utilisateurs?.epargne || "Épargne"}</th>
                                <th className="entete-tableau">{t.utilisateurs?.statut || "Statut"}</th>
                                <th className="entete-tableau">{t.utilisateurs?.actions || "Actions"}</th>
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
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <button
                                                    onClick={() => setUtilisateurSelectionne(u)}
                                                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                                                >
                                                    <Eye size={14} />
                                                    <span className="hidden sm:inline">
                                                        {t.utilisateurs?.voir || "Voir"}
                                                    </span>
                                                </button>

                                                {u.statut !== "actif" && (
                                                    <button
                                                        onClick={() =>
                                                            setConfirmation({ action: "activer", utilisateur: u })
                                                        }
                                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                                                    >
                                                        <UserCheck size={14} />
                                                        <span className="hidden sm:inline">
                                                            {t.utilisateurs?.activer || "Activer"}
                                                        </span>
                                                    </button>
                                                )}

                                                {u.statut === "actif" && (
                                                    <button
                                                        onClick={() =>
                                                            setConfirmation({ action: "desactiver", utilisateur: u })
                                                        }
                                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                                    >
                                                        <UserX size={14} />
                                                        <span className="hidden sm:inline">
                                                            {t.utilisateurs?.desactiver || "Désactiver"}
                                                        </span>
                                                    </button>
                                                )}

                                                {u.statut !== "bloque" && (
                                                    <button
                                                        onClick={() =>
                                                            setConfirmation({ action: "bloquer", utilisateur: u })
                                                        }
                                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    >
                                                        <Ban size={14} />
                                                        <span className="hidden sm:inline">
                                                            {t.utilisateurs?.bloquer || "Bloquer"}
                                                        </span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setConfirmation({ action: "supprimer", utilisateur: u })
                                                    }
                                                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <Trash2 size={14} />
                                                    <span className="hidden sm:inline">
                                                        {t.utilisateurs?.supprimer || "Supprimer"}
                                                    </span>
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
                                            <Users size={22} style={{ color: "#16a34a" }} />
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
