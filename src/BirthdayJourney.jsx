    margin-top:0 !important;
  }
  .cards-screen h2 { max-width:100%; margin:4px auto 7px !important; }
  .chances { font-size:14px !important; margin:5px 0 !important; }
  .card-hint { font-size:10px !important; line-height:1.35; margin:5px 0 9px !important; }
  .card-grid {
    width:100% !important;
    max-width:100% !important;
    grid-template-columns:repeat(3,minmax(0,1fr)) !important;
    gap:6px !important;
    margin:8px auto 12px !important;
  }
  .mystery-card { width:100%; min-width:0; }
  .card-back,.card-front { border-radius:9px !important; border-width:2px !important; }
  .card-back:before { inset:4px !important; border-radius:6px !important; }
  .card-heart { font-size:clamp(25px,8vw,38px) !important; }
  .card-number { top:5px !important; left:6px !important; font-size:9px !important; }
  .card-back-copy { font-size:9px !important; }
  .card-winner { font-size:9px !important; }
  .card-result { width:100%; padding:10px !important; }
  .centerpiece-letter {
    width:100% !important;
    max-width:100% !important;
    margin:10px auto !important;
    padding:16px 12px !important;
    border-radius:16px !important;
  }
  .centerpiece-letter h4 { font-size:17px !important; }
  .centerpiece-letter p { font-size:13px !important; line-height:1.55 !important; }
  .music-toggle {
    top:57px !important;
    right:7px !important;
    padding:6px 9px !important;
    font-size:10px !important;
  }
  .birthday-app footer {
    width:100%;
    font-size:10px !important;
    margin:8px auto 0 !important;
  }
}
@media (max-width: 380px) {
  .birthday-app { padding-left:56px !important; padding-right:56px !important; }
  .photo-side { width:42px !important; height:68px !important; }
  .top-photo-rail { height:48px !important; }
  .top-photo-track img { width:38px !important; height:32px !important; }
  .screen h1 { font-size:28px !important; }
  .cards-screen h2 { font-size:19px !important; }
  .card-grid { gap:4px !important; }
  .card-back-copy { font-size:8px !important; }
}


/* Separate background song control from the optional personal voice message */
.audio-controls{
  position:fixed;
  z-index:20;
  top:12px;
  right:14px;
  display:flex;
  align-items:center;
  gap:8px;
}
.audio-controls .music-toggle,
.audio-controls .voice-toggle{
  position:static !important;
  border:1px solid rgba(211,132,171,.38);
  border-radius:999px;
  padding:9px 13px;
  background:rgba(255,255,255,.94);
  color:#a84679;
  box-shadow:0 4px 14px rgba(150,73,111,.12);
  font:inherit;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  white-space:nowrap;
}
.audio-controls .voice-toggle{
  background:#f8d9e8;
}
@media(max-width:700px){
  .audio-controls{
    top:56px;
    right:6px;
    left:6px;
    justify-content:center;
    gap:5px;
  }
  .audio-controls .music-toggle,
  .audio-controls .voice-toggle{
    padding:7px 9px;
    font-size:10px;
  }
}
@media(max-width:380px){
  .audio-controls{top:52px;gap:4px;}
  .audio-controls .music-toggle,
  .audio-controls .voice-toggle{padding:6px 7px;font-size:9px;}
}


`;
