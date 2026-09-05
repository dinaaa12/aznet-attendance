let role =
localStorage.getItem("role");

let username =
localStorage.getItem("username");

let riwayat =
JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

if(role !== "admin"){

    riwayat = riwayat.filter(item=>

        item.username === username

    );

}

let karyawan =
JSON.parse(localStorage.getItem("karyawan")) || [];

if(role !== "admin"){

    karyawan = karyawan.filter(item=>

        item.username === username

    );

}

let hadir = riwayat.filter(
item => item.status === "Hadir"
).length;

let telat = riwayat.filter(
item => item.status === "Terlambat"
).length;

let alpha =
Math.max(
karyawan.length - hadir - telat,
0
);

document.getElementById("hadir").innerHTML = hadir;
document.getElementById("terlambat").innerHTML = telat;
document.getElementById("alpha").innerHTML = alpha;

let persen = 0;

if (karyawan.length > 0) {

    persen = Math.round(
        ((hadir + telat) / karyawan.length) * 100
    );

}

document.getElementById("persen").innerHTML =
persen + "% Kehadiran";

document.getElementById("progressBar").style.width =
persen + "%";

// ==========================
// RINGKASAN KEHADIRAN
// ==========================

let cuti =
JSON.parse(localStorage.getItem("cuti")) || [];

if(role !== "admin"){

    cuti = cuti.filter(item=>
        item.username === username
    );

}

document.getElementById("totalKaryawan").innerHTML =
karyawan.length;

document.getElementById("hadirHariIni").innerHTML =
hadir;

document.getElementById("belumAbsen").innerHTML =
alpha;

document.getElementById("izinCuti").innerHTML =
cuti.length;

document.getElementById("persentase").innerHTML =
persen + "%";