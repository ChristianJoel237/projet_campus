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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
};
