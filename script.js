document.addEventListener('DOMContentLoaded', () => {
  
  const mobileFrame = document.querySelector('.mobile-frame');
  const animElements = document.querySelectorAll('.scroll-anim');

  // 1. Smooth Scroll Reveal Animation Function
  function checkScrollAnim() {
    const frameRect = mobileFrame ? mobileFrame.getBoundingClientRect() : { top: 0 };
    const frameHeight = mobileFrame ? mobileFrame.clientHeight : window.innerHeight;

    animElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const relativeTop = rect.top - frameRect.top;
      
      // Trigger reveal when text enters the lower 92% of the visible container
      if (relativeTop <= frameHeight * 0.92) {
        el.classList.add('in-view');
      }
    });
  }

  // Make checkScrollAnim available globally
  window.checkScrollAnim = checkScrollAnim;

  // 2. Audio Controller State & Helper Functions
  const bgMusic = document.getElementById('bgMusic');
  const audioToggle = document.getElementById('audioToggle');
  let isAudioPlaying = false;
  let wasAudioPlayingBeforeHide = false;

  function updateAudioBtnUI() {
    if (!audioToggle) return;
    if (isAudioPlaying) {
      audioToggle.classList.remove('muted');
      audioToggle.classList.add('playing');
    } else {
      audioToggle.classList.remove('playing');
      audioToggle.classList.add('muted');
    }
  }

  function playMusic() {
    if (bgMusic) {
      bgMusic.play().then(() => {
        isAudioPlaying = true;
        wasAudioPlayingBeforeHide = true;
        updateAudioBtnUI();
      }).catch(err => {
        console.log('Audio playback prevented by browser:', err);
      });
    }
  }

  function pauseMusic() {
    if (bgMusic) {
      bgMusic.pause();
      isAudioPlaying = false;
      updateAudioBtnUI();
    }
  }

  // Make playMusic available globally for inline onclick fallbacks
  window.playMusic = playMusic;

  // 3. Entrance Overlay Logic ("OPEN INVITATION")
  const entranceOverlay = document.getElementById('entranceOverlay');
  const openInviteBtn = document.getElementById('openInviteBtn');

  function unlockInvitation() {
    if (!entranceOverlay) return;
    
    // Start playing background music on user gesture
    playMusic();

    entranceOverlay.style.opacity = '0';
    entranceOverlay.style.pointerEvents = 'none';
    if (mobileFrame) {
      mobileFrame.classList.remove('frame-locked');
    }
    setTimeout(() => {
      entranceOverlay.classList.add('hidden');
    }, 600);

    // Initial check for hero section animations
    setTimeout(checkScrollAnim, 100);
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unlockInvitation();
    });
    openInviteBtn.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      unlockInvitation();
    }, { passive: true });
  }

  if (entranceOverlay) {
    entranceOverlay.addEventListener('click', unlockInvitation);
    entranceOverlay.addEventListener('touchstart', unlockInvitation, { passive: true });
  }

  // 4. Mute / Unmute Floating Audio Button Toggle Handler
  if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAudioPlaying) {
        pauseMusic();
        wasAudioPlayingBeforeHide = false;
      } else {
        playMusic();
      }
    });
  }

  // 5. Visibility API: Pause audio when browser/tab is minimized, resume when opening back
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isAudioPlaying) {
        wasAudioPlayingBeforeHide = true;
        pauseMusic();
      }
    } else {
      if (wasAudioPlayingBeforeHide) {
        playMusic();
      }
    }
  });

  window.addEventListener('blur', () => {
    if (isAudioPlaying) {
      wasAudioPlayingBeforeHide = true;
      pauseMusic();
    }
  });

  window.addEventListener('focus', () => {
    if (wasAudioPlayingBeforeHide && !document.hidden) {
      playMusic();
    }
  });

  // 6. Live Countdown Timer Logic (Bulletproof Numeric Date Parsing)
  // Target: December 8, 2026 00:00:00 (Month index 11 = December in JS)
  const targetDate = new Date(2026, 11, 8, 0, 0, 0).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      const daysElem = document.getElementById('count-days');
      const hoursElem = document.getElementById('count-hours');
      const minsElem = document.getElementById('count-mins');

      if (daysElem) daysElem.textContent = days < 10 ? '0' + days : String(days);
      if (hoursElem) hoursElem.textContent = hours < 10 ? '0' + hours : String(hours);
      if (minsElem) minsElem.textContent = minutes < 10 ? '0' + minutes : String(minutes);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 7. Smooth Scroll on "KEEP SCROLLING" Click
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const section2 = document.getElementById('section-2');

  if (scrollDownBtn && section2) {
    scrollDownBtn.addEventListener('click', () => {
      section2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 8. Active Scroll Event Listeners for Section-by-Section Reveal
  checkScrollAnim();
  setTimeout(checkScrollAnim, 200);

  if (mobileFrame) {
    mobileFrame.addEventListener('scroll', checkScrollAnim, { passive: true });
  }
  window.addEventListener('scroll', checkScrollAnim, { passive: true });

});
