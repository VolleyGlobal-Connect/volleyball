export const getYouTubeId = (input?: string): string | null => {
  if (!input) return null;

  let url: URL;

  // Ensure we are working with a valid URL
  try {
    url = new URL(input.startsWith('http') ? input : `https://${input}`);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '');
  const pathname = url.pathname;

  let videoId: string | null = null;

  // youtu.be/<id>
  if (hostname === 'youtu.be') {
    videoId = pathname.split('/')[1] ?? null;
  }

  // youtube.com/watch?v=<id>
  else if (pathname === '/watch') {
    videoId = url.searchParams.get('v');
  }

  // youtube.com/embed/<id>
  // youtube.com/shorts/<id>
  // youtube.com/live/<id>
  else if (
    hostname.endsWith('youtube.com') &&
    (pathname.startsWith('/embed/') ||
      pathname.startsWith('/shorts/') ||
      pathname.startsWith('/live/'))
  ) {
    videoId = pathname.split('/')[2] ?? null;
  }

  if (!videoId) return null;

  // Strip hash and extra path segments
  videoId = videoId.split(/[?#/]/)[0];

  // Validate YouTube video ID (11 chars, allowed charset)
  const isValid = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  return isValid ? videoId : null;
};
