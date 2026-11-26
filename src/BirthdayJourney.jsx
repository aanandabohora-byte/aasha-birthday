import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const YEARS = ['2005','2008','2012','2015','2018','2020','2022','2024','2026'];
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
function RoadRide() {
  return (
    <div className="ride-scene cinematic-ride romantic-timeline">
      <div className="scene-sun" />
      <div className="scene-cloud cloud-a" />
      <div className="scene-cloud cloud-b" />
      <div className="scene-cloud cloud-c" />
      <div className="bird-flock">⌁　⌁　⌁</div>
      <div className="floating-love">♡　✦　♡　✦　♡</div>
      <div className="mountain mountain-far" />
      <div className="mountain mountain-near" />
      <div className="field field-back" />
      <div className="field field-front" />
      <div className="timeline-heading">
        <span>♡ OUR STORY ♡</span>
        <p>Every year, a new memory. Every memory, a reason to love you.</p>
      </div>
      <div className="timeline-track">
        {YEARS.map((year, i) => (
          <div className="timeline-marker" key={year} style={{ '--index': i }}>
            <span className="timeline-year">{year}</span>
            <span className="timeline-stem" />
            <span className="timeline-flower">✿</span>
          </div>
        ))}
      </div>
      <div className="timeline-heart">♥</div>
      <div className="timeline-bottom"><span>2005</span><span>2026</span></div>
      <div className="timeline-message">
        <span>And our story is still being written…</span><strong>∞</strong>
      </div>
    </div>
  );
}
function SpinWheel({ spins, spinning, rotation }) {
  return <div className="wheel-wrap"><div className="pointer"/>
    <motion.div className="wheel" animate={{rotate:rotation}} transition={{duration:spinning?4.2:0, ease:[.12,.75,.16,1]}}>
      <div className="wheel-label label-a">Aananda 💗</div><div className="wheel-label label-b">iPhone Duo 📱</div><div className="wheel-label label-c">10,000 💰</div><div className="wheel-label label-d">iPhone 18 🎁</div><div className="wheel-center">♡</div>
    </motion.div>
  </div>
}

export default function BirthdayJourney() {
  const [step,setStep]=useState(1); const [candlesOut,setCandlesOut]=useState(false); const [cakeCut,setCakeCut]=useState(false); const [celebrate,setCelebrate]=useState(false);
  function burst(){setCelebrate(true);setTimeout(()=>setCelebrate(false),3800);}
  const [spins,setSpins]=useState(0); const [spinning,setSpinning]=useState(false); const [rotation,setRotation]=useState(0); const [result,setResult]=useState(''); const [music,setMusic]=useState(true); const [soundStarted,setSoundStarted]=useState(false);
  const audioRef=useRef(null); const timerRef=useRef(null);
  useEffect(()=>{ if(!music) { if(audioRef.current) audioRef.current.stop(); return; } if(soundStarted) startMusic(); return ()=>audioRef.current?.stop(); },[music,soundStarted]);
  function startMusic() {
    if (audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      let stopped = false;
      let timer = null;
      // Happy Birthday to You — familiar melody in the key of C.
      const melody = [
        [392.00, 0.34], [392.00, 0.34], [440.00, 0.68], [392.00, 0.68], [523.25, 0.68], [493.88, 1.05],
        [392.00, 0.34], [392.00, 0.34], [440.00, 0.68], [392.00, 0.68], [587.33, 0.68], [523.25, 1.05],
        [392.00, 0.34], [392.00, 0.34], [783.99, 0.68], [659.25, 0.68], [523.25, 0.68], [493.88, 0.68], [440.00, 1.0],
        [698.46, 0.34], [698.46, 0.34], [659.25, 0.68], [523.25, 0.68], [587.33, 0.68], [523.25, 1.1]
      ];
      let index = 0;
      const playNext = () => {
        if (stopped) return;
        const [frequency, duration] = melody[index];
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.075, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.075, ctx.currentTime + Math.max(0.06, duration - 0.09));
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + duration + 0.02);
        index = (index + 1) % melody.length;
        timer = setTimeout(playNext, duration * 1000 + 70);
      };
      playNext();
      audioRef.current = {
        stop: () => {
          stopped = true;
          clearTimeout(timer);
          ctx.close();
          audioRef.current = null;
        }
      };
    } catch (error) {
      console.error('Audio could not start:', error);
    }
  }
  const activateAudio=()=>{setSoundStarted(true);};
  function blow(){if(candlesOut)return;activateAudio();setCandlesOut(true);burst();}
  function cut(){if(cakeCut)return;setCakeCut(true);burst();setTimeout(()=>setStep(2),1300);}
  function ride(){activateAudio();burst();setStep(3);}
  function openGift(){setStep(4);setResult('');}
  function spin(){if(spinning||spins>=3)return;activateAudio();const next=spins+1;setSpins(next);setSpinning(true);burst();
    // Four equal sectors. Aananda occupies the first 90 degrees; center is 45 degrees.
    // Land its center at the pointer (top), with multiple full turns and a little overshoot.
    const current=rotation%360; const targetMod=315; const delta=(targetMod-current+360)%360; const finalRotation=rotation+360*(5+next)+delta;
    setRotation(finalRotation); setTimeout(()=>{setSpinning(false);setResult(spinMessages[next-1]);},4300);
  }
  function reset(){setStep(1);setCandlesOut(false);setCakeCut(false);setCelebrate(false);setSpins(0);setRotation(0);setResult('');}
  return <main className="birthday-app">
    <style>{styles}</style>
    <Confetti active={celebrate}/>
    <button className="music-toggle" onClick={()=>setMusic(v=>!v)} aria-label="Toggle music">{music?'♫ Music On':'♫ Music Off'}</button>
    <div className="ambient">✦　♡　✧　♡　✦</div>
    <AnimatePresence mode="wait">
      {step===1 && <motion.section className="screen cake-screen" key="cake" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
        <p className="eyebrow">A little celebration just for you</p><h1>Happy Birthday! <span>🎂</span></h1><p className="subheading">Make a wish, birthday girl…</p>
        <Cake candlesOut={candlesOut} />
        {!candlesOut && <button className="primary-btn" onClick={blow}>💨 Blow Candles</button>}
        {candlesOut && <motion.div className="step-action" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><p className="sweet-note">Wish made? Keep it safe in your heart. ✨</p><button className="primary-btn" onClick={cut}>🔪 Cut the Cake</button></motion.div>}
      </motion.section>}
      {step===2 && <motion.section className="screen ride-invite" key="invite" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><div className="cake-cut-scene"><Cake candlesOut={true} cut={true} /><motion.div className="knife" initial={{y:-100,rotate:-25}} animate={{y:10,rotate:18}} transition={{duration:1.1}}><span>🔪</span></motion.div><motion.div className="cake-slice" initial={{x:0}} animate={{x:42,rotate:8}} transition={{delay:.5,duration:1.1}}>🍰</motion.div><div className="sparkles">✨ ✦ ✧ ✨</div></div><h2>Sweetness shared is sweetness doubled. 💗</h2><p>Now, let’s take a little journey through our story.</p><button className="primary-btn glow-btn" onClick={ride}>💗 Take Me Through Our Story</button></motion.section>}
      {step===3 && <motion.section className="screen journey-screen" key="journey" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><p className="eyebrow">A little journey through time</p><h2>From 2005 to 2026, with love… <span>♡</span></h2><p className="subheading">A little time-travel through the years, toward all the tomorrows waiting for us. ♡</p><RoadRide/><motion.div className="gift-prompt" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.1}}><motion.button className="gift-btn" animate={{y:[0,-8,0],rotate:[0,-2,2,0]}} transition={{repeat:Infinity,duration:1.4}} onClick={openGift}>🎁</motion.button><p>Tap to Open Surprise</p></motion.div></motion.section>}
      {step===4 && <motion.section className="screen wheel-screen" key="wheel" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><p className="eyebrow">The surprise you've been waiting for</p><h2>Spin for your birthday surprise! 🎁</h2><p className="chances">Chances Left: <strong>{3-spins}</strong></p><SpinWheel spins={spins} spinning={spinning} rotation={rotation}/><button className="primary-btn spin-btn" onClick={spin} disabled={spinning||spins>=3}>{spinning?'✨ Spinning…':'🎡 Spin the Wheel'}</button>
        <AnimatePresence>{result && <motion.div className="win-modal" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><div className="win-card"><div className="win-stars">✨💗✨</div><h3>{result}</h3>{spins===3?<><p>Some surprises are just meant to be. And some people are meant to be your favourite person, over and over again.</p><div className="final-letter"><h4>Happy Birthday, my love. 💌</h4><p>In every version of life, in every spin, and in every little adventure waiting ahead… I would still choose you. Here's to our story, to all the years behind us, and to every beautiful year yet to come. You will always be my favourite surprise. 🫂💗</p></div><button className="soft-btn" onClick={reset}>Replay our little journey ↻</button></>:<button className="primary-btn" onClick={()=>setResult('')}>Spin Again 💫</button>}</div></motion.div>}</AnimatePresence>
      </motion.section>}
    </AnimatePresence>
    <footer>Made with love, one little moment at a time ♡</footer>
  </main>
}


const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap');
*{box-sizing:border-box}body{margin:0;background:#fff8fb;color:#60374c;font-family:'DM Sans',sans-serif}.birthday-app{min-height:100vh;overflow:hidden;position:relative;background:radial-gradient(circle at 20% 10%,#fff 0,#fff4fa 42%,#ffeaf4 100%);padding:30px 18px 50px}.screen{max-width:940px;margin:0 auto;min-height:calc(100vh - 100px);display:flex;align-items:center;flex-direction:column;text-align:center;position:relative;z-index:2}.music-toggle{position:fixed;right:16px;top:14px;z-index:20;border:1px solid #f1c9dc;background:#fff9fc;color:#9d4774;padding:10px 14px;border-radius:999px;font-weight:700;box-shadow:0 6px 18px #d67ba21c;cursor:pointer}.eyebrow{text-transform:uppercase;letter-spacing:3px;font-size:12px;color:#c46a96;margin:34px 0 8px}.screen h1,.screen h2{font-family:'Playfair Display',serif;margin:0;color:#7c365d}.screen h1{font-size:clamp(38px,8vw,70px);line-height:1.08}.screen h1 span{display:inline-block;animation:bob 2s infinite}.screen h2{font-size:clamp(27px,5vw,43px);margin:10px 0}.subheading{color:#a76588;font-size:17px;margin:12px 0 20px}.primary-btn,.soft-btn{border:0;border-radius:999px;padding:15px 26px;font-weight:800;font-size:16px;cursor:pointer;transition:transform .2s,box-shadow .2s;background:linear-gradient(135deg,#ec83b7,#c65e98);color:white;box-shadow:0 9px 24px #ca679c42}.primary-btn:hover,.soft-btn:hover{transform:translateY(-2px);box-shadow:0 12px 25px #ca679c55}.primary-btn:disabled{opacity:.7;cursor:default}.cake-scene{height:290px;width:min(440px,92vw);position:relative;margin:28px auto 24px;filter:drop-shadow(0 16px 18px #b95c8126)}.cake-glow{position:absolute;width:270px;height:230px;left:50%;top:20px;transform:translateX(-50%);border-radius:50%;background:#ffc9e4;filter:blur(35px);opacity:.45}.cake-plate{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:330px;height:24px;border-radius:50%;background:linear-gradient(#fff,#e7b5ce);box-shadow:0 7px 0 #d796b7}.cake-layer{position:absolute;left:50%;transform:translateX(-50%);border-radius:18px 18px 23px 23px;box-shadow:inset 0 -10px 0 #00000008}.layer-one{width:240px;height:84px;bottom:42px;background:linear-gradient(90deg,#f4a9c9,#ffe2ef 48%,#ee9fc4)}.layer-two{width:190px;height:72px;bottom:122px;background:linear-gradient(90deg,#ffe1b9,#fff0d5 48%,#f4c89d);border-radius:17px 17px 18px 18px}.layer-three{width:142px;height:62px;bottom:185px;background:linear-gradient(90deg,#f6b7d1,#fff0f7 48%,#e9a4c4);border-radius:18px 18px 14px 14px}.cake-top{position:absolute;left:50%;transform:translateX(-50%);bottom:234px;width:142px;height:20px;border-radius:50%;background:#fff0f8;z-index:3}.sprinkles{font-size:10px;color:#d37aa5;position:absolute;top:2px;left:14px}.candles{position:absolute;bottom:245px;left:50%;transform:translateX(-50%);display:flex;gap:14px;z-index:5}.candle{height:42px;width:12px;background:repeating-linear-gradient(0deg,#fff6d8 0 8px,#ef9ec4 8px 12px);border-radius:4px;position:relative}.wick{position:absolute;width:2px;height:6px;background:#76505f;top:-5px;left:5px}.flame{position:absolute;width:12px;height:19px;left:0;top:-23px;background:radial-gradient(circle at 50% 60%,#fff8b5 0 20%,#ffb544 45%,#ff795d 72%);border-radius:60% 60% 60% 10%;transform:rotate(45deg);animation:flicker .6s infinite alternate}.cake-scene:has(.flame){animation:none}.cake-scene:has(.flame) .cake-glow{animation:pulse 1.5s infinite}.cake-scene:has(.flame) .flame{animation:flicker .45s infinite alternate}.cake-screen .cake-scene{margin-top:4px}.step-action{margin-top:5px}.sweet-note{color:#ba6790;font-weight:700}.cake-screen .primary-btn{min-width:210px}.ride-invite{justify-content:center}.cake-cut-scene{position:relative;margin:10px 0 8px;height:330px;width:min(460px,94vw)}.cake-cut-scene .cake-scene{transform:scale(.95);margin:0 auto}.knife{position:absolute;right:5%;top:50px;font-size:54px;filter:drop-shadow(2px 4px 3px #5552)}.cake-slice{position:absolute;right:9%;bottom:12%;font-size:50px}.sparkles{position:absolute;top:10%;left:10%;font-size:30px;animation:pulse 1s infinite}.ride-invite h2{font-size:clamp(23px,4vw,34px)}.ride-invite p{color:#a76587}.glow-btn{margin-top:18px;animation:glow 1.8s infinite alternate}.journey-screen{max-width:1100px}.ride-scene{width:min(100%,1000px);height:430px;border-radius:30px;overflow:hidden;position:relative;margin:22px auto;background:linear-gradient(#bfe9ff 0%,#e9f8ff 62%,#c8efcf 62%,#a5d9a6 100%);box-shadow:0 14px 35px #77b0c82b}.sun{position:absolute;right:12%;top:34px;width:72px;height:72px;background:#ffebaa;border-radius:50%;box-shadow:0 0 38px #ffde7a}.cloud{position:absolute;color:#fff;font-size:72px;opacity:.8;animation:cloudmove 18s linear infinite}.cloud-a{top:50px;left:12%}.cloud-b{top:90px;left:65%;animation-duration:25s}.floating-love{position:absolute;top:18%;left:40%;color:#ff90bc;font-size:22px;animation:float 4s infinite}.ride-hills{position:absolute;bottom:130px;width:130%;height:180px;border-radius:50% 50% 0 0;left:-15%}.hill-back{background:#98d6ad;bottom:120px}.hill-front{background:#72c38c;bottom:70px;left:-4%;width:110%;height:160px}.road{position:absolute;bottom:0;width:100%;height:110px;background:#666a76;border-top:9px solid #a3a7b2}.road-dashes{position:absolute;top:48px;width:100%;height:7px;background:repeating-linear-gradient(90deg,#fff8dc 0 45px,transparent 45px 82px);animation:roadmove 1s linear infinite}.milestones{position:absolute;inset:0;z-index:5}.milestone{position:absolute;bottom:126px;display:flex;flex-direction:column;align-items:center;animation:signmove 12s linear infinite}.sign{background:#fff7df;border:3px solid #d89b6b;color:#855c3b;font-weight:900;padding:7px 12px;border-radius:10px;box-shadow:0 4px 5px #4d6a5c33}.post{width:8px;height:52px;background:#ad8156;border-radius:3px}.finish{position:absolute;right:3%;bottom:130px;z-index:7;background:#fff;color:#d56c9b;border:3px solid #d56c9b;padding:10px 14px;font-weight:900;border-radius:9px;line-height:1.2;box-shadow:0 0 20px #ffb6d6}.finish small{font-size:10px}.gift-prompt{margin-top:8px;color:#bd5688;font-weight:800}.gift-btn{border:0;background:transparent;font-size:76px;cursor:pointer;filter:drop-shadow(0 6px 10px #c47ba333)}.wheel-screen{padding-bottom:20px}.chances{font-size:18px;color:#b45d88;margin:10px 0}.chances strong{display:inline-block;background:#fce0ed;padding:5px 13px;border-radius:20px;color:#9a376c}.wheel-wrap{width:min(350px,85vw);aspect-ratio:1;position:relative;margin:16px auto 22px}.pointer{position:absolute;z-index:5;top:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:19px solid transparent;border-right:19px solid transparent;border-top:34px solid #773a5b;border-bottom:0;filter:drop-shadow(0 3px 3px #5554)}.wheel{width:100%;height:100%;border-radius:50%;border:10px solid #fff;box-shadow:0 0 0 4px #d98bb4,0 18px 32px #ab5b873b;position:relative;background:conic-gradient(from 0deg,#f6a7ca 0deg 90deg,#ffd88f 90deg 180deg,#b8e6dc 180deg 270deg,#c6b3fa 270deg 360deg);overflow:hidden}.wheel-label{position:absolute;left:50%;top:50%;width:48%;text-align:center;font-size:clamp(12px,3vw,16px);font-weight:900;color:#714260;text-shadow:0 1px #fff7;transform-origin:center}.label-a{transform:translate(-50%,-50%) translate(63px,-63px) rotate(45deg)}.label-b{transform:translate(-50%,-50%) translate(63px,63px) rotate(135deg)}.label-c{transform:translate(-50%,-50%) translate(-63px,63px) rotate(225deg)}.label-d{transform:translate(-50%,-50%) translate(-63px,-63px) rotate(315deg)}.wheel-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border:5px solid #f7d5e7;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;color:#ca6398;font-size:26px;box-shadow:0 4px 10px #5552}.spin-btn{min-width:220px}.win-modal{position:fixed;inset:0;background:#6d34534d;backdrop-filter:blur(5px);z-index:30;display:flex;align-items:center;justify-content:center;padding:18px}.win-card{max-width:430px;width:100%;background:#fff8fc;border:2px solid #f3c9dd;border-radius:26px;padding:25px;box-shadow:0 20px 60px #68355044;text-align:center}.win-card h3{font-family:'Playfair Display',serif;font-size:27px;color:#9e4774;margin:10px 0}.win-card p{line-height:1.65;color:#8f5878}.win-stars{font-size:24px}.final-letter{background:#fff0f7;border-radius:17px;padding:14px;margin:14px 0;text-align:left;border:1px dashed #e6a8c8}.final-letter h4{color:#a44778;text-align:center;margin:5px 0 10px;font-size:18px}.soft-btn{background:#f6d6e7;color:#9b4775;box-shadow:none}.confetti-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:12}.confetti-layer i{position:absolute;top:-14px;width:9px;height:14px;background:hsl(var(--hue),85%,65%);animation:confettifall 4s linear infinite;opacity:.9;border-radius:2px}.ambient{position:fixed;left:0;right:0;top:0;opacity:.18;pointer-events:none;text-align:center;color:#dc8eb6;letter-spacing:15px;font-size:22px}.birthday-app footer{text-align:center;color:#bd82a1;font-size:12px;margin-top:22px}.gift-prompt p{margin-top:-8px}.ride-scene{min-height:360px}@keyframes flicker{from{transform:scale(.9) rotate(38deg);opacity:.85}to{transform:scale(1.12) rotate(52deg);opacity:1}}@keyframes bob{50%{transform:translateY(-5px)}}@keyframes pulse{50%{opacity:.7;transform:scale(1.05)}}@keyframes glow{to{box-shadow:0 0 28px #ee91be}}@keyframes roadmove{to{background-position:-82px 0}}@keyframes cloudmove{50%{transform:translateX(30px)}}@keyframes float{50%{transform:translateY(-10px)}}@keyframes signmove{0%{transform:translateX(0)}100%{transform:translateX(-35px)}}@keyframes confettifall{to{transform:translateY(110vh) rotate(600deg);opacity:.2}}
/* New cinematic 2005–2026 ride */
.cinematic-ride{height:470px!important;overflow:hidden;border-radius:28px;background:linear-gradient(180,#b9e4ff 0%,#e6f5ff 48%,#ffd9c8 68%,#a7d9a8 69%,#73c88d 100%);isolation:isolate}
.scene-sun{position:absolute;right:12%;top:40px;width:90px;height:90px;border-radius:50%;background:#fff1b7;box-shadow:0 0 50px 22px #ffd98566;z-index:0}
.scene-cloud{position:absolute;width:120px;height:42px;background:#fff9;border-radius:50px;filter:blur(.2px);z-index:1;animation:cloudmove 24s linear infinite}.scene-cloud:before,.scene-cloud:after{content:'';position:absolute;background:inherit;border-radius:50%;width:60px;height:60px;top:-20px;left:18px}.scene-cloud:after{width:70px;height:70px;top:-30px;left:52px}.cloud-a{top:62px;left:8%}.cloud-b{top:120px;left:58%;animation-duration:31s}.cloud-c{top:38px;left:80%;animation-duration:38s}
.bird-flock{position:absolute;top:38px;left:42%;color:#8eabc6;font-size:24px;letter-spacing:8px;animation:float 5s infinite}
.mountain{position:absolute;bottom:178px;width:0;height:0;border-left:170px solid transparent;border-right:170px solid transparent;border-bottom:190px solid #a7bfd6;opacity:.65}.mountain-far{left:-40px}.mountain-near{right:-40px;border-bottom-color:#c4d9d4;transform:scale(.8);bottom:160px}
.field{position:absolute;border-radius:50%;width:125%;height:170px;left:-10%}.field-back{background:#a5dba9;bottom:90px}.field-front{background:#78c993;bottom:54px;left:10%;width:120%;height:155px}
.timeline-track{position:absolute;top:26px;left:0;right:0;z-index:4;display:flex;justify-content:space-around;align-items:flex-start;padding:0 7px}.timeline-marker{display:flex;flex-direction:column;align-items:center;animation:timelinefloat 3s ease-in-out infinite;animation-delay:calc(var(--index)*.17s)}.timeline-year{font-weight:900;font-size:clamp(10px,2.5vw,14px);color:#8d4c6a;background:#fff8e8;border:2px solid #e7ae7e;border-radius:12px;padding:6px 7px;box-shadow:0 4px 0 #d7a07766}.timeline-stem{height:25px;width:4px;background:#bb926b;border-radius:5px}.timeline-flower{font-size:15px;color:#fff6e3;text-shadow:0 1px 4px #77a67a}
.finish{position:absolute;right:3%;bottom:140px;z-index:9;background:#fff9ed;border:3px solid #dc9d78;color:#bd6a84;border-radius:12px;padding:10px 12px;box-shadow:0 0 25px #ffdca4;font-weight:900;transform:rotate(2deg)}.finish span{font-size:22px;display:block}.finish small{font-size:9px;letter-spacing:1px}.road{height:105px!important;background:linear-gradient(#737480,#565967)!important;border-top:7px solid #b7b8c0!important}.road-dashes{top:46px!important}
@keyframes timelinefloat{50%{transform:translateY(-4px)}}
@media(max-width:560px){.cinematic-ride{height:400px!important}.timeline-track{padding:0 3px}.timeline-year{padding:4px 4px;border-radius:8px;font-size:9px}.timeline-stem{height:18px}.timeline-flower{font-size:11px}.scene-sun{width:66px;height:66px}.mountain{bottom:160px;transform:scale(.7)}.finish{bottom:125px;padding:7px 8px}.finish span{font-size:18px}.finish small{font-size:7px}}
@media(max-width:560px){.birthday-app{padding:25px 12px 40px}.music-toggle{top:9px;right:9px;padding:8px 11px;font-size:12px}.eyebrow{margin-top:46px}.cake-scene{transform:scale(.85);margin-top:-4px;margin-bottom:-10px}.ride-scene{height:340px}.milestone{bottom:120px}.sign{padding:5px 8px;font-size:12px}.post{height:42px}.finish{right:1%;padding:7px 9px}.wheel-wrap{width:min(300px,82vw)}.cake-cut-scene{transform:scale(.84);margin:-20px 0}.ride-invite{justify-content:flex-start;padding-top:35px}}

/* Birthday interactions and romantic 2005–2026 timeline */
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
.romantic-timeline {
  height: 470px !important;
  background: linear-gradient(180deg, #b9e4ff 0%, #e6f5ff 48%, #ffd9c8 68%, #a7d9a8 69%, #73c88d 100%);
}
.timeline-heading {
  position: absolute; z-index: 5; top: 105px; left: 10px; right: 10px; color: #8d4c6a;
}
.timeline-heading > span {
  display: inline-block; padding: 7px 16px; border-radius: 999px;
  background: #fff8e8ef; border: 1px solid #e7ae7e;
  font-weight: 900; letter-spacing: 2px; font-size: 13px;
}
.timeline-heading p {
  margin: 8px auto; font-size: clamp(10px, 2.4vw, 14px);
  font-weight: 700; color: #8d6472;
}
.romantic-timeline .timeline-track {
  top: 205px !important; padding: 0 12px !important;
}
.romantic-timeline .timeline-marker {
  animation: timelinefloat 3s ease-in-out infinite;
  animation-delay: calc(var(--index) * .17s);
}
.romantic-timeline .timeline-year {
  background: #fff8e8; border: 2px solid #e7ae7e; color: #8d4c6a;
  font-size: clamp(9px, 2.2vw, 13px); padding: 6px 7px;
  border-radius: 10px; box-shadow: 0 4px 0 #d7a07766;
}
.romantic-timeline .timeline-stem { height: 35px; background: #bb926b; }
.romantic-timeline .timeline-flower {
  color: #fff6e3; font-size: 18px; text-shadow: 0 1px 4px #77a67a;
}
.timeline-heart {
  position: absolute; z-index: 6; bottom: 93px; left: 50%;
  transform: translateX(-50%); color: #e86c9a; font-size: 48px;
  text-shadow: 0 4px 12px #a3486d55; animation: heartbeat 1.3s infinite;
}
@keyframes heartbeat { 50% { transform: translateX(-50%) scale(1.18); } }
.timeline-bottom {
  position: absolute; z-index: 6; left: 8%; right: 8%; bottom: 45px;
  display: flex; justify-content: space-between; color: #fff;
  font-weight: 900; text-shadow: 0 2px 4px #477b58;
}
.timeline-message {
  position: absolute; z-index: 7; bottom: 8px; left: 0; right: 0;
  color: #fff; font-size: 12px; font-weight: 800; text-shadow: 0 2px 4px #477b58;
}
.timeline-message strong { margin-left: 7px; font-size: 20px; }
.romantic-timeline .field-front { bottom: 28px; }
.romantic-timeline .field-back { bottom: 70px; }
.romantic-timeline .mountain { bottom: 170px; }
@media(max-width:560px) {
  .romantic-timeline { height: 400px !important; }
  .timeline-heading { top: 92px; }
  .romantic-timeline .timeline-track { top: 185px !important; padding: 0 4px !important; }
  .romantic-timeline .timeline-year { padding: 4px 3px; font-size: 8px; }
  .romantic-timeline .timeline-stem { height: 25px; }
  .romantic-timeline .timeline-flower { font-size: 12px; }
  .timeline-heart { bottom: 78px; font-size: 38px; }
  .timeline-bottom { bottom: 37px; }
  .timeline-message { font-size: 10px; bottom: 7px; }
}
`;
