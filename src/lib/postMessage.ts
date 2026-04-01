/**
 * postMessage — สื่อสารกับ parent site (operator iframe)
 *
 * ⭐ เฉพาะ provider-game-web (#8) — standalone ไม่มี
 *
 * ใช้สำหรับ:
 * - แจ้ง parent ว่า game loaded
 * - แจ้ง parent เมื่อ player balance เปลี่ยน
 * - รับคำสั่งจาก parent (เช่น close game, change language)
 */

// ส่ง message ไป parent
export function sendToParent(type: string, data: unknown = {}) {
  if (typeof window === 'undefined') return
  if (window.parent === window) return // ไม่ได้อยู่ใน iframe

  window.parent.postMessage({ source: 'lotto-game', type, data }, '*')
}

// Events ที่ส่งไป parent
export const GameEvents = {
  /** Game loaded สำเร็จ */
  LOADED: () => sendToParent('game:loaded'),

  /** Player balance เปลี่ยน */
  BALANCE_CHANGED: (balance: number) => sendToParent('game:balance', { balance }),

  /** Player วาง bet สำเร็จ */
  BET_PLACED: (amount: number, count: number) => sendToParent('game:bet', { amount, count }),

  /** Player ชนะรางวัล */
  WIN: (amount: number) => sendToParent('game:win', { amount }),

  /** Player กดปิดเกม */
  CLOSE: () => sendToParent('game:close'),
}

// รับ message จาก parent
export function onParentMessage(callback: (type: string, data: unknown) => void) {
  if (typeof window === 'undefined') return () => {}

  const handler = (event: MessageEvent) => {
    const msg = event.data
    if (msg?.source === 'lotto-operator') {
      callback(msg.type, msg.data)
    }
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
