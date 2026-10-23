export function embedUrl(source: string) {
  try {
    const url=new URL(source);
    if(url.protocol!=='https:') return null;
    if(['youtube.com','www.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(url.hostname)) {
      const id=url.hostname==='youtu.be'?url.pathname.slice(1):url.pathname.startsWith('/embed/')?url.pathname.split('/')[2]:url.searchParams.get('v');
      return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}`:null;
    }
    if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) {
      const id=url.pathname.split('/').filter(Boolean).pop();
      return id&&/^\d+$/.test(id)?`https://player.vimeo.com/video/${id}`:null;
    }
  } catch {}
  return null;
}
export function videoUrl(source: string) {
  try { const url=new URL(source); return url.protocol==='https:'&&/\.(mp4|webm)$/i.test(url.pathname)?url.href:null; } catch { return null; }
}
