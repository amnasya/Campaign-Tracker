import { Transform } from 'class-transformer';
import { sanitizeString } from '../common/utils/sanitization.util';

/**
 * Decorator to automatically sanitize string inputs
 * Apply to DTO properties to prevent injection attacks
 */
export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return sanitizeString(value);
    }
    return value;
  });
}

