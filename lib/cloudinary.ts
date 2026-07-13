import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Server-only. Uploads a data URL (customer graphic upload or a generated
 * customizer proof) straight to Cloudinary and returns the hosted URL.
 */
export async function uploadDataUrl(dataUrl: string, folder: string) {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `ultiu/${folder}`,
    resource_type: "auto",
  });
  return result.secure_url;
}
