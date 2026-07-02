// src/hooks/useUtilisateurs.ts
import { useServerData } from "./useServerData";
import { utilisateurService } from "../services/utilisateurService";
import { utilisateurs } from "../donnees/donneesFictives";
import { Utilisateur } from "../types/donnees.types";

export const useUtilisateurs = () =>
    useServerData<Utilisateur[]>(
        async () => {
            const reponse = await utilisateurService.listerTous();

            // Le Long du backend est reçu en string ou number, on le garantit en number pour le frontend
            return reponse.utilisateurs.map((u) => ({
                ...u,
                id: typeof u.id === "string" ? parseInt(u.id, 10) : u.id,
            })) as Utilisateur[];
        },
        () => utilisateurs,
        30_000,
    );
