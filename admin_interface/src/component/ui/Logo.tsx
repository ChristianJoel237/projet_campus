import { useLangue } from "../../context/LangueContext";

// Types pour les tailles possibles
type TailleLogo = 'sm' | 'md' | 'lg';

// Type pour les styles par taille
interface TaillesStyles {
  conteneur: string;
  icone: number;
  titre: string;
  sous: string;
}

// Props du composant
interface LogoProps {
  taille?: TailleLogo;
  afficherTexte?: boolean;
}

const Logo = ({ taille = "md", afficherTexte = true }: LogoProps) => {
  const { t } = useLangue();

  const tailles: Record<TailleLogo, TaillesStyles> = {
    sm: { conteneur: "w-7 h-7",   icone: 14, titre: "text-sm",  sous: "text-xs" },
    md: { conteneur: "w-9 h-9",   icone: 18, titre: "text-base", sous: "text-xs" },
    lg: { conteneur: "w-14 h-14", icone: 28, titre: "text-xl",  sous: "text-sm" },
  };

  const s = tailles[taille];

  return (
    <div className="flex items-center gap-2.5">
      {/* Icône */}
      <div
        className={`${s.conteneur} rounded-xl flex items-center justify-center shrink-0`}
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #0891b2 100%)",
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.4)",
        }}
      >
        <svg
          width={s.icone}
          height={s.icone}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="16" cy="18" r="9" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
          <text x="16" y="22" textAnchor="middle" fill="white" fontSize="10"
            fontWeight="800" fontFamily="Inter, sans-serif">F</text>
          <path d="M10 12 L16 5 L22 12" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
          <line x1="16" y1="5" x2="16" y2="10" stroke="white"
            strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
        </svg>
      </div>

      {/* Texte */}
      {afficherTexte && (
        <div>
          <p className={`${s.titre} font-bold leading-tight tracking-tight text-white`}>
            Micro<span style={{ color: "#86efac" }}>Finance</span>
          </p>
          <p className={`${s.sous} leading-tight`} style={{ color: "rgba(255,255,255,0.55)" }}>
            {t.commun?.adminDashboard || "Espace Administrateur"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;