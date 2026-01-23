import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateBn } from '@/lib/constants';

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

interface WarrantyPrintCardProps {
  warranty: WarrantyData;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
}

export const WarrantyPrintCard = forwardRef<HTMLDivElement, WarrantyPrintCardProps>(
  ({ warranty, storeName = 'ডিজিটাল বন্ধু', storePhone, storeAddress }, ref) => {
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
      ].filter(Boolean);
      
      return lines.join('\n');
    };

    return (
      <div
        ref={ref}
        className="w-[400px] bg-white p-6 border-2 border-dashed border-gray-300 rounded-lg print:border-solid"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-200 pb-4 mb-4">
          <h1 className="text-xl font-bold text-gray-800">{storeName}</h1>
          {storePhone && <p className="text-sm text-gray-600">{storePhone}</p>}
          {storeAddress && <p className="text-xs text-gray-500">{storeAddress}</p>}
          <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            ওয়ারেন্টি কার্ড
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="bg-white p-2 border rounded">
              <QRCodeSVG
                value={generateQRText()}
                size={80}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-[9px] text-center text-gray-500 mt-1">স্ক্যান করুন</p>
          </div>

          {/* Details */}
          <div className="flex-1 text-sm space-y-1">
            <div className="grid grid-cols-[auto,1fr] gap-x-2">
              <span className="text-gray-500">চালান:</span>
              <span className="font-medium">{warranty.invoiceNo}</span>
              
              <span className="text-gray-500">পণ্য:</span>
              <span className="font-medium">{warranty.product}</span>
              
              <span className="text-gray-500">গ্রাহক:</span>
              <span className="font-medium">{warranty.customer}</span>
              
              <span className="text-gray-500">ফোন:</span>
              <span className="font-medium">{warranty.phone}</span>
              
              {warranty.serialNumber && (
                <>
                  <span className="text-gray-500">সিরিয়াল:</span>
                  <span className="font-mono text-xs">{warranty.serialNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Warranty Period */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3 border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">ওয়ারেন্টি শুরু</p>
              <p className="font-semibold text-sm">{formatDateBn(warranty.startDate)}</p>
            </div>
            <div className="text-2xl text-gray-300">→</div>
            <div className="text-right">
              <p className="text-xs text-gray-500">মেয়াদ শেষ</p>
              <p className="font-semibold text-sm text-red-600">{formatDateBn(warranty.expiryDate)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            ওয়ারেন্টি সংক্রান্ত সমস্যার জন্য এই কার্ডটি সংরক্ষণ করুন
          </p>
        </div>
      </div>
    );
  }
);

WarrantyPrintCard.displayName = 'WarrantyPrintCard';
