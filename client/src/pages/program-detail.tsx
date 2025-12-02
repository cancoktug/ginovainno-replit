import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star,
  ArrowLeft,
  CheckCircle 
} from "lucide-react";
import { programsApi } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import type { Program } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function ProgramDetail() {
  const { id } = useParams();
  
  const { data: program, isLoading, error } = useQuery<Program>({
    queryKey: [`/api/programs/slug/${id}`],
    enabled: !!id,
  });



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız program mevcut değil.</p>
          <Link href="/programlar">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Programlara Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/programlar">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Programlara Dön
            </Button>
          </Link>
          <div className="flex items-start gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl" dangerouslySetInnerHTML={{ __html: program.icon }} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {program.title}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                {program.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {program.category}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {program.level}
                </Badge>
                {program.price && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {program.price}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Image */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={program.image} 
                alt={program.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Program Hakkında</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {program.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {program.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Başvuru Koşulları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: program.requirements }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Syllabus */}
            {program.syllabus && (
              <Card>
                <CardHeader>
                  <CardTitle>Program İçeriği</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: program.syllabus }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructors */}
            {program.instructors && (
              <Card>
                <CardHeader>
                  <CardTitle>Eğitmenler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: program.instructors }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Program Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-itu-blue" />
                  <div>
                    <p className="font-medium">Süre</p>
                    <p className="text-sm text-gray-600">{program.duration}</p>
                  </div>
                </div>

                {program.capacity && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Kapasite</p>
                      <p className="text-sm text-gray-600">{program.capacity} kişi</p>
                    </div>
                  </div>
                )}

                {program.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Lokasyon</p>
                      <p className="text-sm text-gray-600">{program.location}</p>
                    </div>
                  </div>
                )}

                {program.price && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Ücret</p>
                      <p className="text-sm text-gray-600">{program.price}</p>
                    </div>
                  </div>
                )}

                {program.startDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Başlangıç Tarihi</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(program.startDate), "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                )}

                {program.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-itu-blue" />
                    <div>
                      <p className="font-medium">Bitiş Tarihi</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(program.endDate), "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                )}

                {program.applicationDeadline && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-ginova-orange" />
                    <div>
                      <p className="font-medium">Başvuru Deadline</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(program.applicationDeadline), "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application CTA */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Star className="h-12 w-12 text-ginova-orange mx-auto" />
                  <h3 className="text-lg font-semibold">Programa Başvur</h3>
                  <p className="text-sm text-gray-600">
                    Bu programa katılmak için hemen başvurunuzu yapın.
                  </p>
                  <Link href={`/programlar/${program.name}/basvuru`}>
                    <Button className="w-full bg-ginova-orange hover:bg-ginova-orange/90">
                      Başvuru Yap
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}