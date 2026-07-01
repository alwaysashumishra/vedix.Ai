import React, { useEffect, useMemo, useState } from "react";
import "./Explore.css";
import Navbar from "../../components/NavBar/Navbar";
import { fetchNewsFeed } from "../../config/news";
import { FaFire, FaGlobe, FaSearch } from "react-icons/fa";
import { FiExternalLink, FiRefreshCcw } from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";

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

  const loadNews = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNewsFeed();
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
    loadNews();
  }, []);

  useEffect(() => {
    if (newsData.hero.length <= 1) {
      return undefined;
    }

    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % newsData.hero.length);
    }, 5000);

    return () => clearInterval(auto);
  }, [newsData.hero]);

  const filteredLatest = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return newsData.latest;
    }

    return newsData.latest.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    });
  }, [newsData.latest, search]);

  const heroArticle = newsData.hero[index];

  return (
    <div className="explores">
      <Navbar profile={profile} setProfile={setProfile} setShowLogin={setShowLogin} />

      <div className="explore-container">
        <BackHomeButton className="explore-home-link" />
        <div className="explore-topbar">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search current news, AI, business, sports, science..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <button type="button" className="refresh-news-btn" onClick={loadNews}>
            <FiRefreshCcw />
            Refresh
          </button>
        </div>

        {heroArticle && (
          <div className="hero-section">
            <a href={heroArticle.link} className="big-card" target="_blank" rel="noreferrer">
              <img src={heroArticle.image || getFallbackImage(heroArticle.category)} className="big-img" alt={heroArticle.title} onError={(event) => handleImageError(event, heroArticle.category)} />

              <div className="big-overlay">
                <span className="source">
                  <FaGlobe />
                  {heroArticle.source} • {formatTime(heroArticle.publishedAt)}
                </span>

                <h1 className="big-title">{heroArticle.title}</h1>

                <p className="hero-meta">Live top story from the current feed</p>

                <div className="slider-dots">
                  {newsData.hero.map((item, i) => (
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
          </div>
        )}

        <div className="section-header">
          <h2>
            <FaFire />
            Current Highlights
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
              {newsData.categories.map((category) =>
                category.lead ? (
                  <a
                    key={category.key}
                    href={category.lead.link}
                    target="_blank"
                    rel="noreferrer"
                    className="category-card glass"
                  >
                    <img src={category.lead.image || getFallbackImage(category.lead.category)} className="side-img" alt={category.lead.title} onError={(event) => handleImageError(event, category.lead.category)} />
                    <div className="category-copy">
                      <span className="category-pill">{category.label}</span>
                      <h2 className="side-title">{category.lead.title}</h2>
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
              <h2>Explore Live Feed</h2>
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
                  <img src={article.image || getFallbackImage(article.category)} alt={article.title} onError={(event) => handleImageError(event, article.category)} />
                  <div className="small-card-copy">
                    <span className="category-pill">{article.category}</span>
                    <h3>{article.title}</h3>
                    <div className="news-meta-row">
                      <span>{article.source}</span>
                      <span>{formatTime(article.publishedAt)}</span>
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


