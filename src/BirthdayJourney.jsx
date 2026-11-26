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
