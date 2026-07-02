import { useServerData } from "./useServerData";
import { rapportService } from "../services/rapportService";
import { DashboardData } from "../types/donnees.types";
import { statistiquesGenerales, donneesGraphique, transactions, credits } from "../donnees/donneesFictives";

const calculerDonneesFictives = (): DashboardData => ({
    statistiquesGenerales,
    donneesGraphique,
    transactionsRecents: transactions,
    creditsRecents: credits,
});

export const useDashboard = () =>
    useServerData<DashboardData>(async () => rapportService.dashboard(), calculerDonneesFictives, 30_000);

export default useDashboard;
