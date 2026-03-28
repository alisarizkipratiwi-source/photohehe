// ==========================================
// 1. INISIALISASI & VARIABEL
// ==========================================
const video = document.getElementById('kamera');
const tombolJepret = document.getElementById('tombolJepret');
const countdownEl = document.getElementById('countdown');
const tombolDownload = document.getElementById('tombolDownload');
const tombolTambahStiker = document.getElementById('tombolTambahStiker');

const lebarStrip = 340;
const tinggiStrip = 950;
let fotoTerambil = 0;
let arrayFoto = [];

// Inisialisasi Canvas Fabric.js
const canvasEditor = new fabric.Canvas('editorCanvas', {
    width: lebarStrip,
    height: tinggiStrip,
    backgroundColor: '#ffffff'
});

// ==========================================
// 2. FUNGSI RENDER BINGKAI (LAYER PALING ATAS)
// ==========================================
function renderBingkai() {
    // Kita panggil frame PNG transparan dari Figma
    fabric.Image.fromURL('assets/frames/frame_aura.png', function(img) {
        img.set({
            left: 0,
            top: 0,
            scaleX: lebarStrip / img.width,
            scaleY: tinggiStrip / img.height,
            selectable: false, // Frame tidak boleh kegeser
            evented: false,    // Frame tidak merespon klik (biar stiker di bawahnya bisa diklik)
            name: 'layer_frame'
        });
        canvasEditor.add(img);
        img.bringToFront(); // PAKSA ke paling depan
        canvasEditor.renderAll();
    }, { crossOrigin: 'anonymous' });
}

// Jalankan bingkai pertama kali
renderBingkai();

// ==========================================
// 3. LOGIKA KAMERA
// ==========================================
async function mulaiKamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Kamera error:", err);
        alert("Gagal akses kamera!");
    }
}
mulaiKamera();

// ==========================================
// 4. PROSES AMBIL FOTO (3X)
// ==========================================
tombolJepret.addEventListener('click', () => {
    fotoTerambil = 0;
    arrayFoto = [];
    canvasEditor.clear(); // Bersihkan canvas untuk sesi baru
    
    // Pasang background warna dasar dulu
    const bgDasar = new fabric.Rect({
        width: lebarStrip, height: tinggiStrip,
        fill: '#fcf0ff', selectable: false, evented: false
    });
    canvasEditor.add(bgDasar);

    ambilFotoBeruntun();
});

function ambilFotoBeruntun() {
    if (fotoTerambil >= 3) {
        susunFotoKeCanvas();
        return;
    }

    let timer = 3;
    countdownEl.innerText = timer;
    countdownEl.style.display = 'block';

    let interval = setInterval(() => {
        timer--;
        if (timer > 0) {
            countdownEl.innerText = timer;
        } else {
            clearInterval(interval);
            countdownEl.style.display = 'none';
            
            // Jepret!
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 400; tempCanvas.height = 300;
            tempCanvas.getContext('2d').drawImage(video, 0, 0, 400, 300);
            arrayFoto.push(tempCanvas.toDataURL('image/png'));
            
            fotoTerambil++;
            setTimeout(ambilFotoBeruntun, 1000);
        }
    }, 1000);
}

// ==========================================
// 5. MENYUSUN FOTO DI BELAKANG BINGKAI
// ==========================================
function susunFotoKeCanvas() {
    arrayFoto.forEach((data, index) => {
        fabric.Image.fromURL(data, function(imgFoto) {
            imgFoto.scaleToWidth(280); // Ukuran foto disesuaikan lubang Figma
            
            // KALIBRASI POSISI: Atur angka 110 dan 250 ini agar pas di lubangmu
            const posisiY = 110 + (index * 255); 

            imgFoto.set({
                left: lebarStrip / 2,
                top: posisiY,
                originX: 'center',
                originY: 'center',
                selectable: false // Foto dikunci agar user fokus geser stiker
            });
            
            canvasEditor.add(imgFoto);
            imgFoto.sendToBack(); // Taruh di belakang Frame
            
            // Pastikan background dasar tetap paling belakang
            canvasEditor.getObjects().forEach(obj => {
                if(obj.fill === '#fcf0ff') obj.sendToBack();
            });
        });
    });

    // Panggil ulang render bingkai agar dia menutupi foto
    renderBingkai();
    tombolDownload.disabled = false;
}

// ==========================================
// 6. FITUR STIKER & DOWNLOAD
// ==========================================
tombolTambahStiker.addEventListener('click', () => {
    // Ganti 'pita.png' dengan file yang ada di folder assets/stickers/ kamu
    const urlStiker = 'assets/stickers/pita.png'; 
    
    fabric.Image.fromURL(urlStiker, function(stiker) {
        stiker.scaleToWidth(100);
        stiker.set({
            left: 170, top: 475,
            originX: 'center', originY: 'center',
            cornerColor: '#b19cd9', cornerStyle: 'circle', cornerSize: 10
        });
        canvasEditor.add(stiker);
        
        // PENTING: Stiker harus di depan foto tapi di belakang Frame? 
        // Biasanya stiker justru di PALING DEPAN (di atas frame) biar keren.
        stiker.bringToFront(); 
    });
});

tombolDownload.addEventListener('click', () => {
    canvasEditor.discardActiveObject();
    canvasEditor.renderAll();
    const link = document.createElement('a');
    link.href = canvasEditor.toDataURL({ format: 'png', quality: 1 });
    link.download = `Aura_Booth_${Date.now()}.png`;
    link.click();
});
