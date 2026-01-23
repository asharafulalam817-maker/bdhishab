import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';
import { InvoiceQRCode } from '../InvoiceQRCode';

interface Props {
  invoice: InvoiceData;
}

export default function ProfessionalTemplate({ invoice }: Props) {
  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto font-sans text-sm">
      {/* Header Bar */}
      <div className="bg-slate-800 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {invoice.store.logoUrl && (
              <img src={invoice.store.logoUrl} alt="Logo" className="h-12 bg-white p-1 rounded" />
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{invoice.store.name}</h1>
              {invoice.store.phone && <p className="text-slate-300 text-sm">{invoice.store.phone}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light">INVOICE</p>
            <p className="text-slate-300">{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Two Column Header */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Bill To */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">বিল প্রাপক</h3>
            {invoice.customer ? (
              <div className="bg-slate-50 p-4 rounded border-l-4 border-slate-800">
                <p className="font-bold text-lg">{invoice.customer.name}</p>
                {invoice.customer.phone && <p className="text-slate-600">{invoice.customer.phone}</p>}
                {invoice.customer.address && <p className="text-slate-600">{invoice.customer.address}</p>}
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded border-l-4 border-slate-800">
                <p className="text-slate-500">ওয়াক-ইন কাস্টমার</p>
              </div>
            )}
          </div>
          
          {/* Invoice Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">চালান বিবরণ</h3>
            <div className="bg-slate-50 p-4 rounded border-l-4 border-slate-800">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-600">চালান তারিখ:</span>
                <span className="font-medium">{invoice.invoiceDate}</span>
                {invoice.dueDate && (
                  <>
                    <span className="text-slate-600">বাকি তারিখ:</span>
                    <span className="font-medium">{invoice.dueDate}</span>
                  </>
                )}
                <span className="text-slate-600">স্ট্যাটাস:</span>
                <span className={`font-medium ${invoice.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                  {invoice.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বাকি'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
              <th className="p-3 text-left">বিবরণ</th>
              <th className="p-3 text-center w-20">পরিমাণ</th>
              <th className="p-3 text-right w-28">একক মূল্য</th>
              <th className="p-3 text-right w-28">মোট</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="p-3">
                  <div className="font-medium">{item.name}</div>
                  {item.sku && <div className="text-xs text-slate-500">SKU: {item.sku}</div>}
                  {item.serialNumber && <div className="text-xs text-slate-500">S/N: {item.serialNumber}</div>}
                  {item.warranty && (
                    <div className="text-xs text-slate-600 mt-1 bg-green-50 text-green-700 px-2 py-0.5 rounded inline-block">
                      ওয়ারেন্টি: {item.warranty.duration} {item.warranty.unit}
                    </div>
                  )}
                </td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{formatBDT(item.unitPrice)}</td>
                <td className="p-3 text-right font-medium">{formatBDT(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="bg-slate-50 p-4 rounded">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-600">উপমোট:</span>
                <span>{formatBDT(invoice.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2 text-sm text-red-600">
                  <span>ছাড়:</span>
                  <span>-{formatBDT(invoice.discount)}</span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-600">ট্যাক্স:</span>
                  <span>{formatBDT(invoice.tax)}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-800 text-white p-4 rounded-b flex justify-between font-bold text-lg">
              <span>সর্বমোট</span>
              <span>{formatBDT(invoice.total)}</span>
            </div>
            <div className="mt-2 p-3 bg-slate-50 rounded text-sm">
              <div className="flex justify-between text-green-600">
                <span>পরিশোধিত:</span>
                <span>{formatBDT(invoice.paidAmount)}</span>
              </div>
              {invoice.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600 mt-1">
                  <span>বাকি:</span>
                  <span>{formatBDT(invoice.dueAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">নোট</p>
            <p className="text-slate-700">{invoice.notes}</p>
          </div>
        )}

        {/* Terms */}
        {invoice.footerNote && (
          <div className="mt-8 pt-4 border-t text-center text-sm text-slate-600">
            {invoice.footerNote}
          </div>
        )}

        {/* Store Info Footer with QR */}
        <div className="mt-8 pt-4 border-t flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {invoice.store.address && <p>{invoice.store.address}</p>}
            {invoice.store.email && <p>{invoice.store.email}</p>}
          </div>
          <InvoiceQRCode invoice={invoice} size={64} includeDetails />
        </div>
      </div>
    </div>
  );
}
