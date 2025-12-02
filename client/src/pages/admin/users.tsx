import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Crown, 
  Edit, 
  UserX, 
  Shield,
  Clock,
  UserCheck,
  Search,
  Plus,
  Trash2,
  UserPlus,
  RotateCcw,
  Key
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { User } from "@shared/schema";

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "editor"
  });

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: currentUser?.role === "admin",
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error("Failed to update user role");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı rolü güncellendi",
      });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı rolü güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Create new user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Yeni kullanıcı eklendi",
      });
      setIsAddDialogOpen(false);
      setNewUser({ id: "", email: "", firstName: "", lastName: "", role: "editor" });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message.includes("exists") ? "Bu kullanıcı zaten mevcut" : "Kullanıcı eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Deactivate user mutation
  const deactivateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}/deactivate`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to deactivate user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı deaktive edildi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı deaktive edilirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Reactivate user mutation
  const reactivateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}/reactivate`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to reactivate user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı aktif edildi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı aktif edilirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/users/${userId}/reset-password`, {});
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Şifre Sıfırlama Maili Gönderildi",
        description: `${data.email} adresine şifre sıfırlama linki gönderildi`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message || "Şifre sıfırlama maili gönderilemedi",
        variant: "destructive",
      });
    },
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Admin
        </Badge>;
      case "editor":
        return <Badge variant="default" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          Editör
        </Badge>;
      default:
        return <Badge variant="secondary">Görüntüleyici</Badge>;
    }
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = (user.firstName + " " + user.lastName + " " + user.email)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "admin":
        return matchesSearch && user.role === "admin";
      case "editor":
        return matchesSearch && user.role === "editor";
      case "inactive":
        return matchesSearch && !user.isActive;
      default:
        return matchesSearch && user.isActive;
    }
  });

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Yetkisiz Erişim</h3>
          <p className="text-gray-600">Bu sayfaya sadece admin kullanıcıları erişebilir.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Kullanıcılar yükleniyor...</p>
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
            Kullanıcı Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistem kullanıcılarını ve rollerini yönetin
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-itu-blue hover:bg-itu-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">Kullanıcı ID</Label>
                <Input
                  id="userId"
                  value={newUser.id}
                  onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                  placeholder="Benzersiz kullanıcı ID'si"
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="kullanici@ornekmail.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Ad</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Ad"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Soyad"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(role) => setNewUser({...newUser, role})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editör</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  İptal
                </Button>
                <Button 
                  onClick={() => createUserMutation.mutate(newUser)}
                  disabled={!newUser.id || !newUser.email || createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? "Ekleniyor..." : "Kullanıcı Ekle"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-itu-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin</p>
                <p className="text-2xl font-bold">{users.filter((u: User) => u.role === "admin").length}</p>
              </div>
              <Crown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Editör</p>
                <p className="text-2xl font-bold">{users.filter((u: User) => u.role === "editor").length}</p>
              </div>
              <Edit className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold">{users.filter((u: User) => u.isActive).length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User Tabs and List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tümü ({users.filter((u: User) => u.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="admin">
            Admin ({users.filter((u: User) => u.role === "admin").length})
          </TabsTrigger>
          <TabsTrigger value="editor">
            Editör ({users.filter((u: User) => u.role === "editor").length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Deaktif ({users.filter((u: User) => !u.isActive).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredUsers.map((user: User) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-itu-blue/10 flex items-center justify-center">
                        {user.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.firstName || "User"}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-itu-blue font-semibold text-lg">
                            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.email
                            }
                          </h3>
                          {getRoleBadge(user.role)}
                          {!user.isActive && (
                            <Badge variant="secondary">Deaktif</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          {user.createdAt && (
                            <span>
                              Katılım: {format(new Date(user.createdAt), "d MMMM yyyy", { locale: tr })}
                            </span>
                          )}
                          {user.lastLoginAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Son giriş: {format(new Date(user.lastLoginAt), "d MMMM yyyy", { locale: tr })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                        disabled={user.id === currentUser.id}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                      </Button>
                      
                      {user.isActive && user.id !== currentUser.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Kullanıcıyı Deaktive Et</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{user.firstName} {user.lastName}" kullanıcısını deaktive etmek istediğinizden emin misiniz? 
                                Bu kullanıcı sisteme giriş yapamayacak.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deactivateUserMutation.mutate(user.id)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Deaktive Et
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {!user.isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => reactivateUserMutation.mutate(user.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{user.firstName} {user.lastName}" kullanıcısını kalıcı olarak silmek istediğinizden emin misiniz? 
                              {user.id === currentUser.id && (
                                <span className="block mt-2 text-red-600 font-semibold">
                                  ⚠️ DİKKAT: Kendi hesabınızı silmek üzeresiniz. Bu işlem sonrası sistemden çıkış yapacaksınız.
                                </span>
                              )}
                              Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Kalıcı Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => resetPasswordMutation.mutate(user.id)}
                        disabled={resetPasswordMutation.isPending}
                        title="Şifre Sıfırlama Maili Gönder"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Rolünü Düzenle</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Kullanıcı</Label>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium">
                    {selectedUser.firstName && selectedUser.lastName 
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`
                      : selectedUser.email
                    }
                  </p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(role) => setSelectedUser({...selectedUser, role})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editör</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  İptal
                </Button>
                <Button 
                  onClick={() => updateRoleMutation.mutate({
                    userId: selectedUser.id,
                    role: selectedUser.role
                  })}
                  disabled={updateRoleMutation.isPending}
                >
                  {updateRoleMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}