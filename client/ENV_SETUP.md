# Environment Variables Setup

This project uses environment variables to securely manage S3 image URLs.

## Setup Instructions

1. **Create a `.env.local` file** in the root directory of the project (same level as `package.json`)

2. **Add the following environment variables:**

```env
# S3 Image Storage Configuration
NEXT_PUBLIC_S3_BASE_URL=https://falsenine-image-storage.s3.ap-south-1.amazonaws.com

# Individual Image Paths
NEXT_PUBLIC_IMAGE_HERO_SECTION=hero-section-image.png
NEXT_PUBLIC_IMAGE_BANNER=banner-image.png
NEXT_PUBLIC_IMAGE_ABOUT_SECTION=about-section-image.png
NEXT_PUBLIC_IMAGE_CONTACT_SECTION=contact-section-image.png
NEXT_PUBLIC_IMAGE_LEFT_SIDE=left-side-image.png
NEXT_PUBLIC_IMAGE_RIGHT_SIDE=right-side-image.png
```

3. **Restart your development server** after creating/updating the `.env.local` file

## Security Notes

- The `.env.local` file is already in `.gitignore` and will not be committed to version control
- All environment variables are prefixed with `NEXT_PUBLIC_` to make them available in the browser
- The image configuration is centralized in `src/config/images.ts` for easy management

## Usage

All images are accessed through the `IMAGES` object from `@/config/images`:

```typescript
import { IMAGES } from "@/config/images";

// Use in components
<Image src={IMAGES.HERO_SECTION} alt="Hero" />
```

## Changing Image URLs

To change image URLs, simply update the values in your `.env.local` file and restart the server. No code changes are needed.

