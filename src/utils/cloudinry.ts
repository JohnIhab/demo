import cloudinary from './aws';
import fs from 'fs';
import path from 'path';

export const uploadVideo = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filePath, { resource_type: 'video' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.secure_url || '');
      });
    });
  };