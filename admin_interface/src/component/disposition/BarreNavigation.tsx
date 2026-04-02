import { useState } from "react";
import { Menu, Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLangue } from "../../context/LangueContext";
import { useNotifications } from "../../context/NotificationContext";
import DropdownNotifications from "../ui/DropdownNotifications";

// Props du composant
interface BarreNavigationProps {
  ouvrirMenu: () => void;
}

const BarreNavigation = ({ ouvrirMenu }: BarreNavigationProps) => {
  const { nomAdmin, emailAdmin, avatarActuel, estEmoji, seDeconnecter } = useAuth();
  const { t } = useLangue();
  const { nombreNonLus } = useNotifications();
  const [dropdownOuvert, setDropdownOuvert] = useState<boolean>(false);

  const obtenirSalutation = (): string => {
    const heure = new Date().getHours();
    if (heure >= 5 && heure < 12) return t.commun?.bonjour || "Bonjour";
    if (heure >= 12 && heure < 18) return t.commun?.bonApresMidi || "Bon après-midi";
    return t.commun?.bonsoir || "Bonsoir";
  };

  return (
    <header
      role="banner"
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b
      border-gray-100 dark:border-gray-800 px-5 py-3 flex items-center
      justify-between sticky top-0 z-10"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
    >
      {/* ── Partie gauche ── */}
      <div className="flex items-center gap-4">
        {/* Bouton menu mobile */}
        <button
          onClick={ouvrirMenu}
          aria-label={t.commun?.ouvrirMenu || "Ouvrir le menu"}
          className="lg:hidden p-2 rounded-xl transition-all duration-200 text-gray-500"
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #16a34a, #0891b2)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.35)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* Barre de recherche */}
        <div
          className="hidden md:flex items-center gap-2.5 rounded-xl px-3.5 py-2
          w-80 border transition-all duration-200 bg-gray-50 dark:bg-gray-800
          border-gray-200 dark:border-gray-700 focus-within:border-primary-400
          dark:focus-within:border-primary-500 focus-within:ring-2
          focus-within:ring-primary-500/20"
        >
          <Search
            size={15}
            className="shrink-0"
            style={{ color: "#16a34a" }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={t.commun?.rechercher || "Rechercher..."}
            aria-label={t.commun?.rechercher || "Rechercher"}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200
            outline-none w-full placeholder-gray-400 dark:placeholder-gray-500"
          />
          <kbd
            className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md
            text-xs font-medium bg-gray-100 dark:bg-gray-700 border
            border-gray-200 dark:border-gray-600"
            style={{ color: "#16a34a" }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ── Partie droite ── */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setDropdownOuvert(!dropdownOuvert)}
            aria-label={`${nombreNonLus} ${t.commun?.notificationsNonLues || "notifications non lues"}`}
            className="relative p-2.5 rounded-xl transition-all duration-200 text-gray-500"
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(22,163,74,0.1), rgba(8,145,178,0.1))";
              e.currentTarget.style.color = "#16a34a";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = dropdownOuvert
                ? "linear-gradient(135deg, rgba(22,163,74,0.1), rgba(8,145,178,0.1))"
                : "transparent";
              e.currentTarget.style.color = dropdownOuvert
                ? "#16a34a"
                : "#6b7280";
            }}
            style={
              dropdownOuvert
                ? {
                    background:
                      "linear-gradient(135deg, rgba(22,163,74,0.1), rgba(8,145,178,0.1))",
                    color: "#16a34a",
                  }
                : {}
            }
          >
            <Bell size={18} aria-hidden="true" />
            {nombreNonLus > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                rounded-full text-white text-xs font-bold flex items-center
                justify-center px-1 ring-2 ring-white dark:ring-gray-900"
                style={{ background: "#ef4444", fontSize: "10px" }}
                aria-hidden="true"
              >
                {nombreNonLus > 9 ? "9+" : nombreNonLus}
              </span>
            )}
          </button>

          {dropdownOuvert && (
            <DropdownNotifications onFermer={() => setDropdownOuvert(false)} />
          )}
        </div>

        {/* Séparateur */}
        <div
          className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"
          aria-hidden="true"
        />

        {/* Profil + Déconnexion */}
        <div className="relative group">
          {/* Bouton profil */}
          <button
            aria-label={t.commun?.menuProfil || "Menu profil"}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center
              font-bold shrink-0"
              style={{
                background: estEmoji
                  ? "rgba(22,163,74,0.12)"
                  : "linear-gradient(135deg, #16a34a, #0891b2)",
                fontSize: estEmoji ? "1.1rem" : "0.875rem",
                color: estEmoji ? "inherit" : "white",
                boxShadow: "0 2px 6px rgba(22,163,74,0.35)",
              }}
              aria-hidden="true"
            >
              {avatarActuel}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                {nomAdmin || t.commun?.administrateur || "Administrateur"}
              </p>
              <p
                className="text-xs leading-tight flex items-center gap-1"
                style={{ color: "#16a34a" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#16a34a",
                    boxShadow: "0 0 4px rgba(22,163,74,0.6)",
                  }}
                  aria-hidden="true"
                />
                {obtenirSalutation()} 👋
              </p>
            </div>
            <ChevronDown
              size={14}
              className="hidden md:block"
              style={{ color: "#16a34a" }}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown profil */}
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200 z-20"
            style={{
              background: "var(--dropdown-bg)",
              border: "1px solid rgba(22,163,74,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            {/* Infos admin */}
            <div
              className="px-4 py-3"
              style={{
                background: "rgba(22,163,74,0.08)",
                borderBottom: "1px solid rgba(22,163,74,0.1)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center
                  font-bold text-sm shrink-0"
                  style={{
                    background: estEmoji
                      ? "rgba(22,163,74,0.15)"
                      : "linear-gradient(135deg, #16a34a, #0891b2)",
                    fontSize: estEmoji ? "1rem" : "0.75rem",
                    color: estEmoji ? "inherit" : "white",
                  }}
                >
                  {avatarActuel}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-gray-800 dark:text-white">
                    {t.commun?.administrateur || "Administrateur"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#16a34a" }}>
                    {emailAdmin || "admin@microfinance.com"}
                  </p>
                </div>
              </div>

              {/* Badge en ligne */}
              <div
                className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg w-fit"
                style={{ background: "rgba(22,163,74,0.12)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#16a34a",
                    boxShadow: "0 0 4px rgba(22,163,74,0.6)",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#16a34a" }}
                >
                  {t.parametres?.enLigne || "En ligne"}
                </span>
              </div>
            </div>

            {/* Lien paramètres */}
            <Link
              to="/parametres"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium
              text-gray-700 dark:text-gray-200 transition-colors"
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.background = "rgba(22,163,74,0.08)")
              }
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{ background: "rgba(22,163,74,0.1)" }}
                aria-hidden="true"
              >
                ⚙️
              </span>
              {t.parametres?.parametresProfil || "Paramètres du profil"}
            </Link>

            <div className="h-px mx-3 bg-gray-100 dark:bg-gray-700" />

            {/* Bouton déconnexion */}
            <button
              onClick={seDeconnecter}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm
              font-medium transition-colors"
              style={{ color: "#ef4444" }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
              }
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(239,68,68,0.1)" }}
                aria-hidden="true"
              >
                <LogOut size={14} style={{ color: "#ef4444" }} />
              </span>
              {t.parametres?.seDeconnecter || "Déconnexion"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BarreNavigation;