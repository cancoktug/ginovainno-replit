import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Users, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { OptimizedImageUploader } from "@/components/OptimizedImageUploader";
import { insertMentorSchema, type Mentor, type InsertMentor, type MentorBooking, type MentorAvailability } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const mentorFormSchema = insertMentorSchema.extend({
  image: z.string().min(1, "Fotoğraf URL'si gereklidir"),
});

type MentorForm = z.infer<typeof mentorFormSchema>;

export default function AdminMentors() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [selectedMentorForAvailability, setSelectedMentorForAvailability] = useState<Mentor | null>(null);

  const { data: mentors = [], isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: bookings = [] } = useQuery<MentorBooking[]>({
    queryKey: ["/api/mentor-bookings"],
  });

  const { data: selectedMentorAvailability = [] } = useQuery<MentorAvailability[]>({
    queryKey: [`/api/mentors/${selectedMentorForAvailability?.id}/availability`],
    enabled: !!selectedMentorForAvailability?.id,
  });

  const form = useForm<MentorForm>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      name: "",
      title: "",
      image: "",
      expertise: "",
      bio: "",
      linkedin: "",
      email: "",
      isAvailableForBooking: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MentorForm) => {
      const response = await apiRequest("POST", "/api/mentors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Mentör başarıyla eklendi.",
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
    mutationFn: async (data: MentorForm & { id: number }) => {
      const { id, ...mentorData } = data;
      const response = await apiRequest("PUT", `/api/mentors/${id}`, mentorData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      setIsDialogOpen(false);
      form.reset();
      setEditingMentor(null);
      toast({
        title: "Başarılı",
        description: "Mentör başarıyla güncellendi.",
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
      await apiRequest("DELETE", `/api/mentors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      toast({
        title: "Başarılı",
        description: "Mentör başarıyla silindi.",
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

  const handleSubmit = (data: MentorForm) => {
    if (editingMentor) {
      updateMutation.mutate({ ...data, id: editingMentor.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    form.reset({
      name: mentor.name,
      title: mentor.title,
      image: mentor.image,
      expertise: mentor.expertise || "",
      bio: mentor.bio || "",
      linkedin: mentor.linkedin || "",
      email: mentor.email || "",
      isAvailableForBooking: mentor.isAvailableForBooking,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bu mentörü silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingMentor(null);
    form.reset({
      name: "",
      title: "",
      image: "",
      expertise: "",
      bio: "",
      linkedin: "",
      email: "",
      isAvailableForBooking: false,
    });
    setIsDialogOpen(true);
  };

  // Image upload handler
  const handleImageUpload = (imageUrl: string) => {
    form.setValue("image", imageUrl);
    toast({
      title: "Başarılı",
      description: "Fotoğraf başarıyla yüklendi.",
    });
  };

  if (mentorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentör Yönetimi</h1>
          <p className="text-gray-600 mt-2">Mentörleri yönetin ve randevu takvimlerini düzenleyin</p>
        </div>
        <Button onClick={handleAddNew} className="bg-itu-blue hover:bg-itu-blue/90">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Mentör
        </Button>
      </div>

      <Tabs defaultValue="mentors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mentors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mentörler ({mentors.length})
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Randevular ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-itu-blue/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{mentor.name}</h3>
                      <p className="text-gray-600 text-sm">{mentor.title}</p>
                      {mentor.isAvailableForBooking && (
                        <Badge variant="default" className="mt-2 bg-green-100 text-green-800 border-green-200">
                          Randevu Alabilir
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {mentor.expertise && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Uzmanlık:</p>
                      <p className="text-sm text-gray-600">{mentor.expertise}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(mentor)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mentor.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      {mentor.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(mentor.linkedin, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {mentor.isAvailableForBooking && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMentorForAvailability(mentor);
                          setAvailabilityDialogOpen(true);
                        }}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Müsaitlik Yönet
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Randevu Listesi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başvuran</TableHead>
                    <TableHead>Mentör</TableHead>
                    <TableHead>Tarih & Saat</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İletişim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.applicantName}</TableCell>
                      <TableCell>
                        {mentors.find((m) => m.id === booking.mentorId)?.name || "Bilinmeyen"}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.selectedDate).toLocaleDateString("tr-TR")} - {booking.selectedTime}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {booking.status === "confirmed" ? "Onaylandı" : "Beklemede"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{booking.email}</p>
                          <p className="text-gray-500">{booking.phone}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Henüz randevu bulunmuyor.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMentor ? "Mentör Düzenle" : "Yeni Mentör Ekle"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Mentor adı soyadı"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Unvan *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Mentor unvanı"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Uzmanlık Alanları</Label>
              <Input
                id="expertise"
                {...form.register("expertise")}
                placeholder="JavaScript, React, Node.js, Girişimcilik..."
              />
            </div>

            <div className="space-y-2">
              <Label>Profil Fotoğrafı *</Label>
              <div className="border rounded-lg p-4 space-y-4">
                {form.watch("image") ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={form.watch("image")}
                      alt="Mentor"
                      className="w-20 h-20 rounded-full object-cover border-2 border-itu-blue/20"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Mevcut fotoğraf</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("image", "")}
                      >
                        Kaldır
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-4">Henüz fotoğraf yüklenmedi</p>
                  </div>
                )}

                <OptimizedImageUploader
                  onComplete={handleImageUpload}
                  maxFileSizeMB={5}
                  acceptedTypes="image/*"
                />
              </div>
              {form.formState.errors.image && (
                <p className="text-red-500 text-sm">{form.formState.errors.image.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profili</Label>
                <Input
                  id="linkedin"
                  {...form.register("linkedin")}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="mentor@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                placeholder="Mentor hakkında kısa bilgi..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAvailableForBooking"
                checked={form.watch("isAvailableForBooking")}
                onCheckedChange={(checked) =>
                  form.setValue("isAvailableForBooking", checked as boolean)
                }
              />
              <Label htmlFor="isAvailableForBooking">Randevu alabilir</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-itu-blue hover:bg-itu-blue/90"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Kaydediliyor..."
                  : editingMentor
                  ? "Güncelle"
                  : "Ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Availability Management Dialog */}
      <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMentorForAvailability?.name} - Müsaitlik Yönetimi
            </DialogTitle>
          </DialogHeader>
          
          <AvailabilityManager 
            mentor={selectedMentorForAvailability}
            availabilityData={selectedMentorAvailability}
            onClose={() => setAvailabilityDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Availability Manager Component
function AvailabilityManager({ 
  mentor, 
  availabilityData, 
  onClose 
}: {
  mentor: Mentor | null;
  availabilityData: MentorAvailability[];
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00"
  });

  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  const createAvailabilityMutation = useMutation({
    mutationFn: async (data: typeof newSlot) => {
      const response = await apiRequest("POST", `/api/mentors/${mentor?.id}/availability`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mentors/${mentor?.id}/availability`] });
      toast({
        title: "Başarılı",
        description: "Müsaitlik dilimi eklendi.",
      });
      setNewSlot({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/mentor-availability/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mentors/${mentor?.id}/availability`] });
      toast({
        title: "Başarılı",
        description: "Müsaitlik dilimi silindi.",
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

  const handleAddSlot = () => {
    createAvailabilityMutation.mutate(newSlot);
  };

  const handleDeleteSlot = (id: number) => {
    deleteAvailabilityMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Current Availability */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Mevcut Müsaitlik Saatleri</h3>
        {availabilityData.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            Henüz müsaitlik saati tanımlanmamış. Aşağıdan yeni zaman dilimi ekleyebilirsiniz.
          </div>
        ) : (
          <div className="space-y-2">
            {availabilityData.map((slot) => (
              <Card key={slot.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="px-3 py-1">
                      {dayNames[slot.dayOfWeek]}
                    </Badge>
                    <span className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add New Slot */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Yeni Müsaitlik Dilimi Ekle</h3>
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Gün</Label>
              <Select
                value={newSlot.dayOfWeek.toString()}
                onValueChange={(value) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Başlangıç Saati</Label>
              <Input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              />
            </div>

            <div>
              <Label>Bitiş Saati</Label>
              <Input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleAddSlot}
              disabled={createAvailabilityMutation.isPending}
              className="bg-itu-blue hover:bg-itu-blue/90"
            >
              {createAvailabilityMutation.isPending ? "Ekleniyor..." : "Ekle"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}