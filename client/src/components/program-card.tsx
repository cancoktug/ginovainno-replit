import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Program } from "@shared/schema";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={program.image} 
          alt={program.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="bg-ginova-orange text-white p-2 rounded-lg mr-3">
            <div className="text-lg" dangerouslySetInnerHTML={{ __html: program.icon }} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-itu-blue font-semibold">
            <Clock className="h-4 w-4 mr-1" />
            <span>{program.duration}</span>
          </div>
          <Link href={`/programlar/${program.name}`}>
            <Button variant="ghost" className="text-ginova-orange hover:text-ginova-orange/80 p-0">
              Detaylar <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
