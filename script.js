
let secretWord = "";
let wordList = [];

fetch("palabras.json")
  .then(response => response.json())
  .then(data => {
    wordList = data;
    secretWord = wordList[0];
  });

function checkGuess() {
  const input = document.getElementById("guessInput").value.trim().toLowerCase();
  const resultBox = document.getElementById("results");

  if (!wordList.includes(input)) {
    resultBox.innerHTML += `<li>${input}: ❌ No está en la lista</li>`;
    return;
  }

  const index = wordList.indexOf(input);
  const score = 500 - index;

  if (input === secretWord) {
    resultBox.innerHTML += `<li><strong>${input}: 🎉 ¡Palabra correcta!</strong></li>`;
  } else {
    resultBox.innerHTML += `<li>${input}: 🔥 Proximidad ${score}</li>`;
  }
}
