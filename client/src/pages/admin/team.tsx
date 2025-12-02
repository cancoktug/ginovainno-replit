import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, ExternalLink, ChevronUp, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { OptimizedImageUploader } from "@/components/OptimizedImageUploader";
import { insertTeamMemberSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type TeamMember = {
  id: number;
  name: string;
  title: string;
  image: string;
  bio?: string;
  linkedin?: string;
  email?: string;
  isBoard: boolean;
  category: string; // 'yonetim', 'ekip', 'danisma'
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const teamMemberFormSchema = insertTeamMemberSchema.extend({
  image: z.string().min(1, "Fotoğraf URL'si gereklidir"),
  category: z.enum(["yonetim", "ekip", "danisma"], {
    required_error: "Kategori seçimi zorunludur"
  })
});

type TeamMemberForm = z.infer<typeof teamMemberFormSchema>;

export default function AdminTeam() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [extractingLinkedIn, setExtractingLinkedIn] = useState(false);

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
    staleTime: 0, // Don't use cached data
    refetchOnMount: true, // Always refetch when mounting
  });

  const form = useForm<TeamMemberForm>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      title: "",
      image: "",
      bio: "",
      linkedin: "",
      email: "",
      isBoard: false,
      category: "ekip",
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TeamMemberForm) => {
      const response = await apiRequest("POST", "/api/team", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Ekip üyesi eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TeamMemberForm & { id: number }) => {
      const { id, ...updateData } = data;
      const response = await apiRequest("PUT", `/api/team/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      setIsDialogOpen(false);
      setEditingMember(null);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Ekip üyesi güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({
        title: "Başarılı",
        description: "Ekip üyesi silindi.",
      });
    },
    onError: (error: any) => {
      const message = error.status === 403 
        ? error.data?.message || "Bu işlem için yetkiniz yoktur"
        : error.message || "Ekip üyesi silinemedi.";
      
      toast({
        title: "Hata",
        description: message,
        variant: "destructive",
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, order }: { id: number; order: number }) => {
      const response = await apiRequest("PUT", `/api/team/${id}`, { order });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: TeamMemberForm) => {
    if (editingMember) {
      updateMutation.mutate({ ...data, id: editingMember.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
      name: member.name,
      title: member.title,
      image: member.image,
      bio: member.bio || "",
      linkedin: member.linkedin || "",
      email: member.email || "",
      isBoard: member.isBoard,
      category: (member.category || "ekip") as "yonetim" | "ekip" | "danisma",
      order: member.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bu ekip üyesini silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOrderChange = (id: number, direction: 'up' | 'down') => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    const newOrder = direction === 'up' ? member.order - 1 : member.order + 1;
    updateOrderMutation.mutate({ id, order: newOrder });
  };

  const handleAddNew = () => {
    setEditingMember(null);
    form.reset({
      name: "",
      title: "",
      image: "",
      bio: "",
      linkedin: "",
      email: "",
      isBoard: false,
      order: teamMembers.length,
    });
    setIsDialogOpen(true);
  };

  const extractLinkedInPhoto = async () => {
    const linkedinUrl = form.watch("linkedin");
    
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
      toast({
        title: "Hata",
        description: "Geçerli bir LinkedIn profil URL'si girin",
        variant: "destructive",
      });
      return;
    }

    setExtractingLinkedIn(true);
    try {
      const response = await apiRequest("POST", "/api/team/extract-linkedin", {
        linkedinUrl: linkedinUrl
      });
      const data = await response.json();

      if (data.profilePhoto) {
        form.setValue("image", data.profilePhoto);
        const isGenerated = data.profilePhoto.includes('ui-avatars.com');
        toast({
          title: "Başarılı",
          description: isGenerated 
            ? "LinkedIn fotoğrafı bulunamadı, isim baş harflerinden avatar oluşturuldu"
            : "LinkedIn profil fotoğrafı otomatik olarak alındı",
        });
      } else {
        toast({
          title: "Uyarı", 
          description: "LinkedIn profil bilgileri alınamadı. Manuel olarak giriniz.",
          variant: "destructive",
        });
      }

      // Otomatik ad ve unvan doldurma (isteğe bağlı)
      if (data.name && !form.watch("name")) {
        form.setValue("name", data.name);
      }
      if (data.title && !form.watch("title")) {
        form.setValue("title", data.title);
      }

    } catch (error) {
      toast({
        title: "Hata",
        description: "LinkedIn bilgileri alınamadı",
        variant: "destructive",
      });
    } finally {
      setExtractingLinkedIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ekip Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yönetim ekibi üyelerini düzenleyin
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Üye Ekle
        </Button>
      </div>

      <div className="grid gap-4">
        {sortedMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Image load error for:', member.image);
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2364748b'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' font-weight='bold' text-anchor='middle' dy='0.35em' fill='white'%3E${member.name.split(' ').map(n => n[0]).join('').slice(0,2)}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    {member.isBoard && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Yönetim Kurulu
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{member.title}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        LinkedIn
                      </a>
                    )}
                    {member.email && (
                      <span className="text-gray-500 text-sm">{member.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOrderChange(member.id, 'up')}
                      disabled={member.order === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOrderChange(member.id, 'down')}
                      disabled={member.order === teamMembers.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Henüz ekip üyesi eklenmemiş
          </p>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            İlk Üye Ekle
          </Button>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Ekip Üyesini Düzenle" : "Yeni Ekip Üyesi Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Örn: Ahmet Yılmaz"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="title">Unvan *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Örn: Genel Müdür"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn Profil URL</Label>
              <div className="flex gap-2">
                <Input
                  id="linkedin"
                  {...form.register("linkedin")}
                  placeholder="https://www.linkedin.com/in/username"
                  type="url"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={extractLinkedInPhoto}
                  disabled={extractingLinkedIn || !form.watch("linkedin")}
                  className="shrink-0"
                >
                  {extractingLinkedIn ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                LinkedIn profil bilgilerini almak için URL girdikten sonra indir butonuna tıklayın. 
                Fotoğraf bulunamazsa isim baş harflerinden otomatik avatar oluşturulur.
              </p>
            </div>

            <div>
              <Label htmlFor="image">Profil Fotoğrafı *</Label>
              <div className="space-y-3">
                <OptimizedImageUploader
                  maxFileSizeMB={100}
                  onComplete={(imageUrl) => {
                    form.setValue("image", imageUrl);
                  }}
                  buttonClassName="w-full bg-green-600 hover:bg-green-700"
                >
                  <span className="flex items-center gap-2">
                    📸 Fotoğraf Yükle
                    <span className="text-xs opacity-75">(Otomatik optimize)</span>
                  </span>
                </OptimizedImageUploader>
                
                <div className="text-sm text-gray-600">
                  <p>veya manuel URL girin:</p>
                </div>
                
                <Input
                  id="image"
                  {...form.register("image")}
                  placeholder="https://example.com/photo.jpg"
                />
                
                {form.watch("image") && (
                  <div className="mt-2">
                    <img 
                      src={form.watch("image")} 
                      alt="Önizleme" 
                      className="w-24 h-24 object-cover rounded-full border"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13.5C14.8 13.3 14.6 13.2 14.4 13.1L20 7.6V9H21ZM12 8C15.86 8 19 11.13 19 15C19 18.86 15.86 22 12 22C8.13 22 5 18.86 5 15C5 11.13 8.13 8 12 8Z'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>
              {form.formState.errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                placeholder="Kısa biyografi..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                {...form.register("email")}
                placeholder="ornek@itu.edu.tr"
                type="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => {
                    form.setValue("category", value as "yonetim" | "ekip" | "danisma");
                    // Yönetim kurulu seçilirse isBoard'ı true yap
                    form.setValue("isBoard", value === "yonetim");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yonetim">Yönetim Kurulu</SelectItem>
                    <SelectItem value="ekip">Ekip</SelectItem>
                    <SelectItem value="danisma">Danışma Kurulu</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="order">Sıralama</Label>
                <Input
                  id="order"
                  {...form.register("order", { valueAsNumber: true })}
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Kaydediliyor..."
                  : editingMember
                  ? "Güncelle"
                  : "Ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}