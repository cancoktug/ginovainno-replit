import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/rich-text-editor";
import ImageUpload from "@/components/image-upload";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle,
  Save,
  Send,
  X,
  ArrowLeft,
  Upload,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

// Blog Image Gallery Component
function BlogImageGallery({ 
  images, 
  featuredImage, 
  onImagesChange 
}: { 
  images: string[]; 
  featuredImage: string; 
  onImagesChange: (images: string[], featuredImage: string) => void; 
}) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const [selectedFeatured, setSelectedFeatured] = useState<string>(featuredImage);

  // Update local state when props change (for editing existing posts)
  React.useEffect(() => {
    setUploadedImages(images);
  }, [images]);

  React.useEffect(() => {
    setSelectedFeatured(featuredImage);
  }, [featuredImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Simulating image upload - in real app, this would upload to server
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = `/api/media/blog/${file.name}`;
        const newImages = [...uploadedImages, imageUrl];
        setUploadedImages(newImages);
        
        // If no featured image selected, make first uploaded image featured
        const newFeatured = selectedFeatured || imageUrl;
        setSelectedFeatured(newFeatured);
        
        onImagesChange(newImages, newFeatured);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (imageToRemove: string) => {
    const newImages = uploadedImages.filter(img => img !== imageToRemove);
    setUploadedImages(newImages);
    
    // If removed image was featured, select first remaining image or empty
    let newFeatured = selectedFeatured;
    if (selectedFeatured === imageToRemove) {
      newFeatured = newImages[0] || "";
      setSelectedFeatured(newFeatured);
    }
    
    onImagesChange(newImages, newFeatured);
  };

  const handleSetFeatured = (imageUrl: string) => {
    setSelectedFeatured(imageUrl);
    onImagesChange(uploadedImages, imageUrl);
  };

  console.log('BlogImageGallery render:', { 
    uploadedImages, 
    selectedFeatured, 
    images, 
    featuredImage,
    propsImages: images,
    propsGallery: images.join(',')
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Blog Görselleri</Label>
        <div className="mt-2">
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 h-20"
          >
            <Upload className="h-6 w-6 mr-2" />
            Görsel Yükle (Çoklu seçim yapabilirsiniz)
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          JPG, PNG, GIF formatlarında görsel yükleyebilirsiniz. İlk görsel otomatik olarak öne çıkan görsel olur.
        </p>
      </div>

      {(uploadedImages.length > 0 || images.length > 0) && (
        <div className="space-y-3">
          <Label>Blog Görselleri</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className={`relative border-2 rounded-lg overflow-hidden ${
                  selectedFeatured === imageUrl ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                }`}>
                  <img
                    src={imageUrl}
                    alt={`Blog görseli ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      // Handle image loading errors gracefully
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {selectedFeatured === imageUrl && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Öne Çıkan
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(imageUrl)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {selectedFeatured !== imageUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetFeatured(imageUrl)}
                    className="w-full mt-1 text-xs"
                  >
                    Öne Çıkan Yap
                  </Button>
                )}
                
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {imageUrl.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Öne Çıkan Görsel:</strong> {selectedFeatured ? 
              selectedFeatured.split('/').pop() : 
              'Henüz seçilmedi'
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<InsertBlogPost> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/blog/all"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (post: InsertBlogPost) => {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      toast({
        title: "Başarılı",
        description: "Blog yazısı oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Blog yazısı oluşturulamadı",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...post }: Partial<InsertBlogPost> & { id: number }) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      toast({
        title: "Başarılı",
        description: "Blog yazısı güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Blog yazısı güncellenemedi",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Başarılı",
        description: "Blog yazısı silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Blog yazısı silinemedi",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    // Auto-populate author with logged-in user's full name
    const authorName = user ? `${user.firstName} ${user.lastName}` : "Admin";
    
    setEditingPost({
      title: "",
      content: "",
      excerpt: "",
      category: "blog",
      image: "",
      author: authorName,
      isPublished: false,
    });
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  };

  const handleSavePost = (isDraft: boolean = false) => {
    if (!editingPost) return;

    // Generate slug from title if not editing (creating new post)
    const slug = editingPost.id ? editingPost.slug : generateSlug(editingPost.title || '');

    const postData = {
      ...editingPost,
      slug,
      isPublished: !isDraft,
      // Don't send publishedAt for drafts, let backend handle it for published posts
      ...(isDraft ? {} : {}),
    };

    // Remove publishedAt from client data - let backend handle it
    const { publishedAt, ...dataWithoutDate } = postData;

    if (editingPost.id) {
      updatePostMutation.mutate({ id: editingPost.id, ...dataWithoutDate });
    } else {
      createPostMutation.mutate(dataWithoutDate as InsertBlogPost);
    }
  };

  const filteredPosts = blogPosts
    .filter((post: BlogPost) => {
      switch (activeTab) {
        case "published":
          return post.isPublished;
        case "draft":
          return !post.isPublished;
        default:
          return true;
      }
    })
    .sort((a: BlogPost, b: BlogPost) => {
      // Sort by publishedAt for published posts, createdAt for drafts, newest first
      const aDate = a.isPublished && a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
      const bDate = b.isPublished && b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Yayınlandı</Badge>;
      case "draft":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Taslak</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400">Blog yazılarını yönetin</p>
        </div>
        <Button onClick={handleCreatePost} className="bg-itu-blue hover:bg-itu-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tümü ({blogPosts.length})</TabsTrigger>
          <TabsTrigger value="published">
            Yayınlanan ({blogPosts.filter((p: BlogPost) => p.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Taslak ({blogPosts.filter((p: BlogPost) => !p.isPublished).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.map((post: BlogPost) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <Badge variant={post.isPublished ? "default" : "secondary"}>
                          {post.isPublished ? "Yayınlanmış" : "Taslak"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Kategori: {
                          post.category === 'blog' ? 'Blog' :
                          post.category === 'news' ? 'Haberler' :
                          post.category === 'guides' ? 'Rehberler' :
                          post.category
                        }</span>
                        <span>
                          {(() => {
                            try {
                              if (post.isPublished && post.publishedAt) {
                                const pubDate = new Date(post.publishedAt);
                                return `Yayın: ${format(pubDate, "d MMMM yyyy", { locale: tr })}`;
                              } else if (post.createdAt) {
                                const createDate = new Date(post.createdAt);
                                return `Oluşturma: ${format(createDate, "d MMMM yyyy", { locale: tr })}`;
                              }
                              return 'Tarih bilgisi yok';
                            } catch (error) {
                              console.error('Date formatting error:', error, post);
                              return 'Geçersiz tarih';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPost(post)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Yazıyı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{post.title}" yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePostMutation.mutate(post.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost?.id ? "Yazı Düzenle" : "Yeni Yazı Oluştur"}
            </DialogTitle>
          </DialogHeader>
          
          {editingPost && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={editingPost.title || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="Yazı başlığı"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={editingPost.category || "blog"}
                    onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="news">Haberler</SelectItem>
                      <SelectItem value="guides">Rehberler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="excerpt">Özet</Label>
                  <Input
                    id="excerpt"
                    value={editingPost.excerpt || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    placeholder="Yazının kısa özeti"
                  />
                </div>
                
                {/* Author field - editable for admin users */}
                {user?.role === 'admin' && (
                  <div>
                    <Label htmlFor="author">Yazar</Label>
                    <Input
                      id="author"
                      value={editingPost.author || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="Yazar adı"
                    />
                  </div>
                )}
              </div>

              <BlogImageGallery
                images={(() => {
                  // If gallery exists, use it
                  if (editingPost.gallery && editingPost.gallery.trim()) {
                    return editingPost.gallery.split(',').map(url => url.trim()).filter(Boolean);
                  }
                  // If no gallery but has featured image, include featured image in gallery
                  if (editingPost.image && editingPost.image.trim()) {
                    return [editingPost.image.trim()];
                  }
                  return [];
                })()}
                featuredImage={editingPost.image || ""}
                onImagesChange={(images, featuredImage) => {
                  console.log('Images changed:', images, 'Featured:', featuredImage);
                  setEditingPost({ 
                    ...editingPost, 
                    gallery: images.length > 0 ? images.join(', ') : '',
                    image: featuredImage
                  });
                }}
              />

              <div>
                <Label htmlFor="content">İçerik</Label>
                <RichTextEditor
                  content={editingPost.content || ""}
                  onChange={(content) => setEditingPost({ ...editingPost, content })}
                  placeholder="Yazı içeriğini buraya yazın..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  İptal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSavePost(true)}
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Taslak Kaydet
                </Button>
                <Button
                  onClick={() => handleSavePost(false)}
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  className="bg-itu-blue hover:bg-itu-blue/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Yayınla
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yazı Önizlemesi</DialogTitle>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedPost.excerpt}</p>
                </div>
                {getStatusBadge(selectedPost.status)}
              </div>
              
              {selectedPost.image && (
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPost(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}