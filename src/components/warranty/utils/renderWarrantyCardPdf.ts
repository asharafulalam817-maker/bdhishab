import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function renderWarrantyCardPdfBlob(
  element: HTMLElement,
  options?: { scale?: number }
): Promise<Blob> {
  const scale = options?.scale ?? 2;

  // Render to canvas with white background
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

  // Get image dimensions in mm for A6-ish card (105×148mm portrait)
  const imgWidth = 105; // mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF with custom size matching image aspect ratio
  const pdf = new jsPDF({
    orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [imgWidth, imgHeight],
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  return pdf.output('blob');
}
