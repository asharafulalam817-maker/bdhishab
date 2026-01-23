import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';

interface Props {
  invoice: InvoiceData;
  width?: '58mm' | '80mm';
}

export default function ThermalTemplate({ invoice, width = '80mm' }: Props) {
  const is58mm = width === '58mm';
  
  return (
    <div 
      className="bg-white text-black font-mono"
      style={{ 
        width: is58mm ? '48mm' : '72mm', 
        padding: is58mm ? '2mm' : '4mm',
        fontSize: is58mm ? '10px' : '12px',
      }}
    >
      {/* Store Header */}
      <div className="text-center border-b border-dashed border-black pb-2 mb-2">
        <h1 className="font-bold text-sm uppercase">{invoice.store.name}</h1>
        {invoice.store.phone && <p>{invoice.store.phone}</p>}
        {invoice.store.address && <p className="text-xs">{invoice.store.address}</p>}
      </div>

      {/* Invoice Info */}
      <div className="text-xs mb-2 border-b border-dashed border-black pb-2">
        <div className="flex justify-between">
          <span>চালান:</span>
          <span className="font-bold">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>তারিখ:</span>
          <span>{invoice.invoiceDate}</span>
        </div>
        {invoice.customer && (
          <div className="flex justify-between">
            <span>গ্রাহক:</span>
            <span className="truncate ml-2 text-right">{invoice.customer.name}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="text-xs border-b border-dashed border-black pb-2 mb-2">
        <div className="flex justify-between font-bold mb-1">
          <span>পণ্য</span>
          <span>মোট</span>
        </div>
        {invoice.items.map((item) => (
          <div key={item.id} className="mb-1">
            <div className="flex justify-between">
              <span className="truncate max-w-[70%]">{item.name}</span>
              <span className="font-bold">{formatBDT(item.total)}</span>
            </div>
            <div className="text-[10px] text-gray-600 pl-2">
              {item.quantity} × {formatBDT(item.unitPrice)}
              {item.warranty && (
                <span className="ml-1">
                  ({item.warranty.duration}{item.warranty.unit[0]})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="text-xs space-y-1 mb-2">
        <div className="flex justify-between">
          <span>উপমোট:</span>
          <span>{formatBDT(invoice.subtotal)}</span>
        </div>
        {invoice.discount > 0 && (
          <div className="flex justify-between">
            <span>ছাড়:</span>
            <span>-{formatBDT(invoice.discount)}</span>
          </div>
        )}
        {invoice.tax > 0 && (
          <div className="flex justify-between">
            <span>ট্যাক্স:</span>
            <span>{formatBDT(invoice.tax)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t border-dashed border-black pt-1">
          <span>সর্বমোট:</span>
          <span>{formatBDT(invoice.total)}</span>
        </div>
        <div className="flex justify-between">
          <span>পরিশোধ:</span>
          <span>{formatBDT(invoice.paidAmount)}</span>
        </div>
        {invoice.dueAmount > 0 && (
          <div className="flex justify-between font-bold">
            <span>বাকি:</span>
            <span>{formatBDT(invoice.dueAmount)}</span>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="text-center text-xs border-t border-dashed border-black pt-2 mb-2">
        পেমেন্ট: {invoice.paymentMethod}
      </div>

      {/* Footer */}
      <div className="text-center text-xs border-t border-dashed border-black pt-2">
        <p>{invoice.footerNote || 'ধন্যবাদ!'}</p>
        <p className="text-[9px] mt-1 text-gray-500">Powered by DigitalOndu</p>
      </div>
    </div>
  );
}
