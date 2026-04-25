import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BarreLaterale from './BarreLaterale';
import BarreNavigation from './BarreNavigation';

const Disposition = () => {
  const [menuOuvert, setMenuOuvert] = useState<boolean>(false);

  const ouvrirMenu = (): void => setMenuOuvert(true);
  const fermerMenu = (): void => setMenuOuvert(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden">
      {/* Barre latérale */}
      <BarreLaterale estOuverte={menuOuvert} fermer={fermerMenu} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Barre de navigation */}
        <BarreNavigation ouvrirMenu={ouvrirMenu} />

        {/* Contenu des pages */}
        <main role="main" className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Pied de page */}
        <footer className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            MicroFinance Cameroun © {new Date().getFullYear()} — Plateforme
            sécurisée
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Disposition;
