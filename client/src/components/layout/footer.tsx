import { Link } from "wouter";
import { Mail, MapPin, Phone, Linkedin, Instagram, Youtube } from "lucide-react";
import { SiX } from "react-icons/si";
import ginovaLogoPath from "@assets/Çalışma Yüzeyi 1_1751912890064.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="h-16 w-auto bg-gradient-to-r from-itu-blue to-ginova-orange rounded-lg p-4 mr-4">
                <img 
                  src={ginovaLogoPath} 
                  alt="Ginova" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <span className="text-white">İTÜ</span>
                  <span className="text-ginova-orange ml-1">Ginova</span>
                </div>
                <div className="text-gray-400 text-sm">Girişimcilik ve İnovasyon Merkezi</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              İstanbul Teknik Üniversitesi bünyesinde faaliyet gösteren Ginova, 
              Türkiye'nin önde gelen girişimcilik ve inovasyon merkezlerinden biridir.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/itu-ginova" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ginova-orange transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://x.com/ITUginova" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ginova-orange transition-colors">
                <SiX className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/ituginova/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ginova-orange transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@itu.ginova" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ginova-orange transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/programlar" className="text-gray-400 hover:text-white transition-colors">
                  Programlar
                </Link>
              </li>
              <li>
                <Link href="/mentorlar" className="text-gray-400 hover:text-white transition-colors">
                  Mentörler
                </Link>
              </li>
              <li>
                <Link href="/projeler" className="text-gray-400 hover:text-white transition-colors">
                  Projeler
                </Link>
              </li>
              <li>
                <Link href="/startuplar" className="text-gray-400 hover:text-white transition-colors">
                  Startup'lar
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-gray-400 hover:text-white transition-colors">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-white transition-colors">
                  CMS Giriş
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  İTÜ Ayazağa Kampüsü Med B Binası<br/>
                  34469 Sarıyer, İstanbul
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>(0212) 285 75 06</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>ginova@itu.edu.tr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 İTÜ Ginova - Girişimcilik ve İnovasyon Merkezi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
