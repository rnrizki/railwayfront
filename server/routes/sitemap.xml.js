import { defineEventHandler, setHeader } from 'h3'


export default defineEventHandler(async (event) => {
  try {
    const data = await fetchDataFromAPI()
    const hostUrl = data?.data?.client_base || 'https://example.com'

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`

    data?.data?.categories?.forEach((i) => {
      sitemap += `
  <url>
    <loc>${hostUrl}/all/${i.slug}</loc>
    <lastmod>${i.updated_at}</lastmod>
  </url>`
    })

    data?.data?.products?.forEach((i) => {
      sitemap += `
  <url>
    <loc>${hostUrl}/${i.slug}/product/${i.id}</loc>
    <lastmod>${i.updated_at}</lastmod>
  </url>`
    })

    sitemap += `
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemap
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: error.message }))
  }
})

async function fetchDataFromAPI() {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;

    const  result  = await fetch(`${baseUrl}api/v1/page/sitemap`);
    return result.json()
  } catch {
    throw new Error('Failed to fetch data from the API')
  }
}
