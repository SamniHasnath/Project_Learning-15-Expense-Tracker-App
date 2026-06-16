import * as XLSX from "xlsx";

export function exportTransactionsExcel(transactions, { fileName = "transaction_report" } = {}) {
  const rows = transactions.map((t) => ({
    Date: new Date(t.date).toLocaleDateString(),
    Type: t.type,
    Title: t.title,
    Category: t.category,
    "Amount ($)": Number(t.amount),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
