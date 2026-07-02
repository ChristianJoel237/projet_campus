import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Disposition from "./component/disposition/Disposition";
import TableauDeBord from "./pages/TableauDeBord";
import Utilisateurs from "./pages/Utilisateurs";
import Credits from "./pages/Credits";
import Epargnes from "./pages/Epargne";
import Transactions from "./pages/Transactions";
import Rapports from "./pages/Rapports";
import Aide from "./pages/Aide";
import Connexion from "./pages/Connexion";
import { useAuth } from "./context/AuthContext";
import AgentInscription from "./pages/agents/AgentInscription";
import AgentsTerrainPage from "./pages/agents/AgentsTerrainPage";
import { AgentsProvider } from "./context/AgentsContext";

interface RouteProps {
    children: ReactNode;
}

// Composant de protection pour les routes nécessitant une authentification
const RouteProtegee = ({ children }: RouteProps) => {
    const { estConnecte } = useAuth();
    return estConnecte ? <>{children}</> : <Navigate to="/connexion" replace />;
};

// Composant pour restreindre l'accès aux pages publiques (ex: Connexion) quand on est déjà logué
const RoutePublique = ({ children }: RouteProps) => {
    const { estConnecte } = useAuth();
    return !estConnecte ? <>{children}</> : <Navigate to="/" replace />;
};

// Wrapper pour injecter le contexte des agents uniquement dans l'espace sécurisé
const ZoneSecuriseeAgents = () => {
    return (
        <AgentsProvider>
            <Outlet />
        </AgentsProvider>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Zone Publique : Connexion */}
                <Route
                    path="/connexion"
                    element={
                        <RoutePublique>
                            <Connexion />
                        </RoutePublique>
                    }
                />

                {/* 2. Zone Protégée : Layout Général */}
                <Route
                    path="/"
                    element={
                        <RouteProtegee>
                            <Disposition />
                        </RouteProtegee>
                    }
                >
                    {/* Routes de base du tableau de bord */}
                    <Route index element={<TableauDeBord />} />
                    <Route path="utilisateurs" element={<Utilisateurs />} />
                    <Route path="credits" element={<Credits />} />
                    <Route path="epargnes" element={<Epargnes />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="rapports" element={<Rapports />} />
                    <Route path="aide" element={<Aide />} />

                    {/* Sous-Zone Sécurisée : Gestion des Agents avec injection du Provider dédiée */}
                    <Route element={<ZoneSecuriseeAgents />}>
                        <Route path="agents" element={<AgentsTerrainPage />} />
                        <Route path="agents/nouveau" element={<AgentInscription />} />
                    </Route>
                </Route>

                {/* 3. Redirection automatique pour toutes les routes inconnues */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
