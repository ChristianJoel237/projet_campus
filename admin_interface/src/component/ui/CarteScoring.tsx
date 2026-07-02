import { useState } from "react";
import {
    Brain,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { scoringService, ResultatScoring, DonneesScoring } from "../../services/creditService";
import { useLangue } from "../../context/LangueContext";
import { Credit } from "../../types/donnees.types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CarteScoringProps {
    credit: Credit;
    onScoringTermine?: (resultat: ResultatScoring) => void;
}

// ── Config visuelle par niveau de risque ──────────────────────────────────────
const configNiveau = {
    faible: {
        bg: "bg-emerald-50 dark:bg-emerald-950",
        border: "border-emerald-200 dark:border-emerald-800",
        badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
        barre: "bg-emerald-500",
        icone: CheckCircle,
        couleurIcone: "text-emerald-500",
        label: (t: any) => t.scoring?.faible ?? "Risque Faible",
    },
    moyen: {
        bg: "bg-amber-50 dark:bg-amber-950",
        border: "border-amber-200 dark:border-amber-800",
        badge: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
        barre: "bg-amber-400",
        icone: AlertCircle,
        couleurIcone: "text-amber-500",
        label: (t: any) => t.scoring?.moyen ?? "Risque Moyen",
    },
    eleve: {
        bg: "bg-red-50 dark:bg-red-950",
        border: "border-red-200 dark:border-red-800",
        badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
        barre: "bg-red-500",
        icone: XCircle,
        couleurIcone: "text-red-500",
        label: (t: any) => t.scoring?.eleve ?? "Risque Élevé",
    },
};

const configRecommandation = {
    approuver: {
        texte: (t: any) => t.scoring?.recommanderApprouver ?? "Recommandation : Approuver",
        classe: "text-emerald-600 dark:text-emerald-400",
    },
    examiner: {
        texte: (t: any) => t.scoring?.recommanderExaminer ?? "Recommandation : À examiner",
        classe: "text-amber-600 dark:text-amber-400",
    },
    rejeter: {
        texte: (t: any) => t.scoring?.recommanderRejeter ?? "Recommandation : Rejeter",
        classe: "text-red-600 dark:text-red-400",
    },
};

// ── Composant principal ───────────────────────────────────────────────────────
const CarteScoring = ({ credit, onScoringTermine }: CarteScoringProps) => {
    const { t } = useLangue();
    const [resultat, setResultat] = useState<ResultatScoring | null>(null);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [detailsOuverts, setDetailsOuverts] = useState(false);
    const lancerScoring = async () => {
        setChargement(true);
        setErreur(null);

        try {
            const donnees: DonneesScoring = {
                utilisateurId: credit.utilisateurId ?? String(credit.id),
                montant: credit.montant,
                duree: credit.duree ?? 12,
                taux: credit.taux,
            };

            const reponse = await scoringService.analyser(donnees);
            setResultat(reponse.scoring);
            onScoringTermine?.(reponse.scoring);
        } catch (e) {
            setErreur(t.scoring?.erreur ?? "Erreur lors de l'analyse. Réessayez.");
        } finally {
            setChargement(false);
        }
    };

    // ── État initial : bouton d'analyse ───────────────────────────────────────
    if (!resultat && !chargement) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={lancerScoring}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400
            hover:bg-violet-100 dark:hover:bg-violet-900
            border border-violet-200 dark:border-violet-800
            transition-colors text-xs font-medium"
                    aria-label={`${t.scoring?.analyser ?? "Analyser le risque"} — ${credit.utilisateur}`}
                >
                    <Brain size={13} aria-hidden="true" />
                    <span>{t.scoring?.analyser ?? "Analyser IA"}</span>
                </button>
                {erreur && <span className="text-xs text-red-500">{erreur}</span>}
            </div>
        );
    }

    // ── État chargement ───────────────────────────────────────────────────────
    if (chargement) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-violet-500">
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                <span>{t.scoring?.analyse ?? "Analyse en cours…"}</span>
            </div>
        );
    }

    // ── État résultat ─────────────────────────────────────────────────────────
    if (!resultat) return null;

    const config = configNiveau[resultat.niveau];
    const Icone = config.icone;
    const configReco = configRecommandation[resultat.recommandation];

    return (
        <div
            className={`rounded-xl border p-3 space-y-2 min-w-[220px] ${config.bg} ${config.border}`}
            role="region"
            aria-label={t.scoring?.resultats ?? "Résultats du scoring IA"}
        >
            {/* En-tête score */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Icone size={16} className={config.couleurIcone} aria-hidden="true" />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                        {config.label(t)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Brain size={11} className="text-violet-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{resultat.score}/100</span>
                </div>
            </div>

            {/* Barre de score */}
            <div
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={resultat.score}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-full rounded-full transition-all duration-700 ${config.barre}`}
                    style={{ width: `${resultat.score}%` }}
                />
            </div>

            {/* Recommandation */}
            <p className={`text-xs font-semibold ${configReco.classe}`}>{configReco.texte(t)}</p>

            {/* Toggle détails */}
            <button
                onClick={() => setDetailsOuverts((v) => !v)}
                className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500
          hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-expanded={detailsOuverts}
            >
                {detailsOuverts ? (
                    <>
                        <ChevronUp size={11} aria-hidden="true" />
                        {t.scoring?.masquer ?? "Masquer détails"}
                    </>
                ) : (
                    <>
                        <ChevronDown size={11} aria-hidden="true" />
                        {t.scoring?.voirDetails ?? "Voir détails"}
                    </>
                )}
            </button>

            {/* Détails — facteurs de risque */}
            {detailsOuverts && (
                <div className="space-y-1.5 pt-1 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {t.scoring?.facteurs ?? "Facteurs clés"}
                    </p>
                    {resultat.facteurs.map((facteur, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            {facteur.impact === "positif" ? (
                                <TrendingUp size={11} className="text-emerald-500 shrink-0" aria-hidden="true" />
                            ) : (
                                <TrendingDown size={11} className="text-red-400 shrink-0" aria-hidden="true" />
                            )}
                            <span className="text-xs text-gray-600 dark:text-gray-300">{facteur.nom}</span>
                        </div>
                    ))}
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
                        {t.scoring?.probabilite ?? "Prob. défaut"} :{" "}
                        <span className="font-semibold">{(resultat.probabiliteDefaut * 100).toFixed(1)}%</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default CarteScoring;
