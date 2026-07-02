import { useState, useEffect, useCallback, useRef } from "react";
import { USE_MOCK } from "./useMock";

export interface UseServerDataResult<T> {
    data: T;
    chargement: boolean;
    erreur: string | null;
    derniereMaj: Date;
    rafraichir: () => Promise<void>;
}

export const useServerData = <T>(
    loader: () => Promise<T>,
    mockData: () => T,
    refreshIntervalMs = 30000,
): UseServerDataResult<T> => {
    const [data, setData] = useState<T>(() => {
        return USE_MOCK ? mockData() : ([] as unknown as T);
    });
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [derniereMaj, setDerniereMaj] = useState<Date>(new Date());
    const loaderRef = useRef(loader);
    const mockDataRef = useRef(mockData);

    useEffect(() => {
        loaderRef.current = loader;
    }, [loader]);

    useEffect(() => {
        mockDataRef.current = mockData;
    }, [mockData]);

    const charger = useCallback(async () => {
        if (USE_MOCK) {
            console.log(
                "%c[MOCK MODE] Données fictives chargées localement",
                "color: #341fee; font-weight: bold; background: #fdf2e9; padding: 2px 5px; border-radius: 3px;",
            );
            setData(mockDataRef.current());
            setDerniereMaj(new Date());
            return;
        }

        setChargement(true);
        setErreur(null);
        try {
            console.log(
                "%c[SERVER MODE] Requête réseau envoyée au serveur...",
                "color: #2ecc71; font-weight: bold; background: #e8f8f5; padding: 2px 5px; border-radius: 3px;",
            );
            const resultat = await loaderRef.current();
            setData(resultat);
            setDerniereMaj(new Date());
        } catch (err) {
            console.error(
                "%c[SERVER ERROR] Échec de la récupération des données",
                "color: #e74c3c; font-weight: bold;",
                err,
            );
            setErreur("Impossible de joindre le serveur. Données locales affichées.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        charger();
    }, [charger]);

    useEffect(() => {
        if (USE_MOCK) return;
        const interval = setInterval(charger, refreshIntervalMs);
        return () => clearInterval(interval);
    }, [charger, refreshIntervalMs]);

    return { data, chargement, erreur, derniereMaj, rafraichir: charger };
};
