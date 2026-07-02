// component/BarreNavigation.tsx
import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import SelecteurLangueFlottant from "../ui/SelecteurLangueFlottant";

interface BarreNavigationProps {
    ouvrirMenu: () => void;
    onRecherche: (terme: string) => void;
}

const BarreNavigation = ({ ouvrirMenu, onRecherche }: BarreNavigationProps) => {
    const { t } = useLangue();
    const { theme, basculerTheme } = useTheme();
    const { nombreNonLus } = useNotifications();

    const [recherche, setRecherche] = useState<string>("");
    const [dropdownOuvert, setDropdownOuvert] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Gestion du raccourci clavier ⌘K ou Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valeur = e.target.value;
        setRecherche(valeur);
        onRecherche(valeur.trim());
    };

    const executerRecherche = (e: React.FormEvent) => {
        e.preventDefault();
        onRecherche(recherche.trim());
    };

    return (
        <header
            role="banner"
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b
      border-gray-100 dark:border-gray-800 px-5 py-3 sticky top-0 z-10"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
        >
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                {/* ── Partie gauche (Menu Mobile) ── */}
                <div className="flex items-center lg:w-1/4">
                    <button
                        onClick={ouvrirMenu}
                        aria-label={t.commun?.ouvrirMenu || "Ouvrir le menu"}
                        className="lg:hidden p-2 rounded-xl transition-all duration-200 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* ── Partie centrale (Recherche temps réel) ── */}
                <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-4">
                    <form
                        onSubmit={executerRecherche}
                        className="flex items-center gap-2.5 px-4 py-2 w-full border 
            transition-all duration-200 bg-gray-50 dark:bg-gray-800
            border-gray-200 dark:border-gray-700 rounded-xl
            focus-within:bg-white dark:focus-within:bg-gray-900
            focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10"
                    >
                        <label htmlFor="search-input" className="shrink-0 cursor-pointer">
                            <Search size={18} style={{ color: "#16a34a" }} aria-hidden="true" />
                        </label>
                        <input
                            id="search-input"
                            ref={searchInputRef}
                            type="search"
                            value={recherche}
                            onChange={handleInputChange}
                            placeholder={t.commun?.rechercher || "Rechercher..."}
                            className="bg-transparent text-sm text-gray-700 dark:text-gray-200
              outline-none w-full placeholder-gray-400"
                        />
                        <kbd
                            className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md
              text-[10px] font-bold bg-white dark:bg-gray-700 border
              border-gray-200 dark:border-gray-600 text-gray-400 shadow-sm"
                        >
                            ⌘K
                        </kbd>
                    </form>
                </div>

                {/* ── Partie droite (Actions, Thème & Notifications) ── */}
                <div className="flex items-center justify-end gap-1.5 lg:w-1/4">
                    <SelecteurLangueFlottant />

                    {/* Bouton de basculement de thème */}
                    <button
                        onClick={basculerTheme}
                        aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
                        className="p-2.5 rounded-xl transition-all duration-200 text-gray-500 
            hover:bg-green-500/10 hover:text-[#16a34a] 
            dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-[#16a34a]"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" aria-hidden="true" />

                    {/* Cloche de notifications avec menu déroulant */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOuvert(!dropdownOuvert)}
                            className="relative p-2.5 rounded-xl transition-all duration-200 text-gray-500 hover:bg-green-500/10 hover:text-[#16a34a]"
                            style={dropdownOuvert ? { background: "rgba(22,163,74,0.1)", color: "#16a34a" } : {}}
                        >
                            <Bell size={20} aria-hidden="true" />
                            {nombreNonLus > 0 && (
                                <span
                                    className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px]
                  rounded-full text-white text-[10px] font-bold flex items-center
                  justify-center px-1 ring-2 ring-white dark:ring-gray-900"
                                    style={{ background: "#ef4444" }}
                                >
                                    {nombreNonLus > 9 ? "9+" : nombreNonLus}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BarreNavigation;
