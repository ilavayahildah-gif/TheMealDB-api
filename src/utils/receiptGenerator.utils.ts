import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReceipt = (order: any, user: any) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../../receipts/receipt-${order.id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("MYDAWA MEAL RECEIPT", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Receipt ID: ${order.id}`);
  doc.text(`User: ${user.name} (${user.email})`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.text("Order Details:");
  order.items.forEach((item: any) => {
    doc.text(`- ${item.name}: ${item.price} KES`);
  });

  doc.moveDown();
  doc.text(`Total: ${order.total} KES`, { align: "right" });
  doc.end();

  return filePath;
};
