import React, { useState } from "react";
import axios from "axios";
import { FiAlertCircle, FiCheckCircle, FiFileText, FiUploadCloud } from "react-icons/fi";
import "./ResumeAnalyzer.css";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    setResult("");
    setError("");
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a PDF or DOCX resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        `${backendUrl}/api/analyze/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.analysis || "No analysis was returned.");
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
    <div className="resume-page">
      <section className="resume-shell">
        <div className="resume-hero">
          <span className="tool-kicker">Career scan</span>
          <h1>Resume Analyzer</h1>
          <p>
            Upload a resume to get an ATS-style review, skill gaps, suggested
            roles, and practical improvements in one clean report.
          </p>
          <div className="resume-stats">
            <span>ATS score</span>
            <span>Skill gaps</span>
            <span>Role match</span>
          </div>
        </div>

        <div className="resume-workspace">
          <label className={`resume-upload ${file ? "has-file" : ""}`}>
            <FiUploadCloud className="resume-upload-icon" />
            <strong>{file ? file.name : "Drop or choose your resume"}</strong>
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
            {loading ? "Analyzing resume..." : "Analyze resume"}
          </button>

          {error && (
            <div className="resume-message error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="resume-result">
              <div className="resume-result-header">
                <FiCheckCircle />
                <div>
                  <h2>AI Analysis</h2>
                  <p>Your resume review is ready.</p>
                </div>
              </div>
              <pre>{result}</pre>
            </div>
          )}

          {!result && !loading && (
            <div className="resume-empty">
              <FiFileText />
              <p>Your analysis will appear here after upload.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResumeAnalyzer;
