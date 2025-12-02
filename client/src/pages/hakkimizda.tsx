import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamMember } from "@shared/schema";

export default function Hakkimizda() {
  const { data: allTeamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
  });

  // Sadece yönetim kurulunu filtrele
  const yonetimMembers = [...allTeamMembers].filter(m => m.category === 'yonetim' && m.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative animated-gradient py-24 overflow-hidden">
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 backdrop-overlay"></div>
        
        {/* Floating geometric shapes with animation */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight text-shadow-strong">
            Hakkımızda
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow-strong">
            İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ginova Tanıtımı */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                İTÜ Ginova Nedir?
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong className="text-itu-blue">İTÜ Ginova</strong>, İstanbul Teknik Üniversitesi bünyesinde 
                  faaliyet gösteren <strong>Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi</strong>'dir. 
                  Türkiye'nin önde gelen girişimcilik ekosisteminin kalbi olan merkezimiz, yenilikçi fikirleri 
                  başarılı işletmelere dönüştüren bir köprü görevi üstlenmektedir.
                </p>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  2014 yılından bu yana, <strong>teknoloji tabanlı girişimciliği</strong> destekleyen merkezimiz, 
                  girişimci adaylarına mentörlük, eğitim programları, <strong>networking etkinlikleri</strong> ve{' '}
                  <strong>İTÜ'nün geniş teknoloji kaynaklarına erişim</strong> imkanı sunmaktadır.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
                <p className="text-lg leading-relaxed">
                  Girişimcilik dünyasının kalbinde, <strong>köklü İTÜ bünyesinde</strong> yer almanın{' '}
                  verdiği avantajla öğrenci, akademisyen ve araştırmacıların yenilikçi projelerini{' '}
                  <strong>ticari başarıya</strong> dönüştürmek, güçlü <strong>teknoloji altyapısı</strong>{' '}
                  ve akademik kaynaklara erişim sağlayarak <strong>sürdürülebilir inovasyon</strong>{' '}
                  kültürü oluşturmaktır.
                </p>
              </div>
            </div>
          </div>

          {/* Hizmetlerimiz */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hizmetlerimiz
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-itu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-itu-blue rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Eğitim Programları
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Girişimcilik, inovasyon ve teknoloji odaklı kapsamlı eğitim programları
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ginova-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-ginova-orange rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Mentörlük
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Deneyimli mentörlerden bire bir rehberlik ve sektörel deneyim aktarımı
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-itu-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-itu-blue rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Etkinlikler & Networking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Girişimcilik ekosistemini güçlendiren etkinlikler ve ağ kurma fırsatları
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ginova-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-ginova-orange rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    İTÜ Teknoloji Avantajı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Türkiye'nin önde gelen teknik üniversitesinin kaynaklarına erişim imkanı
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Faaliyet Alanlarımız */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Faaliyet Alanlarımız
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                İTÜ Ginova, girişimcilik ve inovasyon ekosistemini güçlendirmek amacıyla çeşitli 
                alanlarda akademik ve uygulama odaklı faaliyetler yürütmektedir.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-itu-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-itu-blue rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Eğitim ve Beceri Geliştirme
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        İstanbul Teknik Üniversitesi'ndeki işletme ve mühendislik alanlarındaki altyapı ve 
                        insan kaynaklarından yararlanarak, üniversite öğrencilerine bir fikir bulma ve bunu 
                        hayata geçirme deneyimi kazandırmak, aynı zamanda yenilikçi düşünme ve yönetim ile 
                        ilgili genel beceri ve yetkinliklerini geliştirmek.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ginova-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-ginova-orange rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Araştırma ve Uygulama
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Kamu ve özel teşebbüsün girişimcilik, inovasyon ve bunların yönetimi konularındaki 
                        sorunlarına ilişkin eğitim, araştırma ve uygulama yapmak. Günümüz çağdaş girişimcilik 
                        öğretisini teoriden ziyade uygulamaya yönelik olarak sunmak.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-itu-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-itu-blue rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Ulusal ve Uluslararası İş Birlikteleri
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Merkezin ilgi alanına giren konularda faaliyette bulunan ulusal ve uluslararası, 
                        resmi veya özel kurum ve kuruluşlar ile merkezin amacı doğrultusunda iş birliğinde 
                        bulunmak, ortak çalışmalar düzenlemek, uygulama ve araştırma projeleri hazırlamak.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ginova-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-ginova-orange rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Bilimsel Etkinlikler ve Konferanslar
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Konuyla ilgili çalışmaları daha ileri düzeye çıkarabilmek için ulusal ve uluslararası 
                        nitelikte kurs, seminer, konferans, kongre ve benzeri faaliyetlerde bulunmak. 
                        Tüm üniversiteye yönelik sertifika programları ve atölye çalışmaları düzenlemek.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-itu-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-itu-blue rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Yayın ve Araştırma Sonuçları
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Uygulama ve araştırma çalışmaları sonunda elde edilen bilimsel ve teknik bulguları 
                        ve verileri açıklayan, sorunlara çözüm önerileri getiren rapor, bülten, proje, 
                        kitap, makale, dergi ve benzeri yayınlarda bulunmak.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Yönetim Kurulu */}
          {yonetimMembers.length > 0 && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Yönetim Kurulu
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  İTÜ Ginova'nın stratejik yönünü belirleyen ve vizyonunu şekillendiren 
                  deneyimli yönetim kurulu üyelerimiz
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
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

                          {/* Member Info */}
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-itu-blue transition-colors duration-300">
                              {member.name}
                            </h3>
                            <p className="text-ginova-orange font-semibold">
                              {member.title}
                            </p>

                            {member.bio && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {member.bio}
                              </p>
                            )}
                          </div>

                          {/* LinkedIn Link */}
                          {member.linkedin && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-itu-blue hover:text-ginova-orange transition-colors duration-300"
                              >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                                </svg>
                                LinkedIn Profili
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Yönetim Sayfası Yönlendirme */}
              <div className="mt-16 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Tüm Yönetim Kadroları
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Yönetim Kurulu, Operasyon Ekibi ve Danışma Kurulu'ndan oluşan 
                    tüm yönetim kadrolarımızı detaylı olarak inceleyebilirsiniz.
                  </p>
                  <a 
                    href="/yonetim"
                    className="inline-flex items-center px-6 py-3 bg-itu-blue hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                  >
                    Yönetim Sayfasını İncele
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}