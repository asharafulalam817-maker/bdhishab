import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';

interface Props {
  invoice: InvoiceData;
}

export default function ClassicTemplate({ invoice }: Props) {
  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto font-sans text-sm print:p-4">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
        <div>
          {invoice.store.logoUrl && (
            <img src={invoice.store.logoUrl} alt="Logo" className="h-16 mb-2" />
          )}
          <h1 className="text-2xl font-bold text-gray-800">{invoice.store.name}</h1>
          {invoice.store.address && <p className="text-gray-600">{invoice.store.address}</p>}
          {invoice.store.phone && <p className="text-gray-600">ফোন: {invoice.store.phone}</p>}
          {invoice.store.email && <p className="text-gray-600">{invoice.store.email}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">চালান</h2>
          <p className="font-semibold">চালান নং: {invoice.invoiceNumber}</p>
          <p>তারিখ: {invoice.invoiceDate}</p>
          {invoice.dueDate && <p>বাকি পরিশোধের তারিখ: {invoice.dueDate}</p>}
        </div>
      </div>

      {/* Header Note */}
      {invoice.headerNote && (
        <div className="bg-gray-100 p-3 rounded mb-4 text-center text-gray-700">
          {invoice.headerNote}
        </div>
      )}

      {/* Customer Info */}
      {invoice.customer && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold text-gray-700 mb-2">গ্রাহক তথ্য:</h3>
          <p className="font-semibold">{invoice.customer.name}</p>
          {invoice.customer.phone && <p>ফোন: {invoice.customer.phone}</p>}
          {invoice.customer.address && <p>{invoice.customer.address}</p>}
        </div>
      )}

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 text-left">ক্রমিক</th>
            <th className="p-3 text-left">পণ্যের নাম</th>
            <th className="p-3 text-center">পরিমাণ</th>
            <th className="p-3 text-right">দর</th>
            <th className="p-3 text-right">মোট</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">
                <div>{item.name}</div>
                {item.serialNumber && (
                  <div className="text-xs text-gray-500">সিরিয়াল: {item.serialNumber}</div>
                )}
                {item.warranty && (
                  <div className="text-xs text-green-600">
                    ওয়ারেন্টি: {item.warranty.duration} {item.warranty.unit}
                  </div>
                )}
              </td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">{formatBDT(item.unitPrice)}</td>
              <td className="p-3 text-right">{formatBDT(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span>উপমোট:</span>
            <span>{formatBDT(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-2 border-b text-red-600">
              <span>ছাড়:</span>
              <span>-{formatBDT(invoice.discount)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>ট্যাক্স:</span>
              <span>{formatBDT(invoice.tax)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 font-bold text-lg bg-gray-100 px-2 rounded">
            <span>সর্বমোট:</span>
            <span>{formatBDT(invoice.total)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-green-600">
            <span>পরিশোধিত:</span>
            <span>{formatBDT(invoice.paidAmount)}</span>
          </div>
          {invoice.dueAmount > 0 && (
            <div className="flex justify-between py-2 font-bold text-red-600">
              <span>বাকি:</span>
              <span>{formatBDT(invoice.dueAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="flex gap-4 mb-6 text-sm">
        <span className="px-3 py-1 bg-gray-200 rounded">
          পেমেন্ট: {invoice.paymentMethod}
        </span>
        <span className={`px-3 py-1 rounded ${
          invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {invoice.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বাকি আছে'}
        </span>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <strong>নোট:</strong> {invoice.notes}
        </div>
      )}

      {/* Footer Note */}
      {invoice.footerNote && (
        <div className="text-center text-gray-600 border-t pt-4 mt-6">
          {invoice.footerNote}
        </div>
      )}

      {/* Signature */}
      <div className="flex justify-between mt-12 pt-4">
        <div className="text-center">
          <div className="border-t border-gray-400 w-40 pt-2">গ্রাহকের স্বাক্ষর</div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 w-40 pt-2">অনুমোদিত স্বাক্ষর</div>
        </div>
      </div>
    </div>
  );
}
