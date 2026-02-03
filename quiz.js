let questions = [];
let index = 0;
let answers = {};

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("examName").textContent = data.exam;
    questions = data.questions;
    loadQuestion();
  });

function loadQuestion() {
  const q = questions[index];
  const qText = document.getElementById("questionText");
  const box = document.getElementById("optionsBox");
  const explanationBox = document.getElementById("explanationBox");
  const explanationList = document.getElementById("explanationList");

  qText.textContent = `Q${q.id}. ${q.question}`;
  box.innerHTML = "";
  explanationBox.classList.add("hidden");
  explanationList.innerHTML = "";

  Object.entries(q.options).forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<b>${key.toUpperCase()}.</b> ${value}`;
    btn.className = "w-full text-left border px-4 py-3 rounded-lg hover:bg-indigo-50";

    if (answers[index]) {
      btn.disabled = true;
      if (key.toUpperCase() === q.correct_answer) btn.classList.add("bg-green-100", "border-green-500");
      if (answers[index] === key.toUpperCase() && key.toUpperCase() !== q.correct_answer)
        btn.classList.add("bg-red-100", "border-red-500");

      showExplanation(q);
    } else {
      btn.onclick = () => { answers[index] = key.toUpperCase(); loadQuestion(); };
    }

    box.appendChild(btn);
  });

  document.getElementById("submitBtn").classList.toggle("hidden", index !== questions.length - 1);
  document.getElementById("nextBtn").classList.toggle("hidden", index === questions.length - 1);

  buildPalette();
}

function showExplanation(q) {
  const explanationBox = document.getElementById("explanationBox");
  const explanationList = document.getElementById("explanationList");

  explanationList.innerHTML = "";
  q.explanation.forEach(line => {
    const li = document.createElement("li");
    li.textContent = line;
    explanationList.appendChild(li);
  });

  explanationBox.classList.remove("hidden");
}

function buildPalette() {
  const palette = document.getElementById("questionPalette");
  palette.innerHTML = "";

  questions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.textContent = q.id;
    btn.className = "h-8 rounded text-sm border";

    if (!answers[i]) btn.classList.add("bg-gray-200");
    else if (answers[i] === q.correct_answer) btn.classList.add("bg-green-500", "text-white");
    else btn.classList.add("bg-red-500", "text-white");

    btn.onclick = () => { index = i; loadQuestion(); };
    palette.appendChild(btn);
  });
}

document.getElementById("nextBtn").onclick = () => { if (index < questions.length - 1) index++; loadQuestion(); };
document.getElementById("prevBtn").onclick = () => { if (index > 0) index--; loadQuestion(); };

document.getElementById("submitBtn").onclick = () => {
  localStorage.setItem("resultsJSON", JSON.stringify({ questions, answers }));
  window.location.href = "dashboard.html";
};

