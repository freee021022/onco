import { useState, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import LanguageSelector from '../ui/LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  // Safely use auth context with fallback values
  let authContext;
  let user = null;
  let isAuthenticated = false;
  let logout = () => {};
  
  try {
    authContext = useAuth();
    user = authContext.user;
    isAuthenticated = authContext.isAuthenticated;
    logout = authContext.logout;
  } catch (error) {
    console.error('Auth context not available');
  }
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0 mr-6">
              <span className="text-primary material-icons text-4xl mr-2">medical_services</span>
              <div>
                <h1 className="text-2xl font-bold font-secondary text-primary">
                  Onconet<span className="text-[#4c9f70]">24</span>
                </h1>
                <p className="text-xs text-neutral-500">{t('header.subtitle')}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/forum">
                <a className={`text-neutral-600 hover:text-primary font-medium transition ${location === '/forum' ? 'text-primary' : ''}`}>
                  {t('header.nav.forum')}
                </a>
              </Link>
              <Link href="/second-opinion">
                <a className={`text-neutral-600 hover:text-primary font-medium transition ${location === '/second-opinion' ? 'text-primary' : ''}`}>
                  {t('header.nav.secondOpinion')}
                </a>
              </Link>
              <Link href="/pharmacies">
                <a className={`text-neutral-600 hover:text-primary font-medium transition ${location === '/pharmacies' ? 'text-primary' : ''}`}>
                  {t('header.nav.pharmacies')}
                </a>
              </Link>
              <Link href="/about">
                <a className={`text-neutral-600 hover:text-primary font-medium transition ${location === '/about' ? 'text-primary' : ''}`}>
                  {t('header.nav.about')}
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <LanguageSelector />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-neutral-600">{user?.fullName}</span>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-neutral-600 hover:text-primary"
                  >
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <a className="text-neutral-600 hover:text-primary mr-4">
                      {t('header.login')}
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
                      {t('header.register')}
                    </a>
                  </Link>
                </>
              )}
            </div>
            <button 
              className="md:hidden text-neutral-600" 
              id="mobileMenuButton"
              onClick={toggleMobileMenu}
            >
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white shadow-md fixed inset-0 transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'mobile-menu-open' : 'translate-x-full'
        }`} 
        id="mobileMenu"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-primary">{t('header.menu')}</h2>
          <button id="closeMenu" onClick={closeMobileMenu}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/forum">
                <a className="block p-2 hover:bg-neutral-100 rounded" onClick={closeMobileMenu}>
                  {t('header.nav.forum')}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/second-opinion">
                <a className="block p-2 hover:bg-neutral-100 rounded" onClick={closeMobileMenu}>
                  {t('header.nav.secondOpinion')}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/pharmacies">
                <a className="block p-2 hover:bg-neutral-100 rounded" onClick={closeMobileMenu}>
                  {t('header.nav.pharmacies')}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className="block p-2 hover:bg-neutral-100 rounded" onClick={closeMobileMenu}>
                  {t('header.nav.about')}
                </a>
              </Link>
            </li>
            <li className="border-t my-4 pt-4">
              {isAuthenticated ? (
                <>
                  <span className="block p-2">{user?.fullName}</span>
                  <button 
                    className="block p-2 hover:bg-neutral-100 rounded w-full text-left"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <a className="block p-2 hover:bg-neutral-100 rounded" onClick={closeMobileMenu}>
                      {t('header.login')}
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block bg-primary text-white p-2 rounded text-center mt-2" onClick={closeMobileMenu}>
                      {t('header.register')}
                    </a>
                  </Link>
                </>
              )}
            </li>
            <li className="border-t my-4 pt-4">
              <LanguageSelector isMobile />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
