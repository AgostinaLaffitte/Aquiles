import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream'; // Asegúrate de instalarlo
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class CloudinaryService {

  
  

 async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Verificación de seguridad
      if (!process.env.CLOUDINARY_NAME) {
        return reject(new Error("Cloudinary no está configurado (variables faltantes)"));
      }

      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Error al subir imagen"));
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}