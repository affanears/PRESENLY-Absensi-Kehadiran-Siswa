document.addEventListener(
"DOMContentLoaded",
()=>{

const user =
localStorage.getItem("user");

if(!user){

window.location =
"index.html";

return;
}

loadDashboard();

const menuItems =
document.querySelectorAll(
".sidebar li[data-page]"
);

menuItems.forEach(item=>{

item.addEventListener(
"click",
()=>{

const page =
item.dataset.page;

navigate(page);

}
);

});

document
.getElementById("logoutBtn")
.addEventListener(
"click",
logout
);

}
);

function navigate(page){

switch(page){

case "dashboard":
loadDashboard();
break;

case "kelas":
loadDataKelas();
break;

case "siswa":
loadDataSiswa();
break;

case "barcode-siswa":
loadBarcodeSiswa();
break;

case "barcode":
loadAbsenBarcode();
break;

case "absensi":
loadAbsensiSiswa();
break;

case "rekap":
loadRekap();
break;

case "tentang":
    loadTentangSekolah();
    break;
    
default:

document.getElementById(
"content"
).innerHTML=
`
<h1>${page}</h1>
<p>Menu sedang dibuat...</p>
`;

}

}