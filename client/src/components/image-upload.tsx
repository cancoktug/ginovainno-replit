import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  type: "blog" | "programs" | "mentors" | "startups" | "events" | "team";
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  type, 
  label = "Görsel", 
  placeholder = "Görsel URL'si veya dosya yükleyin" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Dosya yükleme başarısız');
      }

      const result = await response.json();
      const fullUrl = window.location.origin + result.url;
      
      onChange(fullUrl);
      setPreviewUrl(fullUrl);
      
      toast({
        title: "Başarılı",
        description: "Görsel başarıyla yüklendi",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  const handleRemove = () => {
    onChange("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File Upload */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Yükleniyor..." : "Dosya Yükle"}
        </Button>
        <span className="text-sm text-gray-500">
          veya yukarıya URL yazın
        </span>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
            <img
              src={previewUrl}
              alt="Önizleme"
              className="w-full h-full object-cover"
              onError={() => {
                setPreviewUrl("");
                toast({
                  title: "Hata",
                  description: "Görsel yüklenemedi. URL'yi kontrol edin.",
                  variant: "destructive",
                });
              }}
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {!previewUrl && (
        <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Görsel önizlemesi burada görünecek</p>
          </div>
        </div>
      )}
    </div>
  );
}