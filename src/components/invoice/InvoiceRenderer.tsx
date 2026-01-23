import { InvoiceData, InvoiceTemplate } from './types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import { InvoiceWatermark, PrintWatermark } from './InvoiceWatermark';

interface Props {
  invoice: InvoiceData;
  template: InvoiceTemplate;
  showWatermark?: boolean;
}

export default function InvoiceRenderer({ invoice, template, showWatermark = false }: Props) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate invoice={invoice} />;
      case 'minimal':
        return <MinimalTemplate invoice={invoice} />;
      case 'professional':
        return <ProfessionalTemplate invoice={invoice} />;
      case 'elegant':
        return <ElegantTemplate invoice={invoice} />;
      case 'classic':
      default:
        return <ClassicTemplate invoice={invoice} />;
    }
  };

  return (
    <div className="relative">
      {showWatermark && (
        <>
          <InvoiceWatermark />
          <PrintWatermark />
        </>
      )}
      {renderTemplate()}
    </div>
  );
}
