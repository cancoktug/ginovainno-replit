import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";
import type { Mentor } from "@shared/schema";

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 text-center">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <img 
            src={mentor.image} 
            alt={mentor.name}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
        <p className="text-ginova-orange font-medium mb-2">{mentor.title}</p>
        <p className="text-gray-600 text-sm mb-4">{mentor.expertise}</p>
        <div className="flex justify-center space-x-3">
          {mentor.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 text-itu-blue" />
              </a>
            </Button>
          )}
          {mentor.email && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`mailto:${mentor.email}`}>
                <Mail className="h-4 w-4 text-itu-blue" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
