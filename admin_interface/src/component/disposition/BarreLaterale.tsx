<<<<<<< HEAD
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  BarChart2,
  Settings,
  X,
  HelpCircle,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useLangue } from '../../context/LangueContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

// Types pour les éléments de navigation
interface NavItem {
  nom: string;
  chemin: string;
  icone: React.ElementType;
  couleur: string;
  ombre: string;
}

// Props du composant
interface BarreLateraleProps {
  estOuverte: boolean;
  fermer: () => void;
}

const BarreLaterale = ({ estOuverte, fermer }: BarreLateraleProps) => {
  const { t } = useLangue();
  const { nomAdmin, emailAdmin, avatarActuel, estEmoji, seDeconnecter } =
    useAuth();

  const navigation: NavItem[] = [
    {
      nom: t.navigation?.tableauDeBord || 'Tableau de bord',
      chemin: '/',
      icone: LayoutDashboard,
      couleur: '#16a34a',
      ombre: 'rgba(22,163,74,0.4)',
    },
    {
      nom: t.navigation?.utilisateurs || 'Utilisateurs',
      chemin: '/utilisateurs',
      icone: Users,
      couleur: '#0891b2',
      ombre: 'rgba(8,145,178,0.4)',
    },
    {
      nom: t.navigation?.agentsTerrain || 'Agents de terrain',
      chemin: '/agents',
      icone: UserCheck,
      couleur: '#16a34a',
      ombre: 'rgba(22,163,74,0.4)',
    },
    {
      nom: t.navigation?.credits || 'Crédits',
      chemin: '/credits',
      icone: CreditCard,
      couleur: '#16a34a',
      ombre: 'rgba(22,163,74,0.4)',
    },
    {
      nom: t.navigation?.epargnes || 'Épargnes',
      chemin: '/epargnes',
      icone: PiggyBank,
      couleur: '#F59E0B',
      ombre: 'rgba(245,158,11,0.4)',
    },
    {
      nom: t.navigation?.transactions || 'Transactions',
      chemin: '/transactions',
      icone: ArrowLeftRight,
      couleur: '#0891b2',
      ombre: 'rgba(8,145,178,0.4)',
    },
    {
      nom: t.navigation?.rapports || 'Rapports',
      chemin: '/rapports',
      icone: BarChart2,
      couleur: '#f97316',
      ombre: 'rgba(249,115,22,0.4)',
    },
    {
      nom: t.navigation?.aide || 'Aide',
      chemin: '/aide',
      icone: HelpCircle,
      couleur: '#8b5cf6',
      ombre: 'rgba(139,92,246,0.4)',
    },
    {
      nom: t.navigation?.parametres || 'Paramètres',
      chemin: '/parametres',
      icone: Settings,
      couleur: '#6b7280',
      ombre: 'rgba(107,114,128,0.4)',
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {estOuverte && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={fermer}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Menu principal"
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          border-r border-white/10
          ${estOuverte ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          background:
            'linear-gradient(180deg, #052e16 0%, #14532d 50%, #052e16 100%)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Logo taille="md" afficherTexte={true} />
          <button
            onClick={fermer}
            aria-label={t.commun?.fermerMenu || 'Fermer le menu'}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p
            className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {t.commun?.menuPrincipal || 'Menu principal'}
          </p>

          {navigation.map((item) => {
            const Icone = item.icone;
            return (
              <NavLink
                key={item.chemin}
                to={item.chemin}
                end={item.chemin === '/'}
                onClick={fermer}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${isActive ? 'text-white' : 'hover:text-white'}`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${item.couleur}40, ${item.couleur}20)`,
                        border: `1px solid ${item.couleur}50`,
                        boxShadow: `0 2px 8px ${item.ombre}`,
                        color: 'white',
                      }
                    : {
                        color: 'rgba(255,255,255,0.55)',
                      }
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className="p-1.5 rounded-lg transition-all duration-200 shrink-0"
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${item.couleur}, ${item.couleur}cc)`,
                              boxShadow: `0 2px 6px ${item.ombre}`,
                            }
                          : {
                              background: 'rgba(255,255,255,0.08)',
                            }
                      }
                    >
                      <Icone
                        size={15}
                        aria-hidden="true"
                        style={{ color: isActive ? 'white' : item.couleur }}
                      />
                    </div>
                    <span>{item.nom}</span>
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: item.couleur,
                          boxShadow: `0 0 6px ${item.ombre}`,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Pied */}
        <div
          className="px-3 py-4 space-y-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Bouton déconnexion */}
          <button
            onClick={seDeconnecter}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
    text-sm font-medium transition-all duration-200"
            style={{ color: 'rgba(239,68,68,0.85)' }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(239,68,68,0.85)';
            }}
          >
            <div
              className="p-1.5 rounded-lg shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}
            >
              <LogOut
                size={15}
                style={{ color: '#ef4444' }}
                aria-hidden="true"
              />
            </div>
            {t.parametres?.seDeconnecter || 'Déconnexion'}
          </button>
        </div>
      </aside>
    </>
  );
=======
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    PiggyBank,
    ArrowLeftRight,
    BarChart2,
    X,
    HelpCircle,
    LogOut,
    UserCheck,
} from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

interface NavItem {
    nom: string;
    chemin: string;
    icone: React.ElementType;
    couleur: string;
    ombre: string;
}

interface BarreLateraleProps {
    estOuverte: boolean;
    fermer: () => void;
}

const BarreLaterale = ({ estOuverte, fermer }: BarreLateraleProps) => {
    const { t } = useLangue();
    const { seDeconnecter } = useAuth(); // On ne garde que la déconnexion, sans afficher l'email

    const navigation: NavItem[] = [
        {
            nom: t.navigation?.tableauDeBord || "Tableau de bord",
            chemin: "/",
            icone: LayoutDashboard,
            couleur: "#16a34a",
            ombre: "rgba(22,163,74,0.4)",
        },
        {
            nom: t.navigation?.utilisateurs || "Utilisateurs",
            chemin: "/utilisateurs",
            icone: Users,
            couleur: "#0891b2",
            ombre: "rgba(8,145,178,0.4)",
        },
        {
            nom: t.navigation?.agentsTerrain || "Agents de terrain",
            chemin: "/agents",
            icone: UserCheck,
            couleur: "#16a34a",
            ombre: "rgba(22,163,74,0.4)",
        },
        {
            nom: t.navigation?.credits || "Crédits",
            chemin: "/credits",
            icone: CreditCard,
            couleur: "#16a34a",
            ombre: "rgba(22,163,74,0.4)",
        },
        {
            nom: t.navigation?.epargnes || "Épargnes",
            chemin: "/epargnes",
            icone: PiggyBank,
            couleur: "#F59E0B",
            ombre: "rgba(245,158,11,0.4)",
        },
        {
            nom: t.navigation?.transactions || "Transactions",
            chemin: "/transactions",
            icone: ArrowLeftRight,
            couleur: "#0891b2",
            ombre: "rgba(8,145,178,0.4)",
        },
        {
            nom: t.navigation?.rapports || "Rapports",
            chemin: "/rapports",
            icone: BarChart2,
            couleur: "#f97316",
            ombre: "rgba(249,115,22,0.4)",
        },
        {
            nom: t.navigation?.aide || "Aide",
            chemin: "/aide",
            icone: HelpCircle,
            couleur: "#8b5cf6",
            ombre: "rgba(139,92,246,0.4)",
        },
    ];

    return (
        <>
            {/* Overlay mobile */}
            {estOuverte && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={fermer}
                    aria-hidden="true"
                />
            )}

            <aside
                role="navigation"
                aria-label="Menu principal"
                className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    border-r border-white/10
                    ${estOuverte ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                style={{
                    background: "linear-gradient(180deg, #052e16 0%, #14532d 50%, #052e16 100%)",
                }}
            >
                {/* Logo + fermeture mobile */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <Logo taille="md" afficherTexte={true} />
                    <button
                        onClick={fermer}
                        aria-label={t.commun?.fermerMenu || "Fermer le menu"}
                        className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                    <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3 text-white/30">
                        {t.commun?.menuPrincipal || "Menu principal"}
                    </p>

                    {navigation.map((item) => {
                        const Icone = item.icone;
                        return (
                            <NavLink
                                key={item.chemin}
                                to={item.chemin}
                                end={item.chemin === "/"}
                                onClick={fermer}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    text-sm font-medium transition-all duration-200
                                    ${isActive ? "text-white" : "text-white/55 hover:text-white"}`
                                }
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                              background: `linear-gradient(135deg, ${item.couleur}40, ${item.couleur}20)`,
                                              border: `1px solid ${item.couleur}50`,
                                              boxShadow: `0 2px 8px ${item.ombre}`,
                                          }
                                        : {}
                                }
                            >
                                <div className="p-1.5 rounded-lg shrink-0 bg-white/10">
                                    <Icone size={15} style={{ color: item.couleur }} />
                                </div>
                                <span className="truncate">{item.nom}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Pied : uniquement déconnexion */}
                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={seDeconnecter}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                                   text-sm font-medium text-red-400 hover:bg-red-500/10
                                   hover:text-red-300 transition-all duration-200"
                    >
                        <div className="p-1.5 rounded-lg bg-red-500/15 shrink-0">
                            <LogOut size={15} className="text-red-400" />
                        </div>
                        <span>{t.parametres?.seDeconnecter || "Déconnexion"}</span>
                    </button>
                </div>
            </aside>
        </>
    );
>>>>>>> 417e06c (feat: migrer l'application et les composants de JS vers TypeScript)
};

export default BarreLaterale;
