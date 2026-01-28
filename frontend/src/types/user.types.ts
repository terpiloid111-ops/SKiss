export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export const UserStatus = {
  ACTIVE: 'active',
  BANNED: 'banned',
  SUSPENDED: 'suspended',
} as const

export type UserStatus = typeof UserStatus[keyof typeof UserStatus]

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  balance: number
  referralCode: string
  referredBy?: string
  twoFactorEnabled: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  totalEarnings?: number
  totalReferrals?: number
  lastLogin?: string
}
