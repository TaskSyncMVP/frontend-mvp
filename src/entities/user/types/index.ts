export interface User {
  id: string;
  email: string;
  name?: string;
  workInterval: number;
  breakInterval: number;
  intervalsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  password?: string;
  workInterval?: number;
  breakInterval?: number;
  intervalsCount?: number;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
}



