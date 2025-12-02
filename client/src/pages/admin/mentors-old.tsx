import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Plus, Edit, Trash2, Settings, ExternalLink, BookOpen, Upload, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { OptimizedImageUploader } from "@/components/OptimizedImageUploader";
import type { Mentor, InsertMentor, MentorAvailability, MentorBooking } from "@shared/schema";

const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function AdminMentors() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showAvailabilitySection, setShowAvailabilitySection] = useState(false);

  const { data: mentors = [], isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });

  const { data: bookings = [] } = useQuery<MentorBooking[]>({
    queryKey: ["/api/mentor-bookings"],
  });

  const createMentorMutation = useMutation({
    mutationFn: async (data: InsertMentor) => {
      const response = await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create mentor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      toast({ title: "Mentor başarıyla oluşturuldu" });
      setShowMentorDialog(false);
    },
    onError: () => {
      toast({ title: "Mentor oluşturulamadı", variant: "destructive" });
    },
  });

  const updateMentorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMentor> }) => {
      const response = await fetch(`/api/mentors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update mentor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      toast({ title: "Mentor başarıyla güncellendi" });
      setShowMentorDialog(false);
      setSelectedMentor(null);
      setImageUrl(""); // Reset image URL state
    },
    onError: () => {
      toast({ title: "Mentor güncellenemedi", variant: "destructive" });
    },
  });

  const deleteMentorMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/mentors/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete mentor");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      toast({ title: "Mentor başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Mentor silinemedi", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Use imageUrl if it exists (new upload), otherwise keep existing image
    const finalImageUrl = imageUrl || selectedMentor?.image || "";
    
    const mentorData: InsertMentor = {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      expertise: formData.get("expertise") as string,
      image: finalImageUrl,
      linkedin: formData.get("linkedin") as string || undefined,
      email: formData.get("email") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      isAvailableForBooking: formData.get("isAvailableForBooking") === "on",
    };

    if (selectedMentor) {
      updateMentorMutation.mutate({ id: selectedMentor.id, data: mentorData });
    } else {
      createMentorMutation.mutate(mentorData);
    }
  };

  const openEditDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setImageUrl(""); // Start with empty - will show current image through selectedMentor?.image
    setShowMentorDialog(true);
  };

  const openNewDialog = () => {
    setSelectedMentor(null);
    setImageUrl("");
    setShowMentorDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu mentoru silmek istediğinizden emin misiniz?")) {
      deleteMentorMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Beklemede", variant: "secondary" as const },
      confirmed: { label: "Onaylandı", variant: "default" as const },
      cancelled: { label: "İptal Edildi", variant: "destructive" as const },
      completed: { label: "Tamamlandı", variant: "outline" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            Mentorları yönet, randevu takvimleri ayarla ve rezervasyonları görüntüle
          </p>
        </div>
        <Button onClick={openNewDialog} className="bg-itu-blue hover:bg-itu-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Mentor
        </Button>
      </div>

      <Tabs defaultValue="mentors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mentors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mentorlar
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Uygunluk Takvimleri
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Randevu Rezervasyonları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : mentors.length > 0 ? (
              mentors.map((mentor) => (
                <Card key={mentor.id} className="relative group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-itu-blue/20"
                      />
                      
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                        <p className="text-itu-blue font-medium">{mentor.title}</p>
                        <p className="text-sm text-gray-600">{mentor.expertise}</p>
                        
                        <div className="flex items-center justify-center gap-2 pt-2">
                          {mentor.isAvailableForBooking ? (
                            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                              Randevu Açık
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-700 border-gray-300">
                              Randevu Kapalı
                            </Badge>
                          )}
                        </div>
                        
                        {mentor.linkedin && (
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-itu-blue hover:text-itu-blue/80 text-sm"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(mentor)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mentor.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Henüz mentor bulunmuyor.</p>
                <Button onClick={openNewDialog} className="mt-4">
                  İlk Mentoru Ekle
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Uygunluk Takvimleri</CardTitle>
              <p className="text-sm text-gray-600">
                Her mentor için haftanın hangi günlerinde ve saatlerinde randevu alabilir olduğunu ayarlayın.
              </p>
            </CardHeader>
            <CardContent>
              <MentorAvailabilityManager mentors={mentors} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Randevu Rezervasyonları</CardTitle>
              <p className="text-sm text-gray-600">
                Tüm mentor randevu taleplerini görüntüle ve yönet.
              </p>
            </CardHeader>
            <CardContent>
              <BookingsTable bookings={bookings} mentors={mentors} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mentor Form Dialog */}
      <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMentor ? "Mentor Düzenle" : "Yeni Mentor Ekle"}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Mentor bilgilerini girin ve randevu ayarlarını yapılandırın.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedMentor?.name || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Ünvan</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedMentor?.title || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expertise">Uzmanlık Alanı</Label>
              <Input
                id="expertise"
                name="expertise"
                defaultValue={selectedMentor?.expertise || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profil Fotoğrafı</Label>
              <div className="border rounded-lg p-4 space-y-4">
                {imageUrl || selectedMentor?.image ? (
                  <div className="flex items-center gap-4">
                    <img 
                      src={imageUrl || selectedMentor?.image} 
                      alt="Mentor" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-itu-blue/20"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {imageUrl ? "Yeni yüklenen fotoğraf" : "Mevcut fotoğraf"}
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setImageUrl("")}
                      >
                        {imageUrl ? "Yeni fotoğrafı kaldır" : "Fotoğrafı kaldır"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Profil fotoğrafı yükleyin</p>
                  </div>
                )}
                
                <OptimizedImageUploader
                  onUploadComplete={(url) => {
                    console.log("Image upload complete, new URL:", url);
                    setImageUrl(url);
                  }}
                  uploadType="mentors"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imageUrl ? "Yeni Fotoğraf Yükle" : "Fotoğraf Yükle"}
                </OptimizedImageUploader>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profili</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                defaultValue={selectedMentor?.linkedin || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={selectedMentor?.email || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={selectedMentor?.bio || ""}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailableForBooking"
                name="isAvailableForBooking"
                defaultChecked={selectedMentor?.isAvailableForBooking || false}
                onCheckedChange={(checked) => setShowAvailabilitySection(checked)}
              />
              <Label htmlFor="isAvailableForBooking">Randevu almaya açık</Label>
            </div>
            
            {(showAvailabilitySection || selectedMentor?.isAvailableForBooking) && (
              <AvailabilityCalendar 
                mentorId={selectedMentor?.id} 
                onAvailabilityChange={() => {
                  // Refresh mentor availability data
                }} 
              />
            )}
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMentorDialog(false)}
                className="flex-1"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createMentorMutation.isPending || updateMentorMutation.isPending}
              >
                {selectedMentor ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AvailabilityCalendar({ mentorId, onAvailabilityChange }: { 
  mentorId?: number; 
  onAvailabilityChange: () => void;
}) {
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 0, startTime: "09:00", endTime: "10:00" });

  const { data: availability = [], refetch } = useQuery<MentorAvailability[]>({
    queryKey: [`/api/mentors/${mentorId}/availability`],
    enabled: !!mentorId,
  });

  const addAvailabilityMutation = useMutation({
    mutationFn: async (slot: { dayOfWeek: number; startTime: string; endTime: string }) => {
      const response = await fetch(`/api/mentors/${mentorId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot),
      });
      if (!response.ok) throw new Error("Failed to add availability");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      onAvailabilityChange();
      toast({ title: "Uygunluk saati eklendi" });
    },
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/mentor-availability/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete availability");
    },
    onSuccess: () => {
      refetch();
      onAvailabilityChange();
      toast({ title: "Uygunluk saati silindi" });
    },
  });

  if (!mentorId) return null;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h4 className="font-medium">Uygunluk Takvimi</h4>
      
      {/* Add new availability slot */}
      <div className="grid grid-cols-4 gap-2 items-end">
        <div>
          <Label className="text-xs">Gün</Label>
          <Select value={newSlot.dayOfWeek.toString()} onValueChange={(value) => 
            setNewSlot(prev => ({ ...prev, dayOfWeek: parseInt(value) }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayNames.map((day, index) => (
                <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs">Başlangıç</Label>
          <Input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
          />
        </div>
        
        <div>
          <Label className="text-xs">Bitiş</Label>
          <Input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
          />
        </div>
        
        <Button
          type="button"
          size="sm"
          onClick={() => addAvailabilityMutation.mutate(newSlot)}
          disabled={addAvailabilityMutation.isPending}
        >
          <Plus className="h-3 w-3 mr-1" />
          Ekle
        </Button>
      </div>

      {/* Current availability slots */}
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-1">
            <div className="font-medium text-sm text-center border-b pb-1">{day}</div>
            <div className="space-y-1 min-h-[60px]">
              {availability
                .filter(slot => slot.dayOfWeek === dayIndex)
                .map(slot => (
                  <div 
                    key={slot.id} 
                    className="text-xs bg-itu-blue/10 text-itu-blue px-2 py-1 rounded flex items-center justify-between group"
                  >
                    <span>{slot.startTime}-{slot.endTime}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteAvailabilityMutation.mutate(slot.id)}
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorAvailabilityManager({ mentors }: { mentors: Mentor[] }) {
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <Label>Mentor Seçin</Label>
        <Select value={selectedMentor?.toString() || ""} onValueChange={(value) => setSelectedMentor(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Bir mentor seçin..." />
          </SelectTrigger>
          <SelectContent>
            {mentors.map((mentor) => (
              <SelectItem key={mentor.id} value={mentor.id.toString()}>
                {mentor.name} - {mentor.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMentor && (
        <AvailabilityCalendar 
          mentorId={selectedMentor} 
          onAvailabilityChange={() => {}}
        />
      )}
    </div>
  );
}

function BookingsTable({ bookings, mentors }: { bookings: MentorBooking[]; mentors: Mentor[] }) {
  const getMentorName = (mentorId: number) => {
    const mentor = mentors.find(m => m.id === mentorId);
    return mentor ? mentor.name : `Mentor ${mentorId}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Beklemede", variant: "secondary" as const },
      confirmed: { label: "Onaylandı", variant: "default" as const },
      cancelled: { label: "İptal Edildi", variant: "destructive" as const },
      completed: { label: "Tamamlandı", variant: "outline" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başvuran</TableHead>
            <TableHead>Mentor</TableHead>
            <TableHead>Tarih & Saat</TableHead>
            <TableHead>Konu</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.applicantName}</div>
                    <div className="text-sm text-gray-600">{booking.applicantEmail}</div>
                    {booking.company && (
                      <div className="text-sm text-gray-500">{booking.company}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getMentorName(booking.mentorId)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.meetingDate}</div>
                    <div className="text-sm text-gray-600">{booking.meetingTime} ({booking.duration} dk)</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={booking.topic}>
                    {booking.topic}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Henüz randevu rezervasyonu bulunmuyor.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}