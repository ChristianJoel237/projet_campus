import { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { credits, transactions, utilisateurs } from '../donnees/donneesFictives';
import { envoyerEmailAdmin, EVENEMENTS_EMAIL } from '../services/emailService';
import { useLangue } from './LangueContext';

// Types
interface NotificationDonnees {
  utilisateur?: string;
  montant?: number;
  ville?: string;
  nom?: string;
  canal?: string;
  dateEcheance?: string;
  telephone?: string;
}

interface NotificationBrute {
  id: string;
  type: string;
  donnees: NotificationDonnees;
  date: Date;
  lu: boolean;
  icone: string;
}

interface NotificationTraduite extends NotificationBrute {
  titre: string;
  message: string;
  heure: string;
  couleur: string;
}

interface NotificationContextType {
  notifications: NotificationTraduite[];
  nombreNonLus: number;
  marquerCommeLu: (id: string) => void;
  marquerToutCommeLu: () => void;
  supprimerNotification: (id: string) => void;
  ajouterNotification: (notif: Omit<NotificationBrute, 'id' | 'date' | 'lu'>, evenementEmail?: string, dataEmail?: Record<string, unknown>) => Promise<void>;
  EVENEMENTS_EMAIL: typeof EVENEMENTS_EMAIL;
}

interface NotificationProviderProps {
  children: ReactNode;
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { t, langue } = useLangue();
  const [notificationsBrutes, setNotificationsBrutes] = useState<NotificationBrute[]>([]);
  const emailsEnvoyes = useRef<Set<string>>(new Set());

  // Fonction pour générer le texte relatif au temps
  const getRelativeTime = (date: Date, t: any): string => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return t.notifications?.maintenant || "maintenant";
    }
    
    if (diffMinutes < 60) {
      const unite = diffMinutes === 1 
        ? (t.notifications?.minute || "minute") 
        : (t.notifications?.minutes || "minutes");
      
      if (t.notifications?.ilYa === "ago") {
        return `${diffMinutes} ${unite} ago`;
      }
      return `il y a ${diffMinutes} ${unite}`;
    }
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      const unite = diffHours === 1 
        ? (t.notifications?.heure || "heure") 
        : (t.notifications?.heures || "heures");
      
      if (t.notifications?.ilYa === "ago") {
        return `${diffHours} ${unite} ago`;
      }
      return `il y a ${diffHours} ${unite}`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    const unite = diffDays === 1 
      ? (t.notifications?.jour || "jour") 
      : (t.notifications?.jours || "jours");
    
    if (t.notifications?.ilYa === "ago") {
      return `${diffDays} ${unite} ago`;
    }
    return `il y a ${diffDays} ${unite}`;
  };

  // Fonction pour générer les notifications avec les dates
  const genererNotificationsBrutes = (): NotificationBrute[] => {
    const notifs: NotificationBrute[] = [];
    const now = new Date();

    // Crédits en attente
    const creditsEnAttente = credits.filter((c) => c.statut === "en_attente");
    creditsEnAttente.forEach((c, index) => {
      const date = new Date(now);
      date.setMinutes(date.getMinutes() - (5 + index * 2));
      notifs.push({
        id: `credit-attente-${c.id}`,
        type: "credit_attente",
        donnees: { utilisateur: c.utilisateur, montant: c.montant },
        date: date,
        lu: false,
        icone: "credit",
      });
    });

    // Crédits en retard
    const creditsEnRetard = credits.filter((c) => c.statut === "en_retard");
    creditsEnRetard.forEach((c, index) => {
      const date = new Date(now);
      date.setHours(date.getHours() - (1 + index));
      notifs.push({
        id: `credit-retard-${c.id}`,
        type: "credit_retard",
        donnees: { utilisateur: c.utilisateur, montant: c.montant },
        date: date,
        lu: false,
        icone: "retard",
      });
    });

    // Nouveaux utilisateurs
    utilisateurs.slice(0, 2).forEach((u, index) => {
      const date = new Date(now);
      date.setHours(date.getHours() - (2 + index));
      notifs.push({
        id: `user-${u.id}`,
        type: "nouvel_utilisateur",
        donnees: { nom: u.nom, ville: u.ville },
        date: date,
        lu: false,
        icone: "user",
      });
    });

    // Transactions échouées
    transactions.filter((tx) => tx.statut === "echoue").forEach((tx, index) => {
      const date = new Date(now);
      date.setHours(date.getHours() - (3 + index));
      notifs.push({
        id: `tx-echouee-${tx.id}`,
        type: "transaction_echouee",
        donnees: { utilisateur: tx.utilisateur, montant: tx.montant, canal: tx.canal },
        date: date,
        lu: false,
        icone: "transaction",
      });
    });

    return notifs;
  };

  // Initialiser les notifications brutes
  useEffect(() => {
    setNotificationsBrutes(genererNotificationsBrutes());
  }, []);

  // Générer les notifications traduites à chaque changement de langue
  const notifications = useMemo<NotificationTraduite[]>(() => {
    return notificationsBrutes.map(notif => {
      const temps = getRelativeTime(notif.date, t);
      const montantFormate = new Intl.NumberFormat(
        langue === "en" ? "en-US" : "fr-FR"
      ).format(notif.donnees.montant || 0);

      switch (notif.type) {
        case "credit_attente":
          return {
            ...notif,
            titre: t.notifications?.nouveauCredit || "Nouveau crédit en attente",
            message: `${notif.donnees.utilisateur} demande ${montantFormate} FCFA`,
            heure: temps,
            couleur: "#F59E0B",
          };
        case "credit_retard":
          return {
            ...notif,
            titre: t.notifications?.creditRetard || "Crédit en retard",
            message: `${notif.donnees.utilisateur} — ${montantFormate} FCFA non remboursé`,
            heure: temps,
            couleur: "#ef4444",
          };
        case "nouvel_utilisateur":
          return {
            ...notif,
            titre: t.notifications?.nouvelUtilisateur || "Nouvel utilisateur inscrit",
            message: `${notif.donnees.nom} ${t.notifications?.vientDeSInscrire || "vient de s'inscrire depuis"} ${notif.donnees.ville}`,
            heure: temps,
            couleur: "#0891b2",
          };
        case "transaction_echouee":
          return {
            ...notif,
            titre: t.notifications?.transactionEchouee || "Transaction échouée",
            message: `${notif.donnees.utilisateur} — ${montantFormate} FCFA via ${notif.donnees.canal}`,
            heure: temps,
            couleur: "#ef4444",
          };
        default:
          return {
            ...notif,
            titre: "",
            message: "",
            heure: temps,
            couleur: "#6b7280",
          };
      }
    });
  }, [notificationsBrutes, t, langue]);

  const envoyerEmailsInitiaux = async (notifs: NotificationBrute[]) => {
    for (const notif of notifs) {
      if (emailsEnvoyes.current.has(notif.id)) continue;
      emailsEnvoyes.current.add(notif.id);

      if (notif.type === "credit_attente") {
        const c = credits.find((x) => `credit-attente-${x.id}` === notif.id);
        if (c) await envoyerEmailAdmin(EVENEMENTS_EMAIL.NOUVEAU_CREDIT, { nom: c.utilisateur, montant: c.montant });
      } else if (notif.type === "credit_retard") {
        const c = credits.find((x) => `credit-retard-${x.id}` === notif.id);
        if (c) await envoyerEmailAdmin(EVENEMENTS_EMAIL.CREDIT_EN_RETARD, { nom: c.utilisateur, montant: c.montant, dateEcheance: c.dateEcheance });
      } else if (notif.type === "nouvel_utilisateur") {
        const u = utilisateurs.find((x) => `user-${x.id}` === notif.id);
        if (u) await envoyerEmailAdmin(EVENEMENTS_EMAIL.NOUVEAU_UTILISATEUR, { nom: u.nom, telephone: u.telephone, ville: u.ville });
      } else if (notif.type === "transaction_echouee") {
        const tx = transactions.find((x) => `tx-echouee-${x.id}` === notif.id);
        if (tx) await envoyerEmailAdmin(EVENEMENTS_EMAIL.TRANSACTION_ECHOUEE, { nom: tx.utilisateur, montant: tx.montant, canal: tx.canal });
      }
    }
  };

  useEffect(() => {
    if (notificationsBrutes.length > 0) {
      envoyerEmailsInitiaux(notificationsBrutes);
    }
  }, [notificationsBrutes]);

  // Ajouter une notification manuellement
  const ajouterNotification = async (
    notif: Omit<NotificationBrute, 'id' | 'date' | 'lu'>,
    evenementEmail?: string,
    dataEmail: Record<string, unknown> = {}
  ): Promise<void> => {
    const nouvelleNotif: NotificationBrute = {
      id: `notif-${Date.now()}`,
      type: notif.type,
      donnees: notif.donnees,
      date: new Date(),
      lu: false,
      icone: notif.icone,
    };
    
    setNotificationsBrutes((prev) => [nouvelleNotif, ...prev]);

    if (evenementEmail) {
      await envoyerEmailAdmin(evenementEmail, dataEmail);
    }
  };

  const marquerCommeLu = (id: string): void => {
    setNotificationsBrutes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
    );
  };

  const marquerToutCommeLu = (): void => {
    setNotificationsBrutes((prev) => prev.map((n) => ({ ...n, lu: true })));
  };

  const supprimerNotification = (id: string): void => {
    setNotificationsBrutes((prev) => prev.filter((n) => n.id !== id));
  };

  const nombreNonLus = notifications.filter((n) => !n.lu).length;

  const value: NotificationContextType = {
    notifications,
    nombreNonLus,
    marquerCommeLu,
    marquerToutCommeLu,
    supprimerNotification,
    ajouterNotification,
    EVENEMENTS_EMAIL,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personnalisé
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};