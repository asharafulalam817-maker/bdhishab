import { useRef, useState } from 'react';
import { Download, Printer, Share2, X, FileText, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceData, InvoiceTemplate } from '../invoice/types';
import InvoiceRenderer from '../invoice/InvoiceRenderer';
import ThermalTemplate from '../invoice/templates/ThermalTemplate';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Props {
  invoice: InvoiceData | null;
  template: InvoiceTemplate;
  open: boolean;
  onClose: () => void;
}

export default function POSInvoiceDialog({ invoice, template, open, onClose }: Props) {
  const a4PrintRef = useRef<HTMLDivElement>(null);
  const thermalPrintRef = useRef<HTMLDivElement>(null);
  const [thermalWidth, setThermalWidth] = useState<'58mm' | '80mm'>('80mm');
  const [printType, setPrintType] = useState<'a4' | 'thermal'>('thermal');

  if (!invoice) return null;

  const handlePrint = (type: 'a4' | 'thermal') => {
    const printContent = type === 'a4' ? a4PrintRef.current : thermalPrintRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('পপআপ ব্লক করা হয়েছে। অনুগ্রহ করে পপআপ অনুমতি দিন।');
      return;
    }

    const styles = type === 'thermal' 
      ? `
        body { 
          margin: 0; 
          padding: 0;
          font-family: 'Courier New', monospace;
        }
        @page { 
          margin: 0; 
          size: ${thermalWidth} auto;
        }
        @media print {
          body { 
            width: ${thermalWidth};
          }
        }
      `
      : `
        @media print {
          body { margin: 0; padding: 0; }
          @page { margin: 10mm; }
        }
        body { font-family: 'Noto Sans Bengali', sans-serif; }
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>চালান - ${invoice.invoiceNumber}</title>
          <style>${styles}</style>
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
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 overflow-auto p-4">
              <Tabs value={printType} onValueChange={(v) => setPrintType(v as 'a4' | 'thermal')}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="thermal" className="gap-2">
                      <Receipt className="h-4 w-4" />
                      থার্মাল প্রিন্ট
                    </TabsTrigger>
                    <TabsTrigger value="a4" className="gap-2">
                      <FileText className="h-4 w-4" />
                      A4 প্রিন্ট
                    </TabsTrigger>
                  </TabsList>

                  {printType === 'thermal' && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={thermalWidth === '58mm' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setThermalWidth('58mm')}
                      >
                        58mm
                      </Button>
                      <Button 
                        variant={thermalWidth === '80mm' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setThermalWidth('80mm')}
                      >
                        80mm
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="thermal" className="mt-0">
                  <div className="flex flex-col items-center">
                    <div 
                      ref={thermalPrintRef} 
                      className="shadow-lg border bg-white"
                      style={{ width: thermalWidth === '58mm' ? '58mm' : '80mm' }}
                    >
                      <ThermalTemplate invoice={invoice} width={thermalWidth} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="a4" className="mt-0">
                  <div ref={a4PrintRef} className="shadow-lg bg-white mx-auto max-w-[210mm]">
                    <InvoiceRenderer invoice={invoice} template={template} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer with Print Button */}
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                বন্ধ করুন
              </Button>
              <Button onClick={() => handlePrint(printType)} className="gap-2">
                <Printer className="h-4 w-4" />
                {printType === 'thermal' ? 'থার্মাল প্রিন্ট' : 'A4 প্রিন্ট'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
