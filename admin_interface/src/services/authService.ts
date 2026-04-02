import { api } from "./apiConfig";

// ============================================
// TYPES
// ============================================

export interface Admin {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: string;
  telephone?: string;
}

export interface ReponseConnexion {
  token: string;
  admin: Admin;
}

export interface ReponseMessage {
  message: string;
}

export interface ReponseVerificationEmail {
  existe: boolean;
}

export interface RequeteChangementMotDePasse {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface RequeteVerificationEmail {
  email: string;
}

export interface RequeteMiseAJourProfil {
  nom?: string;
  email?: string;
  telephone?: string;
}

// ============================================
// SERVICE
// ============================================

export const authService = {

  /**
   * Connexion administrateur
   * POST /api/auth/login
   */
  seConnecter: (email: string, motDePasse: string): Promise<ReponseConnexion> =>
    api.post<ReponseConnexion>("/auth/login", { email, motDePasse }, false),

  /**
   * Déconnexion administrateur
   * POST /api/auth/logout
   */
  seDeconnecter: (): Promise<ReponseMessage> =>
    api.post<ReponseMessage>("/auth/logout", null),

  /**
   * Vérifier le token actuel
   * GET /api/auth/me
   */
  verifierToken: (): Promise<{ admin: Admin }> =>
    api.get<{ admin: Admin }>("/auth/me", true),

  /**
   * Changer le mot de passe (connecté)
   * POST /api/auth/change-password
   */
  changerMotDePasse: (ancienMotDePasse: string, nouveauMotDePasse: string): Promise<ReponseMessage> =>
    api.post<ReponseMessage>("/auth/change-password", { ancienMotDePasse, nouveauMotDePasse }, true),

  /**
   * Vérifier si un email existe (mot de passe oublié)
   * POST /api/auth/verifier-email
   */
  verifierEmail: (email: string): Promise<ReponseVerificationEmail> =>
    api.post<ReponseVerificationEmail>("/auth/verifier-email", { email }, false),

  /**
   * Mettre à jour le profil administrateur
   * PUT /api/auth/profil
   */
  mettreAJourProfil: (donnees: RequeteMiseAJourProfil): Promise<{ admin: Admin }> =>
    api.put<{ admin: Admin }>("/auth/profil", donnees, true),
};

export default authService;