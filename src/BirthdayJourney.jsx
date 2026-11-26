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
