import { expect, test, describe } from 'vitest';
import { getYouTubeId } from '@/lib/youtube';

describe('getYouTubeId', () => {
  test('returns null for undefined input', () => {
    expect(getYouTubeId(undefined)).toBe(null);
  });

  test('returns null for empty string', () => {
    expect(getYouTubeId('')).toBe(null);
  });

  test('returns null for non-youtube url', () => {
    expect(getYouTubeId('https://www.google.com/video')).toBe(null);
  });

  test('extracts video id from embed url', () => {
    expect(
      getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  test('ignores query params in embed url', () => {
    expect(
      getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ?start=30')
    ).toBe('dQw4w9WgXcQ');
  });

  test('extracts video id from short url', () => {
    expect(
      getYouTubeId('https://youtu.be/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  test('ignores time hash and query params', () => {
    expect(
      getYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=45#section')
    ).toBe('dQw4w9WgXcQ');
  });

  test('extracts video id from watch url with multiple params', () => {
    expect(
      getYouTubeId('https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ&list=PL123')
    ).toBe('dQw4w9WgXcQ');
  });

  test('returns null when v parameter is missing', () => {
    expect(
      getYouTubeId('https://www.youtube.com/watch?list=PL123')
    ).toBe(null);
  });

  test('extracts video id from shorts url', () => {
    expect(
      getYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  test('returns null for invalid video id length', () => {
    expect(
      getYouTubeId('https://youtu.be/ABC123')
    ).toBe(null);
  });
});
