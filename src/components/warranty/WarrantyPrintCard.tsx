import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateBn } from '@/lib/constants';
import { ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';

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
  warrantyDuration?: number;
  warrantyUnit?: 'days' | 'months' | 'years';
}

interface WarrantyPrintCardProps {
  warranty: WarrantyData;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
  storeLogo?: string;
}

// Calculate warranty duration text
const getWarrantyDurationText = (duration?: number, unit?: string): string => {
  if (!duration || !unit) {
    // Try to calculate from dates
    return '';
  }
  
  const unitText = {
    days: duration === 1 ? 'দিন' : 'দিন',
    months: duration === 1 ? 'মাস' : 'মাস',
    years: duration === 1 ? 'বছর' : 'বছর',
  }[unit] || 'মাস';
  
  // Convert to Bengali numerals
  const bnNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const bnDuration = String(duration).split('').map(d => bnNumbers[parseInt(d)] || d).join('');
  
  return `${bnDuration} ${unitText}`;
};

// Calculate warranty duration from dates if not provided
const calculateDurationFromDates = (startDate: string, expiryDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(expiryDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const bnNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  if (diffDays >= 365) {
    const years = Math.round(diffDays / 365);
    const bnYears = String(years).split('').map(d => bnNumbers[parseInt(d)] || d).join('');
    return `${bnYears} বছর`;
  } else if (diffDays >= 30) {
    const months = Math.round(diffDays / 30);
    const bnMonths = String(months).split('').map(d => bnNumbers[parseInt(d)] || d).join('');
    return `${bnMonths} মাস`;
  } else {
    const bnDays = String(diffDays).split('').map(d => bnNumbers[parseInt(d)] || d).join('');
    return `${bnDays} দিন`;
  }
};

export const WarrantyPrintCard = forwardRef<HTMLDivElement, WarrantyPrintCardProps>(
  ({ warranty, storeName = 'ডিজিটাল বন্ধু', storePhone, storeAddress, storeLogo }, ref) => {
    const warrantyDurationText = warranty.warrantyDuration && warranty.warrantyUnit 
      ? getWarrantyDurationText(warranty.warrantyDuration, warranty.warrantyUnit)
      : calculateDurationFromDates(warranty.startDate, warranty.expiryDate);

    const generateQRText = () => {
      const lines = [
        `🛡️ ওয়ারেন্টি কার্ড`,
        `━━━━━━━━━━━━━━━`,
        `📋 চালান: ${warranty.invoiceNo}`,
        `📦 পণ্য: ${warranty.product}`,
        `👤 গ্রাহক: ${warranty.customer}`,
        `📞 ফোন: ${warranty.phone}`,
        warranty.serialNumber ? `🔢 সিরিয়াল: ${warranty.serialNumber}` : '',
        `⏱️ মেয়াদ: ${warrantyDurationText}`,
        `📅 শুরু: ${warranty.startDate}`,
        `📅 শেষ: ${warranty.expiryDate}`,
        `━━━━━━━━━━━━━━━`,
        `🏪 ${storeName}`,
        storePhone ? `📞 ${storePhone}` : '',
      ].filter(Boolean);
      
      return lines.join('\n');
    };

    return (
      <div
        ref={ref}
        className="w-full max-w-[420px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl overflow-hidden shadow-lg print:shadow-none"
        style={{ fontFamily: "'Hind Siliguri', system-ui, sans-serif" }}
      >
        {/* Top Decorative Border */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
        
        {/* Header with Store Info */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white p-1 flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold tracking-wide truncate">{storeName}</h1>
                {storePhone && (
                  <p className="text-emerald-100 text-xs sm:text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{storePhone}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">অফিসিয়াল</span>
            </div>
          </div>
          {storeAddress && (
            <p className="text-emerald-100 text-[10px] sm:text-xs mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{storeAddress}</span>
            </p>
          )}
        </div>

        {/* Warranty Badge */}
        <div className="flex justify-center -mt-3 sm:-mt-4 relative z-10">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold text-sm sm:text-lg">ওয়ারেন্টি কার্ড</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 sm:p-5">
          {/* Warranty Duration Highlight */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-center shadow-md">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">ওয়ারেন্টি মেয়াদ</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-wide">
              {warrantyDurationText}
            </div>
          </div>

          {/* Product & Customer Info with QR */}
          <div className="flex gap-2 sm:gap-4">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="bg-white p-1.5 sm:p-2.5 rounded-xl shadow-sm border-2 border-emerald-200">
                <QRCodeSVG
                  value={generateQRText()}
                  size={70}
                  level="M"
                  includeMargin={false}
                  fgColor="#047857"
                  className="sm:hidden"
                />
                <QRCodeSVG
                  value={generateQRText()}
                  size={90}
                  level="M"
                  includeMargin={false}
                  fgColor="#047857"
                  className="hidden sm:block"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-center text-emerald-600 mt-1 sm:mt-1.5 font-medium">
                স্ক্যান করুন
              </p>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-emerald-100">
                <div className="grid grid-cols-[55px,1fr] sm:grid-cols-[70px,1fr] gap-y-1 sm:gap-y-1.5 text-xs sm:text-sm">
                  <span className="text-emerald-600 font-medium">চালান:</span>
                  <span className="font-bold text-gray-800 truncate">{warranty.invoiceNo}</span>
                  
                  <span className="text-emerald-600 font-medium">পণ্য:</span>
                  <span className="font-semibold text-gray-800 truncate">{warranty.product}</span>
                  
                  <span className="text-emerald-600 font-medium">গ্রাহক:</span>
                  <span className="font-medium text-gray-700 truncate">{warranty.customer}</span>
                  
                  <span className="text-emerald-600 font-medium">ফোন:</span>
                  <span className="font-medium text-gray-700 truncate">{warranty.phone}</span>
                  
                  {warranty.serialNumber && (
                    <>
                      <span className="text-emerald-600 font-medium">সিরিয়াল:</span>
                      <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded truncate">{warranty.serialNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warranty Period Timeline */}
          <div className="mt-3 sm:mt-4 bg-white rounded-xl p-2.5 sm:p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between gap-1">
              <div className="text-center flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-1 sm:mb-2">
                  <span className="text-emerald-600 text-sm sm:text-lg">📅</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">শুরু</p>
                <p className="font-bold text-[10px] sm:text-sm text-gray-800">{formatDateBn(warranty.startDate)}</p>
              </div>
              
              <div className="flex-shrink-0 w-8 sm:w-12 flex items-center justify-center">
                <div className="w-full h-0.5 sm:h-1 bg-gradient-to-r from-emerald-400 to-red-400 rounded-full relative">
                  <div className="absolute -top-1.5 sm:-top-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-sm sm:text-xl">→</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-1 sm:mb-2">
                  <span className="text-red-600 text-sm sm:text-lg">⏰</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">শেষ</p>
                <p className="font-bold text-[10px] sm:text-sm text-red-600">{formatDateBn(warranty.expiryDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 sm:px-5 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">অফিসিয়াল ওয়ারেন্টি</span>
            </div>
            <div className="text-[10px] sm:text-xs text-emerald-100">
              কার্ডটি সংরক্ষণ করুন
            </div>
          </div>
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-1 sm:h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
      </div>
    );
  }
);

WarrantyPrintCard.displayName = 'WarrantyPrintCard';
