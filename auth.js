// =============================
// AZNET ATTENDANCE
// PROTEKSI HAK AKSES
// =============================

(function(){

    const username =
        localStorage.getItem("username");

    const role =
        localStorage.getItem("role");

    // =============================
    // BELUM LOGIN
    // =============================

    if(!username || !role){

        window.location.href = "login.html";

        return;

    }


    // =============================
    // CEK HALAMAN
    // =============================

    const halaman =
        window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    // =============================
    // HALAMAN KHUSUS ADMIN
    // =============================

    const halamanAdmin = [

        "admin.html",
        "karyawan.html",
        "rekap.html"

    ];


    // =============================
    // STAFF DILARANG MASUK
    // =============================

    if(

        halamanAdmin.includes(halaman) &&

        role !== "admin"

    ){

        alert(
            "⛔ Akses ditolak!\nHalaman ini khusus Admin."
        );

        window.location.href =
            "dashboard.html";

        return;

    }


})();