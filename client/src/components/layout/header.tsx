import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ChevronDown, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ituGinovaLogoPath from "@assets/itu-ginova-logo-mavi_1751912870565.png";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navigation = [
    { name: "Programlar", href: "/programlar" },
    { name: "Mentörler", href: "/mentorlar" },
    { name: "Yönetim", href: "/yonetim" },
    { name: "Etkinlikler", href: "/etkinlikler" },
    { name: "Hakkımızda", href: "/hakkimizda" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={ituGinovaLogoPath} 
                alt="İTÜ Ginova" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-itu-blue bg-light-blue"
                      : "text-gray-700 hover:text-itu-blue"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/iletisim">
                <Button className="bg-ginova-orange hover:bg-ginova-orange/90 text-white">
                  İletişim
                </Button>
              </Link>
              
              {/* Auth Section - Only show CMS access for logged in users */}
              {isAuthenticated && user && (user.role === "admin" || user.role === "editor") ? (
                <div className="flex items-center space-x-3 ml-4">
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      CMS
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                      {user.firstName}
                    </span>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {user.role === "admin" ? "Admin" : "Editör"}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        await fetch("/api/logout", { method: "GET" });
                        // Clear React Query cache and redirect
                        window.location.href = "/";
                      } catch (error) {
                        // Fallback redirect
                        window.location.href = "/api/logout";
                      }
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-itu-blue bg-light-blue"
                          : "text-gray-700 hover:text-itu-blue"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/iletisim" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-ginova-orange hover:bg-ginova-orange/90 text-white">
                      İletişim
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
