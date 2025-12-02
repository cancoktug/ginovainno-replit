import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Clock,
  Eye,
  Mail,
  Phone,
  User,
  GraduationCap,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  UserCheck,
  Building,
  HeartHandshake
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Application, Program, EventApplication, MentorBooking } from "@shared/schema";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  waitlist: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
};

const statusIcons = {
  pending: Clock3,
  approved: CheckCircle,
  rejected: XCircle,
  waitlist: UserCheck,
  confirmed: CheckCircle,
};

const statusLabels = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  waitlist: "Bekleme Listesi",
  confirmed: "Onaylandı",
};

export default function ApplicationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [applicationType, setApplicationType] = useState<'program' | 'event' | 'mentor' | 'contact'>('program');

  // Fetch all application types
  const { data: programApplications = [], isLoading: programLoading } = useQuery({
    queryKey: ["/api/applications"],
  });

  const { data: eventApplications = [], isLoading: eventLoading } = useQuery({
    queryKey: ["/api/event-applications"],
  });

  const { data: mentorBookings = [], isLoading: mentorLoading } = useQuery({
    queryKey: ["/api/mentor-bookings"],
  });

  const { data: programs = [] } = useQuery({
    queryKey: ["/api/programs"],
  });

  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: mentors = [] } = useQuery({
    queryKey: ["/api/mentors"],
  });

  const isLoading = programLoading || eventLoading || mentorLoading;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reviewNotes, type }: { id: number; status: string; reviewNotes?: string; type: string }) => {
      const endpoint = type === 'event' ? `/api/event-applications/${id}/status` 
        : type === 'mentor' ? `/api/mentor-bookings/${id}/status`
        : `/api/applications/${id}/status`;
      return apiRequest("PATCH", endpoint, { status, reviewNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/event-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mentor-bookings"] });
      toast({
        title: "Başarılı",
        description: "Başvuru durumu güncellendi.",
      });
      setIsReviewDialogOpen(false);
      setSelectedApplication(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Başvuru durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleReview = (application: any, type: string) => {
    setSelectedApplication({ ...application, type });
    setReviewNotes(application.reviewNotes || "");
    setIsReviewDialogOpen(true);
  };

  const handleStatusUpdate = (status: string) => {
    if (!selectedApplication) return;
    
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status,
      reviewNotes,
      type: selectedApplication.type
    });
  };

  const getProgramName = (programId: number) => {
    const program = programs.find((p: Program) => p.id === programId);
    return program?.title || "Bilinmeyen Program";
  };

  const getEventName = (eventId: number) => {
    const event = events.find((e: any) => e.id === eventId);
    return event?.title || "Bilinmeyen Etkinlik";
  };

  const getMentorName = (mentorId: number) => {
    const mentor = mentors.find((m: any) => m.id === mentorId);
    return mentor?.name || "Bilinmeyen Mentör";
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock3;
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        <Icon className="h-3 w-3 mr-1" />
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Başvurular</h2>
        </div>
        <div className="text-center py-8">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tüm Başvurular</h2>
        <div className="text-sm text-gray-500">
          Program: {programApplications.length} | Etkinlik: {eventApplications.length} | Mentör: {mentorBookings.length}
        </div>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Program Başvuruları ({programApplications.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Etkinlik Başvuruları ({eventApplications.length})
          </TabsTrigger>
          <TabsTrigger value="mentor" className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Mentör Randevuları ({mentorBookings.length})
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            İletişim Mesajları
          </TabsTrigger>
        </TabsList>

        {/* Program Applications */}
        <TabsContent value="programs" className="space-y-4">
          {programApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Henüz program başvurusu bulunmuyor.
              </CardContent>
            </Card>
          ) : (
            programApplications.map((application: Application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.firstName} {application.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getProgramName(application.programId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(application, 'program')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        İncele
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {application.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {application.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {application.submittedAt ? format(new Date(application.submittedAt), "dd MMMM yyyy", { locale: tr }) : "Tarih belirtilmemiş"}
                    </div>
                  </div>

                  {application.reviewNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Değerlendirme Notu:</strong> {application.reviewNotes}
                      </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
        </TabsContent>

        {/* Event Applications */}
        <TabsContent value="events" className="space-y-4">
          {eventApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Henüz etkinlik başvurusu bulunmuyor.
              </CardContent>
            </Card>
          ) : (
            eventApplications.map((application: any) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.firstName} {application.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getEventName(application.eventId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(application, 'event')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        İncele
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {application.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {application.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {application.submittedAt ? format(new Date(application.submittedAt), "dd MMMM yyyy", { locale: tr }) : "Tarih belirtilmemiş"}
                    </div>
                  </div>

                  {application.reviewNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Değerlendirme Notu:</strong> {application.reviewNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Mentor Bookings */}
        <TabsContent value="mentor" className="space-y-4">
          {mentorBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Henüz mentör randevusu bulunmuyor.
              </CardContent>
            </Card>
          ) : (
            mentorBookings.map((booking: any) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.applicantName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getMentorName(booking.mentorId)} ile randevu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {booking.status === 'confirmed' ? 'Onaylandı' : 'Beklemede'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(booking, 'mentor')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        İncele
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {booking.applicantEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {booking.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {booking.meetingDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {booking.meetingTime}
                    </div>
                  </div>

                  {booking.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Mesaj:</strong> {booking.message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Contact Messages - Placeholder for now */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              İletişim mesajları yakında eklenecek.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Başvuru İnceleme - {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication && getProgramName(selectedApplication.programId)} programına yapılan başvuru
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Kişisel Bilgiler
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ad Soyad:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
                    <p><strong>E-posta:</strong> {selectedApplication.email}</p>
                    <p><strong>Telefon:</strong> {selectedApplication.phone}</p>
                    <p><strong>Doğum Tarihi:</strong> {selectedApplication.birthDate}</p>
                    {selectedApplication.linkedinProfile && (
                      <p><strong>LinkedIn:</strong> {selectedApplication.linkedinProfile}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Eğitim ve Deneyim
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Eğitim Durumu:</strong> {selectedApplication.education}</p>
                    <p><strong>Girişimcilik Deneyimi:</strong> {selectedApplication.experience}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Motivasyon
                  </h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApplication.motivation}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Beklentiler
                  </h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApplication.expectations}</p>
                </div>

                {selectedApplication.previousExperience && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Önceki Deneyimler
                    </h4>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApplication.previousExperience}</p>
                  </div>
                )}
              </div>

              {/* Review Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Değerlendirme</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Durum</label>
                    <Select
                      value={selectedApplication.status}
                      onValueChange={(value) => {
                        setSelectedApplication({
                          ...selectedApplication,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Beklemede</SelectItem>
                        <SelectItem value="approved">Onaylandı</SelectItem>
                        <SelectItem value="rejected">Reddedildi</SelectItem>
                        <SelectItem value="waitlist">Bekleme Listesi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Değerlendirme Notu</label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Bu başvuru hakkında notlarınızı yazın..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              onClick={() => handleStatusUpdate(selectedApplication?.status || "pending")}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}