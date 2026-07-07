import { useState, useEffect, useCallback } from "react";
import { parametres as parametresMock } from "../donnees/donneesFictives";
import { parametresService } from "../services/parametresServices";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const useParametres = () => {
    const [parametres, setParametres] = useState(parametresMock);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);

        try {
            if (USE_MOCK) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                setParametres(parametresMock);
            } else {
                const data = await parametresService.recuperer();
                setParametres({
                    soldeMinimumRetrait: data.soldeMinimumRetrait,
                    tauxEpargneAnnuel: data.tauxEpargneAnnuel,
                    tauxInteretCreditAnnuel: data.tauxInteretCreditAnnuel,
                    dateModification: data.dateModification,
                });
            }
        } catch {
            setErreur("Erreur lors du chargement des paramètres.");
        } finally {
            setChargement(false);
        }
    }, []);

    const mettreAJour = async (nouveauxParametres: typeof parametresMock): Promise<boolean> => {
        setErreur(null);

        try {
            if (USE_MOCK) {
                await new Promise((resolve) => setTimeout(resolve, 800));
                setParametres(nouveauxParametres);
            } else {
                const data = await parametresService.mettreAJour({
                    soldeMinimumRetrait: nouveauxParametres.soldeMinimumRetrait,
                    tauxEpargneAnnuel: nouveauxParametres.tauxEpargneAnnuel,
                    tauxInteretCreditAnnuel: nouveauxParametres.tauxInteretCreditAnnuel,
                });
                setParametres({
                    soldeMinimumRetrait: data.soldeMinimumRetrait,
                    tauxEpargneAnnuel: data.tauxEpargneAnnuel,
                    tauxInteretCreditAnnuel: data.tauxInteretCreditAnnuel,
                    dateModification: data.dateModification,
                });
            }
            return true;
        } catch {
            setErreur("Erreur lors de la mise à jour des paramètres.");
            return false;
        }
    };

    useEffect(() => {
        charger();
    }, [charger]);

    return { parametres, chargement, erreur, mettreAJour, recharger: charger };
};
