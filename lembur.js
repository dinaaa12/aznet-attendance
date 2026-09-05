// =========================
// AZNET - LEMBUR
// =========================


// =========================
// AMBIL DATA USER
// =========================

const username =
    localStorage.getItem("username");

const role =
    localStorage.getItem("role");


// =========================
// ELEMENT
// =========================

const namaInput =
    document.getElementById("nama");

const tanggalInput =
    document.getElementById("tanggal");

const jamMulaiInput =
    document.getElementById("jamMulai");

const jamSelesaiInput =
    document.getElementById("jamSelesai");

const alasanInput =
    document.getElementById("alasan");

const kirimButton =
    document.getElementById("kirim");

const listRiwayat =
    document.getElementById("listRiwayat");


// =========================
// DATA LEMBUR
// =========================

let dataLembur =
    JSON.parse(
        localStorage.getItem("lembur")
    ) || [];


// =========================
// NAMA USER
// =========================

namaInput.value =
    username || "Karyawan";


// =========================
// TAMPILKAN RIWAYAT
// =========================

function tampilRiwayat(){

    let dataTampil = dataLembur;

    // Kalau bukan admin,
    // hanya tampilkan lembur miliknya
    if(role !== "admin"){

        dataTampil =
            dataLembur.filter(item => {

                return (
                    item.username === username
                );

            });

    }


    // Kalau belum ada data

    if(dataTampil.length === 0){

        listRiwayat.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clock"></i>

                <p>
                    Belum ada pengajuan lembur.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    // Tampilkan dari yang terbaru

    dataTampil
        .slice()
        .reverse()
        .forEach((item, index) => {


            // =========================
            // STATUS CLASS
            // =========================

            let statusClass = "";

            if(item.status === "Disetujui"){

                statusClass =
                    "status-disetujui";

            }
            else if(item.status === "Ditolak"){

                statusClass =
                    "status-ditolak";

            }
            else{

                statusClass =
                    "status-menunggu";

            }


            // =========================
            // NOMINAL
            // =========================

            let nominal = "-";

            if(
                item.status === "Disetujui" &&
                item.nominal
            ){

                nominal =
                    formatRupiah(
                        item.nominal
                    );

            }


            html += `

                <div class="card-riwayat">

                    <div class="riwayat-header">

                        <div>

                            <h3>
                                🕐 Lembur
                            </h3>

                            <small>
                                ${formatTanggal(item.tanggal)}
                            </small>

                        </div>


                        <span
                            class="status ${statusClass}">

                            ${item.status}

                        </span>

                    </div>


                    <div class="riwayat-info">

                        <p>

                            <i class="fa-regular fa-clock"></i>

                            ${item.jamMulai}
                            -
                            ${item.jamSelesai}

                        </p>


                        <p>

                            <i class="fa-solid fa-briefcase"></i>

                            ${item.alasan || "-"}

                        </p>


                        <p>

                            <i class="fa-solid fa-money-bill-wave"></i>

                            <strong>
                                ${nominal}
                            </strong>

                        </p>

                    </div>


                    ${
                        item.status === "Disetujui"
                        &&
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
                        item.status === "Ditolak"
                        &&
                        item.rejectedBy
                        ?
                        `
                        <div class="approval-info rejected-info">

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

                </div>

            `;

        });


    listRiwayat.innerHTML =
        html;

}


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(angka){

    if(
        angka === null ||
        angka === undefined ||
        angka === ""
    ){

        return "-";

    }


    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(Number(angka));

}


// =========================
// FORMAT TANGGAL
// =========================

function formatTanggal(tanggal){

    if(!tanggal){

        return "-";

    }


    const bagian =
        tanggal.split("-");


    if(bagian.length !== 3){

        return tanggal;

    }


    const tahun =
        bagian[0];

    const bulan =
        Number(bagian[1]);

    const hari =
        Number(bagian[2]);


    const namaBulan = [

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


    return `${hari} ${namaBulan[bulan - 1]} ${tahun}`;

}


// =========================
// KIRIM PENGAJUAN
// =========================

kirimButton.onclick =
function(){

    const tanggal =
        tanggalInput.value;

    const jamMulai =
        jamMulaiInput.value;

    const jamSelesai =
        jamSelesaiInput.value;

    const alasan =
        alasanInput.value.trim();


    // =========================
    // VALIDASI
    // =========================

    if(!tanggal){

        alert(
            "Silakan pilih tanggal lembur."
        );

        return;

    }


    if(!jamMulai){

        alert(
            "Silakan isi jam mulai."
        );

        return;

    }


    if(!jamSelesai){

        alert(
            "Silakan isi jam selesai."
        );

        return;

    }


    if(!alasan){

        alert(
            "Silakan isi pekerjaan/alasan lembur."
        );

        return;

    }


    // =========================
    // CEK JAM
    // =========================

    if(jamSelesai <= jamMulai){

        alert(
            "Jam selesai harus lebih dari jam mulai."
        );

        return;

    }


    // =========================
    // DATA BARU
    // =========================

    const dataBaru = {

        id:
            Date.now(),

        username:
            username,

        nama:
            namaInput.value,

        tanggal:
            tanggal,

        jamMulai:
            jamMulai,

        jamSelesai:
            jamSelesai,

        alasan:
            alasan,

        // =========================
        // NOMINAL
        // =========================

        // Kosong terlebih dahulu.
        // Owner/Admin yang menentukan.

        nominal:
            0,

        // =========================
        // STATUS
        // =========================

        status:
            "Menunggu",

        approvedBy:
            "",

        approvedAt:
            "",

        rejectedBy:
            "",

        rejectedAt:
            "",

        createdAt:
            new Date().toLocaleString(
                "id-ID"
            )

    };


    // =========================
    // SIMPAN
    // =========================

    dataLembur.push(
        dataBaru
    );


    localStorage.setItem(

        "lembur",

        JSON.stringify(
            dataLembur
        )

    );


    // =========================
    // RESET FORM
    // =========================

    tanggalInput.value = "";

    jamMulaiInput.value = "";

    jamSelesaiInput.value = "";

    alasanInput.value = "";


    // =========================
    // REFRESH
    // =========================

    tampilRiwayat();


    alert(
        "Pengajuan lembur berhasil dikirim."
    );

};


// =========================
// DETAIL
// =========================

function bukaDetail(id){

    const data =
        dataLembur.find(
            item => item.id === id
        );


    if(!data){

        alert(
            "Data lembur tidak ditemukan."
        );

        return;

    }


    const detail =
        document.getElementById(
            "detailLembur"
        );


    detail.innerHTML = `

        <div class="detail-row">

            <strong>Nama</strong>

            <span>
                ${data.nama}
            </span>

        </div>


        <div class="detail-row">

            <strong>Tanggal</strong>

            <span>
                ${formatTanggal(data.tanggal)}
            </span>

        </div>


        <div class="detail-row">

            <strong>Jam</strong>

            <span>
                ${data.jamMulai}
                -
                ${data.jamSelesai}
            </span>

        </div>


        <div class="detail-row">

            <strong>Pekerjaan</strong>

            <span>
                ${data.alasan}
            </span>

        </div>


        <div class="detail-row">

            <strong>Status</strong>

            <span>
                ${data.status}
            </span>

        </div>


        <div class="detail-row">

            <strong>Uang Lembur</strong>

            <span>

                ${
                    data.status === "Disetujui"
                    ?
                    formatRupiah(data.nominal)
                    :
                    "Belum ditentukan"
                }

            </span>

        </div>

    `;


    document
        .getElementById("modalDetail")
        .classList.add("show");

}


// =========================
// TUTUP DETAIL
// =========================

function tutupDetail(){

    document
        .getElementById("modalDetail")
        .classList.remove("show");

}


// =========================
// GLOBAL
// =========================

window.bukaDetail =
    bukaDetail;

window.tutupDetail =
    tutupDetail;


// =========================
// JALANKAN
// =========================

tampilRiwayat();


// =============================
// KEMBALI SESUAI ROLE
// =============================

const btnKembali =
    document.getElementById("btnKembali");

if(btnKembali){

    btnKembali.onclick = function(){

        if(role === "admin"){

            window.location.href = "admin.html";

        }else{

            window.location.href = "dashboard.html";

        }

    };

}


// =============================
// TEKS TOMBOL KEMBALI
// =============================

const textKembali =
    document.getElementById("textKembali");

if(textKembali){

    if(role === "admin"){

        textKembali.textContent =
            "Kembali ke Admin Panel";

    }else{

        textKembali.textContent =
            "Kembali ke Dashboard";

    }

}