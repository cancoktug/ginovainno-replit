import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, User, Share2, Facebook, Twitter, Mail, MessageCircle, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";

export default function BlogDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Social sharing functions
  const getCurrentUrl = () => window.location.href;
  
  const shareOnFacebook = (title: string) => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = (title: string) => {
    const url = encodeURIComponent(getCurrentUrl());
    const text = encodeURIComponent(`${title} - İTÜ Ginova`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnWhatsApp = (title: string) => {
    const text = encodeURIComponent(`${title} - İTÜ Ginova\n\n${getCurrentUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnPinterest = (title: string, imageUrl: string) => {
    const url = encodeURIComponent(getCurrentUrl());
    const description = encodeURIComponent(`${title} - İTÜ Ginova`);
    const media = encodeURIComponent(window.location.origin + imageUrl);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`, '_blank');
  };

  const shareViaEmail = (title: string, excerpt: string) => {
    const subject = encodeURIComponent(`${title} - İTÜ Ginova`);
    const body = encodeURIComponent(`Merhaba,\n\nBu blog yazısını sizinle paylaşmak istiyorum:\n\n${title}\n\n${excerpt}\n\nDevamını okumak için: ${getCurrentUrl()}\n\nİyi okumalar!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/slug/${slug}`);
      if (!response.ok) {
        throw new Error("Blog yazısı bulunamadı");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-itu-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Blog'a Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(post.publishedAt);
  const formattedDate = format(publishedDate, "d MMMM yyyy", { locale: tr });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "news":
        return "bg-light-orange text-ginova-orange";
      case "blog":
        return "bg-light-blue text-itu-blue";
      case "guides":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case "news":
        return "Haber";
      case "blog":
        return "Blog";
      case "guides":
        return "Rehber";
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[21/9] relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Link href="/blog">
                <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Blog'a Dön
                </Button>
              </Link>
              
              <div className="flex items-center mb-4">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <div className="flex items-center text-white/80 text-sm ml-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                {post.excerpt}
              </p>
              
              <div className="flex items-center text-white/80">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Gallery Section */}
            {post.gallery && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <Camera className="h-6 w-6 text-itu-blue" />
                  <h3 className="text-2xl font-bold text-gray-900">Fotoğraf Galerisi</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.gallery.split(',').map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const images = post.gallery!.split(',').map(url => url.trim());
                        setGalleryImages(images);
                        setSelectedImageIndex(index);
                      }}
                    >
                      <img
                        src={imageUrl.trim()}
                        alt={`${post.title} - Fotoğraf ${index + 1}`}
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
            
            {/* Social Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Bu içeriği paylaşmaya ne dersin?
                </h3>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => shareOnFacebook(post.title)}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-3"
                    size="lg"
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    Facebook
                  </Button>
                  
                  <Button
                    onClick={() => shareOnTwitter(post.title)}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3"
                    size="lg"
                  >
                    <Twitter className="h-5 w-5 mr-2" />
                    X (Twitter)
                  </Button>
                  
                  <Button
                    onClick={() => shareOnWhatsApp(post.title)}
                    className="bg-[#25D366] hover:bg-[#22C55E] text-white px-6 py-3"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => shareOnPinterest(post.title, window.location.origin + post.image)}
                    className="bg-[#E60023] hover:bg-[#D50E2D] text-white px-6 py-3"
                    size="lg"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.224.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                    Pinterest
                  </Button>
                  
                  <Button
                    onClick={() => shareViaEmail(post.title, post.excerpt)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3"
                    size="lg"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    E-posta
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Bu yazıyı arkadaşlarınızla paylaşarak girişimcilik ekosistemini büyütmeye katkıda bulunun!
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button size="lg" className="bg-itu-blue hover:bg-itu-blue/90">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Tüm Blog Yazılarını Gör
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImageIndex(null)}>
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <X className="h-6 w-6 text-gray-800" />
            </button>
            
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </>
            )}
            
            <img 
              src={galleryImages[selectedImageIndex].trim()} 
              alt={`Blog Galerisi - Fotoğraf ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}