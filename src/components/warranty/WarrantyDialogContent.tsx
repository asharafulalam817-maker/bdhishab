import { RefObject, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WarrantyPrintCard } from './WarrantyPrintCard';
import { Printer, Share2, MessageCircle, Mail, Copy, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

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

interface WarrantyDialogContentProps {
  warranty: WarrantyData;
  onClose: () => void;
  onPrint: () => void;
  printRef: RefObject<HTMLDivElement>;
  t: (key: string) => string;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
}

// Generate warranty duration text for sharing
const getWarrantyDurationText = (warranty: WarrantyData): string => {
  if (warranty.warrantyDuration && warranty.warrantyUnit) {
    const unitText = {
      days: 'দিন',
      months: 'মাস',
      years: 'বছর',
    }[warranty.warrantyUnit];
    return `${warranty.warrantyDuration} ${unitText}`;
  }
  
  // Calculate from dates
  const start = new Date(warranty.startDate);
  const end = new Date(warranty.expiryDate);
  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 365) {
    return `${Math.round(diffDays / 365)} বছর`;
  } else if (diffDays >= 30) {
    return `${Math.round(diffDays / 30)} মাস`;
  }
  return `${diffDays} দিন`;
};

// Generate shareable text
const generateShareText = (warranty: WarrantyData, storeName: string, storePhone?: string): string => {
  const durationText = getWarrantyDurationText(warranty);
  
  return `🛡️ *ওয়ারেন্টি কার্ড*
━━━━━━━━━━━━━━━━━

📦 *পণ্য:* ${warranty.product}
📋 *চালান নং:* ${warranty.invoiceNo}
${warranty.serialNumber ? `🔢 *সিরিয়াল:* ${warranty.serialNumber}\n` : ''}
👤 *গ্রাহক:* ${warranty.customer}
📞 *ফোন:* ${warranty.phone}

⏱️ *ওয়ারেন্টি মেয়াদ:* ${durationText}
📅 *শুরু:* ${new Date(warranty.startDate).toLocaleDateString('bn-BD')}
📅 *শেষ:* ${new Date(warranty.expiryDate).toLocaleDateString('bn-BD')}

━━━━━━━━━━━━━━━━━
🏪 *${storeName}*
${storePhone ? `📞 ${storePhone}` : ''}

_এই ওয়ারেন্টি কার্ডটি সংরক্ষণ করুন।_`;
};

// Generate plain text for email/copy
const generatePlainText = (warranty: WarrantyData, storeName: string, storePhone?: string): string => {
  const durationText = getWarrantyDurationText(warranty);
  
  return `ওয়ারেন্টি কার্ড
================

পণ্য: ${warranty.product}
চালান নং: ${warranty.invoiceNo}
${warranty.serialNumber ? `সিরিয়াল: ${warranty.serialNumber}\n` : ''}
গ্রাহক: ${warranty.customer}
ফোন: ${warranty.phone}

ওয়ারেন্টি মেয়াদ: ${durationText}
শুরু: ${new Date(warranty.startDate).toLocaleDateString('bn-BD')}
শেষ: ${new Date(warranty.expiryDate).toLocaleDateString('bn-BD')}

================
${storeName}
${storePhone ? `ফোন: ${storePhone}` : ''}

এই ওয়ারেন্টি কার্ডটি সংরক্ষণ করুন।`;
};

export function WarrantyDialogContent({
  warranty,
  onClose,
  onPrint,
  printRef,
  t,
  storeName = 'ডিজিটাল বন্ধু',
  storePhone = '০১৭১২-৩৪৫৬৭৮',
  storeAddress = '১২৩/এ, গুলশান, ঢাকা-১২১২',
}: WarrantyDialogContentProps) {
  const [copied, setCopied] = useState(false);

  const shareToWhatsApp = () => {
    const text = generateShareText(warranty, storeName, storePhone);
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    toast.success(t('warranty.sharedToWhatsApp'));
  };

  const shareToMessenger = () => {
    const text = generateShareText(warranty, storeName, storePhone);
    const encodedText = encodeURIComponent(text);
    // Facebook Messenger share link
    const messengerUrl = `fb-messenger://share?link=${encodedText}`;
    window.open(messengerUrl, '_blank');
    toast.success(t('warranty.sharedToMessenger'));
  };

  const shareToEmail = () => {
    const subject = `ওয়ারেন্টি কার্ড - ${warranty.product} (${warranty.invoiceNo})`;
    const body = generatePlainText(warranty, storeName, storePhone);
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toast.success(t('warranty.sharedToEmail'));
  };

  const copyToClipboard = async () => {
    const text = generatePlainText(warranty, storeName, storePhone);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t('warranty.copiedToClipboard'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('warranty.copyFailed'));
    }
  };

  const shareNative = async () => {
    const text = generatePlainText(warranty, storeName, storePhone);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ওয়ারেন্টি কার্ড - ${warranty.product}`,
          text: text,
        });
        toast.success(t('warranty.shared'));
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          toast.error(t('warranty.shareFailed'));
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-4">
      {/* Print Preview */}
      <div className="flex justify-center overflow-auto py-4 max-h-[60vh]" ref={printRef}>
        <WarrantyPrintCard
          warranty={warranty}
          storeName={storeName}
          storePhone={storePhone}
          storeAddress={storeAddress}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-between gap-2 pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          {/* Share Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                {t('warranty.share')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={shareToWhatsApp} className="flex items-center gap-2 cursor-pointer">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>হোয়াটসঅ্যাপ</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareToEmail} className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4 text-red-500" />
                <span>ইমেইল / জিমেইল</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareNative} className="flex items-center gap-2 cursor-pointer">
                <Send className="h-4 w-4 text-blue-500" />
                <span>অন্যান্য অ্যাপ</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 cursor-pointer">
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('warranty.close')}
          </Button>
          <Button onClick={onPrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            {t('warranty.print')}
          </Button>
        </div>
      </div>
    </div>
  );
}
