// --- dom elements ---
const loginScreen = document.getElementById("login-screen");
const labScreen = document.getElementById("lab-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const usernameDisplay = document.getElementById("username-display");
const logoutBtn = document.getElementById("logoutBtn");

const canvas = document.getElementById("sortCanvas");
const ctx = canvas.getContext("2d");
const categorySelect = document.getElementById("category-select");
const algorithmSelect = document.getElementById("algorithm-select");
const searchContainer = document.getElementById("search-container");
const searchValueInput = document.getElementById("searchValue");
const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");
const arraySizeSlider = document.getElementById("arraySize");
const speedSlider = document.getElementById("speed");
const arraySizeValue = document.getElementById("arraySizeValue");
const speedValue = document.getElementById("speedValue");
const statusText = document.getElementById("status");

// --- state variables ---
let array = [];
let arraySize = 5;
let delay = 1;
let isRunning = false;

// --- colors ---
const COLORS = {
  default: "#666666", // abu-abu sedang untuk bar utama
  compare: "#000000", // hitam pekat untuk bandingkan
  swap: "#333333", // abu-abu gelap buat swap
  sorted: "#999999", // abu-abu terang buat yang sudah terurut
  pivot: "#444444", // abu-abu agak gelap buat pivot
};

// --- algorithm definitions ---
const ALGORITHMS = {
  sorting: {
    bubble: { name: "Bubble Sort", func: bubbleSort },
    selection: { name: "Selection Sort", func: selectionSort },
    insertion: { name: "Insertion Sort", func: insertionSort },
  },
  searching: {
    linear: { name: "Linear Search", func: linearSearch },
    binary: { name: "Binary Search", func: binarySearch },
  },
};

// --- algorithm descriptions ---
const DESCRIPTIONS = {
  sorting: {
    bubble:
      "Bubble Sort adalah algoritma pengurutan sederhana yang berulang kali menelusuri daftar, membandingkan elemen yang berdekatan dan menukarnya jika urutannya salah. Penelusuran diulang hingga daftar tersebut diurutkan.",
    selection:
      "Selection Sort membagi daftar menjadi dua bagian: terurut dan tidak terurut. Algoritma ini berulang kali menemukan elemen minimum dari bagian yang tidak terurut dan memindahkannya ke akhir bagian yang terurut.",
    insertion:
      "Insertion Sort membangun array yang diurutkan satu per satu. Algoritma ini mengambil satu elemen dari data yang belum diurutkan dan memasukkannya ke posisi yang benar di bagian yang sudah terurut.",
  },
  searching: {
    linear:
      "Linear Search adalah metode pencarian sekuensial. Ia secara berurutan memeriksa setiap elemen dalam daftar sampai elemen target ditemukan atau seluruh daftar telah diperiksa.",
    binary:
      "Binary Search adalah algoritma pencarian efisien yang bekerja pada array terurut. Ia membandingkan elemen target dengan elemen tengah, dan jika tidak sama, setengah bagian di mana target tidak mungkin ada akan dieliminasi.",
  },
};

// --- core functions ---
function setCanvasSize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function createRandomArray(size) {
  array = [];
  const usedNumbers = new Set();
  while (array.length < size) {
    let num = Math.floor(Math.random() * 100) + 1;
    if (!usedNumbers.has(num)) {
      array.push(num);
      usedNumbers.add(num);
    }
  }
}

function drawArray(colorConfig = {}) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (array.length === 0) return;
  const barWidth = canvas.width / array.length;
  const spacing = barWidth * 0.2;
  const drawableBarWidth = barWidth - spacing;
  const maxVal = Math.max(...array, 1);

  array.forEach((value, index) => {
    const barHeight = (value / maxVal) * (canvas.height * 0.95);
    const x = index * barWidth + spacing / 2;
    const y = canvas.height - barHeight;

    ctx.fillStyle = colorConfig[index] || COLORS.default;
    ctx.fillRect(x, y, drawableBarWidth, barHeight);

    if (drawableBarWidth > 20) {
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(value, x + drawableBarWidth / 2, y - 5);
    }
  });
}

function updateStatus(text) {
  statusText.textContent = text;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toggleControls(enabled) {
  const elements = [
    resetBtn,
    startBtn,
    arraySizeSlider,
    algorithmSelect,
    categorySelect,
    searchValueInput,
  ];
  elements.forEach((el) => (el.disabled = !enabled));
  if (enabled) {
    startBtn.textContent = "Mulai";
  }
}

function reset() {
  isRunning = false;
  arraySize = parseInt(arraySizeSlider.value);
  delay = 1050 - parseInt(speedSlider.value);
  createRandomArray(arraySize);
  if (
    categorySelect.value === "searching" &&
    algorithmSelect.value === "binary"
  ) {
    array.sort((a, b) => a - b);
  }
  drawArray();
  toggleControls(true);
}

function updateExplanation() {
  const category = categorySelect.value;
  const algorithmKey = algorithmSelect.value;
  if (DESCRIPTIONS[category] && DESCRIPTIONS[category][algorithmKey]) {
    updateStatus(DESCRIPTIONS[category][algorithmKey]);
  } else {
    updateStatus("Pilih kategori dan algoritma untuk melihat deskripsinya.");
  }
}

function updateAlgorithmOptions() {
  const category = categorySelect.value;
  algorithmSelect.innerHTML = "";
  for (const key in ALGORITHMS[category]) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = ALGORITHMS[category][key].name;
    algorithmSelect.appendChild(option);
  }

  searchContainer.classList.toggle("hidden", category !== "searching");
  updateExplanation();
  reset();
}

// --- event listeners ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    usernameDisplay.textContent = username;
    loginScreen.classList.add("hidden");
    labScreen.classList.remove("hidden");
    setCanvasSize();
    updateAlgorithmOptions();
  }
});

logoutBtn.addEventListener("click", () => {
  isRunning = false;
  labScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  usernameInput.value = "";
});

window.addEventListener("resize", () => {
  if (!labScreen.classList.contains("hidden")) {
    setCanvasSize();
    drawArray();
  }
});

categorySelect.addEventListener("change", updateAlgorithmOptions);

algorithmSelect.addEventListener("change", () => {
  updateExplanation();
  reset();
});

resetBtn.addEventListener("click", () => {
  reset();
  updateExplanation();
});

startBtn.addEventListener("click", async () => {
  if (isRunning) {
    isRunning = false;
    startBtn.textContent = "Mulai";
    updateStatus("Animasi dihentikan oleh pengguna.");
    return;
  }
  isRunning = true;
  toggleControls(false);
  startBtn.disabled = false;
  startBtn.textContent = "Hentikan";

  const category = categorySelect.value;
  const algorithmKey = algorithmSelect.value;
  const selectedAlgorithm = ALGORITHMS[category][algorithmKey].func;

  if (category === "searching") {
    const target = parseInt(searchValueInput.value);
    if (isNaN(target)) {
      alert("Silakan masukkan nilai yang valid untuk dicari.");
      isRunning = false;
      toggleControls(true);
      return;
    }
    await selectedAlgorithm(target);
  } else {
    await selectedAlgorithm();
    // Final sorted animation
    if (isRunning) {
      for (let k = 0; k < array.length; k++) {
        drawArray({ [k]: COLORS.sorted });
        await sleep(20);
      }
      updateStatus("Selesai! Array telah diurutkan.");
    }
  }

  isRunning = false;
  toggleControls(true);
});

arraySizeSlider.addEventListener("input", (e) => {
  arraySizeValue.textContent = e.target.value;
  if (!isRunning) {
    reset();
    updateExplanation();
  }
});

speedSlider.addEventListener("input", (e) => {
  speedValue.textContent = `${e.target.value}ms`;
  delay = 1050 - parseInt(e.target.value);
});
