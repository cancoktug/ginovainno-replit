import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');
    
    if (!resetToken) {
      toast({
        title: "Geçersiz Link",
        description: "Şifre sıfırlama linki geçersiz",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/auth"), 2000);
      return;
    }

    setToken(resetToken);
    verifyToken(resetToken);
  }, []);

  const verifyToken = async (resetToken: string) => {
    try {
      const response: any = await apiRequest("POST", "/api/auth/verify-reset-token", { token: resetToken });
      setIsValid(true);
      setEmail(response.email);
    } catch (error: any) {
      toast({
        title: "Geçersiz veya Süresi Dolmuş Link",
        description: error.message || "Bu şifre sıfırlama linki geçersiz veya süresi dolmuş",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/auth"), 3000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: "Geçersiz Şifre",
        description: "Şifre en az 6 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Şifreler Eşleşmiyor",
        description: "Girdiğiniz şifreler aynı olmalıdır",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", {
        token,
        newPassword,
      });

      setIsSuccess(true);
      toast({
        title: "Şifre Sıfırlandı",
        description: "Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...",
      });

      setTimeout(() => setLocation("/auth"), 3000);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Şifre sıfırlama işlemi başarısız oldu",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-itu-blue/10 to-ginova-orange/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itu-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Şifre sıfırlama linki doğrulanıyor...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-itu-blue/10 to-ginova-orange/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Şifre Başarıyla Değiştirildi</h2>
            <p className="text-gray-600 mb-4">
              Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-itu-blue/10 to-ginova-orange/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Geçersiz Link</h2>
            <p className="text-gray-600">
              Bu şifre sıfırlama linki geçersiz veya süresi dolmuş.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-itu-blue/10 to-ginova-orange/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-itu-blue/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-itu-blue" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Şifre Sıfırla</CardTitle>
          <CardDescription className="text-center">
            {email} için yeni şifre belirleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                minLength={6}
                data-testid="input-new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
                minLength={6}
                data-testid="input-confirm-password"
              />
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">Şifreler eşleşmiyor</p>
            )}

            <Button
              type="submit"
              className="w-full bg-itu-blue hover:bg-itu-blue/90"
              disabled={isResetting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              data-testid="button-reset-password"
            >
              {isResetting ? "Şifre Sıfırlanıyor..." : "Şifreyi Sıfırla"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setLocation("/auth")}
                data-testid="link-back-to-login"
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
