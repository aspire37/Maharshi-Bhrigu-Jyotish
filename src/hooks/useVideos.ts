import { useState, useEffect, useCallback } from 'react';
import { YOUTUBE_VIDEO_POOL, FEATURED_VIDEOS_COUNT, POOL_VERSION, VIDEO_CACHE_REFRESH_INTERVAL } from '../constants';
import { Video } from '../types';

export const useVideos = () => {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest videos from YouTube API
  const fetchLatestVideos = useCallback(async (): Promise<Video[] | null> => {
    try {
      const response = await fetch('/api/youtube');
      if (!response.ok) throw new Error('Failed to fetch YouTube videos');
      
      const data = await response.json();
      if (data.success && data.videos && data.videos.length > 0) {
        const shuffled = [...data.videos].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, FEATURED_VIDEOS_COUNT).map((v: any) => ({
          id: v.id,
          title: v.title,
          thumb: v.thumb || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        }));
      }
      return null;
    } catch (err) {
      console.warn('Failed to fetch from YouTube API, using local pool:', err);
      return null;
    }
  }, []);

  // Fallback to local video pool
  const useLocalPool = useCallback(() => {
    try {
      const shuffled = [...YOUTUBE_VIDEO_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, FEATURED_VIDEOS_COUNT).map((v) => ({
        id: v.id,
        title: v.title,
        thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      }));
      return selected;
    } catch (err) {
      console.error('Error using local pool:', err);
      return [];
    }
  }, []);

  const refreshVideos = useCallback(async () => {
    try {
      // Try fetching latest from YouTube first
      const latest = await fetchLatestVideos();
      const videosToCache = latest || useLocalPool();

      if (videosToCache.length === 0) {
        console.error('No videos available');
        return;
      }

      const cacheData = {
        videos: videosToCache,
        timestamp: Date.now(),
        version: POOL_VERSION,
        source: latest ? 'youtube-api' : 'local-pool',
      };

      localStorage.setItem('yt_videos_cache', JSON.stringify(cacheData));
      setFeaturedVideos(videosToCache);
    } catch (err) {
      console.error('Error refreshing videos:', err);
      // Fallback to local pool on error
      const fallback = useLocalPool();
      setFeaturedVideos(fallback);
    }
  }, [fetchLatestVideos, useLocalPool]);

  useEffect(() => {
    const cacheKey = 'yt_videos_cache';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { videos, timestamp, version } = JSON.parse(cached);
        const isCacheValid =
          version === POOL_VERSION &&
          Date.now() - timestamp < VIDEO_CACHE_REFRESH_INTERVAL;

        if (isCacheValid && videos.length > 0) {
          setFeaturedVideos(videos);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error reading cache:', err);
      }
    }

    // Initial load
    refreshVideos().then(() => setLoading(false));

    // Setup periodic refresh
    const refreshInterval = setInterval(() => {
      refreshVideos();
    }, VIDEO_CACHE_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [refreshVideos]);

  return {
    featuredVideos,
    loading,
    refreshVideos,
  };
};
