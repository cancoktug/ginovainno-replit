import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, Users, CheckCircle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-itu-blue to-ginova-orange py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/programs">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Programlara Dön
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg">
              <FileText className="h-8 w-8 text-itu-blue" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Şartlar ve Koşullar
              </h1>
              <p className="text-xl text-blue-100">
                İTÜ Ginova Eğitim Programları
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Genel Şartlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-itu-blue" />
                Genel Şartlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Başvuru Koşulları</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Başvuru sahibi en az 18 yaşında olmalıdır</li>
                  <li>Tüm başvuru bilgileri doğru ve güncel olmalıdır</li>
                  <li>Gerekli belgeler eksiksiz olarak sunulmalıdır</li>
                  <li>Başvuru ücreti varsa ödemesi tamamlanmalıdır</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Kabul Süreci</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Başvurular değerlendirme komitesi tarafından incelenir</li>
                  <li>Ek belgeler veya mülakat istenebilir</li>
                  <li>Kabul kararları e-posta ile bildirilir</li>
                  <li>Sonuçlar genellikle 15 iş günü içinde açıklanır</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Program Katılımı</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Derslerin %80'ine katılım zorunludur</li>
                  <li>Devamsızlık durumu program yöneticisine bildirilmelidir</li>
                  <li>Verilen ödevler zamanında teslim edilmelidir</li>
                  <li>Program kurallarına uyulması gerekmektedir</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Ödeme ve İptal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-itu-blue" />
                Ödeme ve İptal Koşulları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">4. Ödeme Şartları</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Program ücreti kabul sonrası belirlenen sürede ödenmelidir</li>
                  <li>Ödeme yapılmadığı takdirde kayıt iptal edilebilir</li>
                  <li>Taksit seçenekleri program bazında değişkenlik gösterir</li>
                  <li>KDV dahil fiyatlar geçerlidir</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. İptal ve İade</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Program başlamadan 7 gün önceye kadar iptal edilebilir</li>
                  <li>İptal durumunda %10 kesinti ile iade yapılır</li>
                  <li>Program başladıktan sonra iade yapılmaz</li>
                  <li>Öğrenci kaynaklı iptallerde farklı koşullar uygulanabilir</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6. Program Değişiklikleri</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>İTÜ Ginova program içeriğini değiştirme hakkını saklı tutar</li>
                  <li>Önemli değişiklikler katılımcılara önceden bildirilir</li>
                  <li>Eğitmen değişiklikleri olabilir</li>
                  <li>Program tarihleri güncelleme yapılabilir</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Haklar ve Sorumluluklar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-itu-blue" />
                Haklar ve Sorumluluklar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">7. Katılımcı Hakları</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Kaliteli eğitim alma hakkı</li>
                  <li>Program materyallerine erişim hakkı</li>
                  <li>Sertifika alma hakkı (koşulları sağladığında)</li>
                  <li>Şikayet ve öneri bildirme hakkı</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">8. Katılımcı Sorumlulukları</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Diğer katılımcılara saygılı davranmak</li>
                  <li>Program kurallarına uymak</li>
                  <li>Telif haklarına saygı göstermek</li>
                  <li>Confidentiality anlaşmasına uymak</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">9. Kişisel Veri Koruma</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Kişisel veriler KVKK kapsamında korunur</li>
                  <li>Veriler sadece eğitim amaçlı kullanılır</li>
                  <li>Üçüncü taraflarla paylaşılmaz</li>
                  <li>Veri silme talebinde bulunabilirsiniz</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">10. Uyuşmazlık Çözümü</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Türkiye Cumhuriyeti kanunları geçerlidir</li>
                  <li>İstanbul mahkemeleri yetkilidir</li>
                  <li>Önce dostane çözüm aranır</li>
                  <li>Arabuluculuk süreci tercih edilir</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* İletişim */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <p><strong>ITU Ginova - Girişimcilik ve İnovasyon Merkezi</strong></p>
                <p>İstanbul Teknik Üniversitesi Ayazağa Kampüsü</p>
                <p>Sarıyer, İstanbul</p>
                <p>E-posta: ginova@itu.edu.tr</p>
                <p>Telefon: (0212) 285 75 06</p>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Son güncellenme:</strong> 7 Ocak 2025
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Bu şartlar ve koşullar önceden haber verilmeksizin güncellenebilir. 
                  Güncel versiyon web sitemizde yayınlanır.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}