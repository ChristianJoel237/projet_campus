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
    const [estConnecte, setEstConnecte] = useState<boolean>(() => !!sessionStorage.getItem("token"));
    const [chargement, setChargement] = useState<boolean>(false);
    const [erreurConnexion, setErreurConnexion] = useState<string>("");
    const [nomAdmin, setNomAdmin] = useState<string>(() => sessionStorage.getItem("nomAdmin") || "Administrateur");
    const [emailAdmin, setEmailAdmin] = useState<string>(() => sessionStorage.getItem("emailAdmin") || "");

    const seConnecter = async (email: string, password: string): Promise<boolean> => {
        setChargement(true);
        setErreurConnexion("");

        try {
            // Appel au service avec le champ 'password' unifié
            const reponse = await authService.seConnecter(email, password);

            const token = reponse.token;
            const nomExtrait = email.split("@")[0];

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("nomAdmin", nomExtrait);
            sessionStorage.setItem("emailAdmin", email);

            setNomAdmin(nomExtrait);
            setEmailAdmin(email);
            setEstConnecte(true);
            setChargement(false);
            return true;
        } catch (erreur: any) {
            // Capture le message d'erreur du serveur si disponible, sinon message par défaut
            const message = erreur?.response?.data?.message || "❌ Email ou mot de passe incorrect.";
            setErreurConnexion(message);
            setChargement(false);
            return false;
        }
    };

    const seDeconnecter = (): void => {
        authService.deconnexion();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("nomAdmin");
        sessionStorage.removeItem("emailAdmin");

        setNomAdmin("Administrateur");
        setEmailAdmin("");
        setEstConnecte(false);
        setErreurConnexion("");
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
