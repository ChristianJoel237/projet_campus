import { createContext, useContext, useState, ReactNode } from "react";
import { fr } from "../traduction/fr";
import { en } from "../traduction/en";
import { pidgin } from "../traduction/pidgin";

// Types pour les langues disponibles
type LangueDisponible = "fr" | "en" | "pidgin";

// Type pour les traductions (basé sur la structure du français)
type Traductions = typeof fr;

// Type pour le contexte
interface LangueContextType {
    langue: LangueDisponible;
    t: Traductions;
    changerLangue: (nouvelleLangue: LangueDisponible) => void;
}

interface LangueProviderProps {
    children: ReactNode;
}

// Dictionnaire des langues disponibles
const languesDisponibles: Record<LangueDisponible, Traductions> = {
    fr,
    en,
    pidgin,
};

// Création du contexte
const LangueContext = createContext<LangueContextType | undefined>(undefined);

export const LangueProvider = ({ children }: LangueProviderProps) => {
    const [langue, setLangue] = useState<LangueDisponible>(() => {
        const savedLangue = localStorage.getItem("langue") as LangueDisponible | null;
        return savedLangue && languesDisponibles[savedLangue] ? savedLangue : "fr";
    });

    const [traductions, setTraductions] = useState<Traductions>(() => {
        const savedLangue = localStorage.getItem("langue") as LangueDisponible | null;
        return savedLangue && languesDisponibles[savedLangue] ? languesDisponibles[savedLangue] : fr;
    });

    const changerLangue = (nouvelleLangue: LangueDisponible) => {
        if (!languesDisponibles[nouvelleLangue]) return;

        localStorage.setItem("langue", nouvelleLangue);
        setLangue(nouvelleLangue);
        setTraductions(languesDisponibles[nouvelleLangue]);
    };

    const value: LangueContextType = {
        langue,
        t: traductions,
        changerLangue,
    };

    return <LangueContext.Provider value={value}>{children}</LangueContext.Provider>;
};

// Hook personnalisé
export const useLangue = (): LangueContextType => {
    const context = useContext(LangueContext);
    if (context === undefined) {
        throw new Error("useLangue doit être utilisé à l'intérieur d'un LangueProvider");
    }
    return context;
};
