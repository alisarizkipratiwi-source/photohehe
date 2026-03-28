// ==========================================
// DEKLARASI VARIABEL UTAMA
// ==========================================
const video = document.getElementById('kamera');
const tombolJepret = document.getElementById('tombolJepret');
const countdownEl = document.getElementById('countdown');
const tombolUpload = document.getElementById('tombolUpload');
const inputUpload = document.getElementById('inputUpload');
const tombolDownload = document.getElementById('tombolDownload');
const tombolTambahStiker = document.getElementById('tombolTambahStiker');

let jumlahFotoMaksimal = 3;
let fotoTerambil = 0;
let arrayFoto = []; // Menyimpan gambar hasil jepretan/unggahan

// ==========================================
// INISIALISASI KANVAS FABRIC.JS
// ==========================================
// Kita buat kanvas ukuran 340x950 (seukuran photo strip)
const canvasEditor = new fabric.Canvas('editorCanvas', {
    width: 340,
    height: 950,
    backgroundColor: '#ffffff'
});

// Fungsi untuk menggambar bingkai dasar (Aura) agar tidak bisa digeser user
function gambarBingkaiDasar() {
function gambarBingkaiDasar() {
    // 1. Bersihkan kanvas dulu
    canvasEditor.clear();

    // 2. Tambahkan warna background paling belakang 
    // (Bisa kamu ganti warna pastel favoritmu)
    const bgWarna = new fabric.Rect({
        left: 0, top: 0,
        width: 340, height: 950,
        fill: '#fcf0ff', // Warna ungu sangat muda
        selectable: false,
        evented: false
    });
    canvasEditor.add(bgWarna);

    // 3. Masukkan Frame PNG yang baru kamu buat tadi
    fabric.Image.fromURL('assets/frames/frame_aura.png', function(img) {
        img.set({
            left: 0,
            top: 0,
            scaleX: 340 / img.width,
            scaleY: 950 / img.height,
            selectable: false,
            evented: false
        });
        canvasEditor.add(img);
        
        // FRAME HARUS DI PALING DEPAN (biar foto di belakang lubang)
        img.bringToFront(); 
        canvasEditor.renderAll();
    });
}
// Panggil saat pertama kali dimuat
gambarBingkaiDasar();

// ==========================================
// LOGIKA KAMERA & FOTO BERUNTUN
// ==========================================
async function mulaiKamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        alert("Waduh, izinkan akses kamera ya!");
    }
}
mulaiKamera();

tombolJepret.addEventListener('click', () => {
    persiapanSesiBaru();
    ambilFotoBeruntun();
});

function persiapanSesiBaru() {
    fotoTerambil = 0;
    arrayFoto = [];
    tombolJepret.disabled = true;
    tombolUpload.disabled = true;
    tombolDownload.disabled = true;
    
    // Bersihkan kanvas dari foto/stiker lama, lalu gambar bingkai dasar lagi
    canvasEditor.clear();
    gambarBingkaiDasar();
}

function ambilFotoBeruntun() {
    if (fotoTerambil >= jumlahFotoMaksimal) {
        susunFotoKeKanvas();
        return;
    }

    let hitungan = 3;
    countdownEl.innerText = hitungan;
    countdownEl.style.display = 'block';

    let timer = setInterval(() => {
        hitungan--;
        if (hitungan > 0) {
            countdownEl.innerText = hitungan;
        } else {
            clearInterval(timer);
            countdownEl.style.display = 'none';
            
            simpanSatuFoto();
            fotoTerambil++;
            
            setTimeout(ambilFotoBeruntun, 1000); 
        }
    }, 1000);
}

function simpanSatuFoto() {
    // Ambil gambar dari video ke elemen canvas sementara (tersembunyi)
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 400; hiddenCanvas.height = 300;
    const ctx = hiddenCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 400, 300);
    
    // Simpan data gambarnya (base64) ke dalam array
    arrayFoto.push(hiddenCanvas.toDataURL('image/png'));
}

// ==========================================
// MEMASUKKAN FOTO KE DALAM KANVAS EDITOR
// ==========================================
function susunFotoKeKanvas() {
    // Loop untuk ketiga foto yang sudah diambil
    arrayFoto.forEach((dataURL, index) => {
        fabric.Image.fromURL(dataURL, function(img) {
            // Atur ukuran foto agar pas di dalam strip
            img.scaleToWidth(280); 
            
            // Hitung posisi Y agar fotonya berjejer ke bawah
            // Foto 1 di atas, Foto 2 di tengah, Foto 3 di bawah
            const posisiY = 80 + (index * 230); 

            img.set({
                left: 170, // Posisi X di tengah kanvas (340/2)
                top: posisiY,
                originX: 'center', // Titik jangkar di tengah
                selectable: false, // Fotonya kita kunci biar nggak kegeser user
                evented: false,
                stroke: '#ccc', // Kasih border abu-abu tipis di fotonya
                strokeWidth: 2
            });

            // Masukkan ke kanvas
            canvasEditor.add(img);
            
            // Pastikan stiker selalu di atas foto (kalau ada)
            img.sendToBack(); 
        });
    });

    // Aktifkan kembali tombol-tombol
    tombolJepret.disabled = false;
    tombolUpload.disabled = false;
    tombolDownload.disabled = false;
    tombolJepret.innerText = "📸 Ulangi Foto (3x)";
}

// ==========================================
// FITUR STIKER INTERAKTIF (DRAG & DROP)
// ==========================================
tombolTambahStiker.addEventListener('click', () => {
    // Pastikan kamu punya file 'pita.png' di folder 'assets/stickers/'
    // Jika tidak ada, kode ini akan gagal memuat gambar.
    // Sementara kita pakai gambar dummy dari internet agar tidak error saat kamu coba:
    const urlStiker = 'https://cdn-icons-png.flaticon.com/512/3204/3204558.png'; // Ganti jadi 'assets/stickers/pita.png' nanti
    
    fabric.Image.fromURL(urlStiker, function(stiker) {
        stiker.scaleToWidth(80); // Ukuran awal stiker
        
        stiker.set({
            left: 170, // Muncul di tengah
            top: 450,
            originX: 'center',
            originY: 'center',
            transparentCorners: false,
            cornerColor: '#b19cd9', // Warna kotak-kotak resize aesthetic
            cornerStrokeColor: '#fff',
            borderColor: '#b19cd9',
            cornerSize: 12,
            padding: 5,
            cornerStyle: 'circle'
        });

        canvasEditor.add(stiker);
        canvasEditor.setActiveObject(stiker); // Otomatis dipilih setelah ditambah
    }, { crossOrigin: 'anonymous' }); // Diperlukan jika ambil gambar dari URL luar
});

// ==========================================
// FITUR UNDUH (DOWNLOAD) KANVAS
// ==========================================
tombolDownload.addEventListener('click', () => {
    // Hilangkan dulu garis seleksi stiker sebelum di-download
    canvasEditor.discardActiveObject();
    canvasEditor.renderAll();

    // Ubah isi kanvas menjadi file gambar
    const dataURL = canvasEditor.toDataURL({
        format: 'png',
        quality: 1
    });

    // Buat link download otomatis
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `Aura_Strip_${new Date().getTime()}.png`;
    link.click();
});
