let html5QrCode = null;

async function loadAbsenBarcode(){

const content =
document.getElementById("content");

content.innerHTML = `

<div class="page-header">

<h1>Absen Barcode</h1>

</div>

<div class="table-container">

<div
id="reader"
style="
width:100%;
max-width:600px;
margin:auto;
">
</div>

<div
id="scanResult"
style="
margin-top:20px;
text-align:center;
font-size:18px;
font-weight:bold;
">
Menunggu Scan...
</div>

</div>

`;

startScanner();

}

async function startScanner(){

if(html5QrCode){

try{
await html5QrCode.stop();
}catch(err){}
}

html5QrCode =
new Html5Qrcode("reader");

try{

await html5QrCode.start(

{
facingMode:"environment"
},

{
fps:10,
qrbox:250
},

onScanSuccess

);

}catch(error){

document.getElementById(
"scanResult"
).innerHTML =

`
❌ Kamera gagal dibuka
`;

}

}

async function onScanSuccess(barcode){

const today =
new Date()
.toISOString()
.split("T")[0];

const result =
document.getElementById(
"scanResult"
);

const {data:siswa,error} =
await supabaseClient
.from("siswa")
.select(`
*,
kelas (
nama_kelas
)
`)
.eq("barcode",barcode)
.single();

if(error || !siswa){

result.innerHTML =
`
❌ Barcode tidak ditemukan
`;

return;
}

const {data:cekAbsen} =
await supabaseClient
.from("absensi")
.select("*")
.eq("siswa_id",siswa.id)
.eq("tanggal",today)
.maybeSingle();

if(cekAbsen){

result.innerHTML =

`
⚠️ ${siswa.nama}
sudah absen hari ini
`;

return;
}

const {error:insertError} =
await supabaseClient
.from("absensi")
.insert([{

siswa_id:siswa.id,
tanggal:today,
status:"Hadir",
metode:"Barcode"

}]);

if(insertError){

result.innerHTML =
`
❌ Gagal menyimpan absensi
`;

return;
}

result.innerHTML =

`
✅ ABSENSI BERHASIL

<br><br>

Nama:
${siswa.nama}

<br>

Kelas:
${siswa.kelas.nama_kelas}

`;

navigator.vibrate?.(300);

}