import { useState } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { t } = useTranslation();
  const [_location, navigate] = useLocation();
  const { register: authRegister } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check URL for registration type (patient or doctor)
  const [_, params] = useRoute('/register?:type');
  const initialTab = params?.type === 'doctor' ? 'doctor' : 'patient';
  const [activeTab, setActiveTab] = useState(initialTab);

  const doctorSpecializations = [
    { value: 'breast-cancer', label: t('register.doctor.specializations.breastCancer') },
    { value: 'lung-cancer', label: t('register.doctor.specializations.lungCancer') },
    { value: 'gastrointestinal-cancer', label: t('register.doctor.specializations.gastrointestinalCancer') },
    { value: 'hematological-cancer', label: t('register.doctor.specializations.hematologicalCancer') },
    { value: 'pediatric-oncology', label: t('register.doctor.specializations.pediatricOncology') },
    { value: 'gynecologic-oncology', label: t('register.doctor.specializations.gynecologicOncology') },
    { value: 'urologic-oncology', label: t('register.doctor.specializations.urologicOncology') },
    { value: 'neuro-oncology', label: t('register.doctor.specializations.neuroOncology') },
    { value: 'head-neck-oncology', label: t('register.doctor.specializations.headNeckOncology') },
    { value: 'skin-cancer', label: t('register.doctor.specializations.skinCancer') },
  ];

  // Set up form for patient registration
  const patientForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      isDoctor: false,
    },
  });

  // Set up form for doctor registration
  const doctorForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      isDoctor: true,
      specialization: '',
      hospital: '',
      city: '',
      bio: '',
    },
  });

  // Handle patient registration
  const onPatientSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword as it's not part of the API schema
      const { confirmPassword, ...registerData } = data;
      
      await authRegister(registerData);
      
      toast({
        title: t('register.success.title'),
        description: t('register.success.description'),
      });
      
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: t('register.error.title'),
        description: typeof error === 'string' ? error : t('register.error.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle doctor registration
  const onDoctorSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword as it's not part of the API schema
      const { confirmPassword, ...registerData } = data;
      
      await authRegister(registerData);
      
      toast({
        title: t('register.doctor.success.title'),
        description: t('register.doctor.success.description'),
      });
      
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: t('register.error.title'),
        description: typeof error === 'string' ? error : t('register.error.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">{t('register.title')}</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="patient">{t('register.patientTab')}</TabsTrigger>
              <TabsTrigger value="doctor">{t('register.doctorTab')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <Form {...patientForm}>
                <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-4">
                  <FormField
                    control={patientForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.fullName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.fullNamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('register.emailPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.username')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.usernamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('register.passwordPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={patientForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('register.confirmPasswordPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('register.submitting') : t('register.submit')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="doctor">
              <Form {...doctorForm}>
                <form onSubmit={doctorForm.handleSubmit(onDoctorSubmit)} className="space-y-4">
                  <FormField
                    control={doctorForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.fullName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.fullNamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('register.emailPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.username')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.usernamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.doctor.specialization')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('register.doctor.specializationPlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctorSpecializations.map((spec) => (
                              <SelectItem key={spec.value} value={spec.value}>
                                {spec.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="hospital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.doctor.hospital')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.doctor.hospitalPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.doctor.city')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.doctor.cityPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.doctor.bio')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('register.doctor.bioPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('register.passwordPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={doctorForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('register.confirmPasswordPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('register.submitting') : t('register.doctor.submit')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm">
            <p>
              {t('register.alreadyHaveAccount')} 
              <Link href="/login">
                <a className="text-primary font-medium ml-1">{t('register.login')}</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
