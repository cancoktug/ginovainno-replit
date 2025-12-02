import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Globe } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact";
}

export default function EventCard({ event, variant = "default" }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = isNaN(eventDate.getTime()) 
    ? "Tarih belirtilmemiş" 
    : format(eventDate, "d MMMM yyyy", { locale: tr });

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Badge className="bg-ginova-orange text-white mr-4">
              {formattedDate}
            </Badge>
            <span className="text-itu-blue font-medium">{event.time}</span>
          </div>
          <Link href={`/etkinlikler/${event.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-itu-blue cursor-pointer transition-colors">{event.title}</h3>
          </Link>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              {event.isOnline ? (
                <Globe className="h-4 w-4 mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm">{event.location}</span>
            </div>
            <Link href={`/etkinlikler/${event.slug}/basvuru`}>
              <Button size="sm">Kayıt Ol</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Link href={`/etkinlikler/${event.slug}`}>
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-64 md:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>
        <div className="md:w-2/3 p-8">
          <div className="flex items-center mb-4">
            <Badge className="bg-ginova-orange text-white mr-4">
              {formattedDate}
            </Badge>
            <span className="text-itu-blue font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {event.time}
            </span>
          </div>
          <Link href={`/etkinlikler/${event.slug}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-itu-blue cursor-pointer transition-colors">{event.title}</h3>
          </Link>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              {event.isOnline ? (
                <Globe className="h-4 w-4 mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              <span>{event.location}</span>
            </div>
            <Link href={`/etkinlikler/${event.slug}/basvuru`}>
              <Button className="bg-itu-blue hover:bg-itu-blue/90">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
