export const getYouTubeId = (url?: string) => {
  if (!url) return null;

  // Already an embed URL
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1].split('?')[0];
  }

  // Short youtu.be URL
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }

  // Standard watch URL
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}