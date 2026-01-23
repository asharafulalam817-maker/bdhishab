interface Props {
  className?: string;
}

export function InvoiceWatermark({ className = '' }: Props) {
  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 ${className}`}
      style={{ 
        transform: 'rotate(-30deg)',
      }}
    >
      <div className="text-center opacity-20 select-none">
        <p className="text-destructive font-bold text-lg leading-tight">
          আপনি ফ্রি ভার্সন ব্যবহার করছেন
        </p>
        <p className="text-destructive text-sm mt-1">
          পেইড ভার্সন নিন তাহলে এই লেখা থাকবে না
        </p>
      </div>
    </div>
  );
}

// Print-specific watermark that shows diagonal across the invoice
export function PrintWatermark() {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none print:block hidden"
      style={{ 
        transform: 'rotate(-45deg)',
        zIndex: 9999
      }}
    >
      <div 
        className="text-center"
        style={{
          color: 'rgba(239, 68, 68, 0.15)',
          fontSize: '24px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        <p>আপনি ফ্রি ভার্সন ব্যবহার করছেন</p>
        <p style={{ fontSize: '16px', marginTop: '4px' }}>
          পেইড ভার্সন নিন তাহলে এই লেখা থাকবে না
        </p>
      </div>
    </div>
  );
}
