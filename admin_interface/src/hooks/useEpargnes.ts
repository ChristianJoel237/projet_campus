import { useServerData } from "./useServerData";
import { epargneService } from "../services/epargneService";
import { epargnes } from "../donnees/donneesFictives";
import { Epargne } from "../types/donnees.types";

export const useEpargnes = () =>
    useServerData<Epargne[]>(
        async () => {
            const reponse = await epargneService.listerTous();
            return reponse.epargnes as unknown as Epargne[];
        },
        () => epargnes,
        30_000,
    );
