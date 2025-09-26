# searching - sorting: algorithm visualization lab

Proyek ini adalah laboratorium interaktif berbasis web yang memvisualisasikan cara kerja berbagai algoritma pencarian (searching) dan pengurutan (sorting). Pengguna dapat memilih algoritma, menyesuaikan ukuran larik (array) dan kecepatan animasi, lalu mengamati proses visual dari algoritma tersebut secara *real-time*.

## Fitur Utama

* **Visualisasi Interaktif**: Lihat bagaimana algoritma memproses data langkah demi langkah melalui bar chart yang dinamis.
* **Dua Kategori Algoritma**: Mendukung algoritma untuk pengurutan (sorting) dan pencarian (searching).
* **Kontrol Fleksibel**:
    * **Pilih Algoritma**: Ganti antara berbagai algoritma yang tersedia.
    * **Ukuran Data**: Sesuaikan jumlah elemen dalam larik dari 5 hingga 100.
    * **Kecepatan Animasi**: Atur kecepatan visualisasi dari 50ms hingga 1000ms per langkah.
    * **Nilai Dicari**: Masukkan angka spesifik yang ingin dicari saat menggunakan algoritma pencarian.
* **Penjelasan Terintegrasi**: Setiap algoritma dilengkapi dengan deskripsi singkat tentang cara kerjanya.
* **Sistem Login Sederhana**: Pengguna cukup memasukkan nama untuk memulai sesi di laboratorium.

## Cara Menggunakan

1.  Buka file `index.html` di peramban (browser) Anda.
2.  Masukkan nama Anda pada halaman login dan klik "Masuk".
3.  Anda akan diarahkan ke halaman laboratorium utama (`main-page.html`).
4.  Gunakan panel kontrol untuk:
    * Memilih kategori (Sorting atau Searching).
    * Memilih algoritma yang diinginkan.
    * Mengatur ukuran larik dan kecepatan animasi menggunakan slider.
    * Jika memilih kategori "Searching", masukkan nilai yang ingin dicari.
5.  Klik tombol **"Mulai"** untuk menjalankan visualisasi.
6.  Klik **"Hentikan"** untuk menjeda animasi atau **"Reset"** untuk menghasilkan larik acak yang baru.
7.  Untuk keluar, klik tombol **"Keluar"**.

## Algoritma yang Diimplementasikan

### Sorting

* **Bubble Sort**: Algoritma sederhana yang berulang kali membandingkan elemen bersebelahan dan menukarnya jika urutannya salah.
* **Selection Sort**: Memilih elemen terkecil dari bagian yang belum terurut dan memindahkannya ke awal.
* **Insertion Sort**: Membangun larik terurut satu per satu dengan mengambil elemen dan menyisipkannya ke posisi yang benar.

### Searching

* **Linear Search**: Memeriksa setiap elemen dalam daftar secara berurutan hingga elemen target ditemukan.
* **Binary Search**: Algoritma efisien yang bekerja pada larik terurut dengan berulang kali membagi interval pencarian menjadi dua.

## Teknologi yang Digunakan

* **HTML5**: Untuk struktur halaman web.
* **CSS3**: Untuk styling dan desain responsif.
* **JavaScript (ES6)**: Untuk logika aplikasi, manipulasi DOM, dan implementasi algoritma.
* **HTML Canvas**: Untuk menggambar dan menganimasikan visualisasi larik.

## Set Up

Ikuti langkah-langkah berikut untuk mengatur proyek ini secara lokal di mesin Anda.

### Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di mesin Anda:
* [Git](https://git-scm.com/)

### Kloning Repositori Ini

```bash
git clone https://github.com/kifu/searching-sorting.git
```

* Buka folder repositori yang telah di-kloning menggunakan editor kode (seperti VS Code).

* Jalankan proyek ini, cara termudah adalah dengan menggunakan ekstensi seperti "Live Server" pada VS Code yang akan secara otomatis membuka dan memuat ulang proyek di website Anda.
