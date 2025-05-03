import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/use-translation';
import { Pharmacy } from '@shared/schema';
import PharmacyCard from '@/components/pharmacy/PharmacyCard';
import MapComponent from '@/components/pharmacy/MapComponent';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Pharmacies = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);

  // Fetch all pharmacies
  const { data: pharmacies, isLoading } = useQuery({
    queryKey: ['/api/pharmacies'],
    queryFn: async () => {
      const response = await fetch('/api/pharmacies');
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies');
      }
      return response.json() as Promise<Pharmacy[]>;
    }
  });

  // Extract unique regions from pharmacies
  const regions = pharmacies 
    ? Array.from(new Set(pharmacies.map(pharmacy => pharmacy.region))).sort() 
    : [];
  
  // Extract cities based on selected region
  const cities = selectedRegion && pharmacies
    ? Array.from(new Set(pharmacies
        .filter(pharmacy => pharmacy.region === selectedRegion)
        .map(pharmacy => pharmacy.city))).sort()
    : [];

  const specializations = [
    { value: 'preparazioni-galeniche', label: t('pharmacy.specializations.preparations') },
    { value: 'nutrizione-oncologica', label: t('pharmacy.specializations.nutrition') },
    { value: 'supporto-post-chemioterapia', label: t('pharmacy.specializations.postChemo') },
    { value: 'presidi-medico-chirurgici', label: t('pharmacy.specializations.medical') },
  ];

  const handleSearch = () => {
    if (!pharmacies) return;
    
    // Filter pharmacies based on selections
    let filtered = [...pharmacies];
    
    if (selectedRegion) {
      filtered = filtered.filter(p => p.region === selectedRegion);
    }
    
    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }
    
    if (selectedSpecialization && selectedSpecialization !== 'all') {
      filtered = filtered.filter(p => p.specializations && p.specializations.includes(selectedSpecialization));
    }
    
    setFilteredPharmacies(filtered);
    setIsMapLoaded(true);
  };

  const resetFilters = () => {
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedSpecialization('');
    setFilteredPharmacies(pharmacies || []);
  };

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/100 to-primary/90 opacity-90"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('pharmacy.pageTitle')}</h1>
            <p className="text-lg opacity-90 mb-6">{t('pharmacy.pageDescription')}</p>
          </div>
        </div>
      </section>

      {/* Search and Map Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-neutral-200">
                <h2 className="text-xl font-bold mb-4">{t('pharmacy.search')}</h2>
                
                <div className="mb-6">
                  <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('pharmacy.region')}
                  </label>
                  <Select value={selectedRegion} onValueChange={(value) => {
                    setSelectedRegion(value);
                    setSelectedCity(''); // Reset city when region changes
                  }}>
                    <SelectTrigger id="region" className="w-full">
                      <SelectValue placeholder={t('pharmacy.selectRegion')} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('pharmacy.city')}
                  </label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={!selectedRegion}
                  >
                    <SelectTrigger id="city" className="w-full">
                      <SelectValue placeholder={selectedRegion ? t('pharmacy.selectCity') : t('pharmacy.selectRegionFirst')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="specialization" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('pharmacy.specialization')}
                  </label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                    <SelectTrigger id="specialization" className="w-full">
                      <SelectValue placeholder={t('pharmacy.allSpecializations')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pharmacy.allSpecializations')}</SelectItem>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-primary text-white px-4 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    <span className="material-icons text-sm mr-1 align-text-bottom">search</span>
                    {t('pharmacy.searchButton')}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-shrink-0 border border-neutral-200 text-neutral-600 px-4 py-3 rounded-md hover:bg-neutral-50"
                    onClick={resetFilters}
                    disabled={isLoading}
                  >
                    <span className="material-icons text-sm">refresh</span>
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <div className="h-96 bg-neutral-100 relative">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : isMapLoaded ? (
                    <MapComponent pharmacies={filteredPharmacies.length > 0 ? filteredPharmacies : (pharmacies || [])} />
                  ) : (
                    <div className="relative w-full h-full">
                      <img 
                        src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80" 
                        alt={t('pharmacy.mapImageAlt')} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                          <h4 className="text-xl font-bold mb-2">{t('pharmacy.interactiveMap')}</h4>
                          <p className="text-neutral-600 mb-4">{t('pharmacy.selectRegionToView')}</p>
                          <Button 
                            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors w-full"
                            onClick={() => {
                              setFilteredPharmacies(pharmacies || []);
                              setIsMapLoaded(true);
                            }}
                          >
                            <span className="material-icons text-sm mr-1 align-text-bottom">map</span>
                            {t('pharmacy.loadMapButton')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pharmacies List Section */}
      <section className="pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 section-title">
            {filteredPharmacies.length > 0 ? 
              t('pharmacy.searchResults', { count: filteredPharmacies.length }) : 
              t('pharmacy.allPharmacies')}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : (isMapLoaded ? filteredPharmacies : (pharmacies || [])).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isMapLoaded ? filteredPharmacies : (pharmacies || [])).map((pharmacy) => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center max-w-2xl mx-auto">
              <span className="material-icons text-neutral-400 text-5xl mb-4">search_off</span>
              <h3 className="text-xl font-bold mb-2">{t('pharmacy.noResults')}</h3>
              <p className="text-neutral-600 mb-6">{t('pharmacy.tryDifferentFilters')}</p>
              <Button 
                variant="outline"
                className="border border-neutral-200 text-neutral-600 px-4 py-2 rounded-md hover:bg-neutral-50"
                onClick={resetFilters}
              >
                <span className="material-icons text-sm mr-1 align-text-bottom">refresh</span>
                {t('pharmacy.resetFilters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center section-title mx-auto centered" style={{ width: 'fit-content' }}>
              {t('pharmacy.infoTitle')}
            </h2>
            
            <div className="prose prose-lg max-w-none text-neutral-600">
              <p>{t('pharmacy.info.paragraph1')}</p>
              <p>{t('pharmacy.info.paragraph2')}</p>
              
              <h3>{t('pharmacy.info.servicesTitle')}</h3>
              <ul>
                <li>{t('pharmacy.info.services.preparations')}</li>
                <li>{t('pharmacy.info.services.nutrition')}</li>
                <li>{t('pharmacy.info.services.support')}</li>
                <li>{t('pharmacy.info.services.equipment')}</li>
              </ul>
              
              <p>{t('pharmacy.info.paragraph3')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pharmacies;
