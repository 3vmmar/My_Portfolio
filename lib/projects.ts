/**
 * Project index — the fields the CLIENT actually renders.
 *
 * The case-study prose (summary, problem, sections, flow, chart, outcome) used
 * to live on these same objects. Work.tsx and CommandPalette are both Client
 * Components that import `projects`, so a single exported array literal put
 * every word of all five case studies into the browser bundle, where nothing
 * read it. The prose now lives in ./caseStudies, imported only by the server-
 * rendered case-study route. Keep this file free of long-form copy.
 */

export type Metric = { value: string; label: string; note?: string };

export type CaseSection = {
  heading: string;
  body: string[];
  bullets?: { title: string; body: string }[];
  /**
   * Renders the project’s flow diagram or chart inside this section, after the
   * prose. A diagram two sections away from the text describing it is an
   * editorial defect, not just a spacing one.
   */
  figure?: "flow" | "chart";
};

export type FlowNode = { id: string; label: string; sub?: string; lane: number };
export type FlowEdge = { from: string; to: string; label?: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  kind: string;
  year: string;
  role: string;
  status: "Shipped" | "Live" | "Research" | "In development";
  client?: string;
  blurb: string;
  stack: string[];
  tags: string[];
  metrics: Metric[];
  featured: boolean;
};

export const projects: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "care-point",
    index: "01",
    title: "Care Point",
    subtitle: "Bilingual clinic platform and connected operations system",
    kind: "Selvoria AI — client system",
    year: "2026",
    role: "Founder & lead engineer, Selvoria AI",
    status: "Shipped",
    client: "Dr. Ashraf Metwally — Consultant Plastic Surgeon, FRCS, EBOPRAS",
    blurb:
      "A patient experience and a clinic command center on one codebase. Bilingual on separate indexable URLs, real-time booking across three Cairo branches, and a seven-view operations surface built for a screen someone reads all day.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript 5.9",
      "Cloudflare Workers",
      "Cloudflare D1",
      "Drizzle ORM",
      "Three.js / R3F",
      "GSAP ScrollTrigger",
      "Lenis",
      "Playwright",
      "Vitest",
    ],
    tags: ["Full-stack", "Bilingual", "Edge", "Operations"],
    metrics: [
      { value: "2", label: "Locales, separately indexable", note: "/ and /ar, own root layouts" },
      { value: "3", label: "Cairo branches", note: "Maadi, Mohandessin, Fifth Settlement" },
      { value: "7", label: "Center OS views" },
      { value: "5 min", label: "Atomic slot hold", note: "prevents double booking" },
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "iris",
    index: "02",
    title: "IRIS",
    subtitle: "Multimodal AI perception & cognition agent",
    kind: "Independent research build",
    year: "2026",
    role: "Sole engineer",
    status: "Shipped",
    blurb:
      "A real-time agent that watches, listens, remembers and reasons. YOLO12 tracking, DeepFace identity and Faster-Whisper speech on an async FastAPI + WebSocket spine, with a hybrid Claude / local-Llama reasoning layer over a vector memory.",
    stack: [
      "Python",
      "YOLO12",
      "DeepFace",
      "Faster-Whisper",
      "Claude",
      "Llama 3 / Ollama",
      "FastAPI",
      "WebSockets",
      "ChromaDB",
      "React 18",
      "Tailwind",
    ],
    tags: ["Multimodal", "Agentic AI", "Real-time", "Computer Vision"],
    metrics: [
      { value: "3", label: "Live input modalities", note: "vision, speech, state" },
      { value: "2", label: "Reasoning backends", note: "cloud + local, routed" },
      { value: "0", label: "Frames sent to disk", note: "memory is semantic, not raw" },
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "chest-xray-xai",
    index: "03",
    title: "ChestX-ray14 Pneumonia Detection",
    subtitle: "Twelve architectures, four explainability methods",
    kind: "Team deep-learning research",
    year: "2026",
    role: "Team lead",
    status: "Research",
    blurb:
      "A deep-learning pipeline on the NIH ChestX-ray14 dataset — 112,000+ radiographs — comparing twelve architectures and attaching four XAI methods to every one, because a clinical classifier that cannot show its reasoning is not usable.",
    stack: [
      "PyTorch",
      "DenseNet121 / 201",
      "Xception",
      "ViT-B/16",
      "EfficientNet-B3",
      "ResNet-101",
      "GradCAM / ++ / ScoreCAM / EigenCAM",
    ],
    tags: ["Deep Learning", "Explainable AI", "Medical Imaging"],
    metrics: [
      { value: "112K+", label: "Radiographs", note: "NIH ChestX-ray14" },
      { value: "12", label: "Architectures trained" },
      { value: "4", label: "XAI methods per model" },
      { value: "48", label: "Model × method pairs" },
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "arabic-text-generation",
    index: "04",
    title: "Arabic Text Generation",
    subtitle: "RNN vs LSTM vs Transformer, character and word level",
    kind: "NLP research",
    year: "2025",
    role: "Sole engineer",
    status: "Research",
    blurb:
      "A comparative Arabic generation system across three architectures at two granularities, with the full pipeline built from scratch — Wikipedia scraping, Unicode normalization, BPE tokenization, evaluation.",
    stack: ["PyTorch", "RNN", "LSTM", "Transformer", "pyarabic", "Wikipedia API", "BPE"],
    tags: ["NLP", "Sequence Modelling", "Arabic"],
    metrics: [
      { value: "3", label: "Architectures compared" },
      { value: "2", label: "Tokenization levels", note: "character and word" },
      { value: "10+", label: "Experimental runs" },
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "facial-analysis",
    index: "05",
    title: "Facial Analysis & Demographic Detection",
    subtitle: "Real-time multi-face analysis",
    kind: "Computer vision build",
    year: "2024",
    role: "Sole engineer",
    status: "Shipped",
    blurb:
      "A real-time multi-face detection and analysis system: MTCNN for detection, DeepFace for attributes, OpenCV for the live pipeline — age, gender and emotion with bounding boxes and landmark localization.",
    stack: ["Python", "MTCNN", "DeepFace", "OpenCV", "NumPy"],
    tags: ["Computer Vision", "Real-time"],
    metrics: [
      { value: "3", label: "Attributes per face", note: "age, gender, emotion" },
      { value: "5", label: "Facial landmarks", note: "MTCNN, per face" },
      { value: "2", label: "Pipeline stages", note: "detect, then analyze" },
      { value: "3", label: "Cascade networks", note: "propose, refine, output" },
    ],
    featured: false,
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
}
