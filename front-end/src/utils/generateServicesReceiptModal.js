import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateServicesReceiptPdf(element, paymentData) {
  if (!element) {
    throw new Error("Receipt element not found");
  }

  const canvas = await html2canvas(element, {
    scale: 3,

    useCORS: true,

    allowTaint: false,

    backgroundColor: "#ffffff",

    logging: false,

    imageTimeout: 15000,

    scrollX: 0,
    scrollY: 0,
  });

  const image = canvas.toDataURL("image/png", 1);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();

  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 18;

  const availableWidth = pageWidth - margin * 2;

  const availableHeight = pageHeight - margin * 2;

  const ratio = Math.min(
    availableWidth / canvas.width,
    availableHeight / canvas.height,
  );

  const width = canvas.width * ratio;

  const height = canvas.height * ratio;

  const x = (pageWidth - width) / 2;

  const y = (pageHeight - height) / 2;

  pdf.addImage(image, "PNG", x, y, width, height, undefined, "FAST");

  const orderId = paymentData?.orderId || "receipt";

  pdf.save(`UyTap_receipt_${orderId}.pdf`);
}
