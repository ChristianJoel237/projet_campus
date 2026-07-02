import { createContext, useContext, useState, ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
    estConnecte: boolean;
    chargement: boolean;
    erreurConnexion: string;
    nomAdmin: string;
    emailAdmin: string;
    seConnecter: (email: string, motDePasse: string) => Promise<boolean>;
    seDeconnecter: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Utilisation de sessionStorage pour la persistance limitée à l'onglet
    const [estConnecte, setEstConnecte] = useState<boolean>(() => !!sessionStorage.getItem("token"));
    const [chargement, setChargement] = useState<boolean>(false);
    const [erreurConnexion, setErreurConnexion] = useState<string>("");
    const [nomAdmin, setNomAdmin] = useState<string>(() => sessionStorage.getItem("nomAdmin") || "Administrateur");
    const [emailAdmin, setEmailAdmin] = useState<string>(() => sessionStorage.getItem("emailAdmin") || "");

    const seConnecter = async (email: string, motDePasse: string): Promise<boolean> => {
        setChargement(true);
        setErreurConnexion("");

        try {
            const reponse = await authService.seConnecter(email, motDePasse);

            // Extraction sécurisée selon le contrat de authService
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
        } catch (erreur) {
            const message = erreur instanceof Error ? erreur.message : "❌ Email ou mot de passe incorrect.";
            setErreurConnexion(message);
            setChargement(false);
            return false;
        }
    };

    const seDeconnecter = (): void => {
        // Optionnel : Appel API pour invalider la session côté serveur
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
