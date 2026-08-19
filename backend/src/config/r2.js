import { S3Client } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 Configuration
 * R2 is S3-compatible, so we use the AWS SDK with R2 endpoint
 * 
 * Free Tier: 10GB storage, 10M Class B requests/month
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME || 'mazhaivaanam';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Your custom domain or R2 public URL

export default r2Client;
