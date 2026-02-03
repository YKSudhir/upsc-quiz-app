const data = JSON.parse(localStorage.getItem("resultsJSON"));
let index = 0;

function loadQuestion() {
  const q = data.questions[index];
  const box = document.getElementById("optionsBox");
  const explanationList = document.getElementById("explanationList");

  document.getElementById("questionText").textContent = `Q${q.id}. ${q.question}`;
  box.innerHTML = "";
  explanationList.innerHTML = "";

  Object.entries(q.options).forEach(([key, value]) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${key.toUpperCase()}.</b> ${value}`;
    div.className = "border px-4 py-2 rounded";

    if (key.toUpperCase() === q.correct_answer) div.classList.add("bg-green-100");
    if (data.answers[index] === key.toUpperCase() && key.toUpperCase() !== q.correct_answer)
      div.classList.add("bg-red-100");

    box.appendChild(div);
  });

  q.explanation.forEach(line => {
    const li = document.createElement("li");
    li.textContent = line;
    explanationList.appendChild(li);
  });

  buildPalette();
}

function buildPalette() {
  const palette = document.getElementById("questionPalette");
  palette.innerHTML = "";

  data.questions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.textContent = q.id;
    btn.className = "h-8 rounded text-sm border";

    if (!data.answers[i]) btn.classList.add("bg-gray-200");
    else if (data.answers[i] === q.correct_answer) btn.classList.add("bg-green-500", "text-white");
    else btn.classList.add("bg-red-500", "text-white");

    btn.onclick = () => { index = i; loadQuestion(); };
    palette.appendChild(btn);
  });
}

document.getElementById("nextBtn").onclick = () => { if (index < data.questions.length - 1) index++; loadQuestion(); };
document.getElementById("prevBtn").onclick = () => { if (index > 0) index--; loadQuestion(); };

loadQuestion();
