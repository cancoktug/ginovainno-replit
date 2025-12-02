import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/blog-card";
import { blogApi } from "@/lib/api";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = urlParams.get('category');
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: [blogApi.getAll()],
  });

  // Apply category filter if present
  let filteredPosts = posts || [];
  if (categoryFilter === 'news') {
    filteredPosts = posts?.filter(post => 
      post.category.toLowerCase() === 'news' || 
      post.category.toLowerCase() === 'etkinlik' ||
      post.category.toLowerCase() === 'haber'
    ) || [];
  }

  const newsPosts = filteredPosts.filter(post => 
    post.category.toLowerCase() === 'news' || 
    post.category.toLowerCase() === 'etkinlik' ||
    post.category.toLowerCase() === 'haber'
  );
  const blogPosts = filteredPosts.filter(post => post.category.toLowerCase() === 'blog');
  const guidePosts = filteredPosts.filter(post => post.category.toLowerCase() === 'guides');

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
            Haberler & Blog
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow-strong">
            Girişimcilik dünyasından son gelişmeler, uzman görüşleri ve 
            pratik rehberlerle bilginizi güncel tutun.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm">Blog Yazısı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-sm">Okuyucu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">25+</div>
              <div className="text-sm">Uzman Yazar</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-16">
              {Array.from({ length: 3 }).map((_, sectionIndex) => (
                <div key={sectionIndex}>
                  <Skeleton className="h-8 w-48 mb-8" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="aspect-video w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-16">
              {/* News Posts */}
              {newsPosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Haberler</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {blogPosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Blog Yazıları</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Guide Posts */}
              {guidePosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Rehberler</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guidePosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts if no categories */}
              {newsPosts.length === 0 && blogPosts.length === 0 && guidePosts.length === 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Tüm İçerikler</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Henüz İçerik Bulunmuyor
              </h3>
              <p className="text-gray-500 mb-8">
                Blog yazılarımız ve haberlerimiz hazırlanıyor. Yakında ilginç içerikler paylaşılacak.
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
