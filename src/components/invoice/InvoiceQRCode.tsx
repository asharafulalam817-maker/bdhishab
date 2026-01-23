import { QRCodeSVG } from 'qrcode.react';
import { InvoiceData } from './types';

interface InvoiceQRCodeProps {
  invoice: InvoiceData;
  size?: number;
  includeDetails?: boolean;
}

/**
 * Generates QR code data from invoice
 * The QR contains a JSON string with key invoice information
 */
export function generateQRData(invoice: InvoiceData): string {
  const qrData = {
    inv: invoice.invoiceNumber,
    date: invoice.invoiceDate,
    total: invoice.total,
    paid: invoice.paidAmount,
    due: invoice.dueAmount,
    store: invoice.store.name,
    customer: invoice.customer?.name || 'Walk-in',
    items: invoice.items.length,
  };
  
  return JSON.stringify(qrData);
}

/**
 * Generates a simple text format for the QR code
 * More readable when scanned
 */
export function generateQRText(invoice: InvoiceData): string {
  const lines = [
    `চালান: ${invoice.invoiceNumber}`,
    `তারিখ: ${invoice.invoiceDate}`,
    `দোকান: ${invoice.store.name}`,
    invoice.customer ? `গ্রাহক: ${invoice.customer.name}` : '',
    `মোট: ৳${invoice.total.toLocaleString('bn-BD')}`,
    `পরিশোধ: ৳${invoice.paidAmount.toLocaleString('bn-BD')}`,
    invoice.dueAmount > 0 ? `বাকি: ৳${invoice.dueAmount.toLocaleString('bn-BD')}` : '',
  ].filter(Boolean);
  
  return lines.join('\n');
}

export function InvoiceQRCode({ invoice, size = 80, includeDetails = false }: InvoiceQRCodeProps) {
  const qrValue = includeDetails ? generateQRText(invoice) : generateQRData(invoice);
  
  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG
        value={qrValue}
        size={size}
        level="M"
        includeMargin={false}
        bgColor="transparent"
        fgColor="currentColor"
      />
      <p className="text-[8px] mt-1 text-center opacity-70">
        স্ক্যান করুন
      </p>
    </div>
  );
}

export default InvoiceQRCode;
