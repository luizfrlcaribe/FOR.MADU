// script.js - Interações e animações para a experiência suave

const introOverlay = document.getElementById('introOverlay');
const introInput = document.getElementById('introInput');
const introSubmit = document.getElementById('introSubmit');
const introFeedback = document.getElementById('introFeedback');
const pageShell = document.getElementById('pageShell');
const audioButton = document.getElementById('audioButton');
const ambientAudio = document.getElementById('ambientAudio');
const starScene = document.getElementById('starScene');
const starMessage = document.getElementById('starMessage');

const starPhrases = [
  'Seu sorriso parece uma estrela que nasce no silêncio da noite.',
  'Há algo em você que faz até a lua querer ficar mais perto.',
  'Seu olhar traz calma e um desejo suave de ficar mais um pouco.',
  'Quando penso em você, o mundo fica mais leve e mais quente.',
  'Seu jeito é como um segredo doce que eu quero guardar com cuidado.',
  'Existe uma poesia no modo como você simplesmente existe.'
];

const heartOverlay = document.getElementById('heartOverlay');
const heartButton = document.getElementById('heartButton');
const heartClose = document.getElementById('heartClose');
const typedName = document.getElementById('typedName');
const heartText = document.getElementById('heartText');

let lastPhraseIndex = -1;
let playingAudio = false;
let heartTypingTimer = null;

function initialize() {
  createStars(120);
  setupScrollReveal();
  bindEvents();
  animateBackgroundParticles();
  createCursorGlow();
}

function bindEvents() {
  if (introSubmit && introInput) {
    introSubmit.addEventListener('click', handleIntroSubmit);
    introInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleIntroSubmit();
      }
    });
  }

  if (heartButton) {
    heartButton.addEventListener('click', handleHeartButton);
  }

  if (heartClose) {
    heartClose.addEventListener('click', closeHeartOverlay);
  }

  if (audioButton) {
    audioButton.addEventListener('click', toggleAudioPlayback);
  }

  document.addEventListener('mousemove', handleMouseParallax);
}

function handleIntroSubmit() {
  const answer = introInput ? normalizeName(introInput.value) : '';
  if (!answer) {
    setIntroFeedback('Responda novamente, por favor.');
    return;
  }

  if (isAcceptedName(answer)) {
    introFeedback.textContent = 'Acertou! Redirecionando...';
    introFeedback.classList.remove('wrong');
    introFeedback.classList.add('correct');
    introOverlay.classList.add('hidden');
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.style.display = 'none';
      introOverlay.style.pointerEvents = 'none';
      introOverlay.style.visibility = 'hidden';
      document.body.style.overflow = 'auto';
      pageShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 900);
  } else {
    setIntroFeedback('Responda novamente.');
  }
}

function normalizeName(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ');
}

function isAcceptedName(value) {
  const accepted = [
    'maria eduarda',
    'mariaeduarda',
    'duda',
    'madu',
    'm eduarda',
    'eduarda',
    'maria d',
    'm d',
    'ma eduarda',
    'madududa'
  ];
  if (accepted.includes(value)) {
    return true;
  }

  return accepted.some((name) => value === name || value.endsWith(` ${name}`));
}

function setIntroFeedback(message) {
  introFeedback.textContent = message;
  introFeedback.classList.remove('correct');
  introFeedback.classList.add('wrong');
}

function handleHeartButton() {
  heartOverlay.classList.add('active');
  typedName.textContent = '';
  heartText.textContent = '';
  heartText.classList.remove('visible');
  playHeartAnimation();
}

function closeHeartOverlay() {
  heartOverlay.classList.remove('active');
  clearTimeout(heartTypingTimer);
}

function playHeartAnimation() {
  typedName.textContent = '';
  heartText.textContent = '';
  heartText.classList.remove('visible');

  const heartShape = [
    '         ♥         ',
    '       ♥   ♥       ',
    '     ♥       ♥     ',
    '   ♥         ♥     ',
    '  ♥           ♥    ',
    '  ♥           ♥    ',
    '   ♥         ♥     ',
    '     ♥       ♥     ',
    '       ♥   ♥       ',
    '         ♥         '
  ];

  heartText.textContent = heartShape.join('\n');
  heartText.classList.add('visible');
}

function toggleAudioPlayback() {
  const sourcePath = ambientAudio.dataset.source;
  if (!ambientAudio.src) {
    ambientAudio.src = sourcePath;
  }

  if (!ambientAudio.src) {
    audioButton.textContent = 'Trilha pronta para ser adicionada';
    return;
  }

  if (ambientAudio.paused) {
    ambientAudio.play().then(() => {
      playingAudio = true;
      audioButton.textContent = '⏸️ Pausar trilha sonora';
      document.body.classList.add('playing-music');
    }).catch(() => {
      audioButton.textContent = '🎵 Ouvir trilha sonora';
      document.body.classList.remove('playing-music');
    });
  } else {
    ambientAudio.pause();
    playingAudio = false;
    audioButton.textContent = '🎵 Ouvir trilha sonora';
    document.body.classList.remove('playing-music');
  }
}

function createStars(count) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star pulse';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = 2 + Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${3 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.setAttribute('aria-label', 'Estrela interativa');
    star.title = 'Clique para uma mensagem';
    star.addEventListener('click', () => handleStarClick(i));
    fragment.appendChild(star);
  }

  starScene.appendChild(fragment);
}

function handleStarClick() {
  const available = starPhrases.filter((_, phraseIndex) => phraseIndex !== lastPhraseIndex);
  const nextIndex = Math.floor(Math.random() * available.length);
  const phrase = available[nextIndex];
  lastPhraseIndex = starPhrases.indexOf(phrase);
  starMessage.textContent = phrase;
  starMessage.classList.add('glow');
  window.clearTimeout(window.starTimeout);
  window.starTimeout = window.setTimeout(() => {
    starMessage.classList.remove('glow');
  }, 3800);
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.18,
  });

  revealElements.forEach((element) => observer.observe(element));
}

function handleMouseParallax(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 20;
  const y = (event.clientY / window.innerHeight - 0.5) * 20;
  starScene.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  updateCursorGlow(event.clientX, event.clientY);
}

function createCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.id = 'cursorGlow';
  document.body.appendChild(glow);
}

function updateCursorGlow(x, y) {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function animateBackgroundParticles() {
  const particleCount = 25;
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-layer';
  document.body.appendChild(particleContainer);

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'soft-particle';
    particle.style.left = `${Math.random() * 95}%`;
    particle.style.top = `${Math.random() * 95}%`;
    particle.style.width = `${4 + Math.random() * 6}px`;
    particle.style.height = `${4 + Math.random() * 6}px`;
    particle.style.animationDuration = `${12 + Math.random() * 14}s`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particleContainer.appendChild(particle);
  }
}

initialize();
