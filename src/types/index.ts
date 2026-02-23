export interface User {
  id: string;
  name: string;
  email: string;
  isOnboardingCompleted: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  isOnboardingCompleted: boolean;
  message?: string;
}

export interface SocialLoginRequest {
  idToken: string;
  provider: string;
  providerId?: string;
}

export interface SocialLoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  isOnboardingCompleted: boolean;
}

export interface ChatSession {
  id: string;
  sessionName: string;
  createdAt: string;
}

export interface ChatMessage {
  id?: string;
  question?: string; // For history
  answer?: string; // For history
  message?: string; // For user/AI messages
  role: "user" | "assistant";
  timestamp: string;
  translations?: Record<string, string>;
}

export interface SendMessageRequest {
  chatSessionId?: string;
  message: string;
}

export interface OnboardingData {
  age: number;
  gender: string;
  diet: string;
  weight: string;
  dosha: string;
}

export interface ChatHistoryItem {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  chatSessionId: string;
}
