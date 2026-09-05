// ======================================
// AZNET Attendance System
// absensi.js
// PART 1
// ======================================

// ==========================
// STATUS
// ==========================

let lokasiValid = false;
let selfieValid = false;
let stream = null;

// ==========================
// ELEMENT
// ==========================

const tanggal = document.getElementById("tanggal");
const jam = document.getElementById("jam");

const gpsBtn = document.getElementById("gpsBtn");

const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const gpsStatus = document.getElementById("gpsStatus");
const namaKota = document.getElementById("namaKota");

const toastBox = document.getElementById("toast");

const stepLokasi = document.getElementById("stepLokasi");
const stepSelfie = document.getElementById("stepSelfie");
const stepAbsen = document.getElementById("stepAbsen");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const hasilFoto = document.getElementById("hasilFoto");

const bukaKamera = document.getElementById("bukaKamera");
const ambilFoto = document.getElementById("ambilFoto");

const statusSelfie = document.getElementById("statusSelfie");

const btnMasuk = document.getElementById("btnMasuk");
const btnPulang = document.getElementById("btnPulang");

// ==========================
// TOAST
// ==========================

function toast(pesan, tipe = "info") {

    toastBox.className = "";

    toastBox.classList.add(tipe);

    toastBox.innerHTML = pesan;

    setTimeout(() => {

        toastBox.classList.add("show");

    }, 100);

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toastBox.classList.remove("show");

    }, 3000);

}

// ==========================
// TANGGAL
// ==========================

tanggal.innerHTML = new Date().toLocaleDateString("id-ID", {

    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"

});

// ==========================
// JAM
// ==========================

function updateJam(){

    jam.innerHTML =
    new Date().toLocaleTimeString("id-ID");

}

updateJam();

setInterval(updateJam,1000);

// ==========================
// GPS
// ==========================

gpsBtn.onclick = function(){

    toast("📍 Mengambil lokasi...","info");

    if(!navigator.geolocation){

        toast("GPS tidak didukung","error");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function(pos){

            lokasiValid = true;

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            latitude.innerHTML = lat.toFixed(6);
            longitude.innerHTML = lon.toFixed(6);

            gpsStatus.innerHTML = "🟢 Valid";

            try{

                const res = await fetch(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`

                );

                const data = await res.json();

                namaKota.innerHTML =

                data.address.city ||

                data.address.town ||

                data.address.village ||

                data.address.county ||

                "Indonesia";

            }

            catch{

                namaKota.innerHTML = "Indonesia";

            }

            stepLokasi.classList.remove("active");
            stepLokasi.classList.add("done");

            stepSelfie.classList.add("active");

            toast("✅ Lokasi berhasil diambil","success");

        },

        function(){

            toast("❌ Lokasi ditolak","error");

        }

    );

};
// ==========================
// SELFIE
// ==========================

bukaKamera.onclick = async function(){

    if(!lokasiValid){

        toast("📍 Ambil lokasi terlebih dahulu","error");

        return;

    }

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            }

        });

        video.srcObject = stream;

        video.style.display = "block";

        hasilFoto.style.display = "none";

        ambilFoto.style.display = "inline-block";

        toast("📷 Kamera berhasil dibuka","success");

    }

    catch{

        toast("❌ Kamera tidak diizinkan","error");

    }

};

// ==========================
// AMBIL FOTO
// ==========================

ambilFoto.onclick = function(){

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    ctx.drawImage(video,0,0);

    const foto = canvas.toDataURL("image/png");

    hasilFoto.src = foto;

    hasilFoto.style.display = "block";

    video.srcObject = null;

    video.style.display = "none";

    ambilFoto.style.display = "none";

    localStorage.setItem("selfie",foto);

    statusSelfie.innerHTML = "✅ Selfie berhasil";

    selfieValid = true;

    if(stream){

        stream.getTracks().forEach(track=>track.stop());

    }

    stepSelfie.classList.remove("active");

    stepSelfie.classList.add("done");

    stepAbsen.classList.add("active");

    toast("📸 Selfie berhasil","success");

};
// ==========================
// ABSEN MASUK
// ==========================

btnMasuk.onclick = function(){

    console.log("TOMBOL ABSEN MASUK DIKLIK");

    if(!lokasiValid){
        toast("📍 Silakan ambil lokasi terlebih dahulu","error");
        return;
    }

    if(!selfieValid){
        toast("📸 Silakan selfie terlebih dahulu","error");
        return;
    }

    const hariIni = new Date().toLocaleDateString("id-ID");

let daftarKaryawan =
JSON.parse(localStorage.getItem("karyawan")) || [];

let user =
daftarKaryawan.find(item =>

    item.username === localStorage.getItem("username")

);

const data = {

    username : localStorage.getItem("username"),
    nama : user ? user.nama : "",
    role : localStorage.getItem("role"),

    tanggal : hariIni,

    masuk : new Date().toLocaleTimeString("id-ID"),

    pulang : "-",

    latitude : latitude.innerHTML,

    longitude : longitude.innerHTML,

    kota : namaKota.innerHTML,

    selfie : localStorage.getItem("selfie"),

    status : "Hadir"

};
    console.log(data);
    
    localStorage.setItem("absensiHariIni", JSON.stringify(data));

    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    const sudahAda =
riwayat.find(item =>

    item.tanggal === hariIni &&

    item.username === localStorage.getItem("username")

);

    if(!sudahAda){
        riwayat.unshift(data);
    }

    localStorage.setItem(
        "riwayatAbsensi",
        JSON.stringify(riwayat)
    );

    stepAbsen.classList.remove("active");
    stepAbsen.classList.add("done");

    btnMasuk.disabled = true;
    btnMasuk.innerHTML = "✅ Sudah Absen";

    toast("🎉 Absen Masuk Berhasil","success");

};

// ==========================
// ABSEN PULANG
// ==========================

btnPulang.onclick = function(){

    let data =
    JSON.parse(localStorage.getItem("absensiHariIni"));

    if(!data){

        toast("⚠️ Belum melakukan absen masuk","error");
        return;

    }

    if(data.pulang != "-"){

        toast("⚠️ Kamu sudah absen pulang","info");
        return;

    }

    data.pulang =
    new Date().toLocaleTimeString("id-ID");

    localStorage.setItem(
        "absensiHariIni",
        JSON.stringify(data)
    );

    // update riwayat terbaru
    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    if(riwayat.length > 0){

        riwayat.forEach(item=>{

    if(

        item.tanggal === data.tanggal &&

        item.username === localStorage.getItem("username")

    ){

        item.pulang = data.pulang;

    }

});

    }

    localStorage.setItem(
        "riwayatAbsensi",
        JSON.stringify(riwayat)
    );

    btnPulang.disabled = true;
    btnPulang.innerHTML = "👋 Sudah Pulang";

    toast("👋 Absen Pulang Berhasil","success");

};
// ==========================
// CEK ABSEN HARI INI
// ==========================

function cekAbsenHariIni(){

    const hariIni =
    new Date().toLocaleDateString("id-ID");

    const dataHariIni =
    JSON.parse(localStorage.getItem("absensiHariIni"));

    if(!dataHariIni) return;

    if(dataHariIni.tanggal == hariIni){

        lokasiValid = true;
        selfieValid = true;

        btnMasuk.disabled = true;
        btnMasuk.innerHTML = "✅ Sudah Absen";

        latitude.innerHTML = dataHariIni.latitude;
        longitude.innerHTML = dataHariIni.longitude;
        namaKota.innerHTML = dataHariIni.kota;
        gpsStatus.innerHTML = "🟢 Valid";

        if(dataHariIni.selfie){

            hasilFoto.src = dataHariIni.selfie;
            hasilFoto.style.display = "block";

            statusSelfie.innerHTML =
            "✅ Selfie tersedia";

        }

        stepLokasi.classList.add("done");
        stepSelfie.classList.add("done");
        stepAbsen.classList.add("done");

        if(dataHariIni.pulang != "-"){

            btnPulang.disabled = true;
            btnPulang.innerHTML = "👋 Sudah Pulang";

        }

    }

}

cekAbsenHariIni();