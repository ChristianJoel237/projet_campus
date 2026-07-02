// context/NotificationContext.tsx
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { notificationService, Notification } from "../services/notificationService";
import { useLangue } from "./LangueContext";

// Types d'affichage enrichis pour les composants graphiques
interface NotificationAffichee extends Notification {
    heureRelative: string;
    couleur: string;
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

    // Chargement initial ou rafraîchissement forcé depuis l'API
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

    // Gestion du cycle de vie du WebSocket pour éviter le spam ou les fuites de mémoire
    useEffect(() => {
        let actif = true;
        let deconnexionWS: (() => void) | null = null;

        const initialiserFlux = async () => {
            await recharger();

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

        return () => {
            actif = false;
            if (deconnexionWS) {
                deconnexionWS();
            }
        };
    }, []);

    // Actions utilisateurs asynchrones avec application optimiste immédiate
    const marquerCommeLu = async (id: string) => {
        setListe((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
        try {
            await notificationService.marquerCommeLu(id);
        } catch (error) {
            console.error("Erreur lors du marquage de la notification comme lue:", error);
        }
    };

    const marquerToutCommeLu = async () => {
        setListe((prev) => prev.map((n) => ({ ...n, lu: true })));
        try {
            await notificationService.marquerToutCommeLu();
        } catch (error) {
            console.error("Erreur lors du marquage global comme lu:", error);
        }
    };

    const supprimerNotification = async (id: string) => {
        setListe((prev) => prev.filter((n) => n.id !== id));
        try {
            await notificationService.supprimer(id);
        } catch (error) {
            console.error("Erreur lors de la suppression de la notification:", error);
        }
    };

    // Calcul dynamique et robuste du temps relatif localisé
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

    // Traduction, injection de styles et formatage à la volée
    const notifications = useMemo<NotificationAffichee[]>(() => {
        const n = t.notifications;

        return liste.map((notif: Notification) => {
            const heureRelative = getRelativeTime(notif.date);
            let titreTraduit = notif.titre;
            let messageTraduit = notif.message;
            let couleur = "#6b7280";

            switch (notif.icone) {
                case "credit":
                    titreTraduit = n?.nouveauCredit || "Nouveau crédit en attente";
                    couleur = "#F59E0B";
                    // Préserve l'usage dynamique si le serveur renvoie un message brut interprétable
                    if (!notif.message.includes("demand")) {
                        messageTraduit =
                            langue === "en"
                                ? `${notif.message}`
                                : langue === "pidgin"
                                  ? `${notif.message}`
                                  : `${notif.message}`;
                    }
                    break;

                case "retard":
                    titreTraduit = n?.creditRetard || "Crédit en retard";
                    couleur = "#ef4444";
                    break;

                case "user":
                    titreTraduit = n?.nouvelUtilisateur || "Nouvel utilisateur inscrit";
                    couleur = "#0891b2";
                    break;

                case "transaction":
                    titreTraduit = n?.transactionEchouee || "Transaction échouée";
                    couleur = "#ef4444";
                    break;
            }

            return {
                ...notif,
                titre: titreTraduit,
                message: messageTraduit,
                heureRelative,
                couleur,
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
    if (!context) {
        throw new Error("useNotifications doit être utilisé à l'intérieur d'un NotificationProvider");
    }
    return context;
};
