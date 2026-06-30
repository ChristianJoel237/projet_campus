// Données fictives pour simuler le back-end

export const statistiquesGenerales = {
  totalUtilisateurs: 1248,
  creditsActifs: 326,
  epargnesActives: 892,
  transactionsAujourdhui: 147,
  revenusTotal: 4850000,
  tauxRemboursement: 94,
};

export const utilisateurs = [
  { id: 1, nom: "Mballa Marie", telephone: "6XX-XXX-001", ville: "Yaoundé", statut: "actif", credits: 2, epargne: 45000, dateInscription: "2024-01-15" },
  { id: 2, nom: "Nguema Paul", telephone: "6XX-XXX-002", ville: "Douala", statut: "actif", credits: 1, epargne: 120000, dateInscription: "2024-02-20" },
  { id: 3, nom: "Biya Célestine", telephone: "6XX-XXX-003", ville: "Bafoussam", statut: "inactif", credits: 0, epargne: 15000, dateInscription: "2024-03-10" },
  { id: 4, nom: "Tamba Jean", telephone: "6XX-XXX-004", ville: "Garoua", statut: "actif", credits: 3, epargne: 200000, dateInscription: "2024-01-28" },
  { id: 5, nom: "Foko Sandrine", telephone: "6XX-XXX-005", ville: "Maroua", statut: "suspendu", credits: 1, epargne: 8000, dateInscription: "2024-04-05" },
  { id: 6, nom: "Etoa Bernard", telephone: "6XX-XXX-006", ville: "Yaoundé", statut: "actif", credits: 2, epargne: 75000, dateInscription: "2024-02-14" },
  { id: 7, nom: "Nkomo Grace", telephone: "6XX-XXX-007", ville: "Douala", statut: "actif", credits: 1, epargne: 95000, dateInscription: "2024-03-22" },
  { id: 8, nom: "Abena Michel", telephone: "6XX-XXX-008", ville: "Bertoua", statut: "inactif", credits: 0, epargne: 30000, dateInscription: "2024-05-01" },
];

export const credits = [
  { id: 1, utilisateur: "Mballa Marie", montant: 50000, statut: "en_cours", dateDebut: "2024-11-01", dateEcheance: "2025-02-01", remboursement: 35000, taux: 8 },
  { id: 2, utilisateur: "Nguema Paul", montant: 150000, statut: "en_cours", dateDebut: "2024-10-15", dateEcheance: "2025-01-15", remboursement: 100000, taux: 7 },
  { id: 3, utilisateur: "Tamba Jean", montant: 200000, statut: "rembourse", dateDebut: "2024-08-01", dateEcheance: "2024-11-01", remboursement: 200000, taux: 8 },
  { id: 4, utilisateur: "Foko Sandrine", montant: 20000, statut: "en_retard", dateDebut: "2024-09-01", dateEcheance: "2024-12-01", remboursement: 5000, taux: 10 },
  { id: 5, utilisateur: "Etoa Bernard", montant: 75000, statut: "en_cours", dateDebut: "2024-11-15", dateEcheance: "2025-02-15", remboursement: 25000, taux: 8 },
  { id: 6, utilisateur: "Nkomo Grace", montant: 100000, statut: "en_attente", dateDebut: null, dateEcheance: null, remboursement: 0, taux: 7 },
];

export const epargnes = [
  { id: 1, utilisateur: "Mballa Marie", solde: 45000, typeEpargne: "quotidienne", dernierDepot: "2025-01-10", nombreDepots: 90 },
  { id: 2, utilisateur: "Nguema Paul", solde: 120000, typeEpargne: "hebdomadaire", dernierDepot: "2025-01-08", nombreDepots: 48 },
  { id: 3, utilisateur: "Tamba Jean", solde: 200000, typeEpargne: "quotidienne", dernierDepot: "2025-01-10", nombreDepots: 180 },
  { id: 4, utilisateur: "Etoa Bernard", solde: 75000, typeEpargne: "hebdomadaire", dernierDepot: "2025-01-06", nombreDepots: 30 },
  { id: 5, utilisateur: "Nkomo Grace", solde: 95000, typeEpargne: "quotidienne", dernierDepot: "2025-01-10", nombreDepots: 120 },
  { id: 6, utilisateur: "Abena Michel", solde: 30000, typeEpargne: "hebdomadaire", dernierDepot: "2024-12-30", nombreDepots: 12 },
];

export const transactions = [
  { id: 1, utilisateur: "Mballa Marie", type: "depot", montant: 5000, canal: "Orange Money", date: "2025-01-10", statut: "reussi" },
  { id: 2, utilisateur: "Nguema Paul", type: "transfert", montant: 25000, canal: "MTN Mobile Money", date: "2025-01-10", statut: "reussi" },
  { id: 3, utilisateur: "Tamba Jean", type: "remboursement", montant: 50000, canal: "Orange Money", date: "2025-01-09", statut: "reussi" },
  { id: 4, utilisateur: "Foko Sandrine", type: "retrait", montant: 10000, canal: "MTN Mobile Money", date: "2025-01-09", statut: "echoue" },
  { id: 5, utilisateur: "Etoa Bernard", type: "depot", montant: 15000, canal: "Orange Money", date: "2025-01-08", statut: "reussi" },
  { id: 6, utilisateur: "Nkomo Grace", type: "transfert", montant: 30000, canal: "MTN Mobile Money", date: "2025-01-08", statut: "en_attente" },
  { id: 7, utilisateur: "Abena Michel", type: "depot", montant: 5000, canal: "Orange Money", date: "2025-01-07", statut: "reussi" },
];

export const donneesGraphique = [
  { mois: "Août", credits: 850000, epargnes: 620000, transactions: 430000 },
  { mois: "Sep", credits: 920000, epargnes: 710000, transactions: 520000 },
  { mois: "Oct", credits: 1100000, epargnes: 830000, transactions: 610000 },
  { mois: "Nov", credits: 1350000, epargnes: 950000, transactions: 720000 },
  { mois: "Déc", credits: 1200000, epargnes: 1100000, transactions: 890000 },
  { mois: "Jan", credits: 1480000, epargnes: 1250000, transactions: 980000 },
];