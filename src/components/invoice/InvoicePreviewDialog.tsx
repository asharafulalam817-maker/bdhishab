import { useRef } from 'react';
import { Download, Printer, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceData, InvoiceTemplate } from './types';
import InvoiceRenderer from './InvoiceRenderer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  invoice: InvoiceData | null;
  template: InvoiceTemplate;
  open: boolean;
  onClose: () => void;
}

export default function InvoicePreviewDialog({ invoice, template, open, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('পপআপ ব্লক করা হয়েছে। অনুগ্রহ করে পপআপ অনুমতি দিন।');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>চালান - ${invoice.invoiceNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { margin: 10mm; }
            }
            body { font-family: 'Noto Sans Bengali', sans-serif; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = async () => {
    // For now, use print-to-PDF approach
    handlePrint();
    toast.info('প্রিন্ট ডায়ালগ থেকে "Save as PDF" সিলেক্ট করুন');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `চালান - ${invoice.invoiceNumber}`,
          text: `${invoice.store.name} থেকে চালান\nমোট: ৳${invoice.total}`,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy invoice URL or details
      const text = `চালান নং: ${invoice.invoiceNumber}\nস্টোর: ${invoice.store.name}\nমোট: ৳${invoice.total}`;
      await navigator.clipboard.writeText(text);
      toast.success('চালান তথ্য কপি হয়েছে');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">চালান - {invoice.invoiceNumber}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  শেয়ার
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  ডাউনলোড
                </Button>
                <Button size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  প্রিন্ট
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="flex-1 overflow-auto p-4 bg-muted/30">
              <div ref={printRef} className="shadow-lg">
                <InvoiceRenderer invoice={invoice} template={template} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
