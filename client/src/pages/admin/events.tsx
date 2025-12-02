import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Event, InsertEvent } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import ImageUpload from "@/components/image-upload";

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<InsertEvent>>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    gallery: "",
    status: "upcoming",
    isOnline: false,
    registrationUrl: "",
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertEvent) => apiRequest("POST", "/api/events", data),
    onSuccess: () => {
      // Force cache invalidation for all event-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.refetchQueries({ queryKey: ["/api/events"] });
      toast({ title: "Başarılı", description: "Etkinlik oluşturuldu." });
      resetForm();
    },
    onError: () => {
      toast({ title: "Hata", description: "Etkinlik oluşturulamadı.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertEvent> }) =>
      apiRequest("PATCH", `/api/events/${id}`, data),
    onSuccess: () => {
      // Force cache invalidation for all event-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.refetchQueries({ queryKey: ["/api/events"] });
      toast({ title: "Başarılı", description: "Etkinlik güncellendi." });
      resetForm();
    },
    onError: () => {
      toast({ title: "Hata", description: "Etkinlik güncellenemedi.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Başarılı", description: "Etkinlik silindi." });
    },
    onError: (error: any) => {
      const message = error.status === 403 
        ? error.data?.message || "Bu işlem için yetkiniz yoktur"
        : "Etkinlik silinemedi.";
      
      toast({ title: "Hata", description: message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: "",
      gallery: "",
      status: "upcoming",
      isOnline: false,
      registrationUrl: "",
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date) {
      toast({ title: "Hata", description: "Gerekli alanları doldurun.", variant: "destructive" });
      return;
    }

    // Auto-generate slug from title (Turkish to English)
    const slug = formData.title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/türkiye/g, 'turkey')
      .replace(/istanbul/g, 'istanbul')
      .replace(/girişimcilik/g, 'entrepreneurship')
      .replace(/inovasyon/g, 'innovation')
      .replace(/teknoloji/g, 'technology')
      .replace(/startup/g, 'startup')
      .replace(/etkinlik/g, 'event')
      .replace(/workshop/g, 'workshop')
      .replace(/seminer/g, 'seminar')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const submitData = {
      ...formData,
      slug: editingEvent ? editingEvent.slug : slug,
      date: formData.date + (formData.time ? `T${formData.time}:00` : 'T00:00:00')
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: submitData });
    } else {
      createMutation.mutate(submitData as InsertEvent);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : "",
      time: event.time || "",
      location: event.location,
      image: event.image,
      gallery: event.gallery || "",
      status: event.status || "upcoming",
      isOnline: event.isOnline,
      registrationUrl: event.registrationUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (!event.isActive) {
      return <Badge variant="secondary">Pasif</Badge>;
    }
    
    if (eventDate < now) {
      return <Badge variant="outline">Tamamlandı</Badge>;
    }
    
    return <Badge className="bg-green-500">Aktif</Badge>;
  };

  if (isLoading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Etkinlik Yönetimi</h1>
          <p className="text-gray-600">Etkinlikleri yönetin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Etkinlik
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Etkinlik Düzenle" : "Yeni Etkinlik"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic">
                <TabsList>
                  <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                  <TabsTrigger value="details">Detaylar</TabsTrigger>
                  <TabsTrigger value="settings">Ayarlar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="title">Etkinlik Adı *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Etkinlik adını girin"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Etkinlik hakkında açıklama"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Etkinlik Tarihi *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Etkinlik Saati</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Konum</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Etkinlik konumu"
                    />
                  </div>

                  <ImageUpload
                    value={formData.image || ""}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    type="events"
                    label="Etkinlik Görseli"
                    placeholder="Etkinlik için görsel yükleyin"
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <Label htmlFor="registrationUrl">Kayıt URL'si</Label>
                    <Input
                      id="registrationUrl"
                      value={formData.registrationUrl}
                      onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                      placeholder="Kayıt için form URL'si"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isOnline"
                      checked={formData.isOnline}
                      onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                    />
                    <Label htmlFor="isOnline">Online Etkinlik</Label>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label htmlFor="status">Etkinlik Durumu</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Yaklaşan</SelectItem>
                        <SelectItem value="ongoing">Devam Eden</SelectItem>
                        <SelectItem value="completed">Tamamlanmış</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gallery">Etkinlik Galerisi (Virgülle Ayrılmış URL'ler)</Label>
                    <Textarea
                      id="gallery"
                      value={formData.gallery}
                      onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                      placeholder="/path/image1.jpg, /path/image2.jpg, /path/image3.jpg"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Geçmiş etkinliklerin fotoğrafları için görsel URL'lerini virgülle ayırarak girin
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingEvent ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {getStatusBadge(event)}
                    {event.isOnline && (
                      <Badge variant="outline">Online</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{event.description?.slice(0, 100)}...</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.date ? format(new Date(event.date), "dd MMM yyyy", { locale: tr }) : "Tarih belirtilmedi"}
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{event.isOnline ? "🔗 " : ""}{event.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Henüz etkinlik bulunmamaktadır.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}