// Everything is wrapped in one function so the variable names here
// can never clash with the ones in app.js
(function () {

  // ===================================================
  // TABS: switch between the three labs
  // ===================================================
  const tabs = document.querySelectorAll("#lab-tabs .tab");
  const labs = document.querySelectorAll(".lab");

  tabs.forEach(tab => {
    tab.id = "tab-" + tab.dataset.lab;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "lab-" + tab.dataset.lab);
    tab.setAttribute("aria-selected", String(tab.classList.contains("active")));
    document.getElementById("lab-" + tab.dataset.lab)?.setAttribute("aria-labelledby", tab.id);
  });
  labs.forEach(panel => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-hidden", String(!panel.classList.contains("active")));
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      labs.forEach(l => { l.classList.remove("active"); l.setAttribute("aria-hidden", "true"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const panel = document.getElementById("lab-" + tab.dataset.lab);
      panel.classList.add("active");
      panel.setAttribute("aria-hidden", "false");
      if (tab.dataset.lab !== "sorting") stopSort();   // pause sorting if you leave
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const list = Array.from(tabs);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (list.indexOf(tab) + direction + list.length) % list.length;
      list[next].focus();
      list[next].click();
    });
  });

  // ===================================================
  // LAB 1: BINARY CONVERTER
  // ===================================================
  const bitsEl = document.getElementById("bits");
  const decInput = document.getElementById("dec-input");
  const outBin = document.getElementById("out-bin");
  const outHex = document.getElementById("out-hex");
  const outOct = document.getElementById("out-oct");
  const outAscii = document.getElementById("out-ascii");
  const binExplain = document.getElementById("bin-explain");

  let value = 5;   // the current number (0 to 255)

  function renderBinary(fromTyping) {
    bitsEl.innerHTML = "";

    // build 8 bit buttons, from 128 down to 1
    for (let i = 7; i >= 0; i--) {
      const weight = 2 ** i;
      const on = (value & weight) !== 0;     // is this bit switched on?

      const col = document.createElement("div");
      col.className = "bit-col";
      col.innerHTML =
        '<span class="bit-weight">' + weight + "</span>" +
        '<button class="bit' + (on ? " on" : "") + '">' + (on ? 1 : 0) + "</button>";

      col.querySelector("button").onclick = function () {
        value = value ^ weight;              // ^ flips the bit
        renderBinary(false);
      };
      bitsEl.appendChild(col);
    }

    if (!fromTyping) decInput.value = value;

    // the different ways of writing the same number
    outBin.textContent = value.toString(2).padStart(8, "0");
    outHex.textContent = value.toString(16).toUpperCase().padStart(2, "0");
    outOct.textContent = value.toString(8);

    const isPrintable = value >= 32 && value <= 126;
    outAscii.textContent = isPrintable ? String.fromCharCode(value) : "–";

    // explain the sum
    const onWeights = [];
    for (let i = 7; i >= 0; i--) {
      if (value & (2 ** i)) onWeights.push(2 ** i);
    }
    let text = onWeights.length === 0
      ? "All bits are OFF, so the number is 0."
      : "Bits that are ON: " + onWeights.join(" + ") + " = " + value + ".";

    if (/[A-Za-z]/.test(outAscii.textContent)) {
      text += " Computers store the letter " + outAscii.textContent + " as the number " + value + ".";
    }
    binExplain.textContent = text;
  }

  decInput.addEventListener("input", function () {
    const n = parseInt(decInput.value, 10);
    if (isNaN(n)) return;
    value = Math.min(255, Math.max(0, n));
    renderBinary(true);
  });

  decInput.addEventListener("change", function () {
    decInput.value = value;    // tidy up the box when you click away
  });

  // ===================================================
  // LAB 2: SORTING VISUALIZER
  // ===================================================
  const barsEl = document.getElementById("bars");
  const algoSel = document.getElementById("sort-algo");
  const sizeInput = document.getElementById("sort-size");
  const speedInput = document.getElementById("sort-speed");
  const shuffleBtn = document.getElementById("sort-shuffle");
  const startBtn = document.getElementById("sort-start");
  const compEl = document.getElementById("sort-comp");
  const swapEl = document.getElementById("sort-swaps");
  const sortExplain = document.getElementById("sort-explain");

  const info = {
    bubble: "Bubble sort compares neighbouring bars and swaps them if they are in the wrong order. The biggest bars slowly \"bubble\" to the end. It needs about n × n comparisons, so it gets very slow on big lists.",
    selection: "Selection sort scans the unsorted part to find the smallest bar, then puts it at the front. It always makes about n × n comparisons, but it makes very few swaps.",
    insertion: "Insertion sort takes each bar and slides it left into the right place, like sorting playing cards in your hand. It is very fast when the list is already almost sorted."
  };

  let arr = [];
  let comparisons = 0;
  let swaps = 0;
  let sorting = false;
  let runId = 0;    // each run gets a number, so an old run can be cancelled

  function makeArray() {
    const n = Number(sizeInput.value);
    arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    comparisons = 0;
    swaps = 0;
    compEl.textContent = 0;
    swapEl.textContent = 0;
    draw([], []);
  }

  // draws the bars; "compare" are the bars being checked, "done" are finished ones
  function draw(compare, done) {
    barsEl.innerHTML = arr.map(function (v, i) {
      let cls = "bar";
      if (done.includes(i)) cls += " done";
      if (compare.includes(i)) cls += " cmp";
      return '<div class="' + cls + '" style="height:' + v + '%"></div>';
    }).join("");
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function delay() {
    return Math.max(2, 400 - Number(speedInput.value) * 4);
  }

  // one animation step: show the bars, wait, then say if we should carry on
  async function tick(run, compare, done) {
    compEl.textContent = comparisons;
    swapEl.textContent = swaps;
    draw(compare, done);
    await sleep(delay());
    return run === runId;     // false means "someone pressed Stop"
  }

  const algos = {
    async bubble(run) {
      const n = arr.length;
      const done = [];
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          comparisons++;
          if (!(await tick(run, [j, j + 1], done))) return false;
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swaps++;
          }
        }
        done.push(n - 1 - i);
      }
      return true;
    },

    async selection(run) {
      const n = arr.length;
      const done = [];
      for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          if (!(await tick(run, [min, j], done))) return false;
          if (arr[j] < arr[min]) min = j;
        }
        if (min !== i) {
          [arr[i], arr[min]] = [arr[min], arr[i]];
          swaps++;
        }
        done.push(i);
      }
      return true;
    },

    async insertion(run) {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        let j = i;
        while (j > 0) {
          comparisons++;
          if (!(await tick(run, [j - 1, j], []))) return false;
          if (arr[j - 1] > arr[j]) {
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            swaps++;
            j--;
          } else {
            break;
          }
        }
      }
      return true;
    }
  };

  function finish() {
    sorting = false;
    startBtn.textContent = "Start";
    algoSel.disabled = false;
  }

  function stopSort() {
    runId++;       // makes the running sort quit at its next step
    finish();
  }

  async function startSort() {
    if (sorting) { stopSort(); return; }

    sorting = true;
    startBtn.textContent = "Stop";
    algoSel.disabled = true;
    comparisons = 0;
    swaps = 0;

    const run = ++runId;
    const finished = await algos[algoSel.value](run);

    if (finished) {
      compEl.textContent = comparisons;
      swapEl.textContent = swaps;
      draw([], arr.map((_, i) => i));    // paint every bar green
    }
    if (run === runId) finish();
  }

  startBtn.addEventListener("click", startSort);
  shuffleBtn.addEventListener("click", function () { stopSort(); makeArray(); });
  sizeInput.addEventListener("input", function () { stopSort(); makeArray(); });
  algoSel.addEventListener("change", function () { sortExplain.textContent = info[algoSel.value]; });

  // ===================================================
  // LAB 3: CAESAR CIPHER
  // ===================================================
  const cipherIn = document.getElementById("cipher-in");
  const cipherOut = document.getElementById("cipher-out");
  const cipherLabel = document.getElementById("cipher-label");
  const shiftInput = document.getElementById("shift");
  const shiftVal = document.getElementById("shift-val");
  const wheel = document.getElementById("wheel");
  const modeEnc = document.getElementById("mode-enc");
  const modeDec = document.getElementById("mode-dec");
  const copyBtn = document.getElementById("cipher-copy");

  let encrypting = true;
  let result = "";

  // shifts every letter, and leaves spaces and symbols alone
  function caesar(text, shift) {
    return text.replace(/[a-z]/gi, function (ch) {
      const base = ch <= "Z" ? 65 : 97;      // capital letters start at 65, small at 97
      return String.fromCharCode((ch.charCodeAt(0) - base + shift + 26) % 26 + base);
    });
  }

  function renderCipher() {
    const shift = Number(shiftInput.value);
    const effective = encrypting ? shift : -shift;

    shiftVal.textContent = shift;
    result = caesar(cipherIn.value, effective);
    cipherOut.textContent = result || "…";
    cipherLabel.textContent = encrypting ? "Encrypted message" : "Decrypted message";

    // the two rows of letters
    let html = "";
    for (let i = 0; i < 26; i++) {
      const top = String.fromCharCode(65 + i);
      const bottom = String.fromCharCode(65 + (i + effective + 26) % 26);
      html += '<span class="w-col"><i>' + top + "</i><i>" + bottom + "</i></span>";
    }
    wheel.innerHTML = html;
  }

  function setMode(isEncrypt) {
    encrypting = isEncrypt;
    modeEnc.classList.toggle("active", isEncrypt);
    modeDec.classList.toggle("active", !isEncrypt);
    renderCipher();
  }

  modeEnc.addEventListener("click", function () { setMode(true); });
  modeDec.addEventListener("click", function () { setMode(false); });
  cipherIn.addEventListener("input", renderCipher);
  shiftInput.addEventListener("input", renderCipher);

  copyBtn.addEventListener("click", function () {
    if (!navigator.clipboard) { showToast("Copy isn't supported here"); return; }
    navigator.clipboard.writeText(result)
      .then(function () { showToast("Copied ✓"); })
      .catch(function () { showToast("Couldn't copy"); });
  });

  // ===================================================
  // START
  // ===================================================
  renderBinary(false);
  makeArray();
  sortExplain.textContent = info.bubble;
  renderCipher();

  const requestedLab = new URLSearchParams(window.location.search).get("lab");
  const requestedTab = Array.from(tabs).find(tab => tab.dataset.lab === requestedLab);
  if (requestedTab) requestedTab.click();

})();
