import { Pharmacy } from '@shared/schema';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

// Estende l'interfaccia Pharmacy con campi opzionali aggiuntivi
interface ExtendedPharmacy extends Pharmacy {
  email?: string;
  openingHours?: string;
  description?: string;
  website?: string;
}

interface PharmacyDetailsProps {
  pharmacy: ExtendedPharmacy;
  onClose: () => void;
}

const PharmacyDetails = ({ pharmacy, onClose }: PharmacyDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-40 w-72 max-h-[80%] overflow-y-auto">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{pharmacy.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={t('pharmacy.close')}
        >
          <X size={18} />
        </button>
      </div>

      <div className="text-sm space-y-3">
        <div>
          <p className="text-gray-700 font-medium">{t('pharmacy.address')}</p>
          <p>{pharmacy.address}</p>
          <p>{pharmacy.city}, {pharmacy.region}</p>
        </div>

        <div>
          <p className="text-gray-700 font-medium">{t('pharmacy.contacts')}</p>
          <p>{t('pharmacy.phone')}: {pharmacy.phone}</p>
          {pharmacy.email && <p>Email: {pharmacy.email}</p>}
        </div>

        {pharmacy.openingHours && (
          <div>
            <p className="text-gray-700 font-medium">{t('pharmacy.openingHours')}</p>
            <p>{pharmacy.openingHours}</p>
          </div>
        )}

        {pharmacy.specializations && pharmacy.specializations.length > 0 && (
          <div>
            <p className="text-gray-700 font-medium">{t('pharmacy.specializations')}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {pharmacy.specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="bg-primary/10 text-primary">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {pharmacy.description && (
          <div>
            <p className="text-gray-700 font-medium">{t('pharmacy.description')}</p>
            <p className="text-gray-600">{pharmacy.description}</p>
          </div>
        )}

        {pharmacy.website && (
          <div className="pt-2">
            <a 
              href={pharmacy.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {t('pharmacy.visitWebsite')} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDetails;