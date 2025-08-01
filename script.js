let secretWord = "";
let wordList = [];
let isReady = false;
let gameOver = false;
let attempts = 0;
const guessedWords = [];

fetch("palabras.json")
  .then(r => r.json())
  .then(data => {
    wordList = data;
    secretWord = wordList[0];
    isReady = true;
  })
  .catch(err => {
    console.error(err);
    alert("No se cargó la lista de palabras.");
  });

function getBackground(score) {
  if (score <= 20) return "var(--green)";
  if (score <= 100) return "var(--yellow)";
  if (score <= 200) return "var(--orange)";
  return "var(--red)";
}
function updateAttemptsDisplay() {
  const counter = document.getElementById("attemptsCounter");
  counter.textContent = `Intentos: ${attempts}`;
}
function renderList() {
  const ul = document.getElementById("results");
  ul.innerHTML = "";

  const valid = guessedWords
    .filter(w => w.valid)
    .sort((a, b) => a.score - b.score);

  const invalid = guessedWords.filter(w => !w.valid);

  [...valid, ...invalid].forEach(({ word, score, valid, correct }) => {
    const li = document.createElement("li");

    if (!valid) {
      li.innerHTML = `<span class="guess-word">${word}</span><span class="guess-feedback">❌ No válida</span>`;
      li.style.color = "var(--muted)";
    } else {
      li.style.background = getBackground(score);
      li.style.color = "#121212";
      li.innerHTML = correct
        ? `<span class="guess-word">${word}</span><span class="guess-score">🎉 ¡Correcta!</span>`
        : `<span class="guess-word">${word}</span><span class="guess-score"><strong>${score}</strong></span>`;
    }

    ul.appendChild(li);
  });
}
function showVictoryMessage() {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Crear ventana modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <h2>🎉 ¡Felicidades!</h2>
    <p>Has adivinado la palabra secreta del mes: <strong>${secretWord}</strong></p>
    <p><strong>Total de intentos: ${attempts}</strong> </p>
    <p class="small">📸 Tómale captura a esta pantalla y envíala a <a href="mailto:jquirola@transoceanica.com.ec">jquirola@transoceanica.com.ec</a> para saber que jugaste!</p>
    <div class="modal-buttons">
      <button onclick="window.open('https://transoceanica.short.gy/BoletinNo10', '_blank')">
        Regresar al Boletín No10
      </button>
      <button onclick="copyLink()">
        Compartir el juego
      </button>
          <div id="copyAlert" class="copy-alert">¡Enlace copiado al portapapeles!</div>
    </div>

  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
function copyLink() {
const linkPersonalizado = "https://transoceanica.short.gy/Adivinalapalabrasecreta";

 navigator.clipboard.writeText(linkPersonalizado).then(() => {
    const alertBox = document.getElementById("copyAlert");

    alertBox.classList.add("show");

    setTimeout(() => {
      alertBox.classList.remove("show");
    }, 3000);
  }).catch(err => {
    console.error("Error al copiar el enlace:", err);
  });
}

document.getElementById("btnGuess").addEventListener("click", checkGuess);
document.getElementById("guessInput").addEventListener("keypress", e => {
  if (e.key === "Enter") checkGuess();
});

function checkGuess() {
  if (!isReady || gameOver) return;

  const inputEl = document.getElementById("guessInput");
  const word = inputEl.value.trim().toLowerCase();
  inputEl.value = "";

  if (!word || guessedWords.find(w => w.word === word)) return;
  attempts++;
  updateAttemptsDisplay();
  if (!wordList.includes(word)) {
    guessedWords.push({ word, valid: false });
  } else {
    const index = wordList.indexOf(word);
    const score = index + 1;
    const correct = word === secretWord;
    guessedWords.push({ word, score, valid: true, correct });

    if (correct) {
      gameOver = true;
      document.getElementById("guessInput").disabled = true;
      document.getElementById("btnGuess").disabled = true;
      showVictoryMessage();
    }
  }

  renderList();
}
