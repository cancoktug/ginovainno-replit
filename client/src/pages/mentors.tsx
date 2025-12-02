import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, MessageCircle, Calendar, Clock, User, Briefcase, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Mentor, MentorAvailability } from "@shared/schema";

export default function Mentors() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingStep, setBookingStep] = useState<'calendar' | 'form'>('calendar');
  const [selectedDateTime, setSelectedDateTime] = useState<{date: string, time: string} | null>(null);

  const { data: mentors = [], isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });

  const { data: availability = [] } = useQuery<MentorAvailability[]>({
    queryKey: [`/api/mentors/${selectedMentor?.id}/availability`],
    enabled: !!selectedMentor?.id,
  });

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Extract time from time slot (e.g., "09:00 - 09:30" -> "09:00")
    const timeSlot = formData.get("meetingTime") as string || selectedDateTime?.time || "";
    const meetingTime = timeSlot.includes(" - ") ? timeSlot.split(" - ")[0] : timeSlot;
    
    const bookingData = {
      applicantName: formData.get("applicantName") as string,
      applicantEmail: formData.get("applicantEmail") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      topic: formData.get("topic") as string,
      meetingDate: formData.get("meetingDate") as string || selectedDateTime?.date || "",
      meetingTime: meetingTime,
      duration: parseInt(formData.get("duration") as string) || 30,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch(`/api/mentors/${selectedMentor?.id}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      const result = await response.json();

      toast({ 
        title: "Randevu Talebi Gönderildi", 
        description: result.message || "E-posta bildirimleri gönderildi. Talebiniz değerlendirildikten sonra sizinle iletişime geçilecektir." 
      });
      
      setShowBookingDialog(false);
      setBookingStep('calendar');
      setSelectedDateTime(null);
    } catch (error) {
      toast({ 
        title: "Randevu Oluşturulamadı", 
        description: "Lütfen daha sonra tekrar deneyin.",
        variant: "destructive" 
      });
    }
  };

  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Mentörlerimiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Deneyimli mentörlerimizden bire-bir destek alın. Girişimcilik yolculuğunuzda 
            size rehberlik edecek uzmanlarla tanışın ve randevu alın.
          </p>
        </div>

        {/* Mentors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-itu-blue/20 group-hover:border-itu-blue/40 transition-colors"
                      />
                      {mentor.isAvailableForBooking && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                          <Calendar className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {mentor.name}
                      </h3>
                      <p className="text-itu-blue font-semibold">
                        {mentor.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {mentor.expertise}
                      </p>
                      
                      {mentor.bio && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          {mentor.bio.length > 120 ? `${mentor.bio.substring(0, 120)}...` : mentor.bio}
                        </p>
                      )}
                      
                      {/* Status Badge */}
                      <div className="flex justify-center">
                        {mentor.isAvailableForBooking ? (
                          <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            Randevu Açık
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-700 border-gray-300 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Randevu Kapalı
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 w-full">
                      {mentor.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      
                      {mentor.isAvailableForBooking && (
                        <Button
                          onClick={() => {
                            setSelectedMentor(mentor);
                            setBookingStep('calendar');
                            setSelectedDateTime(null);
                            setShowBookingDialog(true);
                          }}
                          className="flex-1 bg-itu-blue hover:bg-itu-blue/90"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Randevu Al
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz Mentör Bulunmuyor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yakında deneyimli mentörlerimizle tanışabileceksiniz.
            </p>
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={(open) => {
          setShowBookingDialog(open);
          if (!open) {
            setBookingStep('calendar');
            setSelectedDateTime(null);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="booking-description">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedMentor?.name} ile Randevu Al
              </DialogTitle>
              <p id="booking-description" className="text-sm text-gray-600">
                {bookingStep === 'calendar' 
                  ? 'Uygun tarih ve saati seçin'
                  : 'Görüşme bilgilerinizi girin'
                }
              </p>
            </DialogHeader>
            
            {bookingStep === 'calendar' ? (
              <CalendarView 
                mentor={selectedMentor} 
                availability={availability}
                onTimeSelect={(date, time) => {
                  setSelectedDateTime({date, time});
                  setBookingStep('form');
                }}
                onCancel={() => setShowBookingDialog(false)}
              />
            ) : (
              <BookingForm 
                mentor={selectedMentor}
                selectedDateTime={selectedDateTime}
                onSubmit={handleBookingSubmit}
                onBack={() => setBookingStep('calendar')}
                onCancel={() => setShowBookingDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Calendar View Component - Step 1
function CalendarView({ 
  mentor, 
  availability, 
  onTimeSelect, 
  onCancel 
}: {
  mentor: Mentor | null;
  availability: MentorAvailability[];
  onTimeSelect: (date: string, time: string) => void;
  onCancel: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  
  // Get available 30-minute time slots for selected date
  const getAvailableTimesForDate = (dateStr: string) => {
    if (!dateStr) return [];
    
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    
    const daySlots = availability.filter(slot => slot.dayOfWeek === dayOfWeek);
    
    return daySlots.flatMap(slot => {
      const times = [];
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      // Generate 30-minute slots
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        
        // Make sure there's enough time for a 30-minute slot
        if (minutes + 30 <= endMinutes) {
          const endTime = minutes + 30;
          const endHour = Math.floor(endTime / 60);
          const endMin = endTime % 60;
          const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
          times.push(`${timeStr} - ${endTimeStr}`);
        }
      }
      return times;
    });
  };
  
  const availableTimes = getAvailableTimesForDate(selectedDate);
  
  return (
    <div className="space-y-6">
      {/* Availability Overview */}
      {availability.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-sm mb-3">Mentörün Uygun Olduğu Günler ve Saatler:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from(new Set(availability.map(a => a.dayOfWeek))).map(day => (
              <div key={day} className="text-xs">
                <div className="font-medium text-itu-blue mb-1">{dayNames[day]}</div>
                {availability.filter(a => a.dayOfWeek === day).map(slot => (
                  <div key={slot.id} className="text-gray-600 dark:text-gray-300">
                    {slot.startTime} - {slot.endTime}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="selectedDate">Tarih Seçin *</Label>
        <Input
          id="selectedDate"
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
          }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full"
        />
      </div>
      
      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <Label>30 Dakikalık Zaman Dilimi Seçin *</Label>
          {availableTimes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableTimes.map(timeSlot => (
                <Button
                  key={timeSlot}
                  variant={selectedTime === timeSlot ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(timeSlot)}
                  className={`text-xs p-3 h-auto ${selectedTime === timeSlot ? "bg-itu-blue hover:bg-itu-blue/90" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{timeSlot}</span>
                    <span className="text-xs opacity-75">(30 dakika)</span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              Seçilen tarihte uygun zaman dilimi bulunmuyor. Lütfen başka bir tarih seçin.
            </p>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          İptal
        </Button>
        <Button 
          onClick={() => selectedDate && selectedTime && onTimeSelect(selectedDate, selectedTime)}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 bg-itu-blue hover:bg-itu-blue/90"
        >
          Devam Et
          <Calendar className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Booking Form Component - Step 2
function BookingForm({ 
  mentor, 
  selectedDateTime, 
  onSubmit, 
  onBack, 
  onCancel 
}: {
  mentor: Mentor | null;
  selectedDateTime: {date: string, time: string} | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Selected DateTime Summary */}
      {selectedDateTime && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-sm text-green-800 dark:text-green-200 mb-2">
            Seçilen Randevu Zamanı:
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>{new Date(selectedDateTime.date).toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</strong> - <strong>{selectedDateTime.time}</strong>
          </p>
        </div>
      )}
      
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicantName">Ad Soyad *</Label>
          <Input
            id="applicantName"
            name="applicantName"
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="applicantEmail">E-posta *</Label>
          <Input
            id="applicantEmail"
            name="applicantEmail"
            type="email"
            required
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Şirket/Kurum</Label>
          <Input
            id="company"
            name="company"
            className="w-full"
          />
        </div>
      </div>

      {/* Meeting Details */}
      <div className="space-y-2">
        <Label htmlFor="topic">Görüşme Konusu *</Label>
        <Input
          id="topic"
          name="topic"
          placeholder="Örn: Startup kurmak için stratejik yol haritası"
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Süre (dakika) *</Label>
        <Select name="duration" required>
          <SelectTrigger>
            <SelectValue placeholder="Süre seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 dakika</SelectItem>
            <SelectItem value="45">45 dakika</SelectItem>
            <SelectItem value="60">60 dakika</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Ek Mesaj</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Görüşmekle ilgili ek bilgiler..."
          rows={3}
          className="w-full"
        />
      </div>
      
      {/* Hidden fields for selected date/time */}
      <input type="hidden" name="meetingDate" value={selectedDateTime?.date || ""} />
      <input type="hidden" name="meetingTime" value={selectedDateTime?.time || ""} />
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          İptal
        </Button>
        <Button type="submit" className="flex-1 bg-itu-blue hover:bg-itu-blue/90">
          Randevu Talebini Gönder
        </Button>
      </div>
    </form>
  );
}