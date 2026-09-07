// ==========================
// AZNET LOGIN
// ==========================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // ELEMENT
    // ==========================

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const lihatPassword = document.getElementById("lihatPassword");

    // ==========================
    // TOAST
    // ==========================

    function toast(pesan, tipe = "info") {

        let t = document.getElementById("toast");

        if (!t) {
            alert(pesan);
            return;
        }

        t.className = "toast " + tipe;
        t.innerHTML = pesan;
        t.classList.add("show");

        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(function () {
            t.classList.remove("show");
        }, 3000);
    }

    // ==========================
    // LIHAT PASSWORD
    // ==========================

    if (lihatPassword && passwordInput) {

        lihatPassword.onclick = function () {

            const icon = this.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                if (icon) {
                    icon.classList.replace("fa-eye", "fa-eye-slash");
                }

            } else {

                passwordInput.type = "password";

                if (icon) {
                    icon.classList.replace("fa-eye-slash", "fa-eye");
                }

            }

        };

    }

    // ==========================
    // LOGIN
    // ==========================

    if (loginBtn) {

        loginBtn.addEventListener("click", function (e) {

            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // ==========================
            // VALIDASI
            // ==========================

            if (username === "" || password === "") {

                toast(
                    "⚠️ Username dan Password wajib diisi!",
                    "error"
                );

                return;

            }

            // ==========================
            // LOGIN ADMIN
            // ==========================

            if (
                username === "admin" &&
                password === "admin123"
            ) {

                localStorage.setItem("nama", "Administrator");
                localStorage.setItem("username", "admin");
                localStorage.setItem("role", "admin");
                localStorage.setItem("jabatan", "Super Admin");
                localStorage.setItem("divisi", "Management");

                toast(
                    "✅ Selamat datang Administrator",
                    "success"
                );

                setTimeout(function () {

                    window.location.href = "dashboard.html";

                }, 1000);

                return;
            }

            // ==========================
            // LOGIN KARYAWAN
            // ==========================

            let list = [];

            try {

                list = JSON.parse(
                    localStorage.getItem("karyawan")
                ) || [];

            } catch (error) {

                list = [];

            }

            const akun = list.find(function (item) {

                return (
                    item.username === username &&
                    item.password === password
                );

            });

            if (akun) {

                localStorage.setItem("nama", akun.nama);
                localStorage.setItem("username", akun.username);
                localStorage.setItem("role", akun.role);
                localStorage.setItem("jabatan", akun.jabatan || "");
                localStorage.setItem("divisi", akun.divisi || "");

                toast(
                    "🎉 Selamat datang, " + akun.nama,
                    "success"
                );

                setTimeout(function () {

                    window.location.href = "dashboard.html";

                }, 1000);

                return;
            }

            // ==========================
            // LOGIN GAGAL
            // ==========================

            toast(
                "❌ Username atau Password salah!",
                "error"
            );

        });

    }

    // ==========================
    // ENTER = LOGIN
    // ==========================

    document.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            if (loginBtn) {
                loginBtn.click();
            }

        }

    });

});
