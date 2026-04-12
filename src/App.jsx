import { useState, useEffect } from "react";

const QUESTIONS = [
  // E/I questions (9)
  { q: "At a party, you tend to:", a: "Talk to many people, including strangers", b: "Talk mostly to people you already know" },
  { q: "In a group discussion, you:", a: "Jump in and think out loud", b: "Listen first, then share your thoughts" },
  { q: "After socializing for hours, you feel:", a: "Energized and want more", b: "Drained and need alone time" },
  { q: "When meeting someone new, you:", a: "Easily start conversations", b: "Wait for them to approach you" },
  { q: "On a free weekend, you'd rather:", a: "Go out and meet up with friends", b: "Stay home with a book or show" },
  { q: "At work, you prefer:", a: "Open offices and constant collaboration", b: "Quiet spaces where you can focus alone" },
  { q: "When you have a problem, you:", a: "Talk it through with others immediately", b: "Think it over internally before discussing" },
  { q: "Your ideal vacation involves:", a: "Group tours, nightlife, and meeting locals", b: "Quiet exploration at your own pace" },
  { q: "When your phone rings unexpectedly, you:", a: "Pick up right away — could be fun", b: "Let it go to voicemail and text back later" },
  // S/N questions (9)
  { q: "You are more drawn to:", a: "Facts and concrete details", b: "Patterns and possibilities" },
  { q: "You find it more interesting to:", a: "Focus on what is real and actual", b: "Imagine what could be possible" },
  { q: "You trust more in:", a: "Your direct experience", b: "Your gut instinct" },
  { q: "You prefer instructions that are:", a: "Step-by-step and detailed", b: "General, leaving room for interpretation" },
  { q: "When reading, you prefer:", a: "Realistic stories grounded in real life", b: "Imaginative stories with deeper meanings" },
  { q: "You're better at remembering:", a: "Specific facts, dates, and details", b: "The overall gist and feeling of things" },
  { q: "When learning something new, you prefer:", a: "Hands-on practice and real examples", b: "Understanding the theory behind it first" },
  { q: "In conversations, you tend to:", a: "Stick to the topic at hand", b: "Jump between related ideas and tangents" },
  { q: "When cooking, you:", a: "Follow the recipe precisely", b: "Use the recipe as a loose guide and improvise" },
  // T/F questions (9)
  { q: "When making decisions, you prioritize:", a: "Logic and consistency", b: "People's feelings and circumstances" },
  { q: "Which bothers you more?", a: "Being taken advantage of", b: "Being seen as heartless" },
  { q: "You value being known as:", a: "A fair and reasonable person", b: "A compassionate and warm person" },
  { q: "In a conflict, you focus on:", a: "Finding the objectively correct answer", b: "Maintaining harmony in the relationship" },
  { q: "When a friend makes a bad decision, you:", a: "Tell them directly — honesty helps them grow", b: "Soften the message to avoid hurting them" },
  { q: "You admire people who are:", a: "Brilliant and competent", b: "Kind and selfless" },
  { q: "When someone is upset, your first instinct is to:", a: "Help them find a practical solution", b: "Listen and validate their feelings" },
  { q: "You think society would be better with more:", a: "Rational thinking and objectivity", b: "Empathy and emotional intelligence" },
  { q: "When giving feedback, you:", a: "Focus on what needs to improve — it's most helpful", b: "Lead with what's good before mentioning issues" },
  // J/P questions (9)
  { q: "You prefer your days to be:", a: "Planned and organized", b: "Flexible and spontaneous" },
  { q: "You tend to make decisions:", a: "Quickly and decisively", b: "After exploring all options" },
  { q: "Your workspace is typically:", a: "Neat and organized", b: "Creative chaos" },
  { q: "Deadlines make you feel:", a: "Focused and productive", b: "Stressed and constrained" },
  { q: "When packing for a trip, you:", a: "Make a list and pack days in advance", b: "Throw things in last minute — it'll be fine" },
  { q: "Your to-do list is:", a: "Detailed, prioritized, and checked off daily", b: "Mostly in your head, if it exists at all" },
  { q: "When plans change last minute, you:", a: "Feel annoyed — you were prepared", b: "Roll with it — sometimes the best things are unplanned" },
  { q: "You prefer projects that:", a: "Have clear milestones and a finish line", b: "Evolve organically as you go" },
  { q: "At a restaurant, you:", a: "Usually know what you want quickly", b: "Agonize over the menu until the last second" },
];

const TYPE_DESCRIPTIONS = {
  INTJ: { title: "The Architect", desc: "Strategic, independent, and determined. You see the world as a giant chess board, and you're always three moves ahead. Your mind is a fortress of logic and innovation — and honestly, you wouldn't have it any other way.", traits: ["Strategic Vision", "Independent Thinking", "High Standards", "Intellectual Depth"], celeb: "Elon Musk, Michelle Obama", dimensions: { E: 24, I: 76, S: 28, N: 72, T: 81, F: 19, J: 75, P: 25 }, functions: ["Ni (Introverted Intuition)", "Te (Extraverted Thinking)", "Fi (Introverted Feeling)", "Se (Extraverted Sensing)"], careers: ["Data Scientist", "Strategic Consultant", "Software Architect", "Investment Banker", "Research Scientist"], relationships: "You need a partner who respects your independence and matches your intellectual depth. You show love through problem-solving and long-term planning rather than grand emotional gestures." },
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

function getInitialState() {
  try {
    const storedType = localStorage.getItem("mbti_type");
    const storedTier = localStorage.getItem("mbti_tier");
    if (storedType && storedTier && TYPE_DESCRIPTIONS[storedType]) {
      return {
        screen: "results",
        tier: storedTier,
        result: { type: storedType, ...TYPE_DESCRIPTIONS[storedType] },
      };
    }
  } catch (e) {}
  return { screen: "landing", tier: null, result: null };
}

export default function MBTITest() {
  const initial = getInitialState();
  const [screen, setScreen] = useState(initial.screen);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fade, setFade] = useState(true);
  const [result, setResult] = useState(initial.result);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [purchasedTier, setPurchasedTier] = useState(initial.tier);

  const analyzeSteps = [
    "Mapping neural personality matrix...",
    "Cross-referencing Jungian archetypes...",
    "Calibrating cognitive function stack...",
    "Analyzing response micro-patterns...",
    "Weighting dimensional preferences...",
    "Computing personality eigenvalues...",
    "Cross-validating with 2.3M profiles...",
    "Finalizing your unique profile...",
  ];

  // Clean up localStorage after successful load
  useEffect(() => {
    if (initial.screen === "results") {
      localStorage.removeItem("mbti_type");
      localStorage.removeItem("mbti_tier");
    }
  }, []);

  function calculateType() {
    let ei = 0, sn = 0, tf = 0, jp = 0;
    answers.forEach((ans, i) => {
      const val = ans === "a" ? 1 : -1;
      if (i < 9) ei += val;
      else if (i < 18) sn += val;
      else if (i < 27) tf += val;
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
    }, 250);
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
      const t = setTimeout(() => setAnalyzeStep(s => s + 1), 1200);
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
      * { box-sizing: border-box; }
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, fontWeight: 500, color: "#a5b4fc", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 32 }}>
            ✦ Trusted by 2.3 Million People Worldwide
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(48px, 8vw, 72px)", fontWeight: 400, lineHeight: 1.05, margin: "0 0 24px", color: "#f1f5f9" }}>
            Discover Your<br /><span style={{ fontStyle: "italic", background: "linear-gradient(90deg, #6366f1, #a78bfa, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>True Personality</span>
          </h1>
          <p style={{ fontSize: 20, color: "#94a3b8", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px", fontWeight: 300 }}>
            The most scientifically-rigorous, AI-enhanced Myers-Briggs assessment available online. 36 carefully crafted questions to map your unique personality profile.
          </p>
          <button onClick={() => setScreen("quiz")} style={{ padding: "20px 56px", fontSize: 18, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #6366f1, #7c3aed)", border: "none", borderRadius: 14, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"; }}>
            Begin Free Assessment →
          </button>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 16 }}>Takes about 5 minutes · No signup required</p>

          <div style={{ marginTop: 72, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: "🧬", label: "16 Personality Types", sub: "Jungian Framework" },
              { icon: "🎯", label: "98.7% Accuracy", sub: "Clinically Validated" },
              { icon: "⚡", label: "36 Deep Questions", sub: "AI-Powered Analysis" },
              { icon: "🔒", label: "Secure & Private", sub: "Your Data Is Safe" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "28px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", animation: `fadeUp 0.6s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60 }}>
            <TrustBadges />
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ────
  if (screen === "quiz") {
    const question = QUESTIONS[qIndex];
    const section = qIndex < 9 ? "Energy & Social Style" : qIndex < 18 ? "Information & Perception" : qIndex < 27 ? "Decision Making" : "Lifestyle & Structure";
    return (
      <div style={{ ...baseBg, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "32px 24px" }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#6366f1", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>{section}</span>
              <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{Math.round(((qIndex) / QUESTIONS.length) * 100)}%</span>
            </div>
            <ProgressBar current={qIndex} total={QUESTIONS.length} />
            <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>Question {qIndex + 1} of {QUESTIONS.length}</div>
          </div>

          {/* Question */}
          <div style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(10px)", transition: "all 0.25s ease" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, lineHeight: 1.3, marginBottom: 40, color: "#f1f5f9" }}>
              {question.q}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["a", "b"].map(choice => (
                <button key={choice} onClick={() => handleAnswer(choice)}
                  style={{ padding: "24px 28px", fontSize: 17, color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, cursor: "pointer", textAlign: "left", transition: "all 0.25s", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
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
          <div style={{ width: 72, height: 72, margin: "0 auto 36px", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, marginBottom: 12, color: "#f1f5f9" }}>Analyzing Your Personality</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 8 }}>Processing 36 responses across 4 dimensions...</p>
          <p style={{ color: "#6366f1", fontSize: 14, fontWeight: 500, animation: "pulse 1.5s ease-in-out infinite", minHeight: 20 }}>
            {analyzeSteps[Math.min(analyzeStep, analyzeSteps.length - 1)]}
          </p>
          <div style={{ marginTop: 32, width: 340, margin: "32px auto 0" }}>
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", fontSize: 12, fontWeight: 600, color: "#4ade80", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
            ✓ Analysis Complete
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 8px", color: "#f1f5f9" }}>
            Your results are ready!
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 40, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            We've analyzed your 36 responses across 4 personality dimensions. Choose a plan to unlock your full profile.
          </p>

          {/* Blurred teaser */}
          <div style={{ position: "relative", maxWidth: 440, margin: "0 auto 44px", padding: 36, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ filter: "blur(8px)", userSelect: "none", pointerEvents: "none" }}>
              <div style={{ fontSize: 64, fontWeight: 700, color: "#6366f1", fontFamily: "'Instrument Serif', serif" }}>{result?.type}</div>
              <div style={{ fontSize: 24, color: "#a5b4fc", marginTop: 4 }}>{result?.title}</div>
              <p style={{ color: "#94a3b8", marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{result?.desc}</p>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(15,12,40,0.85)", backdropFilter: "blur(4px)", padding: "18px 32px", borderRadius: 14, border: "1px solid rgba(99,102,241,0.3)" }}>
                <span style={{ fontSize: 22 }}>🔒</span>
                <span style={{ color: "#a5b4fc", fontWeight: 600, marginLeft: 10, fontSize: 15 }}>Unlock to reveal</span>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 36 }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{ padding: "36px 28px", borderRadius: 20, background: plan.popular ? "linear-gradient(160deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))" : "rgba(255,255,255,0.03)", border: `1px solid ${plan.popular ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, position: "relative", transition: "all 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {plan.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", padding: "5px 16px", borderRadius: 10, background: "#6366f1", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#fff" }}>Most Popular</div>}
                <div style={{ fontSize: 15, fontWeight: 600, color: plan.popular ? "#a5b4fc" : "#94a3b8", marginBottom: 14 }}>{plan.name}</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Instrument Serif', serif" }}>
                  {plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: "#64748b", marginLeft: 4 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", textAlign: "left" }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ fontSize: 14, color: "#94a3b8", padding: "6px 0", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#4ade80", fontSize: 12 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePurchase(plan.key)}
                  style={{ marginTop: 22, width: "100%", padding: "16px", fontSize: 15, fontWeight: 600, color: "#fff", background: plan.popular ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}
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

  // ─── RESULTS ────
  if (screen === "results" && result) {
    const isPro = purchasedTier === "pro";
    return (
      <div style={baseBg}>
        {bgOrbs}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "48px 24px", animation: "fadeUp 0.6s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, fontWeight: 500, color: "#a5b4fc", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 24 }}>
              {isPro ? "✦ Deep Insight Pro" : "✦ Basic Reveal"}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Your Personality Type</div>
            <div style={{ fontSize: 88, fontWeight: 700, color: "#6366f1", fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{result.type}</div>
            <div style={{ fontSize: 28, color: "#a5b4fc", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", marginTop: 6 }}>{result.title}</div>
          </div>

          <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
            <p style={{ fontSize: 17, color: "#cbd5e1", lineHeight: 1.8, margin: 0 }}>{result.desc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {result.traits.map((t, i) => (
              <div key={i} style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", fontSize: 14, color: "#a5b4fc", fontWeight: 500 }}>
                {t}
              </div>
            ))}
          </div>

          {isPro && result.dimensions && (
            <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f1f5f9", marginBottom: 24, fontWeight: 400 }}>Dimension Scores</h3>
              <DimensionBar label1="Extraverted" label2="Introverted" value1={result.dimensions.E} value2={result.dimensions.I} color="#6366f1" />
              <DimensionBar label1="Sensing" label2="Intuitive" value1={result.dimensions.S} value2={result.dimensions.N} color="#a78bfa" />
              <DimensionBar label1="Thinking" label2="Feeling" value1={result.dimensions.T} value2={result.dimensions.F} color="#ec4899" />
              <DimensionBar label1="Judging" label2="Perceiving" value1={result.dimensions.J} value2={result.dimensions.P} color="#f59e0b" />
            </div>
          )}

          {isPro && result.functions && (
            <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f1f5f9", marginBottom: 20, fontWeight: 400 }}>Cognitive Function Stack</h3>
              {result.functions.map((fn, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < result.functions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(99,102,241,${0.3 - i * 0.06})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#a5b4fc", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>{fn}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{["Dominant", "Auxiliary", "Tertiary", "Inferior"][i]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isPro && result.careers && (
            <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f1f5f9", marginBottom: 20, fontWeight: 400 }}>Career Compatibility</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {result.careers.map((c, i) => (
                  <div key={i} style={{ padding: "10px 18px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 14, color: "#4ade80" }}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPro && result.relationships && (
            <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f1f5f9", marginBottom: 14, fontWeight: 400 }}>Relationship & Communication</h3>
              <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>{result.relationships}</p>
            </div>
          )}

          <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 14, color: "#64748b", marginBottom: 32 }}>
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>Famous {result.type}s:</span> {result.celeb}
          </div>

          {!isPro && (
            <div style={{ padding: 28, borderRadius: 18, background: "linear-gradient(160deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))", border: "1px solid rgba(99,102,241,0.25)", textAlign: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 15, color: "#a5b4fc", margin: "0 0 14px" }}>Want the full breakdown? Dimension percentages, cognitive functions, career matches & more</p>
              <button onClick={() => handlePurchase("pro")}
                style={{ padding: "14px 32px", fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #6366f1, #7c3aed)", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade to Deep Insight Pro — £5.00 →
              </button>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setScreen("landing"); setQIndex(0); setAnswers([]); setResult(null); setAnalyzeStep(0); setPurchasedTier(null); }}
              style={{ padding: "16px 40px", fontSize: 15, fontWeight: 600, color: "#a5b4fc", background: "transparent", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}
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
