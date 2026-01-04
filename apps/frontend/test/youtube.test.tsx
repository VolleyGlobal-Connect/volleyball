import { expect, test, describe } from 'vitest';
import { getYouTubeId } from '@/lib/youtube';

describe("getYoutubeID", () => {
    describe("when url is invalid or missing", () => {
        test("return null if url does not exist", () => {
            expect(getYouTubeId('')).toBe(null);
        })
        test("return null if url is invalid", () => {
            expect(getYouTubeId(undefined)).toBe(null);
        })
        test("return null for non-youtube url", () => {
            expect(getYouTubeId('https://www.google.com/video')).toBe(null);
        })
    });

    describe("when url is embed url", () => {
        test("extract video id from embed url", () => {
            expect(getYouTubeId('https://www.youtube.com/embed/ABC123')).toBe('ABC123')
        })
        test("ignore query parameters in embed url", () => {
            expect(getYouTubeId('https://www.youtube.com/embed/ABC123?start=30')).toBe('ABC123')
        })
    });

    describe("when url is short youtu.be url", () => {
        test("extract video id from short url", () => {
            expect(getYouTubeId('https://youtu.be/XYZ789')).toBe('XYZ789')
        })
        test("ignore query parameters in short url", () => {
            expect(getYouTubeId('https://youtu.be/XYZ789?t=45')).toBe('XYZ789')
        })
    });

    describe("when url is standard watch url", () => {
        test("extract video id from watch url", () => {
            expect(getYouTubeId('https://www.youtube.com/watch?v=LMN456')).toBe('LMN456')
        })
        test("extract video id when multiple query parameters exist", () => {
            expect(getYouTubeId('https://www/youtube.com/watch?v=LMN456&list=PL123')).toBe('LMN456')
        })
        test("return null when v parameter is missing", () => {
            expect(getYouTubeId('https://www/youtube.com/watch?list=PL123')).toBe(null)
        })
    });
});