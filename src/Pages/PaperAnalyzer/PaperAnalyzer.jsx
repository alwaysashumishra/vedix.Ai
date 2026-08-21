import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiExternalLink,
  FiFileText,
  FiLayers,
  FiRefreshCcw,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import "./PaperAnalyzer.css";

import { API_BASE } from "../../config/apiConfig";

const sectionIcons = {
  "Paper Snapshot": FiFileText,
  "Abstract And Summary": FiBookOpen,
  "Methodology Review": FiLayers,
  "Key Findings": FiCheckCircle,
  Strengths: FiTrendingUp,
  "Missing Or Incomplete Content": FiAlertCircle,
  "How To Improve This Paper": FiTarget,
  "Ready-To-Add Content Drafts": FiFileText,
  "Related Research To Read": FiSearch,
  "Articles And Background To Read": FiBookOpen,
  "Future Scope": FiTrendingUp,
  "Viva Or Presentation Notes": FiFileText,
  "Keywords For Search": FiSearch,
};

const preferredOrder = [
  "Paper Snapshot",
  "Abstract And Summary",
  "Methodology Review",
  "Key Findings",
  "Strengths",
  "Missing Or Incomplete Content",
  "How To Improve This Paper",
  "Ready-To-Add Content Drafts",
  "Related Research To Read",
  "Articles And Background To Read",
  "Future Scope",
  "Viva Or Presentation Notes",
  "Keywords For Search",
];

const parseSections = (text) => {
  if (!text) {
    return [];
  }

  const normalized = text.replace(/\r\n/g, "\n").trim();
  const blocks = normalized.split(/(?=\n#{1,3}\s+|^#{1,3}\s+)/g);
  const sections = [];

  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    const lines = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) return;

    const headerMatch = lines[0].match(/^#{1,3}\s*(.*)$/);
    if (headerMatch) {
      const title = headerMatch[1]
        .replace(/\*\*/g, "")
        .replace(/^[\d+.)\s-]+/, "")
        .trim();
      const body = lines.slice(1).join("\n").trim();
      if (title && body) {
        sections.push({ title, body });
      }
    }
  });

  if (sections.length > 0) {
    return sections;
  }

  const matches = [...normalized.matchAll(/^##\s+(.+)$/gm)];
  if (!matches.length) {
    return [{ title: "Research Paper Review Report", body: normalized }];
  }

  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;

    return {
      title: match[1].replace(/\*\*/g, "").trim(),
      body: normalized.slice(start, end).trim(),
    };
  });
};

const cleanLine = (line) =>
  line
    .replace(/^[-*•\d+.)]\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .trim();

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatInlineLabel = (line) => {
  const cleanStr = line.replace(/\*\*/g, "").trim();
  const match = cleanStr.match(/^([^:]{2,45}):\s*(.+)$/);

  if (!match) {
    return cleanStr;
  }

  return (
    <>
      <strong className="paper-inline-label">{match[1]}:</strong> {match[2]}
    </>
  );
};

const renderBody = (body) => {
  const blocks = body.split(/\n{2,}/).filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const isList = lines.some((line) => /^[-*•\d+.)]\s+/.test(line));

    if (isList || lines.length > 1) {
      return (
        <ul key={index} className="paper-report-list">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{formatInlineLabel(cleanLine(line))}</li>
          ))}
        </ul>
      );
    }

    return <p key={index}>{formatInlineLabel(cleanLine(block))}</p>;
  });
};

const extractKeywords = (sections, fileName) => {
  const keywordSection = sections.find((section) =>
    section.title.toLowerCase().includes("keyword")
  );

  const source = keywordSection?.body || fileName || "research paper";
  const raw = source
    .replace(/\n/g, ",")
    .split(/,|;|\|/)
    .map((item) => cleanLine(item).replace(/research paper/gi, "").trim())
    .filter((item) => item.length > 2 && item.length < 80);

  return [...new Set(raw)].slice(0, 8);
};

const buildResearchLinks = (keywords, fileName) => {
  const query = keywords.length ? keywords.slice(0, 4).join(" ") : fileName || "research paper literature review";
  const encoded = encodeURIComponent(query);

  return [
    {
      name: "Google Scholar",
      note: "Find papers, citations, and survey articles.",
      url: `https://scholar.google.com/scholar?q=${encoded}`,
    },
    {
      name: "Semantic Scholar",
      note: "Discover related papers and influential references.",
      url: `https://www.semanticscholar.org/search?q=${encoded}`,
    },
    {
      name: "arXiv",
      note: "Read open preprints in AI, ML, CS, physics, and math.",
      url: `https://arxiv.org/search/?query=${encoded}&searchtype=all`,
    },
    {
      name: "PubMed",
      note: "Useful for biomedical, healthcare, and life-science papers.",
      url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encoded}`,
    },
    {
      name: "IEEE Xplore",
      note: "Engineering, electronics, AI systems, and computing research.",
      url: `https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=${encoded}`,
    },
    {
      name: "ACM Digital Library",
      note: "Computer science research, systems, HCI, and software papers.",
      url: `https://dl.acm.org/action/doSearch?AllField=${encoded}`,
    },
  ];
};

const PaperAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const sections = useMemo(() => parseSections(result), [result]);
  const orderedSections = useMemo(() => {
    return [...sections].sort((a, b) => {
      const first = preferredOrder.indexOf(a.title);
      const second = preferredOrder.indexOf(b.title);
      return (first === -1 ? 99 : first) - (second === -1 ? 99 : second);
    });
  }, [sections]);
  const keywords = useMemo(() => extractKeywords(sections, file?.name), [sections, file]);
  const researchLinks = useMemo(() => buildResearchLinks(keywords, file?.name), [keywords, file]);
  const hasReport = Boolean(result);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    setResult("");
    setError("");
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult("");
    setError("");
    setLoading(false);
  };

  const analyzePaper = async () => {
    if (!file) {
      setError("Please upload a research paper PDF first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const formData = new FormData();
      formData.append("paper", file);

      const response = await axios.post(
        `${API_BASE}/analyze/research-paper`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.analysis || "No analysis was returned.");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Research paper analysis failed. Please check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paper-page premium-paper-page">
      <section className={`paper-shell ${hasReport ? "has-report" : ""}`}>
        <div className="paper-topbar">
          <BackHomeButton className="paper-home-link" />
          {hasReport && (
            <button type="button" className="paper-reset-btn" onClick={resetAnalyzer}>
              <FiRefreshCcw />
              Analyze another
            </button>
          )}
        </div>

        {!hasReport && (
          <>
            <div className="paper-hero">
              <span className="paper-kicker">Research mentor</span>
              <h1>Research Paper Analyzer</h1>
              <p>
                Upload a PDF and get a complete review: summary, methodology,
                missing content, improvement plan, future scope, viva notes, and
                related reading links.
              </p>
              <div className="paper-tags">
                <span>Paper gaps</span>
                <span>What to add</span>
                <span>Related reading</span>
              </div>
            </div>

            <div className="paper-workspace upload-workspace">
              <label className={`paper-upload ${file ? "has-file" : ""}`}>
                <FiUploadCloud className="paper-upload-icon" />
                <strong>{file ? file.name : "Drop or choose a research PDF"}</strong>
                <span>PDF files only. The report appears after analysis.</span>
                <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
              </label>

              <button
                onClick={analyzePaper}
                className="paper-analyze-btn"
                disabled={loading}
              >
                {loading ? "Reading and reviewing paper..." : "Analyze paper deeply"}
              </button>

              {error && (
                <div className="paper-message error">
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              {loading && (
                <div className="paper-loading-panel">
                  <div className="paper-loading-icon"><FiBookOpen /></div>
                  <div>
                    <h2>Building your research report</h2>
                    <p>Checking summary, methods, gaps, improvements, and related reading paths.</p>
                  </div>
                </div>
              )}

              {!loading && !file && (
                <div className="paper-empty">
                  <FiBookOpen />
                  <p>Your complete paper breakdown will appear after upload.</p>
                </div>
              )}
            </div>
          </>
        )}

        {hasReport && (
          <div className="paper-report-layout">
            <aside className="paper-report-aside">
              <div className="paper-report-badge">
                <FiCheckCircle />
                Review ready
              </div>
              <h1>{file?.name || "Research paper report"}</h1>
              <p>
                Use this report to improve missing sections, strengthen your literature
                review, and find related papers faster.
              </p>

              {keywords.length > 0 && (
                <div className="paper-keyword-box">
                  <span>Detected search keywords</span>
                  <div className="paper-keyword-list">
                    {keywords.map((keyword) => (
                      <b key={keyword}>{keyword}</b>
                    ))}
                  </div>
                </div>
              )}

              <nav className="paper-report-nav" aria-label="Research report sections">
                <span>Report sections</span>
                {orderedSections.slice(0, 8).map((section) => (
                  <a href={`#${slugify(section.title)}`} key={section.title}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <main className="paper-report-main">
              <div className="paper-section-grid">
                {orderedSections.map((section) => {
                  const Icon = sectionIcons[section.title] || FiFileText;
                  const isImportant =
                    section.title === "Missing Or Incomplete Content" ||
                    section.title === "How To Improve This Paper" ||
                    section.title === "Ready-To-Add Content Drafts" ||
                    section.title === "Related Research To Read";
                  const isDraft = section.title === "Ready-To-Add Content Drafts";

                  return (
                    <article
                      id={slugify(section.title)}
                      className={`paper-section-card ${isImportant ? "important" : ""} ${isDraft ? "draft-card" : ""}`}
                      key={section.title}
                    >
                      <div className="paper-section-title">
                        <span><Icon /></span>
                        <h2>{section.title}</h2>
                      </div>
                      <div className="paper-section-body">{renderBody(section.body)}</div>
                    </article>
                  );
                })}
              </div>

              <section className="paper-related-panel">
                <div className="paper-related-header">
                  <div>
                    <span className="paper-kicker">Research links</span>
                    <h2>Read related papers and articles</h2>
                  </div>
                  <FiSearch />
                </div>
                <div className="paper-related-grid">
                  {researchLinks.map((link) => (
                    <a href={link.url} target="_blank" rel="noreferrer" key={link.name}>
                      <strong>{link.name}</strong>
                      <p>{link.note}</p>
                      <span>
                        Open search <FiExternalLink />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            </main>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaperAnalyzer;




