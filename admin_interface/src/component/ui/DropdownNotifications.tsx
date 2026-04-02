import { useRef, useEffect, ReactNode } from "react";
import {
  Bell, X, CheckCheck, CreditCard,
  AlertTriangle, Users, ArrowLeftRight,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

// Types pour les icônes
type TypeIcone = 'credit' | 'retard' | 'user' | 'transaction';

// Props du composant
interface DropdownNotificationsProps {
  onFermer: () => void;
}

// Fonction pour obtenir l'icône selon le type
const iconeParType = (icone: TypeIcone): ReactNode => {
  const props = { size: 16, "aria-hidden": true };
  switch (icone) {
    case "credit":      return <CreditCard {...props} />;
    case "retard":      return <AlertTriangle {...props} />;
    case "user":        return <Users {...props} />;
    case "transaction": return <ArrowLeftRight {...props} />;
    default:            return <Bell {...props} />;
  }
};

const DropdownNotifications = ({ onFermer }: DropdownNotificationsProps) => {
  const { notifications, nombreNonLus, marquerCommeLu, marquerToutCommeLu, supprimerNotification } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onFermer();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onFermer]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-900
      rounded-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)" }}
      role="dialog"
      aria-label="Notifications"
    >

      {/* En-tête */}
      <div className="flex items-center justify-between px-5 py-4
        border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell size={18} style={{ color: "#16a34a" }} aria-hidden="true" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
            Notifications
          </h3>
          {nombreNonLus > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#ef4444" }}
            >
              {nombreNonLus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {nombreNonLus > 0 && (
            <button
              onClick={marquerToutCommeLu}
              className="flex items-center gap-1 text-xs font-medium
              transition-colors hover:opacity-80"
              style={{ color: "#16a34a" }}
              aria-label="Tout marquer comme lu"
            >
              <CheckCheck size={14} aria-hidden="true" />
              Tout lire
            </button>
          )}
          <button
            onClick={onFermer}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Fermer les notifications"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "rgba(22,163,74,0.1)" }}
            >
              <Bell size={22} style={{ color: "#16a34a" }} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Aucune notification
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center">
              Vous êtes à jour sur toutes les activités
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-4 transition-colors
                  hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer
                  ${!notif.lu ? "bg-primary-50/40 dark:bg-primary-900/10" : ""}`}
                onClick={() => marquerCommeLu(notif.id)}
                role="button"
                aria-label={`Notification : ${notif.titre}`}
              >
                {/* Icône */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white mt-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${notif.couleur}, ${notif.couleur}cc)`,
                    boxShadow: `0 2px 6px ${notif.couleur}40`,
                  }}
                >
                  {iconeParType(notif.icone as TypeIcone)}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-tight ${
                      !notif.lu
                        ? "font-bold text-gray-800 dark:text-white"
                        : "font-medium text-gray-600 dark:text-gray-400"
                    }`}>
                      {notif.titre}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        supprimerNotification(notif.id);
                      }}
                      className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                      aria-label={`Supprimer la notification ${notif.titre}`}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: notif.couleur }}>
                    {notif.heure}
                  </p>
                </div>

                {/* Point non lu */}
                {!notif.lu && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0 mt-2"
                    style={{ background: notif.couleur }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pied */}
      {notifications.length > 0 && (
        <div
          className="px-5 py-3 border-t border-gray-100 dark:border-gray-800
          bg-gray-50/50 dark:bg-gray-800/30 text-center"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""} •{" "}
            {nombreNonLus} non lue{nombreNonLus > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default DropdownNotifications;