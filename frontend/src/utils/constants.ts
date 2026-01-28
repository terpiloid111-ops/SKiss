export const APP_NAME = 'SKiss'
export const APP_DESCRIPTION = 'Ultimate Earning Platform'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TWO_FACTOR: '/2fa',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REFERRALS: '/referrals',
  EARNINGS: '/earnings',
  ADMIN: '/admin',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  SUSPENDED: 'suspended',
} as const

export const TOAST_DURATION = 3000

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
} as const

export const USERNAME_REQUIREMENTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
  PATTERN: /^[a-zA-Z0-9_]{3,20}$/,
} as const

export const REFERRAL_CODE_LENGTH = {
  MIN: 6,
  MAX: 12,
} as const
