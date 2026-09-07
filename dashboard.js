const body = document.body;

const tanggal = document.getElementById("tanggal");
const jam = document.getElementById("jam");

const namaUser = document.getElementById("namaUser");
const jabatan = document.getElementById("jabatan");

const sapaan = document.getElementById("sapaan");
const motivasi = document.getElementById("motivasi");

const darkMode = document.getElementById("darkMode");

const toastBox = document.getElementById("toast");

const sidebar = document.querySelector(".sidebar");
const menuToggle = document.getElementById("menuToggle");

const progress = document.getElementById("progressHadir");
const persenHadir = document.getElementById("persenHadir");

const fotoUser = document.getElementById("fotoUser");
const uploadFoto = document.getElementById("uploadFoto");

const gpsStatus = document.getElementById("gpsStatus");
const selfieStatus = document.getElementById("selfieStatus");

const jamMasuk = document.getElementById("jamMasuk");
const jamMasukQuick = document.getElementById("jamMasukQuick");
const jamPulang = document.getElementById("jamPulang");

const lokasi = document.getElementById("lokasi");
const status = document.getElementById("status");

const suhu = document.getElementById("suhu");
const cuaca = document.getElementById("cuaca");
const kota = document.getElementById("kota");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const hasilFoto = document.getElementById("hasilFoto");
const ambilFoto = document.getElementById("ambilFoto");


const nama =
localStorage.getItem("nama") || "Karyawan";

const role =
localStorage.getItem("role") || "staff";

if(namaUser){

    namaUser.innerHTML="👋 Halo, "+nama;

}

const jabatanUser =
localStorage.getItem("jabatan") || "-";

if(jabatan){

    jabatan.innerHTML = "💼 " + jabatanUser;

}




function toast(pesan, tipe="info"){

    const t=document.getElementById("toast");

    if(!t) return;

    t.className="";
    t.classList.add(tipe);

    t.innerHTML=pesan;

    setTimeout(()=>{
        t.classList.add("show");
    },50);

clearTimeout(window.toastTimer);

window.toastTimer = setTimeout(()=>{
        t.classList.remove("show");
    },3000);

}


if(tanggal){

tanggal.innerHTML=
new Date().toLocaleDateString("id-ID",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

}


function updateJam(){

if(jam){

jam.innerHTML=
new Date().toLocaleTimeString("id-ID");

}

}

updateJam();

setInterval(updateJam,1000);


function updateSapaan(){

const h=new Date().getHours();

let title="";
let desc="";
let bg="";

if(h>=5 && h<11){

title="☀️ Selamat Pagi, "+nama;

desc="Semoga harimu menyenangkan 😊";

bg="linear-gradient(135deg,#38BDF8,#2563EB)";

}

else if(h>=11 && h<15){

title="🌤 Selamat Siang, "+nama;

desc="Tetap semangat bekerja 💙";

bg="linear-gradient(135deg,#3B82F6,#1D4ED8)";

}

else if(h>=15 && h<18){

title="🌇 Selamat Sore, "+nama;

desc="Sedikit lagi selesai 💪";

bg="linear-gradient(135deg,#FB923C,#EA580C)";

}

else{

title="🌙 Selamat Malam, "+nama;

desc="Terima kasih atas kerja kerasmu 🙌";

bg="linear-gradient(135deg,#0F172A,#1E293B)";

}

sapaan.innerHTML=title;

motivasi.innerHTML=desc;

body.style.background=bg;

}

updateSapaan();

setInterval(updateSapaan,60000);


darkMode.onclick=function(){

body.classList.toggle("dark");

};

if(menuToggle){

menuToggle.onclick=function(){

sidebar.classList.toggle("active");

};

document.addEventListener("click",function(e){

if(
!sidebar.contains(e.target)
&&
!menuToggle.contains(e.target)
){

sidebar.classList.remove("active");

}

});

}

if(fotoUser){

    const username =
    localStorage.getItem("username");

    const semuaProfil =
    JSON.parse(localStorage.getItem("profil")) || {};

    if(
        semuaProfil[username] &&
        semuaProfil[username].foto
    ){

        fotoUser.src =
        semuaProfil[username].foto;

    }

}

async function ambilLokasi() {

    if (!navigator.geolocation) {

        toast("❌ Browser tidak mendukung GPS", "error");
        return false;

    }

    return new Promise((resolve) => {

        navigator.geolocation.getCurrentPosition(

            async function (pos) {

                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                gpsStatus.innerHTML = "🟢 Aktif";

                try {

                    const res = await fetch(
                        `https:nominatim.openstreetmap.orgreverse?format=json&lat=${lat}&lon=${lon}`
                    );

                    const data = await res.json();

                    const alamat = data.display_name || "Lokasi tidak diketahui";

                    lokasi.innerHTML = "📍 " + alamat;

                    localStorage.setItem("latitude", lat);
                    localStorage.setItem("longitude", lon);
                    localStorage.setItem("alamat", alamat);

                } catch {

                    lokasi.innerHTML =
                        `📍 ${lat.toFixed(6)}, ${lon.toFixed(6)}`;

                }

                resolve(true);

            },

            function (err) {

                gpsStatus.innerHTML = "❌ Gagal";

                switch (err.code) {

                    case 1:
                        toast("❌ Izin lokasi ditolak", "error");
                        break;

                    case 2:
                        toast("❌ Lokasi tidak ditemukan", "error");
                        break;

                    case 3:
                        toast("❌ GPS timeout", "error");
                        break;

                    default:
                        toast("❌ GPS Error", "error");

                }

                resolve(false);

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

    });

}


const btnPulang = document.getElementById("pulang");

if (btnPulang) {

    btnPulang.onclick = function () {

        // Cek apakah sudah absen masuk
        if (!localStorage.getItem("jamMasuk")) {

            toast("⚠️ Silakan Absen Masuk terlebih dahulu!", "error");
            return;

        }

        const waktu = new Date().toLocaleTimeString("id-ID");

        jamPulang.innerHTML = waktu;

        status.innerHTML = "🏠 Sudah Pulang";

        localStorage.setItem("jamPulang", waktu);

        toast("👋 Absen Pulang Berhasil", "success");

    };

}


async function loadCuaca(){

    if(!navigator.geolocation){

        cuaca.innerHTML="GPS Tidak Didukung";
        return;

    }

    navigator.geolocation.getCurrentPosition(async(pos)=>{

        const lat=pos.coords.latitude;
        const lon=pos.coords.longitude;

        try{

          

            const weather=await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
            );

            const data=await weather.json();

            suhu.innerHTML=
            Math.round(data.current.temperature_2m)+"°C";

            let code=data.current.weather_code;

            let kondisi="☀️ Cerah";

            if(code>=1 && code<=3)
                kondisi="⛅ Berawan";

            else if(code>=45 && code<=48)
                kondisi="🌫 Berkabut";

            else if(code>=51 && code<=67)
                kondisi="🌦 Gerimis";

            else if(code>=71 && code<=86)
                kondisi="❄️ Dingin";

            else if(code>=95)
                kondisi="⛈ Badai";

            cuaca.innerHTML=kondisi;

            

            const lokasi=await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );

            const alamat=await lokasi.json();

            kota.innerHTML=
                alamat.address.city ||
                alamat.address.town ||
                alamat.address.village ||
                alamat.address.county ||
                "Indonesia";

        }

        catch{

            suhu.innerHTML="--°";
            cuaca.innerHTML="Tidak tersedia";
            kota.innerHTML="-";

        }

    });

}

loadCuaca();


const btnSelfie = document.getElementById("kamera");

let stream = null;

if(btnSelfie){

    btnSelfie.onclick = async function(){

        try{

            stream = await navigator.mediaDevices.getUserMedia({

                video:{
                    facingMode:"user"
                }

            });

            video.srcObject = stream;

            video.style.display = "block";

            hasilFoto.style.display = "none";

            ambilFoto.style.display = "block";

            toast("📸 Kamera berhasil dibuka","info");

        }

        catch(err){

            console.log(err);

            toast("❌ Kamera tidak diizinkan","error");

        }

    };

}


if(ambilFoto){

    ambilFoto.onclick = function(){

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video,0,0);

        const foto = canvas.toDataURL("image/png");

        hasilFoto.src = foto;

        hasilFoto.style.display = "block";

        video.style.display = "none";

        ambilFoto.style.display = "none";

        localStorage.setItem("selfie",foto);

        selfieStatus.innerHTML = "Done ✅";

        if(stream){

            stream.getTracks().forEach(track=>track.stop());

        }

        toast("✅ Selfie berhasil disimpan","success");

    };

}
function logout(){

    let konfirmasi = confirm(
        "Apakah kamu yakin ingin logout?"
    );


    if(konfirmasi){

        // hapus data user
        localStorage.removeItem("nama");
        localStorage.removeItem("role");


        // arahkan ke halaman login
        window.location.href = "login.html";

    }

}
const menuAbsen = document.getElementById("masuk");

if(menuAbsen){

    menuAbsen.onclick = function(){

        window.location.href = "absensi.html";

    }

}
const menuRiwayat = document.getElementById("riwayat");

if(menuRiwayat){

    menuRiwayat.onclick = function(){

        window.location.href = "riwayat.html";

    };

}


function loadStatistik(){

    const riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    let hadir = riwayat.length;

    let telat = 0;

    let alpha = 0;

    riwayat.forEach(item=>{

        if(item.status=="Telat") telat++;

        if(item.status=="Alpha") alpha++;

    });

    document.getElementById("totalHadir").innerHTML = hadir;

    document.getElementById("totalTelat").innerHTML = telat;

    document.getElementById("totalAlpha").innerHTML = alpha;

}

function loadProgress(){

    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    let hadir = riwayat.length;

    let totalHari = 22;

    let persen = Math.round((hadir / totalHari) * 100);

    if(isNaN(persen)){
        persen = 0;
    }

    document.getElementById("progressHadir").style.width =
    persen + "%";

    document.getElementById("persenHadir").innerHTML =
    persen + "% Kehadiran";

}

loadProgress();


function loadAbsensiHariIni(){

    const data = JSON.parse(localStorage.getItem("absensiHariIni"));

    if(!data) return;

    document.getElementById("status").innerHTML = data.status;

    document.getElementById("jamMasuk").innerHTML = data.masuk;

    document.getElementById("jamMasukQuick").innerHTML = data.masuk;

    document.getElementById("jamPulang").innerHTML = data.pulang;

    document.getElementById("lokasi").innerHTML =
        data.kota + "<br>" +
        data.latitude + ", " + data.longitude;

    document.getElementById("gpsStatus").innerHTML = "Valid ✅";

    if(data.selfie){

        document.getElementById("selfieStatus").innerHTML = "Done ✅";

        const foto = document.getElementById("hasilFoto");

        if(foto){
            foto.src = data.selfie;
            foto.style.display = "block";
        }

    }

}

loadAbsensiHariIni();
function loadDashboard(){

    const data =
    JSON.parse(localStorage.getItem("absensiHariIni"));

    if(!data) return;

    document.getElementById("status").innerHTML =
    data.status;

    document.getElementById("jamMasuk").innerHTML =
    data.masuk;

    document.getElementById("jamMasukQuick").innerHTML =
    data.masuk;

    document.getElementById("jamPulang").innerHTML =
    data.pulang;

    document.getElementById("lokasi").innerHTML =
    data.kota;

    document.getElementById("gpsStatus").innerHTML =
    "Valid ✅";

    if(data.selfie){

        document.getElementById("selfieStatus").innerHTML =
        "Done ✅";

        document.getElementById("hasilFoto").src =
        data.selfie;

    }

}

loadStatistik();
loadProgress();
loadAbsensiHariIni();
loadDashboard();


function loadProfil(){

    const profil =
    JSON.parse(localStorage.getItem("profil"));

    if(!profil) return;

    if(profil.nama){

        document.getElementById("namaUser").innerHTML =
        "👋 Halo, " + profil.nama;

    }

    if(profil.jabatan){

        document.getElementById("jabatan").innerHTML =
        profil.jabatan;

    }

    if(profil.foto){

        document.getElementById("fotoUser").src =
        profil.foto;

    }

}
loadProfil();
loadStatistik();
loadProgress();
loadAbsensiHariIni();
loadDashboard();



function cekMenuAdmin(){

    const role =
        localStorage.getItem("role");

    const adminMenu =
        document.getElementById("adminMenu");

    const adminKaryawan =
        document.getElementById("adminKaryawan");

    const adminRekap =
        document.getElementById("adminRekap");

    const adminMenuTitle =
        document.getElementById("adminMenuTitle");




    if(role !== "admin"){

        if(adminMenu){
            adminMenu.style.display = "none";
        }

        if(adminKaryawan){
            adminKaryawan.style.display = "none";
        }

        if(adminRekap){
            adminRekap.style.display = "none";
        }

        if(adminMenuTitle){
            adminMenuTitle.style.display = "none";
        }

    }

}



cekMenuAdmin();


let riwayat =
JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

let hadir = 0;
let telat = 0;
let alpha = 0;

riwayat.forEach(item=>{

    if(item.status=="Hadir"){
        hadir++;
    }

    if(item.status=="Terlambat"){
        telat++;
    }

    if(item.status=="Alpha"){
        alpha++;
    }

});

document.getElementById("totalHadir").innerHTML =
hadir;

document.getElementById("totalTelat").innerHTML =
telat;

document.getElementById("totalAlpha").innerHTML =
alpha;



function loadTotalKaryawan(){

    let list =
    JSON.parse(localStorage.getItem("karyawan")) || [];

    const total = document.getElementById("totalKaryawan");

    if(total){
        total.innerText = list.length;
    }

}

loadTotalKaryawan();



let bulanLemburSaya = new Date().getMonth();
let tahunLemburSaya = new Date().getFullYear();


function bukaLemburSaya() {

    const modal =
        document.getElementById("modalLemburSaya");

    if (!modal) {
        console.error("Modal Lembur Saya tidak ditemukan!");
        return;
    }

    tampilkanLemburSaya();
    updateBulanLemburSaya();

    modal.style.display = "flex";
}




function tutupLemburSaya() {

    const modal =
        document.getElementById("modalLemburSaya");

    if (modal) {
        modal.style.display = "none";
    }
}

function updateBulanLemburSaya() {

    const element =
        document.getElementById("bulanLemburSayaText");

    if (!element) return;

    const tanggal = new Date(
        tahunLemburSaya,
        bulanLemburSaya,
        1
    );

    element.textContent =
        tanggal.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric"
        });
}


function bulanSebelumnyaLembur() {

    bulanLemburSaya--;

    if (bulanLemburSaya < 0) {
        bulanLemburSaya = 11;
        tahunLemburSaya--;
    }

    updateBulanLemburSaya();
    tampilkanLemburSaya();
}


function bulanBerikutnyaLembur() {

    bulanLemburSaya++;

    if (bulanLemburSaya > 11) {
        bulanLemburSaya = 0;
        tahunLemburSaya++;
    }

    updateBulanLemburSaya();
    tampilkanLemburSaya();
}


function tampilkanLemburSaya() {

    const container =
        document.getElementById("daftarLemburSaya");

    const totalElement =
        document.getElementById("totalLemburSaya");

    if (!container) return;


    const namaUser =
        String(localStorage.getItem("nama") || "")
        .trim();


    const semuaLembur =
        JSON.parse(
            localStorage.getItem("dataLembur") || "[]"
        );



    const lemburSaya =
        semuaLembur.filter(item => {

            const namaLembur =
                String(
                    item.nama ||
                    item.karyawan ||
                    ""
                ).trim();


            if (
                namaLembur.toLowerCase() !==
                namaUser.toLowerCase()
            ) {
                return false;
            }


            if (!item.tanggal) {
                return false;
            }


            const tanggal =
                new Date(
                    item.tanggal + "T00:00:00"
                );


            return (
                tanggal.getMonth() === bulanLemburSaya &&
                tanggal.getFullYear() === tahunLemburSaya
            );

        });




    const total =
        lemburSaya.reduce((sum, item) => {

            return sum +
                Number(
                    item.nominal ||
                    item.totalUang ||
                    0
                );

        }, 0);


    if (totalElement) {

        totalElement.textContent =
            "Rp" + total.toLocaleString("id-ID");

    }



    if (lemburSaya.length === 0) {

        container.innerHTML = `
            <div class="empty-lembur-saya">

                <i class="fa-solid fa-business-time"></i>

                <p>Belum ada data lembur.</p>

                <small>
                    Tidak ada lembur pada bulan ini.
                </small>

            </div>
        `;

        return;

    }




    lemburSaya.sort((a, b) =>
        new Date(b.tanggal) -
        new Date(a.tanggal)
    );



    container.innerHTML =
        lemburSaya.map(item => {

            const nominal =
                Number(
                    item.nominal ||
                    item.totalUang ||
                    0
                );


            const tanggal =
                new Date(
                    item.tanggal + "T00:00:00"
                ).toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );


            return `
                <div class="lembur-saya-item">

                    <div class="lembur-saya-item-icon">
                        <i class="fa-solid fa-business-time"></i>
                    </div>

                    <div class="lembur-saya-item-info">

                        <strong>
                            ${item.jenisPekerjaan || "Pekerjaan Lembur"}
                        </strong>

                        <span>
                            📅 ${tanggal}
                        </span>

                        <p>
                            ${item.keterangan || "-"}
                        </p>

                    </div>

                    <div class="lembur-saya-item-nominal">

                        Rp${nominal.toLocaleString("id-ID")}

                    </div>

                </div>
            `;

        }).join("");

}
