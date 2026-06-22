async function loadTentangSekolah(){

const content =
document.getElementById(
"content"
);

const {data,error} =
await supabaseClient
.from("sekolah")
.select("*")
.single();

if(error){

console.error(error);

return;

}

content.innerHTML = `

<div class="page-header">

<h1>Tentang Sekolah</h1>

<button
class="btn-primary"
onclick="simpanTentangSekolah()">

Simpan

</button>

</div>

<div class="form-container">

<div class="form-grid">

<div class="form-group">

<label>Nama Sekolah</label>

<input
type="text"
id="namaSekolah"
value="${data.nama_sekolah || ''}">

</div>

<div class="form-group">

<label>NPSN</label>

<input
type="text"
id="npsn"
value="${data.npsn || ''}">

</div>

<div class="form-group">

<label>Email</label>

<input
type="email"
id="email"
value="${data.email || ''}">

</div>

<div class="form-group">

<label>Telepon</label>

<input
type="text"
id="telepon"
value="${data.telepon || ''}">

</div>

<div class="form-group">

<label>Website</label>

<input
type="text"
id="website"
value="${data.website || ''}">

</div>

<div class="form-group">

<label>Kepala Sekolah</label>

<input
type="text"
id="kepalaSekolah"
value="${data.kepala_sekolah || ''}">

</div>

<div class="form-group">

<label>Operator Sekolah</label>

<input
type="text"
id="operatorSekolah"
value="${data.operator_sekolah || ''}">

</div>

</div>

<div class="form-group">

<label>Alamat Sekolah</label>

<textarea
id="alamat"
rows="4">${data.alamat || ''}</textarea>

</div>

</div>

`;

}

async function simpanTentangSekolah(){

const payload = {

nama_sekolah:
document.getElementById(
"namaSekolah"
).value,

npsn:
document.getElementById(
"npsn"
).value,

alamat:
document.getElementById(
"alamat"
).value,

email:
document.getElementById(
"email"
).value,

telepon:
document.getElementById(
"telepon"
).value,

website:
document.getElementById(
"website"
).value,

kepala_sekolah:
document.getElementById(
"kepalaSekolah"
).value,

operator_sekolah:
document.getElementById(
"operatorSekolah"
).value

};

const {error} =
await supabaseClient
.from("sekolah")
.update(payload)
.eq("id",1);

if(error){

alert(
"Gagal menyimpan data"
);

console.error(error);

return;

}

alert(
"Data sekolah berhasil disimpan"
);

}

