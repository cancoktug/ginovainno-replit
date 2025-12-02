import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/event-card";
import { eventsApi } from "@/lib/api";
import type { Event } from "@shared/schema";

export default function Events() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Filter events by date - use start of day for more inclusive filtering
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvents = events?.filter(event => new Date(event.date) >= now) || [];
  const pastEvents = events?.filter(event => new Date(event.date) < now) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative animated-gradient py-24 overflow-hidden">
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 backdrop-overlay"></div>
        
        {/* Floating geometric shapes with animation */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight text-shadow-strong">
            Etkinlikler
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow-strong">
            Girişimcilik ekosistemindeki networking, eğitim ve gelişim etkinliklerimize katılın. 
            Yeni bağlantılar kurun ve bilginizi artırın.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-sm">Etkinlik</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-sm">Katılımcı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm">Konuşmacı</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex">
                      <Skeleton className="w-1/3 h-64" />
                      <div className="w-2/3 p-8 space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-16">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Yaklaşan Etkinlikler</h2>
                  <div className="space-y-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Geçmiş Etkinlikler</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Henüz Etkinlik Bulunmuyor
              </h3>
              <p className="text-gray-500 mb-8">
                Etkinlik programımız hazırlanıyor. Yakında heyecan verici etkinlikler düzenlenecek.
              </p>
              <p className="text-sm text-gray-400">
                Etkinliklerden haberdar olmak için sosyal medya hesaplarımızı takip edin.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
