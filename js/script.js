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
