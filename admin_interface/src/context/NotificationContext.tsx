<<<<<<< HEAD
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
=======
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { notificationService, Notification } from "../services/notificationService";
import { useLangue } from "./LangueContext";

interface NotificationAffichee extends Notification {
    heureRelative: string;
}

interface NotificationContextType {
    notifications: NotificationAffichee[];
    nombreNonLus: number;
    marquerCommeLu: (id: string) => Promise<void>;
    marquerToutCommeLu: () => Promise<void>;
    supprimerNotification: (id: string) => Promise<void>;
    recharger: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { t, langue } = useLangue();
    const [liste, setListe] = useState<Notification[]>([]);

    const recharger = async () => {
        try {
            const reponse = await notificationService.listerTous();
            if (reponse && reponse.notifications) {
                setListe(reponse.notifications);
            }
        } catch (error) {
            console.error("Erreur chargement notifications:", error);
        }
    };

    // CORRECTION : Gestion propre du cycle de vie du WebSocket pour éviter le spam console
    useEffect(() => {
        let actif = true;
        let deconnexionWS: (() => void) | null = null;

        const initialiserFlux = async () => {
            // 1. Chargement de l'historique initial
            await recharger();

            // 2. Branchement du flux temps réel si le composant est toujours monté
            if (actif) {
                try {
                    deconnexionWS = notificationService.connecterWebSocket((nouvelleNotif) => {
                        if (actif) {
                            setListe((prev) => [nouvelleNotif, ...prev]);
                        }
                    });
                } catch (error) {
                    console.error("Échec de l'initialisation de la connexion WebSocket:", error);
                }
            }
        };

        initialiserFlux();

        // Nettoyage lors du démontage pour tuer la connexion ou les écouteurs en arrière-plan
        return () => {
            actif = false;
            if (deconnexionWS) {
                deconnexionWS();
            }
        };
    }, []);

    // Actions utilisateurs avec mise à jour optimiste
    const marquerCommeLu = async (id: string) => {
        setListe((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
        try {
            await notificationService.marquerCommeLu(id);
        } catch (error) {
            console.error(error);
        }
    };

    const marquerToutCommeLu = async () => {
        setListe((prev) => prev.map((n) => ({ ...n, lu: true })));
        try {
            await notificationService.marquerToutCommeLu();
        } catch (error) {
            console.error(error);
        }
    };

    const supprimerNotification = async (id: string) => {
        setListe((prev) => prev.filter((n) => n.id !== id));
        try {
            await notificationService.supprimer(id);
        } catch (error) {
            console.error(error);
        }
    };

    // Formatage du temps relatif
    const getRelativeTime = (dateIso: string): string => {
        const date = new Date(dateIso);
        const diffMinutes = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
        const n = t.notifications;

        if (diffMinutes < 1) return n?.maintenant || "maintenant";

        if (diffMinutes < 60) {
            const u = diffMinutes === 1 ? n?.minute || "minute" : n?.minutes || "minutes";
            return langue === "en" || langue === "pidgin"
                ? `${diffMinutes} ${u} ${n?.ilYa || "ago"}`
                : `${n?.ilYa || "il y a"} ${diffMinutes} ${u}`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            const u = diffHours === 1 ? n?.heure || "heure" : n?.heures || "heures";
            return langue === "en" || langue === "pidgin"
                ? `${diffHours} ${u} ${n?.ilYa || "ago"}`
                : `${n?.ilYa || "il y a"} ${diffHours} ${u}`;
        }

        const diffJours = Math.floor(diffHours / 24);
        if (diffJours < 7) {
            const u = diffJours === 1 ? n?.jour || "jour" : n?.jours || "jours";
            return langue === "en" || langue === "pidgin"
                ? `${diffJours} ${u} ${n?.ilYa || "ago"}`
                : `${n?.ilYa || "il y a"} ${diffJours} ${u}`;
        }

        return date.toLocaleDateString(langue === "en" ? "en-US" : "fr-FR");
    };

    // Traduction dynamique à la volée du titre et du message
    const notifications = useMemo<NotificationAffichee[]>(() => {
        const n = t.notifications;

        return liste.map((notif: Notification) => {
            const heureRelative = getRelativeTime(notif.date);
            let titreTraduit = notif.titre;
            let messageTraduit = notif.message;

            switch (notif.icone) {
                case "credit":
                    titreTraduit = n?.nouveauCredit || "Nouveau crédit en attente";
                    messageTraduit =
                        langue === "en"
                            ? "Kenfack Paul is requesting 250,000 FCFA"
                            : langue === "pidgin"
                              ? "Kenfack Paul dey ask for 250,000 FCFA"
                              : "Kenfack Paul demande 250 000 FCFA";
                    break;

                case "retard":
                    titreTraduit = n?.creditRetard || "Crédit en retard";
                    messageTraduit =
                        langue === "en"
                            ? "Kamdem Marie — 120,000 FCFA unpaid"
                            : langue === "pidgin"
                              ? "Kamdem Marie — 120,000 FCFA never pay"
                              : "Kamdem Marie — 120 000 FCFA non remboursé";
                    break;

                case "user":
                    titreTraduit = n?.nouvelUtilisateur || "Nouvel utilisateur inscrit";
                    messageTraduit = `Fozo Jean ${n?.vientDeSInscrire || "vient de s'inscrire depuis"} ${notif.message.split(" ").pop()}`;
                    break;

                case "transaction":
                    titreTraduit = n?.transactionEchouee || "Transaction échouée";
                    break;
            }

            return {
                ...notif,
                titre: titreTraduit,
                message: messageTraduit,
                heureRelative,
            };
        });
    }, [liste, t, langue]);

    const nombreNonLus = liste.filter((n) => !n.lu).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                nombreNonLus,
                marquerCommeLu,
                marquerToutCommeLu,
                supprimerNotification,
                recharger,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications doit être utilisé dans un NotificationProvider");
    return context;
};
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
