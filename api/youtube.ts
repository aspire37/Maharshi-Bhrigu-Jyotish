import { VercelRequest, VercelResponse } from "@vercel/node";

const CHANNEL_ID = "UCrMTsdBcuo_pqV89hLJs_yA"; // Your YouTube channel
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface YouTubeVideo {
  id: string;
  title: string;
  thumb: string;
  published: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Fetch RSS feed from YouTube
    const response = await fetch(YOUTUBE_RSS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const xml = await response.text();

    // Parse RSS feed using regex to extract video data
    const videoRegex = /<entry>.*?<id>yt:video:([a-zA-Z0-9_-]+)<\/id>.*?<title>([^<]+)<\/title>.*?<published>([^<]+)<\/published>/gs;
    const videos: YouTubeVideo[] = [];

    let match;
    while ((match = videoRegex.exec(xml)) !== null) {
      const videoId = match[1];
      const title = match[2];
      const published = match[3];
      
      videos.push({
        id: videoId,
        title,
        thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        published,
      });
    }

    // Return latest 12 videos
    const latestVideos = videos.slice(0, 12);

    if (latestVideos.length === 0) {
      res.status(404).json({
        error: "No videos found in channel",
        channelId: CHANNEL_ID,
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: latestVideos.length,
      channelId: CHANNEL_ID,
      videos: latestVideos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("YouTube fetch error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch YouTube videos",
      channelId: CHANNEL_ID,
    });
  }
}
