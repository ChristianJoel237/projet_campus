// =====================
// VALIDATION & SANITISATION
// Utilisé avant chaque appel API
// =====================

// ============================================
// TYPES
// ============================================

export interface ValidationResult {
  valide: boolean;
  erreurs: Record<string, string>;
}

export interface ChampValidation {
  valeur: unknown;
  reglesChamp: ((valeur: unknown) => true | string)[];
}

export interface ChampsValidation {
  [key: string]: ChampValidation;
}

// Types pour les formulaires
export interface ConnexionForm {
  email: string;
  motDePasse: string;
}

export interface InscriptionForm {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmation: string;
}

export interface CreditForm {
  utilisateur: string;
  montant: number;
  taux: number;
  dateEcheance?: string;
}

export interface UtilisateurForm {
  nom: string;
  telephone: string;
  ville: string;
}

export interface EpargneForm {
  utilisateur: string;
  montant: number;
  typeEpargne?: string;
}

export interface TransactionForm {
  utilisateur: string;
  montant: number;
  canal: string;
  type?: string;
}

// Type pour les données sanitizées
export type DonneesSanitisees = Record<string, unknown>;

// ============================================
// SANITISATION
// ============================================

export const sanitiser = {
  texte: (val: unknown): string => String(val ?? '').trim(),
  email: (val: unknown): string =>
    String(val ?? '')
      .trim()
      .toLowerCase(),
  telephone: (val: unknown): string =>
    String(val ?? '')
      .trim()
      .replace(/\s+/g, ''),
  montant: (val: unknown): number => {
    const n = Number(String(val).replace(/\s/g, '').replace(',', '.'));
    return isNaN(n) ? 0 : Math.abs(Math.round(n));
  },
  texteSecurise: (val: unknown): string =>
    String(val ?? '')
      .trim()
      .replace(/<[^>]*>/g, '')
      .replace(/[<>"'`]/g, '')
      .slice(0, 500),
  entier: (val: unknown): number => {
    const n = parseInt(String(val));
    return isNaN(n) ? 0 : n;
  },
};

// ============================================
// RÈGLES DE VALIDATION
// ============================================

export const regles = {
  requis: (val: unknown): true | string =>
    !!val?.toString().trim() || 'Ce champ est obligatoire.',
  email: (val: unknown): true | string =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)) || 'Email invalide.',
  telephoneCameroun: (val: unknown): true | string =>
    /^(\+237|237)?[67]\d{8}$/.test(String(val).replace(/\s/g, '')) ||
    'Numéro camerounais invalide (ex: +237 6XX XXX XXX).',
  montantMin:
    (min: number) =>
    (val: unknown): true | string =>
      sanitiser.montant(val) >= min || `Montant minimum : ${min} FCFA.`,
  montantMax:
    (max: number) =>
    (val: unknown): true | string =>
      sanitiser.montant(val) <= max || `Montant maximum : ${max} FCFA.`,
  longueurMin:
    (min: number) =>
    (val: unknown): true | string =>
      String(val).trim().length >= min || `Minimum ${min} caractères.`,
  longueurMax:
    (max: number) =>
    (val: unknown): true | string =>
      String(val).trim().length <= max || `Maximum ${max} caractères.`,
  motDePasse: (val: unknown): true | string =>
    /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(String(val)) ||
    'Minimum 6 caractères.',
  confirmation:
    (ref: string) =>
    (val: unknown): true | string =>
      val === ref || 'Les mots de passe ne correspondent pas.',
};

// ============================================
// VALIDATION GÉNÉRIQUE
// ============================================

export const valider = (champs: ChampsValidation): ValidationResult => {
  const erreurs: Record<string, string> = {};

  for (const [cle, { valeur, reglesChamp }] of Object.entries(champs)) {
    for (const regle of reglesChamp) {
      const resultat = regle(valeur);
      if (resultat !== true) {
        erreurs[cle] = resultat;
        break;
      }
    }
  }

  return {
    valide: Object.keys(erreurs).length === 0,
    erreurs,
  };
};

// ============================================
// SCHÉMAS PRÉDÉFINIS
// ============================================

export const schemas = {
  connexion: (form: ConnexionForm): ValidationResult =>
    valider({
      email: {
        valeur: form.email,
        reglesChamp: [regles.requis, regles.email],
      },
      motDePasse: {
        valeur: form.motDePasse,
        reglesChamp: [regles.requis, regles.longueurMin(6)],
      },
    }),

  inscription: (form: InscriptionForm): ValidationResult =>
    valider({
      nom: {
        valeur: form.nom,
        reglesChamp: [regles.requis, regles.longueurMin(2)],
      },
      prenom: {
        valeur: form.prenom,
        reglesChamp: [regles.requis, regles.longueurMin(2)],
      },
      email: {
        valeur: form.email,
        reglesChamp: [regles.requis, regles.email],
      },
      motDePasse: {
        valeur: form.motDePasse,
        reglesChamp: [regles.requis, regles.motDePasse],
      },
      confirmation: {
        valeur: form.confirmation,
        reglesChamp: [regles.requis, regles.confirmation(form.motDePasse)],
      },
    }),

  credit: (form: CreditForm): ValidationResult =>
    valider({
      utilisateur: {
        valeur: form.utilisateur,
        reglesChamp: [regles.requis, regles.longueurMin(2)],
      },
      montant: {
        valeur: form.montant,
        reglesChamp: [
          regles.requis,
          regles.montantMin(20000),
          regles.montantMax(200000),
        ],
      },
      taux: {
        valeur: form.taux,
        reglesChamp: [
          regles.requis,
          regles.montantMin(1),
          regles.montantMax(100),
        ],
      },
    }),

  utilisateur: (form: UtilisateurForm): ValidationResult =>
    valider({
      nom: {
        valeur: form.nom,
        reglesChamp: [regles.requis, regles.longueurMin(2)],
      },
      telephone: {
        valeur: form.telephone,
        reglesChamp: [regles.requis, regles.telephoneCameroun],
      },
      ville: {
        valeur: form.ville,
        reglesChamp: [regles.requis, regles.longueurMin(2)],
      },
    }),

  epargne: (form: EpargneForm): ValidationResult =>
    valider({
      utilisateur: {
        valeur: form.utilisateur,
        reglesChamp: [regles.requis],
      },
      montant: {
        valeur: form.montant,
        reglesChamp: [regles.requis, regles.montantMin(1000)],
      },
    }),

  transaction: (form: TransactionForm): ValidationResult =>
    valider({
      utilisateur: {
        valeur: form.utilisateur,
        reglesChamp: [regles.requis],
      },
      montant: {
        valeur: form.montant,
        reglesChamp: [regles.requis, regles.montantMin(500)],
      },
      canal: {
        valeur: form.canal,
        reglesChamp: [regles.requis],
      },
    }),
};

// ============================================
// SANITISER AVANT ENVOI API
// ============================================

type TypeSanitisation =
  | 'connexion'
  | 'inscription'
  | 'credit'
  | 'utilisateur'
  | 'epargne'
  | 'transaction';

// Version simplifiée - retourne un objet typé comme Record<string, unknown>
export const sanitiserAvantEnvoi = (
  type: TypeSanitisation,
  data: Record<string, unknown>
): Record<string, unknown> => {
  switch (type) {
    case 'connexion':
      return {
        email: sanitiser.email(data.email),
        motDePasse: sanitiser.texte(data.motDePasse),
      };

    case 'inscription':
      return {
        nom: sanitiser.texteSecurise(data.nom),
        prenom: sanitiser.texteSecurise(data.prenom),
        email: sanitiser.email(data.email),
        motDePasse: sanitiser.texte(data.motDePasse),
      };

    case 'credit':
      return {
        utilisateur: sanitiser.texteSecurise(data.utilisateur),
        montant: sanitiser.montant(data.montant),
        taux: sanitiser.entier(data.taux),
        dateEcheance: sanitiser.texte(data.dateEcheance),
      };

    case 'utilisateur':
      return {
        nom: sanitiser.texteSecurise(data.nom),
        telephone: sanitiser.telephone(data.telephone),
        ville: sanitiser.texteSecurise(data.ville),
      };

    case 'epargne':
      return {
        utilisateur: sanitiser.texteSecurise(data.utilisateur),
        montant: sanitiser.montant(data.montant),
        typeEpargne: sanitiser.texte(data.typeEpargne),
      };

    case 'transaction':
      return {
        utilisateur: sanitiser.texteSecurise(data.utilisateur),
        montant: sanitiser.montant(data.montant),
        canal: sanitiser.texte(data.canal),
        type: sanitiser.texte(data.type),
      };

    default:
      return data;
  }
};

export default {
  sanitiser,
  regles,
  valider,
  schemas,
  sanitiserAvantEnvoi,
};
