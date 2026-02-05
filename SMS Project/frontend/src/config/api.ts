const DEFAULT_API_BASE_URL = 'http://localhost:3000'

export const SMS_API_BASE_URL =
  import.meta.env.VITE_SMS_API_URL ?? DEFAULT_API_BASE_URL

export const ATTENDANCE_API_BASE_URL =
  import.meta.env.VITE_ATTENDANCE_API_URL ?? SMS_API_BASE_URL
