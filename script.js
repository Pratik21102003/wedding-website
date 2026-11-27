const envelope = document.getElementById("openEnvelope");
const heroPage = document.getElementById("heroPage");
const blessingPage = document.getElementById("blessingPage");
const heroArtboard = document.querySelector(".hero-artboard");
const countdownPage = document.getElementById("countdownPage");
const venuePage = document.getElementById("venuePage");
const closingPage = document.getElementById("closingPage");
const openingPage = document.querySelector(".opening-page");
const musicToggle = document.getElementById("musicToggle");
const weddingAudio = document.getElementById("weddingAudio");
const petalOverlay = document.getElementById("petalOverlay");
const invitationPanels = [heroArtboard, blessingPage, countdownPage, venuePage, closingPage];
let activePanel = null;
let musicPlaying = false;

function updateMusicToggle() {
  musicToggle.textContent = musicPlaying ? "♫ Music on" : "♫ Music off";
  musicToggle.setAttribute("aria-label", musicPlaying ? "Pause wedding music" : "Play wedding music");
  musicToggle.setAttribute("aria-pressed", String(musicPlaying));
}

async function startWeddingMusic() {
  try {
    await weddingAudio.play();
    musicPlaying = true;
    updateMusicToggle();
  } catch (error) {
    musicPlaying = false;
    updateMusicToggle();
    console.error("Could not start the wedding music:", error);
  }
}

function stopWeddingMusic(resetPlayback = false) {
  musicPlaying = false;
  weddingAudio.pause();
  if (resetPlayback && weddingAudio.readyState > 0) weddingAudio.currentTime = 0;
  updateMusicToggle();
}

function createPetals() {
  const colors = ["#b83b50", "#d56b79", "#c89a45", "#e7a5a9"];
  for (let index = 0; index < 28; index += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    setPetalPath(petal);
    petal.style.setProperty("--petal-size", `${8 + Math.random() * 8}px`);
    petal.style.setProperty("--petal-delay", `${Math.random() * 1.4}s`);
    petal.style.setProperty("--petal-duration", `${3.2 + Math.random() * 1.8}s`);
    petal.style.setProperty("--petal-color", colors[index % colors.length]);
    petal.addEventListener("animationiteration", () => setPetalPath(petal));
    petalOverlay.append(petal);
  }
}

function setPetalPath(petal) {
  petal.style.setProperty("--petal-x", `${Math.random() * 100}%`);
  petal.style.setProperty("--petal-drift", `${Math.random() * 180 - 90}px`);
}

createPetals();

function showerPetals() {
  petalOverlay.classList.add("active");
}

function showPage(pageToShow, pageToHide) {
  pageToShow.classList.add("visible");
  pageToShow.setAttribute("aria-hidden", "false");
  pageToShow.removeAttribute("inert");
  if (pageToShow === heroPage) {
    heroPage.scrollTo({ top: 0, behavior: "instant" });
    setActivePanel(heroArtboard);
  }
  if (pageToShow === openingPage) envelope.focus({ preventScroll: true });
  pageToHide.classList.remove("visible");
  pageToHide.setAttribute("inert", "");
  pageToHide.setAttribute("aria-hidden", "true");
}

function setActivePanel(panel) {
  if (panel === activePanel) return;
  activePanel = panel;

  for (const invitationPanel of invitationPanels) {
    const isActive = invitationPanel === panel;
    invitationPanel.toggleAttribute("inert", !isActive);
    invitationPanel.setAttribute("aria-hidden", String(!isActive));
  }

  panel.querySelector("h1, h2")?.focus({ preventScroll: true });
}

function updateActivePanel() {
  const activationPoint = heroPage.scrollTop + heroPage.clientHeight * 0.5;
  const activeSection = [...invitationPanels]
    .reverse()
    .find((panel) => panel.offsetTop <= activationPoint);
  setActivePanel(activeSection || heroArtboard);
}

envelope.addEventListener("click", () => {
  if (heroPage.classList.contains("visible")) return;
  showerPetals();
  startWeddingMusic();
  envelope.classList.remove("opening");
  window.requestAnimationFrame(() => {
    envelope.classList.add("opening");
  });
  openingPage.classList.add("leaving");
  window.setTimeout(() => {
    showPage(heroPage, openingPage);
  }, 450);
});

document.querySelector(".replay-envelope").addEventListener("click", () => {
  stopWeddingMusic(true);
  petalOverlay.classList.remove("active");
  openingPage.classList.remove("leaving");
  showPage(openingPage, heroPage);
});

musicToggle.addEventListener("click", () => {
  if (musicPlaying) stopWeddingMusic();
  else startWeddingMusic();
});

heroPage.addEventListener("scroll", updateActivePanel, { passive: true });

const weddingTimestamp = Date.UTC(2027, 1, 22, 14, 0, 0);
const countdownValues = {
  days: document.querySelector('[data-time-unit="days"]'),
  hours: document.querySelector('[data-time-unit="hours"]'),
  minutes: document.querySelector('[data-time-unit="minutes"]'),
  seconds: document.querySelector('[data-time-unit="seconds"]'),
};

function updateCountdown() {
  const remainingSeconds = Math.max(0, Math.floor((weddingTimestamp - Date.now()) / 1000));
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  countdownValues.days.textContent = String(days);
  countdownValues.hours.textContent = String(hours).padStart(2, "0");
  countdownValues.minutes.textContent = String(minutes).padStart(2, "0");
  countdownValues.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const scratchFoil = document.querySelector(".scratch-foil");
const scratchMedallion = document.querySelector(".scratch-medallion");
const scratchPanel = document.querySelector(".scratch-panel");
const quickReveal = document.querySelector(".quick-reveal");
const scratchContext = scratchFoil.getContext("2d", { willReadFrequently: true });
let isScratching = false;
let lastScratchPoint = null;

function drawScratchFoil() {
  const bounds = scratchFoil.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  scratchFoil.width = Math.round(bounds.width * scale);
  scratchFoil.height = Math.round(bounds.height * scale);
  scratchContext.setTransform(scale, 0, 0, scale, 0, 0);

  const gradient = scratchContext.createLinearGradient(0, 0, bounds.width, bounds.height);
  gradient.addColorStop(0, "#dcb65d");
  gradient.addColorStop(0.42, "#a97825");
  gradient.addColorStop(0.68, "#e2bd67");
  gradient.addColorStop(1, "#95651e");
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, bounds.width, bounds.height);
  scratchContext.strokeStyle = "rgba(255, 232, 161, 0.75)";
  scratchContext.lineWidth = 2;
  scratchContext.beginPath();
  scratchContext.arc(bounds.width / 2, bounds.height / 2, bounds.width * 0.42, 0, Math.PI * 2);
  scratchContext.stroke();
  scratchContext.font = `bold ${Math.round(bounds.width * 0.09)}px Georgia, serif`;
  scratchContext.textAlign = "center";
  scratchContext.textBaseline = "middle";
  scratchContext.fillStyle = "#51360f";
  scratchContext.fillText("✦ SCRATCH ✦", bounds.width / 2, bounds.height / 2 - 7);
  scratchContext.font = `bold ${Math.round(bounds.width * 0.055)}px Arial, sans-serif`;
  scratchContext.fillText("TO REVEAL DATE", bounds.width / 2, bounds.height / 2 + 11);

  let seed = 12;
  for (let i = 0; i < 180; i += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = (seed / 2147483647) * bounds.width;
    seed = (seed * 16807) % 2147483647;
    const y = (seed / 2147483647) * bounds.height;
    const radius = (i % 3) * 0.35 + 0.35;
    scratchContext.beginPath();
    scratchContext.arc(x, y, radius, 0, Math.PI * 2);
    scratchContext.fillStyle = i % 2 ? "rgba(255, 238, 181, 0.5)" : "rgba(89, 55, 14, 0.25)";
    scratchContext.fill();
  }

  scratchContext.globalCompositeOperation = "destination-out";
}

function scratchAt(event) {
  const bounds = scratchFoil.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  if (!lastScratchPoint) {
    lastScratchPoint = { x, y };
    scratchContext.beginPath();
    scratchContext.arc(x, y, 15, 0, Math.PI * 2);
    scratchContext.fill();
    return;
  }

  scratchContext.beginPath();
  scratchContext.moveTo(lastScratchPoint.x, lastScratchPoint.y);
  scratchContext.lineTo(x, y);
  scratchContext.lineWidth = 30;
  scratchContext.lineCap = "round";
  scratchContext.lineJoin = "round";
  scratchContext.stroke();
  lastScratchPoint = { x, y };
}

function scratchPointerMove(event) {
  const events = event.getCoalescedEvents?.() || [event];
  for (const pointerEvent of events) scratchAt(pointerEvent);
}

function finishScratch() {
  isScratching = false;
  lastScratchPoint = null;
  revealIfScratchedEnough();
}

function revealIfScratchedEnough() {
  const pixels = scratchContext.getImageData(0, 0, scratchFoil.width, scratchFoil.height).data;
  let transparentSamples = 0;
  let totalSamples = 0;

  for (let i = 3; i < pixels.length; i += 16) {
    totalSamples += 1;
    if (pixels[i] < 64) transparentSamples += 1;
  }

  if (transparentSamples / totalSamples > 0.28) {
    revealDate();
  }
}

function revealDate() {
  scratchMedallion.classList.add("revealed");
  scratchPanel.classList.add("revealed");
  scratchFoil.setAttribute("aria-label", "Date revealed: 22 February, 2027");
  quickReveal.hidden = true;
}

quickReveal.addEventListener("click", revealDate);

scratchFoil.addEventListener("pointerdown", (event) => {
  if (scratchMedallion.classList.contains("revealed")) return;
  isScratching = true;
  lastScratchPoint = null;
  scratchFoil.setPointerCapture(event.pointerId);
  scratchAt(event);
});

scratchFoil.addEventListener("pointermove", (event) => {
  if (isScratching && !scratchMedallion.classList.contains("revealed")) scratchPointerMove(event);
});

scratchFoil.addEventListener("pointerup", finishScratch);

scratchFoil.addEventListener("pointercancel", () => {
  isScratching = false;
  lastScratchPoint = null;
});

scratchFoil.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    revealDate();
  }
});

window.addEventListener("resize", drawScratchFoil);
drawScratchFoil();

envelope.addEventListener("animationend", () => {
  envelope.classList.remove("opening");
});
