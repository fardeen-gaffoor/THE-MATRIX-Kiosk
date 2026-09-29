
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
  let bookUnlocked = false;
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

