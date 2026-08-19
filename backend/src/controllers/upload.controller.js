import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import r2Client, { R2_BUCKET, R2_PUBLIC_URL } from '../config/r2.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/admin/upload
 * Upload image to Cloudflare R2
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file provided', 400);
    }

    const folder = req.body.folder || 'products';
    const ext = path.extname(req.file.originalname) || '.jpg';
    const key = `${folder}/${randomUUID()}${ext}`;

    // Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // R2 doesn't need ACL — use public bucket or custom domain
      })
    );

    const url = `${R2_PUBLIC_URL}/${key}`;

    successResponse(res, {
      url,
      publicId: key,
      size: req.file.size,
      mimetype: req.file.mimetype,
    }, 'Image uploaded');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/upload/:publicId
 * Delete image from Cloudflare R2
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    // publicId is the R2 object key (may contain slashes for folders)
    const key = req.query.fullId || publicId;

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );

    successResponse(res, null, 'Image deleted');
  } catch (error) {
    next(error);
  }
};
