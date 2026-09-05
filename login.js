// ==========================
// LIHAT PASSWORD
// ==========================

const passwordInput = document.getElementById("password");
const lihatPassword = document.getElementById("lihatPassword");

if(lihatPassword){

    lihatPassword.onclick = function(){

        const icon = this.querySelector("i");

        if(passwordInput.type === "password"){

            passwordInput.type = "text";

            icon.classList.replace("fa-eye","fa-eye-slash");

        }else{

            passwordInput.type = "password";

            icon.classList.replace("fa-eye-slash","fa-eye");

        }

    };

}

// ==========================
// TOAST
// ==========================

function toast(pesan, tipe="info"){

    const t = document.getElementById("toast");

    t.className = "toast " + tipe;

    t.innerHTML = pesan;

    t.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function(){

        t.classList.remove("show");

    },3000);

}

// ==========================
// LOGIN
// ==========================

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = function(){

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    // ======================
    // VALIDASI
    // ======================

    if(username === "" || password === ""){

        toast(
            "⚠️ Username dan Password wajib diisi!",
            "error"
        );

        return;

    }

    // ======================
    // LOGIN ADMIN
    // ======================

    if(username === "admin" && password === "admin123"){

    localStorage.setItem("nama","Administrator");
    localStorage.setItem("username","admin"); // TAMBAHAN
    localStorage.setItem("role","admin");
    localStorage.setItem("jabatan","Super Admin");
    localStorage.setItem("divisi","Management");

    toast(
        "✅ Selamat datang Administrator",
        "success"
    );

    setTimeout(function(){

        window.location.href = "dashboard.html";

    },1000);

    return;

}

    // ======================
    // LOGIN KARYAWAN
    // ======================

    let list =
    JSON.parse(localStorage.getItem("karyawan")) || [];

    let akun = list.find(item =>

        item.username === username &&
        item.password === password

    );

    if(akun){

    localStorage.setItem("nama", akun.nama);
    localStorage.setItem("username", akun.username); // TAMBAHAN
    localStorage.setItem("role", akun.role);
    localStorage.setItem("jabatan", akun.jabatan);
    localStorage.setItem("divisi", akun.divisi);

    toast(
        "🎉 Selamat datang, " + akun.nama,
        "success"
    );

    setTimeout(function(){

        window.location.href = "dashboard.html";

    },1000);

    return;

}

    // ======================
    // LOGIN GAGAL
    // ======================

    toast(
        "❌ Username atau Password salah!",
        "error"
    );

};

// ==========================
// ENTER = LOGIN
// ==========================

document.addEventListener("keydown",function(e){

    if(e.key === "Enter"){

        loginBtn.click();

    }

});