import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
});

const getNewsFeeds = (lang = "en") => {
  const isHindi = lang === "hi";
  const params = isHindi ? "hl=hi-IN&gl=IN&ceid=IN:hi" : "hl=en-IN&gl=IN&ceid=IN:en";

  return {
    top: {
      label: isHindi ? "प्रमुख समाचार" : "Top Stories",
      url: `https://news.google.com/rss?${params}`,
    },
    technology: {
      label: isHindi ? "तकनिकी" : "Technology",
      url: `https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?${params}`,
    },
    business: {
      label: isHindi ? "बिजनेस" : "Business",
      url: `https://news.google.com/rss/headlines/section/topic/BUSINESS?${params}`,
    },
    sports: {
      label: isHindi ? "खेल" : "Sports",
      url: `https://news.google.com/rss/headlines/section/topic/SPORTS?${params}`,
    },
    science: {
      label: isHindi ? "विज्ञान" : "Science",
      url: `https://news.google.com/rss/headlines/section/topic/SCIENCE?${params}`,
    },
    health: {
      label: isHindi ? "स्वास्थ्य" : "Health",
      url: `https://news.google.com/rss/headlines/section/topic/HEALTH?${params}`,
    },
  };
};

const toArray = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const splitTitle = (title = "") => {
  const parts = title.split(" - ");

  if (parts.length <= 1) {
    return {
      headline: title || "Untitled",
      source: "Google News",
    };
  }

  return {
    headline: parts.slice(0, -1).join(" - "),
    source: parts.at(-1),
  };
};

const FALLBACK_IMAGES = {
  "Top Stories": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  "प्रमुख समाचार": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "तकनिकी": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  Business: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "बिजनेस": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  "खेल": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  Science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "विज्ञान": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  Health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
  "स्वास्थ्य": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
};

const buildFallbackImage = (category) =>
  FALLBACK_IMAGES[category] || FALLBACK_IMAGES["Top Stories"];

const getDescriptionImage = (description = "") => {
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);

  return match?.[1] || "";
};

const getMediaUrl = (item) => {
  const media = item["media:content"];

  if (Array.isArray(media)) {
    return media[0]?.url || "";
  }

  return media?.url || item.enclosure?.url || "";
};

const mapItem = (item, category) => {
  const { headline, source } = splitTitle(item.title);

  return {
    id: item.guid || item.link,
    title: headline,
    link: item.link,
    source,
    publishedAt: item.pubDate || "",
    description: item.description || "",
    image: getMediaUrl(item) || getDescriptionImage(item.description) || buildFallbackImage(category),
    category,
  };
};

const fetchFeed = async ([key, feed]) => {
  const response = await axios.get(feed.url, {
    timeout: 12000,
    headers: {
      "User-Agent": "VedixAI-NewsFetcher/1.0",
    },
  });

  const parsed = parser.parse(response.data);
  const items = toArray(parsed?.rss?.channel?.item)
    .slice(0, 10)
    .map((item) => mapItem(item, feed.label));

  return [key, items];
};

export const getNewsFeed = async (req, res) => {
  try {
    const lang = (req.query?.lang || "en").toLowerCase();
    const feeds = getNewsFeeds(lang);

    const entries = await Promise.all(
      Object.entries(feeds).map(fetchFeed)
    );

    const feedMap = Object.fromEntries(entries);
    const topStories = feedMap.top || [];
    const categories = Object.entries(feedMap)
      .filter(([key]) => key !== "top")
      .map(([key, articles]) => ({
        key,
        label: feeds[key].label,
        lead: articles[0] || null,
        articles,
      }));

    const latest = [...topStories, ...categories.flatMap((category) => category.articles)]
      .sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
      )
      .slice(0, 24);

    res.status(200).json({
      success: true,
      lang,
      updatedAt: new Date().toISOString(),
      hero: topStories.slice(0, 5),
      latest,
      categories,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch live news right now",
    });
  }
};
