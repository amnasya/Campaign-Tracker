import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

// Allowed file types (images only)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
        ),
        false,
      );
    }
    callback(null, true);
  },
};

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE };

