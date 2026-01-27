const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service key for backend operations
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// Local uploads directory - use /tmp for Vercel serverless, local path otherwise
const isVercel = process.env.VERCEL === '1';
const UPLOADS_DIR = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists (skip on Vercel until actually needed)
if (!isVercel && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Upload an image - tries Supabase first, falls back to local storage
 * @param {Buffer} buffer - The image buffer
 * @param {string} filename - Original filename
 * @param {string} bucket - Storage bucket name ('items' or 'requests')
 * @returns {Promise<{url: string, path: string}>} Public URL and storage path
 */
const uploadImage = async (buffer, filename, bucket = 'items') => {
  // Generate unique filename
  const timestamp = Date.now();
  const ext = filename.split('.').pop().toLowerCase();
  const uniqueName = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Try Supabase first if configured
  if (supabase) {
    try {
      const storagePath = `uploads/${uniqueName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: false
        });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);

        console.log('Image uploaded to Supabase:', urlData.publicUrl);
        return {
          url: urlData.publicUrl,
          path: storagePath
        };
      }

      console.error('Supabase upload error, falling back to local storage:', error.message);
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error.message);
    }
  }

  // Fallback to local file storage
  try {
    // Ensure uploads directory exists (create on demand for Vercel)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const localPath = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(localPath, buffer);

    // Return URL that will be served by Express static middleware
    const publicUrl = `/uploads/${uniqueName}`;
    console.log('Image saved locally:', publicUrl);

    return {
      url: publicUrl,
      path: localPath
    };
  } catch (error) {
    console.error('Local storage error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from storage
 * @param {string} imagePath - Storage path of the image
 * @param {string} bucket - Storage bucket name
 */
const deleteImage = async (imagePath, bucket = 'items') => {
  // Check if it's a local file
  if (imagePath.startsWith('/uploads/') || imagePath.includes(UPLOADS_DIR)) {
    try {
      const filename = path.basename(imagePath);
      const localPath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return { success: true };
    } catch (error) {
      console.error('Local delete error:', error);
      throw error;
    }
  }

  // Otherwise try Supabase
  if (supabase) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([imagePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  return { success: true };
};

/**
 * Get a signed URL for temporary access (useful for private buckets)
 * @param {string} storagePath - Storage path
 * @param {string} bucket - Bucket name
 * @param {number} expiresIn - Seconds until expiration (default 1 hour)
 */
const getSignedUrl = async (storagePath, bucket = 'items', expiresIn = 3600) => {
  // Local files don't need signed URLs
  if (storagePath.startsWith('/uploads/')) {
    return storagePath;
  }

  if (!supabase) {
    return storagePath;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
};

module.exports = {
  uploadImage,
  deleteImage,
  getSignedUrl,
  supabase
};
