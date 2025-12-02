import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (uploadedUrls: string[]) => void;
  buttonClassName?: string;
  children?: ReactNode;
  accept?: string;
  multiple?: boolean;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  accept = "image/*",
  multiple = false,
}: ObjectUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (files.length > maxNumberOfFiles) {
      alert(`En fazla ${maxNumberOfFiles} dosya yükleyebilirsiniz`);
      return;
    }

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`Dosya boyutu en fazla ${Math.round(maxFileSize / 1024 / 1024)}MB olabilir`);
        return;
      }
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const { url } = await onGetUploadParameters();
        
        const response = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!response.ok) {
          throw new Error(`Yükleme başarısız: ${response.statusText}`);
        }

        // Extract URL without query parameters
        const uploadedUrl = url.split('?')[0];
        uploadedUrls.push(uploadedUrl);
      }

      setUploadedFiles(prev => [...prev, ...uploadedUrls]);
      onComplete?.(uploadedUrls);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Dosya yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeFile = (urlToRemove: string) => {
    setUploadedFiles(prev => prev.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload">
          <Button
            type="button"
            disabled={uploading}
            className={buttonClassName}
            asChild
          >
            <span className="cursor-pointer">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {children || "Dosya Yükle"}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Yüklenen ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}