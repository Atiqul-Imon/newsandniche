import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image
export const uploadImage = async (file: string, folder: string = 'superblog') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('ছবি আপলোড করতে সমস্যা হয়েছে');
  }
};

// Helper function to delete image
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('ছবি মুছতে সমস্যা হয়েছে');
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
} = {}) => {
  const { width, height, quality = 'auto:good', format = 'auto' } = options;
  
  if (!url.includes('cloudinary.com')) {
    return url;
  }
  
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const imagePath = url.split('/upload/')[1];
  
  let transformations = '';
  
  if (width || height) {
    transformations += `w_${width || 'auto'},h_${height || 'auto'},c_fill/`;
  }
  
  transformations += `q_${quality},f_${format}/`;
  
  return `${baseUrl}${transformations}${imagePath}`;
}; 