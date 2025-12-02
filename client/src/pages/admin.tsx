import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  FileText, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Building,
  Settings,
  LogOut
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Fetch real-time statistics from database - must be called before any conditional returns
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    enabled: isAuthenticated && user?.role && (user.role === "admin" || user.role === "editor")
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Giriş yapmanız gerekiyor...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itu-blue mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Erişim Reddedildi</CardTitle>
            <CardDescription className="text-center">
              Bu sayfaya erişim için admin veya editör yetkisine sahip olmanız gerekiyor.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = "/"}>
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminItems = [
    {
      title: "Başvurular",
      description: "Tüm başvuruları inceleyin ve yönetin",
      icon: FileText,
      href: "/admin/applications",
      count: "Tüm başvurular"
    },
    {
      title: "Programlar",
      description: "Eğitim programlarını yönetin",
      icon: GraduationCap,
      href: "/admin/programs",
      count: `${stats?.programCount || 0} program`
    },
    {
      title: "Mentörler", 
      description: "Mentör profillerini düzenleyin",
      icon: Users,
      href: "/admin/mentors",
      count: `${stats?.mentorCount || 0} mentör`
    },
    {
      title: "Startup'lar",
      description: "Portfolio şirketlerini yönetin", 
      icon: Building,
      href: "/admin/startups",
      count: `${stats?.startupCount || 0} startup`
    },
    {
      title: "Projeler",
      description: "Akademik projeleri yönetin",
      icon: Briefcase,
      href: "/admin/projects",
      count: `${stats?.projectCount || 0} proje`
    },
    {
      title: "Etkinlikler",
      description: "Etkinlik takvimini düzenleyin",
      icon: Calendar, 
      href: "/admin/events",
      count: `${stats?.eventCount || 0} etkinlik`
    },
    {
      title: "Blog Yazıları",
      description: "Blog içeriklerini yönetin",
      icon: FileText,
      href: "/admin/blog",
      count: `${stats?.blogCount || 0} yazı`
    },
    {
      title: "Ekip Üyeleri",
      description: "Takım profillerini düzenleyin",
      icon: Users,
      href: "/admin/team", 
      count: `${stats?.teamCount || 0} üye`
    }
  ];

  if (user.role === "admin") {
    adminItems.push({
      title: "Kullanıcı Yönetimi",
      description: "Kullanıcı rolleri ve yetkileri",
      icon: Settings,
      href: "/admin/users",
      count: "Admin"
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                CMS Yönetim Paneli
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                İTÜ Ginova web sitesi içerik yönetimi
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Editör"}
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-itu-blue/10 rounded-lg">
                    <item.icon className="h-8 w-8 text-itu-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.count}</span>
                  <Button 
                    size="sm" 
                    onClick={() => window.location.href = item.href}
                  >
                    Yönet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>
              Son günlerde yapılan değişiklikler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Yeni blog yazısı eklendi</p>
                  <p className="text-xs text-gray-500">2 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Yeni etkinlik programlandı</p>
                  <p className="text-xs text-gray-500">1 gün önce</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mentor profili güncellendi</p>
                  <p className="text-xs text-gray-500">3 gün önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}