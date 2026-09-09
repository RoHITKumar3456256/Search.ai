import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search.ai — Turn Uncertainty Into Your Next Best Move",
  description: "Search.ai maps your constraints, scores 50+ verified tools across 8 signals, and hands you an evidence-grounded decision brief with a 7-day action plan.",
};

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600&display=swap');

        :root {
          --bg: #FAF6EC;
          --bg-card: #FFFFFF;
          --bg-card-subtle: #F5EFE1;
          --teal: #1B9AAA;
          --teal-dark: #147B88;
          --teal-light: #E8F5F7;
          --amber: #F5A623;
          --confetti-pink: #F48498;
          --confetti-yellow: #F5CB5C;
          --fg: #1E1A17;
          --fg-muted: #5C554E;
          --fg-subtle: #8A8177;
          --border: #E8E1D3;
          --radius-full: 9999px;
          --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        .home-body {
          background: var(--bg);
          color: var(--fg);
          font-family: var(--font-display);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .nav-wrap { position: fixed; top: 14px; left: 0; right: 0; z-index: 100; max-width: 1260px; margin: 0 auto; padding: 0 20px; }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; background: rgba(250,246,236,0.88); backdrop-filter: blur(16px); border: 1.5px solid var(--border); border-radius: var(--radius-full); padding: 8px 18px; box-shadow: 0 4px 20px rgba(45,38,33,0.04); }
        .nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; color: var(--fg); letter-spacing: -0.02em; text-decoration: none; }
        .logo-mark { width: 32px; height: 32px; border-radius: 9px; background: var(--teal); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-links a { font-size: 0.9rem; font-weight: 500; color: var(--fg-muted); text-decoration: none; transition: color 0.15s; }
        .nav-links a:hover { color: var(--teal); }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        @media(max-width:820px) { .nav-links { display: none; } }

        /* BUTTONS */
        .btn-pill { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 20px; font-family: var(--font-display); font-size: 0.88rem; font-weight: 600; border-radius: var(--radius-full); border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; white-space: nowrap; }
        .btn-primary { background: var(--teal); color: #fff; box-shadow: 0 3px 12px rgba(27,154,170,0.25); }
        .btn-primary:hover { background: var(--teal-dark); }
        .btn-outline { background: transparent; color: var(--fg); border: 1.5px solid #2D2621; }
        .btn-outline:hover { background: var(--fg); color: #fff; }
        .btn-lg { padding: 13px 28px; font-size: 1rem; }

        /* HERO */
        .hero { position: relative; padding: 130px 24px 70px; max-width: 1240px; margin: 0 auto; }
        .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center; }
        @media(max-width:860px) { .hero-grid { grid-template-columns: 1fr; } .hero-visual { display: none; } }

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 7px; background: transparent; border: 1.5px solid var(--teal); border-radius: var(--radius-full); padding: 6px 14px; font-size: 0.8rem; font-weight: 600; color: var(--teal); margin-bottom: 22px; }
        .hero-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; color: var(--fg); margin-bottom: 20px; }
        .hero-title em { font-style: normal; color: var(--teal); }
        .hero-sub { font-size: 1.05rem; color: var(--fg-muted); line-height: 1.65; margin-bottom: 32px; max-width: 480px; }
        .hero-ctas { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hero-trust { display: flex; align-items: center; gap: 8px; margin-top: 24px; font-size: 0.82rem; color: var(--fg-subtle); }

        /* HERO CARD */
        .hero-visual { position: relative; }
        .decision-card { background: #fff; border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; box-shadow: 0 18px 42px rgba(30,26,23,0.09); }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .card-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--teal-light); border-radius: 99px; padding: 4px 12px; font-size: 0.78rem; font-weight: 700; color: var(--teal); }
        .card-title { font-size: 0.95rem; font-weight: 700; color: var(--fg); }
        .card-query { background: var(--bg-card-subtle); border-radius: 12px; padding: 12px 14px; font-size: 0.88rem; color: var(--fg-muted); margin-bottom: 16px; border-left: 3px solid var(--teal); }
        .card-rec { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; margin-bottom: 8px; }
        .card-rec.best { background: rgba(27,154,170,0.06); border: 1.5px solid rgba(27,154,170,0.2); }
        .card-rec.alt { background: #fff; border: 1.5px solid var(--border); }
        .rec-logo { width: 36px; height: 36px; border-radius: 8px; background: var(--teal); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; }
        .rec-name { font-weight: 700; font-size: 0.88rem; color: var(--fg); }
        .rec-tag { font-size: 0.75rem; color: var(--fg-subtle); }
        .rec-score { margin-left: auto; background: var(--teal); color: #fff; border-radius: 6px; padding: 3px 8px; font-size: 0.78rem; font-weight: 700; }

        /* FEATURES */
        .features { max-width: 1200px; margin: 80px auto; padding: 0 24px; }
        .section-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--teal); margin-bottom: 8px; }
        .section-title { font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; letter-spacing: -0.02em; color: var(--fg); margin-bottom: 12px; }
        .section-sub { font-size: 1rem; color: var(--fg-muted); max-width: 520px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
        .feature-card { background: #fff; border: 1.5px solid var(--border); border-radius: 18px; padding: 24px; transition: box-shadow 0.2s; }
        .feature-card:hover { box-shadow: 0 8px 28px rgba(30,26,23,0.08); }
        .feature-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--teal-light); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .feature-title { font-weight: 700; font-size: 1rem; color: var(--fg); margin-bottom: 8px; }
        .feature-desc { font-size: 0.88rem; color: var(--fg-muted); line-height: 1.6; }

        /* HOW IT WORKS */
        .how { background: #fff; border-top: 1.5px solid var(--border); border-bottom: 1.5px solid var(--border); padding: 80px 24px; }
        .how-inner { max-width: 1200px; margin: 0 auto; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
        .step { text-align: center; }
        .step-num { width: 48px; height: 48px; border-radius: 50%; background: var(--teal); color: #fff; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .step-title { font-weight: 700; font-size: 1rem; color: var(--fg); margin-bottom: 8px; }
        .step-desc { font-size: 0.85rem; color: var(--fg-muted); line-height: 1.6; }

        /* CTA BANNER */
        .cta-banner { max-width: 800px; margin: 80px auto; padding: 0 24px; text-align: center; }
        .cta-box { background: var(--teal); border-radius: 28px; padding: 60px 40px; color: #fff; }
        .cta-box h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
        .cta-box p { font-size: 1rem; opacity: 0.85; margin-bottom: 32px; }
        .btn-white { background: #fff; color: var(--teal); font-weight: 700; }
        .btn-white:hover { background: #f0feff; }

        /* FOOTER */
        footer { border-top: 1.5px solid var(--border); padding: 32px 24px; text-align: center; color: var(--fg-subtle); font-size: 0.85rem; }

        /* CONFETTI */
        @keyframes floatSoft { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(4deg)} }
        @keyframes floatAlt { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(7px) rotate(-5deg)} }
        .confetti-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .cs { position: absolute; opacity: 0.3; fill: none; vector-effect: non-scaling-stroke; stroke-width: 1.75; }
        .cs1 { top:8%; left:4%; width:26px; height:26px; stroke: var(--teal); animation: floatSoft 7s ease-in-out infinite; }
        .cs2 { top:18%; left:32%; width:22px; height:22px; stroke: var(--confetti-pink); animation: floatAlt 8s ease-in-out infinite; }
        .cs3 { top:12%; right:8%; width:34px; height:34px; stroke: var(--confetti-yellow); animation: floatSoft 6s ease-in-out infinite; }
        .cs4 { top:48%; left:2%; width:28px; height:28px; stroke: var(--confetti-yellow); animation: floatSoft 8.5s ease-in-out infinite; }
      `}</style>

      <div className="home-body">

        {/* NAV */}
        <nav className="nav-wrap">
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="6"/><line x1="16" y1="16" x2="20" y2="20"/>
                </svg>
              </div>
              Search.ai
            </a>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#how">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="nav-actions">
              <Link href="/login" className="btn-pill btn-outline">Sign In</Link>
              <Link href="/login" className="btn-pill btn-primary">Get Started Free →</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="confetti-wrap">
            <svg className="cs cs1" viewBox="0 0 26 26"><rect x="3" y="3" width="20" height="20" rx="4"/></svg>
            <svg className="cs cs2" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8"/></svg>
            <svg className="cs cs3" viewBox="0 0 34 34"><polygon points="17,3 31,28 3,28"/></svg>
            <svg className="cs cs4" viewBox="0 0 28 28"><rect x="4" y="4" width="20" height="20" rx="10"/></svg>
          </div>

          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="7" r="5"/><line x1="10" y1="10" x2="13" y2="13"/></svg>
                Decision Intelligence Platform
              </div>
              <h1 className="hero-title">
                Turn Uncertainty Into<br/>
                Your <em>Next Best Move</em>
              </h1>
              <p className="hero-sub">
                Describe your challenge. Search.ai maps your constraints, scores 50+ verified tools across 8 signals, and delivers an evidence-grounded brief with a 7-day action plan — in under 30 seconds.
              </p>
              <div className="hero-ctas">
                <Link href="/login" className="btn-pill btn-primary btn-lg">Map My Options Free →</Link>
                <Link href="/dashboard" className="btn-pill btn-outline btn-lg">Open Workspace</Link>
              </div>
              <div className="hero-trust">
                <svg viewBox="0 0 14 14" width="14" height="14" fill="var(--teal)"><path d="M7 0L8.5 5h5l-4 3 1.5 5L7 10l-4 3 1.5-5-4-3h5z"/></svg>
                Free to start · No credit card · Real AI. Real citations.
              </div>
            </div>

            <div className="hero-visual">
              <div className="decision-card">
                <div className="card-header">
                  <div className="card-badge">
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><circle cx="6" cy="6" r="5"/></svg>
                    Live Analysis
                  </div>
                  <div className="card-title">E-Commerce Stack for India</div>
                </div>
                <div className="card-query">
                  &ldquo;I need an e-commerce platform under ₹10,000/month with native UPI and WhatsApp integration&rdquo;
                </div>
                <div className="card-rec best">
                  <div className="rec-logo">D</div>
                  <div>
                    <div className="rec-name">Dukaan</div>
                    <div className="rec-tag">Best Fit · Zero-code Indian platform</div>
                  </div>
                  <div className="rec-score">94</div>
                </div>
                <div className="card-rec alt">
                  <div className="rec-logo" style={{background:"#96588a"}}>W</div>
                  <div>
                    <div className="rec-name">WooCommerce</div>
                    <div className="rec-tag">Best Value · Open-source</div>
                  </div>
                  <div className="rec-score" style={{background:"#5C554E"}}>87</div>
                </div>
                <div style={{marginTop:"14px", padding:"10px 14px", background:"#f0fdf4", borderRadius:"10px", fontSize:"0.82rem", color:"#166534", fontWeight:600}}>
                  ✅ 3-step action plan ready · Sources cited
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="features">
          <div className="section-label">Why Search.ai</div>
          <h2 className="section-title">Not a chatbot. A decision engine.</h2>
          <p className="section-sub">Every recommendation is evidence-grounded, scored across 8 signals, and delivered with real citations — not opinions.</p>
          <div className="features-grid">
            {[
              { icon: "🧠", title: "8-Signal Scoring", desc: "Every tool is scored on cost, speed, scalability, India-readiness, support, integrations, compliance, and community." },
              { icon: "🌐", title: "Live Web Search", desc: "Tavily-powered real-time web grounding pulls 2026 pricing, reviews, and comparisons — not stale training data." },
              { icon: "📋", title: "7-Day Action Plan", desc: "Step-by-step implementation plan so you know exactly what to do on Day 1, Day 3, and Day 7." },
              { icon: "🔗", title: "Cited Sources", desc: "Every claim links to a real URL. No hallucinations. No made-up prices. Full transparency." },
              { icon: "⚡", title: "Gemini + Groq AI", desc: "Primary Google Gemini with Groq fallback for ultra-fast responses at any load." },
              { icon: "🔒", title: "Private & Secure", desc: "Your queries are never stored for training. Supabase-backed auth. Enterprise-grade security." },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon"><span style={{fontSize:"22px"}}>{f.icon}</span></div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how" id="how">
          <div className="how-inner">
            <div style={{textAlign:"center"}}>
              <div className="section-label">How It Works</div>
              <h2 className="section-title">From question to decision in 30 seconds</h2>
            </div>
            <div className="steps">
              {[
                { n: "1", title: "Describe Your Challenge", desc: "Tell us your budget, experience level, location, and what you're trying to build or solve." },
                { n: "2", title: "AI Scores 50+ Options", desc: "Our engine queries live web data and scores tools across 8 signals matched to your constraints." },
                { n: "3", title: "Get Your Decision Brief", desc: "Receive Best Fit, Best Value, and Scalable Alternative picks — with full citations and an action plan." },
              ].map((s) => (
                <div key={s.n} className="step">
                  <div className="step-num">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-banner">
          <div className="cta-box">
            <h2>Ready to make your best decision?</h2>
            <p>Join founders, students, and freelancers using Search.ai to cut through tool overwhelm.</p>
            <Link href="/login" className="btn-pill btn-white btn-lg">Start Free — No Card Needed →</Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <p>© 2026 Search.ai · Built for founders, students &amp; freelancers · <Link href="/login" style={{color:"var(--teal)"}}>Sign In</Link></p>
        </footer>

      </div>
    </>
  );
}
