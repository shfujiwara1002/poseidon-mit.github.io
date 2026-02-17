const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

// ── Shared ────────────────────────────────────────────────────
const FONT = "Arial";
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const cellPad = { top: 60, bottom: 60, left: 100, right: 100 };

const p = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 120 },
    alignment: opts.align,
    ...(opts.heading ? { heading: opts.heading } : {}),
    ...(opts.bullet ? { numbering: { reference: "bullets", level: opts.bulletLevel ?? 0 } } : {}),
    ...(opts.number ? { numbering: { reference: "numbers", level: opts.numberLevel ?? 0 } } : {}),
    children: Array.isArray(text)
      ? text
      : [new TextRun({ text, font: FONT, size: opts.size ?? 22, bold: opts.bold, italics: opts.italics, color: opts.color })],
  });

const h1 = (text) => p(text, { heading: HeadingLevel.HEADING_1, bold: true, size: 32, after: 200 });
const h2 = (text) => p(text, { heading: HeadingLevel.HEADING_2, bold: true, size: 26, after: 160 });
const h3 = (text) => p(text, { heading: HeadingLevel.HEADING_3, bold: true, size: 24, after: 120 });
const bold = (text) => new TextRun({ text, font: FONT, size: 22, bold: true });
const normal = (text) => new TextRun({ text, font: FONT, size: 22 });
const italic = (text) => new TextRun({ text, font: FONT, size: 22, italics: true });
const mono = (text) => new TextRun({ text, font: "Courier New", size: 20 });
const colored = (text, color) => new TextRun({ text, font: FONT, size: 22, color });

const bullet = (text, level = 0) => p(text, { bullet: true, bulletLevel: level });
const numbered = (text, level = 0) => p(text, { number: true, numberLevel: level });

const cell = (content, opts = {}) =>
  new TableCell({
    borders,
    width: { size: opts.width ?? 4680, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellPad,
    verticalAlign: opts.valign,
    children: Array.isArray(content) ? content : [p(content, { size: opts.fontSize ?? 20, bold: opts.bold, color: opts.color })],
  });

const headerCell = (text, width) =>
  cell(text, { width, shading: "1F2937", bold: true, color: "FFFFFF", fontSize: 20 });

const row = (...cells) => new TableRow({ children: cells });

const table = (colWidths, rows) =>
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
  });

const spacer = () => p("", { after: 60 });

// ── Content ───────────────────────────────────────────────────
const children = [];

// ─── Title Page ───────────────────────────────────────────────
children.push(
  p("", { after: 2400 }),
  p("VideoMasterV5 Flagship", { heading: HeadingLevel.TITLE, bold: true, size: 52, align: AlignmentType.CENTER, after: 200 }),
  p("30-Second Rebuild Plan", { size: 36, align: AlignmentType.CENTER, after: 400, color: "6B7280" }),
  p("MIT Capstone Final Submission", { size: 28, align: AlignmentType.CENTER, after: 800, color: "374151" }),
  p([
    normal("Date: 2026-02-17  |  Version: FINAL  |  Status: "),
    colored("APPROVED FOR IMPLEMENTATION", "16A34A"),
  ], { align: AlignmentType.CENTER, after: 200 }),
  p("Audience: MIT Capstone Judges (Investor Lens) + Technical Evaluators", { size: 22, align: AlignmentType.CENTER, color: "6B7280" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 0: Executive Summary ────────────────────────────
children.push(
  h1("0. Executive Summary"),
  p("This document defines the complete implementation plan for rebuilding VideoMasterV5 as a 30-second flagship video for MIT Capstone final submission. The plan integrates and reconciles inputs from three sources: Gemini advisory, Claude analysis, and codebase audit."),
  spacer(),
  p([bold("Core Diagnosis: "), normal("The current V5 uses programmatic Living UI components (no static PNGs), but the cinematography treats the screen as a flat surface. Camera movements are gentle whole-screen zooms (scale 0.7-1.1). Tech company videos (Stripe, Linear, Vercel) use component-level focus: scale 2.0-3.0 on individual UI elements, with depth-of-field blur on non-focused layers and cursor interactions.")]),
  spacer(),
  p([bold("Key Correction from Gemini Plan: "), normal("Gemini correctly identifies the need for Living UI and audio-first pipeline, but omits the component-focus cinematography layer (DepthLayer, AnimatedCursor, aggressive CameraController keyframes). This plan adds that critical layer.")]),
  spacer(),
  p([bold("Output: "), normal("One flagship MP4: poseidon-v5-flagship-30s.mp4")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 1: Fixed Specifications ─────────────────────────
children.push(
  h1("1. Fixed Specifications"),
  table(
    [3000, 3200, 3160],
    [
      row(headerCell("Parameter", 3000), headerCell("Value", 3200), headerCell("Rationale", 3160)),
      row(cell("Audience"), cell("MIT Judges (Investor) + Tech Evaluators"), cell("Focus: viability, risk, architecture")),
      row(cell("Duration"), cell("30s (900f @ 30fps)"), cell("Elevator pitch density")),
      row(cell("Tone"), cell("Level 1: Contrast Narrative"), cell("Old vs New, intellectual, calm")),
      row(cell("VO"), cell([p("English, AI-generated (ElevenLabs)")]), cell("Adam voice, authoritative")),
      row(cell("Living UI"), cell("Maximum (all 6 shots)"), cell("No static PNG references")),
      row(cell("Composition ID"), cell([p("VideoMasterV5Flagship", { size: 20 })]), cell("Parallel to existing VideoMasterV5")),
      row(cell("BPM"), cell("120 (15 frames/beat)"), cell("Inherited from V5 config")),
      row(cell("Resolution"), cell("1920x1080 (landscape)"), cell("Standard HD")),
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 2: Script & Storyboard ─────────────────────────
children.push(
  h1("2. Script & Storyboard (6 Shots / 30 Seconds / 60 Words)"),
  spacer(),
  p([bold("Core Belief Anchor: "), italic("\"Transparency is not a feature. It is the architecture.\"")]),
  p([bold("Narrative Arc: "), normal("Friction (0-8s) \u2192 Turn (8-12s) \u2192 Proof (12-22s) \u2192 Vision (22-26s) \u2192 CTA (26-30s)")]),
  spacer(),
);

// Shot 1
children.push(
  h2("Shot 1: Hook (0-4s, Frames 0-120)"),
  p([bold("VO: "), italic("\"Your financial AI makes decisions every day. Can you explain a single one?\""), normal(" (13 words)")]),
  spacer(),
  h3("Visual Choreography"),
  bullet("Frame 0-20: Full dashboard UI appears (Living UI: AnimatedChartLine drawing, MetricHierarchy populating, sidebar with engine pills)"),
  bullet("Frame 20-40: Camera zooms to chart component (scale 0.6 \u2192 2.0, x: 15, y: -20). Background layers blur via DepthLayer (8px). Chart line is still drawing."),
  bullet("Frame 40-55: FREEZE. All animations halt. Chart line stops mid-draw. A beat of silence."),
  bullet("Frame 55-80: GlitchEffect activates. RGB split on chart. Red flash. Screen shakes (ShakeElement intensity: 5)."),
  bullet("Frame 80-100: Camera pans to metrics area (scale 2.0, x: -15, y: 10). Numbers scramble (CountUpText in reverse: random digits)."),
  bullet("Frame 100-120: Fade to black. Transition: blur-zoom exit."),
  spacer(),
  h3("Technical Implementation"),
  bullet("Base: Shot01Signal.tsx \u2192 full rewrite"),
  bullet("Replace LogoIcon center with dashboard layout (reuse Shot03Clarity grid structure)"),
  bullet("New: GlitchEffect component (CSS clip-path slices + RGB channel offset via translateX on duplicate layers)"),
  bullet("CameraController keyframes: 6 points (overview \u2192 chart focus \u2192 hold \u2192 metrics focus \u2192 fade)"),
  bullet("DepthLayer wraps chart and metrics as separate focusable regions"),
  spacer(),
  p([bold("SFX: "), normal("Digital static (cc0-sfx/) at frame 55. Sub-bass hit at frame 80.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// Shot 2
children.push(
  h2("Shot 2: Turn (4-8s, Frames 120-240)"),
  p([bold("VO: "), italic("\"Black-box AI breaks trust. You need an architecture you can see.\""), normal(" (12 words)")]),
  spacer(),
  h3("Visual Choreography"),
  bullet("Frame 0-30: Black screen. VisualHexMesh grid begins forming from center outward (spring scale 0 \u2192 1, staggered per hex cell)."),
  bullet("Frame 30-50: Trident logo assembles in center (LogoIcon with spring reveal). BloomEffect cyan, intensity 0.8."),
  bullet("Frame 50-80: LightSweep crosses screen left-to-right (Apple WWDC style). Grid fully formed."),
  bullet("Frame 80-110: Text appears below logo: \"Transparency is not a feature. It is the architecture.\" (AnimatedText, glow-reveal variant)."),
  bullet("Frame 110-120: Hold. Transition: fade exit."),
  spacer(),
  h3("Technical Implementation"),
  bullet("Base: Shot02Friction.tsx \u2192 major rewrite"),
  bullet("Remove ShakeElement/GlowPulse/warning card (old friction visuals)"),
  bullet("Add VisualHexMesh (from shared/visuals/tier3/) with spring-based cell reveal"),
  bullet("LogoIcon variant: trident-only with BloomEffect wrapper"),
  spacer(),
  p([bold("SFX: "), normal("Deep sub-drop at frame 30 (logo assembly). LightSweep whoosh at frame 50.")]),
  spacer(),
);

// Shot 3
children.push(
  h2("Shot 3: Proof-Protect (8-14s, Frames 240-420)"),
  p([bold("VO: "), italic("\"Threats detected in under 100 milliseconds. 99.7% accuracy on your behavioral patterns.\""), normal(" (13 words)")]),
  p([bold("PRIORITY: "), colored("This is the hero shot. Highest visual density and impact.", "DC2626")]),
  spacer(),
  h3("Visual Choreography (Component-Focus Cinematography)"),
  bullet("Frame 0-20: Full Protect dashboard appears (chart panel + metrics + sidebar). Camera at scale 0.6."),
  bullet("Frame 20-50: Camera zooms to chart (scale 2.2, x: 15, y: -20, easing: dramatic). DepthLayer blurs everything except chart (blur 8px). AnimatedChartLine draws transaction data (7 points, teal, drawDuration: 30 frames)."),
  bullet("Frame 50-70: THE SPIKE. Data point 6 deviates sharply upward. Color interpolates teal \u2192 red over 10 frames. BloomEffect activates with red color, intensity 0.9."),
  bullet("Frame 70-90: \"ANOMALY DETECTED\" glass card slams in from right (AnimatedCardReveal, direction: right, spring: overshoot). Camera shakes slightly (ShakeElement intensity: 2, duration: 15 frames)."),
  bullet("Frame 90-120: Camera pans down-right to audit panel (scale 2.0, x: -10, y: 20, easing: smooth). DepthLayer shifts focus. AuditLogLine types: \"G-PF-0192 | Flag unauthorized transfer $2,847 | BLOCKED\"."),
  bullet("Frame 120-150: CountUpText: 0.0% \u2192 99.7% (large, centered overlay). Camera zooms out (scale 0.7)."),
  bullet("Frame 150-180: Hold full view. All elements visible. Transition: flash exit."),
  spacer(),
  h3("Technical Implementation"),
  bullet("Base: Shot03Clarity.tsx \u2192 major rewrite"),
  bullet("AnimatedChartLine: change data to threat-detection scenario. Add color prop that accepts interpolated value."),
  bullet("New: CountUpText (interpolate frame to number, format with toFixed(1), render via KineticText)"),
  bullet("CameraController: 7 keyframes (overview \u2192 chart \u2192 hold \u2192 spike \u2192 audit \u2192 hold \u2192 pullback)"),
  bullet("DepthLayer: 3 layers (chart-foreground, audit-foreground, background). Focus transitions at frame 20 and 90."),
  bullet("AnimatedCursor: waypoints from chart area to anomaly badge to audit log status field."),
  spacer(),
  p([bold("SFX: "), normal("Alert ping at frame 50 (spike). Typing sound at frame 90 (audit log). Sub-hit at frame 120 (99.7%).")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// Shot 4
children.push(
  h2("Shot 4: Proof-Govern (14-19s, Frames 420-570)"),
  p([bold("VO: "), italic("\"Every action logged. Every decision explainable.\""), normal(" (7 words)")]),
  spacer(),
  h3("Visual Choreography"),
  bullet("Frame 0-30: Audit ledger full view. Three entries stagger in (AnimatedAuditLog, stagger: 10 frames). Camera at scale 0.8."),
  bullet("Frame 30-60: Camera zooms to first entry (scale 2.5, x: -5, y: -15). DepthLayer blurs entries 2-3."),
  bullet("Frame 40-60: AnimatedCursor moves to status badge. Click ripple. Badge transitions \"Pending\" \u2192 \"Blocked\" (red flash)."),
  bullet("Frame 60-100: Camera pulls back (scale 1.2). Entries 2-3 come into focus. Compliance badges appear along bottom: EU AI Act, GDPR, SOX."),
  bullet("Frame 100-150: Zoom out to full view. Hold."),
  spacer(),
  h3("Technical Implementation"),
  bullet("Base: Shot05Assurance.tsx \u2192 moderate rewrite (NOTE: Shot05 file contains audit content, mapped to narrative Shot 4)"),
  bullet("AnimatedAuditLog stagger: 15 \u2192 10"),
  bullet("CameraController: 5 keyframes for component focus"),
  bullet("AnimatedCursor: 3 waypoints (entry \u2192 status badge \u2192 compliance area)"),
  bullet("DepthLayer: 2 layers (active entry vs background entries)"),
  spacer(),
  p([bold("SFX: "), normal("Click sound at frame 45. Badge change hit at frame 50.")]),
  spacer(),
);

// Shot 5
children.push(
  h2("Shot 5: Architecture (19-24s, Frames 570-720)"),
  p([bold("VO: "), italic("\"Deterministic models compute. GenAI explains. Humans approve.\""), normal(" (8 words)")]),
  spacer(),
  h3("Visual Choreography"),
  bullet("Frame 0-30: Empty dark space with subtle grid. First layer rises from bottom: \"Deterministic Models | Compute\" (cyan card). Spring animation."),
  bullet("Frame 30-60: Second layer stacks above: \"GenAI Layer | Explain\" (violet card). Slight offset for 3D depth effect via CSS translateZ + perspective."),
  bullet("Frame 60-90: Third layer: \"Human Approval | Decide\" (green card). LensFlare activates at center."),
  bullet("Frame 90-120: All three layers connected by animated flow lines (SVG paths with dashoffset animation). BloomEffect on the complete stack."),
  bullet("Frame 120-150: Hold. Camera slow drift (Camera3D procedural mode)."),
  spacer(),
  h3("Technical Implementation"),
  bullet("New: ThreeLayerStack component"),
  bullet("3x AnimatedCardReveal with stagger delay 30f, direction: up"),
  bullet("Each card: GlassRefraction + engine-color glow"),
  bullet("Flow lines: SVG path with strokeDasharray + strokeDashoffset animated via interpolate"),
  bullet("No Three.js needed. CSS perspective + translateZ provides sufficient depth."),
  spacer(),
  p([bold("SFX: "), normal("Whoosh at frame 10, 40, 70 (each layer). Sparkle at frame 90 (completion).")]),
  spacer(),
);

// Shot 6
children.push(
  h2("Shot 6: CTA (24-30s, Frames 720-900)"),
  p([bold("VO: "), italic("\"Poseidon. AI your money can trust.\""), normal(" (7 words)")]),
  spacer(),
  h3("Visual Choreography"),
  bullet("Frame 0-30: Poseidon logo + Trident assembles (reuse Shot01Signal spring animation). Dual LensFlare."),
  bullet("Frame 30-60: Tagline appears: \"AI your money can trust.\" (CinematicText, glow-reveal). SparkBurst at frame 45."),
  bullet("Frame 60-100: \"Get Early Access\" button pulses (PulsingButton). URL: poseidon.ai appears below."),
  bullet("Frame 100-180: Hold. Music fades. VO silence for last 2.5 seconds (let the visual breathe)."),
  spacer(),
  h3("Technical Implementation"),
  bullet("Base: Shot06CTA.tsx \u2192 minor rewrite (copy changes only)"),
  bullet("Update tagline text in copy.videoV5.shot6"),
  bullet("Extend PulsingButton hold duration"),
  spacer(),
  p([bold("SFX: "), normal("\"Poseidon\" whisper branding at frame 10 (if available). SparkBurst sparkle at frame 45.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 3: Component-Focus Cinematography ───────────────
children.push(
  h1("3. Component-Focus Cinematography (Critical Addition)"),
  p("This section defines the visual technique that differentiates a \"tech company\" video from a \"template\" video. It was absent from the Gemini plan and is the single most impactful improvement."),
  spacer(),
  h2("3.1 The Technique"),
  p("In Stripe, Linear, and Vercel product videos, the camera does not simply show a full-screen dashboard. Instead:"),
  numbered("Full UI appears briefly (1-2s) to establish context."),
  numbered("Camera zooms aggressively (scale 2.0-3.0) to isolate ONE component."),
  numbered("That component animates in isolation (chart draws, number counts up)."),
  numbered("Background layers blur (depth-of-field simulation)."),
  numbered("A cursor may move and interact (click, hover)."),
  numbered("Camera pans to the next component of interest."),
  spacer(),
  p("Current V5 camera behavior: scale 0.7 \u2192 1.1 (whole-screen gentle zoom). This must change to scale 0.6 \u2192 2.2+ with targeted x/y positioning per component."),
  spacer(),
  h2("3.2 New Components Required"),
  spacer(),
);

// DepthLayer spec
children.push(
  h3("DepthLayer"),
  p([bold("File: "), mono("shared/cinematic/DepthLayer.tsx")]),
  spacer(),
  table(
    [2500, 6860],
    [
      row(headerCell("Prop", 2500), headerCell("Description", 6860)),
      row(cell("children"), cell("React.ReactNode")),
      row(cell("isFocused"), cell("boolean \u2014 Is this layer currently in focus?")),
      row(cell("blurAmount"), cell("number (default: 8) \u2014 Gaussian blur when out of focus")),
      row(cell("dimAmount"), cell("number (default: 0.4) \u2014 Opacity reduction when out of focus")),
      row(cell("transitionFrames"), cell("number (default: 15) \u2014 Frames to animate focus transition")),
    ],
  ),
  spacer(),
  p("Implementation: Uses useCurrentFrame() + interpolate() to smoothly transition filter: blur() and opacity between focused and unfocused states. Will-change: filter for GPU acceleration."),
  spacer(),
);

// AnimatedCursor spec
children.push(
  h3("AnimatedCursor"),
  p([bold("File: "), mono("shared/live-ui/AnimatedCursor.tsx")]),
  spacer(),
  table(
    [2500, 6860],
    [
      row(headerCell("Prop", 2500), headerCell("Description", 6860)),
      row(cell("waypoints"), cell("Array<{ frame, x%, y%, clickAt?: boolean }>")),
      row(cell("color"), cell("string (default: theme.accent.cyan)")),
      row(cell("size"), cell("number (default: 24)")),
      row(cell("showTrail"), cell("boolean (default: true) \u2014 Fading trail behind cursor")),
    ],
  ),
  spacer(),
  p("Implementation: SVG arrow cursor positioned via spring() between waypoints. On clickAt frames, renders expanding circle ripple (scale 0 \u2192 1.5, opacity 1 \u2192 0 over 15 frames). Spring config: { damping: 20, mass: 1.2, stiffness: 60 } for natural hand movement."),
  spacer(),
);

// GlitchEffect spec
children.push(
  h3("GlitchEffect"),
  p([bold("File: "), mono("shared/effects/GlitchEffect.tsx")]),
  spacer(),
  table(
    [2500, 6860],
    [
      row(headerCell("Prop", 2500), headerCell("Description", 6860)),
      row(cell("children"), cell("React.ReactNode")),
      row(cell("active"), cell("boolean \u2014 Whether glitch is currently active")),
      row(cell("intensity"), cell("number 0-1 (default: 0.5)")),
      row(cell("sliceCount"), cell("number (default: 8) \u2014 Number of horizontal slices")),
    ],
  ),
  spacer(),
  p("Implementation: Renders children 3 times (R/G/B channels). Uses clip-path: inset() to create horizontal slices. Offsets each channel via translateX (red: +intensity*10px, blue: -intensity*10px). Randomizes slice positions using noise function seeded by frame number for deterministic rendering."),
  spacer(),
);

// CountUpText spec
children.push(
  h3("CountUpText"),
  p([bold("File: "), mono("shared/animation/CountUpText.tsx")]),
  spacer(),
  table(
    [2500, 6860],
    [
      row(headerCell("Prop", 2500), headerCell("Description", 6860)),
      row(cell("target"), cell("number \u2014 Final value (e.g. 99.7)")),
      row(cell("startFrame"), cell("number \u2014 Frame to begin counting")),
      row(cell("duration"), cell("number (default: 30) \u2014 Frames to reach target")),
      row(cell("decimals"), cell("number (default: 1)")),
      row(cell("suffix"), cell("string (default: \"%\")")),
      row(cell("fontSize"), cell("number")),
      row(cell("color"), cell("string")),
    ],
  ),
  spacer(),
  p("Implementation: interpolate(frame - startFrame, [0, duration], [0, target]) with easing. Formats via toFixed(decimals). Wraps in KineticText for glow effect."),
  spacer(),
);

// ThreeLayerStack spec
children.push(
  h3("ThreeLayerStack"),
  p([bold("File: "), mono("shared/visuals/ThreeLayerStack.tsx")]),
  spacer(),
  p("Implementation: Three AnimatedCardReveal components with stagger delay 30f, direction: up. Each wrapped in GlassRefraction with engine-specific glow color. CSS perspective: 1200px on container, each layer offset via translateZ (0, 40px, 80px) for parallax depth. SVG flow lines connect layers with animated strokeDashoffset."),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 4: Audio Pipeline ───────────────────────────────
children.push(
  h1("4. Audio Pipeline (Audio-First)"),
  spacer(),
  h2("4.1 Production Sequence"),
  numbered("Finalize script text (60 words, 6 shots)"),
  numbered("Generate VO via ElevenLabs API (Adam voice, stability: 0.5, similarity_boost: 0.75)"),
  numbered("Verify duration with getAudioDurationInSeconds() \u2014 target: 26-28s of speech"),
  numbered("Extract VO segment boundaries (manual in Audacity or via Whisper alignment)"),
  numbered("Define V5_VO_MARKERS in config.ts mapping VO phrases to frame numbers"),
  numbered("Select SFX from cc0-sfx/ directory (4-5 sounds)"),
  numbered("Compose in VideoMasterV5Flagship with layered Audio components"),
  spacer(),
  h2("4.2 VideoAudioV5 (New Component)"),
  p([bold("File: "), mono("video/v5/audioV5.tsx")]),
  spacer(),
  table(
    [3000, 6360],
    [
      row(headerCell("Prop", 3000), headerCell("Default", 6360)),
      row(cell("musicSrc"), cell("'audio/poseidon-beat.wav'")),
      row(cell("voSrc"), cell("'audio/poseidon-vo-v7.mp3'")),
      row(cell("enableAudio"), cell("true")),
      row(cell("musicVolumeMax"), cell("0.25 (critical: prevent VO masking)")),
      row(cell("voVolume"), cell("1.0")),
      row(cell("sfxVolume"), cell("0.5")),
    ],
  ),
  spacer(),
  p([bold("Why separate from existing audio.tsx: "), normal("Current audio.tsx references SHOTS (7-shot structure from global config). It calls SHOTS.shot7.start which does not exist in V5_SHOTS. Direct reuse would crash at runtime.")]),
  spacer(),
  h2("4.3 SFX Map"),
  table(
    [1500, 3000, 2000, 2860],
    [
      row(headerCell("Shot", 1500), headerCell("Event", 3000), headerCell("SFX Type", 2000), headerCell("Frame (relative)", 2860)),
      row(cell("1"), cell("Dashboard freeze"), cell("glitch"), cell("55")),
      row(cell("1"), cell("Metrics scramble"), cell("sub-hit"), cell("80")),
      row(cell("2"), cell("Logo assembly"), cell("sub-drop"), cell("30")),
      row(cell("2"), cell("LightSweep"), cell("whoosh"), cell("50")),
      row(cell("3"), cell("Anomaly spike"), cell("alert-ping"), cell("50")),
      row(cell("3"), cell("Audit log typing"), cell("click"), cell("90")),
      row(cell("3"), cell("99.7% reveal"), cell("hit"), cell("120")),
      row(cell("4"), cell("Cursor click"), cell("click"), cell("45")),
      row(cell("5"), cell("Layer 1/2/3 rise"), cell("whoosh"), cell("10, 40, 70")),
      row(cell("6"), cell("SparkBurst"), cell("sparkle"), cell("45")),
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 5: Config Changes ───────────────────────────────
children.push(
  h1("5. Configuration & Copy Changes"),
  spacer(),
  h2("5.1 config.ts (Shot Timing)"),
  p("Current V5: 6 shots x 5 seconds each (uniform). Revised: non-uniform to match VO pacing."),
  spacer(),
  table(
    [1500, 1800, 2000, 2000, 2060],
    [
      row(headerCell("Shot", 1500), headerCell("Seconds", 1800), headerCell("Frames", 2000), headerCell("Start Frame", 2000), headerCell("Content", 2060)),
      row(cell("1: Hook"), cell("4s"), cell("120"), cell("0"), cell("Broken trust")),
      row(cell("2: Turn"), cell("4s"), cell("120"), cell("120"), cell("Architecture reveal")),
      row(cell("3: Proof-P"), cell("6s"), cell("180"), cell("240"), cell("Threat detection")),
      row(cell("4: Proof-G"), cell("5s"), cell("150"), cell("420"), cell("Audit trail")),
      row(cell("5: Arch"), cell("5s"), cell("150"), cell("570"), cell("3-layer model")),
      row(cell("6: CTA"), cell("6s"), cell("180"), cell("720"), cell("Call to action")),
    ],
  ),
  spacer(),
  p([bold("Total: "), normal("4+4+6+5+5+6 = 30 seconds = 900 frames. Verified.")]),
  spacer(),
  h2("5.2 File \u2192 Content Mapping"),
  p("Narrative shot numbers and file names diverge due to content reassignment:"),
  spacer(),
  table(
    [2000, 3000, 2000, 2360],
    [
      row(headerCell("Narrative Shot", 2000), headerCell("File", 3000), headerCell("Change Level", 2000), headerCell("Notes", 2360)),
      row(cell("1: Hook"), cell("Shot01Signal.tsx"), cell([p("Full Rewrite", { color: "DC2626", bold: true, size: 20 })]), cell("Logo \u2192 Dashboard+Glitch")),
      row(cell("2: Turn"), cell("Shot02Friction.tsx"), cell([p("Major Rewrite", { color: "D97706", bold: true, size: 20 })]), cell("Warning \u2192 HexMesh+Logo")),
      row(cell("3: Proof-P"), cell("Shot03Clarity.tsx"), cell([p("Major Rewrite", { color: "D97706", bold: true, size: 20 })]), cell("Dashboard \u2192 Threat detect")),
      row(cell("4: Proof-G"), cell("Shot05Assurance.tsx"), cell([p("Moderate", { color: "2563EB", bold: true, size: 20 })]), cell("Audit: stagger + cursor")),
      row(cell("5: Arch"), cell("Shot04Momentum.tsx"), cell([p("Full Rewrite", { color: "DC2626", bold: true, size: 20 })]), cell("Metrics \u2192 3LayerStack")),
      row(cell("6: CTA"), cell("Shot06CTA.tsx"), cell([p("Minor", { color: "16A34A", bold: true, size: 20 })]), cell("Copy change only")),
    ],
  ),
  spacer(),
  p([bold("Note on Shot 4/5 swap: "), normal("Narrative Shot 4 (Govern/Audit) uses file Shot05Assurance.tsx because that file already contains AnimatedAuditLog. Narrative Shot 5 (Architecture) uses file Shot04Momentum.tsx which is fully rewritten anyway. The VideoMasterV5Flagship.tsx Sequence ordering will map them correctly.")]),
  spacer(),
  h2("5.3 VideoMasterV5Flagship.tsx (New Master)"),
  p("Clone of VideoMasterV5.tsx with modified Sequence ordering:"),
  spacer(),
  bullet("Sequence 1 (frame 0-120): Shot01Signal (Hook)"),
  bullet("Sequence 2 (frame 120-240): Shot02Friction (Turn)"),
  bullet("Sequence 3 (frame 240-420): Shot03Clarity (Proof-Protect)"),
  bullet("Sequence 4 (frame 420-570): Shot05Assurance (Proof-Govern) \u2190 note file swap"),
  bullet("Sequence 5 (frame 570-720): Shot04Momentum (Architecture) \u2190 note file swap"),
  bullet("Sequence 6 (frame 720-900): Shot06CTA (CTA)"),
  spacer(),
  p("FlashTransition timing: aligned to shot boundaries (frame 120, 240, 420, 570, 720)."),
  p("VideoAudioV5 replaces VideoAudio, with VO + BGM + SFX layers."),
  spacer(),
  h2("5.4 Root.tsx Addition"),
  p("Add new Composition registration:"),
  bullet("ID: \"VideoMasterV5Flagship\""),
  bullet("Component: VideoMasterV5Flagship"),
  bullet("Duration: 900 frames"),
  bullet("Default props: { voSrc: 'audio/poseidon-vo-v7.mp3', musicVolumeMax: 0.25, enableAudio: true }"),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 6: CameraController Keyframe Reference ──────────
children.push(
  h1("6. CameraController Keyframe Specifications"),
  p("All shots use aggressive component-focus keyframes. Below are the exact values."),
  spacer(),
  h2("Shot 3 (Hero Shot): Proof-Protect"),
  table(
    [1200, 1200, 1200, 1200, 1200, 3160],
    [
      row(headerCell("Frame", 1200), headerCell("Scale", 1200), headerCell("X", 1200), headerCell("Y", 1200), headerCell("Easing", 1200), headerCell("Focus Target", 3160)),
      row(cell("0"), cell("0.6"), cell("0"), cell("0"), cell("\u2014"), cell("Overview")),
      row(cell("20"), cell("2.2"), cell("15"), cell("-20"), cell("dramatic"), cell("Chart component")),
      row(cell("70"), cell("2.2"), cell("15"), cell("-20"), cell("\u2014"), cell("Hold on chart (spike)")),
      row(cell("90"), cell("2.0"), cell("-10"), cell("20"), cell("smooth"), cell("Audit panel")),
      row(cell("140"), cell("2.0"), cell("-10"), cell("20"), cell("\u2014"), cell("Hold on audit")),
      row(cell("160"), cell("0.7"), cell("0"), cell("0"), cell("zoomOut"), cell("Full pullback")),
    ],
  ),
  spacer(),
  p("Current Shot03 uses scale 0.7-1.1. This revision uses 0.6-2.2 (3x more aggressive zoom). The x/y offsets precisely target the chart component position within the 2-column grid layout."),
  spacer(),
  h2("Shot 4: Proof-Govern"),
  table(
    [1200, 1200, 1200, 1200, 1200, 3160],
    [
      row(headerCell("Frame", 1200), headerCell("Scale", 1200), headerCell("X", 1200), headerCell("Y", 1200), headerCell("Easing", 1200), headerCell("Focus Target", 3160)),
      row(cell("0"), cell("0.8"), cell("0"), cell("0"), cell("\u2014"), cell("Overview")),
      row(cell("30"), cell("2.5"), cell("-5"), cell("-15"), cell("dramatic"), cell("First audit entry")),
      row(cell("60"), cell("2.5"), cell("-5"), cell("-15"), cell("\u2014"), cell("Hold (cursor click)")),
      row(cell("80"), cell("1.2"), cell("0"), cell("5"), cell("smooth"), cell("Wider: all entries")),
      row(cell("120"), cell("0.8"), cell("0"), cell("0"), cell("zoomOut"), cell("Full + badges")),
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 7: Implementation Schedule ──────────────────────
children.push(
  h1("7. Implementation Schedule (7 Days)"),
  spacer(),
  table(
    [900, 4000, 2400, 2060],
    [
      row(headerCell("Day", 900), headerCell("Deliverables", 4000), headerCell("Risk", 2400), headerCell("Mitigation", 2060)),
      row(
        cell("1"),
        cell([
          p("Script text finalized", { size: 20 }),
          p("VO generated (ElevenLabs)", { size: 20 }),
          p("config.ts updated (V5_FLAGSHIP_SHOTS + V5_VO_MARKERS)", { size: 20 }),
          p("VideoAudioV5 component created", { size: 20 }),
          p("Root.tsx updated with Flagship composition", { size: 20 }),
        ]),
        cell("VO quality"),
        cell("3 takes, compare"),
      ),
      row(
        cell("2"),
        cell([
          p("DepthLayer component", { size: 20 }),
          p("AnimatedCursor component", { size: 20 }),
          p("GlitchEffect component", { size: 20 }),
          p("CountUpText component", { size: 20 }),
        ]),
        cell("AnimatedCursor spring tuning"),
        cell("Test with 3 configs"),
      ),
      row(
        cell("3"),
        cell([
          p("Shot 3 (Proof-Protect) complete", { size: 20, bold: true }),
          p("Hero shot: chart \u2192 spike \u2192 audit \u2192 99.7%", { size: 20 }),
          p("PoC checkpoint: render frame 300-420 and review", { size: 20 }),
        ]),
        cell([p("Highest complexity shot", { size: 20, color: "DC2626" })]),
        cell("Simplify: remove audit pan if over budget"),
      ),
      row(
        cell("4"),
        cell([
          p("Shot 1 (Hook) complete", { size: 20 }),
          p("Shot 2 (Turn) complete", { size: 20 }),
        ]),
        cell("GlitchEffect visual quality"),
        cell("Fallback: simple freeze + fade-to-black"),
      ),
      row(
        cell("5"),
        cell([
          p("ThreeLayerStack component", { size: 20 }),
          p("Shot 5 (Architecture) complete", { size: 20 }),
          p("Shot 4 (Proof-Govern) cursor + audit updates", { size: 20 }),
          p("Shot 6 (CTA) copy updates", { size: 20 }),
        ]),
        cell("Shot 4/5 file swap confusion"),
        cell("Clear mapping in Flagship master"),
      ),
      row(
        cell("6"),
        cell([
          p("Full 30s integration", { size: 20 }),
          p("FlashTransition retiming to shot boundaries", { size: 20 }),
          p("VO + BGM + SFX sync (\u00b13 frame tolerance)", { size: 20 }),
          p("Render: still frames at 0, 120, 240, 420, 570, 720, 899", { size: 20 }),
        ]),
        cell("Audio sync drift"),
        cell("Manual frame nudge in VO_MARKERS"),
      ),
      row(
        cell("7"),
        cell([
          p("Full render: poseidon-v5-flagship-30s.mp4", { size: 20 }),
          p("QA pass (see Section 8)", { size: 20 }),
          p("Fix issues, re-render", { size: 20 }),
          p("Compare with existing V5 side-by-side", { size: 20 }),
        ]),
        cell("30s overshoot"),
        cell("VO speed 1.05x or cut Shot 5 to 4s"),
      ),
    ],
  ),
  spacer(),
  p([bold("Critical Path: "), normal("Day 1 (VO generation) blocks everything. Day 3 (Shot 3 hero) is the quality gate. If Shot 3 does not meet expectations by end of Day 3, re-evaluate scope.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 8: QA Checklist ─────────────────────────────────
children.push(
  h1("8. QA Checklist (Implementation Completion Criteria)"),
  spacer(),
  h2("8.1 Build Verification"),
  bullet("cd remotion && npm run build passes without errors"),
  bullet("npx tsc --noEmit passes without type errors"),
  bullet("npx remotion still VideoMasterV5Flagship --frame=0 renders successfully"),
  spacer(),
  h2("8.2 Visual Verification (per-shot still renders)"),
  bullet("Frame 0: Dashboard UI visible (Shot 1 opening)"),
  bullet("Frame 60: Camera zoomed to chart, background blurred (component focus demo)"),
  bullet("Frame 120: Logo + HexMesh forming (Shot 2)"),
  bullet("Frame 300: Chart mid-draw, teal line visible (Shot 3 hero moment)"),
  bullet("Frame 360: Red bloom visible, anomaly card present (threat detected)"),
  bullet("Frame 420: Audit log first entry visible (Shot 4)"),
  bullet("Frame 480: Camera zoomed to audit entry, cursor present"),
  bullet("Frame 600: First layer of ThreeLayerStack visible (Shot 5)"),
  bullet("Frame 720: Logo + tagline (Shot 6 CTA)"),
  bullet("Frame 899: Final frame, CTA button visible, no visual artifacts"),
  spacer(),
  h2("8.3 Audio Verification"),
  bullet("Total duration is exactly 900 frames / 30 seconds"),
  bullet("VO is audible and not masked by BGM (BGM max volume 0.25)"),
  bullet("VO phrase boundaries align with shot transitions (\u00b13 frames)"),
  bullet("SFX events fire at correct moments (glitch, alert, clicks)"),
  bullet("No audio pops, clicks, or abrupt cuts at shot boundaries"),
  spacer(),
  h2("8.4 Living UI Verification"),
  bullet("No references to assets/screenshots/demo/ in any Flagship shot file"),
  bullet("Every shot has at least one continuously moving element (chart drawing, number counting, cursor moving, particles)"),
  bullet("At least 2 shots use component-focus camera (scale > 1.5) with DepthLayer blur"),
  bullet("At least 1 shot has AnimatedCursor interaction"),
  spacer(),
  h2("8.5 Regression"),
  bullet("Existing VideoMasterV5 composition still renders correctly (not broken by changes)"),
  bullet("Existing 4 MP4 files in out/ are not deleted or modified"),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 9: Risk Register ────────────────────────────────
children.push(
  h1("9. Risk Register"),
  spacer(),
  table(
    [2200, 800, 900, 2700, 2760],
    [
      row(headerCell("Risk", 2200), headerCell("Prob", 800), headerCell("Impact", 900), headerCell("Mitigation", 2700), headerCell("Trigger for Escalation", 2760)),
      row(cell("VO quality insufficient"), cell("Med"), cell("High"), cell("Generate 3 takes with different stability params. A/B test."), cell("No acceptable take after 5 attempts")),
      row(cell("Shot 3 density overload (6s)"), cell("Med"), cell("Med"), cell("Reduce: remove audit pan, keep chart + 99.7% only"), cell("Frame 360 still renders > 2s on preview")),
      row(cell("Scale 2.2 causes text pixelation"), cell("Low"), cell("Low"), cell("All UI is SVG/CSS (vector). Not a real risk for text. Charts are SVG."), cell("Visual artifact at 2.2x in still render")),
      row(cell("DepthLayer blur perf impact"), cell("Low"), cell("Med"), cell("will-change: filter. Remotion renders headless, blur 8px is cheap."), cell("Render time > 30min for 900 frames")),
      row(cell("AnimatedCursor looks artificial"), cell("Med"), cell("Med"), cell("Spring config: heavy, slow. Test 3 configs. Fallback: remove cursor, use highlight glow instead."), cell("Cursor movement feels robotic after 3 tuning attempts")),
      row(cell("30s overshoot"), cell("Low"), cell("High"), cell("VO speed 1.05x. Or cut Shot 5 to 4s (save 30 frames)."), cell("VO duration > 28.5s after generation")),
      row(cell("BGM + VO + SFX collision"), cell("Med"), cell("Med"), cell("BGM at 0.2 (not 0.25). SFX at 0.4. Duck BGM during VO peaks."), cell("Any SFX or BGM audibly competes with VO")),
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── Section 10: Assumptions ─────────────────────────────────
children.push(
  h1("10. Assumptions & Scope Boundaries"),
  spacer(),
  h2("In Scope"),
  bullet("VideoMasterV5Flagship composition (1 output file)"),
  bullet("6 shot files (rewrite/modify)"),
  bullet("5 new shared components (DepthLayer, AnimatedCursor, GlitchEffect, CountUpText, ThreeLayerStack)"),
  bullet("1 new audio component (VideoAudioV5)"),
  bullet("config.ts and copy.ts updates for V5 flagship"),
  bullet("Root.tsx registration"),
  bullet("VO generation script scaffold (generate-vo-elevenlabs.mjs)"),
  bullet("Render script (render-v5-flagship.mjs)"),
  spacer(),
  h2("Out of Scope"),
  bullet("Modifying existing VideoMasterV5 composition"),
  bullet("Modifying PoseidonProductDemo / ProductDemo30s / other existing compositions"),
  bullet("Remotion version upgrade (staying on 4.0.416)"),
  bullet("TransitionSeries migration (retaining ShotTransition for risk minimization)"),
  bullet("Subtitle / caption burn-in (future phase)"),
  bullet("Portrait / vertical variant"),
  bullet("Deployment / hosting of final video"),
  spacer(),
  h2("Assumptions"),
  bullet("ElevenLabs API key is available and functional"),
  bullet("cc0-sfx/ directory contains usable glitch, alert, and whoosh sounds"),
  bullet("Existing Living UI components (AnimatedChartLine, AnimatedAuditLog, AnimatedCardReveal) work correctly at scale 2.0+"),
  bullet("Node.js / npm / Remotion CLI available in development environment"),
  spacer(),
  h2("Remotion Feature Adoption Decisions"),
  table(
    [3000, 1500, 4860],
    [
      row(headerCell("Feature", 3000), headerCell("Decision", 1500), headerCell("Rationale", 4860)),
      row(cell("@remotion/transitions (TransitionSeries)"), cell("Not adopted"), cell("Existing ShotTransition works. Migration adds risk for no visible quality gain.")),
      row(cell("@remotion/media-parser"), cell("Not adopted"), cell("Deprecated upstream. Using standard Audio component.")),
      row(cell("@remotion/media Audio (volume/trim)"), cell("Adopted"), cell("Core of VO integration. Dynamic volume interpolation for BGM ducking.")),
      row(cell("@remotion/captions"), cell("Not adopted"), cell("Subtitles out of scope for this phase.")),
      row(cell("@remotion/motion-blur (Trail)"), cell("Not adopted"), cell("Visual impact marginal for 30s demo. Adds render cost.")),
    ],
  ),
);

// ── Build Document ────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 22 },
        paragraph: { spacing: { line: 276 } },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: "1F2937" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2563EB", space: 4 } } },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: "374151" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: "4B5563" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ],
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "POSEIDON V5 FLAGSHIP \u2014 IMPLEMENTATION PLAN", font: FONT, size: 16, color: "9CA3AF" }),
              ],
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 4 } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "CONFIDENTIAL \u2014 MIT Capstone 2026  |  Page ", font: FONT, size: 16, color: "9CA3AF" }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "9CA3AF" }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = "/sessions/magical-funny-hamilton/mnt/poseidon-mit.github.io/remotion/V5_FLAGSHIP_IMPLEMENTATION_PLAN.docx";
  fs.writeFileSync(outPath, buffer);
  console.log(`Written: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
});
