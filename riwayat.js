// =====================================
// AZNET Attendance
// riwayat.js
// =====================================

const tbody = document.getElementById("tableRiwayat");

// ==========================
// LOAD RIWAYAT
// ==========================

function loadRiwayat(){

    const riwayat =
    JSON.parse(localStorage.getItem("riwayatAbsensi")) || [];

    tbody.innerHTML = "";

    if(riwayat.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="kosong">
                    📭 Belum ada riwayat absensi
                </td>
            </tr>
        `;

        return;

    }

    riwayat.forEach(item=>{

        let warnaStatus = "status-hadir";

        if(item.status === "Terlambat"){

            warnaStatus = "status-telat";

        }

        if(item.status === "Alpha"){

            warnaStatus = "status-alpha";

        }

        tbody.innerHTML += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.masuk}</td>

            <td>${item.pulang}</td>

            <td>${item.kota}</td>

            <td class="${warnaStatus}">
                ${item.status}
            </td>

        </tr>

        `;

    });

}

loadRiwayat();