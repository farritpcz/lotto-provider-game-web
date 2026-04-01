/**
 * API Client สำหรับ lotto-provider-game-web (#8)
 *
 * ⭐ ต่างจาก standalone-member-web (#4):
 * - Base URL: provider-game-api (#7) port 9080, path /api/v1/game/*
 * - Auth: Launch Token (ไม่ใช่ JWT) — ได้จาก URL parameter ตอน operator launch game
 * - ไม่มี login/register — player auth ผ่าน token อย่างเดียว
 * - ไม่มี wallet page — wallet จัดการโดย operator
 *
 * Flow: operator เรียก POST /api/v1/games/launch → ได้ URL + token
 *       → player เปิด URL ใน iframe → token ถูกเก็บใน store
 *       → ทุก API call แนบ X-Launch-Token header
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// ⭐ Game Client API ของ provider-game-api (#7)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080/api/v1/game'

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  })

  // ⭐ ใช้ Launch Token แทน JWT
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('launch_token') : null
    if (token && config.headers) {
      config.headers['X-Launch-Token'] = token
    }
    return config
  })

  return client
}

export const api = createApiClient()

// Game Client API functions — เหมือน standalone (#4) แต่ path ต่างกัน
export const gameApi = {
  getLobby: () => api.get('/lobby'),
  getRounds: (typeId: number) => api.get(`/rounds/${typeId}`),
  placeBets: (bets: Array<{ lottery_round_id: number; bet_type_code: string; number: string; amount: number }>) =>
    api.post('/bets', { bets }),
  getMyBets: (params?: Record<string, unknown>) => api.get('/bets', { params }),
  getResults: (params?: Record<string, unknown>) => api.get('/results', { params }),
  getHistory: (params?: Record<string, unknown>) => api.get('/history', { params }),
  getBalance: () => api.get('/balance'),
}
