import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramCard from "@/components/program-card";
import { programsApi } from "@/lib/api";
import type { Program } from "@shared/schema";

export default function Programs() {
  const { data: allPrograms, isLoading } = useQuery<Program[]>({
    queryKey: [programsApi.getAll()],
  });

  // Filter published programs on client side temporarily
  const programs = allPrograms?.filter(p => p.isPublished) || [];

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
            Eğitim Programları
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow-strong">
            Girişimcilik becerilerinizi geliştirmek ve projenizi hayata geçirmek için 
            tasarlanmış kapsamlı eğitim programlarımızı keşfedin.
          </p>
          
          {/* Stats or CTA could go here */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5+</div>
              <div className="text-sm">Farklı Program</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">350+</div>
              <div className="text-sm">Mezun Girişimci</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : programs && programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Henüz Program Bulunmuyor
              </h3>
              <p className="text-gray-500 mb-8">
                Eğitim programlarımız hazırlanıyor. Yakında yeni programlar eklenecek.
              </p>
              <p className="text-sm text-gray-400">
                Güncellemeler için sosyal medya hesaplarımızı takip edebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
