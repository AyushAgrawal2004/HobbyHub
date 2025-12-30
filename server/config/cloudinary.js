const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_URL.split('@')[1], // Hacky parse or just use individual env vars if available. 
    // Wait, the user provided CLOUDINARY_URL which the library auto-detects if env var is set.
    // However, for multer-storage-cloudinary, we often need to pass the cloudinary object.
    // Let's rely on process.env.CLOUDINARY_URL being picked up by cloudinary.config() if we don't pass args, 
    // OR parse the URL string provided in .env `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
});

// Robust parsing of CLOUDINARY_URL for explicit config if needed by storage engine
const cloudinaryUrl = process.env.CLOUDINARY_URL;
let cloud_name, api_key, api_secret;

if (cloudinaryUrl) {
    const matches = cloudinaryUrl.match(/cloudinary:\/\/(\w+):(\w+)@(\w+)/);
    if (matches) {
        api_key = matches[1];
        api_secret = matches[2];
        cloud_name = matches[3];

        cloudinary.config({
            cloud_name: cloud_name,
            api_key: api_key,
            api_secret: api_secret
        });
    }
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hobbyhub',
        resource_type: 'auto', // Allow images and audio (video/raw)
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp3', 'wav', 'mpeg', 'mp4', 'avif', 'webp', 'webm'],
    },
});

module.exports = {
    cloudinary,
    storage
};
