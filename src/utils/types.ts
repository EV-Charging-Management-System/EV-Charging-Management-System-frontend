// Shared request/response types used across the app

export interface LoginRequest {
	Email: string
	PasswordHash: string
}

export interface RegisterRequest {
	Email: string
	PasswordHash: string
	ConfirmPassword: string
	FullName: string
	PhoneNumber: string
	Address: string
	DateOfBirth: string
	SignatureImage: string
}

// Add other shared types here as needed

export interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
}

export interface User {
	id: string
	email: string
	fullName?: string
	role?: string
}

export interface RegisterResponse {
	message?: string
}

export interface LoginResponse {
	user: User
	accessToken: string
	refreshToken: string
	success?: boolean
	message?: string
}

export interface ApiResponse<T = any> {
	success: boolean
	message?: string
	data?: T
	accessToken?: string
	refreshToken?: string
	user?: any
}

export interface ChangePasswordReponse {
	message?: string
}

export interface UpdateProfilereq {
	fullName?: string
	phoneNumber?: string
	address?: string
}

export interface UpdateProfilerep {
	message?: string
}

export interface AuthResponse {
	message?: string
}
