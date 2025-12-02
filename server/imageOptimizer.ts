let sharp: any = null;
let sharpAvailable = false;

try {
  sharp = require('sharp');
  sharpAvailable = true;
  console.log('Sharp module loaded successfully - image optimization enabled');
} catch (error) {
  console.warn('Sharp module not available - image optimization disabled, images will be saved as-is');
  sharpAvailable = false;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  progressive?: boolean;
}

export class ImageOptimizer {
  static isAvailable(): boolean {
    return sharpAvailable;
  }

  static async optimizeProfilePhoto(
    imageBuffer: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<Buffer> {
    if (!sharpAvailable) {
      console.log('Sharp not available, returning original image');
      return imageBuffer;
    }

    const {
      maxWidth = 400,
      maxHeight = 400,
      quality = 85,
      format = 'jpeg',
      progressive = true
    } = options;

    try {
      let pipeline = sharp(imageBuffer)
        .resize(maxWidth, maxHeight, {
          fit: 'cover',
          position: 'centre'
        })
        .rotate();

      switch (format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality,
            progressive,
            mozjpeg: true
          });
          break;
        case 'png':
          pipeline = pipeline.png({
            quality,
            progressive,
            compressionLevel: 9,
            palette: true
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality,
            effort: 6
          });
          break;
      }

      return await pipeline.toBuffer();
    } catch (error) {
      console.error('Error optimizing image, returning original:', error);
      return imageBuffer;
    }
  }

  static async getOptimizedDimensions(
    imageBuffer: Buffer,
    maxWidth: number,
    maxHeight: number
  ): Promise<{ width: number; height: number }> {
    if (!sharpAvailable) {
      return { width: maxWidth, height: maxHeight };
    }

    try {
      const metadata = await sharp(imageBuffer).metadata();
      const { width = 0, height = 0 } = metadata;

      if (width <= maxWidth && height <= maxHeight) {
        return { width, height };
      }

      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);

      return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio)
      };
    } catch (error) {
      console.error('Error getting dimensions:', error);
      return { width: maxWidth, height: maxHeight };
    }
  }

  static async createResponsiveSizes(
    imageBuffer: Buffer,
    sizes: { width: number; height: number; suffix: string }[]
  ): Promise<{ [suffix: string]: Buffer }> {
    const results: { [suffix: string]: Buffer } = {};

    if (!sharpAvailable) {
      for (const size of sizes) {
        results[size.suffix] = imageBuffer;
      }
      return results;
    }

    for (const size of sizes) {
      try {
        const optimized = await this.optimizeProfilePhoto(imageBuffer, {
          maxWidth: size.width,
          maxHeight: size.height,
          quality: 85,
          format: 'jpeg'
        });
        results[size.suffix] = optimized;
      } catch (error) {
        console.error(`Error creating size ${size.suffix}:`, error);
        results[size.suffix] = imageBuffer;
      }
    }

    return results;
  }

  static async detectOptimalFormat(imageBuffer: Buffer): Promise<'jpeg' | 'png' | 'webp'> {
    if (!sharpAvailable) {
      return 'jpeg';
    }

    try {
      const metadata = await sharp(imageBuffer).metadata();
      const stats = await sharp(imageBuffer).stats();

      if (metadata.channels === 4 || metadata.hasAlpha) {
        return 'png';
      }

      const isPhoto = stats.channels.some((channel: any) => 
        channel.std && channel.std > 30
      );

      return isPhoto ? 'jpeg' : 'png';
    } catch (error) {
      console.error('Error detecting optimal format:', error);
      return 'jpeg';
    }
  }

  static async smartCompress(
    imageBuffer: Buffer,
    targetSizeKB: number = 200
  ): Promise<Buffer> {
    if (!sharpAvailable) {
      return imageBuffer;
    }

    let quality = 90;
    let optimized = imageBuffer;

    while (quality >= 50) {
      try {
        const compressed = await this.optimizeProfilePhoto(imageBuffer, {
          quality,
          maxWidth: 400,
          maxHeight: 400,
          format: 'jpeg'
        });

        if (compressed.length <= targetSizeKB * 1024) {
          return compressed;
        }

        optimized = compressed;
        quality -= 10;
      } catch (error) {
        console.error('Error during smart compression:', error);
        break;
      }
    }

    return optimized;
  }
}
