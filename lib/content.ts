/**
 * Single source of truth for every fact on this site.
 * Resume-derived; project detail drawn from the shipped repositories.
 */

export const identity = {
  name: "Ammar Ahmed",
  firstName: "Ammar",
  lastName: "Ahmed",
  roles: ["AI Engineer", "CEO & Founder of Selvoria AI"],
  tagline: "AI Engineer. CEO & Founder of Selvoria AI.",
  statement:
    "I build systems that perceive, reason and remember — and a company that puts them to work.",
  location: "6th of October, Giza, Egypt",
  email: "ammarahmedabdelmaboud17@gmail.com",
  phone: "+20 150 160 6307",
  phoneHref: "+201501606307",
  github: "https://github.com/3vmmar",
  githubHandle: "3vmmar",
  linkedin: "https://www.linkedin.com/in/ammar-abd-el-maboud",
  linkedinHandle: "ammar-abd-el-maboud",
  resume: "/Ammar_Ahmed_Resume.pdf",
  availability: "Open to AI engineering and research collaborations",
} as const;

export const summary = {
  short:
    "AI and Computer Science undergraduate with industry experience across AI engineering, large-scale model evaluation and technical instruction.",
  long: [
    "I work across the full depth of a modern AI system — deep learning, computer vision, NLP and end-to-end ML pipelines, from data acquisition through deployment — with direct exposure to frontier AI systems and multimodal agent development.",
    "Alongside that I founded Selvoria, a technology group built on three pillars: research, build, educate. Selvoria AI is the arm I lead day to day, and it designs complete software ecosystems for businesses rather than isolated features.",
  ],
} as const;

/** Rendered identically in the hero and in the closing aside. */
export const nowFacts = [
  { label: "Now", value: "AI Engineer, Anthropic" },
  { label: "Building", value: "Selvoria AI" },
  { label: "Reading", value: "B.Sc. CS & AI, Zewail City" },
] as const;

export const education = {
  institution: "Zewail City of Science and Technology",
  degree: "B.Sc. in Computer Science & Artificial Intelligence",
  specialization: "Specialization in Data Science & Artificial Intelligence",
  period: "Sep 2023 — Present",
} as const;

export type Role = {
  company: string;
  title: string;
  period: string;
  mode: string;
  current: boolean;
  points: string[];
};

export const experience: Role[] = [
  {
    company: "Anthropic",
    title: "AI Engineer",
    period: "Mar 2026 — Present",
    mode: "Remote",
    current: true,
    points: [
      "Contribute to model quality and AI safety initiatives at a leading frontier AI research lab.",
      "Design evaluation pipelines to assess model capabilities, alignment and behavioral robustness.",
      "Support prompt engineering, behavioral analysis and fine-tuning workflows for large language models.",
    ],
  },
  {
    company: "Selvoria AI",
    title: "CEO & Founder",
    period: "2025 — Present",
    mode: "Egypt",
    current: true,
    points: [
      "Founded Selvoria as a technology group spanning AI research, commercial software engineering and technology education.",
      "Lead Selvoria AI, the commercial arm: complete software ecosystems — web platforms, custom backends, AI agents, automation and operational dashboards — for clinics, professionals and companies.",
      "Set the engineering standard across projects: typed i18n, three-layer design tokens, atomic booking primitives, CI that gates on migration drift.",
    ],
  },
  {
    company: "Udacity",
    title: "Programming & Soft Skills Instructor",
    period: "Jul 2025 — Present",
    mode: "On site",
    current: true,
    points: [
      "Deliver project-based instruction covering Python, data science fundamentals and professional development.",
      "Design curriculum modules and mentor learners through end-to-end technical projects with structured feedback.",
    ],
  },
  {
    company: "Alignerr",
    title: "AI Model Evaluator",
    period: "2025 — Present",
    mode: "Remote",
    current: true,
    points: [
      "Evaluate LLM outputs across reasoning, coding and domain-specific tasks with structured, high-quality annotations.",
      "Identify failure modes and edge cases in model behavior using domain expertise in AI and computer science.",
    ],
  },
  {
    company: "iSchool Egypt",
    title: "Programming Instructor",
    period: "Aug 2024 — Present",
    mode: "Egypt",
    current: true,
    points: [
      "Teach Python, AI and machine learning concepts through project-based lessons that build real problem-solving skills.",
    ],
  },
  {
    company: "Outlier AI",
    title: "AI Model Trainer",
    period: "Oct 2024 — Mar 2025",
    mode: "Remote",
    current: false,
    points: [
      "Fine-tuned and evaluated ML models using RLHF and instruction-following techniques.",
      "Curated training datasets and delivered performance insights that directly improved model reliability.",
    ],
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "C / C++", "SQL", "JavaScript", "TypeScript", "C#", "HTML / CSS"],
  },
  {
    label: "ML / Deep Learning",
    items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Hugging Face", "YOLO"],
  },
  {
    label: "Data & Visualization",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "OpenCV"],
  },
  {
    label: "Backend & Web",
    items: ["FastAPI", "WebSockets", "REST APIs", "Next.js", "React", "Node.js"],
  },
  {
    label: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "ChromaDB", "Cloudflare D1"],
  },
  {
    label: "Cloud & DevOps",
    items: ["AWS", "GCP", "Azure", "Cloudflare Workers", "Docker", "Git & GitHub"],
  },
  {
    label: "AI / Research",
    items: [
      "Deep Learning",
      "RLHF",
      "Large Language Models",
      "Multimodal / Agentic AI",
      "Explainable AI",
      "NLP",
      "Computer Vision",
      "Model Evaluation & Deployment",
    ],
  },
  { label: "Spoken", items: ["Arabic — Native", "English — Fluent"] },
];

export const selvoria = {
  name: "Selvoria",
  pillars: ["Research", "Build", "Educate"],
  intro:
    "A technology group structured as a parent company with three specialized divisions. The ambition is a vertically connected ecosystem: research the AI, turn it into commercial software, and develop the talent that carries it forward.",
  divisions: [
    {
      key: "labs",
      name: "Selvoria Labs",
      role: "AI Research & Development",
      verb: "Research",
      body:
        "The research arm. Builds proprietary AI technology rather than only integrating third-party products — LLMs and specialized models, agents and multi-agent systems, AI infrastructure, training and fine-tuning, retrieval and knowledge systems.",
      status: "Roadmap",
      focus: false,
    },
    {
      key: "ai",
      name: "Selvoria AI",
      role: "AI & Software Solutions",
      verb: "Build",
      body:
        "The commercial arm, and the one I lead day to day. Not a website agency: it designs and engineers complete software ecosystems — web platforms, custom backends, databases, AI agents, business automation, analytics and dashboards, booking and internal management systems, auth and role-based access, cloud infrastructure.",
      status: "Active",
      focus: true,
    },
    {
      key: "education",
      name: "Selvoria Education",
      role: "Technology Education",
      verb: "Educate",
      body:
        "The education arm. Teaches children, teenagers and young students programming, AI and software development — building toward a full learning ecosystem with paths, projects, assessment, progress tracking and AI tutors rather than isolated courses.",
      status: "Roadmap",
      focus: false,
    },
  ],
  philosophy:
    "Do not just build software features. Build systems that solve operational and business problems.",
  approach: [
    {
      n: "01",
      title: "Understand the operation",
      body: "Workflows, bottlenecks, customer experience, growth constraints — before a single screen is designed.",
    },
    {
      n: "02",
      title: "Architect around it",
      body: "The software shape follows the business shape, not a template.",
    },
    {
      n: "03",
      title: "Ship and measure",
      body: "Remove the bottleneck, then prove it moved. Utilization, no-show rate, time-to-book.",
    },
  ],
} as const;
