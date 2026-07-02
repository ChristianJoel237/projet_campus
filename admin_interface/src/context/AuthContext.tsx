<<<<<<< HEAD
import { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  estConnecte: boolean;
  chargement: boolean;
  erreurConnexion: string;
  seConnecter: (email: string, motDePasse: string) => Promise<boolean>;
  seDeconnecter: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
=======
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
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
<<<<<<< HEAD
  const [estConnecte, setEstConnecte] = useState<boolean>(
    () => localStorage.getItem('estConnecte') === 'true'
  );
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreurConnexion, setErreurConnexion] = useState<string>('');

  // ── Connexion ──
  const seConnecter = async (
    email: string,
    motDePasse: string
  ): Promise<boolean> => {
    setChargement(true);
    setErreurConnexion('');

    try {
      const reponse = await authService.seConnecter(email, motDePasse);

      localStorage.setItem('token', reponse.token);
      localStorage.setItem('estConnecte', 'true');

      setEstConnecte(true);
      setChargement(false);
      return true;
    } catch (erreur) {
      const message =
        erreur instanceof Error
          ? erreur.message
          : '❌ Email ou mot de passe incorrect.';
      setErreurConnexion(message);
      setChargement(false);
      return false;
    }
  };

  // ── Déconnexion ──
  const seDeconnecter = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('estConnecte');
    setEstConnecte(false);
    setErreurConnexion('');
  };

  return (
    <AuthContext.Provider
      value={{
        estConnecte,
        chargement,
        erreurConnexion,
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
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
=======
    // CORRECTION : Utilisation de sessionStorage pour couper la session à la fermeture de l'onglet
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

            // Extraction du jeton et des infos (ajuste selon la structure réelle de ta réponse d'API)
            const token = (reponse as any).token || "vrai_token_temporaire_session";
            const nomExtrait = (reponse as any).nom || email.split("@")[0];

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
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
};
