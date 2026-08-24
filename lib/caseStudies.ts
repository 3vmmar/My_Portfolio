/**
 * Case-study bodies, keyed by slug. Server-only by construction: the case-study
 * route is a Server Component, so none of this reaches the browser bundle.
 * Split out of ./projects — see the note at the top of that file.
 */

import type { CaseSection, FlowEdge, FlowNode, Project } from "@/lib/projects";
import { projectBySlug } from "@/lib/projects";

export type CaseStudy = {
  summary: string;
  problem: string[];
  sections: CaseSection[];
  flow?: { title: string; caption: string; nodes: FlowNode[]; edges: FlowEdge[] };
  chart?: {
    title: string;
    caption: string;
    unit: string;
    series: { label: string; value: number; highlight?: boolean }[];
  };
  outcome: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  "care-point": {
    summary:
      "The brief was a clinic website. What the operation actually needed was a system: patients who can book without phoning, and a front desk that can see the whole day at once. Care Point is both halves — a motion-driven bilingual patient site, and Center OS, a private command center — sharing one design-token vocabulary and one database.",
    problem: [
      "A clinic website is usually treated as a brochure. The bottleneck was never the brochure — it was the phone. Every appointment ran through a person, so availability lived in someone’s head, no-shows were invisible until they happened, and a quiet afternoon at one branch could not be told apart from a quiet week.",
      "So the system had to do two things at once: let a patient reach a confirmed slot without speaking to anyone, and give the desk a single surface where the day is legible. Those are different products with different rules, and they had to agree on the same truth.",
    ],
    sections: [
      {
        heading: "Bilingual as an architecture decision, not a toggle",
        body: [
          "English lives at `/` and Arabic at `/ar`, each with its own root layout, so `lang` and `dir` are correct in the server-rendered HTML. A crawler that never runs the script still receives Arabic markup declared as Arabic — which a client-side language switch cannot deliver.",
          "Reciprocal `hreflang` alternates and a two-locale sitemap tell Google the pages are one document in two languages rather than duplicate content. Every patient-facing string lives in one typed dictionary, so a missing translation is a compile error rather than an English word surfacing mid-Arabic paragraph.",
        ],
        bullets: [
          {
            title: "Native RTL",
            body: "Not a mirrored stylesheet — the layout is authored for both directions, with IBM Plex Sans Arabic alongside Manrope and Cormorant Garamond.",
          },
          {
            title: "Indexable treatment pages",
            body: "The 3D treatment material used to exist only inside a WebGL canvas, invisible to search. Each anatomical area now has a server-rendered page per language carrying MedicalProcedure, FAQPage and BreadcrumbList structured data.",
          },
        ],
      },
      {
        heading: "Booking that cannot double-book",
        figure: "flow",
        body: [
          "Real-time availability is computed from published capacity per branch, against an Africa/Cairo calendar that carries DST and per-branch lead-time rules. When a patient picks a slot, the row is held atomically for five minutes; abandoned holds are swept by a cron trigger on the Worker.",
          "That hold is the whole design. Without it, two patients on two phones can both be shown the same 4:30pm and both be told yes. With it, the second one sees the slot gone before they finish typing their name.",
        ],
        bullets: [
          {
            title: "One patient, many phone formats",
            body: "History is matched on phone number across formats, so 01501606307 and +20 150 160 6307 resolve to the same person rather than two strangers with the same face.",
          },
          {
            title: "Calendar invites that validate",
            body: "Confirmed visits emit RFC 5545 .ics files, so the appointment lands in the patient’s own calendar app instead of a screenshot.",
          },
          {
            title: "Desk and phone bookings",
            body: "Staff can enter walk-ins and calls, so the day view reflects the actual clinic rather than only website traffic.",
          },
        ],
      },
      {
        heading: "Center OS — built for a screen someone reads all day",
        body: [
          "Seven views, none of them designed for a screenshot. Today opens on *in the room* and *up next*, then the full published-slot timeline so gaps are as visible as bookings. Week shows the next seven open days with utilization measured against real published capacity — the reason a quiet branch is no longer mistaken for a quiet week.",
          "Schedule filters by clinic and status and exports to CSV with a BOM prefix, because Excel silently mangles Arabic names without one. Insights reports clinic load, demand by consultation and a measured no-show rate. Requests handles verified data-subject access and erasure. Notifications exposes the delivery queue, retries and dead letters instead of hiding failures. Daily To-do is a shared Cairo-day worklist for callbacks.",
        ],
        bullets: [
          {
            title: "Keyboard-first",
            body: "`/` to search, `R` to refresh, `N` for a new booking, `1`–`7` to move between views. A desk that uses a tool for eight hours should not need a mouse.",
          },
          {
            title: "Live alerts",
            body: "A booking that arrives while the screen is open announces itself, so the desk is never reading a stale day.",
          },
        ],
      },
      {
        heading: "Two surfaces, one vocabulary",
        body: [
          "The patient site and Center OS had grown two disjoint palettes for the same roles — background, panel, ink, muted — none of them more than 2.7 ΔE apart. That is drift, not design, and it was the mechanical reason the two surfaces read as two products.",
          "The fix was a three-layer token file: primitives that hold raw values, semantics that name what a value is *for*, and component tokens that live next to the component that owns them. Where the surfaces genuinely should differ — Center OS is a dense screen, the patient site is a slow read — the difference is now a declared override instead of an accident. The refactor was proven neutral: a token baseline captured before and after, diffed to exactly empty.",
        ],
      },
      {
        heading: "The honest part",
        body: [
          "NOOR, the patient concierge, answers questions about procedures, preparation and recovery in either language, with Web Speech API voice input and speech synthesis output. Its answers are drawn from a fixed, clinician-reviewable set matched by keyword — there is no language model behind it yet.",
          "That was deliberate. In a medical context an unreviewed generated answer is a liability, not a feature. The retrieval seam is built so a model can sit behind it once the review process exists to match.",
        ],
      },
    ],
    flow: {
      title: "Request path",
      caption:
        "One Worker, two surfaces, one database. The atomic hold is the only place where two patients can contend, so it is the only place that needs to be serialized.",
      nodes: [
        { id: "patient", label: "Patient", sub: "/ and /ar", lane: 0 },
        { id: "desk", label: "Clinic desk", sub: "/command-center", lane: 0 },
        { id: "worker", label: "Cloudflare Worker", sub: "security headers, cron", lane: 1 },
        { id: "ssr", label: "SSR + RSC", sub: "Next.js 16 on Vinext", lane: 2 },
        { id: "api", label: "Booking API", sub: "availability, hold, confirm", lane: 2 },
        { id: "auth", label: "Staff allowlist", sub: "Center OS access control", lane: 2 },
        { id: "d1", label: "Cloudflare D1", sub: "Drizzle ORM", lane: 3 },
        { id: "notify", label: "Notify queue", sub: "webhook + email, retries", lane: 3 },
        { id: "ics", label: "ICS / calendar", sub: "RFC 5545", lane: 3 },
      ],
      edges: [
        { from: "patient", to: "worker" },
        { from: "desk", to: "worker" },
        { from: "worker", to: "ssr" },
        { from: "worker", to: "api" },
        { from: "worker", to: "auth", label: "staff only" },
        { from: "api", to: "d1", label: "5-min atomic hold" },
        { from: "auth", to: "d1" },
        { from: "ssr", to: "d1" },
        { from: "api", to: "notify" },
        { from: "api", to: "ics" },
      ],
    },
    outcome: [
      "Patients reach a confirmed, calendar-ready slot without phoning the clinic, in the language they actually read.",
      "The desk sees one day at a time with gaps, utilization and no-show rate measured rather than estimated.",
      "Search sees the treatment content — in both languages — because it is server-rendered rather than trapped in a canvas.",
      "CI gates on typecheck, lint, unit tests, build and migration drift, so schema and code cannot silently diverge.",
    ],
  },
  "iris": {
    summary:
      "Most demos perceive or reason. IRIS does both on a live stream, and keeps what it saw. Camera and microphone feed a perception stack; a semantic world model holds spatial state; a ChromaDB vector store holds episodic memory; and a reasoning layer routes between a frontier model and a local one depending on what the moment needs.",
    problem: [
      "A perception model tells you what is in a frame. It does not tell you that the person in the frame is the same one who left the room ten minutes ago, or that a door which was closed is now open. Perception without memory has no continuity, and an agent without continuity cannot be proactive — it can only answer.",
      "IRIS was built to close that gap: keep a running semantic model of the space, persist what happened, and let a reasoning layer act on the difference between now and before.",
    ],
    sections: [
      {
        heading: "Perception on a live stream",
        body: [
          "YOLO12 handles detection and tracking, so an object keeps its identity across frames rather than being re-discovered every tick. DeepFace resolves faces to known people. Faster-Whisper transcribes microphone input continuously.",
          "All three run behind an async FastAPI backend and stream to the client over WebSockets, which is what makes the bounding-box overlay land on the right frame instead of trailing it.",
        ],
      },
      {
        heading: "A reasoning layer with two routes",
        figure: "flow",
        body: [
          "Vision-language reasoning switches between Claude and a local Llama 3 served through Ollama. The split is not decorative: the cloud route is used where reasoning quality dominates, the local route where latency or privacy does. The same prompt surface serves both, so a route change is a config change rather than a rewrite.",
        ],
        bullets: [
          {
            title: "Semantic world model",
            body: "Spatial awareness is held as structured state — what is where, and since when — rather than re-derived from the last frame each time.",
          },
          {
            title: "Vector memory",
            body: "ChromaDB stores episodic memory so the agent can answer about earlier events, not only the current frame.",
          },
          {
            title: "Proactive agent",
            body: "A rule-based layer fires autonomous alerts on state changes, so IRIS can speak first instead of waiting to be asked.",
          },
        ],
      },
      {
        heading: "The interface is part of the system",
        body: [
          "A React 18 + Tailwind client renders real-time bounding boxes over the video, transcribes speech as it arrives, and answers out loud through neural text-to-speech. Watching the overlay is how you debug the perception stack — a wrong box is visible instantly in a way a log line is not.",
        ],
      },
    ],
    flow: {
      title: "Perception → cognition loop",
      caption:
        "Perception writes into state; state and memory condition reasoning; reasoning writes back into memory and out to speech. The loop is what makes it an agent rather than a detector.",
      nodes: [
        { id: "cam", label: "Camera", sub: "live frames", lane: 0 },
        { id: "mic", label: "Microphone", sub: "live audio", lane: 0 },
        { id: "yolo", label: "YOLO12", sub: "detect + track", lane: 1 },
        { id: "face", label: "DeepFace", sub: "identity", lane: 1 },
        { id: "whisper", label: "Faster-Whisper", sub: "speech to text", lane: 1 },
        { id: "world", label: "World model", sub: "semantic spatial state", lane: 2 },
        { id: "mem", label: "ChromaDB", sub: "vector memory", lane: 2 },
        { id: "reason", label: "Reasoning router", sub: "Claude / Llama 3", lane: 3 },
        { id: "rules", label: "Proactive rules", sub: "autonomous alerts", lane: 3 },
        { id: "ui", label: "React client", sub: "overlays + neural TTS", lane: 4 },
      ],
      edges: [
        { from: "cam", to: "yolo" },
        { from: "cam", to: "face" },
        { from: "mic", to: "whisper" },
        { from: "yolo", to: "world" },
        { from: "face", to: "world" },
        { from: "whisper", to: "reason" },
        { from: "world", to: "mem", label: "persist" },
        { from: "world", to: "reason" },
        { from: "mem", to: "reason", label: "recall" },
        { from: "world", to: "rules" },
        { from: "reason", to: "ui" },
        { from: "rules", to: "ui" },
      ],
    },
    outcome: [
      "A single agent that perceives, remembers and reasons over a live scene rather than classifying isolated frames.",
      "Reasoning is portable between a frontier model and a local one without changing the prompt surface.",
      "Memory is semantic, so recall survives across sessions without storing raw video.",
    ],
  },
  "chest-xray-xai": {
    summary:
      "Led a team pipeline over NIH ChestX-ray14 to classify pneumonia. Twelve architectures trained and evaluated with test-time augmentation, class imbalance addressed with focal loss and threshold tuning, and four attribution methods applied per model to produce clinically interpretable heatmaps.",
    problem: [
      "Pneumonia labels in ChestX-ray14 are heavily outnumbered, so a model that predicts *no finding* every time scores well on accuracy and is worthless in a clinic. And even a model with good discrimination is unusable if a radiologist cannot see what drove the call.",
      "The work therefore had two axes that are usually treated separately: which architecture actually discriminates, and whether its attribution map points at lung tissue rather than at a scanner artifact.",
    ],
    sections: [
      {
        heading: "Comparing architectures honestly",
        body: [
          "Twelve models spanning convolutional and transformer families — DenseNet121 and 201, Xception, ViT-B/16, EfficientNet-B3, ResNet-101 among them — trained and evaluated under one protocol, with test-time augmentation so a single lucky crop does not decide the ranking.",
          "The point of twelve was not to crown a winner. It was to see which conclusions survive a change of inductive bias, and which were artifacts of one architecture’s preferences.",
        ],
      },
      {
        heading: "Class imbalance, treated as the design problem it is",
        body: [
          "Focal loss down-weights the easy negatives that otherwise dominate the gradient, and the decision threshold is tuned rather than left at 0.5 — a default that quietly optimizes for the majority class.",
        ],
      },
      {
        heading: "Four attribution methods, per model",
        figure: "chart",
        body: [
          "GradCAM, GradCAM++, ScoreCAM and EigenCAM were applied to every model, producing 48 model-by-method combinations. Running four rather than one is the control: when methods agree on a region, the evidence is about the model; when they disagree, the map is about the method.",
          "That distinction is what makes a heatmap admissible as clinical explanation rather than decoration.",
        ],
      },
    ],
    chart: {
      title: "Experiment surface",
      caption:
        "The comparison grid, by count. Every architecture carries every attribution method, which is what makes cross-method agreement measurable rather than anecdotal.",
      unit: "count",
      series: [
        { label: "Architectures trained", value: 12, highlight: true },
        { label: "XAI methods per model", value: 4 },
        { label: "Model × method pairs", value: 48, highlight: true },
        { label: "Imbalance strategies", value: 2 },
        { label: "Models with test-time augmentation", value: 12 },
      ],
    },
    outcome: [
      "A ranked, protocol-consistent comparison across twelve architectures rather than a single reported best number.",
      "Every model ships with four attribution maps, so agreement between methods can be inspected instead of assumed.",
      "Imbalance handled at the loss and threshold level, so minority-class performance is a target rather than a casualty.",
    ],
  },
  "arabic-text-generation": {
    summary:
      "Designed and trained a comparative Arabic text-generation system across RNN, LSTM and Transformer architectures at both character and word level, achieving iterative perplexity improvements across more than ten experimental runs.",
    problem: [
      "Arabic is a hard target for generation for reasons that are orthographic before they are architectural: rich morphology, optional diacritics, multiple Unicode forms for visually identical letters, and presentation forms that survive scraping. A model trained on unnormalized Arabic spends capacity learning that two spellings of the same word are the same word.",
      "So the comparison could not start at the model. It had to start at the text.",
    ],
    sections: [
      {
        heading: "The pipeline is the experiment",
        body: [
          "Arabic Wikipedia was scraped through its API, then normalized: Unicode forms unified, presentation forms folded, diacritics handled consistently, using pyarabic for the language-specific rules. Only then does subword tokenization with BPE make sense, because BPE learns merges from whatever inconsistency you hand it.",
        ],
      },
      {
        heading: "Six configurations, one protocol",
        figure: "chart",
        body: [
          "Three architectures — a plain RNN as the floor, an LSTM, and a Transformer — each trained at character and word level. Character level keeps the vocabulary small and morphology learnable but stretches dependencies; word level shortens them and inflates the vocabulary. Running both is how you separate an architecture’s contribution from its tokenization’s.",
          "Perplexity improved iteratively across more than ten runs, each one changing a single axis so the delta was attributable.",
        ],
      },
    ],
    chart: {
      title: "Experiment surface",
      caption:
        "What the comparison actually spans. Holding one protocol across every cell is what makes the perplexity deltas attributable to the architecture rather than to the tokenization.",
      unit: "count",
      series: [
        { label: "Experimental runs", value: 10, highlight: true },
        { label: "Configurations (3 architectures × 2 levels)", value: 6, highlight: true },
        { label: "Architectures compared", value: 3 },
        { label: "Tokenization levels", value: 2 },
      ],
    },
    outcome: [
      "A clean comparison of three sequence architectures at two tokenization levels on normalized Arabic.",
      "Iterative perplexity improvement across 10+ runs, each isolating one variable.",
      "A reusable Arabic NLP pipeline: scrape, normalize, tokenize, train, evaluate.",
    ],
  },
  "facial-analysis": {
    summary:
      "Built a real-time multi-face detection and analysis system integrating MTCNN, DeepFace and OpenCV, delivering age, gender and emotion classification with bounding-box overlays and landmark localization.",
    problem: [
      "Running a heavy attribute model on every face in every frame does not hold a live frame rate. The engineering question is not which model is most accurate in isolation — it is what you can afford per frame while keeping the overlay honest about what it is looking at.",
    ],
    sections: [
      {
        heading: "Detect, then analyze",
        figure: "flow",
        body: [
          "MTCNN handles detection and landmark localization; DeepFace handles the attribute heads. Splitting the two is the whole design: detection runs on every frame because it is comparatively cheap, and attribute inference runs only on the crops detection has already justified.",
          "The split also makes the failure mode visible. MTCNN returns five landmarks per face, and drawing them means a misaligned crop shows up on screen as an obviously wrong eye position — rather than silently feeding a skewed patch to the attribute model, which would return a confident wrong answer instead of an error.",
        ],
        bullets: [
          {
            title: "A cascade, not a single pass",
            body: "MTCNN is three networks in sequence — proposal, refinement, output — so most candidate windows are discarded by the cheapest stage before the expensive one ever sees them.",
          },
          {
            title: "Landmarks as a debug surface",
            body: "The five points are drawn even though nothing downstream consumes them, because a landmark on the wrong eye is the fastest available signal that a crop is bad.",
          },
        ],
      },
      {
        heading: "What the per-frame budget actually buys",
        body: [
          "A live overlay is a fixed budget per frame, and the attribute heads are the expensive part. Running them on every detected face on every frame does not hold an interactive rate, so the real decision is what to spend the budget on.",
          "Detection stays on every frame, so boxes track smoothly. Attribute inference is allowed to lag: a box is drawn the moment it exists, and its labels arrive a frame or two later. A box with no label yet is truthful about what has been computed; a label attached to a stale box is not.",
        ],
      },
      {
        heading: "The part that outlived the project",
        body: [
          "This was built before IRIS and became its identity layer. The detect-then-analyze split, the landmark debug overlay, and the discipline of drawing only what has actually been computed all carried over — in IRIS the same structure sits behind DeepFace identity recognition rather than demographic attributes.",
          "On its own it is a compact computer-vision build. In sequence it is where the perception stack IRIS depends on was first made to hold a frame rate.",
        ],
      },
    ],
    flow: {
      title: "Per-frame path",
      caption:
        "Detection runs on every frame; the attribute heads run only on crops detection has already justified. The overlay draws what exists, so a box can appear before its labels do.",
      nodes: [
        { id: "cap", label: "Capture", sub: "OpenCV frame", lane: 0 },
        { id: "mtcnn", label: "MTCNN", sub: "boxes + 5 landmarks", lane: 1 },
        { id: "crop", label: "Crop + align", sub: "per face", lane: 2 },
        { id: "deep", label: "DeepFace heads", sub: "age, gender, emotion", lane: 3 },
        { id: "overlay", label: "Overlay", sub: "boxes, points, labels", lane: 4 },
      ],
      edges: [
        { from: "cap", to: "mtcnn", label: "every frame" },
        { from: "mtcnn", to: "crop" },
        { from: "mtcnn", to: "overlay", label: "draw at once" },
        { from: "crop", to: "deep" },
        { from: "deep", to: "overlay", label: "labels, lagged" },
      ],
    },
    outcome: [
      "Multiple faces detected, landmarked and labelled per frame, composited live over the capture stream.",
      "A two-stage split that keeps detection on every frame and lets the expensive attribute heads lag, so the overlay never labels a stale box.",
      "The perception groundwork IRIS was later built on — the same structure, with identity recognition in place of demographic attributes.",
    ],
  },
};

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

/**
 * The index row and its prose, merged. Server-only — calling this from a
 * Client Component would pull every case study back into the browser bundle,
 * which is exactly what the split exists to prevent.
 */
export function fullProject(slug: string): (Project & CaseStudy) | undefined {
  const p = projectBySlug(slug);
  const body = caseStudies[slug];
  if (!p || !body) return undefined;
  return { ...p, ...body };
}
