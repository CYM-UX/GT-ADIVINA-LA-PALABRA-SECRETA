let secretWord = "";
let wordList = [];
let isReady = false;
const guessed = new Set();
let gameOver = false;

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
  if (score > 480) return "var(--green)";
  if (score > 400) return "var(--yellow)";
  if (score > 300) return "var(--orange)";
  return "var(--red)";
}

document.getElementById("btnGuess").addEventListener("click", checkGuess);
document.getElementById("guessInput").addEventListener("keypress", e => {
  if (e.key === "Enter") checkGuess();
});

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

function checkGuess() {
  if (!isReady || gameOver) return;

  const inputEl = document.getElementById("guessInput");
  const word = inputEl.value.trim().toLowerCase();
  if (!word || guessed.has(word)) { inputEl.value = ""; return; }
  guessed.add(word);

  const li = document.createElement("li");
  li.style.background = "#1e1e1e";

  if (!wordList.includes(word)) {
    li.innerHTML = `<span class="guess-word">${word}</span><span class="guess-feedback">❌ No válida</span>`;
    li.style.color = "var(--muted)";
  } else {
    const idx = wordList.indexOf(word);
    const score = 500 - idx;
    const bg = getBackground(score);
    li.style.background = bg;
    li.style.color = "#121212";

    if (word === secretWord) {
      li.innerHTML = `<span class="guess-word">${word}</span><span class="guess-feedback">🎉 ¡Correcta!</span>`;
      gameOver = true;
      document.getElementById("guessInput").disabled = true;
      document.getElementById("btnGuess").disabled = true;
      showVictoryMessage();
    } else {
      li.innerHTML = `<span class="guess-word">${word}</span><span class="guess-feedback">🔥 Proximidad ${score}</span>`;
    }
  }

  document.getElementById("results").appendChild(li);
  inputEl.value = "";
}
