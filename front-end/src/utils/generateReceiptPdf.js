import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PRIMARY = "#483DF6";

// Генерирует яркий фирменный PDF-чек UyTap
// из готового DOM-узла .receipt.
export async function generateReceiptPdf(receiptElement, paymentData) {
  if (!receiptElement) return;

  const canvas = await html2canvas(receiptElement, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#ffffff",
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
   * =========================================================
   * БЕЛЫЙ ФОН СТРАНИЦЫ
   * =========================================================
   */

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  /*
   * =========================================================
   * ЯРКИЕ ФИОЛЕТОВЫЕ КРУЖОЧКИ
   * Только #483DF6
   * =========================================================
   */

  pdf.setFillColor(72, 61, 246);

  pdf.circle(5, 12, 27, "F");

  pdf.setFillColor(72, 61, 246);

  pdf.circle(pageWidth - 2, 58, 23, "F");

  pdf.setFillColor(72, 61, 246);

  pdf.circle(pageWidth / 2, pageHeight + 10, 32, "F");

  /*
   * =========================================================
   * ЧЕК
   * =========================================================
   */

  const margin = 14;

  const availableWidth = pageWidth - margin * 2;

  const imageRatio = canvas.height / canvas.width;

  let imageWidth = availableWidth;
  let imageHeight = imageWidth * imageRatio;

  /*
   * Если чек слишком высокий для A4,
   * уменьшаем его пропорционально.
   */

  const maxHeight = pageHeight - 30;

  if (imageHeight > maxHeight) {
    imageHeight = maxHeight;
    imageWidth = imageHeight / imageRatio;
  }

  const x = (pageWidth - imageWidth) / 2;
  const y = 17;

  /*
   * =========================================================
   * БЕЛАЯ ОСНОВА ЧЕКА
   * =========================================================
   */

  pdf.setFillColor(255, 255, 255);

  pdf.roundedRect(x - 2, y - 2, imageWidth + 4, imageHeight + 4, 6, 6, "F");

  /*
   * =========================================================
   * САМ БЕЛЫЙ ЧЕК
   * =========================================================
   */

  pdf.addImage(imageData, "PNG", x, y, imageWidth, imageHeight);

  /*
   * =========================================================
   * НАСЫЩЕННАЯ ФИОЛЕТОВАЯ РАМКА
   * =========================================================
   */

  pdf.setDrawColor(72, 61, 246);
  pdf.setLineWidth(0.7);

  pdf.roundedRect(x - 2, y - 2, imageWidth + 4, imageHeight + 4, 6, 6);

  /*
   * =========================================================
   * ЯРКАЯ ВЕРХНЯЯ ПОЛОСА
   * =========================================================
   */

  pdf.setFillColor(72, 61, 246);

  pdf.roundedRect(x + 4, y + 4, imageWidth - 8, 3, 1.5, 1.5, "F");

  /*
   * =========================================================
   * ЯРКАЯ НИЖНЯЯ ПОЛОСА
   * =========================================================
   */

  pdf.setFillColor(72, 61, 246);

  pdf.roundedRect(x + 4, y + imageHeight - 7, imageWidth - 8, 3, 1.5, 1.5, "F");

  /*
   * =========================================================
   * ЯРКИЙ АКЦЕНТ ПОД ЧЕКОМ
   * =========================================================
   */

  pdf.setDrawColor(72, 61, 246);
  pdf.setLineWidth(0.8);

  pdf.line(x + 7, y + imageHeight + 6, x + imageWidth - 7, y + imageHeight + 6);

  /*
   * =========================================================
   * СОХРАНЕНИЕ
   * =========================================================
   */

  pdf.save(`uytap-receipt-${paymentData?.paymentId || "receipt"}.pdf`);
}
