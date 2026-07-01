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

const parseJsonObject = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

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

const createCareerMatches = async (resumeText) => {
  const rolePrompt = `
Read this resume and infer the best role the candidate should apply for.

Return ONLY valid JSON in this exact shape:
{
  "primaryRole": "one best role title",
  "alternateRoles": ["role 1", "role 2", "role 3"],
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"]
}

Keep role titles short and search-friendly. Do not include markdown.

Resume Content:
${resumeText.slice(0, 18000)}
`;

  const response = await createAnalysis(rolePrompt);
  const parsed = parseJsonObject(response || "") || {};
  const primaryRole = parsed.primaryRole || "Software Developer";
  const alternateRoles = Array.isArray(parsed.alternateRoles)
    ? parsed.alternateRoles.slice(0, 4)
    : [];
  const keywords = Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 6) : [];

  return {
    primaryRole,
    alternateRoles,
    keywords,
    links: buildPlatformLinks(primaryRole),
  };
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
    let careerMatches = null;

    try {
      careerMatches = await createCareerMatches(extractedText);
    } catch (matchError) {
      console.error("Career match generation failed:", matchError);
    }

    return res.status(200).json({
      success: true,
      analysis: analysis || "No analysis was generated.",
      careerMatches,
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
You are a senior research mentor and peer reviewer. Analyze this research paper deeply and return a practical, student-friendly report.

Important rules:
- Use clear markdown headings exactly in this format: ## Section Name
- Be specific. Do not give generic advice.
- If a section of the uploaded paper is weak, incomplete, missing, unclear, or unsupported, clearly say what is missing and exactly how to add it.
- Do not invent real citations. For related papers/articles, suggest search queries, databases, authors/topics to look for, and reading direction.
- Keep the language simple enough for a student to understand, but detailed enough to improve the paper.

Return these sections:
## Paper Snapshot
- probable title/topic
- research domain
- main problem
- claimed contribution

## Abstract And Summary
Explain the paper in simple language and then give a polished abstract-style summary.

## Methodology Review
Explain dataset/materials, tools, model/algorithm/design, experiment flow, evaluation metrics, and whether the methodology is complete.

## Key Findings
List the important results and what they mean.

## Strengths
What is good, original, useful, or well-supported in this paper.

## Missing Or Incomplete Content
Identify incomplete topic coverage, weak explanation, missing literature review, missing dataset details, missing diagrams/tables, missing comparisons, missing evaluation, missing citations, unclear objectives, or weak conclusion. For every gap, give: Problem, Why it matters, What to add.

## How To Improve This Paper
Give concrete additions the student should make: new subsections, diagrams, tables, experiments, comparisons, metrics, examples, references, and writing improvements.

## Ready-To-Add Content Drafts
Write practical draft content the student can adapt into the paper after verifying facts and citations. Include:
- improved abstract paragraph
- literature review paragraph with citation placeholders like [Author, Year]
- methodology improvement paragraph
- limitations paragraph
- future work paragraph
- conclusion paragraph
- 5 suggested figure/table captions to add

## Related Research To Read
Give 8-12 recommended reading directions. For each item include:
- search query to use on Google Scholar/Semantic Scholar
- what the reader should learn from it
- why it is related to this paper

## Articles And Background To Read
Give beginner-friendly articles/tutorial topics, standards, documentation, datasets, or surveys to read before improving this paper.

## Future Scope
Suggest realistic future work and next experiments.

## Viva Or Presentation Notes
Give likely questions, strong answers, and a 60-second explanation.

## Keywords For Search
Return 10-15 comma-separated keywords and phrases related to this paper.

Research Paper Text:
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



