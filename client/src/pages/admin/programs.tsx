import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { programsApi } from "@/lib/api";
import ImageUpload from "@/components/image-upload";
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  Users,
  MapPin,
  Clock,
  Search,
  BookOpen,
  Target,
  Award,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Program, InsertProgram } from "@shared/schema";

export default function ProgramsManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Form state for program
  const [programForm, setProgramForm] = useState<Partial<InsertProgram>>({
    title: "",
    name: "",
    description: "",
    shortDescription: "",
    duration: "",
    level: "Başlangıç",
    category: "Girişimcilik",
    image: "",
    icon: "🎓",
    price: "Ücretsiz",
    capacity: 20,
    location: "İTÜ Teknokent",
    requirements: "",
    syllabus: "",
    instructors: "",
    isPublished: false
  });

  // Fetch all programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: [programsApi.getAll()],
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: async (programData: InsertProgram) => {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programData),
      });
      if (!response.ok) throw new Error("Failed to create program");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [programsApi.getAll()] });
      toast({
        title: "Başarılı",
        description: "Program oluşturuldu",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Program oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertProgram>) => {
      const response = await fetch(`/api/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update program");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [programsApi.getAll()] });
      toast({
        title: "Başarılı",
        description: "Program güncellendi",
      });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Program güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error: any = new Error("Failed to delete program");
        error.status = response.status;
        error.data = await response.json().catch(() => ({}));
        throw error;
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [programsApi.getAll()] });
      toast({
        title: "Başarılı",
        description: "Program silindi",
      });
    },
    onError: (error: any) => {
      const message = error.status === 403 
        ? error.data?.message || "Bu işlem için yetkiniz yoktur"
        : "Program silinirken bir hata oluştu";
      
      toast({
        title: "Hata",
        description: message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setProgramForm({
      title: "",
      name: "",
      description: "",
      shortDescription: "",
      duration: "",
      level: "Başlangıç",
      category: "Girişimcilik",
      image: "",
      icon: "🎓",
      price: "Ücretsiz",
      capacity: 20,
      location: "İTÜ Teknokent",
      requirements: "",
      syllabus: "",
      instructors: "",
      isPublished: false
    });
  };

  const handleEdit = (program: Program) => {
    setProgramForm({
      title: program.title,
      name: program.name,
      description: program.description,
      shortDescription: program.shortDescription || "",
      duration: program.duration,
      level: program.level,
      category: program.category,
      image: program.image,
      icon: program.icon,
      price: program.price || "Ücretsiz",
      capacity: program.capacity || 20,
      location: program.location || "İTÜ Teknokent",
      requirements: program.requirements || "",
      syllabus: program.syllabus || "",
      instructors: program.instructors || "",
      isPublished: program.isPublished,
      applicationDeadline: program.applicationDeadline ? new Date(program.applicationDeadline).toISOString().split('T')[0] : undefined,
      startDate: program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : undefined,
      endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : undefined,
    });
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!programForm.title || !programForm.name || !programForm.description) {
      toast({
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const programData = {
      ...programForm,
      applicationDeadline: programForm.applicationDeadline ? new Date(programForm.applicationDeadline) : null,
      startDate: programForm.startDate ? new Date(programForm.startDate) : null,
      endDate: programForm.endDate ? new Date(programForm.endDate) : null,
    } as InsertProgram;

    if (selectedProgram) {
      updateProgramMutation.mutate({ id: selectedProgram.id, ...programData });
    } else {
      createProgramMutation.mutate(programData);
    }
  };

  const filteredPrograms = programs.filter((program: Program) => {
    const matchesSearch = (program.title + " " + program.description + " " + program.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "published":
        return matchesSearch && program.isPublished;
      case "draft":
        return matchesSearch && !program.isPublished;
      case "inactive":
        return matchesSearch && !program.isActive;
      default:
        return matchesSearch && program.isActive;
    }
  });

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "editor")) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-6 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Yetkisiz Erişim</h3>
          <p className="text-gray-600">Bu sayfaya sadece admin ve editör kullanıcıları erişebilir.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Programlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Program Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Eğitim programlarını oluşturun ve yönetin
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-itu-blue hover:bg-itu-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Program Oluştur</DialogTitle>
            </DialogHeader>
            <ProgramForm 
              program={programForm} 
              setProgram={setProgramForm} 
              onSave={handleSave}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={createProgramMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Program</p>
                <p className="text-2xl font-bold">{programs.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-itu-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yayınlanan</p>
                <p className="text-2xl font-bold">{programs.filter((p: Program) => p.isPublished).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taslak</p>
                <p className="text-2xl font-bold">{programs.filter((p: Program) => !p.isPublished).length}</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold">{programs.filter((p: Program) => p.isActive).length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Program ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Program Tabs and List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tümü ({programs.filter((p: Program) => p.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Yayınlanan ({programs.filter((p: Program) => p.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Taslak ({programs.filter((p: Program) => !p.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Deaktif ({programs.filter((p: Program) => !p.isActive).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredPrograms.map((program: Program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-16 w-16 rounded-lg bg-itu-blue/10 flex items-center justify-center text-2xl">
                        {program.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{program.title}</h3>
                          <Badge variant={program.isPublished ? "default" : "secondary"}>
                            {program.isPublished ? "Yayınlanan" : "Taslak"}
                          </Badge>
                          <Badge variant="outline">{program.category}</Badge>
                          <Badge variant="outline">{program.level}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{program.shortDescription}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {program.location}
                          </span>
                          {program.capacity && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {program.capacity} kişi
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {program.price}
                          </span>
                        </div>
                        {program.startDate && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(program.startDate), "d MMMM yyyy", { locale: tr })} - 
                              {program.endDate && format(new Date(program.endDate), "d MMMM yyyy", { locale: tr })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(program)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Programı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{program.title}" programını silmek istediğinizden emin misiniz? 
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProgramMutation.mutate(program.id)}
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

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Program Düzenle</DialogTitle>
          </DialogHeader>
          <ProgramForm 
            program={programForm} 
            setProgram={setProgramForm} 
            onSave={handleSave}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateProgramMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Program Form Component
function ProgramForm({ 
  program, 
  setProgram, 
  onSave, 
  onCancel, 
  isLoading 
}: {
  program: Partial<InsertProgram>;
  setProgram: (program: Partial<InsertProgram>) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Program Başlığı *</Label>
              <Input
                id="title"
                value={program.title || ""}
                onChange={(e) => setProgram({...program, title: e.target.value})}
                placeholder="Girişimcilik Bootcamp'i"
              />
            </div>
            <div>
              <Label htmlFor="name">Program Adı *</Label>
              <Input
                id="name"
                value={program.name || ""}
                onChange={(e) => setProgram({...program, name: e.target.value})}
                placeholder="girişimcilik-bootcamp"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="shortDescription">Kısa Açıklama *</Label>
            <Input
              id="shortDescription"
              value={program.shortDescription || ""}
              onChange={(e) => setProgram({...program, shortDescription: e.target.value})}
              placeholder="Program hakkında kısa bilgi"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Detaylı Açıklama *</Label>
            <Textarea
              id="description"
              value={program.description || ""}
              onChange={(e) => setProgram({...program, description: e.target.value})}
              placeholder="Program hakkında detaylı bilgi"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={program.category || "Girişimcilik"}
                onValueChange={(value) => setProgram({...program, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Girişimcilik">Girişimcilik</SelectItem>
                  <SelectItem value="İnovasyon">İnovasyon</SelectItem>
                  <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                  <SelectItem value="Pazarlama">Pazarlama</SelectItem>
                  <SelectItem value="Finans">Finans</SelectItem>
                  <SelectItem value="İş Geliştirme">İş Geliştirme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Seviye</Label>
              <Select
                value={program.level || "Başlangıç"}
                onValueChange={(value) => setProgram({...program, level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Başlangıç">Başlangıç</SelectItem>
                  <SelectItem value="Orta">Orta</SelectItem>
                  <SelectItem value="İleri">İleri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Süre</Label>
              <Input
                id="duration"
                value={program.duration || ""}
                onChange={(e) => setProgram({...program, duration: e.target.value})}
                placeholder="8 hafta"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="icon">İkon</Label>
            <Input
              id="icon"
              value={program.icon || ""}
              onChange={(e) => setProgram({...program, icon: e.target.value})}
              placeholder="🎓"
            />
          </div>

          <div>
            <Label>Program Görseli</Label>
            <ImageUpload
              value={program.image || ""}
              onChange={(url) => setProgram({...program, image: url})}
              type="programs"
              placeholder="Program görseli URL'si"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Ücret</Label>
              <Select
                value={program.price || "Ücretsiz"}
                onValueChange={(value) => setProgram({...program, price: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ücretsiz">Ücretsiz</SelectItem>
                  <SelectItem value="Ücretli">Ücretli</SelectItem>
                  <SelectItem value="Başvuru üzerine">Başvuru üzerine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Katılımcı Kapasitesi</Label>
              <Input
                id="capacity"
                type="number"
                value={program.capacity || ""}
                onChange={(e) => setProgram({...program, capacity: parseInt(e.target.value) || 0})}
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="location">Lokasyon</Label>
              <Select
                value={program.location || "İTÜ Teknokent"}
                onValueChange={(value) => setProgram({...program, location: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="İTÜ Teknokent">İTÜ Teknokent</SelectItem>
                  <SelectItem value="Hibrit">Hibrit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="applicationDeadline">Başvuru Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={program.applicationDeadline || ""}
                onChange={(e) => setProgram({...program, applicationDeadline: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={program.startDate || ""}
                onChange={(e) => setProgram({...program, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={program.endDate || ""}
                onChange={(e) => setProgram({...program, endDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Başvuru Koşulları</Label>
            <Textarea
              id="requirements"
              value={program.requirements || ""}
              onChange={(e) => setProgram({...program, requirements: e.target.value})}
              placeholder="Başvuru için gerekli koşullar"
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="syllabus">Program İçeriği</Label>
            <Textarea
              id="syllabus"
              value={program.syllabus || ""}
              onChange={(e) => setProgram({...program, syllabus: e.target.value})}
              placeholder="Program içeriği ve müfredatı"
              rows={6}
            />
          </div>
          
          <div>
            <Label htmlFor="instructors">Eğitmenler</Label>
            <Textarea
              id="instructors"
              value={program.instructors || ""}
              onChange={(e) => setProgram({...program, instructors: e.target.value})}
              placeholder="Eğitmen bilgileri"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={program.isPublished || false}
              onChange={(e) => setProgram({...program, isPublished: e.target.checked})}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isPublished">Program yayınlansın</Label>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button 
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}