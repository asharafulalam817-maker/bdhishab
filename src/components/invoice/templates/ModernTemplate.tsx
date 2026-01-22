import { InvoiceData } from '../types';
import { formatBDT } from '@/lib/constants';

interface Props {
  invoice: InvoiceData;
}

export default function ModernTemplate({ invoice }: Props) {
  return (
    <div className="bg-white text-black max-w-[210mm] mx-auto font-sans text-sm print:shadow-none">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg print:rounded-none">
        <div className="flex justify-between items-start">
          <div>
            {invoice.store.logoUrl && (
              <img src={invoice.store.logoUrl} alt="Logo" className="h-16 mb-3 bg-white p-2 rounded" />
            )}
            <h1 className="text-3xl font-bold">{invoice.store.name}</h1>
            {invoice.store.address && <p className="opacity-90 mt-1">{invoice.store.address}</p>}
            {invoice.store.phone && <p className="opacity-90">📞 {invoice.store.phone}</p>}
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg">
              <p className="text-sm opacity-80">চালান নং</p>
              <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
            </div>
            <p className="mt-3">📅 {invoice.invoiceDate}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Header Note */}
        {invoice.headerNote && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-center font-medium">
            ✨ {invoice.headerNote}
          </div>
        )}

        {/* Customer Card */}
        {invoice.customer && (
          <div className="mb-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
              👤 গ্রাহক তথ্য
            </h3>
            <p className="font-semibold text-lg">{invoice.customer.name}</p>
            {invoice.customer.phone && <p className="text-gray-600">📱 {invoice.customer.phone}</p>}
            {invoice.customer.address && <p className="text-gray-600">📍 {invoice.customer.address}</p>}
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg font-semibold">
            <div className="col-span-1">#</div>
            <div className="col-span-5">পণ্য</div>
            <div className="col-span-2 text-center">পরিমাণ</div>
            <div className="col-span-2 text-right">দর</div>
            <div className="col-span-2 text-right">মোট</div>
          </div>
          {invoice.items.map((item, index) => (
            <div key={item.id} className={`grid grid-cols-12 gap-2 p-4 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="col-span-1 font-medium text-blue-600">{index + 1}</div>
              <div className="col-span-5">
                <div className="font-medium">{item.name}</div>
                {item.serialNumber && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">
                    SN: {item.serialNumber}
                  </div>
                )}
                {item.warranty && (
                  <div className="text-xs text-green-600 mt-1">
                    🛡️ {item.warranty.duration} {item.warranty.unit} ওয়ারেন্টি
                  </div>
                )}
              </div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-2 text-right">{formatBDT(item.unitPrice)}</div>
              <div className="col-span-2 text-right font-medium">{formatBDT(item.total)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">উপমোট:</span>
              <span>{formatBDT(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-red-500">
                <span>ছাড়:</span>
                <span>-{formatBDT(invoice.discount)}</span>
              </div>
            )}
            {invoice.tax > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">ট্যাক্স:</span>
                <span>{formatBDT(invoice.tax)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 mt-2 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-lg">
              <span>সর্বমোট</span>
              <span>{formatBDT(invoice.total)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2 text-green-600">
              <span>✅ পরিশোধিত:</span>
              <span>{formatBDT(invoice.paidAmount)}</span>
            </div>
            {invoice.dueAmount > 0 && (
              <div className="flex justify-between py-2 font-bold text-red-500">
                <span>⏳ বাকি:</span>
                <span>{formatBDT(invoice.dueAmount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-3 mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
            💳 {invoice.paymentMethod}
          </span>
          <span className={`px-4 py-2 rounded-full font-medium ${
            invoice.paymentStatus === 'paid' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {invoice.paymentStatus === 'paid' ? '✅ পরিশোধিত' : '⏳ বাকি আছে'}
          </span>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <strong className="text-yellow-800">📝 নোট:</strong>
            <p className="text-yellow-700 mt-1">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        {invoice.footerNote && (
          <div className="text-center text-gray-500 border-t-2 border-dashed pt-6 mt-8">
            {invoice.footerNote}
          </div>
        )}

        {/* Thank You */}
        <div className="text-center mt-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            🙏 ধন্যবাদ!
          </p>
        </div>
      </div>
    </div>
  );
}
