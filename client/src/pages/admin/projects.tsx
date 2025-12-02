import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import type { Project, InsertProject } from "@shared/schema";

export default function AdminProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (project: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", project);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      setEditingProject(null);
      toast({
        title: "Başarılı",
        description: "Proje başarıyla eklendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Proje eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, project }: { id: number; project: Partial<InsertProject> }) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, project);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      setEditingProject(null);
      toast({
        title: "Başarılı",
        description: "Proje başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Proje güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Başarılı",
        description: "Proje başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const budgetAmount = formData.get("budgetAmount") as string;
    const projectData: InsertProject = {
      title: formData.get("title") as string,
      status: formData.get("status") as "ongoing" | "completed",
      type: formData.get("type") as string,
      task: formData.get("task") as string || undefined,
      supporter: formData.get("supporter") as string || undefined,
      budgetAmount: budgetAmount ? budgetAmount : undefined,
      budgetCurrency: formData.get("budgetCurrency") as string || "TRY",
      description: formData.get("description") as string,
      duration: formData.get("duration") as string || undefined,
      slug: (formData.get("title") as string)
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, project: projectData });
    } else {
      createMutation.mutate(projectData);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
          <p className="text-muted-foreground">
            Akademik projeleri yönetin
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Proje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Proje Düzenle" : "Yeni Proje Ekle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Proje Adı</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingProject?.title || ""}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Proje Durumu</Label>
                  <Select name="status" defaultValue={editingProject?.status || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Devam Eden</SelectItem>
                      <SelectItem value="completed">Tamamlanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Proje Türü</Label>
                  <Input
                    id="type"
                    name="type"
                    defaultValue={editingProject?.type || "Araştırma"}
                    placeholder="Örn: Araştırma, Teknoloji Geliştirme, İnovasyon"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supporter">Proje Destekçisi</Label>
                <Input
                  id="supporter"
                  name="supporter"
                  defaultValue={editingProject?.supporter || ""}
                  placeholder="TÜBİTAK, AB Horizon Europe, vb."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetAmount">Bütçe Miktarı</Label>
                  <Input
                    id="budgetAmount"
                    name="budgetAmount"
                    type="number"
                    step="0.01"
                    defaultValue={editingProject?.budgetAmount?.toString() || ""}
                    placeholder="250000"
                  />
                </div>
                <div>
                  <Label htmlFor="budgetCurrency">Para Birimi</Label>
                  <Select name="budgetCurrency" defaultValue={editingProject?.budgetCurrency || "TRY"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Para birimi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TRY</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Proje Süresi</Label>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={editingProject?.duration || ""}
                  placeholder="Örn: 6 ay, 2023-2024, Ocak - Haziran 2024"
                />
                <p className="text-xs text-gray-500 mt-1">Projenin süresini metin olarak belirtiniz</p>
              </div>

              <div>
                <Label htmlFor="task">Proje Görevi</Label>
                <Textarea
                  id="task"
                  name="task"
                  defaultValue={editingProject?.task || ""}
                  rows={3}
                  placeholder="Projenin ana görevleri ve sorumlulukları..."
                />
              </div>

              <div>
                <Label htmlFor="description">Proje Açıklaması</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProject?.description || ""}
                  rows={4}
                  placeholder="Projenin amaçları, kapsamı ve beklenen sonuçları..."
                />
              </div>



              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingProject ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={project.status === 'ongoing' ? 'default' : 'secondary'}
                      className={project.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {project.status === 'ongoing' ? 'Devam Ediyor' : 'Tamamlandı'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                  )}
                  
                  {project.task && (
                    <div>
                      <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Proje Görevi:</span>
                      <p className="text-sm text-gray-700 mt-1">{project.task}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-500 text-xs uppercase tracking-wide block mb-1">Destekçi</span>
                      <p className="text-gray-900 font-medium">{project.supporter}</p>
                    </div>
                    
                    {project.budgetAmount && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="font-medium text-green-600 text-xs uppercase tracking-wide block mb-1">Bütçe</span>
                        <p className="text-green-800 font-bold">
                          {project.budgetAmount.toLocaleString()} {project.budgetCurrency}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-medium text-blue-600 text-xs uppercase tracking-wide block mb-1">Tür</span>
                      <p className="text-blue-800 font-medium">{project.type}</p>
                    </div>
                    
                    {project.duration && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="font-medium text-purple-600 text-xs uppercase tracking-wide block mb-1">Süre</span>
                        <p className="text-purple-800 font-medium">{project.duration}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-400 text-xs uppercase tracking-wide">URL Slug:</span>
                    <p className="text-gray-600 font-mono text-xs mt-1 break-all">{project.slug}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Henüz proje yok
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  İlk projenizi eklemek için yukarıdaki "Yeni Proje" butonuna tıklayın.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}