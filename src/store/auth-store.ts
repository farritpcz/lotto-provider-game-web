/**
 * Auth Store สำหรับ game client — ใช้ launch token แทน JWT login
 * ⭐ ต่างจาก standalone (#4) ที่มี login/register
 */
import { create } from 'zustand'

interface Member { id: number; username: string; balance: number; status: string; phone: string; email: string; created_at: string }

interface AuthState {
  member: Member | null
  isAuthenticated: boolean
  setAuth: (member: Member, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateMember: (m: Partial<Member>) => void
  updateBalance: (b: number) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  member: { id: 0, username: 'Player', balance: 0, status: 'active', phone: '', email: '', created_at: '' },
  isAuthenticated: true, // always true in game client (token auth)
  setAuth: () => {},
  logout: () => { sessionStorage.removeItem('launch_token') },
  updateMember: (updates) => set(s => ({ member: s.member ? { ...s.member, ...updates } : null })),
  updateBalance: (balance) => set(s => ({ member: s.member ? { ...s.member, balance } : null })),
}))
