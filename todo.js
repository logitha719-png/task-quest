let focusMode = false;
let totalXP = 0;

// Add Task
function addTask(text = null, date = null) {
    let taskText = text || document.getElementById("taskInput").value;
    let deadline = date || document.getElementById("deadlineInput").value;

    if (!taskText) return alert("Enter task!");

    let today = new Date();
    let d = new Date(deadline);
    let diff = (d - today) / (1000 * 60 * 60 * 24);

    let colorClass = "relaxed";
    if (diff <= 1) colorClass = "urgent";
    else if (diff <= 3) colorClass = "soon";

    let taskBox = document.createElement("div");
    taskBox.className = colorClass;
    taskBox.innerHTML = `
        <b>${taskText}</b>
        <br><small>Deadline: ${deadline}</small>
        <br><button onclick="completeTask(this)" style="margin-top:5px;">✔ Complete</button>
    `;

    document.getElementById("taskList").appendChild(taskBox);

    sortTasks();
}

// Complete Task → XP + Level
function completeTask(btn) {
    btn.parentElement.remove();
    totalXP += 10;

    document.getElementById("xp").innerText = totalXP;
    document.getElementById("level").innerText = Math.floor(totalXP / 50) + 1;
}

// Focus Mode
function toggleFocus() {
    focusMode = !focusMode;
    let tasks = document.querySelectorAll("#taskList div");

    if (focusMode) {
        if (tasks.length > 0) {
            tasks.forEach((t, i) => {
                if (i !== 0) t.style.display = "none";
            });
            document.getElementById("focusModeMsg").classList.remove("hidden");
        }
    } else {
        tasks.forEach(t => t.style.display = "block");
        document.getElementById("focusModeMsg").classList.add("hidden");
    }
}

// Smart Prioritization
function sortTasks() {
    let list = document.getElementById("taskList");
    let tasks = Array.from(list.children);

    tasks.sort((a, b) => {
        let da = new Date(a.querySelector("small").innerHTML.split(" ")[1]);
        let db = new Date(b.querySelector("small").innerHTML.split(" ")[1]);
        return da - db;
    });

    tasks.forEach(t => list.appendChild(t));
}

// Voice Input
function voiceAdd() {
    let rec = new webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.start();

    rec.onresult = function(event) {
        let voiceText = event.results[0][0].transcript;
        alert("Voice: " + voiceText);
        addTask(voiceText, new Date().toISOString().split("T")[0]);
    };
}
function updateXPBar() {
    let currentLevel = Math.floor(totalXP / 50) + 1;
    let xpIntoLevel = totalXP % 50;
    let percent = (xpIntoLevel / 50) * 100;

    document.getElementById("xpBar").style.width = percent + "%";

    // LEVEL-UP flash animation
    if (percent === 0) {
        let box = document.getElementById("xpBox");
        box.style.boxShadow = "0 0 25px #5e60ce";
        setTimeout(() => box.style.boxShadow = "0 5px 15px rgba(0,0,0,0.10)", 700);
    }
}
function completeTask(btn) {
    btn.parentElement.remove();
    totalXP += 10;

    document.getElementById("xp").innerText = totalXP;
    document.getElementById("level").innerText = Math.floor(totalXP / 50) + 1;

    updateXPBar();
}
function startGame() {
    let screen = document.getElementById("onboarding");
    screen.style.opacity = "0";
    screen.style.transition = "0.6s";

    setTimeout(() => {
        screen.style.display = "none";
    }, 600);
}
