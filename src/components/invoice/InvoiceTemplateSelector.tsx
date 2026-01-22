import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvoiceTemplate, invoiceTemplates, InvoiceData } from './types';
import InvoiceRenderer from './InvoiceRenderer';
import { cn } from '@/lib/utils';

interface Props {
  selectedTemplate: InvoiceTemplate;
  onSelect: (template: InvoiceTemplate) => void;
  previewInvoice?: InvoiceData;
}

// Sample invoice for preview
const sampleInvoice: InvoiceData = {
  id: 'sample',
  invoiceNumber: 'INV-202501-001',
  invoiceDate: '২২ জানুয়ারি ২০২৫',
  store: {
    name: 'ডিজিটাল দোকান',
    phone: '01712345678',
    address: 'মিরপুর, ঢাকা',
  },
  customer: {
    name: 'মোহাম্মদ করিম',
    phone: '01812345678',
  },
  items: [
    {
      id: '1',
      name: 'স্যামসাং গ্যালাক্সি A54',
      quantity: 1,
      unitPrice: 35000,
      total: 35000,
      warranty: { type: 'brand', duration: 1, unit: 'বছর' },
    },
    {
      id: '2',
      name: 'শাওমি পাওয়ার ব্যাংক',
      quantity: 2,
      unitPrice: 1800,
      total: 3600,
    },
  ],
  subtotal: 38600,
  discount: 600,
  tax: 0,
  total: 38000,
  paidAmount: 38000,
  dueAmount: 0,
  paymentMethod: 'নগদ',
  paymentStatus: 'paid',
  headerNote: 'ধন্যবাদ আমাদের কাছ থেকে কেনাকাটা করার জন্য',
  footerNote: 'পণ্য বিনিময়যোগ্য, অর্থ ফেরতযোগ্য নয়',
};

export default function InvoiceTemplateSelector({ selectedTemplate, onSelect, previewInvoice }: Props) {
  const [previewTemplate, setPreviewTemplate] = useState<InvoiceTemplate | null>(null);
  const invoice = previewInvoice || sampleInvoice;

  return (
    <div className="space-y-6">
      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {invoiceTemplates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            onMouseEnter={() => setPreviewTemplate(template.id)}
            onMouseLeave={() => setPreviewTemplate(null)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all text-left',
              selectedTemplate === template.id
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border hover:border-primary/50 bg-card'
            )}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <h3 className="font-bold text-lg">{template.nameBn}</h3>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Live Preview */}
      <div className="border rounded-xl overflow-hidden bg-muted/30">
        <div className="p-3 bg-muted border-b">
          <h3 className="font-medium text-sm">
            প্রিভিউ: {invoiceTemplates.find(t => t.id === (previewTemplate || selectedTemplate))?.nameBn}
          </h3>
        </div>
        <div className="p-4 overflow-auto max-h-[600px]">
          <div className="transform scale-75 origin-top-left w-[133%]">
            <InvoiceRenderer 
              invoice={invoice} 
              template={previewTemplate || selectedTemplate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
