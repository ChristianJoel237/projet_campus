// ============================================
// EMAIL SERVICE
// Prêt pour intégration backend → POST /notifications/email
// ============================================

// Types pour les données d'événements
export interface DonneesNouveauCredit {
  nom: string;
  montant: number;
}

export interface DonneesNouvelUtilisateur {
  nom: string;
  telephone?: string;
  ville?: string;
}

export interface DonneesCreditEnRetard {
  nom: string;
  montant: number;
  dateEcheance?: string;
}

export interface DonneesTransactionEchouee {
  nom: string;
  montant: number;
  canal?: string;
}

export interface DonneesNotification {
  titre: string;
  message: string;
}

export type DonneesEmail =
  | DonneesNouveauCredit
  | DonneesNouvelUtilisateur
  | DonneesCreditEnRetard
  | DonneesTransactionEchouee
  | DonneesNotification
  | Record<string, unknown>;

// Types pour les templates
export interface TemplateEmail {
  sujet: string;
  message: string;
  priorite: "basse" | "normale" | "haute" | "urgente";
  emoji: string;
}

// Types pour le payload d'envoi
export interface PayloadEmail {
  destinataire: string;
  sujet: string;
  message: string;
  priorite: string;
  evenement: string;
  horodatage: string;
  donnees: DonneesEmail;
}

// Types pour les événements
export type EvenementEmail =
  | "nouvelle_demande_credit"
  | "nouvel_utilisateur"
  | "credit_en_retard"
  | "transaction_echouee"
  | "notification_generale";

// Constantes
export const EMAIL_ADMIN: string = "admin@microfinance.cm";

// Types d'événements déclencheurs
export const EVENEMENTS_EMAIL: Record<string, EvenementEmail> = {
  NOUVEAU_CREDIT:      "nouvelle_demande_credit",
  NOUVEAU_UTILISATEUR: "nouvel_utilisateur",
  CREDIT_EN_RETARD:    "credit_en_retard",
  TRANSACTION_ECHOUEE: "transaction_echouee",
  NOTIFICATION:        "notification_generale",
};

// Fonction pour formater les montants
const formaterMontant = (montant: number): string => {
  return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
};

// Templates email par événement
const TEMPLATES: Record<EvenementEmail, (data: DonneesEmail) => TemplateEmail> = {
  ["nouvelle_demande_credit"]: (data: DonneesEmail): TemplateEmail => {
    const d = data as DonneesNouveauCredit;
    return {
      sujet: `💳 Nouvelle demande de crédit — ${d.nom}`,
      message: `
Bonjour Administrateur,

Une nouvelle demande de crédit vient d'être soumise :

• Commerçant : ${d.nom}
• Montant demandé : ${formaterMontant(d.montant)}
• Date : ${new Date().toLocaleDateString("fr-FR")}

Veuillez vous connecter au dashboard pour traiter cette demande.

MicroFinance Cameroun
      `,
      priorite: "haute",
      emoji: "💳",
    };
  },

  ["nouvel_utilisateur"]: (data: DonneesEmail): TemplateEmail => {
    const d = data as DonneesNouvelUtilisateur;
    return {
      sujet: `👤 Nouvel utilisateur inscrit — ${d.nom}`,
      message: `
Bonjour Administrateur,

Un nouvel utilisateur vient de s'inscrire :

• Nom : ${d.nom}
• Téléphone : ${d.telephone || "N/A"}
• Ville : ${d.ville || "N/A"}
• Date d'inscription : ${new Date().toLocaleDateString("fr-FR")}

MicroFinance Cameroun
      `,
      priorite: "normale",
      emoji: "👤",
    };
  },

  ["credit_en_retard"]: (data: DonneesEmail): TemplateEmail => {
    const d = data as DonneesCreditEnRetard;
    return {
      sujet: `⚠️ Crédit en retard — ${d.nom}`,
      message: `
Bonjour Administrateur,

Un crédit est en retard de paiement :

• Commerçant : ${d.nom}
• Montant restant : ${formaterMontant(d.montant)}
• Échéance dépassée : ${d.dateEcheance || "N/A"}

Une action immédiate est recommandée.

MicroFinance Cameroun
      `,
      priorite: "urgente",
      emoji: "⚠️",
    };
  },

  ["transaction_echouee"]: (data: DonneesEmail): TemplateEmail => {
    const d = data as DonneesTransactionEchouee;
    return {
      sujet: `❌ Transaction échouée — ${d.nom}`,
      message: `
Bonjour Administrateur,

Une transaction a échoué :

• Commerçant : ${d.nom}
• Montant : ${formaterMontant(d.montant)}
• Canal : ${d.canal || "N/A"}
• Date : ${new Date().toLocaleDateString("fr-FR")}

MicroFinance Cameroun
      `,
      priorite: "haute",
      emoji: "❌",
    };
  },

  ["notification_generale"]: (data: DonneesEmail): TemplateEmail => {
    const d = data as DonneesNotification;
    return {
      sujet: `🔔 Nouvelle notification — ${d.titre}`,
      message: `
Bonjour Administrateur,

Vous avez une nouvelle notification :

• Titre : ${d.titre}
• Message : ${d.message}
• Date : ${new Date().toLocaleDateString("fr-FR")}

MicroFinance Cameroun
      `,
      priorite: "normale",
      emoji: "🔔",
    };
  },
};

/**
 * Envoi d'email à l'administrateur
 * @param evenement - Type d'événement déclencheur
 * @param data - Données spécifiques à l'événement
 * @returns Payload de l'email (pour simulation)
 */
export const envoyerEmailAdmin = async (
  evenement: EvenementEmail,
  data: DonneesEmail = {}
): Promise<PayloadEmail | null> => {
  const template = TEMPLATES[evenement]?.(data);
  if (!template) return null;

  const payload: PayloadEmail = {
    destinataire: EMAIL_ADMIN,
    sujet: template.sujet,
    message: template.message,
    priorite: template.priorite,
    evenement,
    horodatage: new Date().toISOString(),
    donnees: data,
  };

  // ── MODE SIMULATION (frontend seul) ──
  // Remplacer par l'appel API quand le backend sera prêt
  // Simulation silencieuse — emails seront envoyés via backend
  // ── INTÉGRATION BACKEND (décommenter quand prêt) ──
  /*
  try {
    const { api } = await import("./apiConfig");
    await api.post("/notifications/email", payload, false);
    console.info("✅ Email envoyé avec succès");
  } catch (err) {
    console.error("❌ Erreur envoi email :", err);
  }
  */

  return payload;
};

export default envoyerEmailAdmin;