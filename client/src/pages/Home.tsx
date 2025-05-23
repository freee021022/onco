import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import ForumSection from '../components/sections/ForumSection';
import SecondOpinionSection from '../components/sections/SecondOpinionSection';
import PharmacySection from '../components/sections/PharmacySection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CtaSection from '../components/sections/CtaSection';
import { useQuery } from '@tanstack/react-query';
import { forumPosts, forumCategories, testimonials, pharmacies } from '../lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

const Home = () => {
  const { t } = useTranslation();
  
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/forum/posts'],
    queryFn: forumPosts.getPosts,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/forum/categories'],
    queryFn: forumCategories.getCategories,
  });
  
  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: testimonials.getTestimonials,
  });
  
  const { data: pharmaciesData, isLoading: isLoadingPharmacies } = useQuery({
    queryKey: ['/api/pharmacies'],
    queryFn: pharmacies.getPharmacies,
  });
  
  const { data: doctorsData, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
    queryFn: async () => {
      const response = await fetch('/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return response.json();
    }
  });

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      
      {isLoadingCategories || isLoadingPosts ? (
        <div className="py-12 md:py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-10 md:mb-0 md:pr-12">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-8" />
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ForumSection categories={categoriesData || []} posts={postsData || []} />
      )}
      
      {isLoadingDoctors ? (
        <div className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <Skeleton className="h-8 w-48 mx-auto mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <SecondOpinionSection doctors={doctorsData || []} />
      )}
      
      {isLoadingPharmacies ? (
        <div className="py-12 md:py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <Skeleton className="h-8 w-64 mx-auto mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            
            <Skeleton className="h-96 w-full mb-12" />
            
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <PharmacySection pharmacies={pharmaciesData || []} />
      )}
      
      {isLoadingTestimonials ? (
        <div className="py-12 md:py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/20" />
              <Skeleton className="h-4 w-64 mx-auto bg-white/20" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TestimonialsSection testimonials={testimonialsData || []} />
      )}
      
      <CtaSection />
    </div>
  );
};

export default Home;
