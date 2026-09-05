const dark = document.getElementById("darkToggle");

if(localStorage.getItem("darkMode")=="on"){

dark.checked=true;

document.body.classList.add("dark");

}

dark.onchange=function(){

if(dark.checked){

localStorage.setItem("darkMode","on");

document.body.classList.add("dark");

}else{

localStorage.setItem("darkMode","off");

document.body.classList.remove("dark");

}

};

document.getElementById("resetAbsen").onclick=function(){

if(confirm("Reset semua data absensi?")){

localStorage.removeItem("riwayatAbsensi");

localStorage.removeItem("absensiHariIni");

alert("Berhasil direset.");

}

};

document.getElementById("resetProfil").onclick=function(){

if(confirm("Reset profil?")){

localStorage.removeItem("profil");

localStorage.removeItem("fotoProfil");

alert("Profil direset.");

}

};

document.getElementById("logout").onclick=function(){

if(confirm("Logout sekarang?")){

localStorage.removeItem("username");

localStorage.removeItem("role");

window.location="index.html";

}

};