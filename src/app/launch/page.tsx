/**
 * Launch Page — Entry point สำหรับ game client
 *
 * ⭐ หน้านี้ไม่มีใน standalone (#4) — มีเฉพาะ provider mode
 *
 * Flow:
 * 1. Operator เรียก POST /api/v1/games/launch → ได้ game URL + token
 * 2. Player เปิด URL: https://game.lotto.com/launch?token=xxx
 * 3. หน้านี้จะ:
 *    a. อ่าน token จาก URL query param
 *    b. เก็บ token ใน sessionStorage (ไม่ใช่ localStorage เพราะ iframe)
 *    c. redirect ไป /lobby
 *
 * ถ้าไม่มี token → แสดง error
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function LaunchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Missing launch token. Please access through your gaming platform.')
      return
    }

    // เก็บ token ใน sessionStorage
    // ⭐ ใช้ sessionStorage (ไม่ใช่ localStorage) เพราะ:
    // - ปิด tab = token หาย (security)
    // - แต่ละ tab มี token แยกกัน (multi-operator support)
    sessionStorage.setItem('launch_token', token)

    // redirect ไป lobby
    router.replace('/lobby')
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-white mb-2">Access Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading game...</p>
      </div>
    </div>
  )
}

export default function LaunchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <LaunchContent />
    </Suspense>
  )
}
