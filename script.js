let time = 0;
let total = 0;
let interval = null;
let session = 0;

// 🔔 LOUD ALARM
let alarm = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
alarm.loop = true;

// CHART
let ctx = document.getElementById("chart").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Study Minutes",
      data: [],
      backgroundColor: "#22c55e"
    }]
  }
});

// ENTER APP
function enterApp() {
  let name = nameInput.value.trim();
  if (!name) return alert("Enter name");

  userText.innerText = "Welcome, " + name + " 👋";

  welcome.classList.remove("active");
  app.classList.add("active");
}

// SET TIME
function setTime() {
  let hh = parseInt(h.value) || 0;
  let mm = parseInt(m.value) || 0;
  let ss = parseInt(s.value) || 0;

  time = hh*3600 + mm*60 + ss;
  total = time;

  update();
}

// PRESET
function setPreset(min) {
  time = min * 60;
  total = time;
  update();
}

// START TIMER
function start() {
  if (interval) return;

  if (time <= 0) {
    alert("Set time first!");
    return;
  }

  interval = setInterval(() => {

    if (time > 0) {
      time--;
      session++;
      update();
      updateProgress();
    }

    if (time === 0) {
      clearInterval(interval);
      interval = null;

      alarm.play();
      status.innerText = "⏰ Time's up!";

      let min = Math.floor(session/60);
      let date = new Date().toLocaleDateString();

      chart.data.labels.push(date);
      chart.data.datasets[0].data.push(min);
      chart.update();

      session = 0;

      setTimeout(stopAlarm, 60000);
    }

  }, 1000);
}

// STOP
function stop() {
  clearInterval(interval);
  interval = null;
}

// RESET
function reset() {
  time = total;
  session = 0;
  update();
  updateProgress();
}

// DISPLAY
function update() {
  let hh = Math.floor(time/3600);
  let mm = Math.floor((time%3600)/60);
  let ss = time%60;

  timer.innerText =
    `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;

  sessionText = document.getElementById("session");
  sessionText.innerText = "Session: " + Math.floor(session/60) + " min";
}

// PROGRESS
function updateProgress() {
  if (!total) return;
  let percent = ((total-time)/total)*100;
  progressBar.style.width = percent + "%";
}

// STOP ALARM
function stopAlarm() {
  alarm.pause();
  alarm.currentTime = 0;
}

// 🔥 PERFECT FOCUS MODE (FIXED)
function toggleFocus() {
  document.body.classList.toggle("focus");

  let btn = document.querySelector(".focusBtn");

  if (document.body.classList.contains("focus")) {
    btn.innerText = "Exit Focus";
    status.innerText = "🎯 Focus Mode ON";
  } else {
    btn.innerText = "Focus Mode";
    status.innerText = "Ready";
  }
}