import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  FiAlertCircle,  FiBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiFileText,
  FiLink,
  FiRefreshCcw,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import "./ResumeAnalyzer.css";

import { API_BASE } from "../../config/apiConfig";

const slugifyRole = (role) =>
  role
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildPlatformLinks = (role) => {
  const encodedRole = encodeURIComponent(role);
  const slug = slugifyRole(role);

  return [
    {
      platform: "Internshala",
      type: "Internships",
      url: `https://internshala.com/internships/keywords-${encodedRole}/`,
    },
    {
      platform: "Internshala",
      type: "Jobs",
      url: `https://internshala.com/jobs/keywords-${encodedRole}/`,
    },
    {
      platform: "Unstop",
      type: "Internships",
      url: `https://unstop.com/internships?search=${encodedRole}`,
    },
    {
      platform: "Unstop",
      type: "Jobs",
      url: `https://unstop.com/jobs?search=${encodedRole}`,
    },
    {
      platform: "Naukri",
      type: "Jobs",
      url: `https://www.naukri.com/${slug}-jobs`,
    },
    {
      platform: "Naukri",
      type: "Internships",
      url: `https://www.naukri.com/internship-${slug}-jobs`,
    },
    {
      platform: "Indeed",
      type: "Jobs",
      url: `https://in.indeed.com/jobs?q=${encodedRole}&l=India`,
    },
    {
      platform: "Indeed",
      type: "Internships",
      url: `https://in.indeed.com/jobs?q=${encodedRole}%20internship&l=India`,
    },
    {
      platform: "LinkedIn",
      type: "Jobs",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&location=India`,
    },
    {
      platform: "LinkedIn",
      type: "Internships",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}%20internship&location=India`,
    },
  ];
};

const inferCareerMatchesFromAnalysis = (analysis) => {
  const commonRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "UI UX Designer",
    "Digital Marketing Executive",
    "Business Analyst",
    "Product Manager",
    "DevOps Engineer",
    "Cyber Security Analyst",
  ];

  const lowerAnalysis = analysis.toLowerCase();
  const matchedRole =
    commonRoles.find((role) => lowerAnalysis.includes(role.toLowerCase())) ||
    analysis.match(/best job roles?[:\s\n-]+([^\n]+)/i)?.[1]?.split(/[,|]/)[0]?.trim() ||
    "Software Developer";

  const alternateRoles = commonRoles
    .filter((role) => role !== matchedRole && lowerAnalysis.includes(role.toLowerCase()))
    .slice(0, 4);

  return {
    primaryRole: matchedRole,
    alternateRoles,
    keywords: [matchedRole, "fresher", "internship", "remote", "India"],
    links: buildPlatformLinks(matchedRole),
  };
};

const parseAnalysisSections = (analysis) => {
  if (!analysis) {
    return [];
  }

  const cleanText = analysis.replace(/\r/g, "");
  const blocks = cleanText.split(/(?=\n#{1,3}\s+|^#{1,3}\s+)/g);
  const sections = [];

  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    const lines = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const headerMatch = lines[0].match(/^#{1,3}\s*(.*)$/);

    if (headerMatch) {
      const title = headerMatch[1]
        .replace(/\*\*/g, "")
        .replace(/^[\d+.)\s-]+/, "")
        .trim();

      const points = lines
        .slice(1)
        .map((line) =>
          line
            .replace(/^[-*•\d+.)]\s*/, "")
            .replace(/\*\*/g, "")
            .replace(/`/g, "")
            .trim()
        )
        .filter(Boolean);

      if (title && points.length > 0) {
        sections.push({ title, points });
      }
    } else {
      let currentSection = null;

      lines.forEach((line) => {
        const headingMatch = line.match(
          /^(?:\d+[.)]\s*)?\*{0,2}([A-Za-z][A-Za-z\s/()&-]{2,45})\*{0,2}\s*:?\s*(.*)$/
        );
        const isHeading =
          headingMatch &&
          line.length < 80 &&
          /score|skill|strength|weakness|role|suggestion|summary|gap|experience|ats/i.test(
            headingMatch[1]
          );

        if (isHeading) {
          currentSection = {
            title: headingMatch[1].replace(/\*\*/g, "").trim(),
            points: [],
          };
          if (headingMatch[2]) {
            currentSection.points.push(
              headingMatch[2].replace(/^[-:]+\s*/, "").replace(/\*\*/g, "").trim()
            );
          }
          sections.push(currentSection);
        } else if (currentSection) {
          const cleanedLine = line
            .replace(/^[-*•\d+.)]\s*/, "")
            .replace(/\*\*/g, "")
            .trim();
          if (cleanedLine) {
            currentSection.points.push(cleanedLine);
          }
        }
      });
    }
  });

  return sections.length
    ? sections
    : [
        {
          title: "AI Analysis Report",
          points: analysis
            .split("\n")
            .map((l) => l.replace(/\*\*/g, "").trim())
            .filter(Boolean),
        },
      ];
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [careerMatches, setCareerMatches] = useState(null);
  const [error, setError] = useState("");

  const analysisSections = useMemo(() => parseAnalysisSections(result), [result]);
  const hasReport = Boolean(result);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    setResult("");
    setCareerMatches(null);
    setError("");
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult("");
    setCareerMatches(null);
    setError("");
    setLoading(false);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a PDF or DOCX resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCareerMatches(null);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        `${API_BASE}/analyze/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const analysis = response.data.analysis || "No analysis was returned.";
      setResult(analysis);
      setCareerMatches(
        response.data.careerMatches || inferCareerMatchesFromAnalysis(analysis)
      );
    }
    catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Resume analysis failed. Please check the backend and try again."
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page premium-resume-page">
      <section className={`resume-stage ${hasReport ? "has-report" : ""}`}>
        <div className="resume-topbar">
          <BackHomeButton className="resume-back-btn" />
          {hasReport && (
            <button type="button" className="resume-reset-btn" onClick={resetAnalyzer}>
              <FiRefreshCcw />
              Analyze another
            </button>
          )}
        </div>

        <header className="resume-premium-hero">
          <span className="tool-kicker">Career scan</span>
          <h1>Resume Analyzer</h1>
          <p>
            Upload your resume, get a clean AI report, then explore matching jobs and
            internships for your best-fit role.
          </p>
        </header>

        {!hasReport && !loading && (
          <div className="resume-upload-card">
            <label className={`resume-upload premium-upload ${file ? "has-file" : ""}`}>
              <FiUploadCloud className="resume-upload-icon" />
              <strong>{file ? file.name : "Upload your resume"}</strong>
              <span>PDF or DOCX supported</span>
              <input
                type="file"
                hidden
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </label>

            <button
              onClick={analyzeResume}
              className="resume-analyze-btn"
              disabled={loading}
            >
              Analyze resume
            </button>

            {error && (
              <div className="resume-message error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="resume-loading-panel">
            <div className="resume-loading-icon">
              <FiFileText />
            </div>
            <h2>Building your resume report</h2>
            <p>Reading your resume, finding skill gaps, matching roles, and preparing job links.</p>
            <div className="resume-progress-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {hasReport && (
          <div className="resume-report-layout">
            <section className="resume-report-card">
              <div className="resume-report-header">
                <div className="report-icon success">
                  <FiCheckCircle />
                </div>
                <div>
                  <span>AI resume report</span>
                  <h2>Formatted analysis</h2>
                </div>
              </div>

              <div className="analysis-section-grid">
                {analysisSections.map((section, index) => (
                  <article className="analysis-section-card" key={`${section.title}-${index}`}>
                    <h3>{section.title}</h3>
                    <ul>
                      {section.points.map((point, pointIndex) => (
                        <li key={`${point}-${pointIndex}`}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            {careerMatches && (
              <section className="career-links-panel premium-career-panel">
                <div className="career-links-header">
                  <div className="career-role-icon">
                    <FiBriefcase />
                  </div>
                  <div>
                    <span>Matched role</span>
                    <h2>{careerMatches.primaryRole}</h2>
                  </div>
                </div>

                {careerMatches.alternateRoles?.length > 0 && (
                  <div className="role-chip-row">
                    {careerMatches.alternateRoles.map((role) => (
                      <span key={role}>{role}</span>
                    ))}
                  </div>
                )}

                <div className="career-platform-grid">
                  {careerMatches.links?.map((link) => (
                    <a
                      key={`${link.platform}-${link.type}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="career-platform-card"
                    >
                      <div>
                        <span>{link.type}</span>
                        <strong>{link.platform}</strong>
                      </div>
                      <FiExternalLink />
                    </a>
                  ))}
                </div>

                {careerMatches.keywords?.length > 0 && (
                  <div className="career-keywords">
                    <FiLink />
                    <p>{careerMatches.keywords.join(" / ")}</p>
                  </div>
                )}
              </section>
            )}

            <section className="resume-next-steps">
              <FiTrendingUp />
              <div>
                <h3>Use this report before applying</h3>
                <p>
                  Update missing skills, tune keywords for the matched role, then open the
                  job and internship links below to apply faster.
                </p>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResumeAnalyzer;


