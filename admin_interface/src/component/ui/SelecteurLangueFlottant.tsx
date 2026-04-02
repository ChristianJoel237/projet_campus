import { useState } from "react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import { Globe } from "lucide-react";

// Types pour les langues
type CodeLangue = 'fr' | 'en' | 'pidgin';

interface LangueItem {
  code: CodeLangue;
  drapeau: string;
  label: string;
}

const LANGUES: LangueItem[] = [
  { code: "fr",     drapeau: "🇫🇷", label: "Français" },
  { code: "en",     drapeau: "🇬🇧", label: "English"  },
  { code: "pidgin", drapeau: "🇨🇲", label: "Pidgin"   },
];

const SelecteurLangueFlottant = () => {
  const { langue, changerLangue } = useLangue();
  const { theme } = useTheme();
  const [ouvert, setOuvert] = useState<boolean>(false);

  const isDark = theme === "dark";

  const boutonBg = ouvert
    ? "linear-gradient(135deg, #16a34a, #0891b2)"
    : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";

  const boutonColor = ouvert
    ? "#ffffff"
    : isDark ? "#e2e8f0" : "#6b7280";

  const menuBg     = isDark ? "rgba(30,41,59,0.97)"          : "rgba(248,250,252,0.97)";
  const menuBorder = isDark ? "1px solid rgba(100,116,139,0.3)" : "1px solid rgba(148,163,184,0.3)";

  const optionColorActif  = "#16a34a";
  const optionColorNormal = isDark ? "#cbd5e1" : "#475569";
  const optionBgActif     = isDark ? "rgba(22,163,74,0.15)" : "rgba(22,163,74,0.08)";
  const optionBgHover     = isDark ? "rgba(100,116,139,0.2)" : "rgba(148,163,184,0.15)";

  const handleChangerLangue = (code: CodeLangue) => {
    changerLangue(code);
    setOuvert(false);
  };

  return (
    <div className="relative">

      {/* Bouton principal */}
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-label="Changer de langue"
        className="flex items-center gap-1.5 px-3 h-10 rounded-xl transition-all duration-200"
        style={{
          background: boutonBg,
          color: boutonColor,
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!ouvert) e.currentTarget.style.background = isDark
            ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!ouvert) e.currentTarget.style.background = boutonBg;
        }}
      >
        <Globe size={15} aria-hidden="true" />
        <span className="text-xs font-semibold">
          {langue === "fr" ? "Langue" : "Language"}
        </span>
        <span
          className="text-xs transition-transform duration-200"
          style={{ transform: ouvert ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {/* Menu déroulant */}
      {ouvert && (
        <div
          className="absolute top-12 right-0 rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: menuBg,
            backdropFilter: "blur(16px)",
            border: menuBorder,
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.1)",
            minWidth: "160px",
            zIndex: 9999,
          }}
        >
          {LANGUES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleChangerLangue(l.code)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left transition-all duration-150"
              style={{
                background: langue === l.code ? optionBgActif : "transparent",
                borderLeft: langue === l.code
                  ? "3px solid #16a34a"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (langue !== l.code)
                  e.currentTarget.style.background = optionBgHover;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (langue !== l.code)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span className="text-xl">{l.drapeau}</span>
              <span
                className="text-sm font-semibold flex-1"
                style={{ color: langue === l.code ? optionColorActif : optionColorNormal }}
              >
                {l.label}
              </span>
              {langue === l.code && (
                <span className="text-xs font-bold" style={{ color: "#16a34a" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelecteurLangueFlottant;