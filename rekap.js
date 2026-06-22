let activeRekap = "harian";

function loadRekap() {

    const content =
        document.getElementById("content");

    content.innerHTML = `

    <div class="page-header">

        <h1>Rekap Absensi</h1>

    </div>

    <div class="rekap-tabs">

        <button
            class="rekap-tab active"
            onclick="switchRekap('harian', this)">
            Harian
        </button>

        <button
            class="rekap-tab"
            onclick="switchRekap('bulanan', this)">
            Bulanan
        </button>

        <button
            class="rekap-tab"
            onclick="switchRekap('tahunan', this)">
            Tahunan
        </button>

    </div>

    <div id="rekapContent"></div>

    `;

    loadRekapHarian();
}

function switchRekap(type, button) {

    activeRekap = type;

    document
        .querySelectorAll(".rekap-tab")
        .forEach(tab => {
            tab.classList.remove("active");
        });

    button.classList.add("active");

    if (type === "harian") {
        loadRekapHarian();
    }

    if (type === "bulanan") {
        loadRekapBulanan();
    }

    if (type === "tahunan") {
        loadRekapTahunan();
    }
}









/* =========================
   REKAP HARIAN
========================= */

async function loadRekapHarian() {

    const content =
        document.getElementById("rekapContent");

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    content.innerHTML = `

    <div class="table-container">

        <div class="filter-row">

            <input
                type="date"
                id="tanggalRekap"
                value="${today}">

            <button
                class="btn-primary"
                onclick="loadRekapHarianData()">
                Tampilkan
            </button>

        </div>

        <div
            id="rekapSummary"
            class="stats">
        </div>

        <table>

            <thead>

                <tr>

                    <th>No</th>
                    <th>Nama</th>
                    <th>Kelas</th>
                    <th>Status</th>
                    <th>Metode</th>

                </tr>

            </thead>

            <tbody id="rekapTable">

            </tbody>

        </table>

    </div>

    `;

    loadRekapHarianData();
}

async function loadRekapHarianData() {

    const tanggal =
        document.getElementById(
            "tanggalRekap"
        ).value;

    const { data, error } =
        await supabaseClient
            .from("absensi")
            .select(`
                status,
                metode,
                siswa(
                    nama,
                    kelas(
                        nama_kelas
                    )
                )
            `)
            .eq("tanggal", tanggal);

    if (error) {

        console.error(error);

        return;
    }

    renderRekapHarian(data);
}

function renderRekapHarian(data) {

    const tbody =
        document.getElementById(
            "rekapTable"
        );

    const summary =
        document.getElementById(
            "rekapSummary"
        );

    tbody.innerHTML = "";

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    data.forEach((item, index) => {

        if (item.status === "Hadir") hadir++;
        if (item.status === "Sakit") sakit++;
        if (item.status === "Izin") izin++;
        if (item.status === "Alpa") alpa++;

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.siswa?.nama || '-'}</td>

            <td>${item.siswa?.kelas?.nama_kelas || '-'}</td>

            <td>${item.status}</td>

            <td>${item.metode || '-'}</td>

        </tr>

        `;
    });

    summary.innerHTML = `

    <div class="card">
        <h3>Hadir</h3>
        <p>${hadir}</p>
    </div>

    <div class="card">
        <h3>Sakit</h3>
        <p>${sakit}</p>
    </div>

    <div class="card">
        <h3>Izin</h3>
        <p>${izin}</p>
    </div>

    <div class="card">
        <h3>Alpa</h3>
        <p>${alpa}</p>
    </div>

    `;
}










/* =========================
   REKAP BULANAN
========================= */

async function loadRekapBulanan() {

    const content =
        document.getElementById(
            "rekapContent"
        );

    content.innerHTML = `

    <div class="table-container">

        <div class="filter-row">

            <select id="bulanRekap">

                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>

            </select>

            <input
                type="number"
                id="tahunBulanan"
                value="${new Date().getFullYear()}">

            <button
                class="btn-primary">
                Tampilkan
            </button>

        </div>

        <div class="empty-state">

            Rekap Bulanan akan dibuat pada tahap berikutnya

        </div>

    </div>

    `;
}










/* =========================
   REKAP TAHUNAN
========================= */

async function loadRekapTahunan() {

    const content =
        document.getElementById(
            "rekapContent"
        );

    content.innerHTML = `

    <div class="table-container">

        <div class="filter-row">

            <input
                type="number"
                id="tahunTahunan"
                value="${new Date().getFullYear()}">

            <button
                class="btn-primary">
                Tampilkan
            </button>

        </div>

        <div class="empty-state">

            Rekap Tahunan akan dibuat pada tahap berikutnya

        </div>

    </div>

    `;
}
