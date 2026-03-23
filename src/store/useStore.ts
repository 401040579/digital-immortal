import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PersonalityProfile {
  name: string
  bigFive: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  communicationStyle: {
    formality: number
    humor: number
    verbosity: number
    emotionality: number
  }
  values: string[]
  catchphrases: string[]
  similarity: number
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'avatar'
  timestamp: number
  confidence?: number
}

export interface Friend {
  id: string
  name: string
  avatar: string
  permissionLevel: 0 | 1 | 2 | 3
  lastActive: string
  replyCount: number
  status: 'online' | 'offline' | 'busy'
}

export interface SocialLog {
  id: string
  friendId: string
  friendName: string
  summary: string
  timestamp: string
  messageCount: number
  highlights: string[]
}

export interface MemoryNode {
  id: string
  label: string
  type: 'experience' | 'knowledge' | 'opinion' | 'relationship' | 'preference'
  content: string
  importance: number
  emotionalValence: number
  connections: string[]
  x?: number
  y?: number
  // Enhanced fields
  timestamp?: string
  isCore?: boolean
  emotionTags?: string[]
  relatedDialogs?: string[]
}

export interface TimeCapsule {
  id: string
  recipient: string
  deliveryDate: string
  content: string
  createdAt: string
  status: 'pending' | 'delivered'
  type?: 'letter' | 'voice' | 'photo' | 'video'
}

interface AppState {
  // Profile
  profile: PersonalityProfile | null
  setProfile: (profile: PersonalityProfile) => void

  // Chat
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void

  // Social
  friends: Friend[]
  updateFriendPermission: (id: string, level: 0 | 1 | 2 | 3) => void

  // Time Capsules
  capsules: TimeCapsule[]
  addCapsule: (capsule: TimeCapsule) => void
  removeCapsule: (id: string) => void

  // Current page
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

      friends: [
        { id: '1', name: '小美', avatar: 'M', permissionLevel: 2, lastActive: '5分钟前', replyCount: 23, status: 'online' },
        { id: '2', name: '小王', avatar: 'W', permissionLevel: 1, lastActive: '1小时前', replyCount: 15, status: 'offline' },
        { id: '3', name: '妈妈', avatar: 'Ma', permissionLevel: 2, lastActive: '30分钟前', replyCount: 45, status: 'online' },
        { id: '4', name: '同事李', avatar: 'L', permissionLevel: 1, lastActive: '2小时前', replyCount: 8, status: 'busy' },
        { id: '5', name: '大学室友陈', avatar: 'C', permissionLevel: 1, lastActive: '昨天', replyCount: 12, status: 'offline' },
        { id: '6', name: '老板张', avatar: 'Z', permissionLevel: 0, lastActive: '3小时前', replyCount: 0, status: 'online' },
        { id: '7', name: '高中好友林', avatar: 'Lin', permissionLevel: 3, lastActive: '10分钟前', replyCount: 31, status: 'online' },
      ],
      updateFriendPermission: (id, level) =>
        set((s) => ({
          friends: s.friends.map((f) => (f.id === id ? { ...f, permissionLevel: level } : f)),
        })),

      capsules: [],
      addCapsule: (capsule) => set((s) => ({ capsules: [...s.capsules, capsule] })),
      removeCapsule: (id) => set((s) => ({ capsules: s.capsules.filter((c) => c.id !== id) })),

      currentPage: 'landing',
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'digital-immortal-storage',
    }
  )
)
