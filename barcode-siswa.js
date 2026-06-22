async function loadBarcodeSiswa(){

const content =
document.getElementById("content");

content.innerHTML = `

<div class="page-header">

<h1>Barcode Siswa</h1>

</div>

<div class="table-container">

<div style="margin-bottom:20px">

<select
id="barcodeKelas"
onchange="loadBarcodeTable()">

<option value="">
Pilih Kelas
</option>

</select>

</div>

<table>

<thead>

<tr>

<th>Nama</th>
<th>NIS</th>
<th>Barcode</th>
<th>Aksi</th>

</tr>

</thead>

<tbody id="barcodeTable">

</tbody>

</table>

</div>

<div
id="barcodeModal"
class="modal hidden">

<div class="modal-content barcode-modal">

<h2>Barcode Siswa</h2>

<div
id="qrContainer"
style="
display:flex;
justify-content:center;
margin:20px 0;
"></div>

<p
id="barcodeText"
style="
text-align:center;
font-weight:bold;
"></p>

<div class="barcode-buttons">

<button
class="btn-download"
onclick="downloadQR()">

Download JPG

</button>

<button
class="btn-print"
onclick="printQR()">

Print

</button>

<button
class="btn-close"
onclick="closeBarcodeModal()">

Tutup

</button>

</div>

</div>

</div>

`;

await loadBarcodeKelas();
await loadBarcodeTable();

}

let currentBarcode = "";
let currentNama = "";

async function loadBarcodeKelas(){

const {data,error} =
await supabaseClient
.from("kelas")
.select("*")
.order("nama_kelas");

if(error) return;

const select =
document.getElementById(
"barcodeKelas"
);

select.innerHTML =
'<option value="">Pilih Kelas</option>';

data.forEach(kelas=>{

select.innerHTML += `
<option value="${kelas.id}">
${kelas.nama_kelas}
</option>
`;

});

}

async function loadBarcodeTable(){

const kelasId =
document.getElementById(
"barcodeKelas"
)?.value;

let query =
supabaseClient
.from("siswa")
.select("*")
.order("nama");

if(kelasId){

query =
query.eq(
"kelas_id",
kelasId
);

}

const {data,error} =
await query;

if(error) return;

const tbody =
document.getElementById(
"barcodeTable"
);

tbody.innerHTML = "";

data.forEach(siswa=>{

tbody.innerHTML += `

<tr>

<td>${siswa.nama}</td>

<td>${siswa.nis}</td>

<td>${siswa.barcode}</td>

<td>

<button
class="btn-edit"
onclick="showBarcode(
'${siswa.barcode}',
'${siswa.nama}'
)">

Lihat Barcode

</button>

</td>

</tr>

`;

});

}

function showBarcode(barcode,nama){

currentBarcode = barcode;
currentNama = nama;

document
.getElementById("barcodeModal")
.classList.remove("hidden");

const qr =
document.getElementById(
"qrContainer"
);

qr.innerHTML = "";

new QRCode(
qr,
{
text:barcode,
width:250,
height:250
}
);

document.getElementById(
"barcodeText"
).textContent =
barcode;

}

function closeBarcodeModal(){

document
.getElementById(
"barcodeModal"
)
.classList.add(
"hidden"
);

}

function downloadQR(){

const canvas =
document.querySelector(
"#qrContainer canvas"
);

const link =
document.createElement("a");

link.download =
currentNama + ".jpg";

link.href =
canvas.toDataURL(
"image/jpeg"
);

link.click();

}

function printQR(){

const qrHTML =
document.getElementById(
"qrContainer"
).innerHTML;

const win =
window.open(
"",
"",
"width=600,height=600"
);

win.document.write(`

<html>

<head>
<title>Print QR</title>
</head>

<body
style="
text-align:center;
padding-top:50px;
">

<h2>${currentNama}</h2>

${qrHTML}

<p>${currentBarcode}</p>

</body>

</html>

`);

win.document.close();
win.print();

}