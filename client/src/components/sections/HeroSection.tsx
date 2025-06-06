import { Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const { t } = useTranslation();
  
  // Safely use auth context with fallback values
  let isAuthenticated = false;
  
  try {
    const authContext = useAuth();
    isAuthenticated = authContext.isAuthenticated;
  } catch (error) {
    console.error('Auth context not available');
  }
  
  return (
    <section className="relative bg-primary text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/100 to-primary/90 opacity-90"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-secondary mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link href="/forum">
                  <Button
                    className="bg-white text-primary-600 font-bold px-6 py-3 rounded-md hover:bg-neutral-100 transition-colors shadow-lg text-center"
                  >
                    {t('hero.exploreForumButton')}
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button
                    className="bg-white text-primary-600 font-bold px-6 py-3 rounded-md hover:bg-neutral-100 transition-colors shadow-lg text-center"
                  >
                    {t('hero.registerButton')}
                  </Button>
                </Link>
              )}
              <Link href="/about">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white font-bold px-6 py-3 rounded-md hover:bg-white/10 transition-colors text-center"
                >
                  {t('hero.learnMoreButton')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt={t('hero.imageAlt')}
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
