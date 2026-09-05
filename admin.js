// =============================
// ADMIN PANEL
// =============================

// -----------------------------
// DATA ABSENSI
// -----------------------------

let absensi =
JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

let karyawan =
JSON.parse(localStorage.getItem("karyawan")) || [];

let tbody =
document.getElementById("dataAbsensi");

let hariIni =
new Date().toLocaleDateString("id-ID");

let hadir =
absensi.filter(item =>
    item.tanggal === hariIni
).length;

// =============================
// TAMPILKAN DATA ABSENSI
// =============================

function tampilAbsensi(data){

    tbody.innerHTML = "";

if(data.length === 0){

    tbody.innerHTML = `

        <tr class="empty-row">

            <td colspan="5">

                <div class="empty-absensi">

                    <span class="empty-icon">
                        📋
                    </span>

                    <p>
                        Belum ada data absensi
                    </p>

                </div>

            </td>

        </tr>

    `;

    return;

}
    data.forEach(item=>{

        tbody.innerHTML += `

        <tr>

            <td>
                ${item.nama || "Karyawan"}
            </td>

            <td>
                ${item.masuk || "-"}
            </td>

            <td>
                ${item.pulang || "-"}
            </td>

            <td>
                ${item.kota || "-"}
            </td>

            <td>

                <span class="status approved">

                    ${item.status || "Hadir"}

                </span>

            </td>

        </tr>

        `;

    });

}

// Tampilkan semua data saat pertama dibuka
tampilAbsensi(absensi);

// =============================
// FILTER ABSENSI
// =============================

const btnFilter =
document.getElementById("btnFilter");

const btnResetFilter =
document.getElementById("btnResetFilter");

if(btnFilter){

    btnFilter.onclick = function(){

        const mulai =
        document.getElementById("filterMulai").value;

        const selesai =
        document.getElementById("filterSelesai").value;


        // Kalau salah satu kosong
        if(!mulai || !selesai){

            alert(
                "Silakan pilih tanggal mulai dan tanggal selesai."
            );

            return;

        }


        // Validasi tanggal
        if(mulai > selesai){

            alert(
                "Tanggal mulai tidak boleh lebih besar dari tanggal selesai."
            );

            return;

        }


        const hasil =
        absensi.filter(item => {

            // Data tanggal harus format YYYY-MM-DD
            // agar bisa dibandingkan langsung

            if(!item.tanggal) return false;

            const tanggal =
            ubahTanggal(item.tanggal);

            return tanggal >= mulai &&
                   tanggal <= selesai;

        });


        tampilAbsensi(hasil);

    };

}


// =============================
// RESET FILTER
// =============================

if(btnResetFilter){

    btnResetFilter.onclick = function(){

        document.getElementById("filterMulai").value = "";

        document.getElementById("filterSelesai").value = "";

        tampilAbsensi(absensi);

    };

}

// =============================
// KONVERSI TANGGAL
// =============================

function ubahTanggal(tanggal){

    // Kalau sudah YYYY-MM-DD
    if(
        /^\d{4}-\d{2}-\d{2}$/.test(tanggal)
    ){

        return tanggal;

    }


    // Format DD/MM/YYYY
    const bagian =
    tanggal.split("/");

    if(bagian.length === 3){

        return `${bagian[2]}-${bagian[1].padStart(2,"0")}-${bagian[0].padStart(2,"0")}`;

    }

    return tanggal;

}

// =============================
// DATA CUTI
// =============================

let cuti =
    JSON.parse(
        localStorage.getItem("cuti")
    ) || [];

let list =
    document.getElementById("dataCuti");

if(list){

    list.innerHTML = "";

}


// =============================
// IZIN / CUTI MENUNGGU
// =============================

const pendingCuti =
    cuti.filter(item =>
        item.status === "Menunggu"
    ).length;


// Tampilkan jumlah pending

const izinHariIni =
    document.getElementById("izinHariIni");

if(izinHariIni){

    izinHariIni.innerHTML =
        pendingCuti;

}


const infoIzin =
    document.getElementById("infoIzin");

if(infoIzin){

    infoIzin.innerHTML =
        pendingCuti + " Menunggu";

}


// =============================
// TAMPILKAN DATA CUTI
// =============================

if(list){

    cuti.forEach((item,index)=>{

        list.innerHTML += `

        <div class="item" data-jenis="cuti">

            <h3>
                👤 ${item.nama}
            </h3>

            <p>
                <b>${item.jenis}</b>
            </p>

            <p>
                ${item.mulai} - ${item.selesai}
            </p>

            <p>
                ${item.alasan}
            </p>

            ${
                item.surat
                ?
                `
                <button
                    class="lihatSurat"
                    onclick="lihatSurat('${item.surat}')">

                    👁️ Lihat Surat

                </button>
                `
                :
                ""
            }

            <span class="status ${
                item.status == "Menunggu"
                ? "pending"
                : item.status == "Disetujui"
                ? "approved"
                : "rejected"
            }">

                ${item.status}

            </span>

            ${
                item.status === "Disetujui" &&
                item.approvedBy
                ?
                `
                <div class="approval-info">

                    <small>
                        ✅ Disetujui oleh
                    </small>

                    <strong>
                        ${item.approvedBy}
                    </strong>

                    <span>
                        ${item.approvedAt || "-"}
                    </span>

                </div>
                `
                :
                ""
            }

            ${
                item.status === "Ditolak" &&
                item.rejectedBy
                ?
                `
                <div class="approval-info rejected-info">

                    ${
                        item.rejectionReason
                        ?
                        `
                        <div class="rejection-reason">

                            <small>
                                💬 Alasan Penolakan
                            </small>

                            <p>
                                ${item.rejectionReason}
                            </p>

                        </div>
                        `
                        :
                        ""
                    }

                    <small>
                        ❌ Ditolak oleh
                    </small>

                    <strong>
                        ${item.rejectedBy}
                    </strong>

                    <span>
                        ${item.rejectedAt || "-"}
                    </span>

                </div>
                `
                :
                ""
            }

            <br><br>

            ${
                item.status === "Menunggu"
                ?
                `
                <button
                    class="approve"
                    onclick="setujui(${index})">

                    ✔ Setujui

                </button>

                <button
                    class="reject"
                    onclick="bukaModalTolak(${index})">

                    ✖ Tolak

                </button>
                `
                :
                ""
            }

        </div>

        `;

    });

}


// -----------------------------
// SETUJUI
// -----------------------------

function setujui(i){

    const sekarang =
    new Date();

    cuti[i].status =
    "Disetujui";

    cuti[i].approvedBy =
    localStorage.getItem("username") || "Admin";

    cuti[i].approvedAt =
    sekarang.toLocaleString("id-ID", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric",

        hour: "2-digit",
        minute: "2-digit"

    });


    localStorage.setItem(

        "cuti",

        JSON.stringify(cuti)

    );

    alert(
        "✅ Pengajuan berhasil disetujui."
    );

    location.reload();

}


// =============================
// MODAL TOLAK
// =============================

let indexTolak = -1;


function bukaModalTolak(index){

    indexTolak = index;

    const textarea =
    document.getElementById("alasanPenolakan");

    textarea.value = "";

    document
    .getElementById("modalTolak")
    .classList.add("show");

    setTimeout(() => {

        textarea.focus();

    }, 100);

}


function tutupModalTolak(){

    document
    .getElementById("modalTolak")
    .classList.remove("show");

    indexTolak = -1;

}


// =============================
// KONFIRMASI TOLAK
// =============================

function konfirmasiTolak(){

    if(indexTolak === -1){

        return;

    }


    const alasan =
    document
    .getElementById("alasanPenolakan")
    .value
    .trim();


    if(alasan === ""){

        alert(
            "⚠️ Alasan penolakan wajib diisi."
        );

        return;

    }


    const sekarang =
    new Date();


    cuti[indexTolak].status =
    "Ditolak";


    cuti[indexTolak].rejectedBy =
    localStorage.getItem("username") || "Admin";


    cuti[indexTolak].rejectedAt =
    sekarang.toLocaleString(
        "id-ID",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );


    cuti[indexTolak].rejectionReason =
    alasan;


    localStorage.setItem(
        "cuti",
        JSON.stringify(cuti)
    );


    tutupModalTolak();


    alert(
        "❌ Pengajuan berhasil ditolak."
    );


    location.reload();

}

// =============================
// DATA LEMBUR
// =============================

let lembur =
    JSON.parse(
        localStorage.getItem("lembur")
    ) || [];

const dataLembur =
    document.getElementById("dataLembur");

const infoLembur =
    document.getElementById("infoLembur");


// =============================
// TAMPILKAN DATA LEMBUR
// =============================

function tampilLembur(){

    if(!dataLembur) return;

    dataLembur.innerHTML = "";

    // Hitung yang masih menunggu
    const pending =
        lembur.filter(item =>
            item.status === "Menunggu"
        ).length;


    if(infoLembur){

        infoLembur.innerHTML =
            pending + " Menunggu";

    }


    // Kalau kosong
    if(lembur.length === 0){

        dataLembur.innerHTML = `

            <div class="empty-absensi">

                📋 Belum ada pengajuan lembur.

            </div>

        `;

        return;

    }


    // =============================
    // TAMPILKAN SATU-SATU
    // =============================

    lembur.forEach((item,index) => {

    dataLembur.innerHTML += `

        <div class="item" data-jenis="lembur">

            <h3>
                ⏱️ ${item.nama || "Karyawan"}
            </h3>

            <p>
                📅 <b>Tanggal:</b>
                ${item.tanggal || "-"}
            </p>

            <p>
                🕐 <b>Jam:</b>
                ${item.jamMulai || item.mulai || "-"}
                -
                ${item.jamSelesai || item.selesai || "-"}
            </p>

            <p>
                💼 <b>Alasan:</b>
                ${item.alasan || item.pekerjaan || "-"}
            </p>

            <p>
                💰 <b>Nominal:</b>
                ${
                    item.nominal
                    ?
                    "Rp " +
                    Number(item.nominal)
                    .toLocaleString("id-ID")
                    :
                    "Belum ditentukan"
                }
            </p>

            <span class="status ${
                item.status === "Menunggu"
                ? "pending"
                : item.status === "Disetujui"
                ? "approved"
                : "rejected"
            }">

                ${item.status || "Menunggu"}

            </span>


            ${
                item.status === "Disetujui"
                ?
                `
                <div class="approval-info">

                    <small>
                        ✅ Disetujui oleh
                    </small>

                    <strong>
                        ${item.approvedBy || "Admin"}
                    </strong>

                    <span>
                        ${item.approvedAt || "-"}
                    </span>

                </div>
                `
                :
                ""
            }


            ${
                item.status === "Ditolak"
                ?
                `
                <div class="approval-info rejected-info">

                    <small>
                        ❌ Ditolak oleh
                    </small>

                    <strong>
                        ${item.rejectedBy || "Admin"}
                    </strong>

                    ${
                        item.rejectionReason
                        ?
                        `
                        <p>
                            💬 ${item.rejectionReason}
                        </p>
                        `
                        :
                        ""
                    }

                </div>
                `
                :
                ""
            }


            ${
                item.status === "Menunggu"
                ?
                `

                <br>

                <button
                    class="approve"
                    onclick="setujuiLembur(${index})">

                    ✔ Setujui

                </button>

                <button
                    class="reject"
                    onclick="tolakLembur(${index})">

                    ✖ Tolak

                </button>

                `
                :
                ""
            }

        </div>

        `;

    });

}


// =============================
// SETUJUI LEMBUR
// =============================

function setujuiLembur(index){

    const item =
        lembur[index];


    // Admin menentukan nominal
    const nominal =
        prompt(
            "Masukkan nominal uang lembur:",
            ""
        );


    if(nominal === null){

        return;

    }


    // Hilangkan titik/koma
    const angka =
        nominal
        .replace(/\D/g, "");


    if(!angka || Number(angka) <= 0){

        alert(
            "⚠️ Nominal lembur harus diisi."
        );

        return;

    }


    const sekarang =
        new Date();


    item.status =
        "Disetujui";


    item.nominal =
        Number(angka);


    item.approvedBy =
        localStorage.getItem("username")
        || "Admin";


    item.approvedAt =
        sekarang.toLocaleString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    localStorage.setItem(
        "lembur",
        JSON.stringify(lembur)
    );


    alert(
        "✅ Pengajuan lembur berhasil disetujui."
    );


    tampilLembur();

}


// =============================
// TOLAK LEMBUR
// =============================

function tolakLembur(index){

    const alasan =
        prompt(
            "Masukkan alasan penolakan lembur:"
        );


    if(alasan === null){

        return;

    }


    if(alasan.trim() === ""){

        alert(
            "⚠️ Alasan penolakan wajib diisi."
        );

        return;

    }


    const sekarang =
        new Date();


    lembur[index].status =
        "Ditolak";


    lembur[index].rejectedBy =
        localStorage.getItem("username")
        || "Admin";


    lembur[index].rejectedAt =
        sekarang.toLocaleString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    lembur[index].rejectionReason =
        alasan;


    localStorage.setItem(
        "lembur",
        JSON.stringify(lembur)
    );


    alert(
        "❌ Pengajuan lembur berhasil ditolak."
    );


    tampilLembur();

}


// =============================
// LOAD LEMBUR
// =============================

tampilLembur();

// ==========================
// GREETING
// ==========================

function greetingAdmin(){

    let jam = new Date().getHours();

    let teks = "";

    if(jam >= 5 && jam < 11){

        teks = "☀️ Selamat Pagi, Admin";

    }else if(jam >= 11 && jam < 15){

        teks = "🌤️ Selamat Siang, Admin";

    }else if(jam >= 15 && jam < 18){

        teks = "🌇 Selamat Sore, Admin";

    }else{

        teks = "🌙 Selamat Malam, Admin";

    }

    document.getElementById("greeting").innerHTML =
    teks + " 👋";

}
greetingAdmin();

function updateJam(){

let now = new Date();

document.getElementById("jam").innerHTML =
now.toLocaleTimeString("id-ID");

document.getElementById("tanggal").innerHTML =
now.toLocaleDateString("id-ID",{

weekday:"long",
day:"numeric",
month:"long",
year:"numeric"

});

}

updateJam();

setInterval(updateJam,1000);

function jamRealtime(){

    let sekarang = new Date();

    let jam =
    String(sekarang.getHours()).padStart(2,"0");

    let menit =
    String(sekarang.getMinutes()).padStart(2,"0");

    let detik =
    String(sekarang.getSeconds()).padStart(2,"0");

    document.getElementById("jam").innerHTML =
    jam + ":" + menit + ":" + detik;

}

setInterval(jamRealtime,1000);

jamRealtime();
function tanggalHariIni(){

const hari=[
"Minggu",
"Senin",
"Selasa",
"Rabu",
"Kamis",
"Jumat",
"Sabtu"
];

const bulan=[
"Januari",
"Februari",
"Maret",
"April",
"Mei",
"Juni",
"Juli",
"Agustus",
"September",
"Oktober",
"November",
"Desember"
];

let sekarang=new Date();

document.getElementById("tanggal").innerHTML=

`${hari[sekarang.getDay()]},
${sekarang.getDate()}
${bulan[sekarang.getMonth()]}
${sekarang.getFullYear()}`;

}

tanggalHariIni();

// =============================
// CEK APAKAH KARYAWAN LIBUR
// =============================

function karyawanSedangLibur(nama, tanggal = new Date()){

    let jadwal =
        JSON.parse(
            localStorage.getItem("jadwalKaryawan")
        ) || [];

    const data =
        jadwal.find(item => item.nama === nama);

    // Kalau belum punya jadwal
    // berarti dianggap masuk
    if(!data){

        return false;

    }


    const hari =
        tanggal.getDay();


    // =============================
    // LIBUR TETAP
    // =============================

    if(data.tipe === "tetap"){

        return hari === Number(data.hari);

    }


    // =============================
    // LIBUR ROTASI
    // =============================

    if(data.tipe === "rotasi"){

        const tanggalDalamBulan =
            tanggal.getDate();

        /*
            Minggu 1 = tanggal 1-7
            Minggu 2 = tanggal 8-14
            Minggu 3 = tanggal 15-21
            Minggu 4 = tanggal 22-akhir bulan
        */

        let minggu =
            Math.ceil(
                tanggalDalamBulan / 7
            );

        // Karena kita hanya punya
        // setting minggu 1-4
        if(minggu > 4){

            minggu = 4;

        }


        const index =
            minggu - 1;


        return (
            Number(data.rotasi[index]) === hari
        );

    }


    return false;

}


// =============================
// UPDATE CARD ADMIN
// =============================

function updateCardAdmin(){

    let karyawan =
        JSON.parse(
            localStorage.getItem("karyawan")
        ) || [];


    let riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];


    let cuti =
        JSON.parse(
            localStorage.getItem("cuti")
        ) || [];


    const sekarang =
        new Date();


    const hariIni =
        sekarang.toLocaleDateString("id-ID");


    // =============================
    // ABSENSI HARI INI
    // =============================

    const absensiHariIni =
        riwayat.filter(item =>
            item.tanggal === hariIni
        );


    // =============================
    // KARYAWAN YANG SEHARUSNYA MASUK
    // =============================

    const karyawanMasukHariIni =
        karyawan.filter(k => {

            return !karyawanSedangLibur(
                k.nama,
                sekarang
            );

        });


    // =============================
    // HADIR
    // =============================

    const hadir =
        absensiHariIni.length;


    // =============================
    // ALPHA
    // =============================

    const alpha =
        Math.max(
            karyawanMasukHariIni.length - hadir,
            0
        );


    // =============================
    // PERSENTASE
    // =============================

    let persen = 0;


    if(karyawanMasukHariIni.length > 0){

        persen =
            Math.round(
                hadir /
                karyawanMasukHariIni.length *
                100
            );

    }


    // =============================
    // UPDATE CARD
    // =============================

    document.getElementById(
        "totalKaryawan"
    ).innerHTML =
        karyawan.length;


    document.getElementById(
        "hadirHariIni"
    ).innerHTML =
        hadir;


    const pendingCuti =
    cuti.filter(item =>
        item.status === "Menunggu"
    ).length;

    document.getElementById(
    "izinHariIni"
     ).innerHTML =
     pendingCuti;

    document.getElementById(
    "infoIzin"
    ).innerHTML =
    pendingCuti + " Menunggu";


    document.getElementById(
        "alphaHariIni"
    ).innerHTML =
        alpha;


    // =============================
    // INFO CARD
    // =============================

    document.getElementById(
        "infoKaryawan"
    ).innerHTML =
        "+" + karyawan.length + " Karyawan";


     document.getElementById(
     "infoIzin"
     ).innerHTML =
     pendingCuti + " Menunggu";


    document.getElementById(
        "infoAlpha"
    ).innerHTML =
        alpha + " Hari Ini";


    // =============================
    // PROGRESS
    // =============================

    document.getElementById(
        "progressHadir"
    ).style.width =
        persen + "%";


    document.getElementById(
        "persenStatistik"
    ).innerHTML =
        persen + "% Kehadiran";


    // =============================
    // RINGKASAN
    // =============================

    document.getElementById(
        "sumKaryawan"
    ).innerHTML =
        karyawan.length;


    document.getElementById(
        "sumHadir"
    ).innerHTML =
        hadir;


    document.getElementById(
        "sumAlpha"
    ).innerHTML =
        alpha;

    document.getElementById(
    "sumIzin"
    ).innerHTML =
    pendingCuti;


    document.getElementById(
        "sumPersen"
    ).innerHTML =
        persen + "%";

}

function loadBelumAbsen(){

    let karyawan =
        JSON.parse(
            localStorage.getItem("karyawan")
        ) || [];


    let riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];


    let box =
        document.getElementById("belumAbsen");


    if(!box) return;


    box.innerHTML = "";


const sekarang = new Date();

const hariIni =
    sekarang.toLocaleDateString("id-ID");

const absensiHariIni =
    riwayat.filter(item =>
        item.tanggal === hariIni
    );

const karyawanMasukHariIni =
    karyawan.filter(k =>
        !karyawanSedangLibur(
            k.nama,
            sekarang
        )
    );

const alpha =
    Math.max(
        karyawanMasukHariIni.length -
        absensiHariIni.length,
        0
    );


    // =============================
    // KARYAWAN YANG SEHARUSNYA MASUK
    // =============================

    let karyawanMasuk =
        karyawan.filter(k => {

            return !karyawanSedangLibur(
                k.nama,
                sekarang
            );

        });


    // =============================
    // CEK SATU-SATU
    // =============================

    karyawanMasuk.forEach(k => {

        const sudahAbsen =
            riwayat.some(r =>

                r.nama === k.nama &&
                r.tanggal === hariIni

            );


        if(!sudahAbsen){

            box.innerHTML += `

                <div class="item-belum">

                    <b>👤 ${k.nama}</b>

                    <br>

                    ${k.jabatan || "Karyawan"}

                </div>

            `;

        }

    });


    // =============================
    // SEMUA SUDAH ABSEN
    // =============================

    if(box.innerHTML === ""){

        box.innerHTML = `

            <div class="item-belum">

                ✅ Semua karyawan yang
                jadwalnya masuk hari ini
                sudah absen.

            </div>

        `;

    }

}
loadBelumAbsen();


const btnAlpha =
document.getElementById("btnAlpha");

const modalAlpha =
document.getElementById("modalAlpha");

if(btnAlpha){

    btnAlpha.onclick=function(){

        modalAlpha.classList.add("show");

    }

}

function tutupModalAlpha(){

    modalAlpha.classList.remove("show");

}
function loadHadirHariIni(){

    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    let box =
    document.getElementById("listHadir");

    if(!box) return;

    box.innerHTML="";

    if(riwayat.length==0){

        box.innerHTML=`

        <div class="item-belum">

            Belum ada yang absen hari ini.

        </div>

        `;

        return;

    }

    riwayat.forEach(item=>{

        box.innerHTML+=`

        <div class="item-belum">

            <b>👤 ${item.nama}</b><br>

            🕘 ${item.masuk}<br>

            📍 ${item.kota}

        </div>

        `;

    });

}

const btnHadir =
document.getElementById("btnHadir");

const modalHadir =
document.getElementById("modalHadir");

if(btnHadir){

    btnHadir.onclick=function(){

        loadHadirHariIni();

        modalHadir.classList.add("show");

    }

}

function tutupModalHadir(){

    modalHadir.classList.remove("show");

}

// =============================
// EXPORT EXCEL
// =============================

const exportBtn =
document.getElementById("exportExcel");

if(exportBtn){

    exportBtn.onclick = function(){

        let riwayat =
        JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

        if(riwayat.length == 0){

            alert("Belum ada data absensi.");

            return;

        }

        const dataExcel = riwayat.map(item=>({

            Nama : item.nama,

            Tanggal : item.tanggal,

            JamMasuk : item.masuk,

            JamPulang : item.pulang,

            Status : item.status,

            Kota : item.kota

        }));

        const wb =
        XLSX.utils.book_new();

        const ws =
        XLSX.utils.json_to_sheet(dataExcel);

        XLSX.utils.book_append_sheet(

            wb,

            ws,

            "Absensi"

        );

        XLSX.writeFile(

            wb,

            "Absensi_AZNET.xlsx"

        );

    }

}

// =============================
// EXPORT IZIN & CUTI
// =============================

const exportCuti =
document.getElementById("exportCuti");

if(exportCuti){

    exportCuti.onclick = function(){

        let cuti =
        JSON.parse(localStorage.getItem("cuti")) || [];

        if(cuti.length === 0){

            alert("Belum ada data izin atau cuti.");

            return;

        }

        const dataExcel = cuti.map(item => ({

            Nama : item.nama || "-",

            Jenis : item.jenis || "-",

            Mulai : item.mulai || "-",

            Selesai : item.selesai || "-",

            Alasan : item.alasan || "-",

            Status : item.status || "-"

        }));

        const wb =
        XLSX.utils.book_new();

        const ws =
        XLSX.utils.json_to_sheet(dataExcel);

        XLSX.utils.book_append_sheet(

            wb,

            ws,

            "Izin & Cuti"

        );

        XLSX.writeFile(

            wb,

            "Rekap_Izin_Cuti_AZNET.xlsx"

        );

    };

}
// =============================
// AKTIVITAS TERBARU
// =============================

function loadAktivitas(){

    const box =
    document.getElementById("aktivitasTerbaru");

    if(!box) return;

    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    box.innerHTML = "";

    if(riwayat.length === 0){

        box.innerHTML = `
            <p>Belum ada aktivitas.</p>
        `;

        return;

    }

    riwayat.slice(0,5).forEach(item=>{

        box.innerHTML += `

        <div class="activity">

            <div class="activity-time">
                ${item.masuk}
            </div>

            <div class="activity-user">
                👤 ${item.nama}
            </div>

            <div class="activity-status">
                ${item.status}
            </div>

        </div>

        `;

    });

}

loadAktivitas();


// =============================
// NOTIFIKASI
// =============================

function loadNotifikasi(){

    let karyawan =
    JSON.parse(localStorage.getItem("karyawan")) || [];

    let riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    let cuti =
    JSON.parse(localStorage.getItem("cuti")) || [];


    // =============================
    // HITUNG BELUM ABSEN
    // =============================

    let alpha =
    Math.max(
        karyawan.length - riwayat.length,
        0
    );


    // =============================
    // PENGAJUAN MENUNGGU
    // =============================

    let pending =
    cuti.filter(item =>
        item.status === "Menunggu"
    ).length;


    let notif = [];


    // =============================
    // IZIN / CUTI
    // =============================

    if(pending > 0){

        notif.push({

            tipe: "cuti",

            icon: "🔴",

            teks:
            `Ada ${pending} pengajuan izin/cuti menunggu approval`

        });

    }


    // =============================
    // BELUM ABSEN
    // =============================

    if(alpha > 0){

        notif.push({

            tipe: "alpha",

            icon: "🟡",

            teks:
            `Ada ${alpha} karyawan belum absen hari ini`

        });

    }


    // =============================
    // SEMUA HADIR
    // =============================

    if(
        alpha === 0 &&
        karyawan.length > 0
    ){

        notif.push({

            tipe: "semua",

            icon: "🎉",

            teks:
            "Semua karyawan sudah hadir hari ini"

        });

    }


    // =============================
    // BADGE
    // =============================

    const badge =
    document.getElementById("notifBadge");

    if(badge){

        if(notif.length > 0){

            badge.innerHTML =
            notif.length;

            badge.style.display =
            "flex";

        }else{

            badge.style.display =
            "none";

        }

    }


    // =============================
    // TAMPILKAN NOTIFIKASI
    // =============================

    let html = "";


    notif.forEach(item=>{

        html += `

        <div
            class="notif-item notif-${item.tipe}"
            onclick="klikNotifikasi('${item.tipe}')">

            <span class="notif-icon">

                ${item.icon}

            </span>

            <span class="notif-text">

                ${item.teks}

            </span>

            ${
                item.tipe !== "semua"
                ?
                `<i class="fa-solid fa-chevron-right"></i>`
                :
                ""
            }

        </div>

        `;

    });


    // =============================
    // KALAU KOSONG
    // =============================

    if(html === ""){

        html = `

        <div class="notif-empty">

            🔔 Tidak ada notifikasi.

        </div>

        `;

    }


    const notifList =
    document.getElementById("notifList");

    if(notifList){

        notifList.innerHTML =
        html;

    }

}

loadNotifikasi();


// =============================
// KLIK NOTIFIKASI
// =============================

function klikNotifikasi(tipe){

    const dropdown =
    document.getElementById("notifDropdown");


    // Tutup dropdown

    if(dropdown){

        dropdown.classList.remove("show");

    }


    // =============================
    // BELUM ABSEN
    // =============================

    if(tipe === "alpha"){

        const modal =
        document.getElementById("modalAlpha");


        if(modal){

            // Refresh daftar
            loadBelumAbsen();

            // Buka modal
            modal.classList.add("show");

        }

        return;

    }


    // =============================
    // IZIN / CUTI
    // =============================

    if(tipe === "cuti"){

        const bagianCuti =
        document.getElementById("dataCuti");


        if(bagianCuti){

            bagianCuti.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }

        return;

    }

}


// =============================
// BUKA / TUTUP NOTIFIKASI
// =============================

const notifBtn =
document.getElementById("notifBtn");

const notifDropdown =
document.getElementById("notifDropdown");


if(notifBtn && notifDropdown){

    notifBtn.onclick = function(){

        notifDropdown.classList.toggle("show");

    };

}


// =============================
// LIHAT SURAT
// =============================

function lihatSurat(file){

    document
    .getElementById("modalSurat")
    .classList.add("show");


    document
    .getElementById("imgSurat")
    .src = file;

}


function tutupSurat(){

    document
    .getElementById("modalSurat")
    .classList.remove("show");

}
// =============================
// KALENDER KERJA
// =============================

const btnKalenderKerja =
    document.getElementById("btnKalenderKerja");

const modalKalender =
    document.getElementById("modalKalender");

const bulanKalender =
    document.getElementById("bulanKalender");

const calendarGrid =
    document.getElementById("calendarGrid");


// =============================
// DATA HARI LIBUR
// =============================

let hariLiburAZNET =
    JSON.parse(
        localStorage.getItem("hariLiburAZNET")
    ) || [];


// =============================
// BULAN SEKARANG
// =============================

if (bulanKalender) {

    const sekarang = new Date();

    bulanKalender.value =
        sekarang.getFullYear() +
        "-" +
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

}


// =============================
// KLIK KALENDER
// =============================

if (btnKalenderKerja) {

    btnKalenderKerja.addEventListener(
        "click",
        function () {

            console.log(
                "KALENDER DIKLIK"
            );

            if (modalKalender) {

                modalKalender.classList.add(
                    "show"
                );

            }

            tampilKalender();

        }
    );

}


// =============================
// TUTUP
// =============================

function tutupKalender() {

    if (modalKalender) {

        modalKalender.classList.remove(
            "show"
        );

    }

}


// =============================
// TAMPIL KALENDER
// =============================

function tampilKalender() {

    if (!bulanKalender ||
        !calendarGrid) {

        return;

    }

    const periode =
        bulanKalender.value;

    if (!periode) {

        return;

    }

    const bagian =
        periode.split("-");

    const tahun =
        Number(bagian[0]);

    const bulan =
        Number(bagian[1]);


    const jumlahHari =
        new Date(
            tahun,
            bulan,
            0
        ).getDate();


    const hariPertama =
        new Date(
            tahun,
            bulan - 1,
            1
        ).getDay();


    calendarGrid.innerHTML = "";


    // NAMA HARI

    const namaHari = [
        "Min",
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab"
    ];


    namaHari.forEach(
        function (hari) {

            const div =
                document.createElement("div");

            div.className =
                "calendar-day-name";

            div.textContent =
                hari;

            calendarGrid.appendChild(
                div
            );

        }
    );


    // KOTAK KOSONG

    for (
        let i = 0;
        i < hariPertama;
        i++
    ) {

        const kosong =
            document.createElement("div");

        calendarGrid.appendChild(
            kosong
        );

    }


    // TANGGAL

    for (
        let hari = 1;
        hari <= jumlahHari;
        hari++
    ) {

        const tanggal =
            tahun +
            "-" +
            String(bulan).padStart(2, "0") +
            "-" +
            String(hari).padStart(2, "0");


        const libur =
            hariLiburAZNET.includes(
                tanggal
            );


        const kotak =
            document.createElement("div");

        kotak.className =
            "calendar-date " +
            (
                libur
                ? "libur"
                : "kerja"
            );


        kotak.innerHTML = `
            <span class="nomor">
                ${hari}
            </span>

            <span class="status-hari">
                ${
                    libur
                    ? "🔴 LIBUR"
                    : "🟢 KERJA"
                }
            </span>
        `;


        kotak.addEventListener(
            "click",
            function () {

                ubahStatusHari(
                    tanggal
                );

            }
        );


        calendarGrid.appendChild(
            kotak
        );

    }

}


// =============================
// UBAH KERJA / LIBUR
// =============================

function ubahStatusHari(tanggal) {

    const index =
        hariLiburAZNET.indexOf(
            tanggal
        );


    if (index === -1) {

        hariLiburAZNET.push(
            tanggal
        );

    } else {

        hariLiburAZNET.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "hariLiburAZNET",
        JSON.stringify(
            hariLiburAZNET
        )
    );


    tampilKalender();

}


// =============================
// GANTI BULAN
// =============================

if (bulanKalender) {

    bulanKalender.addEventListener(
        "change",
        function () {

            tampilKalender();

        }
    );

}
// =============================
// JADWAL KARYAWAN
// =============================

const btnJadwalKaryawan =
    document.getElementById("btnJadwalKaryawan");

const modalJadwalKaryawan =
    document.getElementById("modalJadwalKaryawan");

const pilihKaryawan =
    document.getElementById("pilihKaryawan");

const tipeJadwal =
    document.getElementById("tipeJadwal");


// DATA JADWAL

let jadwalKaryawan =
    JSON.parse(
        localStorage.getItem("jadwalKaryawan")
    ) || [];


// =============================
// BUKA MODAL
// =============================

if(btnJadwalKaryawan){

    btnJadwalKaryawan.onclick = function(){

        isiPilihanKaryawan();

        tampilDaftarJadwal();

        modalJadwalKaryawan.classList.add("show");

    };

}


// =============================
// TUTUP MODAL
// =============================

function tutupJadwalKaryawan(){

    if(modalJadwalKaryawan){

        modalJadwalKaryawan.classList.remove("show");

    }

}


// =============================
// ISI DATA KARYAWAN
// =============================

function isiPilihanKaryawan(){

    if(!pilihKaryawan) return;

    let karyawan =
        JSON.parse(
            localStorage.getItem("karyawan")
        ) || [];

    pilihKaryawan.innerHTML = `
        <option value="">
            -- Pilih Karyawan --
        </option>
    `;

    karyawan.forEach(k => {

        pilihKaryawan.innerHTML += `

            <option value="${k.nama}">
                ${k.nama}
            </option>

        `;

    });

}


// =============================
// GANTI JENIS JADWAL
// =============================

if(tipeJadwal){

    tipeJadwal.onchange = function(){

        const formTetap =
            document.getElementById("formTetap");

        const formRotasi =
            document.getElementById("formRotasi");


        if(this.value === "rotasi"){

            formTetap.style.display = "none";

            formRotasi.style.display = "block";

        }else{

            formTetap.style.display = "flex";

            formRotasi.style.display = "none";

        }

    };

}


// =============================
// SIMPAN JADWAL
// =============================

function simpanJadwalKaryawan(){

    const nama =
        pilihKaryawan.value;


    if(!nama){

        alert("⚠️ Pilih karyawan terlebih dahulu.");

        return;

    }


    const tipe =
        tipeJadwal.value;


    // Hapus jadwal lama kalau karyawan
    // sudah pernah dibuat

    jadwalKaryawan =
        jadwalKaryawan.filter(
            item => item.nama !== nama
        );


    let data = {

        nama: nama,

        tipe: tipe

    };


    if(tipe === "tetap"){

        data.hari =
            Number(
                document.getElementById(
                    "hariTetap"
                ).value
            );

    }


    if(tipe === "rotasi"){

        data.rotasi = [

            Number(
                document.getElementById("rotasi1").value
            ),

            Number(
                document.getElementById("rotasi2").value
            ),

            Number(
                document.getElementById("rotasi3").value
            ),

            Number(
                document.getElementById("rotasi4").value
            )

        ];

    }


    jadwalKaryawan.push(data);


    localStorage.setItem(

        "jadwalKaryawan",

        JSON.stringify(
            jadwalKaryawan
        )

    );


    alert(
        "✅ Jadwal " + nama + " berhasil disimpan."
    );


    tampilDaftarJadwal();

}


// =============================
// TAMPILKAN JADWAL
// =============================

function tampilDaftarJadwal(){

    const box =
        document.getElementById(
            "daftarJadwalKaryawan"
        );


    if(!box) return;


    box.innerHTML = "";


    if(jadwalKaryawan.length === 0){

        box.innerHTML = `

            <div class="jadwal-item">

                📭 Belum ada jadwal karyawan.

            </div>

        `;

        return;

    }


    const namaHari = [

        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"

    ];


    jadwalKaryawan.forEach(
        (item,index) => {

        let detail = "";


        if(item.tipe === "tetap"){

            detail =
                `📌 Libur tetap setiap ${namaHari[item.hari]}`;

        }else{

            detail = `

                🔄 Libur rotasi:<br>

                Minggu 1: ${namaHari[item.rotasi[0]]}<br>

                Minggu 2: ${namaHari[item.rotasi[1]]}<br>

                Minggu 3: ${namaHari[item.rotasi[2]]}<br>

                Minggu 4: ${namaHari[item.rotasi[3]]}

            `;

        }


        box.innerHTML += `

            <div class="jadwal-item">

                <strong>
                    👤 ${item.nama}
                </strong>

                <small>
                    ${detail}
                </small>

                <br>

                <button
                    class="btn-hapus-jadwal"
                    onclick="hapusJadwalKaryawan(${index})">

                    🗑 Hapus Jadwal

                </button>

            </div>

        `;

    });

}


// =============================
// HAPUS JADWAL
// =============================

function hapusJadwalKaryawan(index){

    if(
        !confirm(
            "Hapus jadwal karyawan ini?"
        )
    ){

        return;

    }


    jadwalKaryawan.splice(index,1);


    localStorage.setItem(

        "jadwalKaryawan",

        JSON.stringify(
            jadwalKaryawan
        )

    );


    tampilDaftarJadwal();

}

/* =========================
   MENU LEMBUR
========================= */

const btnLembur = document.getElementById("btnLembur");
const modalLembur = document.getElementById("modalLembur");

if (btnLembur) {

    btnLembur.addEventListener("click", function () {

        modalLembur.style.display = "flex";

        isiKaryawanLembur();

        tampilkanRiwayatLembur();

    });

}


/* TUTUP */

function tutupLembur() {

    modalLembur.style.display = "none";

}


/* =========================
   DATA KARYAWAN
========================= */

function isiKaryawanLembur() {

    const select =
        document.getElementById("lemburKaryawan");

    if (!select) return;

    const karyawan =
        JSON.parse(
            localStorage.getItem("karyawan")
        ) || [];

    select.innerHTML = `
        <option value="">
            -- Pilih Karyawan --
        </option>
    `;

    karyawan.forEach(function(item) {

        const nama =
            item.nama ||
            item.name ||
            item.namaKaryawan;

        if (!nama) return;

        select.innerHTML += `
            <option value="${nama}">
                ${nama}
            </option>
        `;
    });
}

/* =========================
   HITUNG LEMBUR
========================= */

function hitungLembur() {

    const mulai =
        document.getElementById(
            "jamMulaiLembur"
        ).value;

    const selesai =
        document.getElementById(
            "jamSelesaiLembur"
        ).value;

    const nominal =
        Number(
            document.getElementById(
                "nominalLembur"
            ).value
        ) || 0;


    if (!mulai || !selesai) {

        document.getElementById(
            "totalJamLembur"
        ).value = "0 jam";

        document.getElementById(
            "totalUangLembur"
        ).textContent = "Rp0";

        return;

    }


    let [jamMulai, menitMulai] =
        mulai.split(":").map(Number);

    let [jamSelesai, menitSelesai] =
        selesai.split(":").map(Number);


    let totalMenitMulai =
        jamMulai * 60 + menitMulai;

    let totalMenitSelesai =
        jamSelesai * 60 + menitSelesai;


    /*
       Kalau melewati tengah malam
    */

    if (
        totalMenitSelesai <
        totalMenitMulai
    ) {

        totalMenitSelesai += 24 * 60;

    }


    const totalMenit =
        totalMenitSelesai -
        totalMenitMulai;


    const totalJam =
        totalMenit / 60;


    document.getElementById(
        "totalJamLembur"
    ).value =
        `${totalJam} jam`;


    const totalUang =
        totalJam * nominal;


    document.getElementById(
        "totalUangLembur"
    ).textContent =
        formatRupiah(totalUang);

}


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(angka) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(angka);

}

/* =========================
   SIMPAN LEMBUR
========================= */

function simpanLembur() {

    const karyawan =
        document.getElementById("lemburKaryawan")?.value;

    const tanggal =
        document.getElementById("tanggalLembur")?.value;

    const jenis =
        document.getElementById("jenisLembur")?.value;

    const nominal =
        Number(
            document.getElementById("nominalLembur")?.value || 0
        );

    const keterangan =
        document.getElementById("keteranganLembur")?.value.trim();

    // =========================
    // VALIDASI
    // =========================

    if (!karyawan) {
        alert("Silakan pilih karyawan.");
        return;
    }

    if (!tanggal) {
        alert("Silakan pilih tanggal lembur.");
        return;
    }

    if (!jenis) {
        alert("Silakan pilih jenis pekerjaan.");
        return;
    }

    if (!nominal || nominal <= 0) {
        alert("Silakan masukkan nominal lembur.");
        return;
    }

    if (!keterangan) {
        alert("Silakan isi keterangan pekerjaan.");
        return;
    }

    // =========================
    // AMBIL DATA LAMA
    // =========================

    let dataLembur =
        JSON.parse(
            localStorage.getItem("dataLembur") || "[]"
        );

    // =========================
    // DATA LEMBUR BARU
    // =========================

    const lemburBaru = {

        id: Date.now(),

        nama: karyawan,

        tanggal: tanggal,

        jenisPekerjaan: jenis,

        keterangan: keterangan,

        nominal: nominal,

        totalUang: nominal,

        dicatatOleh:
            localStorage.getItem("nama") || "Admin",

        dibuatPada:
            new Date().toISOString()

    };

    dataLembur.push(lemburBaru);

    localStorage.setItem(
        "dataLembur",
        JSON.stringify(dataLembur)
    );

    // =========================
    // RESET FORM
    // =========================

    document.getElementById("lemburKaryawan").value = "";
    document.getElementById("tanggalLembur").value = "";
    document.getElementById("jenisLembur").value = "";
    document.getElementById("nominalLembur").value = "";
    document.getElementById("keteranganLembur").value = "";

    document.getElementById("totalUangLembur").textContent =
        "Rp0";

    // =========================
    // UPDATE RIWAYAT
    // =========================

    tampilkanRiwayatLembur();

    alert("Data lembur berhasil disimpan.");

}

/* =========================
   RIWAYAT LEMBUR
========================= */

function tampilkanRiwayatLembur() {

    const container = document.getElementById("riwayatLembur");

    if (!container) {
        console.error("❌ Element #riwayatLembur tidak ditemukan");
        return;
    }

    const dataLembur = JSON.parse(
        localStorage.getItem("dataLembur") || "[]"
    );

    console.log("📋 Data lembur:", dataLembur);

    if (dataLembur.length === 0) {

        container.innerHTML = `
            <div class="empty-lembur">
                🕐 Belum ada data lembur.
            </div>
        `;

        return;
    }

    container.innerHTML = dataLembur
        .slice()
        .reverse()
        .map((item, index) => {

            const nominal = Number(
                item.nominal || item.totalUang || 0
            );

            const tanggal = item.tanggal
                ? new Date(item.tanggal + "T00:00:00")
                    .toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    })
                : "-";

            return `
                <div class="lembur-history-item">

                    <div class="lembur-history-main">

                        <div class="lembur-history-icon">
                            <i class="fa-solid fa-business-time"></i>
                        </div>

                        <div>

                            <strong>
                                ${item.nama || "-"}
                            </strong>

                            <div class="lembur-history-info">
                                📅 ${tanggal}
                            </div>

                            <div class="lembur-history-job">
                                ${item.jenisPekerjaan || "-"}
                            </div>

                            <div class="lembur-history-desc">
                                ${item.keterangan || "-"}
                            </div>

                        </div>

                    </div>

                    <div class="lembur-history-money">
                        Rp${nominal.toLocaleString("id-ID")}
                    </div>

                </div>
            `;

        })
        .join("");
}


/* FORMAT TANGGAL */

function formatTanggal(tanggal) {

    if (!tanggal) return "-";

    const date =
        new Date(
            tanggal + "T00:00:00"
        );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}

function resetFormLembur() {

    document.getElementById(
        "pilihKaryawanLembur"
    ).value = "";

    document.getElementById(
        "tanggalLembur"
    ).value = "";

    document.getElementById(
        "jamMulaiLembur"
    ).value = "";

    document.getElementById(
        "jamSelesaiLembur"
    ).value = "";

    document.getElementById(
        "nominalLembur"
    ).value = "";

    document.getElementById(
        "totalJamLembur"
    ).value = "0 jam";

    document.getElementById(
        "totalUangLembur"
    ).textContent = "Rp0";

    document.getElementById(
        "keteranganLembur"
    ).value = "";

}
// =============================
// FILTER PENGAJUAN
// =============================

const filterPengajuan =
    document.querySelectorAll(".filter-pengajuan-btn");


filterPengajuan.forEach(button => {

    button.addEventListener("click", function(){

        // =============================
        // AKTIFKAN TOMBOL
        // =============================

        filterPengajuan.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");


        // =============================
        // FILTER
        // =============================

        const filter =
            this.dataset.filter;


        const items =
            document.querySelectorAll(
                ".data-pengajuan .item"
            );


        items.forEach(item => {

            const jenis =
                item.dataset.jenis;


            if(
                filter === "semua" ||
                jenis === filter
            ){

                item.style.display = "";

            }else{

                item.style.display = "none";

            }

        });

    });

});

// =============================
// REFRESH DATA DASHBOARD
// =============================

updateCardAdmin();
loadBelumAbsen();
loadNotifikasi();