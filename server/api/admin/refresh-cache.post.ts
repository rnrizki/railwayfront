export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Get secret from environment (set via wrangler secret)
  const refreshSecret = config.refreshSecret || process.env.REFRESH_SECRET

  if (!refreshSecret) {
    throw createError({
      statusCode: 500,
      message: 'Refresh secret not configured'
    })
  }

  if (body?.secret !== refreshSecret) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Invalid secret'
    })
  }

  try {
    // Clear Nitro cache storage
    const storage = useStorage('cache')
    await storage.clear()

    return {
      success: true,
      message: 'Nitro cache cleared successfully. Fresh data will be fetched from backend on next request.',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to clear cache',
      data: error
    })
  }
})
