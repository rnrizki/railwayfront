export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const hostUrl = `${req.protocol || 'https'}://${req.headers.host}`;

  const robotsTxtContent = `User-agent: *

SiteMap: ${hostUrl}/sitemap.xml

User-agent: BUbiNG
User-agent: Genieo
User-agent: grapeshot
User-agent: JamesBOT
User-agent: ltx71 - (http://ltx71.com/)
User-agent: MJ12bot
User-agent: SeznamBot
User-agent: dotbot
User-agent: CCBot
User-agent: TinEye-bot
User-agent: PubMatic Crawler Bot
User-agent: mappydata
User-agent: Jooblebot
User-agent: grapeshot
User-agent: DomainStatsBot
User-agent: PubMaticCrawlerBot
Disallow: /`;

  // Set content type
  setHeader(event, 'Content-Type', 'text/plain');
  return robotsTxtContent;
});
