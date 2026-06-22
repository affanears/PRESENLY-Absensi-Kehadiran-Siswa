async function loadDashboard(){

const content =
document.getElementById("content");

const user =
JSON.parse(
localStorage.getItem("user")
);

document.getElementById(
"userLogin"
).textContent =
user.nama_lengkap;

content.innerHTML =

`
<div class="welcome-card">

<h2>
Selamat Datang,
${user.nama_lengkap}
</h2>

<p>
Login sebagai pengguna sistem absensi sekolah
</p>

</div>

<div class="stats">

<div class="card">
<h3>Total Siswa</h3>
<p id="totalSiswa">0</p>
</div>

<div class="card">
<h3>Hadir Hari Ini</h3>
<p id="hadirHariIni">0</p>
</div>

<div class="card">
<h3>Total Kelas</h3>
<p id="totalKelas">0</p>
</div>

<div class="card">
<h3>Sakit</h3>
<p id="sakitHariIni">0</p>
</div>

<div class="card">
<h3>Izin</h3>
<p id="izinHariIni">0</p>
</div>

<div class="card">
<h3>Alpa</h3>
<p id="alpaHariIni">0</p>
</div>

</div>

`;

const today =
new Date()
.toISOString()
.split("T")[0];

const siswa =
await supabaseClient
.from("siswa")
.select("*",{count:"exact"});

const kelas =
await supabaseClient
.from("kelas")
.select("*",{count:"exact"});

const hadir =
await supabaseClient
.from("absensi")
.select("*",{count:"exact"})
.eq("tanggal",today)
.eq("status","Hadir");

const sakit =
await supabaseClient
.from("absensi")
.select("*",{count:"exact"})
.eq("tanggal",today)
.eq("status","Sakit");

const izin =
await supabaseClient
.from("absensi")
.select("*",{count:"exact"})
.eq("tanggal",today)
.eq("status","Izin");

const alpa =
await supabaseClient
.from("absensi")
.select("*",{count:"exact"})
.eq("tanggal",today)
.eq("status","Alpa");

document.getElementById("totalSiswa").textContent =
siswa.count || 0;

document.getElementById("hadirHariIni").textContent =
`${hadir.count || 0} / ${siswa.count || 0}`;

document.getElementById("totalKelas").textContent =
kelas.count || 0;

document.getElementById("sakitHariIni").textContent =
sakit.count || 0;

document.getElementById("izinHariIni").textContent =
izin.count || 0;

document.getElementById("alpaHariIni").textContent =
alpa.count || 0;

}

