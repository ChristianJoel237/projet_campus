import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Disposition from "./component/disposition/Disposition";
import TableauDeBord from "./pages/TableauDeBord";
import Utilisateurs from "./pages/Utilisateurs";
import Credits from "./pages/Credits";
import Epargnes from "./pages/Epargne";
import Transactions from "./pages/Transactions";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
import Aide from "./pages/Aide";
import Connexion from "./pages/Connexion";
import { useAuth } from "./context/AuthContext";
import AgentInscription from './pages/agents/AgentInscription';
import AgentsTerrainPage  from './pages/agents/AgentsTerrainPage';

// Route protégée — redirige vers /connexion si non connecté
const RouteProtegee = ({ children }) => {
  const { estConnecte } = useAuth();
  return estConnecte ? children : <Navigate to="/connexion" replace />;
};

// Route publique — redirige vers / si déjà connecté
const RoutePublique = ({ children }) => {
  const { estConnecte } = useAuth();
  return !estConnecte ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page de connexion */}
        <Route
          path="/connexion"
          element={
            <RoutePublique>
              <Connexion />
            </RoutePublique>
          }
        />


        {/* Pages protégées */}
        <Route
          path="/"
          element={
            <RouteProtegee>
              <Disposition />
            </RouteProtegee>
          }
        >
          <Route index element={<TableauDeBord />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="credits" element={<Credits />} />
          <Route path="epargnes" element={<Epargnes />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="rapports" element={<Rapports />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="aide" element={<Aide />} />
          
            {/* ── Agents de terrain ── */}

      <Route path="agents"         element={<AgentsTerrainPage />} />
      <Route path="agents/nouveau" element={<AgentInscription onSuccess={(data) => console.log('Agent créé :', data)} onCancel={() => window.history.back()}
  />} />
        </Route>

        {/* Route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;