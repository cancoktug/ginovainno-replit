import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-red-600 dark:text-red-400">
            Projeler yüklenirken bir hata oluştu.
          </div>
        </div>
      </div>
    );
  }

  // Projeleri duruma göre grupla
  const ongoingProjects = projects.filter(project => project.status === 'ongoing');
  const completedProjects = projects.filter(project => project.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-itu-blue/5 to-ginova-orange/5"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-itu-blue/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-ginova-orange/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <div className="w-2 h-2 bg-itu-blue rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Araştırma & Geliştirme</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-itu-blue via-blue-600 to-ginova-orange bg-clip-text text-transparent">
              Akademik
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Projeler
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            İTÜ Ginova bünyesinde yürütülen <span className="font-semibold text-itu-blue">yenilikçi araştırma</span> 
            ve <span className="font-semibold text-ginova-orange">geliştirme projelerimiz</span>
          </p>

          {/* Statistics cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-3xl font-bold text-itu-blue mb-2">{projects.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Proje</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-3xl font-bold text-green-600 mb-2">{ongoingProjects.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Devam Eden</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-3xl font-bold text-blue-600 mb-2">{completedProjects.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Tamamlanan</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-3xl font-bold text-ginova-orange mb-2">🔬</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Araştırma</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itu-blue"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Devam Eden Projeler */}
              {ongoingProjects.length > 0 && (
                <div className="relative">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800 mb-6">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-green-700 dark:text-green-300 font-semibold">Aktif Projeler</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      <span className="text-gray-900 dark:text-white">Devam Eden</span>
                      <br />
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Projeler
                      </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      Şu anda yürütülmekte olan <span className="font-semibold">araştırma</span> ve <span className="font-semibold">geliştirme projelerimiz</span>
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ongoingProjects.map((project, index) => (
                      <div key={project.id} 
                           className="animate-fade-in"
                           style={{ animationDelay: `${index * 0.1}s` }}>
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tamamlanan Projeler */}
              {completedProjects.length > 0 && (
                <div className="relative">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800 mb-6">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-blue-700 dark:text-blue-300 font-semibold">Başarılı Projeler</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      <span className="text-gray-900 dark:text-white">Tamamlanan</span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-600 to-itu-blue bg-clip-text text-transparent">
                        Projeler
                      </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      <span className="font-semibold text-blue-600">Başarıyla tamamladığımız</span> ve 
                      <span className="font-semibold text-itu-blue"> değer yaratan projelerimiz</span>
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completedProjects.map((project, index) => (
                      <div key={project.id} 
                           className="animate-fade-in"
                           style={{ animationDelay: `${index * 0.1}s` }}>
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiç proje yoksa */}
              {projects.length === 0 && !isLoading && (
                <div className="text-center py-24">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-itu-blue/20 to-ginova-orange/20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Henüz proje bulunmuyor
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                      Yakında projeler eklenecektir. Araştırma ve geliştirme faaliyetlerimiz hakkında güncellemeler için takipte kalın.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-itu-blue/30 overflow-hidden">
      {/* Top accent line */}
      <div className={`h-1 w-full ${project.status === 'ongoing' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-itu-blue'}`}></div>
      
      <CardContent className="p-6 relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-itu-blue/5 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>

        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant={project.status === 'ongoing' ? 'default' : 'secondary'}
                className={project.status === 'ongoing' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                }
              >
                {project.status === 'ongoing' ? 'Devam Ediyor' : 'Tamamlandı'}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
              {project.title}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {project.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Proje Türü:</span>
              <Badge variant="outline" className="text-xs">
                {project.type}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Destekçi:</span>
              <p className="text-gray-900 dark:text-white text-wrap break-words">{project.supporter}</p>
            </div>
            
            {project.budgetAmount && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500 dark:text-gray-400">Bütçe:</span>
                <span className="text-gray-900 dark:text-white">{project.budgetAmount} {project.budgetCurrency}</span>
              </div>
            )}
            
            {project.duration && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500 dark:text-gray-400">Süre:</span>
                <span className="text-gray-900 dark:text-white">{project.duration}</span>
              </div>
            )}
            
            {project.task && (
              <div className="space-y-1 text-sm">
                <span className="font-medium text-gray-500 dark:text-gray-400">Proje Görevi:</span>
                <p className="text-gray-900 dark:text-white text-sm leading-relaxed">{project.task}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}