import { useState, useRef, useEffect, useCallback } from "react";

/* ─── GOOGLE FONTS ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

/* ─── GLOBAL STYLES ─── */
const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #050508; font-family: 'Exo 2', sans-serif; color: #e2f0ff; overflow: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0a0a18; }
  ::-webkit-scrollbar-thumb { background: #00c8ff44; border-radius: 4px; }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes neon-flicker {
    0%,19%,21%,23%,25%,54%,56%,100% { text-shadow: 0 0 8px #00c8ff, 0 0 20px #00c8ff, 0 0 40px #0080ff; }
    20%,24%,55% { text-shadow: none; }
  }
  @keyframes float-up {
    0% { transform: translateY(40px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes spin-logo {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    60% { transform: scale(1.15) rotate(10deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes progress-bar {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  @keyframes corner-pulse {
    0%,100% { border-color: #00c8ff; box-shadow: 0 0 8px #00c8ff; }
    50% { border-color: #0080ff; box-shadow: 0 0 20px #0080ff; }
  }
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes glow-btn {
    0%,100% { box-shadow: 0 0 12px #00c8ff88, inset 0 0 12px #00c8ff11; }
    50% { box-shadow: 0 0 28px #00c8ffcc, inset 0 0 20px #00c8ff22; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  @keyframes badge-pop {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .neon-text { animation: neon-flicker 5s infinite; }
  .float-anim { animation: float-up 0.5s ease forwards; }
  .glow-btn { animation: glow-btn 2.5s ease infinite; }
  .scan-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

/* ─── CONSTANTS ─── */
const C = {
  bg: "#050508",
  surface: "#0b0b1a",
  card: "#10102a",
  cardHi: "#14143a",
  border: "#1e1e4a",
  neon: "#00c8ff",
  neon2: "#0070ff",
  neonGlow: "#00c8ff44",
  text: "#e2f0ff",
  muted: "#6b7fa8",
  danger: "#ff4466",
  success: "#00ffaa",
  warn: "#ffaa00",
};

/* ─── ICONS (SVG Inline) ─── */
const Ico = {
  camera: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  crop: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>,
  filter: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  pdf: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  history: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>,
  share: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  lock: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  sign: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  water: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  moon: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  compress: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>,
  wifi_off: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  check: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  edit: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  back: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  close: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  drag: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
  quality: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  bright: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  plus: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  whatsapp: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  email: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  drive: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l3.75 6.5h14.2l3.75-6.5L16.29 3.5zm.58 1h7.42l5.5 9.5h-5.5L12 19.5l-3.21-5.5H3.29z"/></svg>,
};

/* ─── TOAST COMPONENT ─── */
function Toast({ msg, onHide }) {
  useEffect(() => { const t = setTimeout(onHide, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.card},${C.cardHi})`, border:`1px solid ${C.neon}44`, borderRadius:12, padding:"10px 22px", color:C.neon, fontSize:13, fontFamily:"'Exo 2',sans-serif", fontWeight:600, zIndex:9999, boxShadow:`0 0 20px ${C.neonGlow}`, animation:"float-up 0.3s ease", whiteSpace:"nowrap" }}>
      {msg}
    </div>
  );
}

/* ─── SPLASH SCREEN ─── */
function SplashScreen({ onDone }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let v = 0;
    const iv = setInterval(() => {
      v += Math.random() * 4 + 2;
      if (v >= 100) { v = 100; clearInterval(iv); setTimeout(onDone, 400); }
      setProg(Math.min(v, 100));
    }, 60);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999, overflow:"hidden" }}>
      {/* Scanline effect */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.neon},transparent)`, animation:"scanline 2.5s linear infinite", opacity:0.5 }} />
      {/* Grid bg */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border}22 1px,transparent 1px),linear-gradient(90deg,${C.border}22 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity:0.6 }} />
      {/* Logo */}
      <div style={{ animation:"spin-logo 1s cubic-bezier(.34,1.56,.64,1) forwards", marginBottom:24 }}>
        <div style={{ width:100, height:100, borderRadius:28, background:`linear-gradient(135deg,${C.neon2},${C.neon})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 40px ${C.neon}88, 0 0 80px ${C.neon}44` }}>
          <svg width={52} height={52} viewBox="0 0 24 24" fill="white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4" fill="#0070ff"/></svg>
        </div>
      </div>
      {/* Title */}
      <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:26, fontWeight:900, color:C.neon, letterSpacing:2, animation:"float-up 0.8s 0.5s ease both", textShadow:`0 0 20px ${C.neon}` }}>SMART SCAN</h1>
      <p style={{ color:C.muted, fontSize:13, marginTop:6, letterSpacing:3, animation:"float-up 0.8s 0.7s ease both" }}>PHOTO  TO  PDF  PRO</p>
      {/* Progress */}
      <div style={{ width:220, marginTop:48, animation:"float-up 0.8s 0.9s ease both" }}>
        <div style={{ height:3, background:C.border, borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${prog}%`, background:`linear-gradient(90deg,${C.neon2},${C.neon})`, transition:"width 0.08s linear", boxShadow:`0 0 10px ${C.neon}` }} />
        </div>
        <div style={{ textAlign:"center", marginTop:10, color:C.muted, fontSize:12, fontFamily:"'Orbitron',sans-serif" }}>{Math.round(prog)}%</div>
      </div>
      <p style={{ position:"absolute", bottom:30, color:C.border, fontSize:11, letterSpacing:2, fontFamily:"'Orbitron',sans-serif" }}>v2.0 PREMIUM</p>
    </div>
  );
}

/* ─── CAMERA SCREEN ─── */
function CameraScreen({ onCapture, onBack }) {
  const [captured, setCaptured] = useState(false);
  const [flash, setFlash] = useState(false);
  const [pages, setPages] = useState([]);
  const docs = ["📄 Invoice_2024.jpg","📑 Aadhaar_Card.jpg","📋 Marksheet.jpg","🗒️ Contract_Page.jpg"];

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    const newPage = { id: Date.now(), label: docs[pages.length % docs.length], thumb: pages.length };
    setPages(p => [...p, newPage]);
    setCaptured(true);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      {/* Viewfinder */}
      <div style={{ position:"relative", flex:1, background:"#000", overflow:"hidden" }}>
        {flash && <div style={{ position:"absolute", inset:0, background:"white", zIndex:10, opacity:0.8 }} />}
        {/* Fake camera background */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(135deg, #0a1a2a 0%, #050508 50%, #0a0a20 100%)` }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle at 30% 40%, #001a3344 0%, transparent 60%), radial-gradient(circle at 70% 60%, #0a00330 0%, transparent 50%)` }} />
        {/* Scanline overlay */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1.5, background:`linear-gradient(90deg,transparent,${C.neon}88,transparent)`, animation:"scanline 2s linear infinite" }} />
        {/* Corner guides */}
        {[{t:20,l:20,tr:"tl"},{t:20,r:20,tr:"tr"},{b:20,l:20,tr:"bl"},{b:20,r:20,tr:"br"}].map((c,i) => (
          <div key={i} style={{ position:"absolute", width:32, height:32, ...c, animation:"corner-pulse 2s infinite" }}>
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:3, background:C.neon, boxShadow:`0 0 8px ${C.neon}` }} />
            <div style={{ position:"absolute", top:0, left:0, height:"100%", width:3, background:C.neon, boxShadow:`0 0 8px ${C.neon}` }} />
          </div>
        ))}
        {/* Document outline */}
        <div style={{ position:"absolute", top:"15%", left:"8%", right:"8%", bottom:"20%", border:`2px solid ${C.neon}55`, borderRadius:4 }}>
          <div style={{ position:"absolute", inset:0, background:`${C.neon}06` }} />
          {/* Fake doc content */}
          <div style={{ margin:20, opacity:0.3 }}>
            {[80,60,90,55,70,45].map((w,i) => <div key={i} style={{ height:2, background:C.neon, width:`${w}%`, marginBottom:10, borderRadius:2 }} />)}
          </div>
        </div>
        {/* Top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(#000a,transparent)" }}>
          <button onClick={onBack} style={{ background:`${C.card}aa`, border:`1px solid ${C.border}`, borderRadius:10, padding:"6px 14px", color:C.text, display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13 }}>
            {Ico.back(16)} Back
          </button>
          <div style={{ background:`${C.neon}22`, border:`1px solid ${C.neon}44`, borderRadius:8, padding:"4px 12px", color:C.neon, fontSize:12, fontFamily:"'Orbitron',sans-serif" }}>
            AUTO DETECT
          </div>
          <div style={{ color:C.neon, fontSize:13, fontFamily:"'Orbitron',sans-serif" }}>{pages.length}pg</div>
        </div>
        {/* Pages strip */}
        {pages.length > 0 && (
          <div style={{ position:"absolute", bottom:90, left:0, right:0, padding:"0 16px", display:"flex", gap:8, overflowX:"auto" }}>
            {pages.map((p, i) => (
              <div key={p.id} style={{ minWidth:48, height:64, background:`linear-gradient(135deg,${C.card},${C.cardHi})`, borderRadius:6, border:`2px solid ${C.neon}66`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.neon, fontFamily:"'Orbitron',sans-serif", flexShrink:0 }}>
                P{i+1}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Capture bar */}
      <div style={{ background:C.surface, padding:"20px 0 28px", display:"flex", alignItems:"center", justifyContent:"center", gap:40 }}>
        <div style={{ width:44, height:44, borderRadius:"50%", border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, cursor:"pointer" }}>
          {Ico.filter(20)}
        </div>
        {/* Main capture button */}
        <button onClick={handleCapture} className="glow-btn" style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:`2px solid ${C.neon}44`, animation:"pulse-ring 1.5s infinite" }} />
          {Ico.camera(28)}
        </button>
        {pages.length > 0 ? (
          <button onClick={() => onCapture(pages)} style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", cursor:"pointer", color:"white", fontSize:11, fontFamily:"'Orbitron',sans-serif", fontWeight:700 }}>
            DONE
          </button>
        ) : (
          <div style={{ width:44, height:44, borderRadius:"50%", border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.muted }}>
            {Ico.bright(20)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EDGE DETECTION / CROP SCREEN ─── */
function CropScreen({ onDone, onBack }) {
  const [corners, setCorners] = useState({ tl:{x:12,y:12}, tr:{x:88,y:12}, br:{x:88,y:88}, bl:{x:12,y:88} });
  const [dragging, setDragging] = useState(null);
  const boxRef = useRef();

  const handlePointerDown = (corner) => (e) => { e.preventDefault(); setDragging(corner); };
  const handlePointerMove = useCallback((e) => {
    if (!dragging || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;
    setCorners(c => ({ ...c, [dragging]: { x: Math.max(5, Math.min(95, cx)), y: Math.max(5, Math.min(95, cy)) } }));
  }, [dragging]);
  const handlePointerUp = () => setDragging(null);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.text, cursor:"pointer" }}>{Ico.back()}</button>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:C.neon }}>EDGE DETECTION</span>
        <span style={{ marginLeft:"auto", color:C.muted, fontSize:12 }}>Drag corners to adjust</span>
      </div>
      {/* Crop area */}
      <div ref={boxRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} style={{ flex:1, position:"relative", margin:16, background:`linear-gradient(135deg,#0a1020,#050515)`, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}`, cursor:"crosshair" }}>
        {/* Fake document */}
        <div style={{ position:"absolute", top:"8%", left:"6%", right:"6%", bottom:"8%", background:"#0d1a2d", borderRadius:4 }}>
          {[85,65,90,70,80,55,75,60].map((w,i) => <div key={i} style={{ height:3, background:`${C.neon}33`, width:`${w}%`, margin:"12px 12px 0", borderRadius:2 }} />)}
        </div>
        {/* Overlay mask */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
          <defs>
            <mask id="cropMask">
              <rect width="100%" height="100%" fill="white" />
              <polygon points={`${corners.tl.x}%,${corners.tl.y}% ${corners.tr.x}%,${corners.tr.y}% ${corners.br.x}%,${corners.br.y}% ${corners.bl.x}%,${corners.bl.y}%`} fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#00000088" mask="url(#cropMask)" />
          <polygon points={`${corners.tl.x}%,${corners.tl.y}% ${corners.tr.x}%,${corners.tr.y}% ${corners.br.x}%,${corners.br.y}% ${corners.bl.x}%,${corners.bl.y}%`} fill="none" stroke={C.neon} strokeWidth="2" style={{ filter:`drop-shadow(0 0 6px ${C.neon})` }} />
          {/* Grid lines inside crop */}
          {[33,67].map(p => (
            <g key={p}>
              <line x1={`${corners.tl.x + (corners.tr.x-corners.tl.x)*p/100}%`} y1={`${corners.tl.y + (corners.bl.y-corners.tl.y)*p/100}%`}
                x2={`${corners.bl.x + (corners.br.x-corners.bl.x)*p/100}%`} y2={`${corners.bl.y + (corners.br.y-corners.bl.y)/100}%`}
                stroke={`${C.neon}33`} strokeWidth="1" />
            </g>
          ))}
        </svg>
        {/* Corner handles */}
        {Object.entries(corners).map(([key, pos]) => (
          <div key={key} onPointerDown={handlePointerDown(key)} style={{ position:"absolute", left:`calc(${pos.x}% - 14px)`, top:`calc(${pos.y}% - 14px)`, width:28, height:28, borderRadius:"50%", background:C.neon, border:`3px solid white`, cursor:"grab", zIndex:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 16px ${C.neon}`, touchAction:"none" }} />
        ))}
      </div>
      {/* Actions */}
      <div style={{ padding:"0 16px 24px", display:"flex", gap:12 }}>
        <button onClick={() => setCorners({tl:{x:10,y:10},tr:{x:90,y:10},br:{x:90,y:90},bl:{x:10,y:90}})} style={{ flex:1, padding:"12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>Auto Detect</button>
        <button onClick={onDone} style={{ flex:2, padding:"12px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:12, color:"white", cursor:"pointer", fontSize:14, fontFamily:"'Exo 2',sans-serif", fontWeight:700, boxShadow:`0 4px 20px ${C.neonGlow}` }}>Apply Crop →</button>
      </div>
    </div>
  );
}

/* ─── SMART FILTERS SCREEN ─── */
function FiltersScreen({ onBack, onApply }) {
  const [active, setActive] = useState("original");
  const [brightness, setBrightness] = useState(50);
  const [sharpen, setSharpen] = useState(40);
  const filters = [
    { id:"original", label:"Original", icon:"🎨", css:"none" },
    { id:"bw", label:"B&W", icon:"⬛", css:"grayscale(1) contrast(1.1)" },
    { id:"highcontrast", label:"Hi-Contrast", icon:"🔆", css:"contrast(1.8) grayscale(0.3)" },
    { id:"enhance", label:"Enhance", icon:"✨", css:"saturate(1.5) brightness(1.1) contrast(1.1)" },
    { id:"scan", label:"Scan", icon:"📄", css:"grayscale(1) contrast(2) brightness(1.1)" },
  ];

  const previewStyle = { filter: filters.find(f=>f.id===active)?.css !== "none" ? filters.find(f=>f.id===active)?.css : `brightness(${0.7+brightness*0.006}) contrast(${1+sharpen*0.008})` };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.text, cursor:"pointer" }}>{Ico.back()}</button>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:C.neon }}>SMART FILTERS</span>
      </div>
      {/* Preview */}
      <div style={{ margin:16, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}`, height:200, background:"#0a1020", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ width:"80%", height:"85%", background:"#f5f0e8", borderRadius:4, ...previewStyle, position:"relative", overflow:"hidden" }}>
          {[80,60,90,55,75,65,85,50].map((w,i) => <div key={i} style={{ height:4, background:"#333", width:`${w}%`, margin:"10px 14px 0", borderRadius:2, opacity:0.7 }} />)}
          <div style={{ position:"absolute", bottom:12, right:12, width:40, height:20, background:"#0070ff", borderRadius:4, opacity:0.6 }} />
        </div>
      </div>
      {/* Filter chips */}
      <div style={{ padding:"0 16px", display:"flex", gap:10, overflowX:"auto", paddingBottom:12 }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setActive(f.id)} style={{ minWidth:82, padding:"10px 0", background: active===f.id ? `linear-gradient(135deg,${C.neon2},${C.neon})` : C.card, border: active===f.id ? "none" : `1px solid ${C.border}`, borderRadius:12, color: active===f.id ? "white" : C.muted, cursor:"pointer", fontSize:11, fontFamily:"'Exo 2',sans-serif", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:20 }}>{f.icon}</span>
            <span style={{ fontWeight:600 }}>{f.label}</span>
          </button>
        ))}
      </div>
      {/* Sliders */}
      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:16 }}>
        {[{ label:"Brightness", val:brightness, set:setBrightness, icon:"☀️" }, { label:"Sharpen", val:sharpen, set:setSharpen, icon:"🔍" }].map(s => (
          <div key={s.label}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:C.text, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>{s.icon} {s.label}</span>
              <span style={{ color:C.neon, fontSize:13, fontFamily:"'Orbitron',sans-serif" }}>{s.val}</span>
            </div>
            <input type="range" min={0} max={100} value={s.val} onChange={e=>s.set(+e.target.value)} style={{ width:"100%", accentColor:C.neon, cursor:"pointer" }} />
          </div>
        ))}
      </div>
      <div style={{ padding:"16px 16px 24px", marginTop:"auto" }}>
        <button onClick={onApply} style={{ width:"100%", padding:"14px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:14, color:"white", fontSize:15, fontFamily:"'Exo 2',sans-serif", fontWeight:700, cursor:"pointer", boxShadow:`0 4px 24px ${C.neonGlow}` }}>
          ✨ Apply Filter
        </button>
      </div>
    </div>
  );
}

/* ─── PDF BUILDER SCREEN ─── */
function PDFBuilderScreen({ pages: initPages = [], onBack, onGenerate, toast }) {
  const [pages, setPages] = useState(initPages.length ? initPages : [
    {id:1,label:"Invoice 2024",thumb:0},{id:2,label:"Aadhaar Card",thumb:1},{id:3,label:"Marksheet",thumb:2},
  ]);
  const [quality, setQuality] = useState("medium");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [watermark, setWatermark] = useState("");
  const [showWm, setShowWm] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("pages");
  const colors = [C.neon, "#ff6b6b", "#ffd93d", "#6bcb77", "#a855f7"];
  const qualOpts = [{id:"low",label:"Low",size:"~800KB",icon:"📦"},{id:"medium",label:"Medium",size:"~2MB",icon:"⚖️"},{id:"high",label:"High",size:"~8MB",icon:"💎"}];

  const handleDragStart = (i) => setDragIdx(i);
  const handleDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const handleDrop = (i) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const arr = [...pages];
    const [moved] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, moved);
    setPages(arr);
    setDragIdx(null); setOverIdx(null);
  };

  const thumbColors = ["#1a2a4a","#2a1a3a","#1a3a2a","#3a2a1a","#1a3a3a"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.text, cursor:"pointer" }}>{Ico.back()}</button>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:C.neon }}>PDF BUILDER</span>
        <span style={{ marginLeft:"auto", background:`${C.neon}22`, border:`1px solid ${C.neon}44`, borderRadius:6, padding:"3px 10px", color:C.neon, fontSize:11, fontFamily:"'Orbitron',sans-serif" }}>{pages.length} PG</span>
      </div>
      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
        {[{id:"pages",label:"Pages"},{id:"quality",label:"Quality"},{id:"security",label:"Security"},{id:"tools",label:"Tools"}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex:1, padding:"10px 4px", background:"none", border:"none", borderBottom: activeTab===t.id ? `2px solid ${C.neon}` : "2px solid transparent", color: activeTab===t.id ? C.neon : C.muted, fontSize:11, fontFamily:"'Orbitron',sans-serif", cursor:"pointer", marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {/* PAGES TAB */}
        {activeTab === "pages" && (
          <>
            {/* Page preview slider */}
            <div style={{ marginBottom:16, background:C.card, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}` }}>
              <div style={{ padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:C.muted, fontSize:12 }}>Preview — Page {currentPage+1}/{pages.length}</span>
                <div style={{ display:"flex", gap:8 }}>
                  {pages.map((_,i) => <div key={i} onClick={() => setCurrentPage(i)} style={{ width:8, height:8, borderRadius:"50%", background: currentPage===i ? C.neon : C.border, cursor:"pointer", boxShadow: currentPage===i ? `0 0 6px ${C.neon}` : "none" }} />)}
                </div>
              </div>
              <div style={{ height:140, background:thumbColors[currentPage%5], display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                {[70,55,80,60,50].map((w,i) => <div key={i} style={{ position:"absolute", height:3, background:`${C.neon}44`, width:`${w}%`, top:`${20+i*16}%`, borderRadius:2 }} />)}
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, color:`${C.neon}44`, position:"absolute", bottom:12, right:16 }}>P{currentPage+1}</span>
              </div>
            </div>
            {/* Drag & Drop reorder */}
            <p style={{ color:C.muted, fontSize:11, marginBottom:10, textAlign:"center" }}>⟵ Drag to reorder pages ⟶</p>
            {pages.map((p, i) => (
              <div key={p.id} draggable onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e,i)} onDrop={() => handleDrop(i)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", marginBottom:8, background: overIdx===i ? `${C.neon}11` : C.card, border:`1px solid ${overIdx===i ? C.neon : C.border}`, borderRadius:10, cursor:"grab", transition:"all 0.15s", opacity: dragIdx===i ? 0.4 : 1, animation:"slide-up 0.3s ease" }}>
                <span style={{ color:C.muted }}>{Ico.drag(18)}</span>
                <div style={{ width:36, height:46, background:thumbColors[i%5], borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:C.neon }}>P{i+1}</span>
                </div>
                <span style={{ flex:1, color:C.text, fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>{p.label}</span>
                <button onClick={() => setPages(ps => ps.filter((_,j) => j!==i))} style={{ background:"none", border:"none", color:C.danger, cursor:"pointer", padding:4 }}>{Ico.trash()}</button>
              </div>
            ))}
            <button onClick={() => { const l=["New Page","Extra Page","Appendix","Annex"]; setPages(p=>[...p,{id:Date.now(),label:l[p.length%4],thumb:p.length}]); }} style={{ width:"100%", padding:"10px", background:"none", border:`2px dashed ${C.border}`, borderRadius:10, color:C.muted, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {Ico.plus(18)} Add Page
            </button>
          </>
        )}

        {/* QUALITY TAB */}
        {activeTab === "quality" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <p style={{ color:C.muted, fontSize:13, marginBottom:4 }}>Select output quality:</p>
            {qualOpts.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px", background: quality===q.id ? `linear-gradient(135deg,${C.neon2}22,${C.neon}22)` : C.card, border:`2px solid ${quality===q.id ? C.neon : C.border}`, borderRadius:14, cursor:"pointer", transition:"all 0.2s", textAlign:"left" }}>
                <span style={{ fontSize:28 }}>{q.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:quality===q.id?C.neon:C.text, fontWeight:700, fontSize:15, fontFamily:"'Exo 2',sans-serif" }}>{q.label} Quality</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:3 }}>Est. file size: {q.size}</div>
                </div>
                {quality===q.id && <span style={{ color:C.neon }}>{Ico.check()}</span>}
              </button>
            ))}
            {/* Compression indicator */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginTop:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                {Ico.compress(18)}
                <span style={{ color:C.text, fontSize:13, fontWeight:600 }}>Auto Compression</span>
                <span style={{ marginLeft:"auto", background:`${C.success}22`, color:C.success, fontSize:11, padding:"2px 8px", borderRadius:6 }}>ACTIVE</span>
              </div>
              {[{label:"Original Size",val:"12.4 MB",color:C.muted},{label:"Compressed",val:quality==="low"?"1.8 MB":quality==="medium"?"3.2 MB":"9.1 MB",color:C.neon},{label:"Saved",val:quality==="low"?"85%":quality==="medium"?"74%":"27%",color:C.success}].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.muted, fontSize:12 }}>{r.label}</span>
                  <span style={{ color:r.color, fontSize:13, fontFamily:"'Orbitron',sans-serif" }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Password */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                {Ico.lock(20)}
                <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>Password Protect</span>
                <label style={{ marginLeft:"auto", display:"flex", alignItems:"center", cursor:"pointer" }}>
                  <input type="checkbox" checked={showPass} onChange={e=>setShowPass(e.target.checked)} style={{ accentColor:C.neon, width:18, height:18, cursor:"pointer" }} />
                </label>
              </div>
              {showPass && (
                <div style={{ animation:"slide-up 0.3s ease" }}>
                  <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Enter PDF password..." style={{ width:"100%", padding:"12px 14px", background:C.surface, border:`1px solid ${password ? C.neon : C.border}`, borderRadius:10, color:C.text, fontSize:14, fontFamily:"'Exo 2',sans-serif", outline:"none" }} />
                  {password && <p style={{ color:C.success, fontSize:12, marginTop:8 }}>✓ Password will be applied on export</p>}
                </div>
              )}
            </div>
            {/* Watermark */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                {Ico.water(20)}
                <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>Watermark</span>
                <label style={{ marginLeft:"auto", display:"flex", alignItems:"center", cursor:"pointer" }}>
                  <input type="checkbox" checked={showWm} onChange={e=>setShowWm(e.target.checked)} style={{ accentColor:C.neon, width:18, height:18, cursor:"pointer" }} />
                </label>
              </div>
              {showWm && (
                <div style={{ animation:"slide-up 0.3s ease" }}>
                  <input value={watermark} onChange={e=>setWatermark(e.target.value)} placeholder="e.g. CONFIDENTIAL, DRAFT..." style={{ width:"100%", padding:"12px 14px", background:C.surface, border:`1px solid ${watermark ? C.neon : C.border}`, borderRadius:10, color:C.text, fontSize:14, fontFamily:"'Exo 2',sans-serif", outline:"none" }} />
                  {watermark && (
                    <div style={{ marginTop:12, height:80, background:"#0a1020", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                      <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, color:`${C.neon}44`, transform:"rotate(-20deg)", letterSpacing:4, fontWeight:900 }}>{watermark.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === "tools" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <SignatureFeature toast={toast} />
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div style={{ padding:"12px 16px 24px" }}>
        <button onClick={() => onGenerate({ pages, quality, password: showPass ? password : "", watermark: showWm ? watermark : "" })} style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:14, color:"white", fontSize:16, fontFamily:"'Exo 2',sans-serif", fontWeight:700, cursor:"pointer", boxShadow:`0 6px 28px ${C.neonGlow}`, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          {Ico.pdf(22)} Generate PDF
        </button>
      </div>
    </div>
  );
}

/* ─── SIGNATURE FEATURE ─── */
function SignatureFeature({ toast }) {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [penColor, setPenColor] = useState(C.neon);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => { e.preventDefault(); setDrawing(true); lastPos.current = getPos(e, canvasRef.current); };
  const draw = (e) => {
    if (!drawing) return; e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = penColor;
    ctx.shadowBlur = 8;
    ctx.stroke();
    lastPos.current = pos;
    setHasSig(true);
  };
  const stopDraw = () => setDrawing(false);
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        {Ico.sign(20)}
        <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>Add Signature</span>
        <span style={{ marginLeft:"auto", color:C.muted, fontSize:12 }}>Draw below</span>
      </div>
      {/* Pen colors */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {[C.neon,"#fff","#ff4466","#ffd93d","#00ffaa"].map(col => (
          <div key={col} onClick={() => setPenColor(col)} style={{ width:24, height:24, borderRadius:"50%", background:col, cursor:"pointer", border: penColor===col ? `3px solid white` : "3px solid transparent", boxShadow: penColor===col ? `0 0 10px ${col}` : "none" }} />
        ))}
      </div>
      <canvas ref={canvasRef} width={320} height={110} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{ width:"100%", height:110, background:"#0a0a20", borderRadius:10, border:`2px dashed ${C.border}`, cursor:"crosshair", touchAction:"none", display:"block" }} />
      <p style={{ color:C.muted, fontSize:11, textAlign:"center", marginTop:6 }}>Draw your signature above</p>
      <div style={{ display:"flex", gap:10, marginTop:12 }}>
        <button onClick={clear} style={{ flex:1, padding:"10px", background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, cursor:"pointer", fontSize:13 }}>Clear</button>
        <button onClick={() => { if(hasSig) toast("✅ Signature added to document!"); else toast("✏️ Please draw a signature first"); }} style={{ flex:2, padding:"10px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:10, color:"white", cursor:"pointer", fontSize:13, fontWeight:700 }}>Add to Page</button>
      </div>
    </div>
  );
}

/* ─── HISTORY SCREEN ─── */
function HistoryScreen({ onBack, onShare, toast }) {
  const [docs, setDocs] = useState([
    { id:1, name:"Invoice_Nov2024.pdf", size:"2.1 MB", pages:4, date:"Today, 10:42 AM", locked:true },
    { id:2, name:"Aadhaar_Scan.pdf", size:"800 KB", pages:1, date:"Yesterday", locked:false },
    { id:3, name:"Marksheet_2024.pdf", size:"3.4 MB", pages:8, date:"Dec 14", locked:false },
    { id:4, name:"Contract_Draft.pdf", size:"1.2 MB", pages:12, date:"Dec 10", locked:true },
    { id:5, name:"Notes_Physics.pdf", size:"5.6 MB", pages:24, date:"Dec 5", locked:false },
  ]);
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.text, cursor:"pointer" }}>{Ico.back()}</button>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:C.neon }}>SCAN HISTORY</span>
        <span style={{ marginLeft:"auto", color:C.muted, fontSize:12 }}>{docs.length} files</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {docs.map(doc => (
          <div key={doc.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px", marginBottom:12, animation:"slide-up 0.3s ease" }} className="scan-card">
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:54, background:`linear-gradient(135deg,${C.neon2}33,${C.neon}33)`, borderRadius:8, border:`1px solid ${C.neon}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {Ico.pdf(22)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                {renaming === doc.id ? (
                  <input value={renameVal} onChange={e=>setRenameVal(e.target.value)} onBlur={() => { setDocs(d => d.map(x => x.id===doc.id ? {...x,name:renameVal||x.name} : x)); setRenaming(null); }} autoFocus style={{ width:"100%", background:C.surface, border:`1px solid ${C.neon}`, borderRadius:6, color:C.text, padding:"4px 8px", fontSize:13, fontFamily:"'Exo 2',sans-serif", outline:"none" }} />
                ) : (
                  <div style={{ color:C.text, fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
                    {doc.name} {doc.locked && <span style={{ color:C.neon, fontSize:10 }}>🔒</span>}
                  </div>
                )}
                <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>{doc.size} · {doc.pages} pages · {doc.date}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={() => { setRenaming(doc.id); setRenameVal(doc.name.replace(".pdf","")); }} style={{ flex:1, padding:"8px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>{Ico.edit()} Rename</button>
              <button onClick={() => onShare(doc)} style={{ flex:1, padding:"8px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.neon, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>{Ico.share()} Share</button>
              <button onClick={() => { setDocs(d => d.filter(x => x.id!==doc.id)); toast("🗑️ File deleted"); }} style={{ padding:"8px 12px", background:`${C.danger}22`, border:`1px solid ${C.danger}44`, borderRadius:8, color:C.danger, cursor:"pointer" }}>{Ico.trash()}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SHARE SHEET ─── */
function ShareSheet({ doc, onClose }) {
  const platforms = [
    { id:"whatsapp", label:"WhatsApp", icon: Ico.whatsapp(26), color:"#25D366" },
    { id:"email", label:"Email", icon: Ico.email(26), color:"#00c8ff" },
    { id:"drive", label:"Drive", icon: Ico.drive(26), color:"#FBBC04" },
    { id:"copy", label:"Copy Link", icon: "🔗", color:"#a855f7" },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, borderRadius:"24px 24px 0 0", padding:"8px 20px 36px", border:`1px solid ${C.border}`, borderBottom:"none", animation:"float-up 0.3s ease" }}>
        <div style={{ width:40, height:4, background:C.border, borderRadius:4, margin:"12px auto 20px" }} />
        <p style={{ color:C.muted, fontSize:12, marginBottom:6, fontFamily:"'Orbitron',sans-serif" }}>SHARE FILE</p>
        <p style={{ color:C.text, fontSize:14, fontWeight:600, marginBottom:20 }}>{doc?.name}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {platforms.map(p => (
            <button key={p.id} onClick={onClose} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"16px 8px", background:C.card, border:`1px solid ${C.border}`, borderRadius:14, cursor:"pointer" }}>
              <div style={{ color:p.color, fontSize:typeof p.icon==="string"?24:undefined }}>{p.icon}</div>
              <span style={{ color:C.muted, fontSize:11 }}>{p.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%", padding:"14px", background:"none", border:`1px solid ${C.border}`, borderRadius:12, color:C.muted, cursor:"pointer", fontSize:14 }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── PDF GENERATING ANIMATION ─── */
function GeneratingScreen({ config, onDone }) {
  const [step, setStep] = useState(0);
  const [prog, setProg] = useState(0);
  const steps = ["Applying filters...","Compressing images...","Building PDF structure...",config.watermark?"Adding watermark...":"Optimizing pages...",config.password?"Encrypting PDF...":"Finalizing...",`Saved! ${config.pages?.length||3} pages`];
  useEffect(() => {
    let v=0, s=0;
    const iv = setInterval(() => {
      v += Math.random()*5+3;
      if(v>=100) { v=100; clearInterval(iv); setTimeout(onDone,600); }
      setProg(Math.min(v,100));
      const ns = Math.floor(Math.min(v,99)/18);
      if(ns!==s) { s=ns; setStep(Math.min(ns,steps.length-1)); }
    },80);
    return () => clearInterval(iv);
  },[]);
  return (
    <div style={{ position:"fixed", inset:0, background:`${C.bg}ee`, zIndex:300, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
      <div style={{ width:90, height:90, borderRadius:24, background:`linear-gradient(135deg,${C.neon2},${C.neon})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 40px ${C.neon}88`, marginBottom:28 }}>
        {Ico.pdf(40)}
      </div>
      <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, color:C.neon, marginBottom:8 }}>GENERATING PDF</h2>
      <p style={{ color:C.muted, fontSize:13, marginBottom:32 }}>{steps[step]}</p>
      <div style={{ width:260, height:4, background:C.border, borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${prog}%`, background:`linear-gradient(90deg,${C.neon2},${C.neon})`, transition:"width 0.1s linear", boxShadow:`0 0 10px ${C.neon}` }} />
      </div>
      <div style={{ color:C.neon, fontFamily:"'Orbitron',sans-serif", fontSize:14, marginTop:12 }}>{Math.round(prog)}%</div>
      {config.password && <div style={{ marginTop:20, color:C.muted, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>{Ico.lock(14)} Password protection active</div>}
    </div>
  );
}

/* ─── SETTINGS PANEL ─── */
function SettingsPanel({ isDark, setIsDark, onClose }) {
  const [offline] = useState(true);
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:200 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", right:0, top:0, bottom:0, width:"82%", maxWidth:340, background:C.surface, borderLeft:`1px solid ${C.border}`, padding:"24px 20px", display:"flex", flexDirection:"column", animation:"float-up 0.3s ease", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:C.neon }}>SETTINGS</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}>{Ico.close()}</button>
        </div>
        {/* Dark/Light toggle */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isDark ? Ico.moon(20) : Ico.sun(20)}
            <div>
              <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>{isDark ? "Dark Mode" : "Light Mode"}</div>
              <div style={{ color:C.muted, fontSize:12 }}>Premium neon theme</div>
            </div>
            <label style={{ marginLeft:"auto", cursor:"pointer" }}>
              <div onClick={() => setIsDark(d=>!d)} style={{ width:50, height:26, background: isDark ? `linear-gradient(135deg,${C.neon2},${C.neon})` : C.border, borderRadius:13, position:"relative", transition:"background 0.3s", boxShadow: isDark ? `0 0 12px ${C.neonGlow}` : "none" }}>
                <div style={{ position:"absolute", width:20, height:20, borderRadius:"50%", background:"white", top:3, left: isDark ? 27 : 3, transition:"left 0.3s", boxShadow:"0 2px 6px #0008" }} />
              </div>
            </label>
          </div>
        </div>
        {/* Offline mode */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {Ico.wifi_off(20)}
            <div>
              <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>Offline Mode</div>
              <div style={{ color:C.muted, fontSize:12 }}>No internet required</div>
            </div>
            <div style={{ marginLeft:"auto", background:`${C.success}22`, color:C.success, fontSize:11, padding:"4px 10px", borderRadius:8, fontFamily:"'Orbitron',sans-serif" }}>ON</div>
          </div>
        </div>
        {[
          { icon:"📦", label:"Storage Used", val:"142 MB / 2 GB" },
          { icon:"📄", label:"Total PDFs", val:"23 files" },
          { icon:"🔒", label:"Encrypted Files", val:"8 files" },
        ].map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:18 }}>{s.icon}</span>
            <span style={{ color:C.muted, fontSize:13, flex:1 }}>{s.label}</span>
            <span style={{ color:C.neon, fontSize:13, fontFamily:"'Orbitron',sans-serif" }}>{s.val}</span>
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:"20px 0 0", textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'Orbitron',sans-serif" }}>SMART SCAN PRO v2.0</div>
          <div style={{ color:C.border, fontSize:10, marginTop:4 }}>All features offline · No ads · No cloud</div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN HOME SCREEN ─── */
function HomeScreen({ onNav, isDark, setIsDark, toast }) {
  const [showSettings, setShowSettings] = useState(false);
  const cards = [
    { id:"camera", icon:Ico.camera(26), label:"Camera Scan", sub:"Scan document live", color:C.neon, gradient:`linear-gradient(135deg,${C.neon2},${C.neon})` },
    { id:"crop", icon:Ico.crop(26), label:"Edge Detect", sub:"Auto crop & fix", color:"#a855f7", gradient:"linear-gradient(135deg,#7c3aed,#a855f7)" },
    { id:"filters", icon:Ico.filter(26), label:"Smart Filter", sub:"Enhance scans", color:"#ff6b6b", gradient:"linear-gradient(135deg,#e11d48,#ff6b6b)" },
    { id:"pdf", icon:Ico.pdf(26), label:"PDF Builder", sub:"Multi-page + quality", color:"#ffaa00", gradient:"linear-gradient(135deg,#d97706,#ffaa00)" },
    { id:"history", icon:Ico.history(26), label:"Scan History", sub:"All your PDFs", color:"#00ffaa", gradient:"linear-gradient(135deg,#059669,#00ffaa)" },
    { id:"share", icon:Ico.share(26), label:"Instant Share", sub:"WhatsApp, Email, Drive", color:"#38bdf8", gradient:"linear-gradient(135deg,#0284c7,#38bdf8)" },
  ];
  const stats = [
    { label:"PDFs", val:"23", icon:"📄" }, { label:"Pages", val:"147", icon:"📋" }, { label:"Saved", val:"2.1GB", icon:"💾" }
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg, overflowY:"auto" }}>
      {showSettings && <SettingsPanel isDark={isDark} setIsDark={setIsDark} onClose={() => setShowSettings(false)} />}
      {/* Header */}
      <div style={{ padding:"20px 16px 12px", background:`linear-gradient(180deg,${C.surface},transparent)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:900, color:C.neon, letterSpacing:1, textShadow:`0 0 20px ${C.neon}88` }}>SMART SCAN</h1>
            <p style={{ color:C.muted, fontSize:12, marginTop:2 }}>Photo to PDF Pro · Offline</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => setIsDark(d=>!d)} style={{ width:38, height:38, borderRadius:12, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, cursor:"pointer" }}>
              {isDark ? Ico.moon(18) : Ico.sun(18)}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ width:38, height:38, borderRadius:12, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <span style={{ fontSize:18 }}>⚙️</span>
            </button>
          </div>
        </div>
        {/* Stats bar */}
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          {stats.map(s => (
            <div key={s.label} style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 0", textAlign:"center" }}>
              <div style={{ fontSize:16 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:15, color:C.neon, fontWeight:700 }}>{s.val}</div>
              <div style={{ color:C.muted, fontSize:10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick scan CTA */}
      <div style={{ margin:"8px 16px 16px" }}>
        <button onClick={() => onNav("camera")} className="glow-btn" style={{ width:"100%", padding:"18px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:18, color:"white", fontSize:16, fontFamily:"'Orbitron',sans-serif", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, letterSpacing:1 }}>
          {Ico.camera(22)} QUICK SCAN
        </button>
      </div>
      {/* Feature grid */}
      <div style={{ padding:"0 16px 16px", display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
        {cards.map((card,i) => (
          <button key={card.id} onClick={() => onNav(card.id)} style={{ padding:"18px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:18, cursor:"pointer", textAlign:"left", animation:`float-up 0.4s ${i*0.06}s ease both`, transition:"all 0.2s", display:"flex", flexDirection:"column", gap:10, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:card.gradient, opacity:0.1 }} />
            <div style={{ width:46, height:46, borderRadius:14, background:card.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"white", boxShadow:`0 4px 16px ${card.color}44` }}>
              {card.icon}
            </div>
            <div>
              <div style={{ color:C.text, fontWeight:700, fontSize:13, fontFamily:"'Exo 2',sans-serif" }}>{card.label}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{card.sub}</div>
            </div>
          </button>
        ))}
      </div>
      {/* Offline badge */}
      <div style={{ margin:"0 16px 20px", padding:"10px 16px", background:`${C.success}11`, border:`1px solid ${C.success}33`, borderRadius:12, display:"flex", alignItems:"center", gap:10 }}>
        {Ico.wifi_off(16)}
        <span style={{ color:C.success, fontSize:12 }}>Fully offline · No Firebase · No cloud sync required</span>
      </div>
    </div>
  );
}

/* ─── ROOT APP ─── */
export default function SmartScanApp() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState(null);
  const [shareDoc, setShareDoc] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [capturedPages, setCapturedPages] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  const showToast = (msg) => { setToast(msg); };
  const hideToast = () => setToast(null);

  const navTabs = [
    { id:"home", label:"Home", icon: (a) => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?"2.5":"1.8"} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id:"camera", label:"Scan", icon: (a) => Ico.camera(22) },
    { id:"pdf", label:"PDF", icon: (a) => Ico.pdf(22) },
    { id:"history", label:"History", icon: (a) => Ico.history(22) },
  ];

  const navigate = (s) => { setScreen(s); if(["home","camera","pdf","history"].includes(s)) setActiveTab(s); };

  const handleGenerate = (config) => {
    setGenerating(config);
  };
  const handleGenerateDone = () => {
    setGenerating(null);
    showToast("🎉 PDF saved to history!");
    navigate("history");
  };

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;

  return (
    <div style={{ width:"100%", maxWidth:420, height:"100vh", margin:"0 auto", background:C.bg, display:"flex", flexDirection:"column", position:"relative", fontFamily:"'Exo 2',sans-serif", overflow:"hidden", boxShadow:`0 0 60px #000` }}>
      {/* Toast */}
      {toast && <Toast msg={toast} onHide={hideToast} />}
      {/* Share sheet */}
      {shareDoc && <ShareSheet doc={shareDoc} onClose={() => setShareDoc(null)} />}
      {/* Generating overlay */}
      {generating && <GeneratingScreen config={generating} onDone={handleGenerateDone} />}

      {/* Screen content */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {screen === "home" && <HomeScreen onNav={navigate} isDark={isDark} setIsDark={setIsDark} toast={showToast} />}
        {screen === "camera" && <CameraScreen onCapture={(pages) => { setCapturedPages(pages); showToast(`📸 ${pages.length} page(s) scanned!`); navigate("crop"); }} onBack={() => navigate("home")} />}
        {screen === "crop" && <CropScreen onDone={() => { showToast("✂️ Crop applied!"); navigate("filters"); }} onBack={() => navigate("camera")} />}
        {screen === "filters" && <FiltersScreen onBack={() => navigate("crop")} onApply={() => { showToast("✨ Filter applied!"); navigate("pdf"); }} />}
        {screen === "pdf" && <PDFBuilderScreen pages={capturedPages} onBack={() => navigate("home")} onGenerate={handleGenerate} toast={showToast} />}
        {screen === "history" && <HistoryScreen onBack={() => navigate("home")} onShare={(doc) => setShareDoc(doc)} toast={showToast} />}
        {screen === "share" && (
          <div style={{ display:"flex", flexDirection:"column", height:"100%", alignItems:"center", justifyContent:"center", gap:16 }}>
            <button onClick={() => navigate("home")} style={{ position:"absolute", top:16, left:16, background:"none", border:"none", color:C.text, cursor:"pointer" }}>{Ico.back()}</button>
            <div style={{ color:C.neon, fontSize:40 }}>📤</div>
            <p style={{ color:C.text, fontFamily:"'Orbitron',sans-serif" }}>Select a PDF from History to share</p>
            <button onClick={() => navigate("history")} style={{ padding:"12px 28px", background:`linear-gradient(135deg,${C.neon2},${C.neon})`, border:"none", borderRadius:12, color:"white", cursor:"pointer", fontSize:14, fontFamily:"'Exo 2',sans-serif", fontWeight:700 }}>Go to History</button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ display:"flex", background:C.surface, borderTop:`1px solid ${C.border}`, paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
        {navTabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => navigate(tab.id)} style={{ flex:1, padding:"10px 4px 12px", background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", position:"relative" }}>
              {active && <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:2, background:`linear-gradient(90deg,${C.neon2},${C.neon})`, borderRadius:"0 0 4px 4px", boxShadow:`0 0 8px ${C.neon}` }} />}
              <span style={{ color: active ? C.neon : C.muted, filter: active ? `drop-shadow(0 0 6px ${C.neon})` : "none", transition:"all 0.2s" }}>
                {tab.icon(active)}
              </span>
              <span style={{ color: active ? C.neon : C.muted, fontSize:10, fontFamily:"'Exo 2',sans-serif", fontWeight: active ? 700 : 400, transition:"color 0.2s" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
