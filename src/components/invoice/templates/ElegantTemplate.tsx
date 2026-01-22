import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';

interface Props {
  invoice: InvoiceData;
}

export default function ElegantTemplate({ invoice }: Props) {
  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto font-serif">
      {/* Decorative Border */}
      <div className="border-[3px] border-double border-amber-600 m-4 p-8">
        {/* Header */}
        <div className="text-center border-b-2 border-amber-600/30 pb-6 mb-6">
          {invoice.store.logoUrl && (
            <img src={invoice.store.logoUrl} alt="Logo" className="h-20 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-amber-800 tracking-wide">{invoice.store.name}</h1>
          {invoice.store.address && (
            <p className="text-amber-700 mt-2 italic">{invoice.store.address}</p>
          )}
          {invoice.store.phone && (
            <p className="text-amber-700">☎ {invoice.store.phone}</p>
          )}
        </div>

        {/* Invoice Title */}
        <div className="text-center mb-8">
          <h2 className="inline-block text-2xl font-bold text-amber-800 border-b-2 border-amber-600 pb-1 px-4">
            চালান
          </h2>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-8 text-sm">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-bold text-amber-800 mb-2">⬩ গ্রাহক ⬩</p>
            {invoice.customer ? (
              <>
                <p className="font-semibold text-lg">{invoice.customer.name}</p>
                {invoice.customer.phone && <p className="text-amber-700">{invoice.customer.phone}</p>}
                {invoice.customer.address && <p className="text-amber-700">{invoice.customer.address}</p>}
              </>
            ) : (
              <p className="text-amber-600 italic">ওয়াক-ইন কাস্টমার</p>
            )}
          </div>
          <div className="text-right">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-600 text-sm">চালান নম্বর</p>
              <p className="text-xl font-bold text-amber-800">{invoice.invoiceNumber}</p>
              <p className="text-amber-600 text-sm mt-2">তারিখ</p>
              <p className="font-semibold text-amber-800">{invoice.invoiceDate}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-y-2 border-amber-600">
                <th className="py-3 text-left text-amber-800">পণ্যের বিবরণ</th>
                <th className="py-3 text-center text-amber-800 w-20">পরিমাণ</th>
                <th className="py-3 text-right text-amber-800 w-28">দর</th>
                <th className="py-3 text-right text-amber-800 w-28">মোট</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-amber-200">
                  <td className="py-4">
                    <div className="font-medium">{item.name}</div>
                    {item.serialNumber && (
                      <div className="text-xs text-amber-600 italic">সিরিয়াল: {item.serialNumber}</div>
                    )}
                    {item.warranty && (
                      <div className="text-xs text-green-700 mt-1">
                        ✦ ওয়ারেন্টি: {item.warranty.duration} {item.warranty.unit}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">{formatBDT(item.unitPrice)}</td>
                  <td className="py-4 text-right font-medium">{formatBDT(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-72">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">উপমোট:</span>
                <span>{formatBDT(invoice.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>ছাড়:</span>
                  <span>-{formatBDT(invoice.discount)}</span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-700">ট্যাক্স:</span>
                  <span>{formatBDT(invoice.tax)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between py-3 mt-3 border-y-2 border-amber-600 font-bold text-xl text-amber-800">
              <span>সর্বমোট</span>
              <span>{formatBDT(invoice.total)}</span>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-green-700">
                <span>পরিশোধিত:</span>
                <span>{formatBDT(invoice.paidAmount)}</span>
              </div>
              {invoice.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600">
                  <span>বাকি:</span>
                  <span>{formatBDT(invoice.dueAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Badge */}
        <div className="text-center mb-6">
          <span className={`inline-block px-6 py-2 rounded-full font-medium ${
            invoice.paymentStatus === 'paid'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-orange-100 text-orange-800 border border-orange-300'
          }`}>
            {invoice.paymentStatus === 'paid' ? '✓ পরিশোধিত' : '◷ বাকি আছে'}
          </span>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg italic text-amber-800 text-center">
            "{invoice.notes}"
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between mt-12 pt-8">
          <div className="text-center">
            <div className="w-40 border-t-2 border-amber-600 pt-2 text-amber-800">
              গ্রাহকের স্বাক্ষর
            </div>
          </div>
          <div className="text-center">
            <div className="w-40 border-t-2 border-amber-600 pt-2 text-amber-800">
              বিক্রেতার স্বাক্ষর
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-amber-200">
          <p className="text-amber-700 italic text-sm">
            {invoice.footerNote || '❦ আপনার পৃষ্ঠপোষকতার জন্য আন্তরিক ধন্যবাদ ❦'}
          </p>
        </div>
      </div>
    </div>
  );
}
