export const PASSWORD_STRENGTH = {
  WEAK: "weak",
  MEDIUM: "medium",
  STRONG: "strong",
  VERY_STRONG: "very_strong",
};

export const PASSWORD_CRITERIA = {
  MIN_LENGTH: 8,
  RECOMMENDED_LENGTH: 12,
  HAS_UPPERCASE: true,
  HAS_LOWERCASE: true,
  HAS_NUMBER: true,
  HAS_SPECIAL: true,
};

export const ENCRYPTION_ALGORITHMS = {
  AES: "aes-256-cbc",
  SHA256: "sha256",
  BCRYPT: "bcrypt",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_TYPES = {
  VALIDATION_ERROR: "ValidationError",
  AUTHENTICATION_ERROR: "AuthenticationError",
  AUTHORIZATION_ERROR: "AuthorizationError",
  NOT_FOUND_ERROR: "NotFoundError",
  INTERNAL_ERROR: "InternalError",
};
