import { ElementType } from 'react';

interface CarteStatistiqueProps {
  titre: string;
  valeur: string | number;
  icone: ElementType;
  couleur?: string;  // ← Accepte n'importe quelle chaîne
  sousTitre?: string;
}

interface StyleCarte {
  background: string;
  boxShadow?: string;
}

const CarteStatistique = ({ 
  titre, 
  valeur, 
  icone, 
  couleur = "bg-primary-600", 
  sousTitre 
}: CarteStatistiqueProps) => {
  const Icone = icone;

  const styles: Record<string, StyleCarte> = {
    "bg-primary-600": { background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 4px 10px rgba(22,163,74,0.35)" },
    "bg-teal-600":    { background: "linear-gradient(135deg, #0891b2, #0e7490)", boxShadow: "0 4px 10px rgba(8,145,178,0.35)" },
    "bg-gold-500":    { background: "linear-gradient(135deg, #F59E0B, #d97706)", boxShadow: "0 4px 10px rgba(245,158,11,0.35)" },
    "bg-blue-500":    { background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 4px 10px rgba(59,130,246,0.35)" },
    "bg-primary-700": { background: "linear-gradient(135deg, #15803d, #166534)", boxShadow: "0 4px 10px rgba(21,128,61,0.35)" },
    "bg-orange-500":  { background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 4px 10px rgba(249,115,22,0.35)" },
  };

  const style = styles[couleur] ?? { background: "#16a34a" };

  const getPointCouleur = (style: StyleCarte): string => {
    const bg = style.background;
    if (bg.includes("16a34a")) return "#16a34a";
    if (bg.includes("0891b2")) return "#0891b2";
    if (bg.includes("F59E0B")) return "#F59E0B";
    if (bg.includes("3b82f6")) return "#3b82f6";
    if (bg.includes("15803d")) return "#15803d";
    if (bg.includes("f97316")) return "#f97316";
    return "#16a34a";
  };

  const pointCouleur = getPointCouleur(style);

  return (
    <div className="carte flex items-center gap-4" role="region" aria-label={titre}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={style}
        aria-hidden="true"
      >
        <Icone size={22} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {titre}
        </p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5 truncate">
          {valeur}
        </p>
        {sousTitre && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: pointCouleur }}
              aria-hidden="true"
            />
            {sousTitre}
          </p>
        )}
      </div>
    </div>
  );
};

export default CarteStatistique;