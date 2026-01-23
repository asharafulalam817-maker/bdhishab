import { QRCodeSVG } from 'qrcode.react';

interface WarrantyData {
  id: string;
  invoiceNo: string;
  product: string;
  customer: string;
  phone: string;
  startDate: string;
  expiryDate: string;
  serialNumber?: string;
  status: string;
}

interface WarrantyQRCodeProps {
  warranty: WarrantyData;
  size?: number;
  showLabel?: boolean;
}

export function WarrantyQRCode({ warranty, size = 80, showLabel = true }: WarrantyQRCodeProps) {
  // Generate QR data with warranty information
  const generateQRData = () => {
    const data = {
      type: 'warranty',
      id: warranty.id,
      invoice: warranty.invoiceNo,
      product: warranty.product,
      customer: warranty.customer,
      phone: warranty.phone,
      serial: warranty.serialNumber,
      start: warranty.startDate,
      expiry: warranty.expiryDate,
      status: warranty.status,
    };
    return JSON.stringify(data);
  };

  // Generate human-readable text for the QR code
  const generateQRText = () => {
    const lines = [
      `ওয়ারেন্টি কার্ড`,
      `চালান: ${warranty.invoiceNo}`,
      `পণ্য: ${warranty.product}`,
      `গ্রাহক: ${warranty.customer}`,
      `ফোন: ${warranty.phone}`,
      warranty.serialNumber ? `সিরিয়াল: ${warranty.serialNumber}` : '',
      `শুরু: ${warranty.startDate}`,
      `মেয়াদ: ${warranty.expiryDate}`,
      `স্ট্যাটাস: ${warranty.status === 'active' ? 'সক্রিয়' : warranty.status === 'expiring' ? 'মেয়াদ শেষ হচ্ছে' : 'মেয়াদ উত্তীর্ণ'}`,
    ].filter(Boolean);
    
    return lines.join('\n');
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-white p-2 rounded-lg shadow-sm border">
        <QRCodeSVG
          value={generateQRText()}
          size={size}
          level="M"
          includeMargin={false}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-muted-foreground text-center">
          স্ক্যান করুন
        </span>
      )}
    </div>
  );
}
