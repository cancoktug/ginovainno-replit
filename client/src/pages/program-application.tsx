import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { programsApi } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import type { Program } from "@shared/schema";

const applicationSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır"),
  birthDate: z.string().min(1, "Doğum tarihi gereklidir"),
  education: z.string().min(1, "Eğitim durumu seçiniz"),
  experience: z.string().min(1, "Deneyim seviyesi seçiniz"),
  motivation: z.string().min(50, "Motivasyon yazısı en az 50 karakter olmalıdır"),
  expectations: z.string().min(30, "Beklentiler en az 30 karakter olmalıdır"),
  previousExperience: z.string().optional(),
  linkedinProfile: z.string().url("Geçerli LinkedIn profil linki giriniz").optional().or(z.literal("")),
  cv: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Şartları kabul etmelisiniz"),
  acceptDataProcessing: z.boolean().refine((val) => val === true, "Veri işleme iznini vermelisiniz")
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function ProgramApplication() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: program, isLoading } = useQuery<Program>({
    queryKey: [`/api/programs/slug/${id}`],
    enabled: !!id,
  });

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      education: "",
      experience: "",
      motivation: "",
      expectations: "",
      previousExperience: "",
      linkedinProfile: "",
      cv: "",
      acceptTerms: false,
      acceptDataProcessing: false
    }
  });

  const onSubmit = async (data: ApplicationForm) => {
    if (!program) return;
    
    const applicationData = {
      ...data,
      programId: program.id,
    };

    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/applications", applicationData);
      
      toast({
        title: "Başvuru Gönderildi!",
        description: "Başvurunuz başarıyla alındı. En kısa sürede size dönüş yapacağız.",
      });
      
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Başvuru yapmak istediğiniz program mevcut değil.</p>
          <Link href="/programs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Programlara Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Başvuru Alındı!</h1>
            <p className="text-gray-600 mb-6">
              <strong>{program.title}</strong> programına başvurunuz başarıyla gönderildi. 
              En kısa sürede size dönüş yapacağız.
            </p>
            <div className="space-y-3">
              <Link href={`/programs/${id}`}>
                <Button variant="outline" className="w-full">
                  Program Detaylarına Dön
                </Button>
              </Link>
              <Link href="/programs">
                <Button className="w-full">
                  Diğer Programları İncele
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-itu-blue to-ginova-orange py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/programs/${id}`}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Program Detaylarına Dön
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Program Başvurusu</h1>
          <p className="text-xl text-blue-100">
            <strong>{program.title}</strong> programına başvuru yapın
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Başvuru Formu</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Kişisel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad *</FormLabel>
                          <FormControl>
                            <Input placeholder="Adınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soyad *</FormLabel>
                          <FormControl>
                            <Input placeholder="Soyadınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ornek@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon *</FormLabel>
                          <FormControl>
                            <Input placeholder="05XX XXX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doğum Tarihi *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Eğitim ve Deneyim */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Eğitim ve Deneyim</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Eğitim Durumu *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Eğitim durumunuzu seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lise">Lise</SelectItem>
                              <SelectItem value="onlisans">Ön Lisans</SelectItem>
                              <SelectItem value="lisans">Lisans</SelectItem>
                              <SelectItem value="yukseklisans">Yüksek Lisans</SelectItem>
                              <SelectItem value="doktora">Doktora</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Girişimcilik Deneyimi *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Deneyim seviyenizi seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yok">Hiç deneyimim yok</SelectItem>
                              <SelectItem value="az">Az deneyimim var</SelectItem>
                              <SelectItem value="orta">Orta seviye deneyimim var</SelectItem>
                              <SelectItem value="cok">Çok deneyimim var</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="linkedinProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profil Linki</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/profiliniz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Motivasyon */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Motivasyon ve Beklentiler</h3>
                  
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bu programa neden katılmak istiyorsunuz? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Motivasyonunuzu ve programa katılma nedenlerinizi açıklayın..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bu programdan beklentileriniz nelerdir? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Programdan elde etmeyi umduğunuz kazanımları açıklayın..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daha önce girişimcilik alanında yaşadığınız deneyimler</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Varsa önceki girişimcilik deneyimlerinizi paylaşın..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Onay Kutuları */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Onaylar</h3>
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <Link href="/terms-and-conditions" className="text-itu-blue hover:underline">
                              Program şartlarını ve koşullarını
                            </Link>{" "}
                            kabul ediyorum *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptDataProcessing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Kişisel verilerimin işlenmesini kabul ediyorum *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-ginova-orange hover:bg-ginova-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}