import React, { useState } from "react";
import axios from "axios";
import { FiAlertCircle, FiBookOpen, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import "./PaperAnalyzer.css";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PaperAnalyzer = () => {
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

  const analyzePaper = async () => {
    if (!file) {
      setError("Please upload a research paper PDF first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("paper", file);

      const response = await axios.post(
        `${backendUrl}/api/analyze/research-paper`,
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
          "Research paper analysis failed. Please check the backend and try again."
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="paper-page">
      <section className="paper-shell">
        <div className="paper-hero">
          <span className="paper-kicker">Research companion</span>
          <h1>Paper Analyzer</h1>
          <p>
            Turn dense research PDFs into readable summaries, methodology notes,
            key findings, limitations, and future-scope ideas.
          </p>
          <div className="paper-tags">
            <span>Summary</span>
            <span>Methodology</span>
            <span>Findings</span>
          </div>
        </div>

        <div className="paper-workspace">
          <label className={`paper-upload ${file ? "has-file" : ""}`}>
            <FiUploadCloud className="paper-upload-icon" />
            <strong>{file ? file.name : "Drop or choose a research PDF"}</strong>
            <span>PDF files only</span>
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>

          <button
            onClick={analyzePaper}
            className="paper-analyze-btn"
            disabled={loading}
          >
            {loading ? "Reading paper..." : "Analyze paper"}
          </button>

          {error && (
            <div className="paper-message error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="paper-result">
              <div className="paper-result-header">
                <FiCheckCircle />
                <div>
                  <h2>AI Analysis</h2>
                  <p>Your research notes are ready.</p>
                </div>
              </div>
              <pre>{result}</pre>
            </div>
          )}

          {!result && !loading && (
            <div className="paper-empty">
              <FiBookOpen />
              <p>Your paper breakdown will appear here after upload.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PaperAnalyzer;
