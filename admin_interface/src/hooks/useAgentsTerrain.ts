// src/hooks/useAgentsTerrain.ts
import { useServerData } from "./useServerData";
import { agentsService } from "../services/agentService";
import type { Agent } from "../context/AgentsContext";

const AGENTS_MOCK: Agent[] = [
    {
        id: "AGT-001",
        prenom: "Jean-Pierre",
        nom: "Mballa",
        telephone: "+237 677 123 456",
        ville: "Yaoundé",
        zone: "Centre",
        role: "verification",
        statut: "actif",
        dossiers: 24,
        login: "jea.mballa",
        dateInscription: "2024-11-03",
        email: "jp.mballa@microfinance.cm",
    },
    {
        id: "AGT-002",
        prenom: "Aïcha",
        nom: "Bello",
        telephone: "+237 699 234 567",
        ville: "Douala",
        zone: "Littoral",
        role: "verification",
        statut: "actif",
        dossiers: 18,
        login: "aic.bello",
        dateInscription: "2024-12-10",
        email: "a.bello@microfinance.cm",
    },
    {
        id: "AGT-003",
        prenom: "Samuel",
        nom: "Nkoa",
        telephone: "+237 655 345 678",
        ville: "Bafoussam",
        zone: "Ouest",
        role: "validation",
        statut: "actif",
        dossiers: 41,
        login: "sam.nkoa",
        dateInscription: "2024-10-21",
        email: "s.nkoa@microfinance.cm",
    },
    {
        id: "AGT-004",
        prenom: "Fatima",
        nom: "Moussa",
        telephone: "+237 670 456 789",
        ville: "Garoua",
        zone: "Nord",
        role: "verification",
        statut: "inactif",
        dossiers: 7,
        login: "fat.moussa",
        dateInscription: "2025-01-15",
        email: "f.moussa@microfinance.cm",
    },
];

export const useAgentsTerrain = () => {
    return useServerData<Agent[]>(
        () => agentsService.getAll(),
        () => AGENTS_MOCK,
    );
};
