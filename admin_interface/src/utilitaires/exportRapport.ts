import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  credits,
  epargnes,
  transactions,
  statistiquesGenerales,
} from "../donnees/donneesFictives";
import { Credit, Epargne, Transaction } from "../types/donnees.types";

// ============================================
// TYPES
// ============================================

interface Statistiques {
  totalUtilisateurs: number;
  creditsActifs: number;
  epargnesActives: number;
  transactionsAujourdhui: number;
  revenusTotal: number;
  tauxRemboursement: number;
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Formate un montant en FCFA avec séparateur d'espaces
 * Exemple: 200000 -> "200 000 FCFA"
 */
const formaterMontant = (montant: number): string => {
  const partieNombre = new Intl.NumberFormat("fr-FR").format(montant);
  return `${partieNombre} FCFA`;
};

const date = new Date().toLocaleDateString("fr-FR");

// ============================================
// EXPORT PDF
// ============================================

export const exporterPDF = (): void => {
  const doc = new jsPDF();
  const largeur = doc.internal.pageSize.getWidth();

  // En-tête
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, largeur, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MicroFinance Cameroun — Rapport Général", largeur / 2, 13, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Généré le : ${date}`, largeur / 2, 22, { align: "center" });

  let positionY = 40;

  // Section Chiffres Clés
  doc.setTextColor(29, 78, 216);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("1. Chiffres Clés", 14, positionY);
  positionY += 6;

  autoTable(doc, {
    startY: positionY,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Total Utilisateurs", statistiquesGenerales.totalUtilisateurs],
      ["Crédits Actifs", statistiquesGenerales.creditsActifs],
      ["Épargnes Actives", statistiquesGenerales.epargnesActives],
      ["Transactions Aujourd'hui", statistiquesGenerales.transactionsAujourdhui],
      ["Revenus Total", formaterMontant(statistiquesGenerales.revenusTotal)],
      ["Taux de Remboursement", `${statistiquesGenerales.tauxRemboursement}%`],
    ],
    headStyles: { fillColor: [29, 78, 216], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 245, 255] },
    styles: { fontSize: 10 },
  });

  positionY = (doc as any).lastAutoTable.finalY + 12;

  // Section Crédits
  doc.setTextColor(29, 78, 216);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("2. Crédits", 14, positionY);
  positionY += 6;

  autoTable(doc, {
    startY: positionY,
    head: [["Commerçant", "Montant", "Remboursé", "Taux", "Échéance", "Statut"]],
    body: credits.map((c: Credit) => [
      c.utilisateur,
      formaterMontant(c.montant),
      formaterMontant(c.remboursement || 0),
      `${c.taux}%`,
      c.dateEcheance ?? "N/A",
      c.statut.replace("_", " "),
    ]),
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 255, 248] },
    styles: { fontSize: 9 },
  });

  positionY = (doc as any).lastAutoTable.finalY + 12;

  // Section Épargnes
  doc.setTextColor(29, 78, 216);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("3. Épargnes", 14, positionY);
  positionY += 6;

  autoTable(doc, {
    startY: positionY,
    head: [["Commerçant", "Solde", "Type", "Nb. Dépôts", "Dernier Dépôt"]],
    body: epargnes.map((e: Epargne) => [
      e.utilisateur,
      formaterMontant(e.solde),
      e.typeEpargne === "quotidienne" ? "Quotidienne" : "Hebdomadaire",
      e.nombreDepots,
      e.dernierDepot,
    ]),
    headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [255, 251, 235] },
    styles: { fontSize: 9 },
  });

  positionY = (doc as any).lastAutoTable.finalY + 12;

  // Section Transactions
  if (positionY > 220) {
    doc.addPage();
    positionY = 20;
  }

  doc.setTextColor(29, 78, 216);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("4. Transactions", 14, positionY);
  positionY += 6;

  autoTable(doc, {
    startY: positionY,
    head: [["Commerçant", "Type", "Montant", "Canal", "Date", "Statut"]],
    body: transactions.map((t: Transaction) => [
      t.utilisateur,
      t.type,
      formaterMontant(t.montant),
      t.canal,
      t.date,
      t.statut.replace("_", " "),
    ]),
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    styles: { fontSize: 9 },
  });

  // Numéros de page - Version compatible
  try {
    // Essayer getNumberOfPages (méthode standard)
    const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} / ${totalPages} — MicroFinance Cameroun © ${new Date().getFullYear()}`,
        largeur / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    }
  } catch {
    // Fallback: ajouter simplement le pied de page sur la page courante
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `MicroFinance Cameroun © ${new Date().getFullYear()}`,
      largeur / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  doc.save(`rapport-microfinance-${date.replace(/\//g, "-")}.pdf`);
};

// ============================================
// UTILITAIRES HTML→EXCEL
// ============================================

const couleurStatut = (statut: string): string => {
  const s = statut?.toLowerCase();
  if (s?.includes("cours") || s?.includes("reussi"))
    return "background:#DCFCE7;color:#15803D;font-weight:bold";
  if (s?.includes("retard") || s?.includes("echoue") || s?.includes("rejet"))
    return "background:#FEE2E2;color:#DC2626;font-weight:bold";
  if (s?.includes("attente"))
    return "background:#FEF9C3;color:#92400E;font-weight:bold";
  if (s?.includes("rembourse"))
    return "background:#DBEAFE;color:#1D4ED8;font-weight:bold";
  return "background:#F3F4F6;color:#374151";
};

interface CreerTableHTMLParams {
  titre: string;
  couleur: string;
  colonnes: string[];
  lignes: (string | number)[][];
  colonnesMontant?: number[];
  colonnesStatut?: number[];
}

const creerTableHTML = ({
  titre,
  couleur,
  colonnes,
  lignes,
  colonnesMontant = [],
  colonnesStatut = [],
}: CreerTableHTMLParams): string => {
  const entetes = colonnes
    .map((col) => `<th style="background:${couleur};color:#fff;font-weight:bold;padding:8px 12px;border:1px solid #ccc;font-size:12px;">${col}</th>`)
    .join("");

  const rows = lignes
    .map((ligne, i) => {
      const bg = i % 2 === 0 ? "#F0FDF4" : "#FFFFFF";
      const cells = ligne
        .map((val, c) => {
          if (colonnesStatut.includes(c)) {
            return `<td style="${couleurStatut(String(val))};padding:6px 10px;border:1px solid #e5e7eb;text-align:center;font-size:11px;">${val}<\/td>`;
          }
          if (colonnesMontant.includes(c)) {
            const montant = typeof val === "number" ? formaterMontant(val) : val;
            return `<td style="background:${bg};color:#15803D;font-weight:bold;padding:6px 10px;border:1px solid #e5e7eb;text-align:right;font-size:11px;">${montant}<\/td>`;
          }
          return `<td style="background:${bg};padding:6px 10px;border:1px solid #e5e7eb;font-size:11px;">${val}<\/td>`;
        })
        .join("");
      return `<tr>${cells}<\/tr>`;
    })
    .join("");

  return `
    <tr><td colspan="${colonnes.length}" style="background:${couleur};color:#fff;font-size:15px;font-weight:bold;padding:12px;text-align:center;border:2px solid ${couleur};">${titre}<\/td><\/tr>
    <tr><td colspan="${colonnes.length}" style="background:#F9FAFB;color:#6B7280;font-style:italic;font-size:10px;padding:5px;text-align:center;border:1px solid #e5e7eb;">Généré le ${date} — MicroFinance Cameroun<\/td><\/tr>
    <tr>${entetes}<\/tr>
    ${rows}
    <tr><td colspan="${colonnes.length}" style="padding:16px;border:none;"><\/td><\/tr>
  `;
};

export const exporterCSV = (
  transactionsData?: Transaction[],
  creditsData?: Credit[],
  epargnesData?: Epargne[]
): void => {
  const dataTransactions = transactionsData || transactions;
  const dataCredits = creditsData || credits;
  const dataEpargnes = epargnesData || epargnes;

  // Section Chiffres Clés
  const statsHTML = creerTableHTML({
    titre: "📊 CHIFFRES CLÉS",
    couleur: "#052E16",
    colonnes: ["Indicateur", "Valeur"],
    lignes: [
      ["Total Utilisateurs", statistiquesGenerales.totalUtilisateurs],
      ["Crédits Actifs", statistiquesGenerales.creditsActifs],
      ["Épargnes Actives", statistiquesGenerales.epargnesActives],
      ["Transactions Aujourd'hui", statistiquesGenerales.transactionsAujourdhui],
      ["Revenus Total (FCFA)", formaterMontant(statistiquesGenerales.revenusTotal)],
      ["Taux de Remboursement", `${statistiquesGenerales.tauxRemboursement}%`],
    ],
    colonnesMontant: [1],
  });

  // Section Crédits
  const creditsHTML = creerTableHTML({
    titre: "💳 CRÉDITS",
    couleur: "#15803D",
    colonnes: ["Commerçant", "Montant (FCFA)", "Remboursé (FCFA)", "Taux (%)", "Échéance", "Statut"],
    lignes: dataCredits.map((c: Credit) => [
      c.utilisateur,
      c.montant,
      c.remboursement || 0,
      `${c.taux}%`,
      c.dateEcheance ?? "N/A",
      c.statut.replace(/_/g, " "),
    ]),
    colonnesMontant: [1, 2],
    colonnesStatut: [5],
  });

  // Section Épargnes
  const epargnesHTML = creerTableHTML({
    titre: "🏦 ÉPARGNES",
    couleur: "#B45309",
    colonnes: ["Commerçant", "Solde (FCFA)", "Type Épargne", "Nb. Dépôts", "Dernier Dépôt"],
    lignes: dataEpargnes.map((e: Epargne) => [
      e.utilisateur,
      e.solde,
      e.typeEpargne === "quotidienne" ? "Quotidienne" : "Hebdomadaire",
      e.nombreDepots,
      e.dernierDepot,
    ]),
    colonnesMontant: [1],
  });

  // Section Transactions
  const transactionsHTML = creerTableHTML({
    titre: "💸 TRANSACTIONS",
    couleur: "#0E7490",
    colonnes: ["Commerçant", "Type", "Montant (FCFA)", "Canal", "Date", "Statut"],
    lignes: dataTransactions.map((t: Transaction) => [
      t.utilisateur,
      t.type,
      t.montant,
      t.canal,
      t.date,
      t.statut.replace(/_/g, " "),
    ]),
    colonnesMontant: [2],
    colonnesStatut: [5],
  });

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Rapport Complet</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; width: 100%; }
        th, td { border: 1px solid #ccc; }
      </style>
    </head>
    <body>
        <table>
        ${statsHTML}
        ${creditsHTML}
        ${epargnesHTML}
        ${transactionsHTML}
        </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `rapport-microfinance-${date.replace(/\//g, "-")}.xls`;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
  URL.revokeObjectURL(url);
};