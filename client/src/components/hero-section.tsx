import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Rocket, Calendar, UserCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative animated-gradient overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 backdrop-overlay"></div>
      
      {/* Floating geometric shapes with animation */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white rounded-full opacity-25 animate-bounce" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-shadow-strong">
              Girişimcilik ve 
              <span className="text-cyan-200 drop-shadow-lg"> İnovasyon</span> Merkezi
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white leading-relaxed text-shadow-strong">
              İstanbul Teknik Üniversitesi bünyesinde geleceğin girişimcilerini yetiştiriyor, 
              yenilikçi projeleri hayata geçiriyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/programlar">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-itu-blue font-bold text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all duration-200">
                  Programlara Katıl
                </Button>
              </Link>
              <Link href="/etkinlikler">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-itu-blue text-lg px-8 py-4 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 text-shadow-strong"
                >
                  Etkinliklere Göz At
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-25 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
                  <Rocket className="h-8 w-8 text-cyan-200 mb-2 mx-auto drop-shadow-lg" />
                  <div className="text-white font-bold text-xl text-shadow-strong">50+</div>
                  <div className="text-white text-sm font-medium">Startup</div>
                </div>
                <div className="bg-white bg-opacity-25 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
                  <Users className="h-8 w-8 text-cyan-200 mb-2 mx-auto drop-shadow-lg" />
                  <div className="text-white font-bold text-xl text-shadow-strong">500+</div>
                  <div className="text-white text-sm font-medium">Girişimci</div>
                </div>
                <div className="bg-white bg-opacity-25 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
                  <Calendar className="h-8 w-8 text-cyan-200 mb-2 mx-auto drop-shadow-lg" />
                  <div className="text-white font-bold text-xl text-shadow-strong">100+</div>
                  <div className="text-white text-sm font-medium">Etkinlik & Program</div>
                </div>
                <div className="bg-white bg-opacity-25 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
                  <UserCheck className="h-8 w-8 text-cyan-200 mb-2 mx-auto drop-shadow-lg" />
                  <div className="text-white font-bold text-xl text-shadow-strong">2000+</div>
                  <div className="text-white text-sm font-medium">Katılımcı</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
