import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero-section";
import ProgramCard from "@/components/program-card";
import MentorCard from "@/components/mentor-card";
import EventCard from "@/components/event-card";
import BlogCard from "@/components/blog-card";
import { programsApi, mentorsApi, eventsApi, blogApi } from "@/lib/api";
import type { Program, Mentor, Event, BlogPost } from "@shared/schema";

export default function Home() {
  const { data: allPrograms, isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: [programsApi.getAll()],
  });

  // Filter published programs on client side temporarily
  const programs = allPrograms?.filter(p => p.isPublished)?.slice(0, 3) || [];

  const { data: mentors, isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: [mentorsApi.getAll()],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: [blogApi.getAll()],
  });

  const featuredPrograms = programs?.slice(0, 3) ?? [];
  const featuredMentors = mentors?.slice(0, 4) ?? [];
  // Filter upcoming events (events from today onwards)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of day for more inclusive filtering  
  const upcomingEvents = events?.filter(event => new Date(event.date) >= now)?.slice(0, 4) ?? [];
  // Featured posts for homepage (excluding news)
  const featuredPosts = blogPosts?.filter(post => 
    post.category.toLowerCase() !== 'news' && 
    post.category.toLowerCase() !== 'haber' &&
    post.category.toLowerCase() !== 'etkinlik'
  )?.slice(0, 3) ?? [];
  
  // Featured news for homepage (last 4 news articles)
  const featuredNews = blogPosts?.filter(post => 
    post.category.toLowerCase() === 'news' || 
    post.category.toLowerCase() === 'haber' ||
    post.category.toLowerCase() === 'etkinlik'
  )
    ?.sort((a, b) => {
      // Use publishedAt if available, otherwise use createdAt
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    ?.slice(0, 4) ?? [];

  return (
    <div>
      <HeroSection />

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Son Haberler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İTÜ Ginova'dan en güncel haberler ve duyurular
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : featuredNews.length > 0 ? (
              featuredNews.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Henüz haber bulunmuyor.</p>
                <p className="text-gray-400 text-sm mt-2">Yakında haberler paylaşılacak.</p>
              </div>
            )}
          </div>

          {!blogLoading && featuredNews.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/blog?category=news">
                <Button size="lg" className="bg-ginova-orange hover:bg-ginova-orange/90">
                  Tüm Haberleri Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Ginova Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              İTÜ Girişimcilik ve İnovasyon Merkezi
            </h2>
            
            <div className="max-w-5xl mx-auto space-y-6 text-lg text-gray-700">
              <p className="leading-relaxed">
                <strong className="text-itu-blue">İTÜ Ginova</strong>, 2014 yılından bu yana İstanbul Teknik Üniversitesi 
                bünyesinde faaliyet gösteren <strong>Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi</strong> olarak, 
                Türkiye'nin teknoloji ekosisteminde öncü bir rol üstlenmektedir.
              </p>
              
              <p className="leading-relaxed">
                Merkezimiz, <strong>iş dünyası</strong>, <strong>girişimci adayları</strong> ve <strong>akademik camia</strong> 
                arasında güçlü bir köprü oluşturarak, yenilikçi fikirlerin ticari değere dönüştürülmesi sürecinde 
                kapsamlı destek sağlamaktadır. İTÜ'nün köklü akademik birikimi ve teknolojik altyapısından yararlanarak, 
                sürdürülebilir inovasyon kültürünün geliştirilmesine katkıda bulunmaktayız.
              </p>
              
              <p className="leading-relaxed">
                Eğitim programları, mentörlük hizmetleri, araştırma projeleri ve sektörel iş birlikteleri aracılığıyla, 
                <strong>teknoloji tabanlı girişimciliği</strong> desteklemekte ve girişimci ekosisteminin güçlenmesine 
                öncülük etmekteyiz.
              </p>
            </div>

            {/* Hizmetlerimiz Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-itu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-itu-blue rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Eğitim Programları
                  </h3>
                  <p className="text-gray-600">
                    Girişimcilik, inovasyon ve teknoloji odaklı kapsamlı eğitim programları
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ginova-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-ginova-orange rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Mentörlük
                  </h3>
                  <p className="text-gray-600">
                    Deneyimli mentörlerden bire bir rehberlik ve sektörel deneyim aktarımı
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-itu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-itu-blue rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Etkinlikler & Networking
                  </h3>
                  <p className="text-gray-600">
                    Girişimcilik ekosistemini güçlendiren etkinlikler ve ağ kurma fırsatları
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ginova-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-ginova-orange rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    İTÜ Teknoloji Avantajı
                  </h3>
                  <p className="text-gray-600">
                    Türkiye'nin önde gelen teknik üniversitesinin kaynaklarına erişim imkanı
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <Link href="/hakkimizda">
                <Button 
                  size="lg" 
                  className="bg-itu-blue hover:bg-itu-blue/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Daha Fazlası İçin Hakkımızda Sayfasını Ziyaret Edin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Eğitim Programlarımız</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Girişimcilik yolculuğunuzda ihtiyacınız olan tüm beceri ve bilgileri kazandıran kapsamlı programlar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : featuredPrograms.length > 0 ? (
              featuredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Henüz program bulunmuyor.</p>
                <p className="text-gray-400 text-sm mt-2">Yakında yeni programlar eklenecek.</p>
              </div>
            )}
          </div>

          {!programsLoading && featuredPrograms.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/programlar">
                <Button size="lg" className="bg-ginova-orange hover:bg-ginova-orange/90">
                  Tüm Programları Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mentörlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sektörün en deneyimli isimlerinden rehberlik alın
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentorsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ))
            ) : featuredMentors.length > 0 ? (
              featuredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Henüz mentör bulunmuyor.</p>
                <p className="text-gray-400 text-sm mt-2">Yakında mentör profilleri eklenecek.</p>
              </div>
            )}
          </div>

          {!mentorsLoading && featuredMentors.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/mentors">
                <Button size="lg" className="bg-itu-blue hover:bg-itu-blue/90">
                  Tüm Mentörleri Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Yaklaşan Etkinlikler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Girişimcilik ekosistemindeki en güncel gelişmeleri takip edin
            </p>
          </div>
          
          <div className="space-y-6">
            {eventsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="w-1/3 h-64" />
                  <div className="w-2/3 p-8 space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Yaklaşan etkinlik bulunmuyor.</p>
                <p className="text-gray-400 text-sm mt-2">Yeni etkinlikler için duyurularımızı takip edin.</p>
              </div>
            )}
          </div>

          {!eventsLoading && upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/etkinlikler">
                <Button size="lg" className="bg-ginova-orange hover:bg-ginova-orange/90">
                  Tüm Etkinlikleri Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>



      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Blog Yazıları</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Girişimcilik dünyasından uzman görüşleri ve rehber içerikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Henüz blog yazısı bulunmuyor.</p>
                <p className="text-gray-400 text-sm mt-2">Yakında ilginç içerikler paylaşılacak.</p>
              </div>
            )}
          </div>

          {!blogLoading && featuredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button size="lg" className="bg-itu-blue hover:bg-itu-blue/90">
                  Tüm İçerikleri Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 animated-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Girişimcilik Yolculuğunuza Bugün Başlayın
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            Fikirlerinizi gerçeğe dönüştürmek için gereken tüm desteği ve kaynakları sağlıyoruz. 
            Ginova topluluğuna katılın ve geleceğin teknolojilerini bugünden keşfedin.
          </p>
          <div className="flex justify-center">
            <Link href="/iletisim">
              <Button 
                size="lg" 
                className="bg-ginova-orange text-white hover:bg-ginova-orange/90 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                İletişime Geç
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
