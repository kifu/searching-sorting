// --- dom elements ---
const loginScreen = document.getElementById("login-screen");
const labScreen = document.getElementById("lab-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const usernameDisplay = document.getElementById("username-display");
const logoutBtn = document.getElementById("logoutBtn");

const canvas = document.getElementById("sortCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
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
let arraySize = 25;
let delay = 500;
let isRunning = false;

// --- colors ---
const COLORS = {
  default: "#333333",
  compare: "#DC2626",
  swap: "#D97706",
  sorted: "#059669",
  pivot: "#0000FF",
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
  if (canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
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
  if (!ctx) return;
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

    // Draw value on top of the bar if space allows
    if (drawableBarWidth > 20) {
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(value, x + drawableBarWidth / 2, y - 5);
    }
  });
}

function updateStatus(text) {
  if (statusText) {
    statusText.textContent = text;
  }
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
  elements.forEach((el) => {
    if (el) {
      el.disabled = !enabled;
    }
  });
  if (enabled && startBtn) {
    startBtn.textContent = "Mulai";
  }
}

function reset() {
  isRunning = false;
  arraySize = arraySizeSlider ? parseInt(arraySizeSlider.value) : 25;
  delay = speedSlider ? 1050 - parseInt(speedSlider.value) : 500;
  createRandomArray(arraySize);
  if (
    categorySelect &&
    algorithmSelect &&
    categorySelect.value === "searching" &&
    algorithmSelect.value === "binary"
  ) {
    array.sort((a, b) => a - b);
  }
  drawArray();
  toggleControls(true);
}

function updateExplanation() {
  if (!categorySelect || !algorithmSelect) return;

  const category = categorySelect.value;
  const algorithmKey = algorithmSelect.value;
  if (DESCRIPTIONS[category] && DESCRIPTIONS[category][algorithmKey]) {
    updateStatus(DESCRIPTIONS[category][algorithmKey]);
  } else {
    updateStatus("Pilih kategori dan algoritma untuk melihat deskripsinya.");
  }
}

function updateAlgorithmOptions() {
  if (!categorySelect || !algorithmSelect) return;

  const category = categorySelect.value;
  algorithmSelect.innerHTML = "";
  for (const key in ALGORITHMS[category]) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = ALGORITHMS[category][key].name;
    algorithmSelect.appendChild(option);
  }

  if (category === "searching" && searchContainer) {
    searchContainer.classList.remove("hidden");
  } else if (searchContainer) {
    searchContainer.classList.add("hidden");
  }

  updateExplanation();
  reset();
}

// --- sorting algorithms ---
async function bubbleSort() {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isRunning) return;
      updateStatus(`Membandingkan ${array[j]} dan ${array[j + 1]}...`);
      drawArray({ [j]: COLORS.compare, [j + 1]: COLORS.compare });
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        updateStatus(`Tukar ${array[j]} dan ${array[j + 1]}.`);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawArray({ [j]: COLORS.swap, [j + 1]: COLORS.swap });
        await sleep(delay);
      }
    }
  }
}

async function selectionSort() {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!isRunning) return;
      updateStatus(
        `Mencari minimum... Membandingkan ${array[minIdx]} dengan ${array[j]}.`
      );
      drawArray({
        [i]: COLORS.pivot,
        [j]: COLORS.compare,
        [minIdx]: COLORS.pivot,
      });
      await sleep(delay);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      updateStatus(
        `Menukar elemen saat ini ${array[i]} dengan minimum baru ${array[minIdx]}.`
      );
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      drawArray({ [i]: COLORS.swap, [minIdx]: COLORS.swap });
      await sleep(delay);
    }
  }
}

async function insertionSort() {
  let n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    updateStatus(`Mengambil ${key} untuk disisipkan.`);
    drawArray({ [i]: COLORS.pivot });
    await sleep(delay);
    while (j >= 0 && array[j] > key) {
      if (!isRunning) return;
      updateStatus(`Memindahkan ${array[j]} ke kanan.`);
      array[j + 1] = array[j];
      drawArray({ [j]: COLORS.compare, [j + 1]: COLORS.swap });
      await sleep(delay);
      j = j - 1;
    }
    array[j + 1] = key;
    updateStatus(`Menyisipkan ${key} di posisi yang benar.`);
    drawArray({ [j + 1]: COLORS.sorted });
    await sleep(delay);
  }
}

// --- searching algorithms ---
async function linearSearch(target) {
  for (let i = 0; i < array.length; i++) {
    if (!isRunning) return -1;
    updateStatus(`Memeriksa indeks ${i}, nilai ${array[i]}.`);
    drawArray({ [i]: COLORS.compare });
    await sleep(delay);
    if (array[i] === target) {
      updateStatus(`Ditemukan! Nilai ${target} ada di indeks ${i}.`);
      drawArray({ [i]: COLORS.sorted });
      return i;
    }
  }
  updateStatus(`Tidak ditemukan! Nilai ${target} tidak ada dalam array.`);
  drawArray();
  return -1;
}

async function binarySearch(target) {
  updateStatus("Binary Search memerlukan array terurut. Mengurutkan...");
  array.sort((a, b) => a - b);
  drawArray();
  await sleep(delay * 1.5);

  let low = 0,
    high = array.length - 1;
  while (low <= high) {
    if (!isRunning) return -1;
    let mid = Math.floor((low + high) / 2);
    updateStatus(
      `Mencari di antara indeks ${low} dan ${high}. Tengah: ${mid} (nilai ${array[mid]}).`
    );
    let colorConfig = {};
    for (let i = low; i <= high; i++) colorConfig[i] = COLORS.compare;
    colorConfig[mid] = COLORS.pivot;
    drawArray(colorConfig);
    await sleep(delay);

    if (array[mid] === target) {
      updateStatus(`Ditemukan! Nilai ${target} ada di indeks ${mid}.`);
      drawArray({ [mid]: COLORS.sorted });
      return mid;
    } else if (array[mid] < target) {
      updateStatus(`${array[mid]} < ${target}. Abaikan bagian kiri.`);
      low = mid + 1;
    } else {
      updateStatus(`${array[mid]} > ${target}. Abaikan bagian kanan.`);
      high = mid - 1;
    }
    await sleep(delay);
  }
  updateStatus(`Tidak ditemukan! Nilai ${target} tidak ada dalam array.`);
  drawArray();
  return -1;
}

// --- event listeners ---
// memeriksa kita berada di login page atau ngga
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem("username", username);
      window.location.href = "main-page.html";
    }
  });
}

// memeriksa kita berada di halaman lab atau ngga
if (labScreen) {
  const savedUsername = localStorage.getItem("username");
  if (savedUsername && usernameDisplay) {
    usernameDisplay.textContent = savedUsername;
  } else if (!savedUsername) {
    window.location.href = "index.html";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      isRunning = false;
      localStorage.removeItem("username");
      window.location.href = "index.html";
    });
  }

  // inisialisasi canvas dan visualisasi
  if (canvas) {
    window.addEventListener("resize", () => {
      setCanvasSize();
      drawArray();
    });

    // inisialisasi canvas
    setCanvasSize();
  }

  // event listener untuk kontrol lab
  if (categorySelect) {
    categorySelect.addEventListener("change", updateAlgorithmOptions);
  }

  if (algorithmSelect) {
    algorithmSelect.addEventListener("change", () => {
      updateExplanation();
      reset();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      reset();
      updateExplanation();
    });
  }

  if (startBtn) {
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
  }

  if (arraySizeSlider) {
    arraySizeSlider.addEventListener("input", (e) => {
      if (arraySizeValue) {
        arraySizeValue.textContent = e.target.value;
      }
      if (!isRunning) {
        reset();
        updateExplanation();
      }
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener("input", (e) => {
      if (speedValue) {
        speedValue.textContent = `${e.target.value}ms`;
      }
      delay = 1050 - parseInt(e.target.value);
    });
  }

  // inisialisasi algoritma saat halaman dimuat
  updateAlgorithmOptions();
}
