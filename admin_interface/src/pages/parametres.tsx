import { useState, useEffect, useRef } from "react";
import { DollarSign, PiggyBank, Percent, Pencil, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { useParametres } from "../hooks/useParametres";
import { useLangue } from "../context/LangueContext";
import { ParametresMicrofinance } from "../types/donnees.types";

type ChampModifiable = keyof Omit<ParametresMicrofinance, "dateModification">;

interface ModaleConfirmationTauxProps {
    champ: ChampModifiable;
    ancienneValeur: number;
    nouvelleValeur: number;
    unite: string;
    label: string;
    onConfirmer: () => void;
    onAnnuler: () => void;
    chargement: boolean;
    t: any;
}

const ModaleConfirmationTaux = ({
    ancienneValeur,
    nouvelleValeur,
    unite,
    label,
    onConfirmer,
    onAnnuler,
    chargement,
    t,
}: ModaleConfirmationTauxProps) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
    >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 bg-amber-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-bold text-lg">
                        {t.parametresMicrofinance?.confirmerChangement || "Confirmer ce changement ?"}
                    </h3>
                </div>
            </div>

            <div className="px-6 py-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t.parametresMicrofinance?.impactGlobal ||
                        "Ce paramètre s'applique immédiatement à tous les nouveaux crédits et épargnes. Vérifiez la valeur avant de confirmer."}
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 mb-5">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t.parametresMicrofinance?.valeurActuelle || "Valeur actuelle"}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {ancienneValeur.toLocaleString()} {unite}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t.parametresMicrofinance?.nouvelleValeur || "Nouvelle valeur"}
                        </span>
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                            {nouvelleValeur.toLocaleString()} {unite}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onAnnuler}
                        disabled={chargement}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                    >
                        {t.commun?.annuler || "Annuler"}
                    </button>
                    <button
                        onClick={onConfirmer}
                        disabled={chargement}
                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-50"
                    >
                        {chargement ? (
                            <Loader2 size={18} className="animate-spin mx-auto" />
                        ) : (
                            t.parametresMicrofinance?.confirmer || "Confirmer"
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Parametres = () => {
    const { t } = useLangue();
    const { parametres, chargement: chargementInitial, erreur: erreurChargement, mettreAJour } = useParametres();

    const [edition, setEdition] = useState<ChampModifiable | null>(null);
    const [valeursTemp, setValeursTemp] = useState<ParametresMicrofinance>(parametres);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [messageSucces, setMessageSucces] = useState(false);
    const [confirmation, setConfirmation] = useState<{ champ: ChampModifiable } | null>(null);

    const timeoutMessageRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (edition === null) {
            setValeursTemp(parametres);
        }
    }, [parametres, edition]);

    useEffect(() => {
        return () => {
            if (timeoutMessageRef.current) {
                clearTimeout(timeoutMessageRef.current);
            }
        };
    }, []);

    const ouvrirEdition = (champ: ChampModifiable) => {
        setValeursTemp({ ...parametres });
        setEdition(champ);
        setErreur(null);
    };

    const annulerEdition = () => {
        setEdition(null);
        setErreur(null);
    };

    const handleChange = (champ: ChampModifiable, valeur: string) => {
        if (valeur === "") {
            setValeursTemp((prev) => ({ ...prev, [champ]: 0 }));
            setErreur(null);
            return;
        }

        const valeurNumerique = parseFloat(valeur);
        if (isNaN(valeurNumerique) || valeurNumerique < 0) return;

        setValeursTemp((prev) => ({ ...prev, [champ]: valeurNumerique }));
        setErreur(null);
    };

    const demanderSauvegarde = (champ: ChampModifiable) => {
        if (valeursTemp.tauxEpargneAnnuel > valeursTemp.tauxInteretCreditAnnuel) {
            setErreur(
                t.parametresMicrofinance?.erreurTaux ||
                    "Le taux d'épargne ne peut pas être supérieur au taux d'intérêt des crédits.",
            );
            return;
        }
        setConfirmation({ champ });
    };

    const confirmerSauvegarde = async () => {
        setChargement(true);
        setErreur(null);

        const succes = await mettreAJour({
            ...valeursTemp,
            dateModification: new Date().toISOString(),
        });

        if (succes) {
            setEdition(null);
            setConfirmation(null);
            setMessageSucces(true);

            if (timeoutMessageRef.current) clearTimeout(timeoutMessageRef.current);
            timeoutMessageRef.current = setTimeout(() => setMessageSucces(false), 3000);
        } else {
            setErreur(
                t.parametresMicrofinance?.erreurSauvegarde || "Erreur lors de la sauvegarde. Veuillez réessayer.",
            );
            setConfirmation(null);
        }

        setChargement(false);
    };

    const blocs = [
        {
            id: "soldeMinimumRetrait" as const,
            label: t.parametresMicrofinance?.soldeMinimum || "Solde minimum après retrait",
            description:
                t.parametresMicrofinance?.soldeMinimumDescription ||
                "Montant que chaque client doit conserver sur son compte après un retrait.",
            unite: t.parametresMicrofinance?.FCFA || "FCFA",
            icone: DollarSign,
            couleur: "#3b82f6",
            fond: "rgba(59,130,246,0.1)",
            step: 100,
        },
        {
            id: "tauxEpargneAnnuel" as const,
            label: t.parametresMicrofinance?.tauxEpargne || "Taux d'épargne annuel",
            description:
                t.parametresMicrofinance?.tauxEpargneDescription ||
                "Intérêts versés aux clients sur leur épargne. Ne peut pas dépasser le taux d'intérêt des crédits.",
            unite: t.parametresMicrofinance?.pourcentageParAn || "% par an",
            icone: PiggyBank,
            couleur: "#16a34a",
            fond: "rgba(22,163,74,0.1)",
            step: 0.1,
        },
        {
            id: "tauxInteretCreditAnnuel" as const,
            label: t.parametresMicrofinance?.tauxInteret || "Taux d'intérêt des crédits",
            description:
                t.parametresMicrofinance?.tauxInteretDescription ||
                "Taux appliqué à tous les nouveaux crédits accordés. Doit rester supérieur ou égal au taux d'épargne.",
            unite: t.parametresMicrofinance?.pourcentageParAn || "% par an",
            icone: Percent,
            couleur: "#f59e0b",
            fond: "rgba(245,158,11,0.1)",
            step: 0.1,
        },
    ];

    if (chargementInitial) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (erreurChargement) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                {erreurChargement}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {confirmation && (
                <ModaleConfirmationTaux
                    champ={confirmation.champ}
                    ancienneValeur={parametres[confirmation.champ]}
                    nouvelleValeur={valeursTemp[confirmation.champ]}
                    unite={blocs.find((b) => b.id === confirmation.champ)?.unite ?? ""}
                    label={blocs.find((b) => b.id === confirmation.champ)?.label ?? ""}
                    onConfirmer={confirmerSauvegarde}
                    onAnnuler={() => setConfirmation(null)}
                    chargement={chargement}
                    t={t}
                />
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {t.parametresMicrofinance?.titre || "Paramètres"}
                </h2>
                <p className="sous-titre">
                    {t.parametresMicrofinance?.description || "Configuration des règles de la microfinance"}
                </p>
            </div>

            {messageSucces && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm font-medium">
                    <Check size={16} />
                    {t.parametresMicrofinance?.succes || "Paramètres mis à jour avec succès."}
                </div>
            )}

            {erreur && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
                    <X size={16} />
                    {erreur}
                </div>
            )}

            {blocs.map((bloc) => {
                const estEnEdition = edition === bloc.id;
                const valeurActuelle = estEnEdition ? valeursTemp[bloc.id] : parametres[bloc.id];

                const champLie =
                    bloc.id === "tauxEpargneAnnuel"
                        ? "tauxInteretCreditAnnuel"
                        : bloc.id === "tauxInteretCreditAnnuel"
                          ? "tauxEpargneAnnuel"
                          : null;

                return (
                    <div
                        key={bloc.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: bloc.fond }}
                            >
                                <bloc.icone size={18} style={{ color: bloc.couleur }} aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{bloc.label}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{bloc.description}</p>
                            </div>
                            {!estEnEdition && (
                                <button
                                    onClick={() => ouvrirEdition(bloc.id)}
                                    disabled={chargement}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0 disabled:opacity-50"
                                    aria-label={`${t.parametresMicrofinance?.modifier || "Modifier"} ${bloc.label}`}
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                        </div>

                        {estEnEdition ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={valeurActuelle}
                                        onChange={(e) => handleChange(bloc.id, e.target.value)}
                                        step={bloc.step}
                                        min={0}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-800 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                        disabled={chargement}
                                    />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {bloc.unite}
                                    </span>
                                    <button
                                        onClick={() => demanderSauvegarde(bloc.id)}
                                        disabled={chargement}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors shrink-0 disabled:opacity-50"
                                        aria-label={t.parametresMicrofinance?.valider || "Valider"}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={annulerEdition}
                                        disabled={chargement}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0 disabled:opacity-50"
                                        aria-label={t.parametresMicrofinance?.annuler || "Annuler"}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {champLie && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {t.parametresMicrofinance?.pourReference || "Pour référence"} —{" "}
                                        {blocs.find((b) => b.id === champLie)?.label} :{" "}
                                        <span className="font-semibold">
                                            {parametres[champLie].toLocaleString()}{" "}
                                            {blocs.find((b) => b.id === champLie)?.unite}
                                        </span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-800 dark:text-white">
                                    {parametres[bloc.id].toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{bloc.unite}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Parametres;
