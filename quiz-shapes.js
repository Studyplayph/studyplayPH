let points = parseInt(localStorage.getItem("studyPoints")) || 0;
let index = 0;
let locked = false;

// SHAPES QUESTIONS
const quiz = [
    { q: "Which shape is round?", a: ["Square", "Circle", "Triangle", "Rectangle"], correct: 1 },
    { q: "Which shape has 4 equal sides?", a: ["Rectangle", "Triangle", "Square", "Circle"], correct: 2 },
    { q: "Which shape has 3 sides?", a: ["Circle", "Square", "Triangle", "Rectangle"], correct: 2 },
    { q: "Which shape looks like a door?", a: ["Circle", "Square", "Rectangle", "Triangle"], correct: 2 },
    { q: "Which shape has no corners?", a: ["Circle", "Square", "Triangle", "Rectangle"], correct: 0 }
];

// BIND DONE BUTTON AFTER DOM LOAD
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#video-section1 button").addEventListener("click", finishVideo);
});

// VIDEO FINISH
function finishVideo() {
    // Add 5 points for watching the video
    points += 5;
    localStorage.setItem("studyPoints", points);

    // Show alert with points earned
    alert("+5 Points for watching the video! Total Points: " + points);

    // Stop the YouTube video
    const iframe = document.getElementById("ytVideo1");
    iframe.src = iframe.src; // stops video

    // Hide video section and show quiz
    document.getElementById("video-section1").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";

    // Load the first quiz question
    loadQuestion();
}

// LOAD QUESTION
function loadQuestion() {
    locked = false;
    document.getElementById("nextBtn").style.display = "none";

    const q = quiz[index];
    document.getElementById("question").innerText = `${index + 1}. ${q.q}`;
    document.getElementById("progress").innerText = `${index + 1} of ${quiz.length} Questions`;

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    // Add feedback div for per-answer points
    let feedback = document.getElementById("feedback");
    if (!feedback) {
        feedback = document.createElement("div");
        feedback.id = "feedback";
        feedback.style.marginTop = "10px";
        feedback.style.fontWeight = "bold";
        answers.parentNode.appendChild(feedback);
    }
    feedback.innerText = "";

    q.a.forEach((text, i) => {
        const btn = document.createElement("div");
        btn.className = "answer";
        btn.innerText = text;
        btn.onclick = () => selectAnswer(btn, i);
        answers.appendChild(btn);
    });
}

// SELECT ANSWER
function selectAnswer(btn, i) {
    if (locked) return;
    locked = true;

    const correct = quiz[index].correct;
    const buttons = document.querySelectorAll(".answer");
    const feedback = document.getElementById("feedback");

    buttons.forEach(b => b.onclick = null); // disable all buttons

    if (i === correct) {
        btn.classList.add("correct");
        points += 2; // add 2 points
        localStorage.setItem("studyPoints", points);
        feedback.innerText = "Correct! +2 points";
        feedback.style.color = "#00ff88";
    } else {
        btn.classList.add("wrong");
        buttons[correct].classList.add("correct");
        feedback.innerText = "Wrong!";
        feedback.style.color = "#ff4d4d";
    }

    document.getElementById("nextBtn").style.display = "block";
}

// NEXT BUTTON
document.getElementById("nextBtn").onclick = () => {
    index++;
    if (index < quiz.length) {
        loadQuestion();
    } else {
        // Count correct answers from feedback divs
        let score = 0;
        const answerDivs = document.querySelectorAll(".answer");
        quiz.forEach((q, qIndex) => {
            // Check if correct answer has 'correct' class
            const correctBtn = answerDivs[qIndex * 4 + q.correct]; // 4 options per question
            if (correctBtn && correctBtn.classList.contains("correct")) score++;
        });

        // Check if user passed
        let bonusMsg = "";
        if (score >= 3) {
            points += 10; // bonus points
            localStorage.setItem("studyPoints", points);
            bonusMsg = "\n+10 Bonus Points!";
        }

        alert(`Quiz Finished!\nCorrect Answers: ${score} of ${quiz.length}${bonusMsg}\nTotal Points: ${points}`);
        window.location.href = "redeem.html";
    }
};

