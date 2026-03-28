// 1. Inisialisasi Canvas (Ukuran Fix 340x950)
const canvasEditor = new fabric.Canvas('editorCanvas', {
    width: 340,
    height: 950,
    backgroundColor: '#ffffff'
});

// 2. Fungsi Utama: Susun Foto & Bingkai
function susunFotoKeCanvas(dataFotos) {
    canvasEditor.clear(); // Bersihkan canvas
    
    // Background dasar (paling bawah)
    const bg = new fabric.Rect({
        width: 340, height: 950,
        fill: '#F9E4F2', 
        selectable: false, evented: false
    });
    canvasEditor.add(bg);

    // Masukkan 3 Foto hasil jepretan
    dataFotos.forEach((dataUrl, index) => {
        fabric.Image.fromURL(dataUrl, function(imgFoto) {
            imgFoto.scaleToWidth(280); // Ukuran foto agar masuk ke lubang
            
            // Jarak vertikal (atur angka 120 & 260 ini jika foto kurang pas di lubang)
            const posisiY = 120 + (index * 260); 

            imgFoto.set({
                left: 170, // Tengah (340 / 2)
                top: posisiY,
                originX: 'center',
                originY: 'center',
                selectable: true // User bisa geser dikit fotonya biar pas
            });
            
            canvasEditor.add(imgFoto);
            
            // Jika sudah foto terakhir, tumpuk bingkai di paling depan
            if (index === dataFotos.length - 1) {
                pasangBingkaiTransparan();
            }
        });
    });
}

// 3. Fungsi Menempelkan Bingkai PNG dari Figma
function pasangBingkaiTransparan() {
    fabric.Image.fromURL('assets/frames/strip.png', function(imgFrame) {
        imgFrame.set({
            left: 0,
            top: 0,
            scaleX: 340 / imgFrame.width, // Paksa lebar 340px
            scaleY: 950 / imgFrame.height, // Paksa tinggi 950px
            selectable: false, // Biar bingkai gak kegeser
            evented: false,    // Klik akan tembus ke foto/stiker di bawahnya
        });
        
        canvasEditor.add(imgFrame);
        imgFrame.bringToFront(); // Wajib di depan sendiri
        canvasEditor.renderAll();
    });
}
