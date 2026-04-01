/**
 * Game Client Lobby — เลือกประเภทหวย (ใน iframe)
 *
 * ⭐ เหมือน standalone member-web lobby แต่:
 * - ใช้ gameApi แทน lotteryApi
 * - ไม่มี header/navigation (เพราะอยู่ใน iframe)
 */
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { gameApi } from '@/lib/api'

const icons: Record<string, string> = { THAI: '🇹🇭', LAO: '🇱🇦', STOCK_TH: '📈', STOCK_FOREIGN: '🌍', YEEKEE: '🎯' }

export default function LobbyPage() {
  const [types, setTypes] = useState<Array<{ id: number; name: string; code: string; description: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gameApi.getLobby().then(res => setTypes(res.data.data || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">กำลังโหลด...</div>

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold text-white mb-4 text-center">เลือกประเภทหวย</h1>
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {types.map(lt => (
          <Link key={lt.id} href={`/lottery/${lt.code}`}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl p-4 text-center transition">
            <div className="text-3xl mb-2">{icons[lt.code] || '🎲'}</div>
            <div className="text-white font-semibold text-sm">{lt.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
