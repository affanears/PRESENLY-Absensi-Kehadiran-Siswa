async function loadAbsensiSiswa(){

const content =
document.getElementById("content");

const today =
new Date().toISOString().split("T")[0];

content.innerHTML = `

<div class="page-header">

<h1>Absensi Siswa</h1>

<button
class="btn-primary"
onclick="saveAbsensiManual()">
Simpan Absensi
</button>

</div>

<div class="table-container">

<div
style="
display:grid;
grid-template-columns:1fr 1fr;
gap:15px;
margin-bottom:20px;
">

<input
type="date"
id="tanggalAbsensi"
value="${today}">

<select
id="kelasAbsensi"
onchange="loadAbsensiTable()">

<option value="">
Pilih Kelas
</option>

</select>

</div>

<table>

<thead>

<tr>

<th>No</th>
<th>Nama</th>
<th>Hadir</th>
<th>Keterangan</th>

</tr>

</thead>

<tbody id="absensiTable">

</tbody>

</table>

</div>

`;

await loadKelasAbsensi();
}

async function loadKelasAbsensi(){

const {data,error} =
await supabaseClient
.from("kelas")
.select("*")
.order("nama_kelas");

if(error) return;

const select =
document.getElementById(
"kelasAbsensi"
);

data.forEach(kelas=>{

select.innerHTML += `
<option value="${kelas.id}">
${kelas.nama_kelas}
</option>
`;

});

}

async function loadAbsensiTable(){

const kelasId =
document.getElementById(
"kelasAbsensi"
).value;

const tanggal =
document.getElementById(
"tanggalAbsensi"
).value;

if(!kelasId) return;

const {data:siswa} =
await supabaseClient
.from("siswa")
.select("*")
.eq("kelas_id",kelasId)
.order("nama");

const {data:absensi} =
await supabaseClient
.from("absensi")
.select("*")
.eq("tanggal",tanggal);

const tbody =
document.getElementById(
"absensiTable"
);

tbody.innerHTML = "";

siswa.forEach((item,index)=>{

const dataAbsen =
absensi.find(
a=>a.siswa_id===item.id
);

const hadir =
dataAbsen?.status==="Hadir";

const status =
dataAbsen?.status || "Alpa";

tbody.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.nama}</td>

<td>

<input
type="checkbox"
class="hadir-check"
data-id="${item.id}"
${hadir ? "checked" : ""}>

</td>

<td>

<select
class="status-select"
data-id="${item.id}">

<option
value="Sakit"
${status==="Sakit"?"selected":""}>
Sakit
</option>

<option
value="Izin"
${status==="Izin"?"selected":""}>
Izin
</option>

<option
value="Alpa"
${status==="Alpa"?"selected":""}>
Alpa
</option>

</select>

</td>

</tr>

`;

});

setupCheckboxLogic();

}

function setupCheckboxLogic(){

document
.querySelectorAll(".hadir-check")
.forEach(check=>{

check.addEventListener(
"change",
()=>{

const row =
check.closest("tr");

const select =
row.querySelector(
".status-select"
);

if(check.checked){

select.disabled = true;

}else{

select.disabled = false;

}

});

});

}

async function saveAbsensiManual(){

const tanggal =
document.getElementById(
"tanggalAbsensi"
).value;

const checks =
document.querySelectorAll(
".hadir-check"
);

for(const check of checks){

const siswaId =
check.dataset.id;

const row =
check.closest("tr");

const select =
row.querySelector(
".status-select"
);

let status;

let metode = "Manual";

if(check.checked){

status = "Hadir";

}else{

status = select.value;

}

await supabaseClient
.from("absensi")
.upsert({

siswa_id:siswaId,
tanggal:tanggal,
status:status,
metode:metode

},{
onConflict:
"siswa_id,tanggal"
});

}

alert(
"Absensi berhasil disimpan"
);

loadAbsensiTable();

}

