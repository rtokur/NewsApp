import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadProfileImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    try {
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'profile-images',
            public_id: `user-${userId}-${Date.now()}`,
            transformation: [
              { width: 500, height: 500, crop: 'fill' },
              { quality: 'auto' },
            ],
          },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            
            if (!result) {
              return reject(new Error('Upload failed - no result'));
            }

            console.log('Image uploaded to Cloudinary:', result.secure_url);
            resolve(result.secure_url);
          },
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex === -1) {
        console.warn('⚠️ Invalid Cloudinary URL format');
        return;
      }

      const afterUpload = urlParts.slice(uploadIndex + 1);
      
      const startIndex = afterUpload[0].startsWith('v') ? 1 : 0;
      
      const pathWithoutExt = afterUpload
        .slice(startIndex)
        .join('/')
        .replace(/\.[^/.]+$/, '');

      const publicId = pathWithoutExt;

      console.log('🗑️ Deleting image with public_id:', publicId);
      
      await cloudinary.uploader.destroy(publicId);
      
      console.log('Image deleted from Cloudinary');
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
    }
  }
}