/**
 * Operator Custom Theme — CSS variables + branding
 *
 * ⭐ เฉพาะ provider-game-web (#8) — standalone ไม่มี
 *
 * Operator ตั้งค่า theme ผ่าน launch URL params หรือ config:
 *   ?theme=dark&primary=ff6600&logo=https://...
 *
 * หรือส่งผ่าน launch token claims
 */

export interface ThemeConfig {
  primaryColor: string    // สี primary เช่น "#ff6600"
  secondaryColor: string
  backgroundColor: string
  textColor: string
  logoUrl?: string        // URL โลโก้ operator
  brandName?: string      // ชื่อ brand
}

// Default theme (ถ้า operator ไม่ได้ตั้ง)
export const defaultTheme: ThemeConfig = {
  primaryColor: '#3b82f6',     // blue-500
  secondaryColor: '#10b981',   // green-500
  backgroundColor: '#111827',  // gray-900
  textColor: '#f3f4f6',        // gray-100
}

/**
 * อ่าน theme จาก URL params
 * URL: /launch?token=xxx&primary=ff6600&bg=1a1a2e&logo=https://...
 */
export function getThemeFromURL(): Partial<ThemeConfig> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const theme: Partial<ThemeConfig> = {}

  if (params.get('primary')) theme.primaryColor = '#' + params.get('primary')
  if (params.get('secondary')) theme.secondaryColor = '#' + params.get('secondary')
  if (params.get('bg')) theme.backgroundColor = '#' + params.get('bg')
  if (params.get('text')) theme.textColor = '#' + params.get('text')
  if (params.get('logo')) theme.logoUrl = params.get('logo')!
  if (params.get('brand')) theme.brandName = params.get('brand')!

  return theme
}

/**
 * Apply theme เป็น CSS variables บน document root
 * เรียกจาก launch page หลัง parse URL params
 */
export function applyTheme(config: Partial<ThemeConfig>) {
  if (typeof document === 'undefined') return

  const theme = { ...defaultTheme, ...config }
  const root = document.documentElement

  root.style.setProperty('--color-primary', theme.primaryColor)
  root.style.setProperty('--color-secondary', theme.secondaryColor)
  root.style.setProperty('--color-bg', theme.backgroundColor)
  root.style.setProperty('--color-text', theme.textColor)

  // เก็บ theme ใน sessionStorage สำหรับหน้าอื่น
  sessionStorage.setItem('operator_theme', JSON.stringify(theme))
}

/**
 * โหลด theme จาก sessionStorage (ใช้ในหน้าอื่นหลัง launch)
 */
export function loadSavedTheme() {
  if (typeof sessionStorage === 'undefined') return

  const saved = sessionStorage.getItem('operator_theme')
  if (saved) {
    try {
      const theme = JSON.parse(saved) as ThemeConfig
      applyTheme(theme)
    } catch { /* ignore */ }
  }
}
