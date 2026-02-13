import './style.css'
import confetti from 'canvas-confetti'

// Mission Data
const missions = [
  {
    id: "STAN",
    title: "Gravlax découvre les études",
    tagline: "The Beginning",
    icon: "🏛️",
    locked: false, // First one open
    riddle: "I am a place of uniforms and strict rules, located in the heart of Paris. Named after a Polish King. What am I? (One word)",
    answer: ["STANISLAS", "STAN", "COLLEGE STANISLAS"],
    images: ["stan1.jpg", "stan2.jpg", "stan3.jpg", "stan4.jpg", "stan5.jpg"],
    memory: "Big up à Marc."
  },
  {
    id: "CS",
    title: "Gravlax veut devenir ingénieur logiciel",
    tagline: "Engineering Glory",
    icon: "🤖",
    locked: true,
    riddle: "Tu participes à un jeu télévisé avec 3 portes. Derrière l'une se cache une voiture 🏎️, derrière les autres des chèvres 🐐. Tu choisis la porte 1. Le présentateur ouvre la porte 3 (une chèvre) et te demande si tu veux changer pour la porte 2. <br><br>🎯 Que dois-tu faire pour maximiser tes chances ? (Un mot : 'Changer' ou 'Rester')",
    answer: ["CHANGER", "CHANGE", "SWITCH"],
    images: ["cs1.jpg", "cs2.jpg", "cs3.jpg", "cs4.jpg", "cs5.jpg", "cs6.jpg", "cs7.jpg", "cs8.jpg", "cs9.jpg", "cs10.jpg"],
    memory: "La naissance du mythe Gravlax."
  },
  {
    id: "FERRET",
    title: "Gravlax va sur le bassin arcachonais",
    tagline: "Ocean Breeze",
    icon: "🦪",
    locked: true,
    riddle: "Mon premier est un amphibien, mon second est une action future à quelqu'un qui dort, mon tout est la pièce de viande des Gravereaux traditionnellement mangée autour d’un barbeuc.",
    answer: ["CRAPAUDINE"],
    images: ["ferret1.jpg", "ferret2.jpg", "ferret3.jpg", "ferret4.jpg", "ferret5.jpg"], // Added some "menace" pics here as fillers if needed or standalone
    memory: "Arcachon ou le Cap Ferret, Marc n'a qu'à bien se tenir."
  },
  {
    id: "DAN",
    title: "Gravlax se prend pour un viking danois",
    tagline: "Nordic Chill",
    icon: "🪓",
    locked: true,
    riddle: "Quel est le nom de la ligne sav qui a permis aux kings de se retrouver à Copenhague",
    answer: ["PLATINIUM"],
    images: ["copenhague1.jpg", "copenhague2.jpg", "copenhague3.jpg", "copenhague4.jpg", "copenhague5.jpg", "copenhague6.jpg", "copenhague7.jpg", "copenhague8.jpg", "copenhague9.jpg", "copenhague11.jpg"],
    memory: "Un viking vreuuuument"
  },
  {
    id: "Y",
    title: "Gravlax eN Y",
    tagline: "Des positions inadéquates",
    icon: "🏍️",
    locked: true,
    riddle: "Quel est le surnom de la ville de New York ?",
    answer: ["BIG APPLE"],
    images: ["y1.jpg", "y2.jpg", "y3.jpg", "y4.jpg", "y5.jpg", "y6.jpg", "y7.jpg"],
    memory: "Des positions inadéquates dans des endroits inadaptés",
  },
  {
    id: "PnL",
    title: "Gravlax est un positive PnL maker",
    tagline: "Le sharking",
    icon: "📈",
    locked: true,
    riddle: "De quelle promotion est le maitre du PnL, Pierre Chartier, aka HEAD of Trading Vol et Hybrides",
    answer: ["X2007"],
    images: ["pnl1.jpg", "pnl2.jpg", "pnl3.jpg", "pnl4.jpg", "pnl5.jpg", "pnl6.jpg", "pnl7.jpg"],
    memory: "Guys Guys. Ok solide, Le CV est shortlisté.",
  },
  {
    id: "ALPHA",
    title: "Gravlax est une menace",
    tagline: "La menace",
    icon: "🗿",
    locked: true,
    riddle: "Donner les 10 premières décimales de PI",
    answer: ["1415926535"],
    images: ["menace1.jpg", "menace2.jpg", "menace3.jpg", "menace4.jpg", "menace5.jpg", "menace6.jpg", "menace7.jpg", "menace8.jpg", "menace9.jpg", "menace10.jpg", "menace11.jpg", "menace12.jpg"],
    memory: "La menace est réelle",
    isFinal: true
  }
]

const grid = document.getElementById('mission-grid')
const modalOverlay = document.getElementById('modal-overlay')
const modalBody = document.getElementById('modal-body')
const closeModalBtn = document.getElementById('close-modal')
const timerDisplay = document.getElementById('game-timer')

let currentMissionId = null
let startTime = null
let timerInterval = null
let gameCompleted = false
let victoryAlreadyAnnounced = false

function startTimer() {
  if (startTime || gameCompleted) return
  startTime = Date.now()
  timerInterval = setInterval(updateTimer, 1000)
}

function updateTimer() {
  if (!startTime || gameCompleted) return
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const seconds = (elapsed % 60).toString().padStart(2, '0')
  if (timerDisplay) {
    timerDisplay.textContent = `TIME: ${minutes}:${seconds}`
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
    gameCompleted = true
    if (timerDisplay) {
      timerDisplay.style.color = '#f1c40f'
      timerDisplay.style.borderColor = '#f1c40f'
      timerDisplay.textContent = `COMPLETED! ${timerDisplay.textContent}`
    }
  }
}

function checkGameCompletion() {
  if (missions.every(m => !m.locked) && !gameCompleted) {
    stopTimer()
  }
}

function renderGrid() {
  if (!grid) return;

  checkGameCompletion()

  grid.innerHTML = missions.map(mission => `
    <div class="mission-folder ${mission.locked ? 'locked' : 'unlocked'}" data-id="${mission.id}">
      <div class="folder-tab">${mission.id.toUpperCase()}</div>
      <div class="folder-icon">${mission.locked ? '🔒' : mission.icon}</div>
      <div class="mission-title">${mission.title}</div>
      <div class="mission-status">
        <div class="status-dot"></div>
        ${mission.locked ? 'ENCRYPTED' : 'ARCHIVE OPEN'}
      </div>
    </div>
  `).join('')

  // Re-attach listeners
  document.querySelectorAll('.mission-folder').forEach(el => {
    el.addEventListener('click', () => openMission(el.dataset.id))
  })
}

function openMission(id) {
  const mission = missions.find(m => m.id === id)
  if (!mission) return

  startTimer()
  currentMissionId = id
  modalOverlay.classList.remove('hidden')

  if (mission.locked) {
    showRiddle(mission)
  } else {
    showContent(mission)
  }
}

function showRiddle(mission) {
  if (mission.id === 'CS') {
    startMontyHallGame(mission);
    return;
  }

  modalBody.innerHTML = `
    <div class="riddle-container">
      <h2 style="color: var(--folder-color)">SECURITY CLEARANCE REQUIRED</h2>
      <p class="riddle-text">"${mission.riddle}"</p>
      <input type="text" id="code-input" class="code-input" placeholder="ENTER PASSCODE" autocomplete="off">
      <div id="error-msg" class="error-msg"></div>
      <button class="submit-btn" id="submit-code">AUTHENTICATE</button>
    </div>
  `

  setTimeout(() => {
    const input = document.getElementById('code-input')
    const btn = document.getElementById('submit-code')

    if (input) {
      input.focus()
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkCode(input.value)
      })
    }
    if (btn) btn.addEventListener('click', () => checkCode(input.value))
  }, 100)
}

// Monty Hall Game Logic
let montyState = {
  step: 0, // 0: choose, 1: reveal/switch, 2: result
  prizeDoor: 0,
  chosenDoor: null,
  revealedDoor: null
}

function startMontyHallGame(mission) {
  montyState.step = 0;
  montyState.prizeDoor = Math.floor(Math.random() * 3);
  montyState.chosenDoor = null;
  montyState.revealedDoor = null;

  renderMontyHall(mission);
}

function renderMontyHall(mission) {
  const doorsHTML = [0, 1, 2].map(i => {
    let content = '🐐';
    if (i === montyState.prizeDoor) content = '🏎️';

    let doorClass = 'door';
    if (montyState.step === 2 || (montyState.step === 1 && i === montyState.revealedDoor)) {
      doorClass += ' open';
    }

    let highlight = '';
    if (montyState.chosenDoor === i) highlight = 'border-color: #f1c40f; box-shadow: 0 0 10px #f1c40f;';

    return `
      <div class="door-wrapper" onclick="handleDoorClick(${i}, '${mission.id}')">
        <div class="door-content">${content}</div>
        <div class="${doorClass}" style="${highlight}">${i + 1}</div>
      </div>
    `;
  }).join('');

  let msg = "Choisis une porte !";
  if (montyState.step === 1) {
    msg = `Le présentateur ouvre la porte ${montyState.revealedDoor + 1} ! Veux-tu changer pour la porte ${3 - montyState.chosenDoor - montyState.revealedDoor + 1} ?`;
  }

  modalBody.innerHTML = `
    <div class="riddle-container">
      <h2 style="color: var(--folder-color)">MONTY HALL PROTOCOL</h2>
      <div class="game-msg" id="game-msg">${msg}</div>
      <div class="doors-container">
        ${doorsHTML}
      </div>
      ${montyState.step === 1 ? `
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="submit-btn" onclick="montyDecision(false, '${mission.id}')" style="margin:0; background: #666;">RESTER</button>
            <button class="submit-btn" onclick="montyDecision(true, '${mission.id}')" style="margin:0;">CHANGER !</button>
        </div>
      ` : ''}
      <div id="error-msg" class="error-msg"></div>
    </div>
  `;
}

window.handleDoorClick = (doorIndex, missionId) => {
  if (montyState.step !== 0) return;

  montyState.chosenDoor = doorIndex;

  // Monty reveals a goat
  let availableDoors = [0, 1, 2].filter(d => d !== montyState.prizeDoor && d !== montyState.chosenDoor);
  montyState.revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];

  montyState.step = 1;
  const mission = missions.find(m => m.id === missionId);
  renderMontyHall(mission);
}

window.montyDecision = (switchDoor, missionId) => {
  const mission = missions.find(m => m.id === missionId);

  if (switchDoor) {
    montyState.chosenDoor = 3 - montyState.chosenDoor - montyState.revealedDoor;
  }

  montyState.step = 2;
  renderMontyHall(mission); // Show doors opening

  setTimeout(() => {
    if (montyState.chosenDoor === montyState.prizeDoor) {
      // WIN
      document.getElementById('game-msg').textContent = "FELICITATIONS ! TU AS GAGNE UNE VOITURE !";
      document.getElementById('game-msg').style.color = "#00ff9d";
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#ffffff']
      });

      setTimeout(() => {
        mission.locked = false;
        renderGrid();
        showContent(mission);
      }, 1500);

    } else {
      // LOSE
      document.getElementById('game-msg').textContent = "PERDU ! C'EST UNE CHEVRE...";
      document.getElementById('game-msg').style.color = "#ff4757";
      setTimeout(() => {
        montyState.step = 0; // Reset
        startMontyHallGame(mission);
      }, 2000);
    }
  }, 600);
}

function checkCode(val) {
  const input = document.getElementById('code-input') || { value: val } // Fallback
  const cleanVal = val.trim().toUpperCase()
  const mission = missions.find(m => m.id === currentMissionId)
  const errorMsg = document.getElementById('error-msg')

  // Check if answer matches any in the array
  if (mission.answer.some(a => cleanVal.includes(a))) {
    // Success
    mission.locked = false
    renderGrid() // Update background

    // Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff9d', '#ffffff']
    })

    showContent(mission)
  } else {
    // Fail
    if (errorMsg) errorMsg.textContent = "ACCESS DENIED. INCORRECT PASSCODE."
    if (input && input.classList) {
      input.classList.add('shake')
      setTimeout(() => input.classList.remove('shake'), 500)
      input.value = ''
    }
  }
}

function showContent(mission) {
  const imagesHTML = mission.images.map(img => `
    <div class="gallery-item">
        <img src="/${img}" alt="${mission.title}" loading="lazy">
    </div>
  `).join('')

  const navHTML = mission.images.length > 1 ? `
    <button class="nav-btn prev" id="prev-img">❮</button>
    <button class="nav-btn next" id="next-img">❯</button>
  ` : '';

  modalBody.innerHTML = `
    <div class="memory-content">
      <h2>${mission.title}</h2>
      
      <div class="gallery-container">
        <div class="gallery-scroll" id="gallery-scroller">
          ${imagesHTML}
        </div>
        ${navHTML}
      </div>
      
      <p class="memory-desc">${mission.memory}</p>
    </div>
  `

  if (mission.images.length > 1) {
    setTimeout(() => {
      const scroller = document.getElementById('gallery-scroller')
      const prevBtn = document.getElementById('prev-img')
      const nextBtn = document.getElementById('next-img')

      if (prevBtn && nextBtn && scroller) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          scroller.scrollBy({ left: -scroller.offsetWidth, behavior: 'smooth' })
        })
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          scroller.scrollBy({ left: scroller.offsetWidth, behavior: 'smooth' })
        })
      }
    }, 100)
  }
}

function finalCelebrate() {
  const finalTime = timerDisplay ? timerDisplay.textContent : "--:--";

  // Show final screen
  modalOverlay.classList.remove('hidden');
  modalBody.innerHTML = `
    <div class="victory-screen">
      <div class="victory-content">
        <h1 class="victory-title">MISSION ACCOMPLIED</h1>
        <div class="victory-stamp">TOP SECRET REVEALED</div>
        <div class="victory-stats">
          <p>AGENT: GRAVLAX</p>
          <p>STATUS: LEGENDARY</p>
          <p class="victory-time">${finalTime}</p>
        </div>
        <p class="final-message">Joyeux Anniversaire Marc !<br>Toutes les archives sont maintenant décryptées.</p>
        <button class="submit-btn" onclick="location.reload()">RELOAD MISSION</button>
      </div>
    </div>
  `;

  // Better confetti sequence
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden')

    // Trigger celebration only after closing the last mission
    if (gameCompleted && !victoryAlreadyAnnounced) {
      victoryAlreadyAnnounced = true
      setTimeout(finalCelebrate, 500)
    }
  })
}

// Init
renderGrid()
