// @ts-nocheck
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    
  const tieTrigger = document.getElementById('tieTrigger');
  const bioPanel = document.getElementById('bioPanel');
  const scrim = document.getElementById('scrim');
  const closeBio = document.getElementById('closeBio');

  function openBio(){
    tieTrigger.classList.add('open');
    bioPanel.classList.add('open');
    scrim.classList.add('show');
  }
  function closeBioPanel(){
    tieTrigger.classList.remove('open');
    bioPanel.classList.remove('open');
    scrim.classList.remove('show');
  }
  tieTrigger.addEventListener('click', () => {
    bioPanel.classList.contains('open') ? closeBioPanel() : openBio();
  });
  tieTrigger.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tieTrigger.click(); }
  });
  closeBio.addEventListener('click', closeBioPanel);
  scrim.addEventListener('click', closeBioPanel);

  // Animated Background Sequence (Scrub on Scroll)
  const bgCanvas = document.getElementById('bgCanvas');
  const bgCtx = bgCanvas.getContext('2d');
  const bgFrameCount = 150;
  const bgFrames = [];
  let bgImagesLoaded = 0;
  
  for (let i = 1; i <= bgFrameCount; i++) {
    const img = new Image();
    const num = i.toString().padStart(3, '0');
    img.src = `ezgif-3678613f80d633c3-jpg/ezgif-frame-${num}.jpg`;
    img.onload = () => {
      bgImagesLoaded++;
      if (bgImagesLoaded === 1) renderBgFrame(0);
    };
    bgFrames.push(img);
  }

  let currentBgFrameIndex = -1;
  function renderBgFrame(index) {
    if (index === currentBgFrameIndex) return;
    currentBgFrameIndex = index;
    const img = bgFrames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    if (bgCanvas.width !== img.naturalWidth) bgCanvas.width = img.naturalWidth;
    if (bgCanvas.height !== img.naturalHeight) bgCanvas.height = img.naturalHeight;
    
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.drawImage(img, 0, 0);
  }

  function updateBgScroll() {
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(Math.max(y / maxScroll, 0), 1);
    
    const frameIndex = Math.min(bgFrameCount - 1, Math.floor(progress * (bgFrameCount - 1)));
    requestAnimationFrame(() => renderBgFrame(frameIndex));
  }
  window.addEventListener('scroll', updateBgScroll, {passive:true});
  updateBgScroll();

  // 3D Chakra Canvas Sequence
  const canvas = document.getElementById('chakraCanvas');
  const ctx = canvas.getContext('2d');
  const frameCount = 300; // Total frames
  const frames = [];
  let imagesLoaded = 0;
  
  // Show loading state
  ctx.font = "14px 'Source Sans Pro', sans-serif";
  ctx.fillStyle = "#c9a24b";
  ctx.textAlign = "center";
  ctx.fillText("Loading 3D...", canvas.width/2, canvas.height/2);

  // Preload frames
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    const num = i.toString().padStart(3, '0');
    img.src = `assets/chakra-frames/ezgif-frame-${num}.jpg`;
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 1) renderFrame(0);
    };
    frames.push(img);
  }

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    if (imagesLoaded > 0) renderFrame(currentFrameIndex);
  }
  
  let currentFrameIndex = 0;
  let frameFloat = 0;
  
  function renderFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    
    // Use Math.max to crop the wide black sides and zoom into the chakra
    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);

    // Programmatically remove the black background to guarantee it fits any frame!
    try {
      const physicalW = canvas.width;
      const physicalH = canvas.height;
      const imgData = ctx.getImageData(0, 0, physicalW, physicalH);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 35 && data[i+1] < 35 && data[i+2] < 35) {
          data[i+3] = 0; // set alpha to 0 for dark pixels
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch(e) {}
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 0); // Wait for initial render layout

  // Scroll-driven animation
  let lastScrollYChakra = window.scrollY;
  function updateChakraCanvas() {
    const y = window.scrollY;
    const delta = y - lastScrollYChakra;
    lastScrollYChakra = y;
    
    if (delta !== 0) {
      frameFloat += delta * 0.12; 
      
      while (frameFloat >= frameCount) frameFloat -= frameCount;
      while (frameFloat < 0) frameFloat += frameCount;
      
      const newFrame = Math.floor(frameFloat);
      if (newFrame !== currentFrameIndex) {
        currentFrameIndex = newFrame;
        requestAnimationFrame(() => renderFrame(currentFrameIndex));
      }
    }
  }
  window.addEventListener('scroll', updateChakraCanvas, { passive: true });

  // Constitution book — scroll through its spacer to turn pages
  const CHAPTERS = [
    { l: {h:"August 1947", p:"The Constituent Assembly forms a Drafting Committee of seven members. Ambedkar, a trained jurist educated at Columbia and the LSE, is chosen as Chairman."},
      r: {h:"The Burden of One Pen", p:"Illness and absence leave Ambedkar carrying most of the drafting alone — reading the constitutions of over sixty countries to shape India's own."},
      ql:"Life should be great rather than long.", qr:"Cultivation of mind should be the ultimate aim of human existence." },
    { l: {h:"Fundamental Rights", p:"He insists equality before law, abolition of untouchability, and freedom of religion be written in as enforceable rights, not mere ideals."},
      r: {h:"A Government That Answers", p:"Separation of powers, an independent judiciary, and universal adult franchise are drafted to guard against the concentration of power he had studied abroad."},
      ql:"I measure the progress of a community by the degree of progress which women have achieved.", qr:"Law and order are the medicine of the body politic and when the body politic gets sick, medicine must be administered." },
    { l: {h:"25 November 1949", p:"In his closing address to the Assembly, he warns that political democracy must rest on social and economic democracy, or it will not endure."},
      r: {h:"26 January 1950", p:"The Constitution comes into force. The manuscript he shepherded becomes the framework this archive exists to preserve and explain."},
      ql:"Political tyranny is nothing compared to the social tyranny.", qr:"A great man is different from an eminent one in that he is ready to be the servant of the society." }
  ];
  const pageLeft = document.getElementById('pageLeft');
  const pageRight = document.getElementById('pageRight');
  const progFill = document.getElementById('progFill');
  const bookSpacer = document.getElementById('bookSpacer');
  const quoteLeft = document.getElementById('quoteLeft');
  const quoteRight = document.getElementById('quoteRight');
  let currentChapter = -1;
  
  function renderChapter(i){
    if(i === currentChapter) return;
    const dir = i > currentChapter ? 1 : -1;
    currentChapter = i;
    const c = CHAPTERS[i];
    
    pageRight.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    pageRight.style.transform = `rotateY(${-160*dir}deg) translateZ(2px)`;
    
    if (quoteLeft && quoteRight) {
      quoteLeft.style.opacity = '0';
      quoteRight.style.opacity = '0';
    }
    
    setTimeout(() => {
      pageLeft.innerHTML = `<h4>${c.l.h}</h4><p>${c.l.p}</p><span class="fol">${i*2+1}</span>`;
      pageRight.innerHTML = `<h4>${c.r.h}</h4><p>${c.r.p}</p><span class="fol">${i*2+2}</span>`;
      pageRight.style.transition = 'none';
      pageRight.style.transform = 'rotateY(-1deg) translateZ(0px)';
      
      if (quoteLeft && quoteRight) {
        quoteLeft.innerText = c.ql;
        quoteRight.innerText = c.qr;
        quoteLeft.style.opacity = '0.9';
        quoteRight.style.opacity = '0.9';
      }
    }, 260);
  }
  let bookUnlocked = false;
  function updateBook(){
    const rect = bookSpacer.getBoundingClientRect();
    const total = bookSpacer.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;
    progFill.style.width = (progress*100) + '%';
    const chapterIndex = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length));
    if(progress > 0.001 || rect.top < window.innerHeight) renderChapter(chapterIndex);
    bookUnlocked = progress >= 0.99;
    document.getElementById('bookLockHint').classList.toggle('done', bookUnlocked);
  }
  window.addEventListener('scroll', updateBook, {passive:true});
  updateBook();

  // Hold the reader inside the book until every chapter has been scrolled past
  const constitutionSection = document.getElementById('constitution');
  function bookInProgress(){
    const r = constitutionSection.getBoundingClientRect();
    return r.top <= 1 && r.bottom > window.innerHeight;
  }
  window.addEventListener('wheel', (e) => {
    if(e.deltaY > 0 && !bookUnlocked && bookInProgress()){
      e.preventDefault();
      window.scrollBy(0, Math.max(4, e.deltaY * 0.55));
    }
  }, {passive:false});

  let touchStartY = null;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, {passive:true});
  window.addEventListener('touchmove', (e) => {
    if(touchStartY === null) return;
    const dy = touchStartY - e.touches[0].clientY;
    if(dy > 0 && !bookUnlocked && bookInProgress()){
      e.preventDefault();
      window.scrollBy(0, Math.max(3, dy * 0.5));
      touchStartY = e.touches[0].clientY;
    }
  }, {passive:false});

  // Kiosk device — tap a tab, swap the panel
  document.getElementById('kioskTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.kt');
    if(!btn) return;
    document.querySelectorAll('.kt').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.kpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('kp-' + btn.dataset.panel).classList.add('active');
  });



  }, []);

  return (
    <>
      

<canvas className="site-bg-canvas" id="bgCanvas"></canvas>
<div className="site-bg" id="siteBg"></div>
<div className="weave"></div>

{/*  Interactive tie corner element  */}
<div className="tie-trigger" id="tieTrigger" role="button" aria-label="Pull tie to reveal Dr. Ambedkar's story" tabIndex={0}>
  <div className="tie-3d">
    <div className="tie-knot">
      <div className="side"></div><div className="face"></div>
    </div>
    <div className="tie-body" id="tieBody">
      <div className="face"></div>
      <div className="fold" style={{top: '20%'}}></div>
      <div className="fold" style={{top: '45%'}}></div>
      <div className="fold" style={{top: '70%'}}></div>
    </div>
  </div>
  <div className="tie-hint">PULL&nbsp;THE&nbsp;TIE</div>
</div>
<div className="scrim" id="scrim"></div>
<aside className="bio-panel" id="bioPanel">
  <button className="close-x" id="closeBio" aria-label="Close">&times;</button>
  <h2>Dr. Bhimrao Ramji Ambedkar</h2>
  <div className="role">1891 – 1956 &nbsp;·&nbsp; Architect of the Indian Constitution</div>
  <p>Born into a community denied basic dignity, he became one of the most formally educated Indians of his generation — degrees from Bombay, Columbia University, and the London School of Economics — and turned that learning into a lifelong argument for equality.</p>
  <p>As Chairman of the Drafting Committee, he shaped the Constitution of India, embedding fundamental rights, safeguards against discrimination, and a framework for social justice into the nation's founding law.</p>
  <p>Beyond the Constitution, he was an economist, jurist, editor, and reformer — founding journals, building movements against untouchability, and arguing for labour rights, education, and the political voice of the marginalised.</p>
  <ul className="facts">
    <li><b>Born</b> 14 April 1891, Mhow, Central Provinces</li>
    <li><b>Education</b> Columbia University, LSE, Gray's Inn</li>
    <li><b>Role</b> Chairman, Constitution Drafting Committee</li>
    <li><b>Legacy</b> Bharat Ratna, 1990</li>
  </ul>
</aside>

<header>
  <div className="brand">
    <div className="brand-mark"></div>
    <div className="brand-text">Samvidhan Archive<small>DR. AMBEDKAR INTERNATIONAL CENTRE</small></div>
  </div>
  <nav>
    <a href="#archive">Archive</a>
    <a href="#features">Platform</a>
    <a href="#timeline">Timeline</a>
    <a href="#kiosk">Kiosk</a>
  </nav>
</header>

<section className="hero" data-bg="assets/background/ambedkar.png" style={{overflow: 'hidden'}}>
  {/*  Floating Background Images to fill empty spots  */}
  <img src="amedkar.webp" className="floating-image fl-img-1" alt="Ambedkar Portrait" />
  <img src="dr ait main building.webp" className="floating-image fl-img-2" alt="Dr. AIT Campus" />
  <img src="family of ambedkar.jpg" className="floating-image fl-img-3" alt="Ambedkar with family" />
  <img src="amedkar in 1935.jpg" className="floating-image fl-img-4" alt="Ambedkar in 1935" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Dr._Babasaheb_Ambedkar%2C_Drafting_Committee_Chairman_of_the_Indian_Constitution.jpg/640px-Dr._Babasaheb_Ambedkar%2C_Drafting_Committee_Chairman_of_the_Indian_Constitution.jpg" className="floating-image fl-img-5" alt="Drafting Committee Chairman" />
  <img src="dr ait main building.webp" className="floating-image fl-img-6" alt="Dr AIT Main Building" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/B.R._Ambedkar.jpg/640px-B.R._Ambedkar.jpg" className="floating-image fl-img-7" alt="Ambedkar" />
  <img src="ambedkar giving speech.jpg" className="floating-image fl-img-8" alt="Ambedkar delivering speech" />
  <img src="dog.jpg" className="floating-image fl-img-9" alt="Ambedkar with his dog" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Babasaheb_Ambedkar_with_his_wife_Savita_Ambedkar.jpg/640px-Babasaheb_Ambedkar_with_his_wife_Savita_Ambedkar.jpg" className="floating-image fl-img-10" alt="Ambedkar with his wife" />

  <div className="hero-copy" style={{background: 'rgba(31,53,94,0.75)', padding: '34px', borderRadius: '16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,162,75,0.4)', zIndex: '5', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
    <div className="eyebrow-line"><div className="rule"></div><span>DIGITAL HERITAGE &amp; KNOWLEDGE PLATFORM</span></div>
    
    <div style={{display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px'}}>
      <img src="amedkar.webp" alt="Dr. B.R. Ambedkar" style={{width: '110px', height: '110px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--gold)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', flexShrink: '0', marginTop: '8px'}} />
      <h1 style={{marginBottom: '0'}}>Every word he wrote,<br />held in <em>one archive</em>.</h1>
    </div>
    
    <p className="lede" style={{color: '#fff', maxWidth: '100%'}}>An AI-guided institutional archive for Dr. B. R. Ambedkar's speeches, manuscripts, and constitutional debates — searchable, multilingual, and built for interactive kiosks at the Dr. Ambedkar International Centre.</p>
    
    <div style={{marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(201,162,75,0.3)', display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '18px', borderRadius: '12px'}}>
      <img src="dr ait main building.webp" alt="Dr. Ambedkar Institute of Technology" style={{width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 6px 16px rgba(0,0,0,0.4)', border: '1px solid var(--gold)', flexShrink: '0'}} />
      <div>
        <h4 style={{margin: '0 0 6px 0', color: 'var(--gold)', fontFamily: 'var(--serif)', fontSize: '1.15rem'}}>In Partnership with Dr. AIT</h4>
        <p style={{fontSize: '0.9rem', color: '#f3ecdf', margin: '0', lineHeight: '1.45'}}>Connecting the Dr. Ambedkar Institute of Technology community with this vast digital heritage to inspire the next generation of engineers and scholars.</p>
      </div>
    </div>

    <div className="hero-actions">
      <button className="btn-primary">Enter the Archive</button>
      <button className="btn-ghost">Watch the Kiosk Demo</button>
    </div>
  </div>
  <div className="hero-visual">
    <div className="insignia">
      <div className="plate"></div>
      <div className="caption">समता · न्याय · संविधान</div>
      <div className="chakra-mount">
        <canvas id="chakraCanvas"></canvas>
      </div>
      <div className="chakra-note">SCROLL TO SPIN</div>
      <div className="book">
        <div className="book-spine"></div>
        <div className="book-pages"></div>
      </div>
    </div>
  </div>
</section>

<section id="features" data-bg="assets/background/ambedkar.png">
  <div className="section-head">
    <div className="rule-row"><div className="rule"></div><span>PLATFORM CAPABILITIES</span></div>
    <h2>Built for scholars, students, and first-time visitors alike</h2>
    <p>Six systems work together behind every kiosk and smart display — from raw manuscript to living conversation.</p>
  </div>
  <div className="modules">
    <div className="module"><span className="num">01</span><div className="glyph g-search"></div><h3>Semantic Search</h3><p>AI-powered knowledge mapping connects a single query to speeches, footnotes, and debate transcripts across the whole collection.</p></div>
    <div className="module"><span className="num">02</span><div className="glyph g-ocr"></div><h3>Manuscript Digitisation</h3><p>OCR recovers fragile handwritten pages and early print into searchable, preservable text without touching the original.</p></div>
    <div className="module"><span className="num">03</span><div className="glyph g-lang"></div><h3>Multilingual Access</h3><p>Live translation and audio narration open every document to visitors in their own language, read aloud on request.</p></div>
    <div className="module"><span className="num">04</span><div className="glyph g-av"></div><h3>Audio-Visual Archive</h3><p>Lectures, documentaries, and interviews are catalogued and cross-linked to the texts they discuss.</p></div>
    <div className="module"><span className="num">05</span><div className="glyph g-time"></div><h3>Interactive Timeline</h3><p>A memorial storytelling module walks visitors chronologically through his life, work, and constitutional legacy.</p></div>
    <div className="module"><span className="num">06</span><div className="glyph g-ai"></div><h3>AI Research Assistant</h3><p>Answers grounded in the archive itself — every response traceable to a source document, never invented.</p></div>
  </div>
</section>

<section id="timeline" data-bg="assets/background/ambedkar.png">
  <div className="section-head">
    <div className="rule-row"><div className="rule"></div><span>A LIFE, IN RECORD</span></div>
    <h2>Milestones the archive is built around</h2>
  </div>
  <div className="timeline">
    <div className="t-item"><div className="yr">1907 – 1923</div><h4>Formal education abroad</h4><p>Degrees from Columbia University and the London School of Economics, at a time few Indians of any background reached either.</p></div>
    <div className="t-item"><div className="yr">1927</div><h4>Mahad Satyagraha</h4><p>Leads a march to assert the right of the depressed classes to draw water from a public tank — a founding act of the civil rights movement he led.</p></div>
    <div className="t-item"><div className="yr">1947 – 1949</div><h4>Drafting the Constitution</h4><p>As Chairman of the Drafting Committee, shapes the document that defines India's fundamental rights and structure of government.</p></div>
    <div className="t-item"><div className="yr">1956</div><h4>Conversion at Nagpur</h4><p>Leads a mass conversion to Buddhism, a final public act rooted in decades of argument against caste-based exclusion.</p></div>
    <div className="t-item"><div className="yr">1990</div><h4>Bharat Ratna</h4><p>Posthumously awarded India's highest civilian honour, decades after his death in 1956.</p></div>
  </div>
</section>

<section className="constitution" id="constitution" data-bg="assets/background/ambedkar.png">
  <div className="section-head">
    <div className="rule-row"><div className="rule"></div><span>HOW IT CAME TO BE</span></div>
    <h2>The Constitution of India, in his own hand</h2>
    <p>Scroll to turn the pages — from the Drafting Committee's first sitting to the document signed in 1950.</p>
  </div>
  <div className="book-progress"><div className="fill" id="progFill"></div></div>
  <div className="book-lock-hint" id="bookLockHint">Keep scrolling to read every page — the archive continues once you've reached the end</div>
  <div className="book-scroller" id="bookScroller">
    <div className="book-frame">
      <div className="floating-quote left" id="quoteLeft"></div>
      <div className="floating-quote right" id="quoteRight"></div>
      <div className="open-book">
        <div className="page-stack left"></div>
        <div className="page-stack right"></div>
        <div className="page page-left" id="pageLeft">
          <h4>August 1947</h4>
          <p>The Constituent Assembly forms a Drafting Committee of seven members. Ambedkar, a trained jurist with degrees from Columbia and the LSE, is chosen as Chairman.</p>
          <span className="fol">i</span>
        </div>
        <div className="page page-right" id="pageRight">
          <h4>The Burden of One Pen</h4>
          <p>Of the original seven, illness and absence leave Ambedkar carrying most of the drafting alone — reading constitutions of over sixty countries to shape India's own.</p>
          <span className="fol">ii</span>
        </div>
      </div>
    </div>
    <div className="book-spacer" id="bookSpacer"></div>
  </div>
</section>

<section id="kiosk" data-bg="assets/background/ambedkar.png">
  <div className="section-head">
    <div className="rule-row"><div className="rule"></div><span>AT THE KIOSK</span></div>
    <h2>What a visitor actually taps through</h2>
    <p>The same screen a visitor stands in front of at the Centre — tap a tab below to try it.</p>
  </div>
  <div className="kiosk-wrap">
    <div className="kiosk-device">
      <div className="kiosk-screen">
        <div className="kiosk-tabs" id="kioskTabs">
          <button className="kt active" data-panel="home">Home</button>
          <button className="kt" data-panel="search">Search</button>
          <button className="kt" data-panel="timeline">Timeline</button>
          <button className="kt" data-panel="ai">Ask AI</button>
        </div>
        <div className="kiosk-panels">
          <div className="kpanel active" id="kp-home">
            <div className="k-grid">
              <div className="k-tile"><div className="ic"></div><h5>Speeches</h5><span>240 records</span></div>
              <div className="k-tile"><div className="ic"></div><h5>Manuscripts</h5><span>68 digitised</span></div>
              <div className="k-tile"><div className="ic"></div><h5>Constitution</h5><span>395 articles</span></div>
              <div className="k-tile"><div className="ic"></div><h5>Photographs</h5><span>1,200 images</span></div>
              <div className="k-tile"><div className="ic"></div><h5>Documentaries</h5><span>18 films</span></div>
              <div className="k-tile"><div className="ic"></div><h5>Journals</h5><span>Mook Nayak &amp; more</span></div>
            </div>
          </div>
          <div className="kpanel" id="kp-search">
            <div className="kiosk-side">
              <div className="q">ASK THE ARCHIVE</div>
              <div className="search-bar">What did he argue in the Poona Pact?<span className="dot"></span></div>
              <div className="chip-row">
                <div className="chip">Constitution</div>
                <div className="chip">Speeches</div>
                <div className="chip">Manuscripts</div>
                <div className="chip">Photographs</div>
              </div>
            </div>
            <div className="kiosk-main">
              <div className="result"><h5>Annihilation of Caste</h5><span>Manuscript · 1936</span><p>The undelivered address, now fully searchable with translated commentary and OCR-verified original pages.</p></div>
              <div className="result"><h5>Constituent Assembly Debates</h5><span>Transcript · 25 Nov 1949</span><p>Closing address to the Constituent Assembly, cross-linked to related articles of the Constitution.</p></div>
              <div className="result"><h5>Mook Nayak</h5><span>Journal · 1920</span><p>Early editorial writing, digitised from archival microfilm and indexed by theme.</p></div>
            </div>
          </div>
          <div className="kpanel" id="kp-timeline">
            <div className="k-time">
              <div className="k-node"><div className="dotm"></div><div className="yr">1907</div><p>Enters Elphinstone College after clearing his matriculation.</p></div>
              <div className="k-node"><div className="dotm"></div><div className="yr">1923</div><p>Returns from the LSE and Columbia, doctorate in hand.</p></div>
              <div className="k-node"><div className="dotm"></div><div className="yr">1936</div><p>Writes "Annihilation of Caste," undelivered but widely read.</p></div>
              <div className="k-node"><div className="dotm"></div><div className="yr">1949</div><p>Presents the completed Constitution to the Assembly.</p></div>
              <div className="k-node"><div className="dotm"></div><div className="yr">1956</div><p>Leads a mass conversion to Buddhism at Nagpur.</p></div>
            </div>
          </div>
          <div className="kpanel" id="kp-ai">
            <div className="k-chat">
              <div className="k-bubble user">Why did he call it "Annihilation of Caste" rather than reform?</div>
              <div className="k-bubble ai">Because he argued caste could not be reformed piece by piece — it had to be rejected as a system entirely, since its logic depended on hierarchy itself.<span className="src">Source: Annihilation of Caste, 1936</span></div>
              <div className="k-bubble user">Show me where that appears in the Constitution.</div>
              <div className="k-bubble ai">Article 17 abolishes untouchability outright — a direct line from that 1936 argument to enforceable law.<span className="src">Source: Constitution of India, Art. 17</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="kiosk-stand"><div className="neck"></div><div className="base"></div></div>
    </div>
  </div>
</section>

<footer>
  <div>Samvidhan Archive — a concept UI for the Dr. Ambedkar International Centre.</div>
  <div className="gold">Pull the tie, top right, for his story.</div>
</footer>


    </>
  );
}



