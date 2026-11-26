import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────────────── 1. EDIT YOUR TEXT HERE ───────────────────────── */
const CONFIG = {
  herName: 'Aasha',
  giftName: 'Aananda',
  age: 21,
  photoCount: 20,           // photos 1.jpeg … 20.jpeg inside /public/photos
  voiceFile: 'audio/aasha-voice.mp3',
  // Optional real song in /public/audio. If the file is missing, the soft synth tune plays instead.
  musicFile: 'audio/birthday-music.mp3',
  collageTitle: 'Twenty-one years of you 💗',
  collageNote: 'Every one of these is my favourite. Happy birthday, love. ♡',
  tease: 'Could it be 10,000 cash, an iPhone Duo, or Aananda? 💝',
  reveals: [
    'Not cash… something way better. Keep going! ✨',
    'Not an iPhone either. Still Aananda. One more! 💗',
    'Three for three. It was always going to be Aananda. 💗',
  ],
  letterTitle: 'A little promise, forever 💌',
  letter:
    'Just as you chose me all three times, I will choose you forever, my love. ' +
    'Thanks for choosing me. Happiest 21st birthday, love!',
  signoff: 'With all my love ♡',
};

const BASE = import.meta.env.BASE_URL;
const photoFiles = Array.from(
  { length: CONFIG.photoCount },
  (_, i) => `${BASE}photos/${i + 1}.jpeg`,
);
const hideBroken = (e) => { e.currentTarget.style.visibility = 'hidden'; };
const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── 2. CANVAS CONFETTI (no DOM spam) ───────────────────────── */
const COLORS = ['#ec83b7', '#c65e98', '#ffd1e6', '#ffc46b', '#fff3c4', '#9ad9c1', '#b7a4ff'];

const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null);
  const parts = useRef([]);
  const raf = useRef(0);

  const loop = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    const dpr = window.devicePixelRatio || 1;
    parts.current = parts.current.filter((p) => p.y < c.height / dpr + 40 && p.life > 0);
    parts.current.forEach((p) => {
      p.vy += 0.22; p.vx *= 0.992; p.x += p.vx; p.y += p.vy;
      p.rot += p.vr; p.life -= 1;
      ctx.save();
      ctx.translate(p.x * dpr, p.y * dpr);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(1, p.life / 40);
      if (p.shape === 'heart') {
        ctx.font = `${p.size * 2.2 * dpr}px serif`; ctx.fillText('♥', 0, 0);
      } else if (p.shape === 'dot') {
        ctx.beginPath(); ctx.arc(0, 0, p.size * 0.5 * dpr, 0, 7); ctx.fill();
      } else {
        ctx.fillRect(-p.size * dpr / 2, -p.size * dpr / 3, p.size * dpr, p.size * 0.6 * dpr);
      }
      ctx.restore();
    });
    raf.current = parts.current.length ? requestAnimationFrame(loop) : 0;
  }, []);

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    };
    resize();
    addEventListener('resize', resize);
    return () => { removeEventListener('resize', resize); cancelAnimationFrame(raf.current); };
  }, []);

  useImperativeHandle(ref, () => ({
    // two "party cannons" from the bottom corners + a soft shower from the top
    fire(count = 90) {
      if (reduceMotion()) return;
      const W = innerWidth, H = innerHeight;
      const mk = (x, y, vx, vy) => ({
        x, y, vx, vy, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        size: 7 + Math.random() * 8, life: 140 + Math.random() * 80,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: ['rect', 'rect', 'dot', 'heart'][(Math.random() * 4) | 0],
      });
      for (let i = 0; i < count; i++) {
        const left = i % 2 === 0;
        parts.current.push(mk(
          left ? 0 : W, H,
          (left ? 1 : -1) * (3 + Math.random() * 7),
          -(11 + Math.random() * 9),
        ));
      }
      for (let i = 0; i < count / 3; i++) {
        parts.current.push(mk(Math.random() * W, -20, (Math.random() - 0.5) * 2, 1 + Math.random() * 2));
      }
      if (!raf.current) raf.current = requestAnimationFrame(loop);
    },
  }), [loop]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
});

/* ───────────────────────── 3. SMALL HELPERS ───────────────────────── */
function useTypewriter(text, active, speed = 42) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!active) { setOut(''); return undefined; }
    if (reduceMotion()) { setOut(text); return undefined; }
    let i = 0;
    const t = setInterval(() => {
      i += 1; setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, active, speed]);
  return out;
}

// Listens to the microphone; calls onBlow when a real "puff" is heard.
async function listenForBlow(onBlow) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  ctx.createMediaStreamSource(stream).connect(analyser);
  const buf = new Uint8Array(analyser.fftSize);
  let loud = 0; let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    stream.getTracks().forEach((t) => t.stop());
    ctx.close().catch(() => {});
  };
  const tick = () => {
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
    const rms = Math.sqrt(sum / buf.length);
    loud = rms > 0.2 ? loud + 1 : Math.max(0, loud - 1);
    if (loud > 12) { stop(); onBlow(); return; }
    raf = requestAnimationFrame(tick);
  };
  tick();
  return stop;
}

/* ───────────────────────── 4. CAKE ───────────────────────── */
function Cake({ candlesOut = false, cut = false }) {
  return (
    <div className={`cake-scene ${cut ? 'cake-is-cut' : ''}`} role="img" aria-label="Birthday cake">
      <div className="cake-glow" />
      <div className="candles">
        {[0, 1, 2, 3, 4].map((n) => (
          <div className={`candle ${candlesOut ? 'out' : ''}`} style={{ '--d': `${n * 0.14}s` }} key={n}>
            <span className="flame" /><span className="smoke" /><span className="wick" />
          </div>
        ))}
      </div>
      <div className="cake-top"><span className="sprinkles">✦ · ♥ · ✦ · ♥ · ✦</span></div>
      <div className="cake-layer layer-one" />
      <div className="cake-layer layer-two" />
      <div className="cake-layer layer-three" />
      {cut && <><div className="cake-notch" /><div className="cake-wedge" /></>}
      <div className="cake-plate" />
    </div>
  );
}

/* ───────────────────────── 5. PHOTO FRAME (top strip + two rotating polaroids) ───────────────────────── */
function PhotoMarquee() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((c) => (c + 1) % photoFiles.length), 3200);
    return () => clearInterval(t);
  }, []);
  const left = photoFiles[i];
  const right = photoFiles[(i + 10) % photoFiles.length];
  return (
    <div className="memory-wall" aria-hidden="true">
      <div className="top-photo-rail">
        <div className="top-photo-track">
          {[...photoFiles, ...photoFiles].map((src, k) => (
            <img key={k} src={src} alt="" loading="lazy" onError={hideBroken} />
          ))}
        </div>
      </div>
      {[['left', left, -5], ['right', right, 5]].map(([side, src, tilt]) => (
        <div key={side} className={`polaroid polaroid-${side}`} style={{ '--tilt': `${tilt}deg` }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={src} src={src} alt="" onError={hideBroken}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── 5b. FINALE: photos drop onto a pinboard one by one ───────────────────────── */
function CollageFinale({ fire, onReplay, onVoice, voicePlaying }) {
  const [shown, setShown] = useState(0);
  const tilts = useMemo(() => photoFiles.map((_, i) => ((i * 53) % 13) - 6), []);
  const done = shown >= photoFiles.length;

  useEffect(() => {
    if (done) { fire(170); return undefined; }
    const t = setTimeout(() => setShown((s) => s + 1), reduceMotion() ? 0 : 320);
    return () => clearTimeout(t);
  }, [shown, done, fire]);

  return (
    <>
      <h2 className="finale-title">{CONFIG.collageTitle}</h2>
      <div className="collage">
        {photoFiles.map((src, i) => (
          <motion.figure
            key={src} className="collage-item"
            initial={{ opacity: 0, y: -80, scale: 1.35, rotate: 0 }}
            animate={i < shown
              ? { opacity: 1, y: 0, scale: 1, rotate: tilts[i] }
              : { opacity: 0, y: -80, scale: 1.35, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}>
            <img src={src} alt="" onError={hideBroken} />
          </motion.figure>
        ))}
      </div>
      {done && (
        <motion.div className="finale-end" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="finale-note">{CONFIG.collageNote}</p>
          <div className="btn-row">
            <button type="button" className="primary-btn" onClick={onVoice}>
              {voicePlaying ? '⏸ Pause my voice' : '🎙️ Hear my voice'}
            </button>
            <button type="button" className="soft-btn" onClick={onReplay}>Celebrate again ↻</button>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ───────────────────────── 6. MAIN APP ───────────────────────── */
export default function BirthdayJourney() {
  const [step, setStep] = useState(0);            // 0 intro · 1 cake · 2 cut · 3 cards
  const [phase, setPhase] = useState('closed');   // intro: closed → count
  const [age, setAge] = useState(0);
  const [wish, setWish] = useState('');
  const [flownWish, setFlownWish] = useState('');
  const [candlesOut, setCandlesOut] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [mic, setMic] = useState('idle');         // idle | listening | denied
  const [spins, setSpins] = useState(0);
  const [selected, setSelected] = useState({});
  const [opening, setOpening] = useState(null);
  const [music, setMusic] = useState(true);
  const [soundStarted, setSoundStarted] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);

  const confetti = useRef(null);
  const voiceRef = useRef(null);
  const musicRef = useRef(null);
  const musicFileOk = useRef(true);
  const backingRef = useRef(null);
  const stopMicRef = useRef(null);
  const fire = useCallback((n) => confetti.current?.fire(n), []);

  /* ---- soft synth backing track (same melody as before, now cleaned up on unmount) ---- */
  const stopBacking = useCallback(() => {
    const b = backingRef.current;
    if (!b) return;
    if (b.file) musicRef.current?.pause();
    else { try { clearInterval(b.timer); b.ctx.close(); } catch { /* ignore */ } }
    backingRef.current = null;
  }, []);

  const startSynth = useCallback(() => {
    if (backingRef.current) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 0.12; master.connect(ctx.destination);
      const chords = [
        [261.63, 329.63, 392.0, 493.88], [196.0, 246.94, 293.66, 392.0],
        [220.0, 261.63, 329.63, 440.0], [174.61, 220.0, 261.63, 349.23],
      ];
      let n = 0;
      const play = () => {
        const f = chords[Math.floor(n / 4) % 4][n % 4];
        const o = ctx.createOscillator(); const g = ctx.createGain();
        const t = ctx.currentTime;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.035, t + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.72);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.75);
        n = (n + 1) % 16;
      };
      play();
      backingRef.current = { ctx, timer: setInterval(play, 520) };
    } catch (err) { console.warn('Background music unavailable:', err); }
  }, []);

  // Prefer the real song; fall back to the synth tune if the file is missing or blocked.
  const startBacking = useCallback(() => {
    if (backingRef.current) return;
    const a = musicRef.current;
    if (a && musicFileOk.current) {
      a.volume = 0.4;
      backingRef.current = { file: true };
      a.play().catch(() => {
        backingRef.current = null; musicFileOk.current = false; startSynth();
      });
    } else {
      startSynth();
    }
  }, [startSynth]);

  useEffect(() => {
    if (!music) { voiceRef.current?.pause(); stopBacking(); }
    else if (soundStarted) { voiceRef.current?.play().catch(() => {}); startBacking(); }
  }, [music, soundStarted, startBacking, stopBacking]);

  useEffect(() => () => { stopBacking(); stopMicRef.current?.(); }, [stopBacking]);

  /* ---- intro: open the letter, count up to her age ---- */
  function openLetter() { setPhase('count'); fire(40); }
  useEffect(() => {
    if (phase !== 'count') return undefined;
    let n = 0; let next;
    const t = setInterval(() => {
      n += 1; setAge(n);
      if (n >= CONFIG.age) {
        clearInterval(t); fire(130);
        next = setTimeout(() => setStep(1), 1700);
      }
    }, 95);
    return () => { clearInterval(t); clearTimeout(next); };
  }, [phase]);

  /* ---- candles ---- */
  function blow() {
    if (candlesOut) return;
    stopMicRef.current?.(); stopMicRef.current = null; setMic('idle');
    setFlownWish(wish.trim());
    setCandlesOut(true); setSoundStarted(true); fire(110);
    if (music && voiceRef.current) {
      voiceRef.current.currentTime = 0;
      voiceRef.current.play().catch(() => {});
    }
  }
  async function blowWithMic() {
    if (mic === 'listening') return;
    try {
      setMic('listening');
      stopMicRef.current = await listenForBlow(blow);
    } catch { setMic('denied'); }
  }

  function cutCake() {
    if (cakeCut) return;
    setCakeCut(true); fire(110);
    setTimeout(() => setStep(2), 1500);
  }

  /* ---- mystery cards ---- */
  function chooseCard(index) {
    if (opening !== null || selected[index] || spins >= 3) return;
    setOpening(index);
    setTimeout(() => {
      const used = Object.values(selected).map((s) => s.image);
      const free = photoFiles.filter((s) => !used.includes(s));
      const pool = free.length ? free : photoFiles;
      const image = pool[(Math.random() * pool.length) | 0];
      setSelected((p) => ({ ...p, [index]: { image } }));
      setSpins((s) => s + 1);
      setOpening(null);
      fire(spins === 2 ? 150 : 60);
    }, 700);
  }

  function reset() {
    setStep(0); setPhase('closed'); setAge(0); setWish(''); setFlownWish('');
    setCandlesOut(false); setCakeCut(false); setSpins(0); setSelected({}); setOpening(null);
  }

  function toggleVoice() {
    const v = voiceRef.current;
    if (!v) return;
    if (!v.paused) { v.pause(); return; }
    v.currentTime = 0;
    v.play().catch(() => {});
  }

  const letter = useTypewriter(CONFIG.letter, spins === 3, 38);
  const lastReveal = spins > 0 ? CONFIG.reveals[spins - 1] : '';

  return (
    <main className="birthday-app">
      <style>{styles}</style>
      <Confetti ref={confetti} />
      <audio
        ref={voiceRef} src={`${BASE}${CONFIG.voiceFile}`} preload="auto"
        onPlay={() => { setVoicePlaying(true); if (musicRef.current) musicRef.current.volume = 0.12; }}
        onPause={() => { setVoicePlaying(false); if (musicRef.current) musicRef.current.volume = 0.4; }}
        onEnded={() => { setVoicePlaying(false); if (musicRef.current) musicRef.current.volume = 0.4; }}
      />
      <audio
        ref={musicRef} src={`${BASE}${CONFIG.musicFile}`} loop preload="auto"
        onError={() => { musicFileOk.current = false; }}
      />
      <PhotoMarquee />

      <button
        type="button" className="music-toggle" aria-pressed={music}
        onClick={() => setMusic((v) => !v)}
      >
        {music ? '♫ Music on' : '♫ Music off'}
      </button>

      <AnimatePresence mode="wait">
        {/* ── STEP 0 · A letter arrives ── */}
        {step === 0 && (
          <motion.section className="screen" key="intro"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            {phase === 'closed' ? (
              <>
                <p className="eyebrow">Psst… {CONFIG.herName}</p>
                <button type="button" className="envelope" onClick={openLetter} aria-label="Open your birthday letter">
                  <span className="env-flap" /><span className="env-heart">💌</span>
                </button>
                <p className="subheading">Tap the letter. It's for you.</p>
              </>
            ) : (
              <>
                <p className="eyebrow">Today you turn</p>
                <div className="age-count" aria-live="polite">{age}</div>
                <h2>{age >= CONFIG.age ? 'Twenty-one! 🎉' : '\u00A0'}</h2>
              </>
            )}
          </motion.section>
        )}

        {/* ── STEP 1 · Candles ── */}
        {step === 1 && (
          <motion.section className="screen" key="cake"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h1>Happy Birthday, {CONFIG.herName}! <span>🎂</span></h1>
            <p className="subheading">
              {candlesOut ? 'Wish made. Keep it safe in your heart. ✨' : 'Make a wish, birthday girl…'}
            </p>

            <div className="cake-wrap">
              <Cake candlesOut={candlesOut} />
              <AnimatePresence>
                {candlesOut && flownWish && (
                  <motion.p className="flown-wish"
                    initial={{ opacity: 0, y: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -190, scale: 1.05 }}
                    transition={{ duration: 4.2, ease: 'easeOut' }}>
                    ✦ {flownWish} ✦
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {!candlesOut ? (
              <div className="stack">
                <label className="wish-field">
                  <span>Whisper your wish (it stays on your screen only)</span>
                  <input value={wish} maxLength={60} onChange={(e) => setWish(e.target.value)}
                    placeholder="I wish…" />
                </label>
                <button type="button" className="primary-btn" onClick={blow}>💨 Blow the candles</button>
                <button type="button" className="text-btn" onClick={blowWithMic} disabled={mic === 'listening'}>
                  {mic === 'listening' && '🎤 Listening… blow into your phone'}
                  {mic === 'denied' && '🎤 Mic blocked. Tap the button above instead'}
                  {mic === 'idle' && '🎤 Or blow for real into your microphone'}
                </button>
              </div>
            ) : (
              <motion.div className="stack" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <button type="button" className="primary-btn" onClick={cutCake}>🍰 Cut the cake</button>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* ── STEP 2 · Cake cut ── */}
        {step === 2 && (
          <motion.section className="screen" key="cut"
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="cake-wrap"><Cake candlesOut cut /></div>
            <h2>Sweetness shared is sweetness doubled. 💗</h2>
            <p className="subheading">Your surprise is waiting…</p>
            <button type="button" className="primary-btn glow-btn" onClick={() => setStep(3)}>
              🎁 Reveal my surprise
            </button>
          </motion.section>
        )}

        {/* ── STEP 3 · Mystery cards ── */}
        {step === 3 && (
          <motion.section className="screen cards-screen" key="cards"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <h2>Pick a card for your surprise! 🎁</h2>
            <p className="chances">Chances left: <strong>{3 - spins}</strong></p>
            <p className="card-hint">{CONFIG.tease}</p>

            <div className="card-grid">
              {Array.from({ length: 9 }, (_, index) => {
                const chosen = selected[index];
                const isOpening = opening === index;
                return (
                  <button type="button" key={index}
                    className={`mystery-card ${chosen ? 'is-flipped' : ''} ${isOpening ? 'is-opening' : ''}`}
                    onClick={() => chooseCard(index)}
                    disabled={!!chosen || spins >= 3 || opening !== null}
                    aria-label={chosen ? `Card ${index + 1}: ${CONFIG.giftName}` : `Card ${index + 1}`}>
                    <span className="card-inner">
                      <span className="card-back">
                        <span className="card-number">{index + 1}</span>
                        <span className="card-heart">{isOpening ? '?' : '♡'}</span>
                        <span className="card-back-copy">{isOpening ? 'Opening…' : 'Choose me'}</span>
                      </span>
                      <span className="card-front">
                        {chosen && (
                          <>
                            <img src={chosen.image} alt="" onError={hideBroken} />
                            <span className="card-winner">{CONFIG.giftName} 💗</span>
                          </>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="result-slot">
              {lastReveal && spins < 3 && (
                <motion.div key={spins} className="card-result"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <h3>You found {CONFIG.giftName}! 💗</h3>
                  <p>{lastReveal}</p>
                </motion.div>
              )}
            </div>

            {spins === 3 && (
              <motion.div className="letter" initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.6 }}>
                <div className="letter-flourish">♡ ✦ ♡</div>
                <h3>{CONFIG.letterTitle}</h3>
                <p className="letter-body">{letter}<i className="caret" /></p>
                {letter.length >= CONFIG.letter.length && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="letter-signoff">{CONFIG.signoff}</div>
                    <div className="btn-row">
                      <button type="button" className="primary-btn" onClick={() => setStep(4)}>
                        📸 See our memories
                      </button>
                      <button type="button" className="soft-btn" onClick={toggleVoice}>
                        {voicePlaying ? '⏸ Pause my voice' : '🎙️ Hear my voice'}
                      </button>
                    </div>
                    <button type="button" className="text-btn" onClick={reset}>Celebrate again ↻</button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.section>
        )}

        {/* ── STEP 4 · Memory collage finale ── */}
        {step === 4 && (
          <motion.section className="screen finale-screen" key="finale"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CollageFinale fire={fire} onReplay={reset} onVoice={toggleVoice} voicePlaying={voicePlaying} />
          </motion.section>
        )}
      </AnimatePresence>

      <footer>Made with love, just for you ♡</footer>
    </main>
  );
}

/* ───────────────────────── 7. STYLES ───────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap');

:root{
  --bg:#fff6fa; --ink:#60374c; --rose:#c65e98; --rose-soft:#ec83b7; --rose-deep:#7c365d;
  --blush:#ffe3ef; --line:#f0c6da; --muted:#a76588;
}
*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%}
body{background:var(--bg);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;overflow-x:hidden}
button{font-family:inherit}
:focus-visible{outline:3px solid #7c365d;outline-offset:3px}

.birthday-app{
  position:relative;isolation:isolate;min-height:100dvh;width:100%;
  padding:92px 160px 40px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(circle at 20% 10%,#fff 0,#fff4fa 42%,#ffeaf4 100%);overflow:hidden;
}
.screen{position:relative;z-index:2;width:min(100%,820px);min-height:calc(100dvh - 150px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.confetti-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:20}

/* type */
.screen h1,.screen h2,.letter h3,.card-result h3{font-family:'Playfair Display',serif;color:var(--rose-deep);margin:0}
.screen h1{font-size:clamp(34px,7vw,64px);line-height:1.1}
.screen h1 span{display:inline-block;animation:bob 2s infinite}
.screen h2{font-size:clamp(24px,4.6vw,40px);margin:8px 0}
.eyebrow{font-style:italic;font-family:'Playfair Display',serif;font-size:20px;color:#b9618c;margin:0 0 14px}
.subheading{color:var(--muted);font-size:17px;margin:10px 0 18px}

/* buttons */
.primary-btn,.soft-btn{border:0;border-radius:999px;padding:15px 28px;font-weight:700;font-size:16px;cursor:pointer;
  background:linear-gradient(135deg,var(--rose-soft),var(--rose));color:#fff;box-shadow:0 9px 24px #ca679c42;transition:transform .2s,box-shadow .2s}
.primary-btn:hover,.soft-btn:hover{transform:translateY(-2px);box-shadow:0 12px 26px #ca679c58}
.soft-btn{background:#f6d6e7;color:#8a3d66;box-shadow:none;margin-top:6px}
.text-btn{background:none;border:0;color:#a0507d;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:6px}
.text-btn:disabled{text-decoration:none;cursor:default;opacity:.85}
.glow-btn{margin-top:10px;animation:glow 1.8s infinite alternate}
.stack{display:flex;flex-direction:column;align-items:center;gap:10px;width:min(100%,380px)}
.music-toggle{position:fixed;right:14px;top:80px;z-index:15;border:1px solid var(--line);background:#fff9fc;color:#9d4774;
  padding:9px 14px;border-radius:999px;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 6px 18px #d67ba21c}

.wish-field{display:flex;flex-direction:column;gap:6px;width:100%;text-align:left;font-size:13px;color:var(--muted)}
.wish-field input{border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;font:inherit;font-size:16px;color:var(--ink);background:#fffafd}
.wish-field input:focus{outline:none;border-color:var(--rose-soft);box-shadow:0 0 0 4px #ec83b733}

/* intro */
.envelope{position:relative;width:210px;height:146px;border:0;border-radius:14px;cursor:pointer;
  background:linear-gradient(160deg,#f8bfd8,#e980b2);box-shadow:0 18px 36px #b95c8133;animation:wiggle 2.6s ease-in-out infinite}
.env-flap{position:absolute;inset:0 0 auto 0;height:86px;background:#ee94bf;border-radius:14px 14px 0 0;
  clip-path:polygon(0 0,100% 0,50% 100%)}
.env-heart{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-size:44px;animation:bob 1.6s infinite}
.age-count{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(110px,28vw,210px);line-height:1;
  color:var(--rose-deep);font-variant-numeric:tabular-nums}

/* cake */
.cake-wrap{position:relative;display:flex;justify-content:center;width:100%}
.cake-scene{height:290px;width:min(440px,92vw);position:relative;margin:6px auto 14px;filter:drop-shadow(0 16px 18px #b95c8126)}
.cake-glow{position:absolute;width:270px;height:230px;left:50%;top:20px;transform:translateX(-50%);border-radius:50%;background:#ffc9e4;filter:blur(35px);opacity:.45}
.cake-plate{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:330px;height:24px;border-radius:50%;background:linear-gradient(#fff,#e7b5ce);box-shadow:0 7px 0 #d796b7}
.cake-layer{position:absolute;left:50%;transform:translateX(-50%);border-radius:18px 18px 23px 23px}
.layer-one{width:240px;height:84px;bottom:42px;background:linear-gradient(90deg,#f4a9c9,#ffe2ef 48%,#ee9fc4)}
.layer-two{width:190px;height:72px;bottom:122px;background:linear-gradient(90deg,#ffe1b9,#fff0d5 48%,#f4c89d)}
.layer-three{width:142px;height:62px;bottom:185px;background:linear-gradient(90deg,#f6b7d1,#fff0f7 48%,#e9a4c4)}
.cake-top{position:absolute;left:50%;transform:translateX(-50%);bottom:234px;width:142px;height:20px;border-radius:50%;background:#fff0f8;z-index:3}
.sprinkles{font-size:10px;color:#d37aa5;position:absolute;top:2px;left:14px}
.cake-scene:has(.candle:not(.out)) .cake-glow{animation:pulse 1.5s infinite}
.candles{position:absolute;bottom:245px;left:50%;transform:translateX(-50%);display:flex;gap:14px;z-index:5}
.candle{height:42px;width:12px;background:repeating-linear-gradient(0deg,#fff6d8 0 8px,#ef9ec4 8px 12px);border-radius:4px;position:relative}
.wick{position:absolute;width:2px;height:6px;background:#76505f;top:-5px;left:5px}
.flame{position:absolute;width:12px;height:19px;left:0;top:-23px;background:radial-gradient(circle at 50% 60%,#fff8b5 0 20%,#ffb544 45%,#ff795d 72%);
  border-radius:60% 60% 60% 10%;transform:rotate(45deg);animation:flicker .5s infinite alternate;transition:opacity .25s var(--d),transform .25s var(--d)}
.candle.out .flame{animation:none;opacity:0;transform:rotate(45deg) scale(0)}
.smoke{position:absolute;left:3px;top:-10px;width:6px;height:6px;border-radius:50%;background:#c9b4c0;opacity:0}
.candle.out .smoke{animation:smoke 1.8s var(--d) ease-out forwards}
.flown-wish{position:absolute;top:30px;left:50%;transform:translateX(-50%);margin:0;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis;
  font-family:'Playfair Display',serif;font-style:italic;font-size:20px;color:#a2457a;text-shadow:0 0 14px #fff;pointer-events:none;z-index:6}
.cake-notch{position:absolute;left:50%;bottom:42px;width:58px;height:84px;margin-left:36px;background:#ffd0e3;border-radius:0 12px 12px 0;z-index:1}
.cake-wedge{position:absolute;left:50%;bottom:42px;width:58px;height:84px;margin-left:36px;z-index:4;
  background:linear-gradient(90deg,#f4a9c9,#ffe2ef);clip-path:polygon(0 0,100% 14%,100% 100%,0 100%);
  animation:slice 1.2s .15s cubic-bezier(.3,.7,.3,1) forwards}

/* photo frame */
.memory-wall{position:fixed;inset:0;z-index:0;pointer-events:none}
.top-photo-rail{position:fixed;top:0;left:0;right:0;height:72px;overflow:hidden;display:flex;align-items:center;
  background:linear-gradient(180deg,#fff8fcf5,#ffeef7b8);border-bottom:1px solid #e19dbe40}
.top-photo-track{display:flex;gap:10px;width:max-content;animation:drift 95s linear infinite}
.top-photo-track img{width:68px;height:54px;flex:none;object-fit:cover;border:3px solid #fff;border-radius:10px;box-shadow:0 3px 10px #78375a20}
.polaroid{position:fixed;top:50%;width:124px;height:150px;padding:7px 7px 24px;background:#fff;border-radius:6px;
  box-shadow:0 12px 28px #8f43692e;transform:translateY(-50%) rotate(var(--tilt));overflow:hidden}
.polaroid-left{left:18px}.polaroid-right{right:18px}
.polaroid img{width:100%;height:100%;object-fit:cover;display:block;border-radius:2px}

/* cards */
.cards-screen{justify-content:flex-start;padding:10px 0 20px}
.chances{font-size:17px;color:#b45d88;margin:6px 0}
.chances strong{background:#fce0ed;padding:4px 13px;border-radius:20px;color:#9a376c}
.card-hint{color:var(--muted);margin:2px 0 14px;font-size:14px}
.card-grid{width:min(560px,100%);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.mystery-card{appearance:none;border:0;padding:0;background:transparent;cursor:pointer;aspect-ratio:3/4;perspective:900px;transition:transform .2s}
.mystery-card:not(:disabled):hover{transform:translateY(-5px) scale(1.03)}
.mystery-card:disabled{cursor:default}
.card-inner{display:block;position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .75s cubic-bezier(.2,.75,.25,1)}
.is-flipped .card-inner{transform:rotateY(180deg)}
.is-opening{animation:shake .35s linear 2}
.card-back,.card-front{position:absolute;inset:0;overflow:hidden;border-radius:16px;backface-visibility:hidden;border:3px solid #fff;box-shadow:0 8px 20px #a94e7b25}
.card-back{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(145deg,#f6b6d3,#d978a8);color:#fff}
.card-back:before{content:"";position:absolute;inset:7px;border:1px dashed #fff9;border-radius:10px}
.card-number{position:absolute;top:9px;left:12px;font-size:12px;font-weight:700;opacity:.85}
.card-heart{font-family:Georgia,serif;font-size:clamp(34px,7vw,56px);line-height:1}
.card-back-copy{font-size:clamp(10px,2vw,13px);font-weight:700;letter-spacing:.5px}
.card-front{transform:rotateY(180deg);background:#fff0f7;display:flex;flex-direction:column}
.card-front img{width:100%;height:78%;object-fit:cover;min-height:0}
.card-winner{flex:1;display:grid;place-items:center;color:#9d3f72;font-weight:800;font-size:clamp(11px,2.2vw,16px)}
.result-slot{min-height:92px;width:100%;display:flex;justify-content:center}
.card-result{margin-top:14px;max-width:520px;background:#fff7fb;border:1px solid var(--line);border-radius:18px;padding:12px 20px;box-shadow:0 8px 24px #b65d8420}
.card-result h3{font-size:21px;margin:2px 0 4px}
.card-result p{margin:2px;color:#8f5878;line-height:1.5}

/* letter */
.letter{width:min(100%,640px);margin:18px auto 6px;padding:clamp(20px,4vw,34px);background:linear-gradient(145deg,#fffdfd,#fff0f7);
  border:1px solid #edc2d7;border-radius:25px;box-shadow:0 18px 48px #9f527322,inset 0 0 0 6px #fff8fb;text-align:center}
.letter-flourish{color:#d17aa4;font-size:22px;letter-spacing:8px;margin-bottom:8px}
.letter h3{font-size:clamp(20px,3vw,26px);margin:4px 0 14px}
.letter-body{font-family:'Playfair Display',serif;font-size:clamp(17px,2.5vw,22px);line-height:1.7;color:#75435e;margin:0 auto 12px;min-height:5.2em}
.caret{display:inline-block;width:2px;height:1em;background:#c65e98;margin-left:3px;vertical-align:-.12em;animation:blink 1s steps(1) infinite}
.letter-signoff{font-style:italic;color:#bd7196;margin:6px 0 14px}
.birthday-app footer{position:relative;z-index:2;text-align:center;color:#bd82a1;font-size:12px;margin-top:12px}

/* motion */
@keyframes flicker{from{transform:scale(.9) rotate(38deg);opacity:.85}to{transform:scale(1.12) rotate(52deg);opacity:1}}
@keyframes bob{50%{transform:translateY(-5px)}}
@keyframes pulse{50%{opacity:.7;transform:translateX(-50%) scale(1.05)}}
@keyframes glow{to{box-shadow:0 0 28px #ee91be}}
@keyframes drift{to{transform:translateX(-50%)}}
@keyframes wiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg) translateY(-4px)}}
@keyframes smoke{0%{opacity:.8;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-46px) scale(3)}}
@keyframes slice{to{transform:translate(84px,10px) rotate(9deg)}}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
@keyframes blink{50%{opacity:0}}

/* tablet: smaller polaroids */
@media(max-width:900px){
  .birthday-app{padding:88px 110px 34px}
  .polaroid{width:84px;height:106px;padding:5px 5px 16px}
  .polaroid-left{left:8px}.polaroid-right{right:8px}
}
/* phone: top strip only, full-width centre column */
@media(max-width:700px){
  .birthday-app{padding:76px 16px 24px}
  .polaroid{display:none}
  .top-photo-rail{height:56px}
  .top-photo-track img{width:46px;height:38px;border-width:2px;border-radius:7px}
  .music-toggle{top:64px;right:8px;padding:6px 10px;font-size:11px}
  .screen{min-height:calc(100dvh - 110px)}
  .subheading{font-size:15px}
  .cake-scene{transform:scale(.8);margin:-14px auto -26px}
  .primary-btn,.soft-btn{font-size:14px;padding:12px 20px}
  .card-grid{gap:8px}
  .card-back,.card-front{border-radius:11px;border-width:2px}
  .card-hint{font-size:12px}
  .envelope{width:180px;height:126px}
}

@media(prefers-reduced-motion:reduce){
  *,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;
