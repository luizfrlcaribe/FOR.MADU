// script.js - Interações e animações para a experiência suave

const introOverlay = document.getElementById('introOverlay');
const introInput = document.getElementById('introInput');
const introSubmit = document.getElementById('introSubmit');
const introFeedback = document.getElementById('introFeedback');
const audioButton = document.getElementById('audioButton');
const ambientAudio = document.getElementById('ambientAudio');
const starScene = document.getElementById('starScene');
const starMessage = document.getElementById('starMessage');

const poemBeginnings = [
  'Maria Eduarda, você é o verso que o céu aprende.',
  'Duda, seu sorriso acende a noite em silêncio.',
  'Madu, cada instante perto de você vira poesia.',
  'No teu olhar, a lua encontra um lar.',
  'Maria Eduarda, existe ternura em tudo o que você toca.',
  'Duda, até o vento pede permissão para te levar uma saudade.',
  'Madu, o mundo fica mais bonito quando você sorri.',
  'Nos seus gestos, pequenos milagres ficam visíveis.',
  'Maria Eduarda, seu nome ilumina caminhos quietos.',
  'Duda, cada estrela guarda um pouco da sua delicadeza.',
  'Madu, a madrugada parece sorrir com você.',
  'Seu carinho é uma constelação dentro do peito.'
];

const poemMiddles = [
  'Como quem vê flores nascerem sob a lua.',
  'Como uma melodia suave entrando pela janela.',
  'Como o sol que encontra o mar ao amanhecer.',
  'Como um segredo doce guardado com cuidado.',
  'Como o brilho que a esperança deixa no horizonte.',
  'Como uma carta escrita pelas estrelas.',
  'Como a calmaria depois de uma longa tempestade.',
  'Como a luz acendendo um quarto antigo.',
  'Como alguém que ensina a vida a respirar.',
  'Como um abraço que o tempo não consegue apagar.'
];

const poemEndings = [
  'Que sorte a minha é poder admirar você.',
  'Que você nunca esqueça o quanto é especial.',
  'Que esta noite leve carinho até você.',
  'Que todos os seus dias encontrem beleza.',
  'Que o seu coração sempre reconheça a sua luz.',
  'Que a alegria permaneça ao seu lado.',
  'Que seus sonhos encontrem caminhos para florescer.',
  'Que cada amanhecer seja gentil com você.',
  'Que a vida te ofereça o amor que você merece.',
  'Que você seja feliz em cada pequena coisa.'
];

const starPhrases = Array.from({ length: 120 }, (_, index) =>
  `${poemBeginnings[index % poemBeginnings.length]}\n${poemMiddles[(index * 7) % poemMiddles.length]}\n${poemEndings[(index * 3) % poemEndings.length]}`
);

const heartOverlay = document.getElementById('heartOverlay');
const heartButton = document.getElementById('heartButton');
const heartClose = document.getElementById('heartClose');
const typedName = document.getElementById('typedName');
const heartText = document.getElementById('heartText');

let lastPhraseIndex = -1;
let playingAudio = false;
let heartTypingTimer = null;

function initialize() {
  if (introOverlay) {
    introOverlay.remove();
  }
  document.body.style.overflow = 'auto';
  createStars(120);
  setupScrollReveal();
  bindEvents();
  animateBackgroundParticles();
  createCursorGlow();
}

function bindEvents() {
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
    star.title = 'Clique para revelar um poema';
    star.addEventListener('click', () => handleStarClick(i));
    fragment.appendChild(star);
  }

  starScene.appendChild(fragment);
}

function handleStarClick(starIndex) {
  const phrase = starPhrases[starIndex % starPhrases.length];
  lastPhraseIndex = starIndex % starPhrases.length;
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
