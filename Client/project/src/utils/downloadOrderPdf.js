import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadOrderPdf = async (
  elementId,
  orderId
) => {
  const invoice =
    document.getElementById(elementId);

  if (!invoice) {
    console.error("Invoice not found");
    return;
  }

  try {
    const canvas = await html2canvas(
      invoice,
      {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",

        width: invoice.scrollWidth,
        height: invoice.scrollHeight,

        windowWidth: invoice.scrollWidth,
        windowHeight: invoice.scrollHeight,

        scrollX: 0,
        scrollY: 0,
      }
    );

    const imgData =
      canvas.toDataURL(
        "image/png",
        1.0
      );

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const margin = 5;

    const pdfWidth =
      pageWidth - margin * 2;

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    // Full confirmation as ONE image
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    pdf.save(
      `GenBetaCare-${orderId}.pdf`
    );

  } catch (error) {
    console.error(
      "PDF download error:",
      error
    );

    alert(
      "Could not download order."
    );
  }
};