// =============================
// AZNET - REKAP BULANAN
// =============================


// =============================
// ELEMENT
// =============================

const bulanInput =
document.getElementById("bulan");

const btnTampilkan =
document.getElementById("btnTampilkan");

const dataRekap =
document.getElementById("dataRekap");


// =============================
// DATA LOCAL STORAGE
// =============================

let karyawan =
JSON.parse(localStorage.getItem("karyawan")) || [];

let absensi =
JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

let cuti =
JSON.parse(localStorage.getItem("cuti")) || [];
console.log("DATA CUTI AZNET:", cuti);

let jadwalKaryawan =
JSON.parse(
    localStorage.getItem("jadwalKaryawan")
) || [];

let hariLiburAZNET =
JSON.parse(
    localStorage.getItem("hariLiburAZNET")
) || [];


// =============================
// BULAN SEKARANG
// =============================

const sekarang =
new Date();

const tahunSekarang =
sekarang.getFullYear();

const bulanSekarang =
String(sekarang.getMonth() + 1)
.padStart(2, "0");


// Set default bulan
bulanInput.value =
`${tahunSekarang}-${bulanSekarang}`;


// =============================
// FORMAT BULAN
// =============================

function formatBulan(value){

    if(!value) return "-";

    const bagian =
    value.split("-");

    const tahun =
    bagian[0];

    const bulan =
    parseInt(bagian[1]);

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

    return `${namaBulan[bulan - 1]} ${tahun}`;

}


// =============================
// HITUNG PERIODE AKTIF
// =============================

function getTanggalTerakhir(tahun, bulan){

    const sekarang = new Date();

    const tahunSekarang =
        sekarang.getFullYear();

    const bulanSekarang =
        sekarang.getMonth() + 1;

    const hariSekarang =
        sekarang.getDate();


    // Bulan masa depan
    if(
        tahun > tahunSekarang ||
        (
            tahun === tahunSekarang &&
            bulan > bulanSekarang
        )
    ){

        return 0;

    }


    let hariTerakhir =
        new Date(
            tahun,
            bulan,
            0
        ).getDate();


    // Kalau bulan sekarang,
    // hanya sampai hari ini
    if(
        tahun === tahunSekarang &&
        bulan === bulanSekarang
    ){

        hariTerakhir =
            hariSekarang;

    }


    return hariTerakhir;

}


// =============================
// CEK LIBUR KARYAWAN
// =============================

function karyawanLiburPadaTanggal(
    nama,
    tanggal
){

    const jadwal =
        jadwalKaryawan.find(
            item => item.nama === nama
        );


    // Kalau belum punya jadwal
    // default tidak libur
    if(!jadwal){

        return false;

    }


    const hari =
        tanggal.getDay();


    // =============================
    // LIBUR TETAP
    // =============================

    if(jadwal.tipe === "tetap"){

        return (
            hari === Number(jadwal.hari)
        );

    }


    // =============================
    // LIBUR ROTASI
    // =============================

    if(jadwal.tipe === "rotasi"){

        const tanggalDalamBulan =
            tanggal.getDate();


        let minggu =
            Math.ceil(
                tanggalDalamBulan / 7
            );


        // Sistem kita punya 4 rotasi
        if(minggu > 4){

            minggu = 4;

        }


        const index =
            minggu - 1;


        return (
            Number(
                jadwal.rotasi[index]
            ) === hari
        );

    }


    return false;

}


// =============================
// HITUNG HARI KERJA KARYAWAN
// =============================

function hitungHariKerjaKaryawan(
    nama,
    tahun,
    bulan
){

    const hariTerakhir =
        getTanggalTerakhir(
            tahun,
            bulan
        );


    if(hariTerakhir === 0){

        return 0;

    }


    let total = 0;


    for(
        let hari = 1;
        hari <= hariTerakhir;
        hari++
    ){

        const tanggal =
            new Date(
                tahun,
                bulan - 1,
                hari
            );


        const tanggalString =
            tahun +
            "-" +
            String(bulan).padStart(2,"0") +
            "-" +
            String(hari).padStart(2,"0");


        // =============================
        // LIBUR UMUM AZNET
        // =============================

        if(
            hariLiburAZNET.includes(
                tanggalString
            )
        ){

            continue;

        }


        // =============================
        // LIBUR KARYAWAN
        // =============================

        if(
            karyawanLiburPadaTanggal(
                nama,
                tanggal
            )
        ){

            continue;

        }


        // =============================
        // HARI KERJA
        // =============================

        total++;

    }


    return total;

}

// =============================
// KONVERSI TANGGAL
// =============================

function ubahTanggal(tanggal){

    if(!tanggal) return "";


    // YYYY-MM-DD

    if(
        /^\d{4}-\d{2}-\d{2}$/.test(tanggal)
    ){

        return tanggal;

    }


    // DD/MM/YYYY

    if(tanggal.includes("/")){

        const bagian =
        tanggal.split("/");

        if(bagian.length === 3){

            return `${bagian[2]}-${bagian[1].padStart(2,"0")}-${bagian[0].padStart(2,"0")}`;

        }

    }


    return "";

}

// =============================
// CARI IZIN PADA TANGGAL
// =============================

function getIzinPadaTanggal(nama, tanggalString){

    return cuti.find(item => {

        const namaCuti =
            String(item.nama || "")
                .trim()
                .toLowerCase();

        const namaKaryawan =
            String(nama || "")
                .trim()
                .toLowerCase();

        const statusCuti =
            String(item.status || "")
                .trim()
                .toLowerCase();

        // Cek nama
        if(
            namaCuti !== namaKaryawan
        ){
            return false;
        }

        // Cek status
        if(
            statusCuti !== "disetujui"
        ){
            return false;
        }

        const mulai =
            ubahTanggal(item.mulai);

        const selesai =
            ubahTanggal(item.selesai);

        if(
            !mulai ||
            !selesai
        ){
            return false;
        }

        // Cek apakah tanggal masuk
        // dalam periode izin
        return (
            tanggalString >= mulai &&
            tanggalString <= selesai
        );

    });

}

// =============================
// HITUNG REKAP
// =============================

function tampilkanRekap(){

    const periode =
    bulanInput.value;


    if(!periode){

        alert("Silakan pilih bulan terlebih dahulu.");

        return;

    }


    const bagian =
    periode.split("-");

    const tahun =
    parseInt(bagian[0]);

    const bulan =
    parseInt(bagian[1]);


    const namaPeriode =
    formatBulan(periode);

    // =============================
    // FILTER ABSENSI
    // =============================

    const absensiBulan =
    absensi.filter(item => {

        if(!item.tanggal) return false;


        const tanggal =
        ubahTanggal(item.tanggal);


        return tanggal.startsWith(periode);

    });


    // =============================
    // TABEL
    // =============================

    dataRekap.innerHTML = "";


    let totalHadir = 0;
    let totalIzin = 0;
    let totalAlpha = 0;


karyawan.forEach((karyawanItem, index) => {

    // =============================
    // HARI KERJA KARYAWAN
    // =============================

    const hariKerja =
        hitungHariKerjaKaryawan(
            karyawanItem.nama,
            tahun,
            bulan
        );


    // =============================
    // HADIR
    // =============================

    const hadir =
        absensiBulan.filter(item => {

            return (
                item.nama === karyawanItem.nama &&
                item.status === "Hadir"
            );

        }).length;

// =============================
// IZIN / CUTI
// =============================

const izin =
    cuti.reduce((total, item) => {

        // Normalisasi data
        const namaCuti =
            String(item.nama || "")
                .trim()
                .toLowerCase();

        const namaKaryawan =
            String(karyawanItem.nama || "")
                .trim()
                .toLowerCase();

        const statusCuti =
            String(item.status || "")
                .trim()
                .toLowerCase();

        // Harus nama yang sama
        if (namaCuti !== namaKaryawan) {
            return total;
        }

        // Harus sudah disetujui
        if (statusCuti !== "disetujui") {
            return total;
        }

        const mulai =
            ubahTanggal(item.mulai);

        const selesai =
            ubahTanggal(item.selesai);

        if (!mulai || !selesai) {
            return total;
        }

        const tanggalMulai =
            new Date(mulai + "T00:00:00");

        const tanggalSelesai =
            new Date(selesai + "T00:00:00");

        const awalBulan =
            new Date(
                tahun,
                bulan - 1,
                1
            );

        const akhirBulan =
            new Date(
                tahun,
                bulan,
                0
            );

        // Tidak ada irisan dengan bulan yang dipilih
        if (
            tanggalSelesai < awalBulan ||
            tanggalMulai > akhirBulan
        ) {
            return total;
        }

        const awal =
            tanggalMulai > awalBulan
                ? tanggalMulai
                : awalBulan;

        const akhir =
            tanggalSelesai < akhirBulan
                ? tanggalSelesai
                : akhirBulan;

        let jumlahHari = 0;

        for (
            let tanggal = new Date(awal);
            tanggal <= akhir;
            tanggal.setDate(
                tanggal.getDate() + 1
            )
        ) {

            const tanggalString =
                `${tanggal.getFullYear()}-${String(
                    tanggal.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    tanggal.getDate()
                ).padStart(2, "0")}`;

            // Libur umum jangan dihitung
            if (
                hariLiburAZNET.includes(
                    tanggalString
                )
            ) {
                continue;
            }

            // Libur sesuai jadwal karyawan jangan dihitung
            if (
                karyawanLiburPadaTanggal(
                    karyawanItem.nama,
                    new Date(tanggal)
                )
            ) {
                continue;
            }

            jumlahHari++;

        }

        return total + jumlahHari;

    }, 0);

    // =============================
    // ALPHA
    // =============================

    const alpha =
        Math.max(
            hariKerja - hadir - izin,
            0
        );


    // =============================
    // PERSENTASE
    // =============================

    let persen = 0;

    if(hariKerja > 0){

        persen =
            Math.round(
                (hadir / hariKerja) * 100
            );

    }


    // =============================
    // TOTAL
    // =============================

    totalHadir += hadir;

    totalIzin += izin;

    totalAlpha += alpha;


    // =============================
    // BARIS TABEL
    // =============================

    dataRekap.innerHTML += `

        <tr>

            <td>
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${karyawanItem.nama}
                </strong>
            </td>

            <td>
                ${karyawanItem.jabatan || "-"}
            </td>

            <td>

                <span class="rekap-hadir">
                    ${hadir}
                </span>

            </td>

            <td>

                <span class="rekap-izin">
                    ${izin}
                </span>

            </td>

            <td>

                <span class="rekap-alpha">
                    ${alpha}
                </span>

            </td>

            <td>

                <strong>
                    ${persen}%
                </strong>

            </td>

<td>
    <button
        type="button"
        class="btn-detail"
        onclick="bukaDetailKehadiran('${karyawanItem.nama}')">

        <i class="fa-solid fa-chart-line"></i>
        Detail

    </button>
</td>

        </tr>

    `;

});


    // =============================
    // TOTAL KARYAWAN
    // =============================

    document.getElementById(
        "totalKaryawan"
    ).innerHTML =
    karyawan.length;


    // =============================
    // TOTAL HADIR
    // =============================

    document.getElementById(
        "totalHadir"
    ).innerHTML =
    totalHadir;


    // =============================
    // TOTAL IZIN
    // =============================

    document.getElementById(
        "totalIzin"
    ).innerHTML =
    totalIzin;


    // =============================
    // TOTAL ALPHA
    // =============================

    document.getElementById(
        "totalAlpha"
    ).innerHTML =
    totalAlpha;


// =============================
// RATA-RATA KEHADIRAN
// =============================

let totalHariKerjaSemua = 0;

karyawan.forEach(karyawanItem => {

    totalHariKerjaSemua +=
        hitungHariKerjaKaryawan(
            karyawanItem.nama,
            tahun,
            bulan
        );

});


let rataRata = 0;

if(totalHariKerjaSemua > 0){

    rataRata =
        Math.round(
            (
                totalHadir /
                totalHariKerjaSemua
            ) * 100
        );

}


document.getElementById(
    "persentaseText"
).innerHTML =
`${rataRata}% Kehadiran`;


document.getElementById(
    "progressBar"
).style.width =
rataRata + "%";


    // =============================
    // PERIODE
    // =============================

document.getElementById(
    "periodeText"
).innerHTML =

`${namaPeriode} • Hari kerja mengikuti jadwal masing-masing karyawan`;

}


// =============================
// TOMBOL TAMPILKAN
// =============================

btnTampilkan.onclick =
function(){

    tampilkanRekap();

};


// =============================
// OTOMATIS SAAT DIBUKA
// =============================

tampilkanRekap();


// =============================
// EXPORT EXCEL
// =============================

const exportBtn =
document.getElementById("exportRekap");


if(exportBtn){

    exportBtn.onclick =
    function(){

        const periode =
        bulanInput.value;


        if(!periode){

            alert(
                "Silakan pilih bulan terlebih dahulu."
            );

            return;

        }


        if(
            !karyawan ||
            karyawan.length === 0
        ){

            alert(
                "Belum ada data karyawan."
            );

            return;

        }


        const bagian =
        periode.split("-");

        const tahun =
        parseInt(bagian[0]);

        const bulan =
        parseInt(bagian[1]);


const dataExcel =
karyawan.map(
(karyawanItem, index) => {

    const hariKerja =
        hitungHariKerjaKaryawan(
            karyawanItem.nama,
            tahun,
            bulan
        );


    const hadir =
        absensi.filter(item => {

            const tanggal =
                ubahTanggal(item.tanggal);

            return (

                tanggal.startsWith(periode) &&

                item.nama ===
                karyawanItem.nama &&

                item.status === "Hadir"

            );

        }).length;


const izin =
    cuti.reduce((total, item) => {

        if (
            item.nama !== karyawanItem.nama ||
            item.status !== "Disetujui"
        ) {
            return total;
        }

        const mulai = ubahTanggal(item.mulai);
        const selesai = ubahTanggal(item.selesai);

        if (!mulai || !selesai) {
            return total;
        }

        const tanggalMulai = new Date(mulai);
        const tanggalSelesai = new Date(selesai);

        const awalBulan =
            new Date(tahun, bulan - 1, 1);

        const akhirBulan =
            new Date(tahun, bulan, 0);

        const awal =
            tanggalMulai > awalBulan
                ? tanggalMulai
                : awalBulan;

        const akhir =
            tanggalSelesai < akhirBulan
                ? tanggalSelesai
                : akhirBulan;

        if (awal > akhir) {
            return total;
        }

        let jumlahHari = 0;

        for (
            let tanggal = new Date(awal);
            tanggal <= akhir;
            tanggal.setDate(tanggal.getDate() + 1)
        ) {

            const tanggalString =
                `${tanggal.getFullYear()}-${String(
                    tanggal.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    tanggal.getDate()
                ).padStart(2, "0")}`;

            if (
                hariLiburAZNET.includes(tanggalString)
            ) {
                continue;
            }

            if (
                karyawanLiburPadaTanggal(
                    karyawanItem.nama,
                    new Date(tanggal)
                )
            ) {
                continue;
            }

            jumlahHari++;

        }

        return total + jumlahHari;

    }, 0);


            const alpha =
            Math.max(
                hariKerja -
                hadir -
                izin,
                0
            );


            const persen =
            hariKerja > 0
            ?
            Math.round(
                hadir /
                hariKerja *
                100
            )
            :
            0;


            return {

                No:
                index + 1,

                Nama:
                karyawanItem.nama,

                Jabatan:
                karyawanItem.jabatan || "-",

                "Hari Kerja":
                hariKerja,

                Hadir:
                hadir,

                Izin:
                izin,

                Alpha:
                alpha,

                "Persentase Kehadiran":
                persen + "%"

            };

        });


        const wb =
        XLSX.utils.book_new();


        const ws =
        XLSX.utils.json_to_sheet(
            dataExcel
        );


        XLSX.utils.book_append_sheet(

            wb,

            ws,

            "Rekap Bulanan"

        );


        XLSX.writeFile(

            wb,

            `Rekap_Bulanan_AZNET_${periode}.xlsx`

        );

    };

}
// =============================
// DETAIL REKAP KARYAWAN
// =============================

function lihatDetailKaryawan(nama){

    const periode =
        bulanInput.value;

    if(!periode){

        alert(
            "Silakan pilih periode terlebih dahulu."
        );

        return;

    }


    const bagian =
        periode.split("-");

    const tahun =
        parseInt(bagian[0]);

    const bulan =
        parseInt(bagian[1]);


    const karyawanItem =
        karyawan.find(
            item => item.nama === nama
        );


    if(!karyawanItem){

        alert(
            "Data karyawan tidak ditemukan."
        );

        return;

    }


    const modal =
        document.getElementById(
            "modalDetailKaryawan"
        );

    const box =
        document.getElementById(
            "detailRekap"
        );


    document.getElementById(
        "detailNama"
    ).innerHTML =
        `📋 ${nama}`;


    document.getElementById(
        "detailJabatan"
    ).innerHTML =
        karyawanItem.jabatan || "Karyawan";


    box.innerHTML = "";


    const hariTerakhir =
        getTanggalTerakhir(
            tahun,
            bulan
        );


    for(
        let hari = 1;
        hari <= hariTerakhir;
        hari++
    ){

        const tanggal =
            new Date(
                tahun,
                bulan - 1,
                hari
            );


        const tanggalString =
            tahun +
            "-" +
            String(bulan).padStart(2,"0") +
            "-" +
            String(hari).padStart(2,"0");


        const namaHari = [

            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"

        ];


        const hariNama =
            namaHari[
                tanggal.getDay()
            ];


        // =============================
        // CEK LIBUR
        // =============================

        const liburUmum =
            hariLiburAZNET.includes(
                tanggalString
            );


        const liburKaryawan =
            karyawanLiburPadaTanggal(
                nama,
                tanggal
            );


        // =============================
        // ABSENSI
        // =============================

        const dataAbsen =
            absensi.find(item => {

                return (
                    item.nama === nama &&
                    ubahTanggal(
                        item.tanggal
                    ) === tanggalString
                );

            });


        // =============================
        // CEK IZIN
        // =============================

const dataIzin =
    cuti.find(item => {

        const namaCuti =
            String(item.nama || "")
                .trim()
                .toLowerCase();

        const namaKaryawan =
            String(nama || "")
                .trim()
                .toLowerCase();

        const statusCuti =
            String(item.status || "")
                .trim()
                .toLowerCase();

        if (
            namaCuti !== namaKaryawan ||
            statusCuti !== "disetujui"
        ) {
            return false;
        }

        const mulai =
            ubahTanggal(item.mulai);

        const selesai =
            ubahTanggal(item.selesai);

        if (!mulai || !selesai) {
            return false;
        }

        return (
            tanggalString >= mulai &&
            tanggalString <= selesai
        );

    });
        // =============================
        // TENTUKAN STATUS
        // =============================

        let status = "";
        let classStatus = "";


        if(liburUmum){

            status = "🔴 Libur Umum";
            classStatus = "detail-libur";

        }
        else if(liburKaryawan){

            status = "⚪ Libur";
            classStatus = "detail-libur";

        }
        else if(dataIzin){

            status =
                `🟡 ${dataIzin.jenis || "Izin"}`;

            classStatus = "detail-izin";

        }
        else if(dataAbsen){

            status = "🟢 Hadir";
            classStatus = "detail-hadir";

        }
        else{

            status = "🔴 Alpha";
            classStatus = "detail-alpha";

        }


        box.innerHTML += `

            <div class="detail-item">

                <div>

                    <strong>
                        ${hari}
                        ${formatBulan(periode)}
                    </strong>

                    <small>
                        ${hariNama}
                    </small>

                </div>


                <span
                    class="${classStatus}">

                    ${status}

                </span>


                <div class="detail-jam">

                    ${
                        dataAbsen
                        ?
                        `
                        🕘 ${dataAbsen.masuk || "-"}
                        <br>
                        🏠 ${dataAbsen.pulang || "-"}
                        `
                        :
                        "-"
                    }

                </div>

            </div>

        `;

    }


    modal.classList.add("show");

}


// =============================
// TUTUP DETAIL
// =============================

function tutupDetailKaryawan(){

    const modal =
        document.getElementById(
            "modalDetailKaryawan"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }

}

// =============================
// TEST DETAIL
// =============================

window.lihatDetailKaryawan = lihatDetailKaryawan;
window.tutupDetailKaryawan = tutupDetailKaryawan;

// =============================
// DETAIL KEHADIRAN
// =============================

function bukaDetailKehadiran(nama){

    const periode =
        bulanInput.value;

    if(!periode){

        alert("Silakan pilih periode terlebih dahulu.");

        return;

    }


    const karyawanItem =
        karyawan.find(
            item => item.nama === nama
        );


    if(!karyawanItem){

        alert("Data karyawan tidak ditemukan.");

        return;

    }


    const bagian =
        periode.split("-");

    const tahun =
        parseInt(bagian[0]);

    const bulan =
        parseInt(bagian[1]);


    document.getElementById(
        "detailNama"
    ).innerHTML =
        "👤 " + karyawanItem.nama;


    document.getElementById(
        "detailJabatan"
    ).innerHTML =
        karyawanItem.jabatan || "Karyawan";


    const list =
        document.getElementById(
            "detailList"
        );

    list.innerHTML = "";


    let jumlahHadir = 0;
    let jumlahIzin = 0;
    let jumlahAlpha = 0;
    let jumlahLibur = 0;


    const hariTerakhir =
        getTanggalTerakhir(
            tahun,
            bulan
        );


    for(
        let hari = 1;
        hari <= hariTerakhir;
        hari++
    ){

        const tanggal =
            new Date(
                tahun,
                bulan - 1,
                hari
            );


        const tanggalString =
            tahun +
            "-" +
            String(bulan).padStart(2,"0") +
            "-" +
            String(hari).padStart(2,"0");


        const namaHari = [

            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"

        ];


        // =============================
        // CEK LIBUR
        // =============================

        const liburUmum =
            hariLiburAZNET.includes(
                tanggalString
            );


        const liburKaryawan =
            karyawanLiburPadaTanggal(
                nama,
                tanggal
            );


        if(
            liburUmum ||
            liburKaryawan
        ){

            jumlahLibur++;


            list.innerHTML += `

                <div class="detail-item">

                    <div class="detail-date">

                        <strong>
                            ${hari} ${formatBulan(periode)}
                        </strong>

                        <small>
                            ${namaHari[tanggal.getDay()]}
                        </small>

                    </div>


                    <div class="detail-status">

                        <span class="status-badge status-libur">

                            ⚪ LIBUR

                        </span>

                    </div>

                </div>

            `;

            continue;

        }


        // =============================
        // CEK ABSENSI
        // =============================

        const dataAbsen =
            absensi.find(item => {

                return (

                    item.nama === nama &&

                    ubahTanggal(
                        item.tanggal
                    ) === tanggalString

                );

            });

// =============================
// CEK IZIN
// =============================

const dataIzin =
    getIzinPadaTanggal(
        nama,
        tanggalString
    );
        // =============================
        // HADIR
        // =============================

        if(dataAbsen){

            jumlahHadir++;


            list.innerHTML += `

                <div class="detail-item">

                    <div class="detail-date">

                        <strong>
                            ${hari} ${formatBulan(periode)}
                        </strong>

                        <small>
                            ${namaHari[tanggal.getDay()]}
                        </small>

                    </div>


                    <div class="detail-status">

                        <span class="status-badge status-hadir">

                            🟢 HADIR

                        </span>

                        <div class="detail-jam">

                            🕘 ${dataAbsen.masuk || "-"}
                            -
                            ${dataAbsen.pulang || "-"}

                        </div>

                    </div>

                </div>

            `;

            continue;

        }


        // =============================
        // IZIN
        // =============================

        if(dataIzin){

            jumlahIzin++;


            list.innerHTML += `

                <div class="detail-item">

                    <div class="detail-date">

                        <strong>
                            ${hari} ${formatBulan(periode)}
                        </strong>

                        <small>
                            ${namaHari[tanggal.getDay()]}
                        </small>

                    </div>


                    <div class="detail-status">

                        <span class="status-badge status-izin">

                            🟡 IZIN

                        </span>

                        <div class="detail-jam">

                            ${dataIzin.jenis || "Izin"}

                        </div>

                    </div>

                </div>

            `;

            continue;

        }


        // =============================
        // ALPHA
        // =============================

        jumlahAlpha++;


        list.innerHTML += `

            <div class="detail-item">

                <div class="detail-date">

                    <strong>
                        ${hari} ${formatBulan(periode)}
                    </strong>

                    <small>
                        ${namaHari[tanggal.getDay()]}
                    </small>

                </div>


                <div class="detail-status">

                    <span class="status-badge status-alpha">

                        🔴 ALPHA

                    </span>

                </div>

            </div>

        `;

    }


    // =============================
    // UPDATE SUMMARY
    // =============================

    document.getElementById(
        "detailHadir"
    ).innerHTML =
        jumlahHadir;


    document.getElementById(
        "detailIzin"
    ).innerHTML =
        jumlahIzin;


    document.getElementById(
        "detailAlpha"
    ).innerHTML =
        jumlahAlpha;


    document.getElementById(
        "detailLibur"
    ).innerHTML =
        jumlahLibur;


    // =============================
    // BUKA MODAL
    // =============================

    document
        .getElementById(
            "modalDetailKehadiran"
        )
        .classList.add("show");

}


// =============================
// TUTUP DETAIL
// =============================

function tutupDetailKehadiran(){

    document
        .getElementById(
            "modalDetailKehadiran"
        )
        .classList.remove("show");

}