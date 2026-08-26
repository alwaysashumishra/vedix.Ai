import React, { useEffect, useMemo, useState } from "react";
import "./Explore.css";
import Navbar from "../../components/NavBar/Navbar";
import { fetchNewsFeed } from "../../config/news";
import { getPublicConfig } from "../../config/publicConfig";
import { FaFire, FaGlobe, FaSearch } from "react-icons/fa";
import { FiCalendar, FiClock, FiExternalLink, FiRefreshCcw } from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import CricketScoreWidget from "../../components/CricketScore/CricketScoreWidget";
import ScorecardModal from "../../components/CricketScore/ScorecardModal";

const fallbackImages = {
  "Top Stories": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  Business: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  Science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  Health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
};

const getFallbackImage = (category) =>
  fallbackImages[category] || fallbackImages["Top Stories"];

const handleImageError = (event, category) => {
  event.currentTarget.src = getFallbackImage(category);
};


const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (article, fallback = "A quick read from the live feed with the key context you need before opening the full story.") => {
  const text = stripHtml(article?.description || "");

  if (!text) {
    return fallback;
  }

  return text.length > 150 ? `${text.slice(0, 150).trim()}...` : text;
};

const getReadTime = (article) => {
  const words = `${article?.title || ""} ${stripHtml(article?.description || "")}`.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
};
const formatTime = (value) => {
  if (!value) {
    return "Just now";
  }

  const published = new Date(value).getTime();
  const diffHours = Math.max(1, Math.round((Date.now() - published) / 3600000));

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

const Explore = ({ profile, setProfile, setShowLogin }) => {
  const [lang, setLang] = useState("en");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [newsData, setNewsData] = useState({
    hero: [],
    latest: [],
    categories: [],
    updatedAt: "",
  });
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [now, setNow] = useState(new Date());
  const [siteConfig, setSiteConfig] = useState({});

  const loadNews = async (currentLang = lang) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNewsFeed(currentLang);
      setNewsData(data);
      setIndex(0);
    } catch (fetchError) {
      console.log(fetchError);
      setError(fetchError.response?.data?.message || "Unable to load live news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(lang);
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const categoryTabs = useMemo(
    () => [
      { key: "All", label: lang === "hi" ? "सब" : "All", count: newsData.latest.length },
      ...newsData.categories.map((category) => ({
        key: category.label,
        label: category.label,
        count: category.articles?.length || 0,
      })),
    ],
    [newsData.categories, newsData.latest.length, lang]
  );

  const isAllCategory = activeCategory === "All" || activeCategory === "सब";

  const selectedCategory = useMemo(
    () => newsData.categories.find((category) => category.label === activeCategory),
    [activeCategory, newsData.categories]
  );

  const displayHeroList =
    isAllCategory
      ? newsData.hero
      : selectedCategory?.articles?.slice(0, 5) || [];

  const categoryHighlights =
    isAllCategory
      ? newsData.categories
      : selectedCategory
        ? [{ ...selectedCategory, articles: selectedCategory.articles || [] }]
        : [];

  const filteredLatest = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sourceArticles =
      isAllCategory ? newsData.latest : selectedCategory?.articles || [];

    if (!query) {
      return sourceArticles;
    }

    return sourceArticles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, newsData.latest, search, selectedCategory]);

  useEffect(() => {
    if (displayHeroList.length <= 1) {
      return undefined;
    }

    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayHeroList.length);
    }, 5000);

    return () => clearInterval(auto);
  }, [displayHeroList.length]);

  useEffect(() => {
    setIndex(0);
  }, [activeCategory]);

  const heroArticle = displayHeroList[index] || displayHeroList[0];
  const tickerArticles = (activeCategory === "All"
    ? newsData.latest
    : selectedCategory?.articles || []
  ).slice(0, 8);
  const heroStack = displayHeroList
    .filter((item) => item.id !== heroArticle?.id)
    .slice(0, 3);
  const categoryCount = activeCategory === "All" ? newsData.categories.length : 1;
  const dayLabel = now.toLocaleDateString("en-IN", { weekday: "long" });
  const dateLabel = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeLabel = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="explores">
      <Navbar
        profile={profile}
        setProfile={setProfile}
        setShowLogin={setShowLogin}
        lang={lang}
        setLang={setLang}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => setActiveCategory(cat)}
        categories={newsData.categories}
      />

      <div className="explore-container">
        <BackHomeButton className="explore-home-link" />

        <div className="explore-heading-panel">
          <div className="explore-heading-copy">
            <span className="explore-kicker">Live intelligence</span>
            <h1>{siteConfig.exploreHeadline || "Explore current news by category"}</h1>
            <p>Search, filter, refresh, and open live stories from trusted current feeds.</p>
          </div>

          <aside className="time-orbit-card" aria-label="Today and time">
            <div className="watch-orbit">
              <span className="orbit-ring"></span>
              <FiClock />
            </div>
            <div className="calendar-chip">
              <FiCalendar />
              <span>{dayLabel}</span>
            </div>
            <strong>{timeLabel}</strong>
            <p>{dateLabel}</p>
          </aside>
        </div>

        <CricketScoreWidget lang={lang} onSelectMatch={(match) => setSelectedMatch(match)} />

        {selectedMatch && (
          <ScorecardModal match={selectedMatch} onClose={() => setSelectedMatch(null)} lang={lang} />
        )}

        <div className="explore-topbar">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search current news, AI, business, sports, science..."
                className="search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <button type="button" className="refresh-news-btn" onClick={loadNews}>
            <FiRefreshCcw />
            Refresh
          </button>
        </div>

        {tickerArticles.length > 0 && (
          <div className="live-ticker" aria-label="Live news ticker">
            <span className="ticker-label">Live now</span>
            <div className="ticker-track">
              {[...tickerArticles, ...tickerArticles].map((article, itemIndex) => (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  key={`${article.id}-${itemIndex}`}
                >
                  <b>{article.category}</b>
                  {article.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="news-stats-strip">
          <div>
            <span>{filteredLatest.length}</span>
            <p>Live stories</p>
          </div>
          <div>
            <span>{categoryCount}</span>
            <p>{activeCategory === "All" ? "Categories" : "Selected category"}</p>
          </div>
          <div>
            <span>{newsData.updatedAt ? formatTime(newsData.updatedAt) : "Now"}</span>
            <p>Last refreshed</p>
          </div>
        </div>

        <div className="category-tabs" aria-label="News categories">
          {categoryTabs.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`category-tab ${activeCategory === category.label ? "active" : ""}`}
              onClick={() => setActiveCategory(category.label)}
            >
              <span>{category.label}</span>
              <b>{category.count}</b>
            </button>
          ))}
        </div>

        {heroArticle && (
          <div className="hero-section">
            <a href={heroArticle.link} className="big-card" target="_blank" rel="noreferrer">
              <img
                src={heroArticle.image || getFallbackImage(heroArticle.category)}
                className="big-img"
                alt={heroArticle.title}
                onError={(event) => handleImageError(event, heroArticle.category)}
              />

              <div className="big-overlay">
                <span className="source">
                  <FaGlobe />
                  {heroArticle.source} • {formatTime(heroArticle.publishedAt)}
                </span>

                <h1 className="big-title">{heroArticle.title}</h1>

                <p className="hero-meta">{getExcerpt(heroArticle, activeCategory === "All" ? "Live top story from the current feed" : `${activeCategory} headline`)}</p>

                <div className="hero-reading-cues">
                  <span>{getReadTime(heroArticle)}</span>
                  <span>Why read: understand what changed and why it matters</span>
                </div>

                <div className="slider-dots">
                  {displayHeroList.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`dot ${i === index ? "active" : ""}`}
                      onClick={(event) => {
                        event.preventDefault();
                        setIndex(i);
                      }}
                      aria-label={`Show story ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </a>

            <div className="hero-stack">
              <div className="hero-stack-title">
                <span>Up next</span>
                <b>{activeCategory}</b>
              </div>
              {heroStack.map((article, stackIndex) => (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  key={article.id}
                  className="hero-stack-card"
                >
                  <span>{String(stackIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <b>{article.category}</b>
                    <p>{article.title}</p>
                    <small>{article.source} • {formatTime(article.publishedAt)} • {getReadTime(article)}</small>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="section-header">
          <h2>
            <FaFire />
            {activeCategory === "All" ? "Current Highlights" : `${activeCategory} Highlights`}
          </h2>
          <p>{newsData.updatedAt ? `Updated ${new Date(newsData.updatedAt).toLocaleString()}` : ""}</p>
        </div>

        {loading ? (
          <div className="explore-status">Loading live news...</div>
        ) : error ? (
          <div className="explore-status error">{error}</div>
        ) : (
          <>
            <div className="top-grid">
              {categoryHighlights.map((category) =>
                category.lead ? (
                  <a
                    key={category.key}
                    href={category.lead.link}
                    target="_blank"
                    rel="noreferrer"
                    className="category-card glass"
                  >
                    <img
                      src={category.lead.image || getFallbackImage(category.lead.category)}
                      className="side-img"
                      alt={category.lead.title}
                      onError={(event) => handleImageError(event, category.lead.category)}
                    />
                    <div className="category-copy">
                      <span className="category-pill">{category.label}</span>
                      <h2 className="side-title">{category.lead.title}</h2>
                      <p className="news-excerpt">{getExcerpt(category.lead)}</p>
                      <div className="side-actions">
                        <span>{category.lead.source}</span>
                        <span>{formatTime(category.lead.publishedAt)}</span>
                      </div>
                    </div>
                  </a>
                ) : null
              )}
            </div>

            <div className="section-header">
              <h2>{activeCategory === "All" ? "Explore Live Feed" : `${activeCategory} Live Feed`}</h2>
              <p>{filteredLatest.length} stories</p>
            </div>

            <div className="bottom-grid">
              {filteredLatest.map((article) => (
                <a
                  key={`${article.id}-${article.category}`}
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  className="small-card glass"
                >
                  <img
                    src={article.image || getFallbackImage(article.category)}
                    alt={article.title}
                    onError={(event) => handleImageError(event, article.category)}
                  />
                  <div className="small-card-copy">
                    <span className="category-pill">{article.category}</span>
                    <h3>{article.title}</h3>
                    <p className="news-excerpt">{getExcerpt(article)}</p>
                    <div className="news-meta-row">
                      <span>{article.source}</span>
                      <span>{formatTime(article.publishedAt)} • {getReadTime(article)}</span>
                    </div>
                    <span className="read-link">
                      Read story
                      <FiExternalLink />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;



