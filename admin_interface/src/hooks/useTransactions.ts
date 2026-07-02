import { useServerData } from "./useServerData";
import { transactionService } from "../services/transactionService";
import { transactions } from "../donnees/donneesFictives";
import { Transaction } from "../types/donnees.types";

export const useTransactions = () =>
    useServerData<Transaction[]>(
        async () => {
            const reponse = await transactionService.listerTous();
            return reponse.transactions as unknown as Transaction[];
        },
        () => transactions,
        30_000,
    );
