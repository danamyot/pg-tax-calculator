export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT),
  },
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
} as const

/**
 * Helper function to get full API endpoint URL
 */
export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${config.api.baseUrl}${cleanPath}`
}
