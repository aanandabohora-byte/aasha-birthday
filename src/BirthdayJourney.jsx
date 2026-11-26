import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const prizes = ['Aananda', 'iPhone Duo', '10,000', 'iPhone 18'];
const spinMessages = [
  'You won Aananda! Try again? 💗',
  'Whoa, Aananda again! One last try! 🥹✨',
  "It's destiny—you won Aananda! 💞"
];

function Confetti({ active }) {
  if (!active) return null;
  return <div className="confetti-layer" aria-hidden="true">{Array.from({length: 48}, (_,i)=><i key={i} style={{left:`${(i*37)%100}%`, animationDelay:`${(i%13)*.07}s`, '--hue':`${(i*47)%360}`, '--drift':`${((i%7)-3)*22}px`}} />)}</div>;
}
function Cake({ candlesOut = false, cut = false }) {
  return (
    <div className={`cake-scene ${cut ? 'cake-is-cut' : ''}`} aria-label="Birthday cake">
      <div className="cake-glow" />
      <div className="candles">
        {[0, 1, 2, 3, 4].map((n) => (
          <div className="candle" key={n}>
            {!candlesOut && <span className="flame" />}
            {candlesOut && <span className="smoke" />}
            <span className="wick" />
          </div>
        ))}
      </div>
      <div className="cake-top"><span className="sprinkles">✦ · ♥ · ✦ · ♥ · ✦</span></div>
      <div className="cake-layer layer-one" />
      <div className="cake-layer layer-two" />
      <div className="cake-layer layer-three" />
      {cut && <div className="cake-cut-wedge" aria-hidden="true" />}
      <div className="cake-plate" />
    </div>
  );
}
function SpinWheel({ spins, spinning, rotation, startRotation }) {
  const wheelAnimation = spinning
    ? [startRotation, rotation - 105, rotation + 9, rotation]
    : rotation;
  return <div className="wheel-wrap"><div className="pointer"/>
    <motion.div className="wheel" animate={{rotate:wheelAnimation}} transition={spinning
      ? {duration:6.8, times:[0,0.80,0.94,1], ease:['easeIn','easeOut','easeInOut']}
      : {duration:0}} >
      <div className="wheel-label label-a">Aananda 💗</div><div className="wheel-label label-b">iPhone Duo 📱</div><div className="wheel-label label-c">10,000 💰</div><div className="wheel-label label-d">iPhone 18 🎁</div><div className="wheel-center">♡</div>
    </motion.div>
  </div>
}

const BASE = import.meta.env.BASE_URL;
const photoFiles = Array.from({ length: 20 }, (_, i) => `${BASE}photos/${i + 1}.jpeg`);
function PhotoMarquee() {
  const row = [...photoFiles, ...photoFiles];
  return <div className="memory-wall" aria-label="A moving wall of memories">
    <div className="memory-track track-one">{row.map((src, i) => <img key={`a-${i}`} src={src} alt="Aasha memory" loading="lazy" />)}</div>
    <div className="memory-track track-two">{[...row].reverse().map((src, i) => <img key={`b-${i}`} src={src} alt="Aasha memory" loading="lazy" />)}</div>
  </div>;
}

export default function BirthdayJourney() {
  const [step,setStep]=useState(1); const [candlesOut,setCandlesOut]=useState(false); const [cakeCut,setCakeCut]=useState(false); const [celebrate,setCelebrate]=useState(false);
  function burst(){setCelebrate(true);setTimeout(()=>setCelebrate(false),3800);}
  const [spins,setSpins]=useState(0); const [spinning,setSpinning]=useState(false); const [rotation,setRotation]=useState(0); const [spinStartRotation,setSpinStartRotation]=useState(0); const [result,setResult]=useState(''); const [music,setMusic]=useState(true); const [soundStarted,setSoundStarted]=useState(false);
  const voiceRef=useRef(null);
  const backingRef=useRef(null);
  function stopBacking() {
    if (backingRef.current) {
      try { clearInterval(backingRef.current.timer); backingRef.current.ctx.close(); } catch {}
      backingRef.current = null;
    }
  }
  function startBacking() {
    if (backingRef.current || !music) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const master = ctx.createGain(); master.gain.value = 0.12; master.connect(ctx.destination);
      const chords = [
        [261.63, 329.63, 392.00, 493.88],
        [196.00, 246.94, 293.66, 392.00],
        [220.00, 261.63, 329.63, 440.00],
        [174.61, 220.00, 261.63, 349.23]
      ];
      let noteIndex = 0;
      const playNote = () => {
        const chord = chords[Math.floor(noteIndex / 4) % chords.length];
        const frequency = chord[noteIndex % 4];
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = frequency;
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
        osc.connect(gain); gain.connect(master); osc.start(now); osc.stop(now + 0.75);
        noteIndex = (noteIndex + 1) % 16;
      };
      playNote();
      const timer = setInterval(playNote, 520);
      backingRef.current = { ctx, timer };
    } catch (error) { console.warn('Background music unavailable:', error); }
  }
  useEffect(() => {
    if (!music) {
      if (voiceRef.current) voiceRef.current.pause();
      stopBacking();
    } else if (soundStarted) {
      if (voiceRef.current) voiceRef.current.play().catch(() => {});
      startBacking();
    }
    return () => {};
  }, [music]);
  function blow(){
    if(candlesOut)return;
    setSoundStarted(true);
    if (music) {
      if (voiceRef.current) { voiceRef.current.currentTime = 0; voiceRef.current.play().catch(error => console.warn('Voice playback unavailable:', error)); }
      startBacking();
    }
    setCandlesOut(true); burst();
  }
  function cut(){if(cakeCut)return;setCakeCut(true);burst();setTimeout(()=>setStep(2),1300);}
  function showWheel(){setStep(3);setResult('');}
  function spin(){if(spinning||spins>=3)return;const next=spins+1;setSpinStartRotation(rotation);setSpins(next);setSpinning(true);burst();
    // Four equal sectors. Aananda occupies the first 90 degrees; center is 45 degrees.
    // Land its center at the pointer (top), with multiple full turns and a little overshoot.
    const current=rotation%360; const targetMod=315; const delta=(targetMod-current+360)%360; const finalRotation=rotation+360*(5+next)+delta;
    setRotation(finalRotation); setTimeout(()=>{setSpinning(false);setResult(spinMessages[next-1]);},6900);
  }
  function reset(){setStep(1);setCandlesOut(false);setCakeCut(false);setCelebrate(false);setSpins(0);setRotation(0);setSpinStartRotation(0);setResult('');}
  return <main className="birthday-app">
    <style>{styles}</style>
    <Confetti active={celebrate}/>
    <audio ref={voiceRef} src={`${BASE}audio/aasha-voice.mp3`} preload="auto" />
    <PhotoMarquee />
    <button className="music-toggle" onClick={()=>setMusic(v=>!v)} aria-label="Toggle music">{music?'♫ Music On':'♫ Music Off'}</button>
    <div className="ambient">✦　♡　✧　♡　✦</div>
    <AnimatePresence mode="wait">
      {step===1 && <motion.section className="screen cake-screen" key="cake" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
        <p className="eyebrow">A little celebration just for you</p><h1>Happy Birthday! <span>🎂</span></h1><p className="subheading">Make a wish, birthday girl…</p>
        <Cake candlesOut={candlesOut} />
        {!candlesOut && <button className="primary-btn" onClick={blow}>💨 Blow Candles</button>}
        {candlesOut && <motion.div className="step-action" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><p className="sweet-note">Wish made? Keep it safe in your heart. ✨</p><button className="primary-btn" onClick={cut}>🔪 Cut the Cake</button></motion.div>}
      </motion.section>}
      {step===2 && <motion.section className="screen ride-invite" key="cake-cut" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><div className="cake-cut-scene"><Cake candlesOut={true} cut={true} /><motion.div className="knife" initial={{y:-100,rotate:-25}} animate={{y:10,rotate:18}} transition={{duration:1.1}}><span>🔪</span></motion.div><div className="sparkles">✨ ✦ ✧ ✨</div></div><h2>Sweetness shared is sweetness doubled. 💗</h2><p>Your birthday surprise is waiting…</p><button className="primary-btn glow-btn" onClick={showWheel}>🎁 Reveal My Surprise</button></motion.section>}
      {step===3 && <motion.section className="screen wheel-screen" key="wheel" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><p className="eyebrow">The surprise you've been waiting for</p><h2>Spin for your birthday surprise! 🎁</h2><p className="chances">Chances Left: <strong>{3-spins}</strong></p><SpinWheel spins={spins} spinning={spinning} rotation={rotation} startRotation={spinStartRotation}/><button className="primary-btn spin-btn" onClick={spin} disabled={spinning||spins>=3}>{spinning?'✨ Spinning…':'🎡 Spin the Wheel'}</button>
        <AnimatePresence>{result && <motion.div className="win-modal" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><div className="win-card"><div className="win-stars">✨💗✨</div><h3>{result}</h3>{spins===3?<><p>Some surprises are just meant to be. And some people are meant to be your favourite person, over and over again.</p><div className="final-letter"><h4>Happy Birthday, my love. 💌</h4><p>In every version of life, in every spin, and in every little adventure waiting ahead… I would still choose you. Here's to our story, to all the years behind us, and to every beautiful year yet to come. You will always be my favourite surprise. 🫂💗</p></div><button className="soft-btn" onClick={reset}>Celebrate Again ↻</button></>:<button className="primary-btn" onClick={()=>setResult('')}>Spin Again 💫</button>}</div></motion.div>}</AnimatePresence>
      </motion.section>}
    </AnimatePresence>
    <footer>Made with love, just for you ♡</footer>
  </main>
}


const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap');
*{box-sizing:border-box}body{margin:0;background:#fff8fb;color:#60374c;font-family:'DM Sans',sans-serif}.birthday-app{min-height:100vh;overflow:hidden;position:relative;background:radial-gradient(circle at 20% 10%,#fff 0,#fff4fa 42%,#ffeaf4 100%);padding:30px 18px 50px}.screen{max-width:940px;margin:0 auto;min-height:calc(100vh - 100px);display:flex;align-items:center;flex-direction:column;text-align:center;position:relative;z-index:2}.music-toggle{position:fixed;right:16px;top:14px;z-index:20;border:1px solid #f1c9dc;background:#fff9fc;color:#9d4774;padding:10px 14px;border-radius:999px;font-weight:700;box-shadow:0 6px 18px #d67ba21c;cursor:pointer}.eyebrow{text-transform:uppercase;letter-spacing:3px;font-size:12px;color:#c46a96;margin:34px 0 8px}.screen h1,.screen h2{font-family:'Playfair Display',serif;margin:0;color:#7c365d}.screen h1{font-size:clamp(38px,8vw,70px);line-height:1.08}.screen h1 span{display:inline-block;animation:bob 2s infinite}.screen h2{font-size:clamp(27px,5vw,43px);margin:10px 0}.subheading{color:#a76588;font-size:17px;margin:12px 0 20px}.primary-btn,.soft-btn{border:0;border-radius:999px;padding:15px 26px;font-weight:800;font-size:16px;cursor:pointer;transition:transform .2s,box-shadow .2s;background:linear-gradient(135deg,#ec83b7,#c65e98);color:white;box-shadow:0 9px 24px #ca679c42}.primary-btn:hover,.soft-btn:hover{transform:translateY(-2px);box-shadow:0 12px 25px #ca679c55}.primary-btn:disabled{opacity:.7;cursor:default}.cake-scene{height:290px;width:min(440px,92vw);position:relative;margin:28px auto 24px;filter:drop-shadow(0 16px 18px #b95c8126)}.cake-glow{position:absolute;width:270px;height:230px;left:50%;top:20px;transform:translateX(-50%);border-radius:50%;background:#ffc9e4;filter:blur(35px);opacity:.45}.cake-plate{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:330px;height:24px;border-radius:50%;background:linear-gradient(#fff,#e7b5ce);box-shadow:0 7px 0 #d796b7}.cake-layer{position:absolute;left:50%;transform:translateX(-50%);border-radius:18px 18px 23px 23px;box-shadow:inset 0 -10px 0 #00000008}.layer-one{width:240px;height:84px;bottom:42px;background:linear-gradient(90deg,#f4a9c9,#ffe2ef 48%,#ee9fc4)}.layer-two{width:190px;height:72px;bottom:122px;background:linear-gradient(90deg,#ffe1b9,#fff0d5 48%,#f4c89d);border-radius:17px 17px 18px 18px}.layer-three{width:142px;height:62px;bottom:185px;background:linear-gradient(90deg,#f6b7d1,#fff0f7 48%,#e9a4c4);border-radius:18px 18px 14px 14px}.cake-top{position:absolute;left:50%;transform:translateX(-50%);bottom:234px;width:142px;height:20px;border-radius:50%;background:#fff0f8;z-index:3}.sprinkles{font-size:10px;color:#d37aa5;position:absolute;top:2px;left:14px}.candles{position:absolute;bottom:245px;left:50%;transform:translateX(-50%);display:flex;gap:14px;z-index:5}.candle{height:42px;width:12px;background:repeating-linear-gradient(0deg,#fff6d8 0 8px,#ef9ec4 8px 12px);border-radius:4px;position:relative}.wick{position:absolute;width:2px;height:6px;background:#76505f;top:-5px;left:5px}.flame{position:absolute;width:12px;height:19px;left:0;top:-23px;background:radial-gradient(circle at 50% 60%,#fff8b5 0 20%,#ffb544 45%,#ff795d 72%);border-radius:60% 60% 60% 10%;transform:rotate(45deg);animation:flicker .6s infinite alternate}.cake-scene:has(.flame){animation:none}.cake-scene:has(.flame) .cake-glow{animation:pulse 1.5s infinite}.cake-scene:has(.flame) .flame{animation:flicker .45s infinite alternate}.cake-screen .cake-scene{margin-top:4px}.step-action{margin-top:5px}.sweet-note{color:#ba6790;font-weight:700}.cake-screen .primary-btn{min-width:210px}.ride-invite{justify-content:center}.cake-cut-scene{position:relative;margin:10px 0 8px;height:330px;width:min(460px,94vw)}.cake-cut-scene .cake-scene{transform:scale(.95);margin:0 auto}.knife{position:absolute;right:5%;top:50px;font-size:54px;filter:drop-shadow(2px 4px 3px #5552)}.cake-slice{position:absolute;right:9%;bottom:12%;font-size:50px}.sparkles{position:absolute;top:10%;left:10%;font-size:30px;animation:pulse 1s infinite}.ride-invite h2{font-size:clamp(23px,4vw,34px)}.ride-invite p{color:#a76587}.glow-btn{margin-top:18px;animation:glow 1.8s infinite alternate}.ride-scene{width:min(100%,1000px);height:430px;border-radius:30px;overflow:hidden;position:relative;margin:22px auto;background:linear-gradient(#bfe9ff 0%,#e9f8ff 62%,#c8efcf 62%,#a5d9a6 100%);box-shadow:0 14px 35px #77b0c82b}.sun{position:absolute;right:12%;top:34px;width:72px;height:72px;background:#ffebaa;border-radius:50%;box-shadow:0 0 38px #ffde7a}.cloud{position:absolute;color:#fff;font-size:72px;opacity:.8;animation:cloudmove 18s linear infinite}.cloud-a{top:50px;left:12%}.cloud-b{top:90px;left:65%;animation-duration:25s}.floating-love{position:absolute;top:18%;left:40%;color:#ff90bc;font-size:22px;animation:float 4s infinite}.ride-hills{position:absolute;bottom:130px;width:130%;height:180px;border-radius:50% 50% 0 0;left:-15%}.hill-back{background:#98d6ad;bottom:120px}.hill-front{background:#72c38c;bottom:70px;left:-4%;width:110%;height:160px}.road{position:absolute;bottom:0;width:100%;height:110px;background:#666a76;border-top:9px solid #a3a7b2}.road-dashes{position:absolute;top:48px;width:100%;height:7px;background:repeating-linear-gradient(90deg,#fff8dc 0 45px,transparent 45px 82px);animation:roadmove 1s linear infinite}.milestones{position:absolute;inset:0;z-index:5}.milestone{position:absolute;bottom:126px;display:flex;flex-direction:column;align-items:center;animation:signmove 12s linear infinite}.sign{background:#fff7df;border:3px solid #d89b6b;color:#855c3b;font-weight:900;padding:7px 12px;border-radius:10px;box-shadow:0 4px 5px #4d6a5c33}.post{width:8px;height:52px;background:#ad8156;border-radius:3px}.finish{position:absolute;right:3%;bottom:130px;z-index:7;background:#fff;color:#d56c9b;border:3px solid #d56c9b;padding:10px 14px;font-weight:900;border-radius:9px;line-height:1.2;box-shadow:0 0 20px #ffb6d6}.finish small{font-size:10px}.gift-prompt{margin-top:8px;color:#bd5688;font-weight:800}.gift-btn{border:0;background:transparent;font-size:76px;cursor:pointer;filter:drop-shadow(0 6px 10px #c47ba333)}.wheel-screen{padding-bottom:20px}.chances{font-size:18px;color:#b45d88;margin:10px 0}.chances strong{display:inline-block;background:#fce0ed;padding:5px 13px;border-radius:20px;color:#9a376c}.wheel-wrap{width:min(350px,85vw);aspect-ratio:1;position:relative;margin:16px auto 22px}.pointer{position:absolute;z-index:5;top:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:19px solid transparent;border-right:19px solid transparent;border-top:34px solid #773a5b;border-bottom:0;filter:drop-shadow(0 3px 3px #5554)}.wheel{width:100%;height:100%;border-radius:50%;border:10px solid #fff;box-shadow:0 0 0 4px #d98bb4,0 18px 32px #ab5b873b;position:relative;background:conic-gradient(from 0deg,#f6a7ca 0deg 90deg,#ffd88f 90deg 180deg,#b8e6dc 180deg 270deg,#c6b3fa 270deg 360deg);overflow:hidden}.wheel-label{position:absolute;left:50%;top:50%;width:48%;text-align:center;font-size:clamp(12px,3vw,16px);font-weight:900;color:#714260;text-shadow:0 1px #fff7;transform-origin:center}.label-a{transform:translate(-50%,-50%) translate(63px,-63px) rotate(45deg)}.label-b{transform:translate(-50%,-50%) translate(63px,63px) rotate(135deg)}.label-c{transform:translate(-50%,-50%) translate(-63px,63px) rotate(225deg)}.label-d{transform:translate(-50%,-50%) translate(-63px,-63px) rotate(315deg)}.wheel-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border:5px solid #f7d5e7;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;color:#ca6398;font-size:26px;box-shadow:0 4px 10px #5552}.spin-btn{min-width:220px}.win-modal{position:fixed;inset:0;background:#6d34534d;backdrop-filter:blur(5px);z-index:30;display:flex;align-items:center;justify-content:center;padding:18px}.win-card{max-width:430px;width:100%;background:#fff8fc;border:2px solid #f3c9dd;border-radius:26px;padding:25px;box-shadow:0 20px 60px #68355044;text-align:center}.win-card h3{font-family:'Playfair Display',serif;font-size:27px;color:#9e4774;margin:10px 0}.win-card p{line-height:1.65;color:#8f5878}.win-stars{font-size:24px}.final-letter{background:#fff0f7;border-radius:17px;padding:14px;margin:14px 0;text-align:left;border:1px dashed #e6a8c8}.final-letter h4{color:#a44778;text-align:center;margin:5px 0 10px;font-size:18px}.soft-btn{background:#f6d6e7;color:#9b4775;box-shadow:none}.confetti-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:12}.confetti-layer i{position:absolute;top:-14px;width:9px;height:14px;background:hsl(var(--hue),85%,65%);animation:confettifall 4s linear infinite;opacity:.9;border-radius:2px}.ambient{position:fixed;left:0;right:0;top:0;opacity:.18;pointer-events:none;text-align:center;color:#dc8eb6;letter-spacing:15px;font-size:22px}.birthday-app footer{text-align:center;color:#bd82a1;font-size:12px;margin-top:22px}.ride-scene{min-height:360px}@keyframes flicker{from{transform:scale(.9) rotate(38deg);opacity:.85}to{transform:scale(1.12) rotate(52deg);opacity:1}}@keyframes bob{50%{transform:translateY(-5px)}}@keyframes pulse{50%{opacity:.7;transform:scale(1.05)}}@keyframes glow{to{box-shadow:0 0 28px #ee91be}}@keyframes roadmove{to{background-position:-82px 0}}@keyframes cloudmove{50%{transform:translateX(30px)}}@keyframes float{50%{transform:translateY(-10px)}}@keyframes signmove{0%{transform:translateX(0)}100%{transform:translateX(-35px)}}@keyframes confettifall{to{transform:translateY(110vh) rotate(600deg);opacity:.2}}
@media(max-width:560px){.birthday-app{padding:25px 12px 40px}.music-toggle{top:9px;right:9px;padding:8px 11px;font-size:12px}.eyebrow{margin-top:46px}.cake-scene{transform:scale(.85);margin-top:-4px;margin-bottom:-10px}.ride-scene{height:340px}.milestone{bottom:120px}.sign{padding:5px 8px;font-size:12px}.post{height:42px}.finish{right:1%;padding:7px 9px}.wheel-wrap{width:min(300px,82vw)}.cake-cut-scene{transform:scale(.84);margin:-20px 0}.ride-invite{justify-content:flex-start;padding-top:35px}}

/* Birthday interactions */
.smoke {
  position: absolute; top: -28px; left: -5px; color: #aaa;
  font-size: 21px; opacity: .75; animation: smokeRise 1.25s ease-out infinite;
}
@keyframes smokeRise {
  0% { opacity: .75; transform: translateY(0) scale(.75); }
  100% { opacity: 0; transform: translateY(-25px) scale(1.35); }
}
.cake-is-cut .layer-one,
.cake-is-cut .layer-two,
.cake-is-cut .layer-three,
.cake-is-cut .cake-top {
  clip-path: polygon(0 0, 100% 0, 76% 100%, 0 100%);
}
.cake-is-cut .layer-one { transform: translateX(calc(-50% - 7px)) rotate(-1deg); }
.cake-is-cut .layer-two { transform: translateX(calc(-50% - 5px)); }
.cake-is-cut .layer-three { transform: translateX(calc(-50% - 3px)); }
.cake-is-cut .cake-top { transform: translateX(calc(-50% - 3px)); }
.cake-cut-wedge {
  position: absolute; z-index: 4; width: 64px; height: 64px;
  left: calc(50% + 65px); bottom: 56px;
  background: linear-gradient(135deg, #fff0f7, #e99abd);
  clip-path: polygon(0 0, 100% 42%, 0 100%);
  filter: drop-shadow(3px 4px 3px #9b527044);
  animation: wedgeMove .9s ease-out both;
}
@keyframes wedgeMove {
  from { opacity: 0; transform: translate(0, 0) rotate(0); }
  to { opacity: 1; transform: translate(32px, -3px) rotate(8deg); }
}
.cake-cut-scene .cake-scene { transform: scale(.9); transform-origin: center top; }
.cake-cut-scene .cake-slice { display: none; }
.cake-cut-scene .knife { z-index: 8; }
/* Two vertical photo rails keep the birthday action clear in the centre. */
.memory-wall{position:fixed;z-index:1;inset:0;overflow:hidden;pointer-events:none;}
.memory-track{position:absolute;top:0;display:flex;flex-direction:column;align-items:center;gap:12px;width:clamp(76px,10vw,124px);height:max-content;animation:memoryDown 82s linear infinite;}
.memory-track.track-one{left:10px;}
.memory-track.track-two{right:10px;animation-name:memoryUp;animation-duration:91s;}
.memory-track img{display:block;width:100%;height:clamp(88px,10vw,132px);object-fit:cover;border-radius:15px;border:4px solid #fff;box-shadow:0 5px 18px #9b527022;flex:none;}
@keyframes memoryDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
@keyframes memoryUp{from{transform:translateY(0)}to{transform:translateY(-50%)}}
/* Reserve a clear centre column so photos never sit over the cake or wheel. */
.screen{max-width:min(940px,calc(100vw - 280px));}
.birthday-app audio{display:none}
@media(max-width:700px){
  .memory-track{width:clamp(46px,14vw,62px);gap:8px;}
  .memory-track.track-one{left:4px;}
  .memory-track.track-two{right:4px;}
  .memory-track img{height:clamp(58px,17vw,78px);border-width:2px;border-radius:9px;}
  .screen{width:calc(100vw - 132px);max-width:calc(100vw - 132px);min-height:calc(100vh - 80px);}
  .screen h1{font-size:clamp(27px,7vw,42px);}
  .screen h2{font-size:clamp(20px,5vw,29px);}
  .eyebrow{font-size:9px;letter-spacing:1.5px;}
  .subheading{font-size:14px;}
  .cake-screen .cake-scene{width:100%;transform:scale(.62);transform-origin:top center;margin-top:0;margin-bottom:-105px;}
  .cake-cut-scene{width:100%;height:245px;}
  .cake-cut-scene .cake-scene{transform:scale(.60);transform-origin:top center;width:100%;}
  .knife{right:-2%;font-size:38px;}
  .wheel-wrap{width:min(245px,calc(100vw - 150px));margin:12px auto 18px;}
  .wheel-label{font-size:10px;}
  .label-a{transform:translate(-50%,-50%) translate(43px,-43px) rotate(45deg)}
  .label-b{transform:translate(-50%,-50%) translate(43px,43px) rotate(135deg)}
  .label-c{transform:translate(-50%,-50%) translate(-43px,43px) rotate(225deg)}
  .label-d{transform:translate(-50%,-50%) translate(-43px,-43px) rotate(315deg)}
  .wheel-center{width:42px;height:42px;font-size:21px;}
  .primary-btn,.soft-btn{font-size:13px;padding:12px 16px;}
  .win-card{padding:18px;max-height:88vh;overflow:auto;}
}

`;
