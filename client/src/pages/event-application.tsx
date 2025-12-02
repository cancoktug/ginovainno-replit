import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Send
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Link } from "wouter";

const applicationSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  organization: z.string().optional(),
  position: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().min(50, "Katılım motivasyonunuzu en az 50 karakter ile açıklayın"),
  dietaryRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function EventApplication() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["events", "slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/events/slug/${slug}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!slug,
  });

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      experience: "",
      motivation: "",
      dietaryRequirements: "",
      additionalNotes: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      const applicationData = {
        ...data,
        eventId: event?.id || 0,
        eventTitle: event?.title,
        status: "Beklemede",
      };
      
      return await apiRequest("POST", "/api/event-applications", applicationData);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Başvuru Alındı",
        description: "Etkinlik başvurunuz başarıyla gönderildi. En kısa sürede geri dönüş yapacağız.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Başvuru gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    submitMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız etkinlik mevcut değil.</p>
          <Link href="/etkinlikler">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Etkinliklere Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Başvurunuz Alındı!
              </h1>
              <p className="text-gray-600 mb-6">
                <strong>{event.title}</strong> etkinliği için başvurunuz başarıyla gönderildi.
                En kısa sürede size geri dönüş yapacağız.
              </p>
              <div className="space-y-3">
                <Link href={`/etkinlikler/${slug}`}>
                  <Button variant="outline" className="w-full">
                    Etkinlik Detayına Dön
                  </Button>
                </Link>
                <Link href="/etkinlikler">
                  <Button className="w-full">
                    Diğer Etkinliklere Bak
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isPastEvent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Sona Erdi</h1>
          <p className="text-gray-600 mb-8">Bu etkinlik için başvuru süresi dolmuştur.</p>
          <Link href="/etkinlikler">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Diğer Etkinliklere Bak
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/etkinlikler/${slug}`}>
            <Button variant="ghost" className="p-0 text-itu-blue hover:text-itu-blue/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Etkinlik Detayına Dön
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Etkinlik Başvurusu</CardTitle>
                <p className="text-gray-600">
                  Lütfen aşağıdaki formu eksiksiz doldurun. Tüm alanların doldurulması zorunludur.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Ad *</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          placeholder="Adınız"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad *</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          placeholder="Soyadınız"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="ornek@email.com"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="05XX XXX XX XX"
                        />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profesyonel Bilgiler</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="organization">Kurum/Şirket</Label>
                        <Input
                          id="organization"
                          {...form.register("organization")}
                          placeholder="Çalıştığınız kurum"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Pozisyon</Label>
                        <Input
                          id="position"
                          {...form.register("position")}
                          placeholder="Görev/pozisyonunuz"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience and Motivation */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Deneyim ve Motivasyon</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="experience">İlgili Deneyim</Label>
                        <Textarea
                          id="experience"
                          {...form.register("experience")}
                          placeholder="Bu etkinlik konusunda sahip olduğunuz deneyim ve arka planınızı kısaca açıklayın"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="motivation">Katılım Motivasyonu *</Label>
                        <Textarea
                          id="motivation"
                          {...form.register("motivation")}
                          placeholder="Bu etkinliğe neden katılmak istiyorsunuz? Bu etkinlikten beklentileriniz nelerdir?"
                          rows={4}
                        />
                        {form.formState.errors.motivation && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.motivation.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ek Bilgiler</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dietaryRequirements">Beslenme Kısıtları</Label>
                        <Input
                          id="dietaryRequirements"
                          {...form.register("dietaryRequirements")}
                          placeholder="Varsa beslenme kısıtlarınızı belirtin (vejetaryen, vegan, alerji vb.)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="additionalNotes">Ek Notlar</Label>
                        <Textarea
                          id="additionalNotes"
                          {...form.register("additionalNotes")}
                          placeholder="Eklemek istediğiniz başka bir bilgi varsa buraya yazabilirsiniz"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-ginova-orange hover:bg-ginova-orange/90"
                  >
                    {isSubmitting ? (
                      <>Başvuru Gönderiliyor...</>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Başvuruyu Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Event Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Başvurduğunuz Etkinlik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-itu-blue" />
                    <span className="text-sm">
                      {format(eventDate, "dd MMMM yyyy, EEEE", { locale: tr })}
                    </span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-itu-blue" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {event.isOnline ? (
                      <Globe className="h-4 w-4 text-itu-blue" />
                    ) : (
                      <MapPin className="h-4 w-4 text-itu-blue" />
                    )}
                    <span className="text-sm">
                      {event.isOnline && "🔗 "}{event.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Başvuru Sonrası</h4>
                <p className="text-sm text-gray-600">
                  Başvurunuz alındıktan sonra 2-3 iş günü içinde e-posta ile onay mesajı alacaksınız.
                  Sorularınız için ginova@itu.edu.tr adresine yazabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}