let secretWord = "";
let wordList = [];
let isReady = false;
let guessedWords = new Set();

fetch("palabras.json")
  .then(response => response.json())
  .then(data => {
    wordList = data;
    secretWord = wordList[0];
    isReady = true;
  })
  .catch(err => {
    console.error("Error cargando palabras:", err);
    alert("No se pudo cargar el juego. Intenta más tarde.");
  });

function getColor(score) {
  if (score > 480) return "#2ecc71"; // verde
  if (score > 400) return "#f1c40f"; // amarillo
  if (score > 300) return "#e67e22"; // naranja
  return "#e74c3c"; // rojo
}

function checkGuess() {
  if (!isReady) {
    alert("Cargando el juego... intenta en unos segundos.");
    return;
  }

  const inputElement = document.getElementById("guessInput");
  const input = inputElement.value.trim().toLowerCase();
  const resultBox = document.getElementById("results");

  if (!input || guessedWords.has(input)) {
    inputElement.value = "";
    return;
  }

  guessedWords.add(input);
  const li = document.createElement("li");

  if (!wordList.includes(input)) {
    li.innerHTML = `<span class="guess-word">${input}</span> <span class="guess-feedback">❌ No está en la lista</span>`;
    li.style.color = "#7f8c8d";
  } else {
    const index = wordList.indexOf(input);
    const score = 500 - index;
    const color = getColor(score);

    if (input === secretWord) {
      li.innerHTML = `<span class="guess-word">${input}</span> <span class="guess-feedback">🎉 ¡Palabra correcta!</span>`;
      li.style.color = "#27ae60";
    } else {
      li.innerHTML = `<span class="guess-word">${input}</span> <span class="guess-feedback">🔥 Proximidad ${score}</span>`;
      li.style.color = color;
    }
  }

  resultBox.appendChild(li);
  inputElement.value = "";
}
