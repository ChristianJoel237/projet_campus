import { api, ApiResponse } from "./apiConfig";

export interface ParametresDTO {
    soldeMinimumRetrait: number;
    tauxEpargneAnnuel: number;
    tauxInteretCreditAnnuel: number;
}

interface ParametresResponse extends ParametresDTO {
    id: number;
    dateModification: string;
}

export const parametresService = {
    recuperer: async (): Promise<ParametresResponse> => {
        const response = await api.get<ApiResponse<ParametresResponse>>("/parametres");
        if (!response.donnees) throw new Error("Paramètres non trouvés");
        return response.donnees;
    },

    mettreAJour: async (data: ParametresDTO): Promise<ParametresResponse> => {
        const response = await api.put<ApiResponse<ParametresResponse>>("/parametres", data);
        if (!response.donnees) throw new Error("Erreur lors de la mise à jour des paramètres");
        return response.donnees;
    },
};
