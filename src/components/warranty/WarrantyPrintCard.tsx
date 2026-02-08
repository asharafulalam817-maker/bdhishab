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
  if (!duration || !unit) return '';
  
  const unitText = {
    days: duration === 1 ? 'দিন' : 'দিন',
    months: duration === 1 ? 'মাস' : 'মাস',
    years: duration === 1 ? 'বছর' : 'বছর',
  }[unit] || 'মাস';
  
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
      return `ওয়ারেন্টি: ${warranty.invoiceNo}\nপণ্য: ${warranty.product}\nগ্রাহক: ${warranty.customer}\nমেয়াদ: ${warranty.startDate} - ${warranty.expiryDate}`;
    };

    return (
      <div
        ref={ref}
        className="w-full max-w-[400px] mx-auto print:max-w-none print:w-[400px]"
        style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
      >
        {/* Main Card Container */}
        <div data-warranty-card className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-md print:shadow-none print:border-2">
          
          {/* Header - Store Info with Bengali Pattern Border */}
          <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white relative">
            {/* Decorative top pattern */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600" />
            
            <div className="px-3 sm:px-4 py-3 sm:py-4 pt-4 sm:pt-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold truncate">{storeName}</h1>
                  {storePhone && (
                    <p className="text-green-100 text-xs sm:text-sm">📞 {storePhone}</p>
                  )}
                  {storeAddress && (
                    <p className="text-green-100 text-[10px] sm:text-xs truncate">📍 {storeAddress}</p>
                  )}
                </div>
                {/* Store Logo or Official Seal */}
                {storeLogo ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-400 bg-white flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden p-1">
                    <img 
                      src={storeLogo} 
                      alt="Store logo" 
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-yellow-400 bg-green-800 flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-yellow-400 text-[8px] sm:text-[9px] font-bold">অফিসিয়াল</span>
                    <span className="text-white text-[7px] sm:text-[8px]">ওয়ারেন্টি</span>
                    <span className="text-yellow-400 text-[6px] sm:text-[7px]">✓ সার্টিফাইড</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 py-2 sm:py-2.5 text-center border-y-2 border-yellow-600">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🛡️</span>
              ওয়ারেন্টি সনদপত্র
              <span className="text-xl sm:text-2xl">🛡️</span>
            </h2>
          </div>

          {/* Warranty Duration Highlight */}
          <div className="bg-green-50 border-b-2 border-dashed border-green-300 px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-green-700 font-medium mb-0.5">ওয়ারেন্টি মেয়াদ</p>
                <div className="bg-green-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                  <span className="text-xl sm:text-2xl font-bold">{warrantyDurationText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="p-3 sm:p-4 bg-gray-50">
            <div className="flex gap-3 sm:gap-4">
              {/* Left - QR Code */}
              <div className="flex-shrink-0">
                <div className="bg-white p-1.5 sm:p-2 border-2 border-gray-300 rounded">
                  <QRCodeSVG
                    value={generateQRText()}
                    size={65}
                    level="M"
                    includeMargin={false}
                    className="sm:hidden"
                  />
                  <QRCodeSVG
                    value={generateQRText()}
                    size={80}
                    level="M"
                    includeMargin={false}
                    className="hidden sm:block"
                  />
                </div>
                <p className="text-[8px] sm:text-[9px] text-center text-gray-500 mt-1">QR স্ক্যান করুন</p>
              </div>

              {/* Right - Details Table */}
              <div className="flex-1 min-w-0">
                <table className="w-full text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-1 sm:py-1.5 text-gray-600 font-medium whitespace-nowrap pr-2">চালান নং:</td>
                      <td className="py-1 sm:py-1.5 font-bold text-gray-900 truncate">{warranty.invoiceNo}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-1 sm:py-1.5 text-gray-600 font-medium whitespace-nowrap pr-2">পণ্যের নাম:</td>
                      <td className="py-1 sm:py-1.5 font-semibold text-gray-800 truncate">{warranty.product}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-1 sm:py-1.5 text-gray-600 font-medium whitespace-nowrap pr-2">ক্রেতার নাম:</td>
                      <td className="py-1 sm:py-1.5 text-gray-800 truncate">{warranty.customer}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-1 sm:py-1.5 text-gray-600 font-medium whitespace-nowrap pr-2">মোবাইল:</td>
                      <td className="py-1 sm:py-1.5 text-gray-800">{warranty.phone}</td>
                    </tr>
                    {warranty.serialNumber && (
                      <tr className="border-b border-gray-200">
                        <td className="py-1 sm:py-1.5 text-gray-600 font-medium whitespace-nowrap pr-2">সিরিয়াল:</td>
                        <td className="py-1 sm:py-1.5 font-mono text-[10px] sm:text-xs text-gray-700 truncate">{warranty.serialNumber}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Warranty Period Box */}
          <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 border-2 border-gray-300 rounded bg-white">
            <div className="grid grid-cols-2 divide-x-2 divide-gray-300">
              <div className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">ওয়ারেন্টি শুরু</p>
                <p className="text-xs sm:text-sm font-bold text-green-700">{formatDateBn(warranty.startDate)}</p>
              </div>
              <div className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">ওয়ারেন্টি শেষ</p>
                <p className="text-xs sm:text-sm font-bold text-red-600">{formatDateBn(warranty.expiryDate)}</p>
              </div>
            </div>
          </div>

          {/* Terms Section */}
          <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 bg-yellow-50 border border-yellow-200 rounded p-2 sm:p-2.5">
            <p className="text-[9px] sm:text-[10px] text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">শর্তাবলী:</span> এই ওয়ারেন্টি শুধুমাত্র প্রস্তুতকারীর ত্রুটির জন্য প্রযোজ্য। 
              ভুল ব্যবহার, দুর্ঘটনা বা প্রাকৃতিক দুর্যোগের কারণে ক্ষতি এই ওয়ারেন্টির আওতায় পড়বে না। 
              সার্ভিসের জন্য অবশ্যই এই কার্ড ও ক্রয় রসিদ সাথে আনতে হবে।
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between text-[9px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span>
                <span>অফিসিয়াল ওয়ারেন্টি</span>
              </div>
              <div className="text-gray-400">
                এই কার্ডটি সংরক্ষণ করুন
              </div>
            </div>
          </div>

          {/* Bottom Decorative Border */}
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-red-600 via-green-600 to-red-600" />
        </div>
      </div>
    );
  }
);

WarrantyPrintCard.displayName = 'WarrantyPrintCard';
