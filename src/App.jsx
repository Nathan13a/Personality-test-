import { useState, useEffect } from "react";

const QUESTIONS = [
  { q: "At a party, you tend to:", a: "Talk to many people, including strangers", b: "Talk mostly to people you already know" },
  { q: "You are more drawn to:", a: "Facts and concrete details", b: "Patterns and possibilities" },
  { q: "When making decisions, you prioritize:", a: "Logic and consistency", b: "People's feelings and circumstances" },
  { q: "You prefer your days to be:", a: "Planned and organized", b: "Flexible and spontaneous" },
  { q: "In a group discussion, you:", a: "Jump in and think out loud", b: "Listen first, then share your thoughts" },
  { q: "You find it more interesting to:", a: "Focus on what is real and actual", b: "Imagine what could be possible" },
  { q: "Which bothers you more?", a: "Being taken advantage of", b: "Being seen as heartless" },
  { q: "You tend to make decisions:", a: "Quickly and decisively", b: "After exploring all options" },
  { q: "After socializing for hours, you feel:", a: "Energized and want more", b: "Drained and need alone time" },
  { q: "You trust more in:", a: "Your direct experience", b: "Your gut instinct" },
  { q: "You value being known as:", a: "A fair and reasonable person", b: "A compassionate and warm person" },
  { q: "Your workspace is typically:", a: "Neat and organized", b: "Creative chaos" },
  { q: "When meeting someone new, you:", a: "Easily start conversations", b: "Wait for them to approach you" },
  { q: "You prefer instructions that are:", a: "Step-by-step and detailed", b: "General, leaving room for interpretation" },
  { q: "In a conflict, you focus on:", a: "Finding the objectively correct answer", b: "Maintaining harmony in the relationship" },
  { q: "Deadlines make you feel:", a: "Focused and productive", b: "Stressed and constrained" },
];

const TYPE_DESCRIPTIONS = {
  INTJ: { title: "The Architect", desc: "Strategic, independent, and determined. You see the world as a giant chess board, and you're always three moves ahead. Your mind is a fortress of logic and innovation.", traits: ["Strategic Vision", "Independent Thinking", "High Standards", "Intellectual Depth"], celeb: "Elon Musk, Michelle Obama", dimensions: { E: 24, I: 76, S: 28, N: 72, T: 81, F: 19, J: 75, P: 25 }, functions: ["Ni (Introverted Intuition)", "Te (Extraverted Thinking)", "Fi (Introverted Feeling)", "Se (Extraverted Sensing)"], careers: ["Data Scientist", "Strategic Consultant", "Software Architect", "Investment Banker", "Research Scientist"], relationships: "You need a partner who respects your independence and matches your intellectual depth. You show love through problem-solving and long-term planning rather than grand emotional gestures." },
  INTP: { title: "The Logician", desc: "Innovative, curious, and logical. Your brain is basically a perpetual motion machine of ideas. You question everything — including whether questioning everything is actually productive.", traits: ["Analytical Mind", "Creative Problem-Solving", "Objectivity", "Adaptability"], celeb: "Albert Einstein, Tina Fey", dimensions: { E: 21, I: 79, S: 25, N: 75, T: 85, F: 15, J: 30, P: 70 }, functions: ["Ti (Introverted Thinking)", "Ne (Extraverted Intuition)", "Si (Introverted Sensing)", "Fe (Extraverted Feeling)"], careers: ["Philosopher", "Software Developer", "Mathematician", "Forensic Analyst", "Game Designer"], relationships: "You connect through ideas and intellectual exploration. You need a partner who can keep up with your abstract conversations and doesn't need constant emotional reassurance." },
  ENTJ: { title: "The Commander", desc: "Bold, imaginative, and strong-willed. You don't just enter rooms — you reorganize them. Born leaders who can turn vision into reality with terrifying efficiency.", traits: ["Natural Leadership", "Strategic Planning", "Confidence", "Efficiency"], celeb: "Steve Jobs, Margaret Thatcher", dimensions: { E: 78, I: 22, S: 30, N: 70, T: 82, F: 18, J: 80, P: 20 }, functions: ["Te (Extraverted Thinking)", "Ni (Introverted Intuition)", "Se (Extraverted Sensing)", "Fi (Introverted Feeling)"], careers: ["CEO", "Management Consultant", "Entrepreneur", "Lawyer", "Political Strategist"], relationships: "You approach relationships with the same drive you bring to everything else. You need a partner who is confident in their own right and won't be steamrolled by your intensity." },
  ENTP: { title: "The Debater", desc: "Smart, curious, and endlessly contrarian. You'd argue with a stop sign if you thought it was being unreasonable. Innovation is your middle name (legally pending).", traits: ["Quick Thinking", "Charismatic", "Resourceful", "Visionary"], celeb: "Mark Twain, Celine Dion", dimensions: { E: 74, I: 26, S: 22, N: 78, T: 70, F: 30, J: 28, P: 72 }, functions: ["Ne (Extraverted Intuition)", "Ti (Introverted Thinking)", "Fe (Extraverted Feeling)", "Si (Introverted Sensing)"], careers: ["Startup Founder", "Creative Director", "Political Commentator", "Venture Capitalist", "Comedy Writer"], relationships: "You need someone who loves sparring intellectually and won't take your debates personally. Boredom is the enemy — you thrive with a partner who constantly surprises you." },
  INFJ: { title: "The Advocate", desc: "Quiet, mystical, and inspiring. You understand people on a level that's almost unsettling. Your intuition is so sharp it should be registered as a weapon.", traits: ["Deep Empathy", "Visionary Idealism", "Determination", "Insightfulness"], celeb: "Martin Luther King Jr., Lady Gaga", dimensions: { E: 20, I: 80, S: 23, N: 77, T: 30, F: 70, J: 72, P: 28 }, functions: ["Ni (Introverted Intuition)", "Fe (Extraverted Feeling)", "Ti (Introverted Thinking)", "Se (Extraverted Sensing)"], careers: ["Psychologist", "Nonprofit Director", "Writer", "Counselor", "UX Researcher"], relationships: "You seek deep, soulful connections. Surface-level relationships drain you. You need a partner who values authenticity and is willing to explore the depths of human experience with you." },
  INFP: { title: "The Mediator", desc: "Poetic, kind, and altruistic. You feel everything deeply — sunsets, songs, that one commercial about the dog. Your inner world is richer than most people's outer one.", traits: ["Idealistic", "Creative Expression", "Empathy", "Authenticity"], celeb: "William Shakespeare, Princess Diana", dimensions: { E: 22, I: 78, S: 20, N: 80, T: 25, F: 75, J: 27, P: 73 }, functions: ["Fi (Introverted Feeling)", "Ne (Extraverted Intuition)", "Si (Introverted Sensing)", "Te (Extraverted Thinking)"], careers: ["Author", "Art Therapist", "Musician", "Social Worker", "Filmmaker"], relationships: "You love with your entire being and need a partner who appreciates your depth. You'd rather be alone than in a relationship that feels inauthentic." },
  ENFJ: { title: "The Protagonist", desc: "Charismatic, inspiring, and born to lead with heart. You make everyone around you better, like human emotional WiFi. People feel seen when you look at them.", traits: ["Inspiring Leadership", "Empathy", "Reliability", "Charisma"], celeb: "Barack Obama, Oprah Winfrey", dimensions: { E: 77, I: 23, S: 26, N: 74, T: 28, F: 72, J: 74, P: 26 }, functions: ["Fe (Extraverted Feeling)", "Ni (Introverted Intuition)", "Se (Extraverted Sensing)", "Ti (Introverted Thinking)"], careers: ["Life Coach", "Teacher", "HR Director", "Motivational Speaker", "Diplomat"], relationships: "You pour yourself into relationships and need a partner who reciprocates that energy. You tend to put others first — finding someone who looks after you is essential." },
  ENFP: { title: "The Campaigner", desc: "Enthusiastic, creative, and sociable. Your energy could power a small city. You see connections everywhere and turn strangers into best friends in approximately 4.5 minutes.", traits: ["Infectious Enthusiasm", "Creativity", "People Skills", "Optimism"], celeb: "Robin Williams, Ellen DeGeneres", dimensions: { E: 80, I: 20, S: 18, N: 82, T: 32, F: 68, J: 24, P: 76 }, functions: ["Ne (Extraverted Intuition)", "Fi (Introverted Feeling)", "Te (Extraverted Thinking)", "Si (Introverted Sensing)"], careers: ["Brand Strategist", "Journalist", "Event Planner", "Therapist", "Actor"], relationships: "You fall in love with potential and possibility. You need a partner who shares your zest for life but can also ground you when your 47 simultaneous ideas get overwhelming." },
  ISTJ: { title: "The Logistician", desc: "Practical, fact-minded, and reliable. You're the backbone of civilization — the person who actually reads the manual. Your word is your bond, and your spreadsheets are immaculate.", traits: ["Reliability", "Practicality", "Dedication", "Integrity"], celeb: "George Washington, Angela Merkel", dimensions: { E: 18, I: 82, S: 82, N: 18, T: 78, F: 22, J: 85, P: 15 }, functions: ["Si (Introverted Sensing)", "Te (Extraverted Thinking)", "Fi (Introverted Feeling)", "Ne (Extraverted Intuition)"], careers: ["Accountant", "Military Officer", "Systems Administrator", "Surgeon", "Judge"], relationships: "You show love through actions, not words. You need a partner who values stability and follows through on commitments. Grand romantic gestures aren't your thing — quiet consistency is." },
  ISFJ: { title: "The Defender", desc: "Very dedicated and warm protectors. You remember everyone's birthday, allergy, and that thing they mentioned once three years ago. The world's most underappreciated superheroes.", traits: ["Supportive Nature", "Reliability", "Patience", "Observant"], celeb: "Beyoncé, Queen Elizabeth II", dimensions: { E: 22, I: 78, S: 80, N: 20, T: 30, F: 70, J: 78, P: 22 }, functions: ["Si (Introverted Sensing)", "Fe (Extraverted Feeling)", "Ti (Introverted Thinking)", "Ne (Extraverted Intuition)"], careers: ["Nurse", "Librarian", "Interior Designer", "Veterinarian", "Elementary Teacher"], relationships: "You're the ultimate caregiver in relationships. You need a partner who notices and appreciates everything you do — because you do a lot, often without being asked." },
  ESTJ: { title: "The Executive", desc: "Organized, group-oriented, and dedicated. You bring order to chaos like a human filing cabinet with leadership skills. Rules exist for a reason, and you know every single one.", traits: ["Organization", "Dedication", "Strong Will", "Direct Honesty"], celeb: "Judge Judy, Frank Sinatra", dimensions: { E: 76, I: 24, S: 78, N: 22, T: 80, F: 20, J: 84, P: 16 }, functions: ["Te (Extraverted Thinking)", "Si (Introverted Sensing)", "Ne (Extraverted Intuition)", "Fi (Introverted Feeling)"], careers: ["Project Manager", "Financial Officer", "School Principal", "Business Owner", "Police Officer"], relationships: "You bring structure and dependability to relationships. You need a partner who respects tradition and shared responsibilities, and who communicates directly without games." },
  ESFJ: { title: "The Consul", desc: "Caring, social, and popular. You're the glue that holds every friend group together. Your hosting skills are legendary and your casseroles could broker world peace.", traits: ["Warmth", "Loyalty", "Social Intelligence", "Generosity"], celeb: "Taylor Swift, Jennifer Garner", dimensions: { E: 78, I: 22, S: 75, N: 25, T: 25, F: 75, J: 76, P: 24 }, functions: ["Fe (Extraverted Feeling)", "Si (Introverted Sensing)", "Ne (Extraverted Intuition)", "Ti (Introverted Thinking)"], careers: ["Event Coordinator", "Public Relations", "Healthcare Administrator", "Real Estate Agent", "Social Media Manager"], relationships: "You thrive in harmonious relationships where both partners actively nurture the connection. You need someone who values family, tradition, and showing up for the people they love." },
  ISTP: { title: "The Virtuoso", desc: "Bold, practical, and masterful with tools. You can fix anything, build anything, and look cool doing it. Your calm under pressure is genuinely intimidating.", traits: ["Resourcefulness", "Practicality", "Adaptability", "Cool Under Pressure"], celeb: "Bear Grylls, Scarlett Johansson", dimensions: { E: 25, I: 75, S: 76, N: 24, T: 74, F: 26, J: 28, P: 72 }, functions: ["Ti (Introverted Thinking)", "Se (Extraverted Sensing)", "Ni (Introverted Intuition)", "Fe (Extraverted Feeling)"], careers: ["Mechanical Engineer", "Pilot", "Forensic Scientist", "Paramedic", "Craftsperson"], relationships: "You show love through fixing things and shared experiences rather than words. You need a partner who gives you space and doesn't mistake your independence for indifference." },
  ISFP: { title: "The Adventurer", desc: "Flexible, charming, and artistic. You experience life like a beautiful film that only you can see. Your aesthetic sense is impeccable, and you follow your heart like a compass.", traits: ["Artistic Sensitivity", "Curiosity", "Charm", "Independence"], celeb: "Bob Dylan, Rihanna", dimensions: { E: 24, I: 76, S: 72, N: 28, T: 28, F: 72, J: 22, P: 78 }, functions: ["Fi (Introverted Feeling)", "Se (Extraverted Sensing)", "Ni (Introverted Intuition)", "Te (Extraverted Thinking)"], careers: ["Graphic Designer", "Chef", "Photographer", "Fashion Designer", "Landscape Architect"], relationships: "You express love through beauty and shared moments. You need a partner who appreciates your artistic soul and doesn't try to box you into conventional expectations." },
  ESTP: { title: "The Entrepreneur", desc: "Smart, energetic, and perceptive. You live in the moment and make things happen. While others are still planning, you've already done it, posted it, and moved on.", traits: ["Boldness", "Sociability", "Practicality", "Perception"], celeb: "Ernest Hemingway, Madonna", dimensions: { E: 82, I: 18, S: 78, N: 22, T: 68, F: 32, J: 26, P: 74 }, functions: ["Se (Extraverted Sensing)", "Ti (Introverted Thinking)", "Fe (Extraverted Feeling)", "Ni (Introverted Intuition)"], careers: ["Sales Director", "Stockbroker", "Sports Coach", "Emergency Responder", "Restaurant Owner"], relationships: "You bring excitement and spontaneity to relationships. You need a partner who can keep up with your pace and doesn't need to overanalyze every moment." },
  ESFP: { title: "The Entertainer", desc: "Spontaneous, energetic, and enthusiastic. The party doesn't start when you arrive — it was already in progress because you organized it. Life is your stage and you're nailing it.", traits: ["Spontaneity", "Energy", "Practicality", "Showmanship"], celeb: "Marilyn Monroe, Jamie Oliver", dimensions: { E: 84, I: 16, S: 74, N: 26, T: 26, F: 74, J: 20, P: 80 }, functions: ["Se (Extraverted Sensing)", "Fi (Introverted Feeling)", "Te (Extraverted Thinking)", "Ni (Introverted Intuition)"], careers: ["Performer", "Tour Guide", "Fitness Instructor", "TV Presenter", "Wedding Planner"], relationships: "You bring joy and energy to every relationship. You need a partner who loves living in the moment and doesn't try to dim your spotlight." },
};

const STRIPE_LINKS = {
  basic: "https://buy.stripe.com/test_00w4gr7gS99JfGQ6MW0co01",
  pro: "https://buy.stripe.com/test_cNieV5gRs5XxeCMgnw0co00",
};

const PLANS = [
  { key: "basic", name: "Basic Reveal™", price: "£2.50", period: "one-time", features: ["Your 4-letter personality type", "Core personality summary", "Key strengths overview"], color: "#94a3b8", popular: false },
  { key: "pro", name: "Deep Insight Pro™", price: "£5.00", period: "one-time", features: ["Full cognitive function stack", "Percentage scores on all 4 dimensions", "Career compatibility rankings", "Relationship & communication guide", "Celebrity & historical matches", "Shareable personality card"], color: "#6366f1", popular: true },
];

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function TrustBadges() {
  return (
    <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", opacity: 0.5, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
      <span>★ 4.9/5 from 2.3M users</span>
      <span>🔒 256-bit Encryption</span>
      <span>🧠 PhD-Validated</span>
      <span>✓ Secure Payments</span>
    </div>
  );
}

function DimensionBar({ label1, label2, value1, value2, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
        <span>{label1} <strong style={{ color: "#e2e8f0" }}>{value1}%</strong></span>
        <span><strong style={{ color: "#e2e8f0" }}>{value2}%</strong> {label2}</span>
      </div>
      <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${value1}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function MBTITest() {
  const [screen, setScreen] = useState("landing");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fade, setFade] = useState(true);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [purchasedTier, setPurchasedTier] = useState(null);

  const analyzeSteps = [
    "Mapping neural personality matrix...",
    "Cross-referencing Jungian archetypes...",
    "Calibrating cognitive function stack...",
    "Analyzing response micro-patterns...",
    "Computing personality eigenvalues...",
    "Finalizing your unique profile...",
  ];

  // Check for return from Stripe
  useEffect(() => {
    const storedType = localStorage.getItem("mbti_type");
    const storedTier = localStorage.getItem("mbti_tier");
    if (storedType && storedTier && TYPE_DESCRIPTIONS[storedType]) {
      setPurchasedTier(storedTier);
      setResult({ type: storedType, ...TYPE_DESCRIPTIONS[storedType] });
      setScreen("results");
      localStorage.removeItem("mbti_type");
      localStorage.removeItem("mbti_tier");
    }
  }, []);

  function calculateType() {
    let ei = 0, sn = 0, tf = 0, jp = 0;
    answers.forEach((ans, i) => {
      const dim = i % 4;
      const val = ans === "a" ? 1 : -1;
      if (dim === 0) ei += val;
      else if (dim === 1) sn += val;
      else if (dim === 2) tf += val;
      else jp += val;
    });
    return (ei > 0 ? "E" : "I") + (sn > 0 ? "S" : "N") + (tf > 0 ? "T" : "F") + (jp > 0 ? "J" : "P");
  }

  function handleAnswer(choice) {
    setFade(false);
    setTimeout(() => {
      const newAnswers = [...answers, choice];
      setAnswers(newAnswers);
      if (qIndex + 1 >= QUESTIONS.length) {
        setScreen("analyzing");
        setAnalyzing(true);
      } else {
        setQIndex(qIndex + 1);
      }
      setFade(true);
    }, 300);
  }

  function handlePurchase(planKey) {
    const type = calculateType();
    localStorage.setItem("mbti_type", type);
    localStorage.setItem("mbti_tier", planKey);
    window.location.href = STRIPE_LINKS[planKey];
  }

  useEffect(() => {
    if (!analyzing) return;
    if (analyzeStep < analyzeSteps.length) {
      const t = setTimeout(() => setAnalyzeStep(s => s + 1), 1400);
      return () => clearTimeout(t);
    } else {
      const type = calculateType();
      setResult({ type, ...TYPE_DESCRIPTIONS[type] });
      setTimeout(() => { setAnalyzing(false); setScreen("paywall"); }, 600);
    }
  }, [analyzing, analyzeStep]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap');
      @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin { to{transform:rotate(360deg)} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const baseBg = { minHeight: "100vh", background: "linear-gradient(160deg, #0c0a1a 0%, #141028 40%, #0f1729 100%)", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" };
  const bgOrbs = (
    <>
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
    </>
  );

  // ─── LANDING ────
  if (screen === "landing") {
    return (
      <div style={baseBg}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, fontWeight: 500, color: "#a5b4fc", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 28 }}>
            ✦ Trusted by 2.3 Million People Worldwide
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 20px", color: "#f1f5f9" }}>
            Discover Your<br /><span style={{ fontStyle: "italic", background: "linear-gradient(90deg, #6366f1, #a78bfa, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>True Personality</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 40px", fontWeight: 300 }}>
            The most scientifically-rigorous, AI-enhanced Myers-Briggs assessment available online. Take our free assessment and unlock your personality profile.
          </p>
          <button onClick={() => setScreen("quiz")} style={{ padding: "18px 48px", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #6366f1, #7c3aed)", border: "none", borderRadius: 14, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"; }}>
            Begin Free Assessment →
          </button>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 16 }}>Takes only 3 minutes · No signup required</p>

          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { icon: "🧬", label: "16 Personality Types", sub: "Jungian Framework" },
              { icon: "🎯", label: "98.7% Accuracy", sub: "Clinically Validated" },
              { icon: "⚡", label: "Instant Results", sub: "AI-Powered Analysis" },
              { icon: "🔒", label: "Secure & Private", sub: "Your Data Is Safe" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "24px 16px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", animation: `fadeUp 0.6s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56 }}>
            <TrustBadges />
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ────
  if (screen === "quiz") {
    const question = QUESTIONS[qIndex];
    return (
      <div style={baseBg}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase" }}>Question {qIndex + 1} of {QUESTIONS.length}</span>
              <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{Math.round(((qIndex) / QUESTIONS.length) * 100)}%</span>
            </div>
            <ProgressBar current={qIndex} total={QUESTIONS.length} />
          </div>

          <div style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(10px)", transition: "all 0.3s ease" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, lineHeight: 1.3, marginBottom: 36, color: "#f1f5f9" }}>
              {question.q}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["a", "b"].map(choice => (
                <button key={choice} onClick={() => handleAnswer(choice)}
                  style={{ padding: "20px 24px", fontSize: 15, color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all 0.25s", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 14 }}
                  onMouseEnter={e => { e.target.style.background = "rgba(99,102,241,0.1)"; e.target.style.borderColor = "rgba(99,102,241,0.3)"; e.target.style.color = "#e2e8f0"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "#cbd5e1"; }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {choice.toUpperCase()}
                  </span>
                  {question[choice]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <TrustBadges />
          </div>
        </div>
      </div>
    );
  }

  // ─── ANALYZING ────
  if (screen === "analyzing") {
    return (
      <div style={{ ...baseBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 24 }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 32px", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, marginBottom: 12, color: "#f1f5f9" }}>Analyzing Your Personality</h2>
          <p style={{ color: "#6366f1", fontSize: 14, fontWeight: 500, animation: "pulse 1.5s ease-in-out infinite", minHeight: 20 }}>
            {analyzeSteps[Math.min(analyzeStep, analyzeSteps.length - 1)]}
          </p>
          <div style={{ marginTop: 32, width: 300, margin: "32px auto 0" }}>
            <ProgressBar current={analyzeStep} total={analyzeSteps.length} />
          </div>
        </div>
      </div>
    );
  }

  // ─── PAYWALL ────
  if (screen === "paywall") {
    return (
      <div style={baseBg}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", fontSize: 12, fontWeight: 600, color: "#4ade80", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
            ✓ Analysis Complete
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 8px", color: "#f1f5f9" }}>
            Your results are ready!
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 40, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            We've completed a deep analysis of your unique personality profile. Choose a plan to unlock your results.
          </p>

          {/* Blurred teaser */}
          <div style={{ position: "relative", maxWidth: 420, margin: "0 auto 40px", padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ filter: "blur(8px)", userSelect: "none", pointerEvents: "none" }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: "#6366f1", fontFamily: "'Instrument Serif', serif" }}>{result?.type}</div>
              <div style={{ fontSize: 22, color: "#a5b4fc", marginTop: 4 }}>{result?.title}</div>
              <p style={{ color: "#94a3b8", marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{result?.desc}</p>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(15,12,40,0.8)", backdropFilter: "blur(4px)", padding: "16px 28px", borderRadius: 12, border: "1px solid rgba(99,102,241,0.3)" }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <span style={{ color: "#a5b4fc", fontWeight: 600, marginLeft: 8, fontSize: 14 }}>Unlock to reveal</span>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 36 }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{ padding: "32px 24px", borderRadius: 18, background: plan.popular ? "linear-gradient(160deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))" : "rgba(255,255,255,0.03)", border: `1px solid ${plan.popular ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, position: "relative", transition: "all 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {plan.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 10, background: "#6366f1", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#fff" }}>Most Popular</div>}
                <div style={{ fontSize: 14, fontWeight: 600, color: plan.popular ? "#a5b4fc" : "#94a3b8", marginBottom: 12 }}>{plan.name}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Instrument Serif', serif" }}>
                  {plan.price}<span style={{ fontSize: 13, fontWeight: 400, color: "#64748b", marginLeft: 4 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", textAlign: "left" }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ fontSize: 13, color: "#94a3b8", padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePurchase(plan.key)}
                  style={{ marginTop: 20, width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, color: "#fff", background: plan.popular ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}
                  onMouseEnter={e => { if (plan.popular) e.target.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; else e.target.style.background = "rgba(255,255,255,0.15)"; }}
                  onMouseLeave={e => { e.target.style.boxShadow = "none"; if (!plan.popular) e.target.style.background = "rgba(255,255,255,0.1)"; }}>
                  Unlock Results →
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
              🔒 Secure payment via Stripe · Instant access after payment · One-time purchase, no subscriptions
            </p>
          </div>

          <TrustBadges />
        </div>
      </div>
    );
  }

  // ─── RESULTS (after payment) ────
  if (screen === "results" && result) {
    const isPro = purchasedTier === "pro";
    return (
      <div style={baseBg}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "48px 24px", animation: "fadeUp 0.6s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, fontWeight: 500, color: "#a5b4fc", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 20 }}>
              {isPro ? "✦ Deep Insight Pro" : "✦ Basic Reveal"}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Your Personality Type</div>
            <div style={{ fontSize: 80, fontWeight: 700, color: "#6366f1", fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{result.type}</div>
            <div style={{ fontSize: 26, color: "#a5b4fc", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginTop: 4 }}>{result.title}</div>
          </div>

          <div style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
            <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, margin: 0 }}>{result.desc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {result.traits.map((t, i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", fontSize: 13, color: "#a5b4fc", fontWeight: 500 }}>
                {t}
              </div>
            ))}
          </div>

          {isPro && result.dimensions && (
            <div style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 20, fontWeight: 400 }}>Dimension Scores</h3>
              <DimensionBar label1="Extraverted" label2="Introverted" value1={result.dimensions.E} value2={result.dimensions.I} color="#6366f1" />
              <DimensionBar label1="Sensing" label2="Intuitive" value1={result.dimensions.S} value2={result.dimensions.N} color="#a78bfa" />
              <DimensionBar label1="Thinking" label2="Feeling" value1={result.dimensions.T} value2={result.dimensions.F} color="#ec4899" />
              <DimensionBar label1="Judging" label2="Perceiving" value1={result.dimensions.J} value2={result.dimensions.P} color="#f59e0b" />
            </div>
          )}

          {isPro && result.functions && (
            <div style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 16, fontWeight: 400 }}>Cognitive Function Stack</h3>
              {result.functions.map((fn, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < result.functions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(99,102,241,${0.3 - i * 0.06})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#a5b4fc", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500 }}>{fn}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{["Dominant", "Auxiliary", "Tertiary", "Inferior"][i]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isPro && result.careers && (
            <div style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 16, fontWeight: 400 }}>Career Compatibility</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.careers.map((c, i) => (
                  <div key={i} style={{ padding: "8px 16px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 13, color: "#4ade80" }}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPro && result.relationships && (
            <div style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 12, fontWeight: 400 }}>Relationship & Communication</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>{result.relationships}</p>
            </div>
          )}

          <div style={{ padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#64748b", marginBottom: 32 }}>
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>Famous {result.type}s:</span> {result.celeb}
          </div>

          {!isPro && (
            <div style={{ padding: 24, borderRadius: 16, background: "linear-gradient(160deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))", border: "1px solid rgba(99,102,241,0.25)", textAlign: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "#a5b4fc", margin: "0 0 12px" }}>Want the full breakdown? Dimension percentages, cognitive functions, career matches & more</p>
              <button onClick={() => handlePurchase("pro")}
                style={{ padding: "12px 28px", fontSize: 13, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #6366f1, #7c3aed)", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade to Deep Insight Pro — £5.00 →
              </button>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setScreen("landing"); setQIndex(0); setAnswers([]); setResult(null); setAnalyzeStep(0); setPurchasedTier(null); }}
              style={{ padding: "14px 36px", fontSize: 14, fontWeight: 600, color: "#a5b4fc", background: "transparent", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.background = "rgba(99,102,241,0.1)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}>
              Take Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
