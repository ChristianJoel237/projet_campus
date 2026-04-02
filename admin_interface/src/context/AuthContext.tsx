import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface AdminCompte {
  id?: string;
  email: string;
  motDePasse: string;
  nom: string;
  role?: string;
}

interface AuthContextType {
  nomAdmin: string;
  emailAdmin: string;
  estConnecte: boolean;
  chargement: boolean;
  erreurConnexion: string;
  avatarActuel: string;     
  estEmoji: boolean;         
  seConnecter: (email: string, motDePasse: string) => Promise<boolean>;
  seDeconnecter: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Compte administrateur par défaut
const ADMIN_CREDENTIALS: AdminCompte = {
  email: 'admin@microfinance.com',
  motDePasse: 'admin123',
  nom: 'Christian Admin',
  role: 'Super Administrateur',
};

// Charger les comptes depuis localStorage
const chargerComptes = (): AdminCompte[] => {
  try {
    const comptes: AdminCompte[] = JSON.parse(localStorage.getItem('admins') || '[]');
    const existeDeja = comptes.find(
      (c) => c.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
    );
    if (!existeDeja) comptes.unshift(ADMIN_CREDENTIALS);
    return comptes;
  } catch {
    return [ADMIN_CREDENTIALS];
  }
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [nomAdmin, setNomAdmin] = useState<string>(() => 
    localStorage.getItem('nomAdmin') || ''
  );
  const [emailAdmin, setEmailAdmin] = useState<string>(() => 
    localStorage.getItem('emailAdmin') || ''
  );
  const [estConnecte, setEstConnecte] = useState<boolean>(() => 
    localStorage.getItem('estConnecte') === 'true'
  );
  const [erreurConnexion, setErreurConnexion] = useState<string>('');
  const [chargement, setChargement] = useState<boolean>(false);
  
  // 👇 Propriétés pour l'avatar
  const [emojiProfil, setEmojiProfil] = useState<string>(() => 
    localStorage.getItem('emojiProfil') || ''
  );
  
  const avatarActuel: string = emojiProfil || nomAdmin?.charAt(0)?.toUpperCase() || 'A';
  const estEmoji: boolean = emojiProfil !== '';

  // ── Connexion ──
  const seConnecter = async (email: string, motDePasse: string): Promise<boolean> => {
    setChargement(true);
    setErreurConnexion('');

    try {
      await new Promise((r) => setTimeout(r, 800));
      const comptes = chargerComptes();
      const compte = comptes.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase()
      );
      
      if (!compte) {
        setErreurConnexion('❌ Adresse email introuvable.');
        setChargement(false);
        return false;
      }
      
      if (compte.motDePasse !== motDePasse.trim()) {
        setErreurConnexion('❌ Mot de passe incorrect.');
        setChargement(false);
        return false;
      }
      
      const data = { email: compte.email, nom: compte.nom };

      localStorage.setItem('estConnecte', 'true');
      localStorage.setItem('nomAdmin', data.nom);
      localStorage.setItem('emailAdmin', data.email);
      setNomAdmin(data.nom);
      setEmailAdmin(data.email);
      setEstConnecte(true);
      setChargement(false);
      return true;

    } catch (erreur) {
      const message = erreur instanceof Error ? erreur.message : '❌ Une erreur est survenue.';
      setErreurConnexion(message);
      setChargement(false);
      return false;
    }
  };

  // ── Déconnexion ──
  const seDeconnecter = (): void => {
    localStorage.removeItem('estConnecte');
    localStorage.removeItem('nomAdmin');
    localStorage.removeItem('emailAdmin');
    localStorage.removeItem('emojiProfil');
    setEstConnecte(false);
    setEmailAdmin('');
    setNomAdmin('');
    setEmojiProfil('');
    setErreurConnexion('');
  };

  const value: AuthContextType = {
    nomAdmin,
    emailAdmin,
    estConnecte,
    chargement,
    erreurConnexion,
    avatarActuel,    
    estEmoji,        
    seConnecter,
    seDeconnecter,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};