// =========================
// AMBIL NAMA USER
// =========================

document.getElementById("nama").value =
localStorage.getItem("username") || "Karyawan";


// =========================
// DATA
// =========================

let riwayat =
JSON.parse(localStorage.getItem("cuti")) || [];

const username =
localStorage.getItem("username");

const role =
localStorage.getItem("role");

const uploadSurat =
document.getElementById("surat");

const previewSurat =
document.getElementById("previewSurat");

// =========================
// TAMPILKAN RIWAYAT
// =========================

function tampilRiwayat(){

    let html = "";

    let dataTampil = riwayat;

    if(role !== "admin"){

        dataTampil = riwayat.filter(item =>

            item.username === username

        );

    }

    dataTampil.forEach((item,index)=>{

        html += `

        <div class="card-riwayat">

            <h3>${item.nama}</h3>

            <p><b>${item.jenis}</b></p>

            <p>${item.mulai} s/d ${item.selesai}</p>

            <p>${item.alasan}</p>

<span class="status ${item.status}">
    ${item.status}
</span>

${
item.status === "Disetujui" && item.approvedBy
?
`
<div class="approval-info">

    <small>✅ Disetujui oleh</small>

    <strong>${item.approvedBy}</strong>

    <span>
        ${item.approvedAt || "-"}
    </span>

</div>
`
:
""
}

${
item.status === "Ditolak" && item.rejectedBy
?
`
<div class="approval-info rejected-info">

    <small>❌ Ditolak oleh</small>

    <strong>${item.rejectedBy}</strong>

    <span>
        ${item.rejectedAt || "-"}
    </span>

</div>
`
:
""
}

        </div>

        `;

    });

    document.getElementById("listRiwayat").innerHTML = html;

}

tampilRiwayat();


// =========================
// KIRIM PENGAJUAN
// =========================

document.getElementById("kirim").onclick=function(){

let data={

    username:
    localStorage.getItem("username"),

    nama:
    document.getElementById("nama").value,

    jenis:
    document.getElementById("jenis").value,

    mulai:
    document.getElementById("mulai").value,

    selesai:
    document.getElementById("selesai").value,

    alasan:
    document.getElementById("alasan").value,

    surat:
    window.previewFile || "",

    status:"Menunggu"

};

    riwayat.push(data);

localStorage.setItem(
    "cuti",
    JSON.stringify(riwayat)
);

    alert("Pengajuan berhasil dikirim.");

    document.getElementById("jenis").value = "Izin";
    document.getElementById("mulai").value = "";
    document.getElementById("selesai").value = "";
    document.getElementById("alasan").value = "";

    tampilRiwayat();

}

function tarikPengajuan(index){

    if(
        confirm(
            "Yakin ingin menarik pengajuan ini?"
        )
    ){

        riwayat.splice(index,1);

        localStorage.setItem(

            "cuti",

            JSON.stringify(riwayat)

        );

        tampilRiwayat();

    }

}
function tarikPengajuan(index){

}
// =========================
// PREVIEW SURAT
// =========================

uploadSurat.onchange=function(){

    const file=this.files[0];

    if(!file)return;

    const ukuran=(file.size/1024/1024).toFixed(2);

    const reader=new FileReader();

    reader.onload=function(e){

        previewSurat.innerHTML=`

        <div class="file-card">

            <div class="file-info">

                <div class="file-name">

                    📄 ${file.name}

                </div>

                <small>

                    📦 ${ukuran} MB

                </small>

            </div>

            <div class="file-action">

                <button
                class="btnView"
                onclick="lihatSurat()">

                    <i class="fa fa-eye"></i>

                </button>

                <button
                class="btnDelete"
                onclick="hapusSurat()">

                    <i class="fa fa-trash"></i>

                </button>

            </div>

        </div>

        `;

        window.previewFile=e.target.result;

    }

    reader.readAsDataURL(file);

}

// =========================
// HAPUS FILE
// =========================

function hapusSurat(){

    uploadSurat.value = "";

    previewSurat.innerHTML = "";

}

function lihatSurat(){

    document.getElementById("modalPreview")
    .classList.add("show");

    document.getElementById("imgPreview")
    .src=window.previewFile;

}

function tutupPreview(){

    document.getElementById("modalPreview")
    .classList.remove("show");

}