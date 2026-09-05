let list = JSON.parse(localStorage.getItem("karyawan"));

if(!list){

    list = [

        {
            nama:"Administrator",
            username:"admin",
            password:"admin123",
            jabatan:"Administrator",
            divisi:"Staff",
            role:"admin"
        }

    ];

    localStorage.setItem("karyawan", JSON.stringify(list));

}
const password = document.getElementById("password");
const lihatPassword = document.getElementById("lihatPassword");

lihatPassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        lihatPassword.innerHTML = "🙈";
    } else {
        password.type = "password";
        lihatPassword.innerHTML = "👁️";
    }
});

document.getElementById("loginBtn").addEventListener("click", function () {

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let list = JSON.parse(localStorage.getItem("karyawan")) || [];

    console.log(list);
console.log(user);
console.log(pass);

let akun = list.find(item =>
    item.username === user &&
    item.password === pass
);

if(akun){

    localStorage.setItem("nama", akun.nama);
    localStorage.setItem("role", akun.role);

    window.location.href = "dashboard.html";

}else{

    alert("Username atau Password salah!");

}

});