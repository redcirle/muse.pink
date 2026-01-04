const tagline = document.getElementById("tagline");

const phraseArray = [
  "在Muse.Pink，",
  "发现",
  "你的声音。"
];

let phraseIndex = 0;
let charIndex = 0;
let isTyping = true;

function typeWriter() {
  const currentPhrase = phraseArray[phraseIndex];
  if (isTyping) {
    if (charIndex < currentPhrase.length) {
      tagline.innerHTML += currentPhrase[charIndex];
      charIndex++;
      setTimeout(typeWriter, 200);
    } else {
      isTyping = false;
      setTimeout(typeWriter, 100);
    }
  } else {
    phraseIndex++;
    if (phraseIndex >= phraseArray.length) {
      setTimeout(() => {
        tagline.innerHTML = "";
        phraseIndex = 0;
        charIndex = 0;
        isTyping = true;
        typeWriter();
      }, 1600);
    } else {
      charIndex = 0;
      isTyping = true;
      setTimeout(typeWriter, 300);
    }
  }
}

function initSwiper() {
  new Swiper(".swiper-container", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 150,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function confirmAndGoXHS() {
  const confirmed = confirm("是否前往[小丑猫]小红书主页？");
  if (confirmed) {
    window.open("https://xhslink.com/m/41ZuKjemtVh", "_blank");
  }
}
function toggleQR() {
  const popup = document.getElementById("qr-popup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}
function toggleWeChatPublicQR() {
  const popup = document.getElementById("wechat-public-qr-popup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}
function confirmAndMail() {
  const confirmed = confirm("是否跳转到邮件应用？");
  if (confirmed) {
    window.location.href = "mailto:hello@joker.red";
  }
}
function toggleSecondQR() {
  const popup = document.getElementById("second-qr-popup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}
function toggleThirdQR() {
  const popup = document.getElementById("third-qr-popup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}
function isWeChatBrowser() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}
let autoHoverIntervalId = null;
let isAutoHoverPaused = false;
let lastButton = null;

function startAutoHoverFooterButtons(interval = 1600) {
  const buttons = Array.from(document.querySelectorAll('.footer-button'));

  function cycleHover() {
    if (isAutoHoverPaused) return;

    if (lastButton) lastButton.classList.remove('auto-hover');

    const candidates = buttons.filter(btn => btn !== lastButton && !(btn.id === "resonance-button" && isPlaying));
    const nextButton = candidates[Math.floor(Math.random() * candidates.length)];

    if (nextButton.id === "resonance-button") {
      autoHoverResonanceButton();
    } else {
      nextButton.classList.add('auto-hover');
    }

    lastButton = nextButton;
  }

  autoHoverIntervalId = setInterval(cycleHover, interval);
}

function pauseAutoHover() {
  isAutoHoverPaused = true;
}

function resumeAutoHover() {
  isAutoHoverPaused = false;
}
function confirmAndGoWeibo() {
  const confirmed = confirm("是否前往[小丑猫]微博主页？");
  if (confirmed) {
    window.open("https://weibo.com/u/7999616775", "_blank");
  }
}
// 与你共鸣按钮音频控制
const resonanceButton = document.getElementById("resonance-button");
const resonanceAudio = document.getElementById("tagline-audio");
let isPlaying = false;

// === 可开关策略：默认关闭（只在点击时播放）===
const ENABLE_RESONANCE_AUDIO_ON_AUTOHOVER = false;   // auto-hover 选中时是否播放
const ENABLE_RESONANCE_AUDIO_ON_MOUSEENTER = false; // 鼠标悬停时是否播放（桌面端易误触，默认关闭）

function triggerResonanceAudio() {
  if (!isPlaying && resonanceAudio) {
    isPlaying = true;
    resonanceAudio.currentTime = 0;
    resonanceAudio.play().catch(e => {
      // 桌面端/非手势触发可能被浏览器拦截自动播放；如果失败要立刻解除暂停，避免 auto-hover 卡住
      console.warn("播放失败:", e);
      isPlaying = false;
      // 保留当前高亮，但恢复自动轮播
      resumeAutoHover();
    });
    resonanceButton.classList.add("auto-hover");
    pauseAutoHover(); // 🔸播放语音时暂停自动轮播
  }
}

resonanceButton.addEventListener("mouseenter", () => {
  if (ENABLE_RESONANCE_AUDIO_ON_MOUSEENTER) triggerResonanceAudio();
});
resonanceButton.addEventListener("click", triggerResonanceAudio);

resonanceAudio.addEventListener("ended", () => {
  isPlaying = false;
  resonanceButton.classList.remove("auto-hover");
  resumeAutoHover(); // 🔸播放完毕恢复轮播
});

// ✅ 自动 hover 调用时的判断逻辑
function autoHoverResonanceButton() {
  // auto-hover 时仍然走到这里：只负责高亮，不强制播放
  resonanceButton.classList.add("auto-hover");

  if (ENABLE_RESONANCE_AUDIO_ON_AUTOHOVER && !isPlaying) {
    triggerResonanceAudio();
  }
}
window.addEventListener("load", () => {
  typeWriter();

  const images = document.querySelectorAll(".swiper-slide img");
  let loaded = 0;

  function checkAndInit() {
    loaded++;
    if (loaded === images.length) {
      initSwiper();
    }
  }
  images.forEach((img) => {
    if (img.complete) {
      checkAndInit();
    } else {
      img.onload = checkAndInit;
      img.onerror = checkAndInit;
    }
  });

  if (images.length === 0) {
    initSwiper();
  }

  startAutoHoverFooterButtons(1600);
});

// === Click to play & resume autohover (non-intrusive helper) ===
(function () {
  var btn = document.getElementById('resonance-button');
  var audio = document.getElementById('tagline-audio');
  if (!btn || !audio) return;

  function syntheticHover(el) {
    try {
      ['mouseenter','mouseover'].forEach(function(type){
        var ev = new Event(type, { bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
      });
    } catch (_) {}
  }

  function clearAutoHoverClasses() {
    try {
      document.querySelectorAll('.auto-hover').forEach(function(n){ n.classList.remove('auto-hover'); });
    } catch (_) {}
  }

  function nextFooterButton(fromEl) {
    var list = Array.prototype.slice.call(document.querySelectorAll('.footer-button'));
    if (!list.length) return null;
    var idx = list.indexOf(fromEl);
    if (idx < 0) idx = -1;
    return list[(idx + 1) % list.length];
  }

  function resumeAutoHover() {
    var next = nextFooterButton(btn);
    if (!next) return;
    clearAutoHoverClasses();
    // small delay to let click styles settle
    setTimeout(function(){
      // mark next as auto-hover target
      next.classList.add('auto-hover');
      syntheticHover(next);
    }, 80);
  }

  btn.addEventListener('click', function () {
    // user gesture: play audio then resume autohover
    try {
      audio.currentTime = 0;
      var p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch(function(e){ /* swallow to avoid unhandled rejection */ });
      }
    } catch(_) {}

    resumeAutoHover();
  }, false);
})();

