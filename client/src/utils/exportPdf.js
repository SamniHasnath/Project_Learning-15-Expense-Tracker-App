import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTransactionsPdf(transactions, { title = "Transaction Report" } = {}) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 24);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  doc.text(
    `Total Income: $${totalIncome.toLocaleString()}    Total Expense: $${totalExpense.toLocaleString()}    Balance: $${(
      totalIncome - totalExpense
    ).toLocaleString()}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 36,
    head: [["Date", "Type", "Title", "Category", "Amount ($)"]],
    body: transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.title,
      t.category,
      Number(t.amount).toLocaleString(),
    ]),
  });

  doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
}
