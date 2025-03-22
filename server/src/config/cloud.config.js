import { v2 as cloudinary } from 'cloudinary';
import config from './config.js';

const {CLOUDINARY_API_KEY,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_SECRET} = config


cloudinary.config({
  cloud_name:CLOUDINARY_CLOUD_NAME,
  api_key:CLOUDINARY_API_KEY,
  api_secret:CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS access
});

export default cloudinary;