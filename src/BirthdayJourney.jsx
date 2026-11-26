import React, { useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';





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



const BASE = import.meta.env.BASE_URL;

const photoFiles = Array.from({ length: 20 }, (_, i) => `${BASE}photos/${i + 1}.jpeg`);

function PhotoMarquee() {

  const row = [...photoFiles, ...photoFiles];

  return <div className="memory-wall" aria-label="A gently moving photo border">
    <div className="memory-track edge-top">{row.map((src, i) => <img key={`top-${i}`} src={src} alt="Birthday memory" loading="lazy" />)}</div>
    <div className="memory-track edge-bottom">{[...row].reverse().map((src, i) => <img key={`bottom-${i}`} src={src} alt="Birthday memory" loading="lazy" />)}</div>
    <div className="memory-track edge-left">{row.map((src, i) => <img key={`left-${i}`} src={src} alt="Birthday memory" loading="lazy" />)}</div>
    <div className="memory-track edge-right">{[...row].reverse().map((src, i) => <img key={`right-${i}`} src={src} alt="Birthday memory" loading="lazy" />)}</div>
  </div>;

}



export default function BirthdayJourney() {

  const [step,setStep]=useState(1); const [candlesOut,setCandlesOut]=useState(false); const [cakeCut,setCakeCut]=useState(false); const [celebrate,setCelebrate]=useState(false);

  function burst(){setCelebrate(true);setTimeout(()=>setCelebrate(false),3800);}

  const [spins,setSpins]=useState(0); const [selectedCards,setSelectedCards]=useState({}); const [result,setResult]=useState(''); const [music,setMusic]=useState(true); const [soundStarted,setSoundStarted]=useState(false);

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

  function showCards(){setStep(3);setResult('');}
  function chooseCard(index){
    if (selectedCards[index] || spins >= 3) return;
    const usedImages = Object.values(selectedCards).map(item => item.image);
    const availableImages = photoFiles.filter(src => !usedImages.includes(src));
    const imagePool = availableImages.length ? availableImages : photoFiles;
    const image = imagePool[Math.floor(Math.random() * imagePool.length)];
    const next = spins + 1;
    setSelectedCards(prev => ({...prev, [index]: {image, prize: 'Aananda'}}));
    setSpins(next);
    setResult(next === 3
      ? 'Three chances, three surprises — and every time, it is Aananda. 💗'
      : 'Surprise! You found Aananda. Choose another card if you still have a chance. ✨');
    burst();
  }
  function reset(){setStep(1);setCandlesOut(false);setCakeCut(false);setCelebrate(false);setSpins(0);setSelectedCards({});setResult('');}

  return <main className="birthday-app">

    <style>{styles}</style>

    <Confetti active={celebrate}/>

    <audio ref={voiceRef} src={`${BASE}audio/aasha-voice.mp3`} preload="auto" />

    <PhotoMarquee />
    <div className="party-decor decor-cake" aria-hidden="true">🎂</div>
    <div className="party-decor decor-balloons" aria-hidden="true">🎈🎈</div>
    <div className="party-decor decor-gift" aria-hidden="true">🎁</div>
    <div className="party-decor decor-sparkles" aria-hidden="true">✨ ♡ ✨</div>

    <button className="music-toggle" onClick={()=>setMusic(v=>!v)} aria-label="Toggle music">{music?'♫ Music On':'♫ Music Off'}</button>

    <div className="ambient">✦　♡　✧　♡　✦</div>

    <AnimatePresence mode="wait">

      {step===1 && <motion.section className="screen cake-screen" key="cake" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>

        <p className="eyebrow">A little celebration just for you</p><h1>Happy Birthday! <span>🎂</span></h1><p className="subheading">Make a wish, birthday girl…</p>

        <Cake candlesOut={candlesOut} />

        {!candlesOut && <button className="primary-btn" onClick={blow}>💨 Blow Candles</button>}

        {candlesOut && <motion.div className="step-action" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><p className="sweet-note">Wish made? Keep it safe in your heart. ✨</p><button className="primary-btn" onClick={cut}>🔪 Cut the Cake</button></motion.div>}

      </motion.section>}

      {step===2 && <motion.section className="screen ride-invite" key="cake-cut" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><div className="cake-cut-scene"><Cake candlesOut={true} cut={true} /><motion.div className="knife" initial={{y:-100,rotate:-25}} animate={{y:10,rotate:18}} transition={{duration:1.1}}><span>🔪</span></motion.div><div className="sparkles">✨ ✦ ✧ ✨</div></div><h2>Sweetness shared is sweetness doubled. 💗</h2><p>Your birthday surprise is waiting…</p><button className="primary-btn glow-btn" onClick={showCards}>🎁 Reveal My Surprise</button></motion.section>}

      {step===3 && <motion.section className="screen cards-screen" key="cards" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
        <p className="eyebrow">A little mystery, just for you</p>
        <h2>Pick a card for your surprise! 🎁</h2>
        <p className="chances">Chances Left: <strong>{3-spins}</strong></p>
        <p className="card-hint">Could it be 10,000 cash, an iPhone Duo, or Aananda? 💝</p>
        <div className="card-grid">
          {Array.from({length:9}, (_, index) => {
            const chosen = selectedCards[index];
            return <motion.button type="button" className={`mystery-card ${chosen ? 'is-flipped' : ''}`} key={index}
              onClick={() => chooseCard(index)} disabled={!!chosen || spins>=3}
              whileHover={!chosen && spins<3 ? {y:-5,scale:1.03} : {}}>
              <span className="card-inner">
                <span className="card-back"><span className="card-number">{index+1}</span><span className="card-heart">♡</span><span className="card-back-copy">Choose me</span></span>
                <span className="card-front">
                  {chosen && <><img src={chosen.image} alt="Aananda surprise" /><span className="card-winner">Aananda 💗</span></>}
                </span>
              </span>
            </motion.button>;
          })}
        </div>
        {result && <motion.div className="card-result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
          <h3>{spins===3 ? 'Every card leads to Aananda! 💗' : 'You found Aananda! 💗'}</h3>
          <p>{result}</p>
        </motion.div>}
        {spins===3 && <motion.div className="final-letter centerpiece-letter" initial={{opacity:0,y:18,scale:.96}} animate={{opacity:1,y:0,scale:1}}><div className="letter-flourish">♡ ✦ ♡</div><h4>A little promise, forever 💌</h4><p>Just as you chose me all three times, I will choose you forever, my love. Thanks for choosing me. Happiest 21st birthday, love!</p><div className="letter-signoff">With all my love ♡</div><button className="soft-btn" onClick={reset}>Celebrate Again ↻</button></motion.div>}
      </motion.section>}

    </AnimatePresence>

    <footer>Made with love, just for you ♡</footer>

  </main>

}





const styles = `

@import url('https\://fonts.googleapis.com/css2?family=DM+Sans:wght\@400;600;700&family=Playfair+Display:wght\@600;700&display=swap');

*{box-sizing:border-box}body{margin:0;background:#fff8fb;color:#60374c;font-family:'DM Sans',sans-serif}.birthday-app{min-height:100vh;overflow:hidden;position:relative;background:radial-gradient(circle at 20% 10%,#fff 0,#fff4fa 42%,#ffeaf4 100%);padding:30px 18px 50px}.screen{max-width:940px;margin:0 auto;min-height:calc(100vh - 100px);display:flex;align-items:center;flex-direction:column;text-align:center;position:relative;z-index:2}.music-toggle{position:fixed;right:16px;top:14px;z-index:20;border:1px solid #f1c9dc;background:#fff9fc;color:#9d4774;padding:10px 14px;border-radius:999px;font-weight:700;box-shadow:0 6px 18px #d67ba21c;cursor:pointer}.eyebrow{text-transform:uppercase;letter-spacing:3px;font-size:12px;color:#c46a96;margin:34px 0 8px}.screen h1,.screen h2{font-family:'Playfair Display',serif;margin:0;color:#7c365d}.screen h1{font-size:clamp(38px,8vw,70px);line-height:1.08}.screen h1 span{display:inline-block;animation:bob 2s infinite}.screen h2{font-size:clamp(27px,5vw,43px);margin:10px 0}.subheading{color:#a76588;font-size:17px;margin:12px 0 20px}.primary-btn,.soft-btn{border:0;border-radius:999px;padding:15px 26px;font-weight:800;font-size:16px;cursor:pointer;transition:transform .2s,box-shadow .2s;background:linear-gradient(135deg,#ec83b7,#c65e98);color:white;box-shadow:0 9px 24px #ca679c42}.primary-btn:hover,.soft-btn:hover{transform:translateY(-2px);box-shadow:0 12px 25px #ca679c55}.primary-btn:disabled{opacity:.7;cursor:default}.cake-scene{height:290px;width:min(440px,92vw);position:relative;margin:28px auto 24px;filter:drop-shadow(0 16px 18px #b95c8126)}.cake-glow{position:absolute;width:270px;height:230px;left:50%;top:20px;transform:translateX(-50%);border-radius:50%;background:#ffc9e4;filter:blur(35px);opacity:.45}.cake-plate{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:330px;height:24px;border-radius:50%;background:linear-gradient(#fff,#e7b5ce);box-shadow:0 7px 0 #d796b7}.cake-layer{position:absolute;left:50%;transform:translateX(-50%);border-radius:18px 18px 23px 23px;box-shadow:inset 0 -10px 0 #00000008}.layer-one{width:240px;height:84px;bottom:42px;background:linear-gradient(90deg,#f4a9c9,#ffe2ef 48%,#ee9fc4)}.layer-two{width:190px;height:72px;bottom:122px;background:linear-gradient(90deg,#ffe1b9,#fff0d5 48%,#f4c89d);border-radius:17px 17px 18px 18px}.layer-three{width:142px;height:62px;bottom:185px;background:linear-gradient(90deg,#f6b7d1,#fff0f7 48%,#e9a4c4);border-radius:18px 18px 14px 14px}.cake-top{position:absolute;left:50%;transform:translateX(-50%);bottom:234px;width:142px;height:20px;border-radius:50%;background:#fff0f8;z-index:3}.sprinkles{font-size:10px;color:#d37aa5;position:absolute;top:2px;left:14px}.candles{position:absolute;bottom:245px;left:50%;transform:translateX(-50%);display:flex;gap:14px;z-index:5}.candle{height:42px;width:12px;background:repeating-linear-gradient(0deg,#fff6d8 0 8px,#ef9ec4 8px 12px);border-radius:4px;position:relative}.wick{position:absolute;width:2px;height:6px;background:#76505f;top:-5px;left:5px}.flame{position:absolute;width:12px;height:19px;left:0;top:-23px;background:radial-gradient(circle at 50% 60%,#fff8b5 0 20%,#ffb544 45%,#ff795d 72%);border-radius:60% 60% 60% 10%;transform:rotate(45deg);animation:flicker .6s infinite alternate}.cake-scene:has(.flame){animation:none}.cake-scene:has(.flame) .cake-glow{animation:pulse 1.5s infinite}.cake-scene:has(.flame) .flame{animation:flicker .45s infinite alternate}.cake-screen .cake-scene{margin-top:4px}.step-action{margin-top:5px}.sweet-note{color:#ba6790;font-weight:700}.cake-screen .primary-btn{min-width:210px}.ride-invite{justify-content:center}.cake-cut-scene{position:relative;margin:10px 0 8px;height:330px;width:min(460px,94vw)}.cake-cut-scene .cake-scene{transform:scale(.95);margin:0 auto}.knife{position:absolute;right:5%;top:50px;font-size:54px;filter:drop-shadow(2px 4px 3px #5552)}.cake-slice{position:absolute;right:9%;bottom:12%;font-size:50px}.sparkles{position:absolute;top:10%;left:10%;font-size:30px;animation:pulse 1s infinite}.ride-invite h2{font-size:clamp(23px,4vw,34px)}.ride-invite p{color:#a76587}.glow-btn{margin-top:18px;animation:glow 1.8s infinite alternate}.ride-scene{width:min(100%,1000px);height:430px;border-radius:30px;overflow:hidden;position:relative;margin:22px auto;background:linear-gradient(#bfe9ff 0%,#e9f8ff 62%,#c8efcf 62%,#a5d9a6 100%);box-shadow:0 14px 35px #77b0c82b}.sun{position:absolute;right:12%;top:34px;width:72px;height:72px;background:#ffebaa;border-radius:50%;box-shadow:0 0 38px #ffde7a}.cloud{position:absolute;color:#fff;font-size:72px;opacity:.8;animation:cloudmove 18s linear infinite}.cloud-a{top:50px;left:12%}.cloud-b{top:90px;left:65%;animation-duration:25s}.floating-love{position:absolute;top:18%;left:40%;color:#ff90bc;font-size:22px;animation:float 4s infinite}.ride-hills{position:absolute;bottom:130px;width:130%;height:180px;border-radius:50% 50% 0 0;left:-15%}.hill-back{background:#98d6ad;bottom:120px}.hill-front{background:#72c38c;bottom:70px;left:-4%;width:110%;height:160px}.road{position:absolute;bottom:0;width:100%;height:110px;background:#666a76;border-top:9px solid #a3a7b2}.road-dashes{position:absolute;top:48px;width:100%;height:7px;background:repeating-linear-gradient(90deg,#fff8dc 0 45px,transparent 45px 82px);animation:roadmove 1s linear infinite}.milestones{position:absolute;inset:0;z-index:5}.milestone{position:absolute;bottom:126px;display:flex;flex-direction:column;align-items:center;animation:signmove 12s linear infinite}.sign{background:#fff7df;border:3px solid #d89b6b;color:#855c3b;font-weight:900;padding:7px 12px;border-radius:10px;box-shadow:0 4px 5px #4d6a5c33}.post{width:8px;height:52px;background:#ad8156;border-radius:3px}.finish{position:absolute;right:3%;bottom:130px;z-index:7;background:#fff;color:#d56c9b;border:3px solid #d56c9b;padding:10px 14px;font-weight:900;border-radius:9px;line-height:1.2;box-shadow:0 0 20px #ffb6d6}.finish small{font-size:10px}.gift-prompt{margin-top:8px;color:#bd5688;font-weight:800}.gift-btn{border:0;background:transparent;font-size:76px;cursor:pointer;filter:drop-shadow(0 6px 10px #c47ba333)}.cards-screen{padding-bottom:28px}
.chances{font-size:18px;color:#b45d88;margin:10px 0}
.chances strong{display:inline-block;background:#fce0ed;padding:5px 13px;border-radius:20px;color:#9a376c}
.card-hint{color:#a76588;margin:4px 0 18px;font-size:14px}
.card-grid{width:min(660px,94vw);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(9px,2vw,17px);perspective:1000px}
.mystery-card{appearance:none;border:0;padding:0;background:transparent;cursor:pointer;aspect-ratio:3/4;min-width:0;perspective:900px}
.mystery-card:disabled{cursor:default}
.card-inner{display:block;position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .75s cubic-bezier(.2,.75,.25,1)}
.mystery-card.is-flipped .card-inner{transform:rotateY(180deg)}
.card-back,.card-front{position:absolute;inset:0;overflow:hidden;border-radius:17px;backface-visibility:hidden;box-shadow:0 8px 20px #a94e7b25;border:3px solid #fff}
.card-back{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;background:linear-gradient(145deg,#f6b6d3,#d978a8);color:#fff}
.card-back:before{content:"";position:absolute;inset:7px;border:1px dashed #fff9;border-radius:11px}
.card-number{position:absolute;top:10px;left:13px;font-size:12px;font-weight:800;opacity:.8}
.card-heart{font-family:Georgia,serif;font-size:clamp(38px,7vw,62px);line-height:1;text-shadow:0 3px 8px #87365c33}
.card-back-copy{font-size:clamp(10px,2vw,14px);font-weight:800;letter-spacing:1px;text-transform:uppercase}
.card-front{transform:rotateY(180deg);background:#fff0f7;display:flex;flex-direction:column}
.card-front img{width:100%;height:78%;object-fit:cover;min-height:0}
.card-winner{flex:1;display:grid;place-items:center;color:#9d3f72;font-weight:900;font-size:clamp(12px,2.2vw,18px);padding:4px}
.card-result{margin:18px auto 0;max-width:560px;background:#fff7fb;border:1px solid #f0c6da;border-radius:18px;padding:12px 20px;box-shadow:0 8px 24px #b65d8420}
.card-result h3{font-family:'Playfair Display',serif;color:#9e4774;margin:4px 0 6px;font-size:22px}
.card-result p{margin:4px;color:#8f5878;line-height:1.5}
.win-modal{position:fixed;inset:0;background:#6d34534d;backdrop-filter:blur(5px);z-index:30;display:flex;align-items:center;justify-content:center;padding:18px}.win-card{max-width:430px;width:100%;background:#fff8fc;border:2px solid #f3c9dd;border-radius:26px;padding:25px;box-shadow:0 20px 60px #68355044;text-align:center}.win-card h3{font-family:'Playfair Display',serif;font-size:27px;color:#9e4774;margin:10px 0}.win-card p{line-height:1.65;color:#8f5878}.win-stars{font-size:24px}.final-letter{background:#fff0f7;border-radius:17px;padding:14px;margin:14px 0;text-align:left;border:1px dashed #e6a8c8}.final-letter h4{color:#a44778;text-align:center;margin:5px 0 10px;font-size:18px}.soft-btn{background:#f6d6e7;color:#9b4775;box-shadow:none}.confetti-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:12}.confetti-layer i{position:absolute;top:-14px;width:9px;height:14px;background:hsl(var(--hue),85%,65%);animation:confettifall 4s linear infinite;opacity:.9;border-radius:2px}.ambient{position:fixed;left:0;right:0;top:0;opacity:.18;pointer-events:none;text-align:center;color:#dc8eb6;letter-spacing:15px;font-size:22px}.birthday-app footer{text-align:center;color:#bd82a1;font-size:12px;margin-top:22px}.ride-scene{min-height:360px}@keyframes flicker{from{transform:scale(.9) rotate(38deg);opacity:.85}to{transform:scale(1.12) rotate(52deg);opacity:1}}@keyframes bob{50%{transform:translateY(-5px)}}@keyframes pulse{50%{opacity:.7;transform:scale(1.05)}}@keyframes glow{to{box-shadow:0 0 28px #ee91be}}@keyframes roadmove{to{background-position:-82px 0}}@keyframes cloudmove{50%{transform:translateX(30px)}}@keyframes float{50%{transform:translateY(-10px)}}@keyframes signmove{0%{transform:translateX(0)}100%{transform:translateX(-35px)}}@keyframes confettifall{to{transform:translateY(110vh) rotate(600deg);opacity:.2}}

@media(max-width:560px){.birthday-app{padding:25px 12px 40px}.music-toggle{top:9px;right:9px;padding:8px 11px;font-size:12px}.eyebrow{margin-top:46px}.cake-scene{transform:scale(.85);margin-top:-4px;margin-bottom:-10px}.ride-scene{height:340px}.milestone{bottom:120px}.sign{padding:5px 8px;font-size:12px}.post{height:42px}.finish{right:1%;padding:7px 9px}

  .primary-btn,.soft-btn{font-size:13px;padding:12px 16px;}

  .win-card{padding:18px;max-height:88vh;overflow:auto;}

}
@media(max-width:560px){
  .card-grid{gap:8px;width:min(100%,420px)}
  .card-back,.card-front{border-radius:12px;border-width:2px}
  .card-back:before{inset:5px;border-radius:8px}
  .card-number{top:7px;left:8px}
  .card-winner{font-size:11px}
  .card-hint{font-size:12px}
}

@media(max-width:560px){
  .card-grid{gap:8px;width:min(100%,420px)}
  .card-back,.card-front{border-radius:12px;border-width:2px}
  .card-back:before{inset:5px;border-radius:8px}
  .card-number{top:7px;left:8px}
  .card-winner{font-size:11px}
  .card-hint{font-size:12px}
}



/* Four-sided, compact photo border */
.memory-wall{position:fixed;z-index:1;inset:0;pointer-events:none;overflow:hidden;padding:0;}
.memory-track{position:absolute;display:flex;gap:10px;width:max-content;height:max-content;align-items:center;}
.memory-track img{display:block;flex:none;width:clamp(62px,7vw,92px);height:clamp(54px,6vw,76px);object-fit:cover;border:4px solid #fff;border-radius:11px;box-shadow:0 3px 0 #d995b6,0 5px 14px #9b527033;background:#f6dce9;}
.edge-top{top:8px;left:0;animation:edgeTopRun 75s linear infinite;}
.edge-bottom{bottom:8px;right:0;animation:edgeBottomRun 82s linear infinite;}
.edge-left{left:8px;top:0;flex-direction:column;animation:edgeLeftRun 88s linear infinite;}
.edge-right{right:8px;bottom:0;flex-direction:column;animation:edgeRightRun 92s linear infinite;}
@keyframes edgeTopRun{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes edgeBottomRun{from{transform:translateX(0)}to{transform:translateX(50%)}}
@keyframes edgeLeftRun{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes edgeRightRun{from{transform:translateY(0)}to{transform:translateY(50%)}}
.birthday-app{padding:105px 118px 105px;min-height:100vh;}
.screen{max-width:760px;min-height:calc(100vh - 150px);}
.party-decor{position:fixed;z-index:2;pointer-events:none;font-size:clamp(28px,4vw,48px);filter:drop-shadow(0 5px 8px #b95c8122);opacity:.9;}
.decor-cake{left:8%;top:22%;}
.decor-balloons{right:8%;top:22%;font-size:clamp(30px,4vw,48px);}
.decor-gift{left:9%;bottom:20%;}
.decor-sparkles{right:8%;bottom:20%;font-size:clamp(22px,3vw,36px);}
.centerpiece-letter{width:min(100%,620px);margin:24px auto 10px;padding:clamp(20px,4vw,34px);background:linear-gradient(145deg,#fffdfd,#fff0f7);border:1px solid #edc2d7;border-radius:25px;box-shadow:0 18px 48px #9f527322, inset 0 0 0 6px #fff8fb;text-align:center;}
.centerpiece-letter .letter-flourish{color:#d17aa4;font-size:23px;letter-spacing:8px;margin-bottom:10px;}
.centerpiece-letter h4{font-family:'Playfair Display',serif;color:#a44778;font-size:clamp(20px,3vw,27px);margin:4px 0 15px;}
.centerpiece-letter p{font-family:'Playfair Display',serif;font-size:clamp(18px,2.5vw,23px);line-height:1.65;color:#75435e;margin:0 auto 15px;}
.centerpiece-letter .letter-signoff{font-size:14px;color:#bd7196;margin:10px 0 18px;font-style:italic;}
.cards-screen{padding:0 18px 30px;}
@media(max-width:700px){
 .birthday-app{padding:92px 58px 95px;}
 .memory-track img{width:clamp(46px,13vw,66px);height:clamp(42px,11vw,58px);border-width:3px;border-radius:8px;}
 .edge-top{top:5px}.edge-bottom{bottom:5px}.edge-left{left:5px}.edge-right{right:5px}
 .party-decor{font-size:25px;opacity:.72;}
 .decor-cake{left:4%;top:18%}.decor-balloons{right:3%;top:18%}
 .decor-gift{left:4%;bottom:17%}.decor-sparkles{right:3%;bottom:17%}
 .screen{min-height:calc(100vh - 130px);}
 .cards-screen{padding:0 4px 24px;}
 .centerpiece-letter{padding:20px 16px;margin:18px auto;}
 .centerpiece-letter p{font-size:18px;line-height:1.55;}
}
@media(max-width:420px){
 .birthday-app{padding-left:48px;padding-right:48px;}
 .memory-track img{width:43px;height:39px;}
 .party-decor{font-size:21px;}
}


/* Alignment and layering fix: photos stay in the perimeter, never over content */
.birthday-app{
  position:relative;
  isolation:isolate;
  padding:clamp(88px, 9vh, 112px) clamp(74px, 9vw, 118px) clamp(88px, 9vh, 112px);
}
.memory-wall{
  position:fixed;
  z-index:0 !important;
  inset:0;
  pointer-events:none;
  overflow:hidden;
}
.memory-track{z-index:0;}
.screen{
  position:relative;
  z-index:5 !important;
  width:100%;
  max-width:820px;
  margin-left:auto;
  margin-right:auto;
}
.party-decor{
  z-index:1 !important;
}
.music-toggle{z-index:30;}
.cards-screen{
  width:100%;
  max-width:820px;
  padding:0 12px 32px;
}
.card-grid{
  margin-left:auto;
  margin-right:auto;
}
.centerpiece-letter{
  position:relative;
  z-index:6;
  margin-left:auto;
  margin-right:auto;
}
@media(max-width:700px){
  .birthday-app{
    padding:82px 52px 88px;
  }
  .screen{
    max-width:100%;
  }
  .cards-screen{padding:0 3px 24px;}
  .party-decor{z-index:1 !important;opacity:.55;}
}
@media(max-width:420px){
  .birthday-app{padding-left:44px;padding-right:44px;}
  .card-grid{width:100%;gap:6px;}
  .mystery-card{min-width:0;}
}


`;
