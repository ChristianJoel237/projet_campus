import { useState, KeyboardEvent, ChangeEvent } from "react";

// Props du composant
interface ModaleBienvenueProps {
  onFermer: () => void;
}

const ModaleBienvenue = ({ onFermer }: ModaleBienvenueProps) => {
  const [nom, setNom] = useState<string>("");
  const [erreur, setErreur] = useState<string>("");

  const handleSoumettre = (): void => {
    if (nom.trim().length < 2) {
      setErreur("Veuillez entrer un nom d'au moins 2 caractères.");
      return;
    }
    // Sauvegarde temporaire en localStorage
    localStorage.setItem("nomAdmin", nom.trim());
    onFermer();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSoumettre();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNom(e.target.value);
    setErreur("");
  };

  const isDisabled = nom.trim().length < 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-bienvenue"
    >
      {/* Fond */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, rgba(5,46,22,0.97) 0%, rgba(3,30,46,0.97) 100%)",
        }}
      />

      {/* Carte */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(22,163,74,0.15)" }}
      >
        {/* En-tête */}
        <div
          className="px-8 py-10 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #0c4a6e 100%)",
          }}
        >
          {/* Cercles décoratifs */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #16a34a, transparent)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #0891b2, transparent)" }}
            aria-hidden="true"
          />

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #16a34a, #0891b2)",
                boxShadow: "0 8px 24px rgba(22,163,74,0.5)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="18" r="9" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
                <text x="16" y="22" textAnchor="middle" fill="white" fontSize="10"
                  fontWeight="800" fontFamily="Inter, sans-serif">F</text>
                <path d="M10 12 L16 5 L22 12" stroke="white" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
                <line x1="16" y1="5" x2="16" y2="10" stroke="white"
                  strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
          </div>

          <h1
            id="titre-bienvenue"
            className="text-2xl font-bold text-white mb-1 tracking-tight"
          >
            Micro<span style={{ color: "#86efac" }}>Finance</span> Admin
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)" }} className="text-sm">
            Plateforme de gestion microfinance — Cameroun
          </p>
        </div>

        {/* Corps */}
        <div className="px-8 py-7">

          {/* Message */}
          <div className="text-center mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(22,163,74,0.1)" }}
            >
              <span className="text-xl" aria-hidden="true">👋</span>
            </div>
            <p className="text-gray-800 dark:text-white font-semibold text-lg">
              Bienvenue !
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Entrez votre nom pour accéder à votre espace.
            </p>
          </div>

          {/* Champ */}
          <div className="mb-5">
            <label htmlFor="nom-admin" className="label">
              Votre nom complet
            </label>
            <input
              id="nom-admin"
              type="text"
              placeholder="Ex : Franklin Mballa..."
              value={nom}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`input ${erreur ? "border-red-400 focus:border-red-400" : ""}`}
              autoFocus
            />
            {erreur && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1" role="alert">
                <span aria-hidden="true">⚠️</span> {erreur}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            onClick={handleSoumettre}
            disabled={isDisabled}
            className="btn-primary w-full py-3 text-base"
          >
            Accéder au tableau de bord →
          </button>

          {/* Sécurité */}
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-4 flex items-center justify-center gap-1.5">
            <span aria-hidden="true">🔒</span>
            Plateforme sécurisée — MicroFinance Cameroun © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModaleBienvenue;