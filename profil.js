const foto=document.getElementById("foto");
const preview=document.getElementById("previewFoto");

const nama=document.getElementById("nama");
const jabatan=document.getElementById("jabatan");
const divisi=document.getElementById("divisi");
const email=document.getElementById("email");
const hp=document.getElementById("hp");
const alamat=document.getElementById("alamat");

const namaPreview=document.getElementById("namaPreview");
const jabatanPreview=document.getElementById("jabatanPreview");

// Load data
const username =
localStorage.getItem("username");

let semuaProfil =
JSON.parse(localStorage.getItem("profil")) || {};

let data =
semuaProfil[username];

if(!data){

    const list =
    JSON.parse(localStorage.getItem("karyawan")) || [];

    data =
    list.find(item=>item.username===username);

}

nama.value=data.nama||"";
jabatan.value=data.jabatan||"";
divisi.value=data.divisi||"";
email.value=data.email||"";
hp.value=data.hp||"";
alamat.value=data.alamat||"";

namaPreview.innerHTML=data.nama||"Nama Lengkap";
jabatanPreview.innerHTML=data.jabatan||"Jabatan";

if(data.foto){

preview.src=data.foto;

}

// Preview nama
nama.oninput=function(){

namaPreview.innerHTML=this.value||"Nama Lengkap";

}

// Preview jabatan
jabatan.oninput=function(){

jabatanPreview.innerHTML=this.value||"Jabatan";

}

// Ganti foto
foto.onchange=function(){

const file=this.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=function(e){

preview.src=e.target.result;

}

reader.readAsDataURL(file);

}

// Simpan
document.getElementById("simpan").onclick=function(){

const profil={

nama:nama.value,

jabatan:jabatan.value,

divisi:divisi.value,

email:email.value,

hp:hp.value,

alamat:alamat.value,

foto:preview.src

};

semuaProfil[username] = profil;

localStorage.setItem(
"profil",
JSON.stringify(semuaProfil)
);

alert("✅ Profil berhasil disimpan!");

}

