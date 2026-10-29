export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path') || '';
  const config = useRuntimeConfig(event);
  const query = getRequestURL(event).search;
  return proxyRequest(event, `${String(config.apiProxyTarget).replace(/\/$/, '')}/api/${path}${query}`, { headers: { connection: 'close' } });
});
