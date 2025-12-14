let points = parseInt(localStorage.getItem('studyPoints')) || 0;
const music = document.getElementById("bgMusic");

// Unmute and start music on first click (autoplay policy)
document.addEventListener("click", () => {
    music.muted = false;
    music.play();
}, { once: true });

// Quiz questions
const quiz = [
    { q: "5 rabbits + 5 rabbits", a: ["8","9","10","11"], correct: 2 },
    { q: "20 rabbits + 17 rabbits", a: ["17","22","47","37"], correct: 3 },
    { q: "80 rabbits + 20 rabbits", a: ["100","77","180","101"], correct: 0 },
    { q: "77 rabbits + 80 rabbits", a: ["156","157","159","179"], correct: 1 },
    { q: "76 rabbits + 24 rabbits", a: ["99","97","100","120"], correct: 2 }
];

let index = 0;
let locked = false;
let player;

// This is called by YouTube API when the iframe is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytVideo', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// Pause background music when video plays
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        // Video started playing → pause music
        music.pause();
    }
}

// Finish watching button
function finishVideo() {
    // Add 5 points for watching video
    points += 5;
    localStorage.setItem("studyPoints", points);

    // Pause the YouTube video
    if(player) player.pauseVideo();

    // Hide video, show quiz
    document.getElementById("video-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";

    // Resume background music
    music.play();

    // Load first quiz question
    loadQuestion();
}

// Load quiz question
function loadQuestion() {
    locked = false;
    document.getElementById("nextBtn").style.display = "none";

    const q = quiz[index];
    document.getElementById("question").innerText = (index + 1) + ". " + q.q;
    document.getElementById("progress").innerText = `${index + 1} of ${quiz.length} Questions`;

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    let feedback = document.getElementById("feedback");
    if(!feedback) {
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

// Handle answer selection
function selectAnswer(btn, i) {
    if(locked) return;
    locked = true;

    const correct = quiz[index].correct;
    const buttons = document.querySelectorAll(".answer");
    const feedback = document.getElementById("feedback");

    buttons.forEach(b => b.onclick = null);

    if(i === correct){
        btn.classList.add("correct");
        points += 2;
        localStorage.setItem("studyPoints", points);
        feedback.innerText = "Correct! +2 pts";
        feedback.style.color = "#00ff88";
    } else {
        btn.classList.add("wrong");
        buttons[correct].classList.add("correct");
        feedback.innerText = "Wrong!";
        feedback.style.color = "#ff4d4d";
    }

    document.getElementById("nextBtn").style.display = "block";
}

// Next question
document.getElementById("nextBtn").onclick = () => {
    index++;
    if(index < quiz.length){
        loadQuestion();
    } else {
        alert(`Quiz Finished! Your points: ${points}`);
        window.location.href = "redeem.html";
    }
};
