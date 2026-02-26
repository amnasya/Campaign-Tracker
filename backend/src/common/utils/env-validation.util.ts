/**
 * Environment variable validation utility
 * Validates required environment variables on application startup
 */

interface EnvVariable {
  key: string;
  description: string;
  required: boolean;
}

const REQUIRED_ENV_VARIABLES: EnvVariable[] = [
  {
    key: 'DATABASE_URL',
    description: 'PostgreSQL database connection string',
    required: true,
  },
  {
    key: 'JWT_SECRET',
    description: 'Secret key for JWT token signing',
    required: true,
  },
  {
    key: 'JWT_EXPIRATION',
    description: 'JWT token expiration time (e.g., 7d, 24h)',
    required: true,
  },
  {
    key: 'CLOUDINARY_CLOUD_NAME',
    description: 'Cloudinary cloud name for file storage',
    required: true,
  },
  {
    key: 'CLOUDINARY_API_KEY',
    description: 'Cloudinary API key for authentication',
    required: true,
  },
  {
    key: 'CLOUDINARY_API_SECRET',
    description: 'Cloudinary API secret for authentication',
    required: true,
  },
  {
    key: 'CORS_ORIGINS',
    description: 'Comma-separated list of allowed CORS origins',
    required: true,
  },
];

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
export function validateEnvironmentVariables(): void {
  const missingVariables: EnvVariable[] = [];

  for (const envVar of REQUIRED_ENV_VARIABLES) {
    if (envVar.required && !process.env[envVar.key]) {
      missingVariables.push(envVar);
    }
  }

  if (missingVariables.length > 0) {
    const errorMessage = buildErrorMessage(missingVariables);
    throw new Error(errorMessage);
  }
}

/**
 * Builds a descriptive error message for missing environment variables
 */
function buildErrorMessage(missingVariables: EnvVariable[]): string {
  const lines: string[] = [
    '\n',
    '========================================',
    'ENVIRONMENT VARIABLE VALIDATION FAILED',
    '========================================',
    '',
    'The following required environment variables are missing:',
    '',
  ];

  for (const envVar of missingVariables) {
    lines.push(`  ❌ ${envVar.key}`);
    lines.push(`     Description: ${envVar.description}`);
    lines.push('');
  }

  lines.push('Please ensure all required environment variables are set.');
  lines.push('You can use the .env.example file as a reference.');
  lines.push('========================================');
  lines.push('');

  return lines.join('\n');
}

