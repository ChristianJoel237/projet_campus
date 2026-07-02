import { createContext, useContext, useState, ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
    estConnecte: boolean;
    chargement: boolean;
    erreurConnexion: string;
    nomAdmin: string;
    emailAdmin: string;
    seConnecter: (email: string, password: string) => Promise<boolean>;
    seDeconnecter: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Utilisation exclusive du localStorage pour une persistance stable
    const [estConnecte, setEstConnecte] = useState<boolean>(() => !!localStorage.getItem("token"));
    const [chargement, setChargement] = useState<boolean>(false);
    const [erreurConnexion, setErreurConnexion] = useState<string>("");
    const [nomAdmin, setNomAdmin] = useState<string>(() => localStorage.getItem("nomAdmin") || "Administrateur");
    const [emailAdmin, setEmailAdmin] = useState<string>(() => localStorage.getItem("emailAdmin") || "");

    const seConnecter = async (email: string, password: string): Promise<boolean> => {
        setChargement(true);
        setErreurConnexion("");

        try {
            const reponse = await authService.seConnecter(email, password);
            const token = reponse.token;
            const nomExtrait = email.split("@")[0];

            // Sauvegarde synchronisée dans localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("nomAdmin", nomExtrait);
            localStorage.setItem("emailAdmin", email);

            setNomAdmin(nomExtrait);
            setEmailAdmin(email);
            setEstConnecte(true);
            return true;
        } catch (erreur: any) {
            const message = erreur?.message || "❌ Identifiants incorrects.";
            setErreurConnexion(message);
            return false;
        } finally {
            setChargement(false);
        }
    };

    const seDeconnecter = (): void => {
        authService.deconnexion();

        // Nettoyage complet
        localStorage.removeItem("token");
        localStorage.removeItem("nomAdmin");
        localStorage.removeItem("emailAdmin");

        setNomAdmin("Administrateur");
        setEmailAdmin("");
        setEstConnecte(false);
    };

    return (
        <AuthContext.Provider
            value={{
                estConnecte,
                chargement,
                erreurConnexion,
                nomAdmin,
                emailAdmin,
                seConnecter,
                seDeconnecter,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
