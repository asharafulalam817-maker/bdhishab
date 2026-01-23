import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';
import { InvoiceQRCode } from '../InvoiceQRCode';

interface Props {
  invoice: InvoiceData;
}

export default function MinimalTemplate({ invoice }: Props) {
  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto font-sans text-sm">
      {/* Simple Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">{invoice.store.name}</h1>
        {invoice.store.phone && <p className="text-gray-600">{invoice.store.phone}</p>}
        {invoice.store.address && <p className="text-gray-600 text-sm">{invoice.store.address}</p>}
      </div>

      {/* Invoice Info Line */}
      <div className="flex justify-between text-sm border-y py-3 mb-6">
        <span>চালান: <strong>{invoice.invoiceNumber}</strong></span>
        <span>তারিখ: <strong>{invoice.invoiceDate}</strong></span>
      </div>

      {/* Customer */}
      {invoice.customer && (
        <div className="mb-6 text-sm">
          <span className="text-gray-500">গ্রাহক:</span>{' '}
          <strong>{invoice.customer.name}</strong>
          {invoice.customer.phone && <span className="text-gray-600"> | {invoice.customer.phone}</span>}
        </div>
      )}

      {/* Simple Table */}
      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="border-b-2">
            <th className="py-2 text-left font-medium">পণ্য</th>
            <th className="py-2 text-center font-medium w-20">পরিমাণ</th>
            <th className="py-2 text-right font-medium w-24">দর</th>
            <th className="py-2 text-right font-medium w-24">মোট</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3">
                {item.name}
                {item.warranty && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({item.warranty.duration}{item.warranty.unit[0]} ওয়ারেন্টি)
                  </span>
                )}
              </td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-right">{formatBDT(item.unitPrice)}</td>
              <td className="py-3 text-right">{formatBDT(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals - Right aligned, minimal */}
      <div className="flex justify-end">
        <div className="w-48 text-sm">
          <div className="flex justify-between py-1">
            <span>উপমোট</span>
            <span>{formatBDT(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-1 text-gray-600">
              <span>ছাড়</span>
              <span>-{formatBDT(invoice.discount)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between py-1 text-gray-600">
              <span>ট্যাক্স</span>
              <span>{formatBDT(invoice.tax)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 font-bold">
            <span>মোট</span>
            <span>{formatBDT(invoice.total)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span>পরিশোধ</span>
            <span>{formatBDT(invoice.paidAmount)}</span>
          </div>
          {invoice.dueAmount > 0 && (
            <div className="flex justify-between py-1 font-medium">
              <span>বাকি</span>
              <span>{formatBDT(invoice.dueAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with QR Code */}
      <div className="flex items-end justify-between mt-12 pt-4 border-t">
        <div className="text-xs text-gray-500">
          {invoice.footerNote || 'ধন্যবাদ'}
        </div>
        <InvoiceQRCode invoice={invoice} size={64} includeDetails />
      </div>
    </div>
  );
}
