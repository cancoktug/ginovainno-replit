import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import StartupCard from "@/components/startup-card";
import { startupsApi } from "@/lib/api";
import type { Startup } from "@shared/schema";

export default function Startups() {
  const { data: startups, isLoading } = useQuery<Startup[]>({
    queryKey: [startupsApi.getAll()],
  });

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
            Başarılı Girişimlerimiz
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow-strong">
            Ginova ekosisteminden çıkan ve dünyaya değer katan başarılı girişimleri keşfedin. 
            Onların hikayelerinden ilham alın.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm">Başarılı Girişim</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₺25M+</div>
              <div className="text-sm">Toplam Yatırım</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-sm">İstihdam</div>
            </div>
          </div>
        </div>
      </section>

      {/* Startups Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : startups && startups.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Henüz Girişim Bulunmuyor
              </h3>
              <p className="text-gray-500 mb-8">
                Başarılı girişim hikayelerimiz derleniyor. Yakında ilham verici projeler paylaşılacak.
              </p>
              <p className="text-sm text-gray-400">
                Siz de girişiminizi Ginova ekosisteminde büyütmek istiyorsanız programlarımıza katılın.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
