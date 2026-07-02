// component/Disposition.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BarreNavigation from "./BarreNavigation";
import BarreLaterale from "./BarreLaterale";

const Disposition = () => {
    const [recherche, setRecherche] = useState<string>("");
    const [barreOuverte, setBarreOuverte] = useState<boolean>(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden">
            {/* Barre latérale */}
            <BarreLaterale estOuverte={barreOuverte} fermer={() => setBarreOuverte(false)} />

            {/* Contenu principal (avec décalage pour éviter le chevauchement) */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Barre de navigation transmettant le setter de recherche */}
                <BarreNavigation ouvrirMenu={() => setBarreOuverte(true)} onRecherche={setRecherche} />

                {/* Zone dynamique des pages */}
                <main role="main" className="flex-1 overflow-y-auto">
                    <div className="p-5 md:p-6 max-w-screen-2xl mx-auto">
                        {/* Le contexte fournit l'état de recherche à tous les sous-composants */}
                        <Outlet context={recherche} />
                    </div>
                </main>

                {/* Pied de page */}
                <footer className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                    <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
                        MicroFinance Cameroun © {new Date().getFullYear()} — Plateforme sécurisée
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Disposition;
