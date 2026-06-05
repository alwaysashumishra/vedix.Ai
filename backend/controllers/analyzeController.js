import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import Groq from "groq-sdk";

const MAX_ANALYSIS_CHARS = 50000;

let groq;

const getGroq = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in backend .env");
  }

  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groq;
};

const extractTextFromPDF = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => item.str)
      .join(" ")
      .trim();

    if (pageText) {
      pages.push(pageText);
    }
  }

  return pages.join("\n\n");
};

const extractResumeText = async (file) => {
  if (file.mimetype === "application/pdf") {
    return extractTextFromPDF(file.buffer);
  }

  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported resume file. Please upload a PDF or DOCX file.");
};

const ensureTextWasExtracted = (text, label) => {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error(
      `Could not read text from this ${label}. Please upload a text-based file instead of a scanned image.`
    );
  }

  return cleanText.slice(0, MAX_ANALYSIS_CHARS);
};

const createAnalysis = async (prompt) => {
  const completion = await getGroq().chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  return completion.choices[0]?.message?.content?.trim();
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    const extractedText = ensureTextWasExtracted(
      await extractResumeText(req.file),
      "resume"
    );

    const prompt = `
Analyze this resume professionally.

Return a clear, structured report with:
1. ATS Score out of 100
2. Technical Skills
3. Soft Skills
4. Missing Skills
5. Strengths
6. Weaknesses
7. Best Job Roles
8. Improvement Suggestions
9. Resume Summary

Resume Content:
${extractedText}
`;

    const analysis = await createAnalysis(prompt);

    return res.status(200).json({
      success: true,
      analysis: analysis || "No analysis was generated.",
    });
  }
  catch (error) {
    console.error("Resume analysis failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Resume analysis failed",
    });
  }
};

export const analyzeResearchPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No paper uploaded",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Research paper analyzer only accepts PDF files.",
      });
    }

    const extractedText = ensureTextWasExtracted(
      await extractTextFromPDF(req.file.buffer),
      "research paper"
    );

    const prompt = `
Analyze this research paper.

Return a clear, structured report with:
1. Abstract Summary
2. Key Findings
3. Methodology
4. Important Concepts
5. Easy Explanation
6. Future Scope
7. Limitations
8. AI Generated Notes

Research Paper:
${extractedText}
`;

    const analysis = await createAnalysis(prompt);

    return res.status(200).json({
      success: true,
      analysis: analysis || "No analysis was generated.",
    });
  }
  catch (error) {
    console.error("Research paper analysis failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Research paper analysis failed",
    });
  }
};
