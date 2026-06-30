import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLangue } from '../context/LangueContext';
import Logo from '../component/ui/Logo';
import { schemas, sanitiserAvantEnvoi } from '../utilitaires/validation';
import SelecteurLangueFlottant from '../component/ui/SelecteurLangueFlottant';

// Types pour les données du formulaire
interface ConnexionFormData {
  email: string;
  motDePasse: string;
}

const Connexion = () => {
  const navigate = useNavigate();
  const { seConnecter, chargement, erreurConnexion } = useAuth();
  const { theme, basculerTheme } = useTheme();
  const { t } = useLangue();

  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const [afficherMdp, setAfficherMdp] = useState<boolean>(false);
  const [erreurLocale, setErreurLocale] = useState<string>('');

  const handleSoumission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreurLocale('');

    if (!email.trim() || !motDePasse.trim()) {
      setErreurLocale(
        t.auth?.champsObligatoires || 'Veuillez remplir tous les champs.'
      );
      return;
    }

    const { valide, erreurs } = schemas.connexion({ email, motDePasse });
    if (!valide) {
      setErreurLocale(Object.values(erreurs)[0] as string);
      return;
    }
    const donnees = sanitiserAvantEnvoi('connexion', {
      email,
      motDePasse,
    }) as unknown as ConnexionFormData;
    const succes = await seConnecter(donnees.email, donnees.motDePasse);
    if (succes) {
      navigate('/');
    }
  };

  const erreurAffichee = erreurLocale || erreurConnexion;

  const inputStyle: React.CSSProperties = {
    background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#f9fafb',
    border: '1.5px solid rgba(22,163,74,0.2)',
    color: theme === 'dark' ? '#f9fafb' : '#111827',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, #030712 0%, #052e16 50%, #0c1a2e 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #e0f2fe 100%)',
      }}
    >
      {/* Cercles décoratifs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #16a34a, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }}
        aria-hidden="true"
      />

      {/* Groupe boutons haut droite */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2"
        style={{ zIndex: 50 }}
      >
        <SelecteurLangueFlottant />
        <button
          onClick={basculerTheme}
          aria-label={
            theme === 'dark'
              ? 'Activer le mode clair'
              : 'Activer le mode sombre'
          }
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background:
              theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            color: theme === 'dark' ? '#F59E0B' : '#6b7280',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.background =
              theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
          }
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.background =
              theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')
          }
        >
          {theme === 'dark' ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Carte */}
      <div
        className="w-full max-w-md relative"
        style={{
          background:
            theme === 'dark' ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border:
            theme === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(22,163,74,0.15)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        }}
      >
        {/* En-tête */}
        <div
          className="p-8 pb-6 text-center rounded-t-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #052e16, #15803d, #0c4a6e)',
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #4ade80, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex justify-center mb-3">
              <Logo taille="lg" afficherTexte={false} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {t.auth?.titreConnexion || 'MicroFinance Admin'}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {t.auth?.sousTitreConnexion || 'Espace administrateur sécurisé'}
            </p>
          </div>
        </div>

        {/* Corps */}
        <div className="p-8">
          <div className="space-y-5">
            {/* Badge accès réservé */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit mx-auto"
              style={{
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.2)',
              }}
            >
              <Shield
                size={14}
                style={{ color: '#16a34a' }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold"
                style={{ color: '#16a34a' }}
              >
                {t.auth?.accesReserve || 'Accès réservé aux administrateurs'}
              </span>
            </div>

            {/* Erreur */}
            {erreurAffichee && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#dc2626',
                }}
                role="alert"
              >
                {erreurAffichee}
              </div>
            )}

            <form
              onSubmit={handleSoumission}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  📧 {t.auth?.adresseEmail || 'Adresse email'}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setErreurLocale('');
                  }}
                  placeholder="admin@microfinance.com"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.border = '1.5px solid #16a34a')
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.border = '1.5px solid rgba(22,163,74,0.2)')
                  }
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="motDePasse"
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  🔒 {t.auth?.motDePasse || 'Mot de passe'}
                </label>
                <div className="relative">
                  <input
                    id="motDePasse"
                    type={afficherMdp ? 'text' : 'password'}
                    value={motDePasse}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setMotDePasse(e.target.value);
                      setErreurLocale('');
                    }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 pr-12"
                    style={inputStyle}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                      (e.target.style.border = '1.5px solid #16a34a')
                    }
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      (e.target.style.border =
                        '1.5px solid rgba(22,163,74,0.2)')
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherMdp(!afficherMdp)}
                    aria-label={
                      afficherMdp
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                    className="absolute right-3 top-3.5 transition-colors"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                      (e.currentTarget.style.color = '#16a34a')
                    }
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                      (e.currentTarget.style.color = '#9ca3af')
                    }
                  >
                    {afficherMdp ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={chargement}
                className="w-full flex items-center justify-center gap-2.5 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 mt-2"
                style={{
                  background: chargement
                    ? 'rgba(22,163,74,0.5)'
                    : 'linear-gradient(135deg, #16a34a, #0891b2)',
                  boxShadow: chargement
                    ? 'none'
                    : '0 4px 14px rgba(22,163,74,0.4)',
                  cursor: chargement ? 'not-allowed' : 'pointer',
                }}
              >
                {chargement ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.auth?.connexionEnCours || 'Connexion en cours...'}
                  </>
                ) : (
                  <>
                    <LogIn size={16} aria-hidden="true" />
                    {t.auth?.seConnecter || 'Se connecter'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
