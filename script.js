let secretWord = "";
let wordList = [];
let isReady = false;
let gameOver = false;
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
  if (score === 0) return "var(--green)";
  if (score <= 5) return "var(--yellow)";
  if (score <= 15) return "var(--orange)";
  return "var(--red)";
}

function renderList() {
  const ul = document.getElementById("results");
  ul.innerHTML = "";

  // Separar válidos y no válidos
  const valid = guessedWords.filter(w => w.valid).sort((a, b) => a.score - b.score);
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
        ? `<span class="guess-word">${word}</span><span class="guess-feedback">🎉 ¡Correcta!</span>`
        : `<span class="guess-word">${word}</span><span class="guess-feedback">🔥 Proximidad ${score}</span>`;
    }

    ul.appendChild(li);
  });
}

function showVictoryMessage() {
  const container = document.createElement("div");
  container.className = "victory";
  container.innerHTML = `
    <h2>🎉 ¡Felicidades!</h2>
    <p>Has adivinado la palabra secreta del mes: <strong>${secretWord}</strong></p>
    <p>Tómale una foto a esta pantalla y envíala a <a href="mailto:jquirola@transoceanica.com.ec">jquirola@transoceanica.com.ec</a> 📸</p>
    <p>¡Gracias por jugar con nosotros!</p>
  `;
  document.body.appendChild(container);
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

  if (!wordList.includes(word)) {
    guessedWords.push({ word, valid: false });
  } else {
    const index = wordList.indexOf(word);
    const score = index; // score 0 = palabra secreta
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
