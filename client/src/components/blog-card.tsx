import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const dateToUse = post.publishedAt || post.createdAt;
  const publishedDate = new Date(dateToUse);
  
  // Validate date before formatting
  const formattedDate = isNaN(publishedDate.getTime()) 
    ? "Tarih belirtilmemiş" 
    : format(publishedDate, "d MMMM yyyy", { locale: tr });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "news":
      case "etkinlik":
      case "haber":
        return "bg-light-orange text-ginova-orange";
      case "blog":
        return "bg-light-blue text-itu-blue";
      case "guides":
      case "rehber":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case "news":
      case "etkinlik":
        return "Haber";
      case "blog":
        return "Blog";
      case "guides":
        return "Rehber";
      default:
        return category;
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge className={getCategoryColor(post.category)}>
            {getCategoryDisplayName(post.category)}
          </Badge>
          <div className="flex items-center text-gray-500 text-sm ml-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-itu-blue transition-colors cursor-pointer line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {post.author}
          </span>
          <Link href={`/blog/${post.slug}`}>
            <Button variant="ghost" className="text-ginova-orange hover:text-ginova-orange/80 p-0">
              Devamını Oku <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
