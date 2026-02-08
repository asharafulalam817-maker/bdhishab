import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const waitForFonts = async () => {
  // Ensures Bengali fonts are ready before rasterizing (prevents layout shifts/garbled text)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fonts = (document as any).fonts as FontFaceSet | undefined;
  if (fonts?.ready) {
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  }
};

export async function renderWarrantyCardPdfBlob(
  element: HTMLElement,
  options?: { scale?: number; marginMm?: number }
): Promise<Blob> {
  await waitForFonts();

  const scale = options?.scale ?? 2;
  const margin = options?.marginMm ?? 10;

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

  const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;

  // Fit image within page keeping aspect ratio
  let imgW = maxW;
  let imgH = (canvas.height * imgW) / canvas.width;

  if (imgH > maxH) {
    imgH = maxH;
    imgW = (canvas.width * imgH) / canvas.height;
  }

  const x = (pageWidth - imgW) / 2;
  const y = (pageHeight - imgH) / 2;

  const imgData = canvas.toDataURL('image/png', 1.0);
  // FAST keeps file size reasonable on mobile
  pdf.addImage(imgData, 'PNG', x, y, imgW, imgH, undefined, 'FAST');

  return pdf.output('blob');
}

