import { Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-white material-icons text-4xl mr-2">medical_services</span>
              <h2 className="text-2xl font-bold">
                Onconet<span className="text-[#4c9f70]">24</span>
              </h2>
            </div>
            <p className="text-neutral-400 mb-6">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">instagram</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <span className="material-icons">linkedin</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.quickNavigation')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.home')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/forum">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.forum')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/second-opinion">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.secondOpinion')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pharmacies">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.pharmacies')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.about')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.navigation.contact')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/register?type=patient">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.patientRegistration')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register?type=doctor">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.doctorRegistration')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/second-opinion">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.onlineConsultations')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.psychologicalSupport')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pharmacies">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.pharmacySearch')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-neutral-400 hover:text-white transition-colors">
                    {t('footer.services.resources')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="material-icons text-sm mr-2 text-neutral-400">location_on</span>
                <span className="text-neutral-400">Via della Salute 123, Milano, Italia</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-sm mr-2 text-neutral-400">email</span>
                <a href="mailto:info@onconet24.it" className="text-neutral-400 hover:text-white transition-colors">
                  info@onconet24.it
                </a>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-sm mr-2 text-neutral-400">phone</span>
                <a href="tel:+390123456789" className="text-neutral-400 hover:text-white transition-colors">
                  +39 01 2345 6789
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-3">{t('footer.newsletter')}</h4>
              <form className="flex">
                <Input 
                  type="email" 
                  placeholder={t('footer.yourEmail')} 
                  className="rounded-r-none text-neutral-800 w-full" 
                  required 
                />
                <Button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded-l-none hover:bg-primary/90 transition-colors"
                >
                  <span className="material-icons text-sm">send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; 2023 Onconet24. {t('footer.allRightsReserved')}
          </p>
          <div className="flex flex-wrap justify-center space-x-4">
            <Link href="/privacy">
              <a className="text-neutral-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-neutral-400 hover:text-white text-sm transition-colors">
                {t('footer.termsOfService')}
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-neutral-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </Link>
            <Link href="/gdpr">
              <a className="text-neutral-400 hover:text-white text-sm transition-colors">
                {t('footer.gdprInfo')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
