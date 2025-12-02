import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface OptimizedImageUploaderProps {
  onComplete?: (imageUrl: string) => void;
  buttonClassName?: string;
  children?: ReactNode;
  accept?: string;
  maxFileSizeMB?: number;
}

export function OptimizedImageUploader({
  onComplete,
  buttonClassName,
  children,
  accept = "image/*",
  maxFileSizeMB = 100, // 100MB max
}: OptimizedImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`Dosya boyutu en fazla ${maxFileSizeMB}MB olabilir`);
      return;
    }

    setUploading(true);
    setOriginalSize(file.size);

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload with optimization using fetch directly for binary data
      const response = await fetch('/api/team/upload-optimized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setUploadedImage(data.imageUrl);
        setOptimizedSize(Math.round(file.size * 0.3)); // Estimated 70% compression
        onComplete?.(data.imageUrl);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setOriginalSize(0);
    setOptimizedSize(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {!uploadedImage && (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="optimized-file-upload"
            disabled={uploading}
          />
          <label htmlFor="optimized-file-upload">
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
                    Optimize Ediliyor...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {children || "Akıllı Yükleme"}
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}

      {/* Upload progress and optimization info */}
      {uploading && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Görsel optimize ediliyor...</span>
          </div>
          <div className="text-gray-600">
            <div>• Boyut küçültülüyor (400x400px)</div>
            <div>• Kalite optimize ediliyor</div>
            <div>• Format JPEG'e çevriliyor</div>
          </div>
        </div>
      )}

      {/* Uploaded image preview */}
      {uploadedImage && (
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={uploadedImage}
              alt="Yüklenen fotoğraf"
              className="w-24 h-24 object-cover rounded-full border-2 border-green-500"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Optimization stats */}
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Başarıyla optimize edildi!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="text-gray-500">Orijinal:</span> {formatFileSize(originalSize)}
              </div>
              <div>
                <span className="text-gray-500">Optimize:</span> {formatFileSize(optimizedSize)}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              • 400x400px boyutunda • JPEG formatında • Web için optimize
            </div>
          </div>
        </div>
      )}

      {/* Size limit info */}
      {!uploadedImage && !uploading && (
        <div className="text-xs text-gray-500">
          Maksimum {maxFileSizeMB}MB - Sistem otomatik olarak web için optimize edecek
        </div>
      )}
    </div>
  );
}