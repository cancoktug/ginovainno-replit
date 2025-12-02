import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

type TeamMember = {
  id: number;
  name: string;
  title: string;
  image: string;
  bio?: string;
  linkedin?: string;
  email?: string;
  isBoard: boolean;
  category: string; // 'yonetim', 'ekip', 'danisma'
  order: number;
  isActive: boolean;
};

export default function Yonetim() {
  const { data: allTeamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Kategorilere ayır
  const yonetimMembers = [...allTeamMembers].filter(m => m.category === 'yonetim' && m.isActive).sort((a, b) => a.order - b.order);
  const ekipMembers = [...allTeamMembers].filter(m => m.category === 'ekip' && m.isActive).sort((a, b) => a.order - b.order);
  const danismaMembers = [...allTeamMembers].filter(m => m.category === 'danisma' && m.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Yönetim
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi'nin 
            yönetim yapısı; stratejik karar alma organı olan <strong>Yönetim Kurulu</strong>, operasyonel 
            faaliyetleri yürüten <strong>Ekip</strong> ve akademik ve sektörel rehberlik sağlayan{" "}
            <strong>Danışma Kurulu</strong>'ndan oluşmaktadır.
          </p>
        </div>

        {/* Yönetim Kurulu */}
        {yonetimMembers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Yönetim Kurulu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {yonetimMembers.map((member) => (
                <Card
                  key={member.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-gray-200/50"
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      {/* Profile Photo */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Name and Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-4">
                        {member.title}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex justify-center gap-3">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-[#0077B5] text-white rounded-full hover:bg-[#005885] transition-colors duration-200"
                            title="LinkedIn Profili"
                          >
                            <FaLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                            title={`E-posta: ${member.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ekip */}
        {ekipMembers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Ekip
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {ekipMembers.map((member) => (
                <Card
                  key={member.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-gray-200/50"
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      {/* Profile Photo */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Name and Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-4">
                        {member.title}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex justify-center gap-3">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-[#0077B5] text-white rounded-full hover:bg-[#005885] transition-colors duration-200"
                            title="LinkedIn Profili"
                          >
                            <FaLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                            title={`E-posta: ${member.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Danışma Kurulu */}
        {danismaMembers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Danışma Kurulu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {danismaMembers.map((member) => (
                <Card
                  key={member.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-gray-200/50"
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      {/* Profile Photo */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Name and Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-4">
                        {member.title}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex justify-center gap-3">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-[#0077B5] text-white rounded-full hover:bg-[#005885] transition-colors duration-200"
                            title="LinkedIn Profili"
                          >
                            <FaLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                            title={`E-posta: ${member.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {yonetimMembers.length === 0 && ekipMembers.length === 0 && danismaMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yönetim Bilgileri
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yönetim yapısı bilgileri güncellenmektedir. Güncel bilgiler için lütfen daha sonra ziyaret ediniz.
              </p>
            </div>
          </div>
        )}

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Kurum Vizyonu
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi, 
                üniversitemizin bilimsel araştırma kapasitesini girişimcilik ekosistemiyle entegre ederek, 
                teknoloji transferi ve akademik girişimcilik alanlarında öncü bir merkez olmayı 
                hedeflemektedir. Bilimsel araştırma bulgularının ticari uygulamalara dönüştürülmesi, 
                yenilikçi iş modellerinin geliştirilmesi ve sürdürülebilir girişimcilik kültürünün 
                akademik çevrede yaygınlaştırılması temel misyonumuzun parçalarını oluşturmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}