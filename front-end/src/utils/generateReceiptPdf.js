import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Генерирует фирменный PDF-чек UyTap из готового DOM-узла (см. разметку
// .receipt в PaymentReceiptModal.jsx) и сразу скачивает файл.
// Используется и на странице оплаты (чек пользователю), и в админке
// (просмотр/скачивание чека по любому платежу).
export async function generateReceiptPdf(receiptElement, paymentData) {
  if (!receiptElement) return;

  const canvas = await html2canvas(receiptElement, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#0b0b10",
    logging: false,
  });

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  /*
   * Фиолетовый фон страницы.
   *
   * Делаем несколько полупрозрачных
   * больших кругов, чтобы создать glow.
   */
  pdf.setFillColor(7, 7, 11);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  pdf.setFillColor(91, 33, 182);
  pdf.circle(18, 20, 38, "F");

  pdf.setFillColor(76, 29, 149);
  pdf.circle(pageWidth - 5, 80, 32, "F");

  pdf.setFillColor(109, 40, 217);
  pdf.circle(pageWidth / 2, pageHeight - 5, 45, "F");

  /*
   * Сам чек.
   */
  const margin = 14;

  const availableWidth = pageWidth - margin * 2;

  const imageRatio = canvas.height / canvas.width;

  const imageHeight = availableWidth * imageRatio;

  let y = 17;

  /*
   * Белая/тёмная основа под чек.
   */
  pdf.setFillColor(17, 17, 22);

  pdf.roundedRect(
    margin - 2,
    y - 2,
    availableWidth + 4,
    Math.min(imageHeight + 4, pageHeight - 30),
    6,
    6,
    "F",
  );

  pdf.addImage(imageData, "PNG", margin, y, availableWidth, imageHeight);

  /*
   * Дополнительная декоративная рамка.
   */
  pdf.setDrawColor(139, 92, 246);
  pdf.setLineWidth(0.5);

  pdf.roundedRect(
    margin - 2,
    y - 2,
    availableWidth + 4,
    Math.min(imageHeight + 4, pageHeight - 30),
    6,
    6,
  );

  pdf.save(`uytap-receipt-${paymentData.paymentId}.pdf`);
}
