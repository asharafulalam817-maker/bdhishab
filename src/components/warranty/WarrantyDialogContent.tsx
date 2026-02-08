import { RefObject, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WarrantyPrintCard } from './WarrantyPrintCard';
import { Printer, Share2, MessageCircle, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate warranty card as image
  const generateCardImage = async (): Promise<Blob | null> => {
    const cardElement = cardRef.current?.querySelector('.warranty-card-container') || cardRef.current;
    if (!cardElement) return null;

    try {
      const canvas = await html2canvas(cardElement as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  // Download as image
  const downloadAsImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      if (!blob) {
        toast.error('ইমেজ তৈরি করতে সমস্যা হয়েছে');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `warranty-${warranty.invoiceNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('ইমেজ ডাউনলোড হয়েছে');
    } catch (error) {
      toast.error('ডাউনলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsGenerating(false);
    }
  };

  // Share to WhatsApp (image)
  const shareToWhatsApp = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      if (!blob) {
        toast.error('ইমেজ তৈরি করতে সমস্যা হয়েছে');
        return;
      }

      const file = new File([blob], `warranty-${warranty.invoiceNo}.png`, { type: 'image/png' });

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `ওয়ারেন্টি কার্ড - ${warranty.product}`,
        });
        toast.success(t('warranty.shared'));
      } else {
        // Fallback: Download the image first
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `warranty-${warranty.invoiceNo}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('ইমেজ ডাউনলোড হয়েছে। এখন হোয়াটসঅ্যাপে শেয়ার করুন।');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error(t('warranty.shareFailed'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Native share (image)
  const shareNative = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      if (!blob) {
        toast.error('ইমেজ তৈরি করতে সমস্যা হয়েছে');
        return;
      }

      const file = new File([blob], `warranty-${warranty.invoiceNo}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `ওয়ারেন্টি কার্ড - ${warranty.product}`,
        });
        toast.success(t('warranty.shared'));
      } else if (navigator.share) {
        // Fallback to text share if file share not supported
        const text = `ওয়ারেন্টি কার্ড\n\nপণ্য: ${warranty.product}\nচালান: ${warranty.invoiceNo}\nগ্রাহক: ${warranty.customer}\nমেয়াদ: ${warranty.startDate} - ${warranty.expiryDate}`;
        await navigator.share({
          title: `ওয়ারেন্টি কার্ড - ${warranty.product}`,
          text: text,
        });
        toast.success(t('warranty.shared'));
      } else {
        // Fallback: Download
        downloadAsImage();
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error(t('warranty.shareFailed'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Print Preview */}
      <div className="flex justify-center overflow-auto py-4 max-h-[60vh]" ref={printRef}>
        <div ref={cardRef} className="warranty-card-container">
          <WarrantyPrintCard
            warranty={warranty}
            storeName={storeName}
            storePhone={storePhone}
            storeAddress={storeAddress}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-between gap-2 pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          {/* Share Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {t('warranty.share')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={shareToWhatsApp} className="flex items-center gap-2 cursor-pointer">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>হোয়াটসঅ্যাপ / অন্যান্য</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsImage} className="flex items-center gap-2 cursor-pointer">
                <Download className="h-4 w-4 text-blue-600" />
                <span>ইমেজ ডাউনলোড</span>
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
