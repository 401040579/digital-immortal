/**
 * Digital Immortal - Backend API Client
 *
 * Detects whether the backend is available and provides methods to interact
 * with the AWS Serverless API. Falls back gracefully when offline.
 */

// The API base URL. Set via VITE_API_BASE_URL env var, or falls back to the deployed endpoint.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://l624byrws9.execute-api.us-east-1.amazonaws.com/prod';

let _backendAvailable: boolean | null = null;

/**
 * Generate a simple persistent userId.
 * In production this would come from Cognito/Auth, but for the MVP
 * we derive one from localStorage.
 */
export function getUserId(): string {
  const key = 'digital-immortal-user-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Check if the backend API is reachable.
 * Caches the result for the page session.
 */
export async function isBackendAvailable(): Promise<boolean> {
  if (_backendAvailable !== null) return _backendAvailable;
  if (!API_BASE_URL) {
    _backendAvailable = false;
    return false;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/avatar?userId=__ping__`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const userId = getUserId();

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`API ${res.status}: ${errBody}`);
  }

  return res.json();
}

// -------- Avatar --------

export interface AvatarData {
  userId: string;
  name: string;
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  communicationStyle: {
    formality: number;
    humor: number;
    verbosity: number;
    emotionality: number;
  };
  values: string[];
  catchphrases: string[];
  redLines?: string;
  similarity: number;
}

export async function saveAvatar(data: Omit<AvatarData, 'userId'>): Promise<{ avatar: AvatarData }> {
  const userId = getUserId();
  return apiRequest('/api/avatar', {
    method: 'POST',
    body: JSON.stringify({ userId, ...data }),
  });
}

export async function getAvatar(): Promise<{ avatar: AvatarData | null }> {
  const userId = getUserId();
  return apiRequest(`/api/avatar?userId=${encodeURIComponent(userId)}`);
}

// -------- Chat --------

export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ text: string; sender: 'user' | 'avatar' }>;
}

export interface ChatResponse {
  reply: string;
  confidence: number;
  emotionTag: string;
  userId: string;
}

export async function avatarChat(data: ChatRequest): Promise<ChatResponse> {
  const userId = getUserId();
  return apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ userId, ...data }),
  });
}

// -------- Memories --------

export interface MemoryData {
  memoryId?: string;
  label: string;
  type: string;
  content: string;
  importance: number;
  emotionalValence: number;
  connections: string[];
  isCore?: boolean;
  emotionTags?: string[];
}

export async function saveMemory(data: MemoryData): Promise<{ memory: MemoryData }> {
  const userId = getUserId();
  return apiRequest('/api/memories', {
    method: 'POST',
    body: JSON.stringify({ userId, ...data }),
  });
}

export async function getMemories(): Promise<{ memories: MemoryData[] }> {
  const userId = getUserId();
  return apiRequest(`/api/memories?userId=${encodeURIComponent(userId)}`);
}

// -------- Conversations --------

export interface ConversationData {
  conversationId?: string;
  messages: Array<{ text: string; sender: string; timestamp: number }>;
  summary?: string;
}

export async function saveConversation(data: ConversationData): Promise<{ conversation: ConversationData }> {
  const userId = getUserId();
  return apiRequest('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ userId, ...data }),
  });
}
