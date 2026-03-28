// js/script.js
const video = document.getElementById('kamera');
const tombolJepret = document.getElementById('tombolJepret');
const countdownEl = document.getElementById('countdown');
const stripContainer = document.getElementById('stripContainer');
const tombolUpload = document.getElementById('tombolUpload');
const inputUpload = document.getElementById('inputUpload');
const tombolDownload = document.getElementById('tombolDownload');

let jumlahFotoMaksimal = 3;
let fotoTerambil = 0;
let finalCanvases = []; 

// Fungsi menyalakan kamera
async function mulaiKamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        alert("Izinkan akses kamera ya!");
    }
}
mulaiKamera();

// ... (Copy sisa kode JavaScript dari pesanku sebelumnya mulai dari tombolJepret.addEventListener sampai ke fungsi loadImage) ...

/* Pastikan menyalin SEMUA kode JS dari tag <script> di pesanku sebelumnya. */
// ==========================================
// FITUR EDITOR STIKER (FABRIC.JS)
// ==========================================

// Fungsi untuk menambahkan stiker ke dalam canvas editor nanti
function tambahStiker(namaFileStiker) {
    // Alamat letak file stikermu
    const urlStiker = `assets/stickers/${namaFileStiker}`;

    fabric.Image.fromURL(urlStiker, function(img) {
        // Atur ukuran awal stiker biar nggak kebesaran
        img.scale(0.5); 
        
        // Atur posisi awal stiker di tengah
        img.set({
            left: 100,
            top: 100,
            transparentCorners: false,
            cornerColor: '#b19cd9', // Warna kotak-kotak pengubah ukuran (ungu pastel)
            cornerStrokeColor: '#fff',
            borderColor: '#b19cd9',
            cornerSize: 12,
            padding: 10,
            cornerStyle: 'circle'
        });

        // Nanti gambar ini akan kita masukkan ke Canvas Utama (sedang kita siapkan)
        console.log("Stiker berhasil dimuat:", namaFileStiker);
        alert("Stiker " + namaFileStiker + " siap dimainkan! (Cek Console)");
    });
}

// Cara memanggilnya (nanti kita hubungkan ke tombol):
// tambahStiker('pita.png');
