let list = JSON.parse(localStorage.getItem("karyawan")) || [];
let editIndex = -1;

tampil();

// ===================
// TAMPIL DATA
// ===================

function tampil(){

    let html = "";

    list.forEach((item,index)=>{

        let inisial = item.nama
        .split(" ")
        .map(n=>n[0])
        .join("")
        .toUpperCase();

        html += `
        <div class="card">

            <div class="card-left">

                <div class="avatar">
                    ${inisial}
                </div>

                <div class="info">

                    <h2>${item.nama}</h2>

                    <span class="jabatan">
                        ${item.jabatan}
                    </span>

                    <span class="status">
                        🟢 Aktif
                    </span>

                </div>

            </div>

            <div class="card-right">

                <div class="detail">
                    <small>Username</small>
                    <h3>${item.username}</h3>
                </div>

                <div class="detail">
                    <small>Password</small>
                    <h3>${item.password}</h3>
                </div>

                <div class="detail">
                    <small>Role</small>
                    <h3>${item.role}</h3>
                </div>

                <div class="detail">
                    <small>Divisi</small>
                    <h3>${item.divisi}</h3>
                </div>

<div class="aksi">

    <button class="detailBtn"
    onclick="detailKaryawan(${index})">

        <i class="fa-solid fa-eye"></i>

        Detail

    </button>

    <button class="edit"
    onclick="editKaryawan(${index})">

        <i class="fa-solid fa-pen"></i>

        Edit

    </button>

    <button class="hapus"
    onclick="hapus(${index})">

        <i class="fa-solid fa-trash"></i>

        Hapus

    </button>

</div>

            </div>

        </div>
        `;

    });

    document.getElementById("listKaryawan").innerHTML = html;

    document.getElementById("totalKaryawan").innerHTML = list.length;
    document.getElementById("totalAktif").innerHTML = list.length;

}

// ===================
// BUKA MODAL
// ===================

document.getElementById("tambah").onclick = function(){

    editIndex = -1;

    document.getElementById("nama").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("jabatan").value = "";
    document.getElementById("divisi").value = "";
    document.getElementById("role").value = "staff";

    document.getElementById("modal").style.display = "flex";

};

// ===================
// TUTUP
// ===================

function tutupModal(){

    document.getElementById("modal").style.display = "none";

}

// ===================
// SIMPAN
// ===================

function simpanKaryawan(){

    let data = {

        nama: document.getElementById("nama").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim(),
        jabatan: document.getElementById("jabatan").value.trim(),
        divisi: document.getElementById("divisi").value.trim(),
        role: document.getElementById("role").value

    };

    if(
        data.nama==""||
        data.username==""||
        data.password==""
    ){
        alert("Lengkapi data terlebih dahulu!");
        return;
    }

    if(editIndex==-1){

        list.push(data);

    }else{

        list[editIndex]=data;

    }

    localStorage.setItem(
        "karyawan",
        JSON.stringify(list)
    );

    editIndex=-1;

    tutupModal();

    tampil();

}

// ===================
// EDIT
// ===================

function editKaryawan(index){

    editIndex=index;

    let data=list[index];

    document.getElementById("nama").value=data.nama;
    document.getElementById("username").value=data.username;
    document.getElementById("password").value=data.password;
    document.getElementById("jabatan").value=data.jabatan;
    document.getElementById("divisi").value=data.divisi;
    document.getElementById("role").value=data.role;

    document.getElementById("modal").style.display="flex";

}

// ===================
// HAPUS
// ===================

function hapus(index){

    if(confirm("Hapus karyawan?")){

        list.splice(index,1);

        localStorage.setItem(
            "karyawan",
            JSON.stringify(list)
        );

        tampil();

    }

}

// ===================
// SEARCH
// ===================

const search=document.getElementById("search");

if(search){

search.addEventListener("keyup",function(){

    let keyword=this.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card=>{

        card.style.display=
        card.innerText.toLowerCase().includes(keyword)
        ?"flex":"none";

    });

});

}

// ===================
// PASSWORD
// ===================

const password=document.getElementById("password");
const togglePassword=document.getElementById("togglePassword");

if(togglePassword){

togglePassword.onclick=function(){

    const icon=this.querySelector("i");

    if(password.type==="password"){

        password.type="text";

        icon.classList.replace("fa-eye","fa-eye-slash");

    }else{

        password.type="password";

        icon.classList.replace("fa-eye-slash","fa-eye");

    }

};

}
// ===================
// DETAIL KARYAWAN
// ===================

function detailKaryawan(index){

    let data = list[index];

    document.getElementById("detailNama").innerHTML =
    data.nama;

    document.getElementById("detailJabatan").innerHTML =
    data.jabatan;

    document.getElementById("detailUsername").innerHTML =
    data.username;

    document.getElementById("detailDivisi").innerHTML =
    data.divisi;

    document.getElementById("detailRole").innerHTML =
    data.role;

    // Foto Profil
    let semuaProfil =
    JSON.parse(localStorage.getItem("profil")) || {};

    if(
        semuaProfil[data.username] &&
        semuaProfil[data.username].foto
    ){

        document.getElementById("detailFoto").src =
        semuaProfil[data.username].foto;

    }else{

        document.getElementById("detailFoto").src =
        "img/user.png";

    }

    // Statistik
    let absensi =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    let cuti =
    JSON.parse(localStorage.getItem("cuti")) || [];

let hadir =
absensi.filter(item =>

    item.nama &&
    item.nama.toLowerCase() ===
    data.nama.toLowerCase()

).length;


let izin =
cuti.filter(item =>

    item.nama &&
    item.nama.toLowerCase() ===
    data.nama.toLowerCase() &&

    item.status === "Disetujui"

).length;

let alpha = 0;

// Kalau belum absen dan belum izin disetujui
if(hadir === 0 && izin === 0){
    alpha = 1;
}

document.getElementById("detailHadir").innerHTML =
hadir;

document.getElementById("detailIzin").innerHTML =
izin;

document.getElementById("detailAlpha").innerHTML =
alpha;

    document.getElementById("modalDetail").style.display =
    "flex";

}

// ==========================
// RIWAYAT ABSENSI KARYAWAN
// ==========================

let riwayatKaryawan = absensi.filter(item =>

    item.nama === data.nama

);

let boxRiwayat =
document.getElementById("detailRiwayatAbsensi");

let htmlRiwayat = "";

if(riwayatKaryawan.length === 0){

    htmlRiwayat = `

        <div class="empty-history">

            🕘 Belum ada riwayat absensi.

        </div>

    `;

}else{

    riwayatKaryawan.forEach(item => {

        htmlRiwayat += `

            <div class="history-item">

                <div class="history-main">

                    <strong>
                        ${item.tanggal || "-"}
                    </strong>

                    <span>
                        📍 ${item.kota || "-"}
                    </span>

                </div>

                <div class="history-detail">

                    <span>
                        🟢 Masuk:
                        ${item.masuk || "-"}
                    </span>

                    <span>
                        🔴 Pulang:
                        ${item.pulang || "-"}
                    </span>

                    <span class="history-status">
                        ${item.status || "-"}
                    </span>

                </div>

            </div>

        `;

    });

}

boxRiwayat.innerHTML = htmlRiwayat;

function tutupDetail(){

    document.getElementById("modalDetail").style.display =
    "none";

}

