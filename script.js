const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("popup");

const pageStringInput = document.getElementById("pageString");
const frameCountInput = document.getElementById("frameCount");
const startBtn = document.getElementById("startBtn");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stepBackBtn = document.getElementById("stepBackBtn");
const stepForwardBtn = document.getElementById("stepForwardBtn");
const speedControl = document.getElementById("speedControl");
const statsOutput = document.getElementById("statsOutput");

let pageReferences = [];
let frameCount = 3;
let executionLog = [];
let pageFaultsCount = 0;
let currentStep = 0;
let animationSpeed = 600;
let isPlaying = false;
let timer = null;

function parsePageReferences(str) {
  return str.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
}

function showPopup(message) {
  popup.textContent = message;
  popup.classList.add("popup-visible");
  clearTimeout(popup.hideTimer);
  popup.hideTimer = setTimeout(() => popup.classList.remove("popup-visible"), 1000);
}

function simulateLRU() {
  let memory = [];
  let recentUsed = new Map();
  pageFaultsCount = 0;
  executionLog = [];

  for (let i = 0; i < pageReferences.length; i++) {
    const page = pageReferences[i];
    let outgoingPage = undefined;
    let incomingIndex, outgoingIndex;
    let pageFaultOccurred = false;

    if (!memory.includes(page)) {
      pageFaultOccurred = true;
      pageFaultsCount++;

      if (memory.length < frameCount) {
        memory.push(page);
        incomingIndex = memory.length - 1;
      } else {
        let lruPage = memory[0];
        let minUsed = recentUsed.get(lruPage) ?? -1;

        for (let j = 0; j < memory.length; j++) {
          let lastUsed = recentUsed.get(memory[j]) ?? -1;
          if (lastUsed < minUsed) {
            minUsed = lastUsed;
            lruPage = memory[j];
          }
        }

        outgoingIndex = memory.indexOf(lruPage);
        outgoingPage = lruPage;
        memory[outgoingIndex] = page;
        incomingIndex = outgoingIndex;
      }
    }

    recentUsed.set(page, i);

    executionLog.push({
      step: i,
      currentPage: page,
      memory: [...memory],
      pageFaultOccurred,
      pageFaultCount: pageFaultsCount,
      incomingPage: pageFaultOccurred ? page : undefined,
      incomingIndex,
      outgoingPage,
      outgoingIndex,
    });
  }
}

function drawStep(step, anim = false, animType = "", progress = 1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2c3e50";
  ctx.font = "24px Segoe UI";
  ctx.fillText("LRU Page Replacement Simulation", 20, 40);

  ctx.font = "20px Segoe UI";
  ctx.fillText(`Step: ${step.step + 1} / ${executionLog.length}`, 20, 85);
  ctx.fillText(`Reference Page: ${step.currentPage}`, 20, 130);
  ctx.fillText(`Page Faults So Far: ${step.pageFaultCount}`, 20, 180);

  const frameSlotWidth = 90;
  const frameSlotHeight = 60;
  const startX = 25;
  const startY = 250;

  ctx.font = "bold 20px Segoe UI";
  ctx.fillText("Frames:", startX, startY - 45);

  for (let i = 0; i < frameCount; i++) {
    let x = startX + i * (frameSlotWidth + 25);

    let isOutgoing = anim && animType === "exit" && i === step.outgoingIndex;
    let isIncoming = anim && animType === "enter" && i === step.incomingIndex;

    if (isOutgoing) {
      ctx.globalAlpha = 1 - progress;
      ctx.save();
      ctx.translate(x + (frameSlotWidth + 100) * progress, startY + frameSlotHeight / 2);
      ctx.rotate(progress * Math.PI / 3);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(-frameSlotWidth / 2, -frameSlotHeight / 2, frameSlotWidth, frameSlotHeight);
      ctx.restore();

    } else if (isIncoming) {
      ctx.globalAlpha = progress;
      ctx.save();
      ctx.translate(x - (frameSlotWidth + 100) * (1 - progress), startY + frameSlotHeight / 2);
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(-frameSlotWidth / 2, -frameSlotHeight / 2, frameSlotWidth, frameSlotHeight);
      ctx.restore();

    } else {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#5499c7";
      ctx.fillRect(x, startY, frameSlotWidth, frameSlotHeight);

      if (i < step.memory.length) {
        ctx.fillStyle = "#fff";
        ctx.fillText(`Page ${step.memory[i]}`, x + 15, startY + frameSlotHeight / 1.5);
      }
    }

    ctx.globalAlpha = 1;

    let isHit =
      anim &&
      animType === "hit" &&
      step.memory[i] === step.currentPage &&
      !step.pageFaultOccurred;

    if (isHit) {
      ctx.save();
      ctx.globalAlpha = 0.3 + 0.7 * progress;
      ctx.strokeStyle = "#2ecc71";
      ctx.lineWidth = 8 * (1 - progress);
      ctx.strokeRect(x - 5, startY - 5, frameSlotWidth + 10, frameSlotHeight + 10);
      ctx.restore();
    }
  }

  showPopup(step.pageFaultOccurred ? "Page Fault!" : "Page Hit ✓");
}

function animatePageTransition(animType, step, callback) {
  let duration = animationSpeed;
  let start = null;

  function animate(ts) {
    if (!start) start = ts;
    let progress = Math.min((ts - start) / duration, 1);

    drawStep(step, true, animType, progress);

    if (progress < 1) requestAnimationFrame(animate);
    else {
      drawStep(step, false);
      if (callback) callback();
    }
  }
  requestAnimationFrame(animate);
}

function handleStep(stepIdx, cb) {
  let step = executionLog[stepIdx];

  if (step.outgoingPage !== undefined) {
    animatePageTransition("exit", step, () => {
      if (step.incomingPage !== undefined) {
        animatePageTransition("enter", step, () => cb && cb());
      }
    });

  } else if (step.incomingPage !== undefined) {
    animatePageTransition("enter", step, () => cb && cb());

  } else if (!step.pageFaultOccurred) {
    animatePageTransition("hit", step, () => cb && cb());

  } else {
    drawStep(step);
    cb && cb();
  }
}

function playAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  playBtn.disabled = true;
  pauseBtn.disabled = false;

  timer = setInterval(() => {
    if (currentStep < executionLog.length) {
      handleStep(currentStep, () => currentStep++);
    } else {
      pauseAnimation();
    }
  }, animationSpeed);
}

function pauseAnimation() {
  isPlaying = false;
  clearInterval(timer);
  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

function stepForward() {
  if (currentStep < executionLog.length) {
    handleStep(currentStep, () => currentStep++);
  }
}

function stepBack() {
  if (currentStep > 1) {
    currentStep -= 2;
    drawStep(executionLog[currentStep]);
    currentStep++;
  } else if (currentStep === 1) {
    currentStep = 0;
    drawStep(executionLog[currentStep]);
    currentStep++;
  }
}

function updateStatistics() {
  statsOutput.innerHTML = `
    <table class="table table-striped table-bordered mt-3">
      <thead>
        <tr><th>Total Pages</th><th>Frames</th><th>Page Faults</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>${pageReferences.length}</td>
          <td>${frameCount}</td>
          <td>${pageFaultsCount}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function initSimulation() {
  pageReferences = parsePageReferences(pageStringInput.value);
  frameCount = parseInt(frameCountInput.value);
  if (frameCount < 1) frameCount = 3;

  currentStep = 0;
  simulateLRU();
  drawStep(executionLog[currentStep]);
  updateStatistics();

  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

startBtn.onclick = initSimulation;
playBtn.onclick = playAnimation;
pauseBtn.onclick = pauseAnimation;
stepBackBtn.onclick = stepBack;
stepForwardBtn.onclick = stepForward;

speedControl.oninput = () => {
  animationSpeed = speedControl.value;
  if (isPlaying) {
    pauseAnimation();
    playAnimation();
  }
};

/*  EXPORT SCREENSHOT */
document.getElementById("exportPngBtn").onclick = () => {
  const link = document.createElement("a");
  link.download = "LRU_Screenshot.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

/*  EXPORT EXECUTION TRACE */
document.getElementById("exportTraceBtn").onclick = () => {
  const dataStr = JSON.stringify(executionLog, null, 4);
  const blob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.download = "LRU_Execution_Trace.json";
  link.href = URL.createObjectURL(blob);
  link.click();

  URL.revokeObjectURL(link.href);
};
