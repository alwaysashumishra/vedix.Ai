import React, { useState } from "react";
import { FiCheck, FiCopy, FiCode } from "react-icons/fi";
import "./FormattedResponse.css";

// Robust Markdown Formatter to remove raw star signs and format HTML
export const formatMarkdown = (response = "") => {
  if (!response) return "";
  let text = response;

  // 1. Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 2. Italic: *text* -> <em>text</em>
  text = text.replace(/(^|[^*])\*(?!\s)(.*?)(?<!\s)\*(?=[^*]|$)/g, "$1<em>$2</em>");

  // 3. Horizontal rules: *** or --- -> <hr/>
  text = text.replace(/^(\*{3,}|-{3,})$/gm, "<hr class='markdown-hr'/>");

  // 4. Headings: ###, ##, #
  text = text.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  text = text.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  text = text.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // 5. Clean up Bullet lists: lines starting with '* ' or '- ' or '• '
  text = text.replace(/^[\*\-]\s+(.*$)/gim, '<div className="bullet-row"><span className="bullet-dot">•</span><span>$1</span></div>');

  // 6. Inline code: `code`
  text = text.replace(/`(.*?)`/g, "<code class='inline-code'>$1</code>");

  // 7. Clean up orphaned asterisks (e.g. ' * ' or ' ** ')
  text = text.replace(/\s+\*\*\s+/g, " ");
  text = text.replace(/\s+\*\s+/g, " ");

  // 8. Convert newlines to <br/>
  text = text.replace(/\n/g, "<br/>");

  return text;
};

// Custom CodeBlock Component with Theme Selector Dropdown
export const CodeBlock = ({ language, code }) => {
  const [theme, setTheme] = useState("vs-dark"); // "vs-dark" | "github-light" | "monokai" | "cyberpunk" | "ocean"
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-block-wrapper theme-${theme}`}>
      {/* Code Header Bar */}
      <div className="code-header-bar">
        <div className="code-lang-info">
          <FiCode className="code-icon" />
          <span className="lang-text">{language || "code"}</span>
        </div>

        <div className="code-header-controls">
          {/* Theme Selector Dropdown */}
          <div className="theme-select-box" title="Change code block theme">
            <span className="theme-select-label">Theme:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
            >
              <option value="vs-dark">🌙 VS Dark</option>
              <option value="github-light">☀️ GitHub Light</option>
              <option value="monokai">🥑 Monokai</option>
              <option value="cyberpunk">👾 Cyberpunk</option>
              <option value="ocean">🌊 Deep Ocean</option>
            </select>
          </div>

          {/* Copy Button */}
          <button className="code-copy-btn" onClick={handleCopy} title="Copy code">
            {copied ? <FiCheck className="copied-icon" /> : <FiCopy />}
            <span>{copied ? "Copied!" : "Copy code"}</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="code-content-box">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// FormattedResponse Component
const FormattedResponse = ({ content = "" }) => {
  if (!content) return null;

  // Check if content contains code blocks ```
  if (!content.includes("```")) {
    return (
      <div
        className="formatted-response-text"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
      />
    );
  }

  // Parse code blocks with regex
  const codeBlockRegex = /```([a-zA-Z0-9_\-\+\#]*)\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: "text", content: textBefore });
      }
    }

    const lang = match[1]?.trim() || "code";
    const code = match[2]?.trim() || "";
    parts.push({ type: "code", language: lang, code });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  return (
    <div className="formatted-response-container">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return <CodeBlock key={index} language={part.language} code={part.code} />;
        }
        return (
          <div
            key={index}
            className="formatted-response-text"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(part.content) }}
          />
        );
      })}
    </div>
  );
};

export default FormattedResponse;
