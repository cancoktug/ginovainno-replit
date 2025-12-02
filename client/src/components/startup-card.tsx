import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Startup } from "@shared/schema";

interface StartupCardProps {
  startup: Startup;
}

export default function StartupCard({ startup }: StartupCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aktif":
        return "bg-ginova-orange text-white";
      case "büyüme":
        return "bg-green-500 text-white";
      case "ölçekleme":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-orange-50 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-itu-blue rounded-lg flex items-center justify-center mr-4">
            <div className="text-white text-xl" dangerouslySetInnerHTML={{ __html: startup.icon }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {startup.name}
              {startup.website && (
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-itu-blue"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </h3>
            <p className="text-gray-600">{startup.category}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{startup.description}</p>
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(startup.status)}>
            {startup.status}
          </Badge>
          {startup.funding && (
            <span className="text-itu-blue font-semibold">{startup.funding}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
