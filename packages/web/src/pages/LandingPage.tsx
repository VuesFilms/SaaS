import { Link } from "react-router-dom";
import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* ───── Animated section that fades in on scroll ───── */
function RevealSection({
  children,
  style,
  delay = 0,
}: {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───── Reusable gradient button ───── */
function GradientButton({
  children,
  to,
  large,
  outline,
}: {
  children: ReactNode;
  to: string;
  large?: boolean;
  outline?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base: CSSProperties = outline
    ? {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: large ? "16px 38px" : "12px 28px",
        background: "transparent",
        color: "#c4b5fd",
        border: "1px solid rgba(139,92,246,0.4)",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: large ? "16px" : "14px",
        fontWeight: 600,
        textDecoration: "none",
        fontFamily: "var(--font-family)",
        letterSpacing: "0.2px",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 0 30px rgba(139,92,246,0.2)"
          : "none",
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: large ? "16px 38px" : "12px 28px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: large ? "16px" : "14px",
        fontWeight: 600,
        textDecoration: "none",
        fontFamily: "var(--font-family)",
        letterSpacing: "0.2px",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px) scale(1.02)" : "translateY(0)",
        boxShadow: hovered
          ? "0 0 50px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.3)"
          : "0 0 30px rgba(99,102,241,0.2)",
      };

  return (
    <Link
      to={to}
      style={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

/* ───── Feature card ───── */
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <RevealSection delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? "rgba(30, 27, 75, 0.6)"
            : "rgba(17, 24, 39, 0.5)",
          border: `1px solid ${hovered ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "20px",
          padding: "36px 28px",
          backdropFilter: "blur(20px)",
          transition: "all 0.4s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 60px rgba(99,102,241,0.15), 0 0 40px rgba(139,92,246,0.1)"
            : "0 4px 20px rgba(0,0,0,0.2)",
          cursor: "default",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            marginBottom: "20px",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            margin: "0 0 10px 0",
            fontSize: "18px",
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#94a3b8",
            lineHeight: 1.65,
          }}
        >
          {desc}
        </p>
      </div>
    </RevealSection>
  );
}

/* ───── Toolbar mockup button ───── */
function MockBtn({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        padding: "5px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
        background: accent
          ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
          : "rgba(255,255,255,0.06)",
        color: accent ? "#fff" : "#94a3b8",
        border: accent
          ? "none"
          : "1px solid rgba(255,255,255,0.08)",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </span>
  );
}

/* ───── Step card ───── */
function StepCard({
  num,
  title,
  desc,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <RevealSection delay={delay}>
      <div
        style={{
          textAlign: "center",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 800,
            color: "#fff",
            margin: "0 auto 18px auto",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
          }}
        >
          {num}
        </div>
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "17px",
            fontWeight: 700,
            color: "#f1f5f9",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#94a3b8",
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>
    </RevealSection>
  );
}

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  /* Floating orbs animated positions */
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const handler = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      {/* ── Floating gradient orbs ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            transform: `translateY(${scroll * 0.08}px)`,
            transition: "transform 0.1s linear",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "-15%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            transform: `translateY(${scroll * -0.05}px)`,
            transition: "transform 0.1s linear",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "30%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            transform: `translateY(${scroll * -0.03}px)`,
            transition: "transform 0.1s linear",
          }}
        />
      </div>

      {/* ── Sticky Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          background:
            scroll > 50
              ? "rgba(10, 14, 26, 0.9)"
              : "transparent",
          borderBottom:
            scroll > 50
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid transparent",
          backdropFilter: scroll > 50 ? "blur(24px)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "22px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          Film SaaS
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/login">Login</NavLink>
          <GradientButton to="/register">Get Started</GradientButton>
        </div>
      </nav>

      {/* ── Content container ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ═══════ HERO ═══════ */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "140px 24px 100px",
            position: "relative",
          }}
        >
          {/* Badge */}
          <RevealSection>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "9999px",
                border: "1px solid rgba(139,92,246,0.25)",
                background: "rgba(139,92,246,0.08)",
                marginBottom: "32px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#c4b5fd",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#a78bfa",
                  animation: "pulseGlow 2s ease infinite",
                }}
              />
              Professional Screenplay Writing Platform
            </div>
          </RevealSection>

          {/* Headline */}
          <RevealSection delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.05,
                margin: "0 0 24px 0",
                maxWidth: "900px",
                letterSpacing: "-2px",
              }}
            >
              <span style={{ color: "#f1f5f9" }}>Write Scripts</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Like a Pro
              </span>
            </h1>
          </RevealSection>

          {/* Subtitle */}
          <RevealSection delay={0.2}>
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#94a3b8",
                maxWidth: "620px",
                margin: "0 0 44px 0",
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Industry-standard screenplay formatting, powerful editing tools,
              and seamless export — all in one beautiful, dark-themed workspace.
            </p>
          </RevealSection>

          {/* CTA Buttons */}
          <RevealSection delay={0.3}>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <GradientButton to="/editor/new" large>
                Start Writing
                <span style={{ fontSize: "18px" }}>&rarr;</span>
              </GradientButton>
              <GradientButton to="/dashboard" large outline>
                View Dashboard
              </GradientButton>
            </div>
          </RevealSection>

          {/* Hero editor mockup */}
          <RevealSection delay={0.45} style={{ width: "100%", maxWidth: "960px", marginTop: "72px" }}>
            <div
              style={{
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.1)",
              }}
            >
              {/* Window chrome */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(10,14,26,0.6)",
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  screenplay-editor.film
                </span>
              </div>

              {/* Toolbar mockup */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: "rgba(15,20,35,0.8)",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <MockBtn label="B" />
                <MockBtn label="I" />
                <MockBtn label="U" />
                <span
                  style={{
                    width: "1px",
                    height: "18px",
                    background: "rgba(255,255,255,0.08)",
                    margin: "0 4px",
                  }}
                />
                <MockBtn label="H1" />
                <MockBtn label="H2" />
                <span
                  style={{
                    width: "1px",
                    height: "18px",
                    background: "rgba(255,255,255,0.08)",
                    margin: "0 4px",
                  }}
                />
                <MockBtn label="Scene" accent />
                <MockBtn label="Action" accent />
                <MockBtn label="Character" accent />
                <MockBtn label="Dialogue" accent />
                <MockBtn label="Transition" accent />
                <span
                  style={{
                    width: "1px",
                    height: "18px",
                    background: "rgba(255,255,255,0.08)",
                    margin: "0 4px",
                  }}
                />
                <MockBtn label="PDF" />
                <MockBtn label="Word" />
              </div>

              {/* Editor content mockup */}
              <div
                style={{
                  padding: "32px 48px",
                  minHeight: "260px",
                  fontFamily: "'Courier Prime', 'Courier New', monospace",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#cbd5e1",
                }}
              >
                <div
                  style={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#a78bfa",
                    letterSpacing: "0.5px",
                  }}
                >
                  INT. WRITER&apos;S STUDIO - NIGHT
                </div>
                <div style={{ marginTop: "16px", color: "#94a3b8" }}>
                  A dimly lit room. Soft ambient light from multiple monitors
                  illuminates the desk. The writer leans forward, fingers poised
                  over the keyboard.
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  WRITER
                </div>
                <div
                  style={{
                    textAlign: "center",
                    maxWidth: "340px",
                    margin: "4px auto 0 auto",
                    color: "#94a3b8",
                  }}
                >
                  This changes everything. A screenplay
                  editor that actually understands format.
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "right",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: "0.5px",
                  }}
                >
                  CUT TO:
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Gradient line beneath hero */}
          <div
            style={{
              width: "200px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
              margin: "80px auto 0 auto",
              opacity: 0.5,
            }}
          />
        </section>

        {/* ═══════ FEATURES ═══════ */}
        <section
          style={{
            padding: "80px 24px 100px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#a78bfa",
                  marginBottom: "12px",
                }}
              >
                Features
              </p>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 900,
                  color: "#f1f5f9",
                  margin: "0 0 16px 0",
                  letterSpacing: "-1px",
                }}
              >
                Everything You Need
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#94a3b8",
                  maxWidth: "560px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Professional tools designed for screenwriters, filmmakers, and
                storytellers who demand precision.
              </p>
            </div>
          </RevealSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            <FeatureCard
              icon={"\u270F\uFE0F"}
              title="Screenplay Formatting"
              desc="Industry-standard blocks: Scene Headings, Action, Character, Dialogue, Parenthetical, and Transitions — all with keyboard shortcuts."
              delay={0}
            />
            <FeatureCard
              icon={"\uD83D\uDCE4"}
              title="Export to PDF & Word"
              desc="One-click export to properly formatted PDF or Word documents. Ready for submission to studios, agents, and competitions."
              delay={0.1}
            />
            <FeatureCard
              icon={"\uD83C\uDFA8"}
              title="Rich Text Editor"
              desc="Full formatting toolbar with Bold, Italic, Underline, Headings, and text alignment. Powered by TipTap for a smooth editing experience."
              delay={0.2}
            />
            <FeatureCard
              icon={"\uD83C\uDF19"}
              title="Dark & Light Themes"
              desc="Work comfortably day or night. Gorgeous dark mode with glassmorphic design, plus a clean light mode when you prefer it."
              delay={0.05}
            />
            <FeatureCard
              icon={"\uD83C\uDF10"}
              title="Multi-language (EN/AR)"
              desc="Full internationalization with English and Arabic support, including right-to-left (RTL) layout — write in your native language."
              delay={0.15}
            />
            <FeatureCard
              icon={"\uD83D\uDCC2"}
              title="Project Dashboard"
              desc="Organize all your screenplays in one place. Manage projects by genre, see recent work, and jump right back into writing."
              delay={0.25}
            />
          </div>
        </section>

        {/* ═══════ HOW IT WORKS ═══════ */}
        <section
          style={{
            padding: "60px 24px 100px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#a78bfa",
                  marginBottom: "12px",
                }}
              >
                How It Works
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 900,
                  color: "#f1f5f9",
                  margin: 0,
                  letterSpacing: "-1px",
                }}
              >
                From Idea to Script in Minutes
              </h2>
            </div>
          </RevealSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <StepCard
              num="1"
              title="Create a Project"
              desc="Start a new project from the dashboard and give your screenplay a title."
              delay={0}
            />
            <StepCard
              num="2"
              title="Write Your Script"
              desc="Use professional formatting blocks. Keyboard shortcuts make it fast."
              delay={0.1}
            />
            <StepCard
              num="3"
              title="Export & Share"
              desc="Export your finished screenplay as a PDF or Word document. Done."
              delay={0.2}
            />
          </div>
        </section>

        {/* ═══════ TECH BANNER ═══════ */}
        <section
          style={{
            padding: "60px 24px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <RevealSection>
            <div
              style={{
                background: "rgba(17, 24, 39, 0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "24px",
                padding: "48px 40px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "40px",
                textAlign: "center",
              }}
            >
              {[
                { label: "React 18", sub: "UI Framework" },
                { label: "TypeScript", sub: "Type Safety" },
                { label: "TipTap", sub: "Editor Engine" },
                { label: "Vite", sub: "Build Tool" },
                { label: "i18next", sub: "Multi-language" },
              ].map((t) => (
                <div key={t.label}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#c4b5fd",
                      marginBottom: "4px",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {t.sub}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ═══════ FINAL CTA ═══════ */}
        <section
          style={{
            padding: "100px 24px 120px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Big glow behind CTA */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "600px",
              height: "400px",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <RevealSection style={{ position: "relative" }}>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 900,
                color: "#f1f5f9",
                margin: "0 0 16px 0",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
              }}
            >
              Ready to Write Your{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Masterpiece
              </span>
              ?
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "#94a3b8",
                maxWidth: "500px",
                margin: "0 auto 40px auto",
                lineHeight: 1.6,
              }}
            >
              Join Film SaaS and bring your stories to life with professional
              screenplay tools.
            </p>
            <GradientButton to="/register" large>
              Get Started Free
              <span style={{ fontSize: "18px" }}>&rarr;</span>
            </GradientButton>
          </RevealSection>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "40px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Film SaaS
          </span>
          <span style={{ fontSize: "13px", color: "#475569" }}>
            &copy; {new Date().getFullYear()} Film SaaS. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/register">Register</FooterLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Small nav link ── */
function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: hovered ? "#f1f5f9" : "#94a3b8",
        fontSize: "14px",
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        background: hovered ? "rgba(255,255,255,0.05)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

/* ── Footer link ── */
function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: hovered ? "#c4b5fd" : "#64748b",
        fontSize: "13px",
        fontWeight: 500,
        transition: "color 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}
