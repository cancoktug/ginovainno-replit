import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  Camera
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Link } from "wouter";

export default function EventDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);


  
  const { data: event, isLoading, error } = useQuery<Event>({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
            </div>
            
            {/* Register Button Skeleton */}
            <div className="mt-8">
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && (!event || error)) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.</p>
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

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPastEvent = eventDate < now;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/etkinlikler">
            <Button variant="ghost" className="p-0 text-itu-blue hover:text-itu-blue/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Etkinliklere Dön
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.image && (
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {isPastEvent && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                      Tamamlandı
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Event Title and Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Gallery */}
            {event.gallery && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="h-6 w-6 text-itu-blue" />
                  <h3 className="text-xl font-semibold text-gray-900">Etkinlik Fotoğrafları</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.split(',').map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const images = event.gallery!.split(',').map(url => url.trim());
                        setGalleryImages(images);
                        setSelectedImageIndex(index);
                      }}
                    >
                      <img
                        src={imageUrl.trim()}
                        alt={`${event.title} - Fotoğraf ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white bg-opacity-90 rounded-full p-2">
                            <Camera className="h-4 w-4 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Button for Desktop */}
            {!isPastEvent && event.registrationUrl && (
              <div className="lg:hidden">
                <Card>
                  <CardContent className="p-6">
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button size="lg" className="w-full bg-ginova-orange hover:bg-ginova-orange/90">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Etkinliğe Kayıt Ol
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                    <p className="text-sm text-gray-500 text-center mt-3">
                      Kayıt ücretsizdir ve onay gerektirmez
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Etkinlik Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-itu-blue" />
                  <div>
                    <p className="font-medium">Tarih</p>
                    <p className="text-sm text-gray-600">
                      {format(eventDate, "dd MMMM yyyy, EEEE", { locale: tr })}
                    </p>
                  </div>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Saat</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {event.isOnline ? (
                    <Globe className="h-5 w-5 text-itu-blue" />
                  ) : (
                    <MapPin className="h-5 w-5 text-itu-blue" />
                  )}
                  <div>
                    <p className="font-medium">Konum</p>
                    <p className="text-sm text-gray-600">
                      {event.isOnline && "🔗 "}{event.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Card */}
            {!isPastEvent && event.registrationUrl && (
              <Card className="hidden lg:block">
                <CardHeader>
                  <CardTitle className="text-lg text-center">Katılım</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button size="lg" className="w-full bg-ginova-orange hover:bg-ginova-orange/90">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Etkinliğe Kayıt Ol
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-sm text-gray-500 text-center">
                    Kayıt ücretsizdir ve onay gerektirmez
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Past Event Message */}
            {isPastEvent && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Etkinlik Tamamlandı</h3>
                  <p className="text-sm text-gray-600">
                    Bu etkinlik {format(eventDate, "dd MMMM yyyy", { locale: tr })} tarihinde gerçekleştirildi.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Etkinlik hakkında sorularınız için:
                </p>
                <p className="font-medium text-itu-blue mt-2">
                  ginova@itu.edu.tr
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`Fotoğraf ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}