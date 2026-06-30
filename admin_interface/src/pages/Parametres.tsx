import { useState, useEffect, useMemo } from "react";
import { Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLangue } from "../context/LangueContext";
import { useTheme } from "../context/ThemeContext";

// Types pour les props du ToggleIOS
interface ToggleIOSProps {
  actif: boolean;
  onChange: () => void;
  couleurActif?: string;
  iconeActif?: string;
  iconeInactif?: string;
  ariaLabel: string;
}

// Types pour les notifications
interface NotificationsState {
  nouveauCredit: boolean;
  remboursement: boolean;
  retard: boolean;
  nouvelUtilisateur: boolean;
  rapportHebdo: boolean;
}

// Types pour les items de notification
interface NotifItem {
  cle: keyof NotificationsState;
  emoji: string;
  label: string;
  description: string;
}

// Types pour les onglets
interface Onglet {
  id: string;
  icone: string;
  label: string;
}

// Composant ToggleIOS
const ToggleIOS = ({ 
  actif, 
  onChange, 
  couleurActif = "linear-gradient(135deg, #16a34a, #0891b2)", 
  iconeActif, 
  iconeInactif, 
  ariaLabel 
}: ToggleIOSProps) => (
  <button
    onClick={onChange}
    aria-label={ariaLabel}
    className="relative shrink-0 transition-all duration-300"
    style={{
      width: "52px",
      height: "28px",
      borderRadius: "999px",
      background: actif ? couleurActif : "#D1D5DB",
      boxShadow: actif ? "0 0 0 3px rgba(22,163,74,0.15), inset 0 1px 3px rgba(0,0,0,0.15)" : "inset 0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <span
      className="absolute top-0.5 flex items-center justify-center bg-white rounded-full shadow-md transition-all duration-300"
      style={{
        width: "23px",
        height: "23px",
        transform: actif ? "translateX(25px)" : "translateX(3px)",
        fontSize: "11px",
      }}
    >
      {actif ? iconeActif || "" : iconeInactif || ""}
    </span>
  </button>
);

const Parametres = () => {
  const { emailAdmin } = useAuth();
  const { t, langue, changerLangue } = useLangue();
  const { theme, basculerTheme } = useTheme();

  const [ongletActif, setOngletActif] = useState<string>("notifications");
  const [messageSauvegarde, setMessageSauvegarde] = useState<string>("");
  const [langueSelectionnee, setLangueSelectionnee] = useState<string>(langue);
  const [devise, setDevise] = useState<string>("FCFA");

  const [notifications, setNotifications] = useState<NotificationsState>({
    nouveauCredit: true,
    remboursement: true,
    retard: true,
    nouvelUtilisateur: false,
    rapportHebdo: true,
  });

  useEffect(() => {
    setLangueSelectionnee(langue);
  }, [langue]);

  const afficherMessage = (msg: string) => {
    setMessageSauvegarde(msg);
    setTimeout(() => setMessageSauvegarde(""), 3000);
  };

  const sauvegarderApplication = () => {
    changerLangue(langueSelectionnee as 'fr' | 'en' | 'pidgin');
    afficherMessage(t.erreurs?.parametresSauvegardes || "✅ Paramètres sauvegardés !");
  };

  const sauvegarderNotifications = () => {
    afficherMessage(t.erreurs?.notificationsSauvegardees || "✅ Notifications sauvegardées !");
  };

  const notifItems: NotifItem[] = useMemo(() => [
    {
      cle: "nouveauCredit",
      emoji: "💳",
      label: t.parametres?.notifNouveauCredit || "Nouveau crédit",
      description: t.parametres?.notifNouveauCreditDesc || "Notification lorsqu'un nouveau crédit est demandé",
    },
    {
      cle: "remboursement",
      emoji: "✅",
      label: t.parametres?.notifRemboursement || "Remboursement",
      description: t.parametres?.notifRemboursementDesc || "Notification lorsqu'un remboursement est effectué",
    },
    {
      cle: "retard",
      emoji: "⚠️",
      label: t.parametres?.notifRetard || "Retard",
      description: t.parametres?.notifRetardDesc || "Notification en cas de retard de paiement",
    },
    {
      cle: "nouvelUtilisateur",
      emoji: "👤",
      label: t.parametres?.notifNouvelUtilisateur || "Nouvel utilisateur",
      description: t.parametres?.notifNouvelUtilisateurDesc || "Notification lors de l'inscription d'un nouvel utilisateur",
    },
    {
      cle: "rapportHebdo",
      emoji: "📊",
      label: t.parametres?.notifRapportHebdo || "Rapport hebdomadaire",
      description: t.parametres?.notifRapportHebdoDesc || "Recevez un résumé chaque semaine",
    },
  ], [t]);

  const onglets: Onglet[] = useMemo(() => [
    { id: "notifications", icone: "🔔", label: t.parametres?.notifications || "Notifications" },
    { id: "application", icone: "⚙️", label: t.parametres?.application || "Application" },
  ], [t]);

  const handleNotificationToggle = (cle: keyof NotificationsState) => {
    setNotifications((prev) => ({
      ...prev,
      [cle]: !prev[cle],
    }));
  };

  return (
    <div className="space-y-6" key={langue}>
      {/* Titre */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t.parametres?.titre || "Paramètres"}
        </h2>
        <p className="sous-titre">{t.parametres?.description || "Gérez vos préférences"}</p>
      </div>

      {/* Message de sauvegarde */}
      {messageSauvegarde && (
        <div
          className="px-4 py-3 rounded-xl text-sm font-medium"
          style={
            messageSauvegarde.includes("✅")
              ? {
                  background: "rgba(22,163,74,0.08)",
                  border: "1px solid rgba(22,163,74,0.25)",
                  color: "#15803D",
                }
              : {
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#dc2626",
                }
          }
          role="alert"
        >
          {messageSauvegarde}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu latéral */}
        <div className="w-full lg:w-56 carte p-3 space-y-1 h-fit">
          {onglets.map((onglet) => (
            <button
              key={onglet.id}
              onClick={() => setOngletActif(onglet.id)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200"
              style={
                ongletActif === onglet.id
                  ? {
                      background: "linear-gradient(135deg, #16a34a, #0891b2)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                    }
                  : { color: "#6b7280" }
              }
            >
              <span className="text-base" aria-hidden="true">
                {onglet.icone}
              </span>
              {onglet.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="flex-1 carte">
          {/* Notifications */}
          {ongletActif === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="titre-section">
                  🔔 {t.parametres?.notifications || "Notifications"}
                </h3>
                <p className="sous-titre">{t.parametres?.notificationsDesc || "Configurez vos alertes"}</p>
              </div>

              <div className="space-y-3">
                {notifItems.map((item) => (
                  <div
                    key={item.cle}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={{
                      background: notifications[item.cle]
                        ? "rgba(22,163,74,0.04)"
                        : theme === "dark"
                          ? "rgba(255,255,255,0.03)"
                          : "#F9FAFB",
                      border: notifications[item.cle]
                        ? "1px solid rgba(22,163,74,0.2)"
                        : "1px solid #E5E7EB",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{
                          background: notifications[item.cle]
                            ? "rgba(22,163,74,0.1)"
                            : "rgba(0,0,0,0.04)",
                        }}
                      >
                        {item.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ToggleIOS
                      actif={notifications[item.cle]}
                      onChange={() => handleNotificationToggle(item.cle)}
                      iconeActif="✓"
                      iconeInactif="✕"
                      ariaLabel={`${notifications[item.cle] ? (t.commun?.annuler || "Désactiver") : (t.commun?.confirmer || "Activer")} ${item.label}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={sauvegarderNotifications}
                className="btn-primary w-full sm:w-auto"
              >
                <Save size={16} aria-hidden="true" />
                {t.parametres?.sauvegarderNotifications || "Sauvegarder les notifications"}
              </button>
            </div>
          )}

          {/* Application */}
          {ongletActif === "application" && (
            <div className="space-y-6">
              <div>
                <h3 className="titre-section">⚙️ {t.parametres?.application || "Application"}</h3>
                <p className="sous-titre">{t.parametres?.applicationDesc || "Configurez le thème, la langue et la devise"}</p>
              </div>

              {/* Thème */}
              <div
                className="rounded-xl p-4"
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(8,145,178,0.06)"
                      : "rgba(245,158,11,0.06)",
                  border: `1px solid ${theme === "dark" ? "rgba(8,145,178,0.2)" : "rgba(245,158,11,0.2)"}`,
                }}
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4">
                  🎨 {t.parametres?.apparence || "Apparence"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background:
                          theme === "dark"
                            ? "rgba(8,145,178,0.15)"
                            : "rgba(245,158,11,0.15)",
                      }}
                    >
                      {theme === "dark" ? "🌙" : "☀️"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {theme === "dark"
                          ? (t.parametres?.modeSombre || "Mode Sombre")
                          : (t.parametres?.modeClair || "Mode Clair")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {theme === "dark"
                          ? (t.parametres?.interfaceSombre || "Interface sombre activée")
                          : (t.parametres?.interfaceClaire || "Interface claire activée")}
                      </p>
                    </div>
                  </div>
                  <ToggleIOS
                    actif={theme === "dark"}
                    onChange={basculerTheme}
                    couleurActif="linear-gradient(135deg, #0891b2, #0e7490)"
                    iconeActif="🌙"
                    iconeInactif="☀️"
                    ariaLabel={
                      theme === "dark"
                        ? (t.parametres?.modeClair || "Mode Clair")
                        : (t.parametres?.modeSombre || "Mode Sombre")
                    }
                  />
                </div>
              </div>

              {/* Langue */}
              <div>
                <label className="label" id="langue-label">
                  🌍 {t.parametres?.langue || "Langue de l'interface"}
                </label>
                <select
                  value={langueSelectionnee}
                  onChange={(e) => setLangueSelectionnee(e.target.value)}
                  className="input"
                  aria-labelledby="langue-label"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="pidgin">🇨🇲 Pidgin</option>
                </select>
                <p className="text-xs text-gray-400 mt-1.5">
                  {t.parametres?.avertissementLangue || "⚠️ Le changement sera appliqué après avoir cliqué sur 'Sauvegarder'."}
                </p>
              </div>

              {/* Devise */}
              <div>
                <label className="label" id="devise-label">
                  💰 {t.parametres?.devise || "Devise"}
                </label>
                <select
                  value={devise}
                  onChange={(e) => setDevise(e.target.value)}
                  className="input"
                  aria-labelledby="devise-label"
                >
                  <option value="FCFA">🪙 FCFA — Franc CFA</option>
                  <option value="EUR">💶 EUR — Euro</option>
                  <option value="USD">💵 USD — Dollar américain</option>
                </select>
              </div>

              {/* Infos plateforme */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(22,163,74,0.04)",
                  border: "1px solid rgba(22,163,74,0.12)",
                }}
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-white flex items-center gap-2 mb-3">
                  ℹ️ {t.parametres?.infoPlateforme || "Informations de la plateforme"}
                </p>
                <div className="space-y-2">
                  {[
                    { emoji: "🏷️", label: t.parametres?.version || "Version", valeur: "v1.0.0" },
                    { emoji: "🌐", label: t.parametres?.environnement || "Environnement", valeur: "Production" },
                    { emoji: "🗓️", label: t.parametres?.derniereMaj || "Dernière mise à jour", valeur: "Janvier 2025" },
                    { emoji: "👤", label: t.commun?.administrateur || "Administrateur", valeur: emailAdmin || "admin@microfinance.com" },
                  ].map((info) => (
                    <div key={info.label} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <span aria-hidden="true">{info.emoji}</span>
                        <span>{info.label}</span>
                      </span>
                      <span className="font-semibold px-2 py-0.5 rounded-lg text-xs" style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
                        {info.valeur}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={sauvegarderApplication} className="btn-primary w-full sm:w-auto">
                <Save size={16} aria-hidden="true" />
                {t.parametres?.sauvegarderParametres || "Sauvegarder les paramètres"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres;