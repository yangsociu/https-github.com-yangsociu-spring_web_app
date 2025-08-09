export interface RegisterRequest {
  email: string
  password?: string
  role: string
  fullName?: string
  portfolioUrl?: string
  experienceYears?: number
}

export interface LoginRequest {
  email: string
  password?: string
}

export interface AuthResponse {
  token: string
  role: string
  email: string
  id?: number
  userId?: number
}

export interface User {
  id: number
  email: string
  role: "GUEST" | "PLAYER" | "DEVELOPER" | "DESIGNER" | "ADMIN"
  status: "PENDING" | "APPROVED" | "REJECTED"
  fullName?: string
  portfolioUrl?: string
  experienceYears?: number
  totalPoints?: number
}

export interface Game {
  id: number
  name: string
  description: string
  requirements: string
  previewImageUrl: string
  apkFileUrl: string
  supportLeaderboard: boolean
  supportPoints: boolean
  status: "PENDING" | "APPROVED" | "REJECTED"
  developerId: number
  apiKeyMessage?: string
}

export interface ApprovalRequest {
  userId: number
  status: "APPROVED" | "REJECTED"
}

export interface GameApprovalRequest {
  gameId: number
  status: "APPROVED" | "REJECTED"
}

export interface Review {
  id: number
  playerId: number
  playerName: string
  gameId: number
  rating: number
  comment: string
  status: "APPROVED" | "PENDING" | "REJECTED"
  createdAt: string
}

export interface ReviewRequest {
  gameId: number
  rating: number
  comment: string
}

export interface LeaderboardEntry {
  playerId: number
  playerName: string
  totalPoints: number
  rank: number
}

export interface PointTransaction {
  id: number
  playerId: number
  gameId: number
  actionType: "DOWNLOAD_GAME" | "WRITE_REVIEW"
  points: number
  createdAt: string
}
