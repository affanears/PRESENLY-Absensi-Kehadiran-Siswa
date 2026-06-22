async function loadDataKelas(){

const content =
document.getElementById("content");

content.innerHTML = `
<div class="page-header">

    <h1>Data Kelas</h1>

    <button
    class="btn-primary"
    onclick="openKelasModal()">
        Tambah Kelas
    </button>

</div>

<div class="table-container">

<table>

<thead>
<tr>
<th>Nama Kelas</th>
<th>Wali Kelas</th>
<th>Aksi</th>
</tr>
</thead>

<tbody id="kelasTable">
</tbody>

</table>

</div>

<div id="kelasModal"
class="modal hidden">

<div class="modal-content">

<h2 id="modalTitle">
Tambah Kelas
</h2>

<input
type="text"
id="namaKelas"
placeholder="Nama Kelas">

<input
type="text"
id="waliKelas"
placeholder="Wali Kelas">

<div class="modal-actions">

<button
class="btn-secondary"
onclick="closeKelasModal()">
Batal
</button>

<button
class="btn-primary"
onclick="saveKelas()">
Simpan
</button>

</div>

</div>

</div>
`;

loadKelasTable();

}

let currentKelasId = null;

function openKelasModal(){

currentKelasId = null;

document.getElementById(
"modalTitle"
).textContent =
"Tambah Kelas";

document.getElementById(
"namaKelas"
).value = "";

document.getElementById(
"waliKelas"
).value = "";

document.getElementById(
"kelasModal"
).classList.remove(
"hidden"
);

}

function closeKelasModal(){

document.getElementById(
"kelasModal"
).classList.add(
"hidden"
);

}

async function loadKelasTable(){

const tbody =
document.getElementById(
"kelasTable"
);

const {data,error} =
await supabaseClient
.from("kelas")
.select("*")
.order("nama_kelas");

if(error) return;

tbody.innerHTML = "";

data.forEach(kelas=>{

tbody.innerHTML += `
<tr>

<td>
${kelas.nama_kelas}
</td>

<td>
${kelas.wali_kelas || "-"}
</td>

<td>

<button
class="btn-edit"
onclick="editKelas(${kelas.id})">
Edit
</button>

<button
class="btn-delete"
onclick="deleteKelas(${kelas.id})">
Hapus
</button>

</td>

</tr>
`;

});

}

async function saveKelas(){

const namaKelas =
document.getElementById(
"namaKelas"
).value.trim();

const waliKelas =
document.getElementById(
"waliKelas"
).value.trim();

if(!namaKelas){

alert("Nama kelas wajib diisi");

return;
}

if(currentKelasId){

await supabaseClient
.from("kelas")
.update({
nama_kelas:namaKelas,
wali_kelas:waliKelas
})
.eq("id",currentKelasId);

}else{

await supabaseClient
.from("kelas")
.insert([{
nama_kelas:namaKelas,
wali_kelas:waliKelas
}]);

}

closeKelasModal();

loadKelasTable();

}

async function editKelas(id){

const {data,error} =
await supabaseClient
.from("kelas")
.select("*")
.eq("id",id)
.single();

if(error) return;

currentKelasId = id;

document.getElementById(
"modalTitle"
).textContent =
"Edit Kelas";

document.getElementById(
"namaKelas"
).value =
data.nama_kelas;

document.getElementById(
"waliKelas"
).value =
data.wali_kelas || "";

document.getElementById(
"kelasModal"
).classList.remove(
"hidden"
);

}

async function deleteKelas(id){

if(
!confirm(
"Yakin hapus kelas?"
)
){
return;
}

await supabaseClient
.from("kelas")
.delete()
.eq("id",id);

loadKelasTable();

}