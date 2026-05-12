export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const site = config.public.siteUrl.replace(/\/$/, '');
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;
});
