async function loadDataSiswa() {

const content =
document.getElementById("content");

content.innerHTML = `

<div class="page-header">

    <h1>Data Siswa</h1>

    <button
    class="btn-primary"
    onclick="openSiswaModal()">
        Tambah Siswa
    </button>

</div>

<div class="table-container">

    <div style="margin-bottom:20px">

        <select
        id="filterKelas"
        onchange="loadSiswaTable()">

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
                <th>Jenis Kelamin</th>
                <th>Barcode</th>
                <th>Aksi</th>
            </tr>

        </thead>

        <tbody id="siswaTable">

        </tbody>

    </table>

</div>

<div
id="siswaModal"
class="modal hidden">

<div class="modal-content">

<h2 id="siswaModalTitle">

Tambah Siswa

</h2>

<select id="kelasSiswa">

</select>

<input
type="text"
id="namaSiswa"
placeholder="Nama Siswa">

<input
type="text"
id="nisSiswa"
placeholder="NIS">

<select id="jkSiswa">

<option value="">
Pilih Jenis Kelamin
</option>

<option value="Laki-laki">
Laki-laki
</option>

<option value="Perempuan">
Perempuan
</option>

</select>

<div class="modal-actions">

<button
class="btn-secondary"
onclick="closeSiswaModal()">

Batal

</button>

<button
class="btn-primary"
onclick="saveSiswa()">

Simpan

</button>

</div>

</div>

</div>

`;

await loadKelasDropdown();
await loadSiswaTable();

}

let currentSiswaId = null;

async function loadKelasDropdown(){

const {data,error} =
await supabaseClient
.from("kelas")
.select("*")
.order("nama_kelas");

if(error) return;

const filter =
document.getElementById("filterKelas");

const modal =
document.getElementById("kelasSiswa");

filter.innerHTML =
'<option value="">Pilih Kelas</option>';

modal.innerHTML = '';

data.forEach(kelas=>{

filter.innerHTML += `
<option value="${kelas.id}">
${kelas.nama_kelas}
</option>
`;

modal.innerHTML += `
<option value="${kelas.id}">
${kelas.nama_kelas}
</option>
`;

});

}

async function loadSiswaTable(){

const kelasId =
document.getElementById(
"filterKelas"
)?.value;

let query =
supabaseClient
.from("siswa")
.select(`
*,
kelas (
nama_kelas
)
`)
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
"siswaTable"
);

tbody.innerHTML = "";

data.forEach(siswa=>{

tbody.innerHTML += `

<tr>

<td>
${siswa.nama}
</td>

<td>
${siswa.nis}
</td>

<td>
${siswa.jenis_kelamin}
</td>

<td>
${siswa.barcode}
</td>

<td>

<button
class="btn-edit"
onclick="editSiswa(${siswa.id})">

Edit

</button>

<button
class="btn-delete"
onclick="deleteSiswa(${siswa.id})">

Hapus

</button>

</td>

</tr>

`;

});

}

function openSiswaModal(){

currentSiswaId = null;

document.getElementById(
"siswaModalTitle"
).textContent =
"Tambah Siswa";

document.getElementById(
"namaSiswa"
).value = "";

document.getElementById(
"nisSiswa"
).value = "";

document.getElementById(
"jkSiswa"
).value = "";

document.getElementById(
"siswaModal"
).classList.remove(
"hidden"
);

}

function closeSiswaModal(){

document.getElementById(
"siswaModal"
).classList.add(
"hidden"
);

}

async function saveSiswa(){

const kelasId =
document.getElementById(
"kelasSiswa"
).value;

const nama =
document.getElementById(
"namaSiswa"
).value.trim();

const nis =
document.getElementById(
"nisSiswa"
).value.trim();

const jk =
document.getElementById(
"jkSiswa"
).value;

if(
!kelasId ||
!nama ||
!nis ||
!jk
){

alert(
"Lengkapi data terlebih dahulu"
);

return;
}

if(currentSiswaId){

await supabaseClient
.from("siswa")
.update({

kelas_id:kelasId,
nama:nama,
nis:nis,
jenis_kelamin:jk

})
.eq("id",currentSiswaId);

}else{

await supabaseClient
.from("siswa")
.insert([{

kelas_id:kelasId,
nama:nama,
nis:nis,
jenis_kelamin:jk

}]);

}

closeSiswaModal();

loadSiswaTable();

}

async function editSiswa(id){

const {data,error} =
await supabaseClient
.from("siswa")
.select("*")
.eq("id",id)
.single();

if(error) return;

currentSiswaId = id;

document.getElementById(
"siswaModalTitle"
).textContent =
"Edit Siswa";

document.getElementById(
"kelasSiswa"
).value =
data.kelas_id;

document.getElementById(
"namaSiswa"
).value =
data.nama;

document.getElementById(
"nisSiswa"
).value =
data.nis;

document.getElementById(
"jkSiswa"
).value =
data.jenis_kelamin;

document.getElementById(
"siswaModal"
).classList.remove(
"hidden"
);

}

async function deleteSiswa(id){

if(
!confirm(
"Hapus siswa ini?"
)
){

return;

}

await supabaseClient
.from("siswa")
.delete()
.eq("id",id);

loadSiswaTable();

}