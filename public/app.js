const API_BASE_URL = window.location.origin;
const WEATHER_REFRESH_MS = 300000;
const VARIETY_STORAGE_KEY  = 'pantaupadi:varietyId';
const PROVINCE_STORAGE_KEY = 'pantaupadi:provinceId';
const CITY_STORAGE_KEY     = 'pantaupadi:cityName';
const PLANT_DATE_STORAGE_KEY = 'pantaupadi:plantDate';
const DEFAULT_PANEN_HST = 100; // varietas umur sedang ±120 HSS, pindah tanam umur ±21 hari

// ── Location Data ─────────────────────────────────────────────────────────────
const PROVINCES = [
  {
    id: 'kalbar',
    name: 'Kalimantan Barat',
    cities: [
      { name: 'Kota Pontianak',    lat: -0.0263, lon: 109.3425 },
      { name: 'Kota Singkawang',   lat:  0.9027, lon: 108.9776 },
      { name: 'Kab. Mempawah',     lat: -0.3667, lon: 108.9833 },
      { name: 'Kab. Sambas',       lat:  1.3667, lon: 109.3000 },
      { name: 'Kab. Bengkayang',   lat:  0.7333, lon: 109.3333 },
      { name: 'Kab. Landak',       lat:  0.3511, lon: 109.9682 },
      { name: 'Kab. Sanggau',      lat:  0.1300, lon: 110.5978 },
      { name: 'Kab. Sekadau',      lat: -0.0333, lon: 110.9500 },
      { name: 'Kab. Sintang',      lat:  0.0667, lon: 111.5000 },
      { name: 'Kab. Melawi',       lat: -0.5000, lon: 111.4667 },
      { name: 'Kab. Kapuas Hulu',  lat:  0.8667, lon: 113.9333 },
      { name: 'Kab. Ketapang',     lat: -1.8500, lon: 109.9833 },
      { name: 'Kab. Kayong Utara', lat: -1.0667, lon: 109.7333 },
      { name: 'Kab. Kubu Raya',    lat: -0.2667, lon: 109.5333 },
    ],
  },
  {
    id: 'kalteng',
    name: 'Kalimantan Tengah',
    cities: [
      { name: 'Kota Palangka Raya',              lat: -2.2070, lon: 113.9167 },
      { name: 'Kab. Kotawaringin Barat',         lat: -2.6833, lon: 111.6167 },
      { name: 'Kab. Kotawaringin Timur',         lat: -2.5333, lon: 112.9500 },
      { name: 'Kab. Kapuas',                     lat: -3.0067, lon: 114.3344 },
      { name: 'Kab. Barito Selatan',             lat: -1.7333, lon: 114.8333 },
      { name: 'Kab. Barito Utara',               lat: -0.9500, lon: 114.8833 },
      { name: 'Kab. Katingan',                   lat: -1.8667, lon: 113.4333 },
      { name: 'Kab. Seruyan',                    lat: -3.0833, lon: 112.5167 },
      { name: 'Kab. Sukamara',                   lat: -2.6833, lon: 111.0500 },
      { name: 'Kab. Lamandau',                   lat: -1.8333, lon: 111.2333 },
      { name: 'Kab. Gunung Mas',                 lat: -1.2667, lon: 113.8667 },
      { name: 'Kab. Pulang Pisau',               lat: -3.0000, lon: 114.0833 },
      { name: 'Kab. Murung Raya',                lat: -0.8667, lon: 114.9000 },
      { name: 'Kab. Barito Timur',               lat: -1.7833, lon: 115.2167 },
    ],
  },
  {
    id: 'kalsel',
    name: 'Kalimantan Selatan',
    cities: [
      { name: 'Kota Banjarmasin',           lat: -3.3186, lon: 114.5944 },
      { name: 'Kota Banjarbaru',            lat: -3.4429, lon: 114.8277 },
      { name: 'Kab. Banjar',               lat: -3.4167, lon: 114.8583 },
      { name: 'Kab. Barito Kuala',         lat: -3.0000, lon: 114.7500 },
      { name: 'Kab. Tapin',                lat: -2.9000, lon: 115.0000 },
      { name: 'Kab. Hulu Sungai Selatan',  lat: -2.7833, lon: 115.2667 },
      { name: 'Kab. Hulu Sungai Tengah',   lat: -2.5500, lon: 115.4000 },
      { name: 'Kab. Hulu Sungai Utara',    lat: -2.4167, lon: 115.2500 },
      { name: 'Kab. Tabalong',             lat: -2.1667, lon: 115.4167 },
      { name: 'Kab. Tanah Laut',           lat: -3.8167, lon: 115.0167 },
      { name: 'Kab. Tanah Bumbu',          lat: -3.4667, lon: 115.9667 },
      { name: 'Kab. Kotabaru',             lat: -3.2927, lon: 116.2226 },
      { name: 'Kab. Balangan',             lat: -2.3500, lon: 115.4500 },
    ],
  },
  {
    id: 'kaltim',
    name: 'Kalimantan Timur',
    cities: [
      { name: 'Kota Samarinda',              lat: -0.5017, lon: 117.1536 },
      { name: 'Kota Balikpapan',             lat: -1.2675, lon: 116.8289 },
      { name: 'Kota Bontang',               lat:  0.1328, lon: 117.5000 },
      { name: 'Kab. Kutai Kartanegara',     lat: -0.4083, lon: 117.0064 },
      { name: 'Kab. Kutai Barat',           lat: -0.1167, lon: 115.5833 },
      { name: 'Kab. Kutai Timur',           lat:  0.5003, lon: 117.6267 },
      { name: 'Kab. Berau',                 lat:  2.1557, lon: 117.4852 },
      { name: 'Kab. Paser',                 lat: -1.8333, lon: 116.0500 },
      { name: 'Kab. Penajam Paser Utara',   lat: -1.3833, lon: 116.1833 },
      { name: 'Kab. Mahakam Ulu',           lat:  0.6667, lon: 115.6000 },
    ],
  },
  {
    id: 'kalut',
    name: 'Kalimantan Utara',
    cities: [
      { name: 'Kota Tarakan',        lat:  3.3172, lon: 117.5831 },
      { name: 'Kab. Bulungan',       lat:  2.8333, lon: 117.3667 },
      { name: 'Kab. Malinau',        lat:  3.5833, lon: 116.6333 },
      { name: 'Kab. Nunukan',        lat:  4.1430, lon: 117.6683 },
      { name: 'Kab. Tana Tidung',    lat:  3.3833, lon: 117.2500 },
    ],
  },
  {
    id: 'dki',
    name: 'DKI Jakarta',
    cities: [
      { name: 'Kota Jakarta Pusat',    lat: -6.1862, lon: 106.8063 },
      { name: 'Kota Jakarta Utara',    lat: -6.1207, lon: 106.9003 },
      { name: 'Kota Jakarta Barat',    lat: -6.1676, lon: 106.7627 },
      { name: 'Kota Jakarta Selatan',  lat: -6.2615, lon: 106.8106 },
      { name: 'Kota Jakarta Timur',    lat: -6.2250, lon: 106.9004 },
      { name: 'Kab. Kepulauan Seribu', lat: -5.8500, lon: 106.5167 },
    ],
  },
  {
    id: 'banten',
    name: 'Banten',
    cities: [
      { name: 'Kota Serang',             lat: -6.1202, lon: 106.1503 },
      { name: 'Kota Tangerang',          lat: -6.1781, lon: 106.6297 },
      { name: 'Kota Tangerang Selatan',  lat: -6.2903, lon: 106.7172 },
      { name: 'Kota Cilegon',            lat: -6.0020, lon: 106.0006 },
      { name: 'Kab. Serang',             lat: -6.2833, lon: 106.1167 },
      { name: 'Kab. Tangerang',          lat: -6.3023, lon: 106.5033 },
      { name: 'Kab. Lebak',             lat: -6.3667, lon: 106.2500 },
      { name: 'Kab. Pandeglang',         lat: -6.3083, lon: 106.1067 },
    ],
  },
  {
    id: 'jabar',
    name: 'Jawa Barat',
    cities: [
      { name: 'Kota Bandung',          lat: -6.9175, lon: 107.6191 },
      { name: 'Kota Bekasi',           lat: -6.2383, lon: 106.9756 },
      { name: 'Kota Bogor',            lat: -6.5971, lon: 106.8060 },
      { name: 'Kota Cimahi',           lat: -6.8728, lon: 107.5421 },
      { name: 'Kota Cirebon',          lat: -6.7063, lon: 108.5571 },
      { name: 'Kota Depok',            lat: -6.3851, lon: 106.8247 },
      { name: 'Kota Sukabumi',         lat: -6.9167, lon: 106.9283 },
      { name: 'Kota Tasikmalaya',      lat: -7.3506, lon: 108.2095 },
      { name: 'Kota Banjar',           lat: -7.3686, lon: 108.5394 },
      { name: 'Kab. Bandung',          lat: -7.0333, lon: 107.5167 },
      { name: 'Kab. Bandung Barat',    lat: -6.8500, lon: 107.4833 },
      { name: 'Kab. Bekasi',           lat: -6.3167, lon: 107.1000 },
      { name: 'Kab. Bogor',            lat: -6.4783, lon: 106.8628 },
      { name: 'Kab. Ciamis',           lat: -7.3286, lon: 108.3524 },
      { name: 'Kab. Cianjur',          lat: -6.8209, lon: 107.1386 },
      { name: 'Kab. Cirebon',          lat: -6.7500, lon: 108.4833 },
      { name: 'Kab. Garut',            lat: -7.2167, lon: 107.9063 },
      { name: 'Kab. Indramayu',        lat: -6.3267, lon: 108.3191 },
      { name: 'Kab. Karawang',         lat: -6.3167, lon: 107.3333 },
      { name: 'Kab. Kuningan',         lat: -6.9760, lon: 108.4839 },
      { name: 'Kab. Majalengka',       lat: -6.8333, lon: 108.2333 },
      { name: 'Kab. Pangandaran',      lat: -7.6833, lon: 108.5000 },
      { name: 'Kab. Purwakarta',       lat: -6.5567, lon: 107.4429 },
      { name: 'Kab. Subang',           lat: -6.5667, lon: 107.7667 },
      { name: 'Kab. Sukabumi',         lat: -6.9833, lon: 106.5500 },
      { name: 'Kab. Sumedang',         lat: -6.8567, lon: 107.9219 },
      { name: 'Kab. Tasikmalaya',      lat: -7.3500, lon: 108.1000 },
    ],
  },
  {
    id: 'jateng',
    name: 'Jawa Tengah',
    cities: [
      { name: 'Kota Semarang',      lat: -6.9932, lon: 110.4203 },
      { name: 'Kota Surakarta',     lat: -7.5561, lon: 110.8316 },
      { name: 'Kota Salatiga',      lat: -7.3305, lon: 110.5084 },
      { name: 'Kota Pekalongan',    lat: -6.8885, lon: 109.6752 },
      { name: 'Kota Tegal',         lat: -6.8694, lon: 109.1402 },
      { name: 'Kota Magelang',      lat: -7.4798, lon: 110.2179 },
      { name: 'Kab. Banjarnegara',  lat: -7.3833, lon: 109.6833 },
      { name: 'Kab. Banyumas',      lat: -7.4167, lon: 109.2333 },
      { name: 'Kab. Batang',        lat: -6.9167, lon: 109.7333 },
      { name: 'Kab. Blora',         lat: -6.9667, lon: 111.4167 },
      { name: 'Kab. Boyolali',      lat: -7.5333, lon: 110.5833 },
      { name: 'Kab. Brebes',        lat: -6.8717, lon: 108.9271 },
      { name: 'Kab. Cilacap',       lat: -7.7333, lon: 109.0167 },
      { name: 'Kab. Demak',         lat: -6.8933, lon: 110.6434 },
      { name: 'Kab. Grobogan',      lat: -7.1033, lon: 110.9178 },
      { name: 'Kab. Jepara',        lat: -6.5833, lon: 110.6667 },
      { name: 'Kab. Karanganyar',   lat: -7.6000, lon: 111.0167 },
      { name: 'Kab. Kebumen',       lat: -7.6667, lon: 109.6500 },
      { name: 'Kab. Kendal',        lat: -6.9233, lon: 110.1972 },
      { name: 'Kab. Klaten',        lat: -7.7000, lon: 110.6000 },
      { name: 'Kab. Kudus',         lat: -6.8050, lon: 110.8367 },
      { name: 'Kab. Magelang',      lat: -7.5833, lon: 110.2167 },
      { name: 'Kab. Pati',          lat: -6.7500, lon: 111.0333 },
      { name: 'Kab. Pekalongan',    lat: -6.9833, lon: 109.6333 },
      { name: 'Kab. Pemalang',      lat: -6.8939, lon: 109.3760 },
      { name: 'Kab. Purbalingga',   lat: -7.3833, lon: 109.3667 },
      { name: 'Kab. Purworejo',     lat: -7.7167, lon: 110.0167 },
      { name: 'Kab. Rembang',       lat: -6.7167, lon: 111.3500 },
      { name: 'Kab. Semarang',      lat: -7.1333, lon: 110.4000 },
      { name: 'Kab. Sragen',        lat: -7.4167, lon: 111.0333 },
      { name: 'Kab. Sukoharjo',     lat: -7.6833, lon: 110.8333 },
      { name: 'Kab. Tegal',         lat: -6.9833, lon: 109.1333 },
      { name: 'Kab. Temanggung',    lat: -7.3167, lon: 110.1833 },
      { name: 'Kab. Wonogiri',      lat: -7.8167, lon: 111.0167 },
      { name: 'Kab. Wonosobo',      lat: -7.3667, lon: 109.9000 },
    ],
  },
  {
    id: 'diy',
    name: 'DI Yogyakarta',
    cities: [
      { name: 'Kota Yogyakarta',    lat: -7.7971, lon: 110.3688 },
      { name: 'Kab. Bantul',        lat: -7.8883, lon: 110.3283 },
      { name: 'Kab. Gunungkidul',   lat: -7.9667, lon: 110.5833 },
      { name: 'Kab. Kulon Progo',   lat: -7.8833, lon: 110.1667 },
      { name: 'Kab. Sleman',        lat: -7.7167, lon: 110.3667 },
    ],
  },
  {
    id: 'jatim',
    name: 'Jawa Timur',
    cities: [
      { name: 'Kota Surabaya',      lat: -7.2575, lon: 112.7521 },
      { name: 'Kota Malang',        lat: -7.9666, lon: 112.6326 },
      { name: 'Kota Blitar',        lat: -8.0957, lon: 112.1688 },
      { name: 'Kota Kediri',        lat: -7.8157, lon: 112.0115 },
      { name: 'Kota Madiun',        lat: -7.6299, lon: 111.5217 },
      { name: 'Kota Mojokerto',     lat: -7.4714, lon: 111.4246 },
      { name: 'Kota Pasuruan',      lat: -7.6448, lon: 112.9062 },
      { name: 'Kota Probolinggo',   lat: -7.7543, lon: 113.2158 },
      { name: 'Kota Batu',          lat: -7.8688, lon: 112.5267 },
      { name: 'Kab. Bangkalan',     lat: -6.9069, lon: 112.7302 },
      { name: 'Kab. Banyuwangi',    lat: -8.2196, lon: 114.3691 },
      { name: 'Kab. Blitar',        lat: -8.1000, lon: 112.1667 },
      { name: 'Kab. Bojonegoro',    lat: -7.1500, lon: 111.8833 },
      { name: 'Kab. Bondowoso',     lat: -7.9167, lon: 113.8333 },
      { name: 'Kab. Gresik',        lat: -7.1500, lon: 112.6500 },
      { name: 'Kab. Jember',        lat: -8.1725, lon: 113.7004 },
      { name: 'Kab. Jombang',       lat: -7.5500, lon: 112.2167 },
      { name: 'Kab. Kediri',        lat: -7.8167, lon: 112.0000 },
      { name: 'Kab. Lamongan',      lat: -7.1167, lon: 112.4167 },
      { name: 'Kab. Lumajang',      lat: -8.1333, lon: 113.2167 },
      { name: 'Kab. Madiun',        lat: -7.6500, lon: 111.4667 },
      { name: 'Kab. Magetan',       lat: -7.6500, lon: 111.3333 },
      { name: 'Kab. Malang',        lat: -8.1167, lon: 112.5667 },
      { name: 'Kab. Mojokerto',     lat: -7.5000, lon: 111.5333 },
      { name: 'Kab. Nganjuk',       lat: -7.6000, lon: 111.9000 },
      { name: 'Kab. Ngawi',         lat: -7.4000, lon: 111.4500 },
      { name: 'Kab. Pacitan',       lat: -8.1833, lon: 111.1000 },
      { name: 'Kab. Pamekasan',     lat: -7.1571, lon: 113.4768 },
      { name: 'Kab. Pasuruan',      lat: -7.6000, lon: 112.7833 },
      { name: 'Kab. Ponorogo',      lat: -7.8667, lon: 111.4667 },
      { name: 'Kab. Probolinggo',   lat: -7.7500, lon: 113.4167 },
      { name: 'Kab. Sampang',       lat: -7.1879, lon: 113.2460 },
      { name: 'Kab. Sidoarjo',      lat: -7.4500, lon: 112.7167 },
      { name: 'Kab. Situbondo',     lat: -7.7060, lon: 114.0028 },
      { name: 'Kab. Sumenep',       lat: -6.9928, lon: 113.8600 },
      { name: 'Kab. Trenggalek',    lat: -8.0583, lon: 111.7083 },
      { name: 'Kab. Tuban',         lat: -6.9000, lon: 112.0500 },
      { name: 'Kab. Tulungagung',   lat: -8.0667, lon: 111.9000 },
    ],
  },
];

// ── Varietas Padi (sumber: Deskripsi VUB Padi BB Padi/Balitbangtan 2015) ─────
// Skala SES IRRI 2014: R=Tahan, AT=Agak Tahan, AR=Agak Rentan, RN=Rentan, SR=Sangat Rentan, null=tidak diuji
// hdb: reaksi patotipe III (dominan Indonesia). blas: reaksi ras 033 (dominan diuji).
// wereng: reaksi WBC biotipe gabungan; bercak: tidak ada data genetik di sumber rujukan.
const RICE_VARIETIES = [
  { id: 'umum',             name: 'Umum / Tidak tahu',           group: 'default',     hdb: null, blas: null, wereng: null, bercak: null, note: '' },
  // Tabel 1 — rekomendasi tanam Kalbar
  { id: 'inpari32hdb',      name: 'Inpari 32 HDB (2013)',         group: 'rekomendasi', hdb: 'R',  blas: 'R',  wereng: 'AR', bercak: null, note: 'Unggulan Kalbar: tahan HDB-III + blas-033. Potensi 8,42 t/ha.' },
  { id: 'inpari36',         name: 'Inpari 36 Lanrang (2015)',     group: 'rekomendasi', hdb: 'RN', blas: 'R',  wereng: null, bercak: null, note: 'Pilihan jika tekanan blas dominan. Rentan HDB-III & VIII.' },
  { id: 'inpari37',         name: 'Inpari 37 Lanrang (2015)',     group: 'rekomendasi', hdb: 'AT', blas: 'AT', wereng: 'AR', bercak: null, note: 'Cocok HDB campuran; agak rentan WBC biotipe 1-2, rentan biotipe 3.' },
  { id: 'inpara2',          name: 'Inpara 2 (2008) — rawa',       group: 'rekomendasi', hdb: 'R',  blas: 'R',  wereng: null, bercak: null, note: 'Padi rawa/pasang surut: tahan HDB-III + tahan blas (ras tidak dispesifikasi*); toleran Fe/Al.' },
  { id: 'inpara3',          name: 'Inpara 3 (2009) — rawa',       group: 'rekomendasi', hdb: 'RN', blas: null, wereng: null, bercak: null, note: 'JANGAN ditanam di lahan endemis HDB Kalbar (Sambas, Kubu Raya, Sanggau, Kayong Utara). Toleran rendaman 6 hari.' },
  { id: 'situbagendit',     name: 'Situ Bagendit (2003) — amfibi',group: 'rekomendasi', hdb: 'AT', blas: 'AT', wereng: 'RN', bercak: null, note: 'Amfibi (sawah & gogo). Label "agak tahan" PATAH bila N berlebih (kasus Jember KP 40,25%).' },
  // Tabel 1B — varietas tambahan populer/dianjurkan di Kalimantan Barat
  { id: 'cakrabuana',       name: 'Cakrabuana Agritan (2018)',    group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: 'AT', bercak: null, panenHst: 78, note: 'Super genjah 104 HSS (panen 75–80 HST). Potensi 10,2 t/ha. Agak tahan WBC 1-2-3. Hindari lahan endemis HDB IV/VIII.' },
  { id: 'padjadjaran',      name: 'Padjadjaran Agritan (2018)',   group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: 'AT', bercak: null, panenHst: 84, note: 'Potensi 11,0 t/ha; genjah 105 HSS. Agak tahan WBC 1-2. Hindari lahan endemis HDB IV/VIII.' },
  { id: 'inpari49jembar',   name: 'Inpari 49 Jembar (2021)',      group: 'rekomendasi', hdb: 'R',  blas: 'R',  wereng: 'R',  bercak: null, note: 'Pasangan rotasi Inpari 32 HDB. Tahan HDB-III (gen IRBB50) + WBC 1-2-3. Potensi 9,57 t/ha.' },
  { id: 'baroma',           name: 'Baroma (2019)',                 group: 'rekomendasi', hdb: 'AT', blas: 'AT', wereng: 'AR', bercak: null, note: 'Beras basmati aromatik. Tahan HDB IV & VIII; agak tahan HDB-III. Sudah dipanen DTPH Kalbar. Segmen premium.' },
  { id: 'inparinutrizinc',  name: 'Inpari IR Nutri Zinc (2019)',  group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: null, bercak: null, note: 'Biofortifikasi anti-stunting (Zn 29–34 ppm). Rentan HDB IV & VIII — rotasi wajib tiap musim dengan varietas tahan HDB.' },
  { id: 'inpago13fortiz',   name: 'Inpago 13 Fortiz (~2021)',     group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: null, bercak: null, note: 'Padi gogo lahan kering masam (PMK). Zn 34 ppm + protein 9,83%. Rentan HDB IV & VIII. Cocok Bengkayang/Landak/Sintang.' },
  // Tabel 2 — referensi/kontrol
  { id: 'ciherang',         name: 'Ciherang (2000) — referensi',  group: 'referensi',   hdb: 'R',  blas: null, wereng: null, bercak: null, note: 'Tahan HDB-III; rentan IV & VIII. Tidak ada SK khusus untuk blas.' },
  { id: 'ir64',             name: 'IR64 — kontrol tahan',          group: 'referensi',   hdb: 'AT', blas: 'R',  wereng: null, bercak: null, note: 'Kontrol tahan internasional. Agak tahan HDB.' },
  { id: 'mekongga',         name: 'Mekongga (2004) — referensi',   group: 'referensi',   hdb: 'AT', blas: 'R',  wereng: null, bercak: null, note: 'Agak tahan HDB strain IV; tahan blas.' },
  { id: 'inpari1',          name: 'Inpari 1 (2008) — referensi',   group: 'referensi',   hdb: 'R',  blas: null, wereng: null, bercak: null, note: 'Tahan HDB strain III, IV, & VIII.' },
  { id: 'inpari6',          name: 'Inpari 6 Jete (2008) — ref.',   group: 'referensi',   hdb: 'R',  blas: null, wereng: null, bercak: null, note: 'Tahan HDB strain III, IV, & VIII.' },
  { id: 'inpari30',         name: 'Inpari 30 Ciherang Sub 1',      group: 'referensi',   hdb: 'R',  blas: null, wereng: null, bercak: null, note: 'Kontrol tahan HDB; toleran rendaman.' },
  { id: 'inpari48blas',     name: 'Inpari 48 Blas (2020)',         group: 'referensi',   hdb: 'RN', blas: 'R',  wereng: null, bercak: null, note: 'Diintroduksi BPTP Kalbar Sambas 2022 (6,35 t/ha). Untuk tekanan blas berat — rentan HDB.' },
  { id: 'inpari42gsr',      name: 'Inpari 42 Agritan GSR (2016)',  group: 'referensi',   hdb: 'R',  blas: 'R',  wereng: 'R',  bercak: null, note: 'Green Super Rice. Diuji di Sambas Kalbar (~6 t/ha). Tahan HDB fase generatif; toleran kekeringan & wereng.' },
  { id: 'inpari43gsr',      name: 'Inpari 43 Agritan GSR (2016)',  group: 'referensi',   hdb: 'AT', blas: 'AT', wereng: null, bercak: null, note: 'Direkomendasikan lahan endemis HDB + blas 0–600 mdpl. Potensi 9,02 t/ha. Toleran kekeringan.' },
  { id: 'inpago9',          name: 'Inpago 9 (2012) — gogo',        group: 'referensi',   hdb: 'AT', blas: 'R',  wereng: 'AT', bercak: null, note: 'Padi gogo lahan kering PMK Kalimantan. Potensi 5,2 t/ha. Agak tahan WBC biotipe 1.' },
  { id: 'tn1',              name: 'TN1 — kontrol rentan',          group: 'referensi',   hdb: 'SR', blas: 'SR', wereng: 'SR', bercak: null, note: 'Standar IRRI sebagai cek rentan. JANGAN dibudidayakan komersial.' },
];

// State
let currentProvinceIndex = 0;
let currentCityIndex = 0;
let currentVarietyId = 'umum';
let currentPlantDate = null;  // 'YYYY-MM-DD' tanggal pindah tanam, disimpan di perangkat
let lastWeatherUpdate = 0;
let lastData = null;          // respons /api/weather terakhir
let lastDiseases = null;      // hasil calculateDiseaseRisks terakhir
let currentForecastDisease = 'all';
let currentWeatherTab = 'rh';
let weatherTimer = null;

// ── Utilities ────────────────────────────────────────────────────────────────

function clearChildren(el) { while (el.firstChild) el.removeChild(el.firstChild); }

function mk(tag, cls, txt) {
  const e = document.createElement(tag);
  e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  return e;
}

function getCurrentCity() {
  return PROVINCES[currentProvinceIndex].cities[currentCityIndex];
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Location Persistence ─────────────────────────────────────────────────────

function restoreLocation() {
  try {
    const savedProvId   = localStorage.getItem(PROVINCE_STORAGE_KEY);
    const savedCityName = localStorage.getItem(CITY_STORAGE_KEY);
    if (!savedProvId) return;
    const pi = PROVINCES.findIndex(p => p.id === savedProvId);
    if (pi < 0) return;
    currentProvinceIndex = pi;
    if (savedCityName) {
      const ci = PROVINCES[pi].cities.findIndex(c => c.name === savedCityName);
      if (ci >= 0) currentCityIndex = ci;
    }
  } catch (_) {}
}

function saveLocation() {
  try {
    localStorage.setItem(PROVINCE_STORAGE_KEY, PROVINCES[currentProvinceIndex].id);
    localStorage.setItem(CITY_STORAGE_KEY, PROVINCES[currentProvinceIndex].cities[currentCityIndex].name);
  } catch (_) {}
}

function getCurrentVariety() {
  return RICE_VARIETIES.find(v => v.id === currentVarietyId) || RICE_VARIETIES[0];
}

// reaction → label singkat untuk badge card
const REACTION_LABEL = { R: 'Tahan', AT: 'Agak Tahan', AR: 'Agak Rentan', RN: 'Rentan', SR: 'Sangat Rentan' };

// Adaptive modifier: jika cuaca menekan keras, ketahanan label "tidak sepenuhnya menolong"
function adaptiveModifier(reaction, isExtremePressure) {
  if (!reaction) return 0;
  switch (reaction) {
    case 'R':  return isExtremePressure ? -1 : -2;
    case 'AT': return isExtremePressure ?  0 : -1;
    case 'AR': return isExtremePressure ? +2 : +1;
    case 'RN': return +2;
    case 'SR': return +2;
    default:   return 0;
  }
}

// Tekanan cuaca ekstrem per penyakit — gunakan threshold di atas ambang "TINGGI" eksisting
function isExtremePressure(diseaseId, ctx) {
  const { suhu, rh, hujan7hari, cum } = ctx;
  switch (diseaseId) {
    case 'blast':
      return (cum?.blast_favorable_days >= 4)
          || (cum?.max_consec_humid_hours >= 14)
          || (rh >= 88 && hujan7hari >= 40);
    case 'hdb':
      return (cum?.hdb_rain_hours_7d >= 20 && cum?.rh85_hours_72h >= 25)
          || (rh >= 88 && hujan7hari >= 40);
    case 'wereng':
      return (cum?.warm_humid_hours_7d >= 100)
          || (rh >= 88 && suhu >= 24 && suhu <= 30 && hujan7hari >= 10 && hujan7hari <= 30);
    case 'bercak':
      return (cum?.humid80_days >= 4 && hujan7hari >= 25);
    default: return false;
  }
}

const LEVEL_TO_NUM = { TINGGI: 3, SEDANG: 2, RENDAH: 1 };
const NUM_TO_LEVEL = { 3: 'TINGGI', 2: 'SEDANG', 1: 'RENDAH' };
const LEVEL_STYLE  = {
  TINGGI: { icon: '🚨', cls: 'bg-red-50 border-red-300 text-red-700' },
  SEDANG: { icon: '⚠️', cls: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  RENDAH: { icon: '✅', cls: 'bg-green-50 border-green-300 text-green-700' },
};

function diseaseReactionKey(diseaseId) {
  switch (diseaseId) {
    case 'blast':  return 'blas';
    case 'hdb':    return 'hdb';
    case 'wereng': return 'wereng';
    case 'bercak': return 'bercak';
    default: return null;
  }
}

function diseaseReactionTag(diseaseId) {
  switch (diseaseId) {
    case 'blast':  return 'blas-033';
    case 'hdb':    return 'HDB patotipe III';
    case 'wereng': return 'WBC';
    case 'bercak': return 'bercak coklat';
    default: return '';
  }
}

// Terapkan modifier varietas ke disease object hasil base cuaca
function applyVarietyToDisease(disease, ctx) {
  disease.baseLevel = disease.level;
  const variety  = getCurrentVariety();
  if (variety.id === 'umum') return disease;

  const reactKey = diseaseReactionKey(disease.id);
  const reaction = reactKey ? variety[reactKey] : null;
  disease.reaction = reaction;
  if (!reaction) {
    disease.detail = `${disease.detail} · ${variety.name.split(' ')[0]} ${variety.name.split(' ')[1] || ''}: data ${diseaseReactionTag(disease.id)} tidak diuji`;
    return disease;
  }

  const extreme  = isExtremePressure(disease.id, ctx);
  disease.extreme = extreme;
  const mod      = adaptiveModifier(reaction, extreme);
  const baseNum  = LEVEL_TO_NUM[disease.level] || 1;
  const finalNum = Math.max(1, Math.min(3, baseNum + mod));
  const finalLvl = NUM_TO_LEVEL[finalNum];

  const arrow = mod < 0 ? '↓' : mod > 0 ? '↑' : '·';
  const shortName = variety.name.split(' (')[0];
  disease.detail = `${disease.detail} ${arrow} ${shortName}: ${REACTION_LABEL[reaction]} ${diseaseReactionTag(disease.id)}${extreme ? ' (tekanan ekstrem)' : ''}`;

  if (finalLvl !== disease.level) {
    const style    = LEVEL_STYLE[finalLvl];
    disease.level  = finalLvl;
    disease.icon   = style.icon;
    disease.cls    = style.cls;
  }
  return disease;
}

// ── Fase tanaman ─────────────────────────────────────────────────────────────

// Batas fase dihitung mundur dari umur panen P (HST): fase generatif relatif tetap
// panjangnya, yang memendek pada varietas genjah adalah fase anakan.
const PHASE_DEFS = [
  { id: 'anakan',   name: 'Anakan',    short: 'Anakan',  back: null, color: '#CFE6D6',
    note: 'Tanaman membentuk anakan. Rawan kresek dan blast daun bila lembab.' },
  { id: 'bunting',  name: 'Bunting',   short: 'Bunting', back: 65,   color: '#6FB38A',
    note: 'Malai mulai terbentuk. Ini masa rawan blast leher dimulai, hindari tambahan urea.' },
  { id: 'berbunga', name: 'Berbunga',  short: 'Bunga',   back: 45,   color: '#E2B84B',
    note: 'Masa paling kritis. Serangan sekarang langsung membuat gabah hampa.' },
  { id: 'masak',    name: 'Pemasakan', short: 'Masak',   back: 30,   color: '#B98B3E',
    note: 'Gabah mengisi dan menguning. Siapkan pengeringan petak menjelang panen.' },
];

// Kerentanan per fase (urutan PHASE_DEFS): 0 rendah, 1 sedang, 2 tinggi.
// Tinggi menaikkan level satu tingkat bila cuaca sudah ≥ sedang; rendah menurunkan satu tingkat.
const PHASE_VULN = {
  blast:  [1, 2, 2, 0],
  hdb:    [2, 1, 1, 0],
  wereng: [0, 2, 2, 1],
  bercak: [0, 1, 1, 1],
};
const PHASE_VULN_TEXT = {
  blast:  ['Blast daun bisa muncul saat lembab panjang.', 'Masuk masa rawan blast leher. Jaga pupuk N, amati daun bendera.', 'Puncak rawan blast leher. Malai bisa patah dan hampa.', ''],
  hdb:    ['Rawan kresek pada tanaman muda, terutama setelah hujan angin.', 'Hawar bisa naik ke daun atas setelah hujan berangin.', 'Hawar pada daun bendera menurunkan pengisian gabah.', ''],
  wereng: ['', 'Populasi bisa melonjak. Cek pangkal rumpun tiap minggu.', 'Populasi tinggi berisiko puso. Cek pangkal rumpun tiap minggu.', 'Waspada puso menjelang panen bila populasi masih tinggi.'],
  bercak: ['', 'Bercak daun lebih berat bila tanaman kurang kalium.', 'Bercak bisa menyerang gabah dan menurunkan mutu.', 'Noda pada gabah menurunkan mutu beras.'],
};

function panenHst() {
  return getCurrentVariety().panenHst || DEFAULT_PANEN_HST;
}

function phaseBounds(P) {
  return PHASE_DEFS.map((ph, i) => {
    const from = ph.back === null ? 0 : Math.max(0, P - ph.back);
    const next = PHASE_DEFS[i + 1];
    return { ...ph, i, from, to: next ? Math.max(0, P - next.back) : P };
  });
}

// Umur tanaman pada tanggal tertentu. idx = -1 bila belum tanam atau sudah lewat panen.
function cropAgeOn(date) {
  if (!currentPlantDate) return null;
  const P = panenHst();
  const planted = parseDay(currentPlantDate);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const hst = Math.round((day - planted) / 86400000);
  const phases = phaseBounds(P);
  const idx = hst < 0 || hst >= P ? -1 : phases.findIndex(ph => hst >= ph.from && hst < ph.to);
  return { hst, P, planted, phases, idx, phase: idx >= 0 ? phases[idx] : null };
}

function phaseShift(diseaseId, levelNum, date) {
  const age = cropAgeOn(date);
  if (!age || !age.phase) return 0;
  const v = PHASE_VULN[diseaseId][age.idx];
  if (v === 2) return levelNum >= 2 ? 1 : 0;
  if (v === 0) return -1;
  return 0;
}

function applyPhaseToDisease(disease, date) {
  disease.preLevel = disease.level;
  const baseNum = LEVEL_TO_NUM[disease.level] || 1;
  const shift = phaseShift(disease.id, baseNum, date);
  disease.phaseShift = shift;
  if (!shift) return disease;
  const finalLvl = NUM_TO_LEVEL[Math.max(1, Math.min(3, baseNum + shift))];
  if (finalLvl !== disease.level) {
    const style   = LEVEL_STYLE[finalLvl];
    disease.level = finalLvl;
    disease.icon  = style.icon;
    disease.cls   = style.cls;
  }
  return disease;
}

// ── Disease Risk ─────────────────────────────────────────────────────────────

function calculateDiseaseRisks(suhu, rh, hujan7hari, cum, onDate = new Date()) {
  const diseases = [];
  const blastFavDays   = cum?.blast_favorable_days  ?? 0;
  const blastFavHours  = cum?.blast_fav_hours       ?? 0;
  const humid80Days    = cum?.humid80_days           ?? 0;
  const rh85h72        = cum?.rh85_hours_72h         ?? 0;
  const rainHours7d    = cum?.hdb_rain_hours_7d      ?? 0;
  const warmHumidHours = cum?.warm_humid_hours_7d    ?? 0;
  const maxConsec      = cum?.max_consec_humid_hours ?? 0;
  const hasCum         = !!cum;

  // 1. Blast Padi
  if (hasCum) {
    if (blastFavDays >= 3 && hujan7hari >= 20) {
      diseases.push({ id:'blast', name:'Blast Padi', level:'TINGGI', icon:'🚨',
        detail:`${blastFavDays} hari favorable/7hr, hujan ${hujan7hari}mm/7hr`,
        cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (blastFavHours >= 24 || maxConsec >= 10) {
      diseases.push({ id:'blast', name:'Blast Padi', level:'SEDANG', icon:'⚠️',
        detail:`${blastFavHours} jam kumulatif/7hr, maks ${maxConsec} jam berurutan`,
        cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'blast', name:'Blast Padi', level:'RENDAH', icon:'✅',
        detail:`${blastFavHours} jam favorable/7hr`,
        cls:'bg-green-50 border-green-300 text-green-700' });
    }
  } else {
    if (rh >= 85 && suhu >= 24 && suhu <= 28 && hujan7hari >= 20) {
      diseases.push({ id:'blast', name:'Blast Padi', level:'TINGGI', icon:'🚨',
        detail:`RH ${rh}%, suhu ${suhu}°C, hujan ${hujan7hari}mm/7hr`,
        cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (rh >= 80 && suhu >= 23 && suhu <= 30) {
      diseases.push({ id:'blast', name:'Blast Padi', level:'SEDANG', icon:'⚠️',
        detail:`RH ${rh}%, suhu ${suhu}°C`, cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'blast', name:'Blast Padi', level:'RENDAH', icon:'✅',
        detail:'Kondisi tidak mendukung', cls:'bg-green-50 border-green-300 text-green-700' });
    }
  }

  // 2. Bercak Coklat
  if (hasCum) {
    if (humid80Days >= 3 && hujan7hari >= 15) {
      diseases.push({ id:'bercak', name:'Bercak Coklat', level:'SEDANG', icon:'⚠️',
        detail:`${humid80Days} hari RH≥80%/7hr, hujan ${hujan7hari}mm/7hr`,
        cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'bercak', name:'Bercak Coklat', level:'RENDAH', icon:'✅',
        detail:`${humid80Days} hari RH≥80%/7hr`,
        cls:'bg-green-50 border-green-300 text-green-700' });
    }
  } else {
    if (rh >= 85 && suhu >= 25 && suhu <= 35 && hujan7hari >= 15) {
      diseases.push({ id:'bercak', name:'Bercak Coklat', level:'SEDANG', icon:'⚠️',
        detail:`RH ${rh}%, hujan ${hujan7hari}mm/7hr`, cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'bercak', name:'Bercak Coklat', level:'RENDAH', icon:'✅',
        detail:'Kondisi tidak mendukung', cls:'bg-green-50 border-green-300 text-green-700' });
    }
  }

  // 3. Hawar Daun Bakteri
  if (hasCum) {
    if (rainHours7d >= 15 && rh85h72 >= 20) {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'TINGGI', icon:'🚨',
        detail:`${rainHours7d} jam hujan/7hr, ${rh85h72} jam RH≥85%/72hr`,
        cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (rainHours7d >= 8 && rh85h72 >= 10) {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'SEDANG', icon:'⚠️',
        detail:`${rainHours7d} jam hujan/7hr, ${rh85h72} jam RH≥85%/72hr`,
        cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'RENDAH', icon:'✅',
        detail:`${rainHours7d} jam hujan/7hr, ${rh85h72} jam RH≥85%/72hr`,
        cls:'bg-green-50 border-green-300 text-green-700' });
    }
  } else {
    if (rh >= 85 && suhu >= 25 && suhu <= 34 && hujan7hari >= 25) {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'TINGGI', icon:'🚨',
        detail:`RH ${rh}%, hujan ${hujan7hari}mm/7hr`, cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (rh >= 80 && suhu >= 25 && suhu <= 34 && hujan7hari >= 15) {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'SEDANG', icon:'⚠️',
        detail:`RH ${rh}%, hujan ${hujan7hari}mm/7hr`, cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'hdb', name:'Hawar Daun Bakteri', level:'RENDAH', icon:'✅',
        detail:'Kondisi tidak mendukung', cls:'bg-green-50 border-green-300 text-green-700' });
    }
  }

  // 4. Wereng Coklat
  if (hasCum) {
    if (warmHumidHours >= 80 && hujan7hari < 60) {
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'TINGGI', icon:'🚨',
        detail:`${warmHumidHours} jam optimal/7hr, hujan ${hujan7hari}mm/7hr`,
        cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (warmHumidHours >= 40 && hujan7hari < 80) {
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'SEDANG', icon:'⚠️',
        detail:`${warmHumidHours} jam optimal/7hr`, cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      const suppress = hujan7hari >= 80 ? `, ditekan hujan lebat (${hujan7hari}mm/7hr)` : '';
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'RENDAH', icon:'✅',
        detail:`${warmHumidHours} jam optimal/7hr${suppress}`,
        cls:'bg-green-50 border-green-300 text-green-700' });
    }
  } else {
    if (rh >= 85 && suhu >= 22 && suhu <= 30 && hujan7hari >= 5 && hujan7hari <= 35) {
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'TINGGI', icon:'🚨',
        detail:`RH ${rh}%, suhu ${suhu}°C`, cls:'bg-red-50 border-red-300 text-red-700' });
    } else if (rh >= 78 && suhu >= 22 && suhu <= 32 && hujan7hari < 40) {
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'SEDANG', icon:'⚠️',
        detail:`RH ${rh}%, suhu ${suhu}°C`, cls:'bg-yellow-50 border-yellow-300 text-yellow-700' });
    } else {
      diseases.push({ id:'wereng', name:'Wereng Coklat', level:'RENDAH', icon:'✅',
        detail:'Kondisi tidak mendukung', cls:'bg-green-50 border-green-300 text-green-700' });
    }
  }

  const ctx = { suhu, rh, hujan7hari, cum };
  return diseases.map(d => applyPhaseToDisease(applyVarietyToDisease(d, ctx), onDate));
}

function getForecastBaseLevel(suhu_avg, rh_max, hujan7hari, disease) {
  switch (disease) {
    case 'blast':
      if (rh_max >= 85 && suhu_avg >= 24 && suhu_avg <= 28 && hujan7hari >= 20) return 'TINGGI';
      if (rh_max >= 80 && suhu_avg >= 23 && suhu_avg <= 30 && hujan7hari >= 10) return 'SEDANG';
      return 'RENDAH';
    case 'bercak':
      if (rh_max >= 85 && suhu_avg >= 25 && suhu_avg <= 35 && hujan7hari >= 20) return 'TINGGI';
      if (rh_max >= 80 && suhu_avg >= 25 && suhu_avg <= 35 && hujan7hari >= 15) return 'SEDANG';
      return 'RENDAH';
    case 'hdb':
      if (rh_max >= 85 && suhu_avg >= 25 && suhu_avg <= 34 && hujan7hari >= 25) return 'TINGGI';
      if (rh_max >= 80 && suhu_avg >= 25 && suhu_avg <= 34 && hujan7hari >= 15) return 'SEDANG';
      return 'RENDAH';
    case 'wereng':
      if (rh_max >= 85 && suhu_avg >= 22 && suhu_avg <= 30 && hujan7hari >= 5 && hujan7hari <= 35) return 'TINGGI';
      if (rh_max >= 78 && suhu_avg >= 22 && suhu_avg <= 32 && hujan7hari < 40) return 'SEDANG';
      return 'RENDAH';
    default: return 'RENDAH';
  }
}

function isForecastExtreme(diseaseId, suhu_avg, rh_max, hujan7hari) {
  switch (diseaseId) {
    case 'blast':  return rh_max >= 90 && hujan7hari >= 40 && suhu_avg >= 24 && suhu_avg <= 28;
    case 'hdb':    return rh_max >= 88 && hujan7hari >= 50;
    case 'wereng': return rh_max >= 88 && suhu_avg >= 24 && suhu_avg <= 30 && hujan7hari >= 10 && hujan7hari <= 30;
    case 'bercak': return rh_max >= 88 && hujan7hari >= 35;
    default: return false;
  }
}

function applyForecastVarietyModifier(baseLevel, diseaseId, suhu_avg, rh_max, hujan7hari) {
  const variety = getCurrentVariety();
  if (variety.id === 'umum') return baseLevel;
  const reactKey = diseaseReactionKey(diseaseId);
  const reaction = reactKey ? variety[reactKey] : null;
  if (!reaction) return baseLevel;
  const extreme  = isForecastExtreme(diseaseId, suhu_avg, rh_max, hujan7hari);
  const mod      = adaptiveModifier(reaction, extreme);
  const baseNum  = LEVEL_TO_NUM[baseLevel] || 1;
  return NUM_TO_LEVEL[Math.max(1, Math.min(3, baseNum + mod))];
}

function getForecastRiskLevel(suhu_avg, rh_max, hujan7hari, disease, date) {
  if (disease === 'all') {
    const levels = ['blast','bercak','hdb','wereng'].map(d => getForecastRiskLevel(suhu_avg, rh_max, hujan7hari, d, date));
    if (levels.includes('TINGGI')) return 'TINGGI';
    if (levels.includes('SEDANG')) return 'SEDANG';
    return 'RENDAH';
  }
  const base = getForecastBaseLevel(suhu_avg, rh_max, hujan7hari, disease);
  const lvl  = applyForecastVarietyModifier(base, disease, suhu_avg, rh_max, hujan7hari);
  if (!date) return lvl;
  const num = LEVEL_TO_NUM[lvl];
  return NUM_TO_LEVEL[Math.max(1, Math.min(3, num + phaseShift(disease, num, date)))];
}

// ── Render ───────────────────────────────────────────────────────────────────

function getPressureInfo(hPa) {
  const v = parseFloat(hPa);
  if (!v || isNaN(v)) return { label: '--', color: 'text-gray-400' };
  if (v > 1015)  return { label: 'Cerah, stabil',           color: 'text-green-600' };
  if (v >= 1010) return { label: 'Normal, sedikit berawan', color: 'text-blue-500' };
  if (v >= 1000) return { label: 'Potensi hujan',            color: 'text-amber-500' };
  return            { label: 'Cuaca buruk / badai',           color: 'text-red-600' };
}

function getSuhuInfo(suhu) {
  const v = parseFloat(suhu);
  if (isNaN(v)) return { label: '--', color: 'text-gray-400' };
  if (v < 20)         return { label: 'Dingin, pertumbuhan lambat', color: 'text-blue-500' };
  if (v <= 23)        return { label: 'Sejuk, kondisi baik',        color: 'text-green-600' };
  if (v <= 28)        return { label: 'Optimal blast padi',         color: 'text-red-500' };
  if (v <= 32)        return { label: 'Hangat, pantau wereng',      color: 'text-amber-500' };
  return                     { label: 'Panas, stres tanaman',       color: 'text-red-600' };
}

function getRhInfo(rh) {
  const v = parseFloat(rh);
  if (isNaN(v)) return { label: '--', color: 'text-gray-400' };
  if (v < 60)   return { label: 'Kering, risiko rendah',           color: 'text-green-600' };
  if (v < 71)   return { label: 'Normal',                          color: 'text-green-500' };
  if (v < 80)   return { label: 'Lembab, pantau kondisi',          color: 'text-blue-500' };
  if (v < 85)   return { label: 'Tinggi, waspadai bercak',         color: 'text-amber-500' };
  if (v < 90)   return { label: 'Sangat tinggi, risiko penyakit',  color: 'text-orange-500' };
  return               { label: 'Berbahaya, picu ledakan penyakit', color: 'text-red-600' };
}

function getHujanInfo(mm) {
  const v = parseFloat(mm);
  if (isNaN(v)) return { label: '--', color: 'text-gray-400' };
  if (v <= 5)   return { label: 'Kering',                         color: 'text-amber-500' };
  if (v <= 20)  return { label: 'Ringan, normal',                  color: 'text-green-600' };
  if (v <= 40)  return { label: 'Sedang, waspadai blast',          color: 'text-amber-500' };
  if (v <= 80)  return { label: 'Lebat, waspadai HDB',             color: 'text-orange-500' };
  return               { label: 'Sangat lebat, waspadai genangan', color: 'text-red-600' };
}

// ── Konten OPT (tampilan) ────────────────────────────────────────────────────

const LV       = { RENDAH: 0, SEDANG: 1, TINGGI: 2 };
const LV_TEXT  = ['Rendah', 'Sedang', 'Tinggi'];
const LV_CLASS = ['lv-low', 'lv-med', 'lv-high'];
const OPT_ORDER = ['blast', 'hdb', 'bercak', 'wereng'];
const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_TINY  = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];
const DAY_LONG  = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS    = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

const OPT_INFO = {
  blast: {
    short: 'Blast', name: 'Blast padi', inline: 'blast', latin: 'Pyricularia oryzae',
    heroAction: 'Amati daun dan leher malai pagi hari.',
    actions: [
      ['HARI INI', 'Amati daun dan leher malai pagi hari. Cari bercak belah ketupat berpusat abu-abu.'],
      ['MINGGU INI', 'Tunda tambahan urea. Batasi total pupuk N maksimal 200 kg urea/ha.'],
      ['BILA ADA GEJALA', 'Aplikasi fungisida anjuran saat bunting hingga keluar malai, sesuai label dan saran POPT.'],
      ['PENCEGAHAN', 'Pengairan berselang dan jajar legowo agar tajuk tidak lembab.'],
    ],
    symptoms: [
      ['Bercak belah ketupat', 'Tengah abu-abu keputihan, tepi coklat, ujung meruncing.'],
      ['Blast leher', 'Pangkal malai busuk coklat kehitaman, malai patah atau hampa.'],
      ['Blast buku', 'Buku batang menghitam dan mudah patah.'],
    ],
    model: 'Dihitung dari jam dengan RH ≥85% pada suhu 24–28°C selama 7 hari terakhir. Satu hari dihitung mendukung bila kondisi itu terjadi minimal 8 jam. Tinggi jika ≥3 hari mendukung dan hujan ≥20 mm/7 hari. Sedang jika ≥24 jam mendukung atau ≥10 jam lembab berturut-turut. Lalu digeser sesuai ketahanan varietas. Bila tanggal tanam diisi, level juga digeser sesuai fase tanaman.',
  },
  hdb: {
    short: 'HDB', name: 'Hawar daun bakteri', inline: 'HDB', latin: 'Xanthomonas oryzae pv. oryzae',
    heroAction: 'Periksa tepi daun yang menguning setelah hujan.',
    actions: [
      ['HARI INI', 'Periksa ujung dan tepi daun yang menguning bergelombang, terutama setelah hujan angin.'],
      ['MINGGU INI', 'Keringkan petak berkala (pengairan berselang). Hindari air mengalir dari petak terserang.'],
      ['PEMUPUKAN', 'Jangan tambah N. Pastikan kalium cukup untuk menguatkan jaringan daun.'],
      ['PENCEGAHAN', 'Bersihkan gulma inang dan sisa jerami terinfeksi.'],
    ],
    symptoms: [
      ['Hawar dari tepi', 'Garis kuning dari ujung atau tepi daun, bergelombang, lalu kering keabu-abuan.'],
      ['Butiran eksudat', 'Pagi hari tampak tetes kuning seperti embun pada bagian terinfeksi.'],
      ['Kresek', 'Pada tanaman muda, daun layu dan seluruh rumpun mengering.'],
    ],
    model: 'Jam hujan (>1 mm/jam) selama 7 hari dan jam RH ≥85% selama 72 jam terakhir. Tinggi jika ≥15 jam hujan dan ≥20 jam RH tinggi. Sedang jika ≥8 jam hujan dan ≥10 jam RH tinggi. Lalu digeser sesuai ketahanan varietas (patotipe III). Bila tanggal tanam diisi, level juga digeser sesuai fase tanaman.',
  },
  bercak: {
    short: 'Bercak', name: 'Bercak coklat', inline: 'bercak coklat', latin: 'Helminthosporium oryzae',
    heroAction: 'Amati daun bawah dan cek kecukupan kalium.',
    actions: [
      ['MINGGU INI', 'Amati daun bawah. Bercak banyak menandakan tanaman kekurangan hara.'],
      ['PEMUPUKAN', 'Lengkapi kalium sesuai rekomendasi lokasi. Pupuk berimbang lebih efektif dari fungisida.'],
      ['MUSIM BERIKUT', 'Gunakan benih sehat dan perlakuan benih.'],
    ],
    symptoms: [
      ['Bercak oval coklat', 'Bulat lonjong seukuran biji wijen, kadang berpusat abu-abu.'],
      ['Bercak pada gabah', 'Kulit gabah bernoda coklat kehitaman, mutu turun.'],
    ],
    model: 'Jumlah hari dengan RH ≥80% lebih dari 10 jam dalam 7 hari terakhir. Sedang jika ≥3 hari dan hujan ≥15 mm/7 hari. Belum ada data ketahanan varietas untuk bercak coklat. Bila tanggal tanam diisi, level juga digeser sesuai fase tanaman.',
  },
  wereng: {
    short: 'Wereng', name: 'Wereng batang coklat', inline: 'wereng coklat', latin: 'Nilaparvata lugens',
    heroAction: 'Tepuk pangkal rumpun dan hitung wereng per rumpun.',
    actions: [
      ['RUTIN', 'Tepuk pangkal rumpun di atas nampan, hitung wereng per rumpun tiap minggu.'],
      ['BILA MELEWATI AMBANG', 'Hubungi POPT. Gunakan insektisida selektif sesuai anjuran, bukan spektrum luas.'],
      ['PENCEGAHAN', 'Jajar legowo, hindari N berlebih, jaga musuh alami seperti laba-laba.'],
    ],
    symptoms: [
      ['Koloni di pangkal', 'Serangga coklat kecil berkumpul di pangkal batang dekat air.'],
      ['Puso (hopperburn)', 'Tanaman menguning lalu kering membentuk lingkaran di petak.'],
    ],
    model: 'Jam kondisi optimal (RH ≥78%, suhu 22–32°C) selama 7 hari. Tinggi jika ≥80 jam dan hujan <60 mm/7 hari. Sedang jika ≥40 jam dan hujan <80 mm. Hujan ≥80 mm/7 hari menekan populasi. Bila tanggal tanam diisi, level juga digeser sesuai fase tanaman.',
  },
};

// ── DOM helpers ──────────────────────────────────────────────────────────────

function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
  }
  (children || []).forEach(c => { if (c !== null && c !== undefined) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function $(id) { return document.getElementById(id); }

function fmtNum(n) {
  if (n === null || n === undefined || Number.isNaN(+n)) return '--';
  return String(n).replace('.', ',');
}

function joinNames(arr) {
  if (arr.length <= 1) return arr.join('');
  return arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1];
}

function parseDay(dateStr) { return new Date(dateStr + 'T00:00:00'); }

function varietyShortName(v) { return v.name.split(' (')[0].split(' — ')[0]; }

function cityLabel() {
  return `${getCurrentCity().name}, ${PROVINCES[currentProvinceIndex].name}`;
}

// ── Model helpers ────────────────────────────────────────────────────────────

// Level prakiraan per hari. Bila API mengirim metrik kumulatif per hari (dihitung dari
// prakiraan cuaca per jam), pakai model yang sama dengan kondisi saat ini; jika tidak
// (data estimasi), jatuh ke model harian lama.
function forecastLevel(day, disease) {
  if (day.cumulative) {
    const key = currentVarietyId + '|' + currentPlantDate;
    if (!day._lv || day._lv.key !== key) {
      const ds = calculateDiseaseRisks(NaN, NaN, day.hujan_7hari_jam, day.cumulative, parseDay(day.date));
      day._lv = { key };
      ds.forEach(d => { day._lv[d.id] = LV[d.level]; });
    }
    if (disease === 'all') return Math.max(...OPT_ORDER.map(id => day._lv[id]));
    return day._lv[disease];
  }
  const suhuAvg = +((day.suhu_max + day.suhu_min) / 2).toFixed(0);
  return LV[getForecastRiskLevel(suhuAvg, day.rh_max, day.hujan_7hari, disease, parseDay(day.date))];
}

function trendText(nowLv, days, id) {
  const lv = days.map(day => forecastLevel(day, id));
  const dayName = day => DAY_LONG[parseDay(day.date).getDay()];
  const up = lv.findIndex(l => l > nowLv);
  const down = lv.findIndex(l => l < nowLv);
  if (up >= 0) return { text: `Naik ke ${LV_TEXT[lv[up]].toLowerCase()} mulai ${up === 0 ? 'besok' : dayName(days[up])}`, dir: 'up' };
  if (down >= 0 && lv.slice(down).every(l => l < nowLv)) return { text: `Turun ke ${LV_TEXT[Math.max(...lv.slice(down))].toLowerCase()} mulai ${down === 0 ? 'besok' : dayName(days[down])}`, dir: 'down' };
  if (down >= 0) return { text: `Sempat turun, lalu ${LV_TEXT[nowLv].toLowerCase()} lagi`, dir: 'flat' };
  return { text: `Tetap ${LV_TEXT[nowLv].toLowerCase()} 7 hari`, dir: 'flat' };
}

function diseaseById(id) {
  return (lastDiseases || []).find(d => d.id === id);
}

function optSummary(id) {
  const cur = lastData.current;
  const cum = lastData.cumulative;
  const h = fmtNum(cur.hujan_7hari);
  if (!cum) return `Dihitung dari kondisi saat ini: RH ${cur.rh}%, suhu ${fmtNum(cur.suhu)}°C, hujan 7 hari ${h} mm. Data kumulatif jam-per-jam belum tersedia.`;
  switch (id) {
    case 'blast':
      return `Kondisi pendukung blast (RH ≥85% pada suhu 24–28°C) terjadi ${cum.blast_favorable_days} dari 7 hari terakhir, total ${cum.blast_fav_hours} jam. Hujan 7 hari ${h} mm.`;
    case 'hdb':
      return `${cum.hdb_rain_hours_7d} jam hujan dalam 7 hari dan ${cum.rh85_hours_72h} jam RH ≥85% dalam 72 jam terakhir. Bakteri menyebar lewat percikan air dan luka daun.`;
    case 'bercak':
      return `${cum.humid80_days} hari dengan RH ≥80% lebih dari 10 jam, hujan 7 hari ${h} mm. Lebih berat pada lahan kurang kalium dan silika.`;
    case 'wereng':
      return `${cum.warm_humid_hours_7d} jam kondisi optimal wereng dalam 7 hari terakhir.` +
        (cur.hujan_7hari >= 80 ? ' Hujan lebat ikut menekan populasi.' : ' Tetap pantau pangkal batang.');
  }
  return '';
}

function optMeters(id) {
  const cur = lastData.current;
  const cum = lastData.cumulative;
  const h = +cur.hujan_7hari || 0;
  if (!cum) {
    return [
      { label: 'Kelembaban saat ini', value: cur.rh, unit: '%', max: 100, thr: 85, note: 'Ambang lembab 85%' },
      { label: 'Curah hujan 7 hari', value: h, unit: ' mm', max: Math.max(100, h), thr: 20, note: 'Data jam-per-jam tidak tersedia' },
    ];
  }
  switch (id) {
    case 'blast': return [
      { label: 'Hari kondisi mendukung (RH ≥85%, 24–28°C)', value: cum.blast_favorable_days, unit: ' hari', max: 7, thr: 3, note: 'Garis = ambang tinggi 3 hari' },
      { label: 'Curah hujan 7 hari', value: h, unit: ' mm', max: Math.max(100, h), thr: 20, note: 'Ambang tinggi 20 mm' },
      { label: 'Jam lembab berturut-turut terpanjang', value: cum.max_consec_humid_hours, unit: ' jam', max: Math.max(24, cum.max_consec_humid_hours), thr: 10, note: 'Ambang sedang 10 jam' },
    ];
    case 'hdb': return [
      { label: 'Jam hujan >1 mm (7 hari)', value: cum.hdb_rain_hours_7d, unit: ' jam', max: Math.max(40, cum.hdb_rain_hours_7d), thr: 15, note: 'Ambang tinggi 15 jam, sedang 8 jam' },
      { label: 'Jam RH ≥85% (72 jam)', value: cum.rh85_hours_72h, unit: ' jam', max: 72, thr: 20, note: 'Ambang tinggi 20 jam, sedang 10 jam' },
    ];
    case 'bercak': return [
      { label: 'Hari RH ≥80% lebih dari 10 jam', value: cum.humid80_days, unit: ' hari', max: 7, thr: 3, note: 'Ambang sedang 3 hari' },
      { label: 'Curah hujan 7 hari', value: h, unit: ' mm', max: Math.max(100, h), thr: 15, note: 'Ambang sedang 15 mm' },
    ];
    case 'wereng': return [
      { label: 'Jam kondisi optimal (RH ≥78%, 22–32°C)', value: cum.warm_humid_hours_7d, unit: ' jam', max: 168, thr: 80, note: 'Ambang tinggi 80 jam, sedang 40 jam' },
      { label: 'Curah hujan 7 hari', value: h, unit: ' mm', max: Math.max(120, h), thr: 80, note: 'Di atas 80 mm menekan populasi' },
    ];
  }
  return [];
}

function varietyExplanation(d) {
  const v = getCurrentVariety();
  if (v.id === 'umum') return { text: 'Varietas belum dipilih, jadi level belum disesuaikan dengan ketahanan varietas.', pick: true };
  const name = varietyShortName(v);
  if (!d.reaction) return { text: `${name}: ketahanan terhadap ${diseaseReactionTag(d.id)} tidak diuji, jadi level tidak disesuaikan.` };
  const base = LV_TEXT[LV[d.baseLevel]].toLowerCase();
  const fin  = LV_TEXT[LV[d.preLevel || d.level]].toLowerCase();
  const shift = base === fin ? `tetap ${fin}` : `${base} → ${fin}`;
  return {
    text: `${name} ${REACTION_LABEL[d.reaction].toLowerCase()} ${diseaseReactionTag(d.id)}: level cuaca ${shift}` +
      `${d.extreme ? (d.reaction === 'R' || d.reaction === 'AT' ? ' (tekanan cuaca ekstrem, efek ketahanan dikurangi)' : ' (tekanan cuaca ekstrem)') : ''}. Ketahanan bisa patah pada ras atau patotipe lokal bila pupuk N berlebih.`,
  };
}

// ── Render: shared ───────────────────────────────────────────────────────────

function renderHeaderBits() {
  const v = getCurrentVariety();
  $('loc-city').textContent = cityLabel();
  $('loc-variety').textContent = v.id === 'umum' ? 'Varietas: belum dipilih' : `Varietas: ${varietyShortName(v)}`;
  $('detail-sub').textContent = `${getCurrentCity().name} · ${v.id === 'umum' ? 'varietas umum' : varietyShortName(v)}`;
  renderCrop();
}

function setStatus(kind, message) {
  const box = $('status');
  clearChildren(box);
  box.hidden = !kind;
  if (!kind) return;
  box.className = 'status status-' + kind;
  box.appendChild(el('span', { text: message }));
  if (kind === 'error') {
    box.appendChild(el('button', { type: 'button', class: 'btn-ghost', text: 'Coba lagi', onclick: () => { lastWeatherUpdate = 0; fetchAndRender(); } }));
  }
}

function levelDot(lv, cls) {
  return el('span', { class: `dot ${LV_CLASS[lv]} ${cls || ''}`, 'aria-hidden': 'true' });
}

// ── Render: Beranda ──────────────────────────────────────────────────────────

function renderHero() {
  const ds = lastDiseases;
  const highs = ds.filter(d => d.level === 'TINGGI');
  const meds  = ds.filter(d => d.level === 'SEDANG');
  const focus = highs.length ? highs : meds;
  const names = focus.map(d => OPT_INFO[d.id].inline);

  let title;
  if (highs.length)     title = `Waspada ${joinNames(names)}`;
  else if (meds.length) title = `Perhatikan ${joinNames(names)}`;
  else                  title = 'Kondisi relatif aman';

  const cur = lastData.current, cum = lastData.cumulative;
  const parts = [];
  const mm = Math.round(+cur.hujan_7hari || 0);
  if (cum) parts.push(cum.high_humid_days > 0
    ? `Kelembaban tinggi ${cum.high_humid_days} dari 7 hari terakhir, hujan ${mm} mm.`
    : `Tidak ada hari sangat lembab dalam 7 hari terakhir, hujan ${mm} mm.`);
  else parts.push(`Saat ini RH ${cur.rh}%, suhu ${fmtNum(cur.suhu)}°C, hujan 7 hari ${mm} mm.`);

  const raised = focus.filter(d => d.phaseShift > 0);
  if (raised.length) {
    const age = cropAgeOn(new Date());
    parts.push(`Padi umur ${age.hst} HST, fase ${age.phase.name.toLowerCase()}: masa rawan ${joinNames(raised.map(d => OPT_INFO[d.id].inline))}.`);
  }

  const fc = lastData.forecast || [];
  const next = fc.slice(1, 8).map((day, i) => ({ i: i + 1, day, lv: forecastLevel(day, 'all') }));
  const highDays = next.filter(x => x.lv === 2);
  if (highDays.length === next.length && next.length) {
    parts.push('Risiko tinggi berlanjut 7 hari ke depan.');
  } else if (highDays.length) {
    const fd = parseDay(highDays[0].day.date);
    const when = highDays[0].i === 1 ? 'besok' : `${DAY_LONG[fd.getDay()]} ${fd.getDate()} ${MONTHS[fd.getMonth()]}`;
    parts.push(`Risiko tinggi ${highDays.length} dari 7 hari ke depan, mulai ${when}.`);
  } else if (next.length) {
    parts.push('Tidak ada risiko tinggi dalam 7 hari ke depan.');
  }

  let todo;
  if (focus.length) {
    todo = focus.map(d => OPT_INFO[d.id].heroAction);
    if (focus.some(d => d.id === 'blast' || d.id === 'hdb')) todo.push('Tunda tambahan urea, pertahankan pengairan berselang.');
  } else {
    todo = ['Lanjutkan pengamatan rutin seminggu sekali.'];
  }

  setBadge('hero', highs.length ? 2 : meds.length ? 1 : 0);
  $('hero').classList.toggle('is-dry', (+cur.hujan_7hari || 0) < 5);
  const topId = focus.length ? focus[0].id : 'blast';
  $('hero-detail').href = `#/opt/${topId}`;
  $('hero-detail').setAttribute('aria-label', `Lihat detail risiko ${OPT_INFO[topId].name}`);
  $('hero-title').textContent = title;
  $('hero-text').textContent = parts.join(' ');
  $('hero-todo').textContent = todo.join(' ');
  $('hero').classList.remove('is-loading');
}

function forecastBars(fc, id) {
  return el('span', { class: 'bars' }, fc.map(day => {
    const l = forecastLevel(day, id);
    return el('span', { class: 'bar-col' }, [
      el('span', { class: `bar ${LV_CLASS[l]} h${l}` }),
      el('span', { class: 'bar-day', text: DAY_TINY[parseDay(day.date).getDay()] }),
    ]);
  }));
}

const HERO_BADGE = [['AMAN', 'badge-low'], ['PERHATIAN', 'badge-med'], ['WASPADA', 'badge-high']];

function setBadge(prefix, lv) {
  $(prefix + '-badge').className = 'hero-badge ' + HERO_BADGE[lv][1];
  $(prefix + '-badge-text').textContent = HERO_BADGE[lv][0];
}

function renderRiskGrid() {
  const grid = $('risk-grid');
  clearChildren(grid);
  // Batang = besok s.d. 7 hari ke depan (hari ini sudah diwakili label "Sekarang")
  const fc = (lastData.forecast || []).slice(1, 8);
  OPT_ORDER.forEach(id => {
    const d = diseaseById(id);
    const lv = LV[d.level];
    const children = [
      el('span', { class: 'risk-now' }, [
        el('span', { class: 'risk-now-label', text: 'Sekarang' }),
        el('span', { class: `pill ${LV_CLASS[lv]}`, text: LV_TEXT[lv].toUpperCase() }),
      ]),
      el('span', { class: 'risk-name', text: OPT_INFO[id].name }),
    ];
    let aria = `${OPT_INFO[id].name}: risiko sekarang ${LV_TEXT[lv].toLowerCase()}.`;
    if (fc.length) {
      const tr = trendText(lv, fc, id);
      aria += ` Tujuh hari ke depan: ${tr.text}.`;
      children.push(el('span', { class: 'risk-fc', 'aria-hidden': 'true' }, [
        el('span', { class: 'risk-fc-label', text: '7 hari ke depan' }),
        forecastBars(fc, id),
        el('span', { class: `risk-trend trend-${tr.dir}`, text: tr.text }),
      ]));
    }
    grid.appendChild(el('a', { class: 'risk-card', href: `#/opt/${id}`, 'aria-label': aria + ' Lihat detail.' }, children));
  });
}

function renderWeather() {
  const c = lastData.current;
  const items = [
    ['Suhu', fmtNum(c.suhu), '°C', getSuhuInfo(c.suhu).label],
    ['Kelembaban', fmtNum(c.rh), '%', getRhInfo(c.rh).label],
    ['Hujan 7 hari', fmtNum(c.hujan_7hari), 'mm', getHujanInfo(c.hujan_7hari).label],
    ['Tekanan', fmtNum(c.tekanan), 'hPa', getPressureInfo(c.tekanan).label],
  ];
  const box = $('weather-metrics');
  clearChildren(box);
  items.forEach(([label, val, unit, hint]) => {
    box.appendChild(el('div', { class: 'metric' }, [
      el('span', { class: 'metric-label', text: label }),
      el('span', { class: 'metric-value' }, [val, el('span', { class: 'unit', text: ' ' + unit })]),
      el('span', { class: 'metric-hint', text: hint }),
    ]));
  });
  renderWeatherChart();
}

function renderWeatherChart() {
  const hist = (lastData && lastData.history) || [];
  const svg = $('weather-svg');
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  ['rh', 'suhu', 'hujan'].forEach(t => {
    const b = $('wtab-' + t);
    b.setAttribute('aria-selected', String(t === currentWeatherTab));
    b.classList.toggle('active', t === currentWeatherTab);
  });
  if (!hist.length) return;

  const W = 320, H = 72, n = hist.length;
  const x = i => (n === 1 ? W : (i / (n - 1)) * W);
  let caption = '';
  if (currentWeatherTab === 'hujan') {
    const vals = hist.map(r => +r.hujan_mm || 0);
    const max = Math.max(2, ...vals);
    const bw = W / n;
    vals.forEach((v, i) => {
      const h = (v / max) * (H - 6);
      svg.appendChild(svgEl('rect', { x: (i * bw + 1).toFixed(1), y: (H - h).toFixed(1), width: Math.max(1, bw - 2).toFixed(1), height: Math.max(0, h).toFixed(1), rx: 1.5, class: 'chart-bar' }));
    });
    caption = `maks ${fmtNum(Math.max(...vals))} mm/jam`;
  } else {
    const key = currentWeatherTab === 'rh' ? 'rh' : 'suhu';
    const [lo, hi] = key === 'rh' ? [40, 100] : [20, 38];
    const y = v => H - ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * H;
    if (key === 'rh') {
      svg.appendChild(svgEl('line', { x1: 0, x2: W, y1: y(85).toFixed(1), y2: y(85).toFixed(1), class: 'chart-ref' }));
      caption = 'garis putus = 85%';
    } else {
      svg.appendChild(svgEl('rect', { x: 0, width: W, y: y(28).toFixed(1), height: (y(24) - y(28)).toFixed(1), class: 'chart-band' }));
      caption = 'pita = 24–28°C (optimal blast)';
    }
    const pts = hist.map((r, i) => `${x(i).toFixed(1)},${y(+r[key]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('polyline', { points: pts, class: 'chart-line' }));
  }
  $('weather-caption').textContent = caption;
  const titles = { rh: 'Kelembaban 24 jam', suhu: 'Suhu 24 jam', hujan: 'Hujan 24 jam' };
  $('weather-chart-title').textContent = titles[currentWeatherTab];
  svg.setAttribute('aria-label', titles[currentWeatherTab]);

  const ax = $('weather-axis');
  clearChildren(ax);
  const idx = [0, Math.round((n - 1) / 4), Math.round((n - 1) / 2), Math.round((3 * (n - 1)) / 4)];
  idx.forEach(i => ax.appendChild(el('span', { text: new Date(hist[i].created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) })));
  ax.appendChild(el('span', { text: 'Kini' }));
}

function dayCard(day, i, lv, extra) {
  const d = parseDay(day.date);
  const today = i === 0;
  return el('div', {
    class: 'day' + (today ? ' today' : ''),
    title: `${day.date}: risiko ${LV_TEXT[lv].toLowerCase()}. Suhu ${day.suhu_min}–${day.suhu_max}°C, RH maks ${day.rh_max}%, hujan ${day.hujan} mm (7 hari ${day.hujan_7hari} mm)`,
  }, [
    el('span', { class: 'day-name', text: today ? 'Hari ini' : DAY_SHORT[d.getDay()] }),
    el('span', { class: 'day-date', text: `${d.getDate()} ${MONTHS[d.getMonth()]}` }),
    levelDot(lv, 'dot-lg'),
    el('span', { class: 'sr-only', text: `Risiko ${LV_TEXT[lv]}` }),
    el('span', { class: 'day-extra', text: extra }),
  ]);
}

function renderForecast() {
  ['all', 'blast', 'hdb', 'bercak', 'wereng'].forEach(id => {
    const b = $('ftab-' + id);
    b.classList.toggle('active', id === currentForecastDisease);
    b.setAttribute('aria-pressed', String(id === currentForecastDisease));
  });
  const row = $('forecast-row');
  clearChildren(row);
  (lastData.forecast || []).forEach((day, i) => {
    row.appendChild(dayCard(day, i, forecastLevel(day, currentForecastDisease), `${fmtNum(day.hujan)} mm`));
  });
}

function renderHome() {
  renderHero();
  renderRiskGrid();
  renderWeather();
  renderForecast();
}

// ── Render: Umur padi ────────────────────────────────────────────────────────

const VULN_TEXT  = ['Rendah', 'Sedang', 'Tinggi'];
const VULN_CLASS = ['vc-low', 'vc-med', 'vc-high'];
const WATCH_NAME = { blast: 'Blast', hdb: 'Hawar daun bakteri', wereng: 'Wereng coklat', bercak: 'Bercak coklat' };

function fmtDayMonth(date) { return `${date.getDate()} ${MONTHS[date.getMonth()]}`; }
function addDays(date, n) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n); }

// Nama OPT yang paling rawan di fase ini, untuk kalimat ringkas
function phaseWatchInline(idx) {
  const names = { blast: idx >= 1 ? 'blast leher' : 'blast daun', hdb: idx === 0 ? 'kresek HDB' : 'HDB', wereng: 'wereng', bercak: 'bercak coklat' };
  return OPT_ORDER.filter(id => PHASE_VULN[id][idx] === 2).map(id => names[id]);
}

function seasonBar(age, variant) {
  const pos = Math.max(0, Math.min(100, (age.hst / age.P) * 100));
  const segs = age.phases.map(ph => el('span', {
    class: 'season-seg' + (ph.i === age.idx ? ' on' : ''),
    style: `flex:${ph.to - ph.from} 1 0;background:${ph.color}`,
  }));
  const labels = age.phases.map((ph, k) => {
    const last = k === age.phases.length - 1;
    const text = variant === 'card' && last ? `Panen ±${fmtDayMonth(addDays(age.planted, age.P))}` : ph.short;
    return el('span', { class: 'season-label' + (ph.i === age.idx ? ' on' : '') + (last && variant === 'card' ? ' end' : ''), style: `flex:${ph.to - ph.from} 1 0`, text });
  });
  const where = age.phase ? `fase ${age.phase.name.toLowerCase()}` : (age.hst < 0 ? 'belum tanam' : 'lewat perkiraan panen');
  return el('div', { class: `season season-${variant}` }, [
    el('div', { class: 'season-bar', role: 'img', 'aria-label': `Musim tanam ${age.P} hari. Hari ini ${Math.max(0, age.hst)} HST, ${where}.` }, [
      ...segs,
      el('span', { class: 'season-marker', style: `left:${pos.toFixed(1)}%` }),
    ]),
    el('div', { class: 'season-labels', 'aria-hidden': 'true' }, labels),
  ]);
}

function phaseTitle(age) {
  if (age.hst < 0) return 'Belum tanam';
  if (!age.phase) return 'Siap panen';
  return `Fase ${age.phase.name.toLowerCase()}`;
}

function phaseNote(age) {
  if (age.hst < 0) return `Tanggal tanam ${-age.hst} hari lagi. Penyesuaian fase berlaku setelah tanam.`;
  if (!age.phase) return age.hst > age.P + 14
    ? 'Musim ini sudah lewat panen. Perbarui tanggal tanam untuk musim berikutnya.'
    : 'Sudah melewati perkiraan umur panen. Penyesuaian fase tidak dipakai.';
  return age.phase.note;
}

const ARROW_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const WARN_SVG  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/></svg>';

function svgIcon(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup;
  return t.content.firstChild;
}

function renderCropCard() {
  const card = $('crop-card');
  clearChildren(card);
  const age = cropAgeOn(new Date());
  card.appendChild(el('div', { class: 'crop-head' }, [
    el('span', { class: 'crop-eyebrow', text: 'Umur padi saya' }),
    el('span', { class: 'crop-action', text: age ? 'Atur' : 'Isi' }),
  ]));
  if (!age) {
    card.setAttribute('aria-label', 'Umur padi saya: isi tanggal tanam');
    card.appendChild(el('span', { class: 'crop-empty-title', text: 'Isi tanggal tanam' }));
    card.appendChild(el('span', { class: 'crop-empty-text', text: 'Peringatan akan disesuaikan dengan fase padi Anda. Cukup sekali, disimpan di HP ini tanpa akun.' }));
    return;
  }
  card.removeAttribute('aria-label');
  card.appendChild(el('div', { class: 'crop-age' }, [
    el('span', { class: 'crop-hst' }, [String(Math.max(0, age.hst)), el('span', { class: 'crop-hst-unit', text: ' HST' })]),
    el('span', { class: 'crop-phase', text: phaseTitle(age) }),
  ]));
  card.appendChild(seasonBar(age, 'card'));
  const watch = age.phase ? phaseWatchInline(age.idx) : [];
  let msg;
  if (watch.length) {
    msg = el('span', { class: 'crop-alert-text' }, ['Masuk masa rawan ']);
    watch.forEach((w, i) => {
      if (i) msg.appendChild(document.createTextNode(i === watch.length - 1 ? ' dan ' : ', '));
      msg.appendChild(el('b', { text: w }));
    });
    msg.appendChild(document.createTextNode('. Lihat yang perlu diwaspadai.'));
  } else {
    msg = el('span', { class: 'crop-alert-text', text: phaseNote(age) });
  }
  card.appendChild(el('div', { class: 'crop-alert' + (watch.length ? '' : ' calm') }, [
    watch.length ? svgIcon(WARN_SVG) : null, msg, svgIcon(ARROW_SVG),
  ]));
}

function renderUmur() {
  const v = getCurrentVariety();
  $('umur-sub').textContent = `${getCurrentCity().name} · ${v.id === 'umum' ? 'varietas umum' : varietyShortName(v)}`;
  const input = $('plant-date');
  if (input.value !== (currentPlantDate || '')) input.value = currentPlantDate || '';
  $('plant-clear').hidden = !currentPlantDate;
  const P = panenHst();
  $('umur-variety-note').textContent = v.panenHst
    ? `Umur panen ${varietyShortName(v)} ±${P} HST. Disimpan di HP ini, tanpa akun.`
    : `Umur panen dianggap ±${P} HST (varietas umur sedang)${v.id === 'umum' ? '. Pilih varietas untuk perkiraan lebih tepat' : ''}. Disimpan di HP ini, tanpa akun.`;

  const age = cropAgeOn(new Date());
  const status = $('umur-status');
  clearChildren(status);
  status.hidden = !age;
  $('umur-watch-sec').hidden = !age;
  $('umur-agenda-sec').hidden = !age;
  if (age) {
    const harvest = addDays(age.planted, age.P);
    status.appendChild(el('div', { class: 'umur-status-top' }, [
      el('div', { class: 'umur-status-col' }, [
        el('span', { class: 'eyebrow', text: 'Hari ini' }),
        el('span', { class: 'umur-hst' }, [String(Math.max(0, age.hst)), el('span', { class: 'umur-hst-unit', text: ' HST' })]),
      ]),
      el('div', { class: 'umur-status-col end' }, [
        el('span', { class: 'umur-phase', text: phaseTitle(age) }),
        el('span', { class: 'umur-harvest', text: `Panen ±${fmtDayMonth(harvest)} ${harvest.getFullYear()}` }),
      ]),
    ]));
    status.appendChild(seasonBar(age, 'status'));
    status.appendChild(el('p', { class: 'umur-note', text: phaseNote(age) }));
  }

  // Rawan di fase ini
  const watch = $('umur-watch');
  clearChildren(watch);
  if (age && age.phase) {
    const items = OPT_ORDER
      .map(id => ({ id, l: PHASE_VULN[id][age.idx], text: PHASE_VULN_TEXT[id][age.idx] }))
      .filter(w => w.l >= 1 && w.text)
      .sort((a, b) => b.l - a.l)
      .slice(0, 3);
    items.forEach(w => watch.appendChild(el('a', { class: 'watch', href: `#/opt/${w.id}` }, [
      el('span', { class: `pill ${LV_CLASS[w.l]}`, text: VULN_TEXT[w.l].toUpperCase() }),
      el('span', { class: 'watch-body' }, [
        el('span', { class: 'watch-name', text: WATCH_NAME[w.id] }),
        el('span', { class: 'watch-text', text: w.text }),
      ]),
    ])));
    if (!items.length) watch.appendChild(el('p', { class: 'watch-none', text: 'Tidak ada OPT dengan kerentanan khusus di fase ini. Tetap ikuti risiko cuaca harian.' }));
  } else if (age) {
    watch.appendChild(el('p', { class: 'watch-none', text: phaseNote(age) }));
  }

  // Matriks kerentanan
  const mx = $('umur-matrix');
  clearChildren(mx);
  const cur = age ? age.idx : -1;
  mx.appendChild(el('div', { class: 'vm-row' }, [
    el('span'),
    ...PHASE_DEFS.map((ph, i) => el('span', { class: 'vm-head' + (i === cur ? ' on' : ''), text: ph.short })),
  ]));
  OPT_ORDER.forEach(id => mx.appendChild(el('div', { class: 'vm-row' }, [
    el('span', { class: 'vm-name', text: OPT_INFO[id].short }),
    ...PHASE_VULN[id].map((l, i) => el('span', { class: `vm-cell ${VULN_CLASS[l]}` + (i === cur ? ' on' : ''), text: VULN_TEXT[l] })),
  ])));

  // Agenda
  const ag = $('umur-agenda');
  clearChildren(ag);
  if (!age) return;
  const steps = [
    { at: 0, text: 'Tanam' },
    { at: Math.max(1, P - 70), text: 'Pupuk susulan terakhir sebelum primordia' },
    { at: P - 50, text: 'Mulai amati leher malai setiap pagi' },
    { at: P - 15, text: 'Keringkan petak menjelang panen' },
    { at: P, text: 'Perkiraan panen' },
  ];
  const nextIdx = steps.findIndex(s => s.at > age.hst);
  steps.forEach((s, k) => {
    const state = s.at <= age.hst ? 'done' : (k === nextIdx ? 'next' : 'todo');
    ag.appendChild(el('li', { class: `ag ag-${state}` }, [
      el('span', { class: 'ag-rail', 'aria-hidden': 'true' }, [el('span', { class: 'ag-dot' }), el('span', { class: 'ag-line' })]),
      el('span', { class: 'ag-body' }, [
        el('span', { class: 'ag-when', text: `${fmtDayMonth(addDays(age.planted, s.at))} · ${s.at} HST${state === 'next' ? ' · berikutnya' : ''}` }),
        el('span', { class: 'ag-text', text: s.text }),
        state === 'done' ? el('span', { class: 'sr-only', text: '(sudah lewat)' }) : null,
      ]),
    ]));
  });
}

function renderCrop() {
  renderCropCard();
  if (!$('view-umur').hidden) renderUmur();
}

function setPlantDate(val) {
  currentPlantDate = /^\d{4}-\d{2}-\d{2}$/.test(val || '') && !isNaN(parseDay(val)) ? val : null;
  try {
    if (currentPlantDate) localStorage.setItem(PLANT_DATE_STORAGE_KEY, currentPlantDate);
    else localStorage.removeItem(PLANT_DATE_STORAGE_KEY);
  } catch (_) {}
  if (lastData) recomputeAndRender();
  else renderHeaderBits();
}

function phaseExplanation(d) {
  const age = cropAgeOn(new Date());
  if (!age) return null;
  if (!age.phase) return `${phaseTitle(age)}: level tidak digeser fase tanaman.`;
  const v = PHASE_VULN[d.id][age.idx];
  const pre = LV_TEXT[LV[d.preLevel || d.level]].toLowerCase();
  const fin = LV_TEXT[LV[d.level]].toLowerCase();
  const shift = pre === fin ? `tetap ${fin}` : `${pre} → ${fin}`;
  const why = v === 2 ? (d.phaseShift ? 'fase paling rawan' : 'fase rawan, tapi cuaca belum mendukung')
    : v === 0 ? 'fase ini kurang rawan' : 'kerentanan sedang';
  return `Umur ${age.hst} HST, fase ${age.phase.name.toLowerCase()} (${why}): level ${shift}.`;
}

// ── Render: Detail OPT ───────────────────────────────────────────────────────

let currentDetailId = null;

function renderDetail(id) {
  currentDetailId = id;
  const info = OPT_INFO[id];

  const tabs = $('detail-tabs');
  clearChildren(tabs);
  OPT_ORDER.forEach(k => {
    const on = k === id;
    const d = lastDiseases && diseaseById(k);
    tabs.appendChild(el('a', { href: `#/opt/${k}`, class: 'tab' + (on ? ' active' : ''), 'aria-current': on ? 'page' : null }, [
      d ? levelDot(LV[d.level]) : null,
      OPT_INFO[k].short,
    ]));
  });

  $('detail-name').textContent = info.name;
  $('detail-latin').textContent = info.latin;
  $('detail-model').textContent = info.model;
  $('detail-model-title').textContent = `Ambang model ${info.short}`;
  $('detail-forecast-title').textContent = `Prakiraan 14 hari · ${info.short}`;

  const actions = $('detail-actions');
  clearChildren(actions);
  info.actions.forEach(([when, text], i) => {
    actions.appendChild(el('li', { class: 'action' }, [
      el('span', { class: 'action-n', text: String(i + 1), 'aria-hidden': 'true' }),
      el('span', { class: 'action-body' }, [el('span', { class: 'action-when', text: when }), el('span', { text })]),
    ]));
  });

  const sym = $('detail-symptoms');
  clearChildren(sym);
  info.symptoms.forEach(([title, text]) => {
    sym.appendChild(el('li', { class: 'symptom' }, [el('strong', { text: title }), el('span', { text })]));
  });

  const hero = $('detail-hero');
  if (!lastData || !lastDiseases) {
    hero.className = 'hero detail-hero is-loading';
    $('detail-badge').className = 'hero-badge badge-loading';
    $('detail-badge-text').textContent = 'MEMUAT';
    $('detail-summary').textContent = 'Memuat data cuaca…';
    clearChildren($('detail-bars'));
    $('detail-trend').textContent = '';
    clearChildren($('detail-meters'));
    clearChildren($('detail-forecast'));
    $('detail-variety').textContent = '';
    return;
  }

  const d = diseaseById(id);
  const lv = LV[d.level];
  hero.className = 'hero detail-hero' + ((+lastData.current.hujan_7hari || 0) < 5 ? ' is-dry' : '');
  setBadge('detail', lv);
  $('detail-level').textContent = `Risiko ${LV_TEXT[lv].toLowerCase()}`;
  $('detail-summary').textContent = optSummary(id);
  const next7 = (lastData.forecast || []).slice(1, 8);
  const bars = $('detail-bars');
  clearChildren(bars);
  if (next7.length) {
    bars.appendChild(forecastBars(next7, id));
    const tr = trendText(lv, next7, id);
    $('detail-trend').textContent = tr.text;
    $('detail-trend').className = `risk-trend trend-${tr.dir}`;
  } else {
    $('detail-trend').textContent = 'Prakiraan belum tersedia.';
    $('detail-trend').className = 'risk-trend trend-flat';
  }

  const meters = $('detail-meters');
  clearChildren(meters);
  const baseLv = LV[d.baseLevel || d.level];
  optMeters(id).forEach(m => {
    const pct = Math.max(0, Math.min(1, (+m.value || 0) / m.max));
    meters.appendChild(el('div', { class: 'meter' }, [
      el('div', { class: 'meter-head' }, [el('span', { class: 'meter-label', text: m.label }), el('span', { class: 'meter-value', text: fmtNum(m.value) + m.unit })]),
      el('div', { class: 'meter-track', role: 'img', 'aria-label': `${fmtNum(m.value)}${m.unit}, ambang ${m.thr}${m.unit}` }, [
        el('div', { class: `meter-fill ${LV_CLASS[baseLv]}`, style: `width:${Math.round(pct * 100)}%` }),
        el('div', { class: 'meter-tick', style: `left:${Math.round(Math.min(1, m.thr / m.max) * 100)}%` }),
      ]),
      el('span', { class: 'meter-note', text: m.note }),
    ]));
  });

  const vx = varietyExplanation(d);
  const vbox = $('detail-variety');
  clearChildren(vbox);
  vbox.appendChild(el('span', { text: vx.text + ' ' }));
  if (vx.pick) vbox.appendChild(el('button', { type: 'button', class: 'link-btn', text: 'Pilih varietas', onclick: openSheet }));
  vbox.appendChild(el('br'));
  const px = phaseExplanation(d);
  if (px) vbox.appendChild(el('span', { text: px }));
  else {
    vbox.appendChild(el('span', { text: 'Tanggal tanam belum diisi, jadi level belum disesuaikan dengan fase tanaman. ' }));
    vbox.appendChild(el('a', { href: '#/umur', class: 'link-btn', text: 'Isi tanggal tanam' }));
  }

  const fc = $('detail-forecast');
  clearChildren(fc);
  (lastData.forecast || []).forEach((day, i) => {
    const l = forecastLevel(day, id);
    fc.appendChild(dayCard(day, i, l, LV_TEXT[l]));
  });
}

// ── Routing ──────────────────────────────────────────────────────────────────

function route() {
  const m = location.hash.match(/^#\/opt\/(blast|hdb|bercak|wereng)$/);
  const home = $('view-home'), detail = $('view-detail'), umur = $('view-umur');
  if (m) {
    home.hidden = true;
    umur.hidden = true;
    detail.hidden = false;
    renderDetail(m[1]);
    document.title = `${OPT_INFO[m[1]].name} — PantauPadi`;
    window.scrollTo(0, 0);
    $('detail-heading').focus({ preventScroll: true });
  } else if (location.hash === '#/umur') {
    home.hidden = true;
    detail.hidden = true;
    umur.hidden = false;
    currentDetailId = null;
    renderUmur();
    document.title = 'Umur padi saya — PantauPadi';
    window.scrollTo(0, 0);
    $('umur-heading').focus({ preventScroll: true });
  } else {
    const wasHome = !home.hidden;
    detail.hidden = true;
    umur.hidden = true;
    home.hidden = false;
    currentDetailId = null;
    document.title = 'PantauPadi — Prediksi Risiko OPT Padi Berbasis Cuaca Realtime';
    if (!wasHome) window.scrollTo(0, 0);
  }
}

// ── Bagikan ──────────────────────────────────────────────────────────────────

function shareAlert(optId) {
  if (!lastDiseases) return;
  const v = getCurrentVariety();
  const url = `https://pantau.agroinovasi.my.id/${optId ? '#/opt/' + optId : ''}`;
  const lines = [`PantauPadi · ${cityLabel()}`];
  if (v.id !== 'umum') lines.push(`Varietas: ${varietyShortName(v)}`);
  const age = cropAgeOn(new Date());
  if (age && age.phase) lines.push(`Umur padi: ${age.hst} HST (fase ${age.phase.name.toLowerCase()})`);
  lines.push('');
  const ids = optId ? [optId] : OPT_ORDER;
  ids.forEach(id => lines.push(`${OPT_INFO[id].name}: risiko ${LV_TEXT[LV[diseaseById(id).level]].toUpperCase()}`));
  if (optId) {
    lines.push('', 'Yang perlu dilakukan:');
    OPT_INFO[optId].actions.slice(0, 2).forEach(([, t]) => lines.push('- ' + t));
  } else {
    lines.push('', $('hero-todo').textContent);
  }
  lines.push('', 'Model indikatif, pastikan dengan pengamatan langsung.', url);
  const text = lines.join('\n');
  if (navigator.share) {
    navigator.share({ title: 'Peringatan PantauPadi', text }).catch(() => {});
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }
}

// ── Sheet lokasi & varietas ──────────────────────────────────────────────────

let pendingProvince = 0, pendingCity = 0, pendingVariety = 'umum';

function fillProvinceSelect() {
  const sel = $('sheet-province');
  clearChildren(sel);
  PROVINCES.forEach((p, i) => sel.appendChild(el('option', { value: String(i), text: p.name, selected: i === pendingProvince })));
}

function fillCitySelect() {
  const sel = $('sheet-city');
  clearChildren(sel);
  PROVINCES[pendingProvince].cities.forEach((c, i) => sel.appendChild(el('option', { value: String(i), text: c.name, selected: i === pendingCity })));
}

const VARIETY_GROUP_LABELS = {
  default:     'Default',
  rekomendasi: 'Rekomendasi tanam Kalbar',
  referensi:   'Varietas referensi / kontrol',
};

function varietyBadges(v) {
  const parts = [];
  if (v.blas)   parts.push(`blas ${v.blas}`);
  if (v.hdb)    parts.push(`HDB ${v.hdb}`);
  if (v.wereng) parts.push(`WBC ${v.wereng}`);
  return parts.join(' · ');
}

function renderVarietyOptions() {
  const q = $('sheet-variety-search').value.trim().toLowerCase();
  const list = $('sheet-variety-list');
  clearChildren(list);
  const items = RICE_VARIETIES.filter(v => !q || v.name.toLowerCase().includes(q) || v.id.includes(q));
  if (!items.length) { list.appendChild(el('p', { class: 'muted small', text: 'Varietas tidak ditemukan.' })); return; }
  let group = null;
  items.forEach(v => {
    if (v.group !== group) {
      group = v.group;
      list.appendChild(el('p', { class: 'group-label', text: VARIETY_GROUP_LABELS[group] || group }));
    }
    const id = 'var-' + v.id;
    list.appendChild(el('label', { class: 'variety-opt', for: id }, [
      el('input', { type: 'radio', name: 'variety', id, value: v.id, checked: v.id === pendingVariety, onchange: () => { pendingVariety = v.id; renderVarietyNote(); } }),
      el('span', { class: 'variety-text' }, [
        el('span', { class: 'variety-name', text: v.name }),
        varietyBadges(v) ? el('span', { class: 'variety-badges', text: varietyBadges(v) }) : null,
      ]),
    ]));
  });
}

function renderVarietyNote() {
  const v = RICE_VARIETIES.find(x => x.id === pendingVariety) || RICE_VARIETIES[0];
  const box = $('sheet-variety-note');
  box.hidden = !v.note;
  box.textContent = v.note || '';
}

function openSheet() {
  pendingProvince = currentProvinceIndex;
  pendingCity = currentCityIndex;
  pendingVariety = currentVarietyId;
  fillProvinceSelect();
  fillCitySelect();
  $('sheet-variety-search').value = '';
  renderVarietyOptions();
  renderVarietyNote();
  $('sheet-geo').textContent = '';
  $('sheet').showModal();
}

function applySheet() {
  const locChanged = pendingProvince !== currentProvinceIndex || pendingCity !== currentCityIndex;
  const varChanged = pendingVariety !== currentVarietyId;
  currentProvinceIndex = pendingProvince;
  currentCityIndex = pendingCity;
  currentVarietyId = pendingVariety;
  saveLocation();
  try { localStorage.setItem(VARIETY_STORAGE_KEY, currentVarietyId); } catch (_) {}
  $('sheet').close();
  renderHeaderBits();
  if (locChanged) { lastWeatherUpdate = 0; fetchAndRender(); }
  else if (varChanged) recomputeAndRender();
}

function nearestCity(lat, lon) {
  let best = { d: Infinity, p: 0, c: 0 };
  PROVINCES.forEach((prov, pi) => prov.cities.forEach((city, ci) => {
    const d = haversineKm(lat, lon, city.lat, city.lon);
    if (d < best.d) best = { d, p: pi, c: ci };
  }));
  return best;
}

function sheetUseGps() {
  const msg = $('sheet-geo');
  if (!navigator.geolocation) { msg.textContent = 'Perangkat tidak mendukung GPS.'; return; }
  msg.textContent = 'Mencari lokasi…';
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const b = nearestCity(coords.latitude, coords.longitude);
    pendingProvince = b.p; pendingCity = b.c;
    fillProvinceSelect(); fillCitySelect();
    msg.textContent = `Terdekat: ${PROVINCES[b.p].cities[b.c].name} (±${Math.round(b.d)} km)`;
  }, () => { msg.textContent = 'Lokasi tidak bisa dibaca. Izinkan akses lokasi atau pilih manual.'; },
  { timeout: 10000, maximumAge: 300000 });
}

function initSheet() {
  $('loc-btn').addEventListener('click', openSheet);
  $('sheet-province').addEventListener('change', e => { pendingProvince = +e.target.value; pendingCity = 0; fillCitySelect(); });
  $('sheet-city').addEventListener('change', e => { pendingCity = +e.target.value; });
  $('sheet-variety-search').addEventListener('input', renderVarietyOptions);
  $('sheet-gps').addEventListener('click', sheetUseGps);
  $('sheet-cancel').addEventListener('click', () => $('sheet').close());
  $('sheet-form').addEventListener('submit', e => { e.preventDefault(); applySheet(); });
}

// GPS otomatis saat buka: pindah ke kab/kota terdekat bila belum pernah memilih manual
function detectGeolocation() {
  let saved = null;
  try { saved = localStorage.getItem(PROVINCE_STORAGE_KEY); } catch (_) {}
  if (saved || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const b = nearestCity(coords.latitude, coords.longitude);
    if (b.p === currentProvinceIndex && b.c === currentCityIndex) return;
    currentProvinceIndex = b.p; currentCityIndex = b.c;
    saveLocation();
    renderHeaderBits();
    lastWeatherUpdate = 0;
    fetchAndRender();
  }, null, { timeout: 10000, maximumAge: 300000 });
}

// ── Fetch & render ───────────────────────────────────────────────────────────

function recomputeAndRender() {
  if (!lastData) return;
  const c = lastData.current;
  lastDiseases = calculateDiseaseRisks(c.suhu, c.rh, c.hujan_7hari, lastData.cumulative);
  renderHeaderBits();
  renderHome();
  if (currentDetailId) renderDetail(currentDetailId);
}

let fetchSeq = 0;
async function fetchAndRender() {
  const seq = ++fetchSeq;
  const city = getCurrentCity();
  if (!lastData) setStatus('loading', 'Memuat data cuaca…');
  else setStatus('loading', `Memuat data ${city.name}…`);
  try {
    const res  = await fetch(`${API_BASE_URL}/api/weather?lat=${city.lat}&lon=${city.lon}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    if (seq !== fetchSeq) return;
    lastData = data;
    lastWeatherUpdate = Date.now();
    $('app').classList.remove('is-empty');
    setStatus(data.isDummy ? 'warn' : null, 'Open-Meteo sedang tidak tersedia. Angka di bawah adalah data estimasi, bukan pengukuran.');
    $('last-updated').textContent = 'Diperbarui ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    recomputeAndRender();
  } catch (err) {
    console.error('fetchAndRender error:', err);
    if (seq !== fetchSeq) return;
    setStatus('error', lastData ? 'Gagal memperbarui data. Yang tampil adalah data terakhir.' : 'Gagal memuat data cuaca. Periksa koneksi internet.');
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

function initDetailArt() {
  const art = document.querySelector('#hero .hero-art').cloneNode(true);
  const pat = art.querySelector('pattern');
  pat.id = 'pp-rows-detail';
  art.querySelectorAll('[fill="url(#pp-rows)"]').forEach(n => n.setAttribute('fill', 'url(#pp-rows-detail)'));
  $('detail-hero').prepend(art);
}

function init() {
  initDetailArt();
  restoreLocation();
  try {
    const stored = localStorage.getItem(VARIETY_STORAGE_KEY);
    if (stored && RICE_VARIETIES.some(v => v.id === stored)) currentVarietyId = stored;
    const pd = localStorage.getItem(PLANT_DATE_STORAGE_KEY);
    if (pd && /^\d{4}-\d{2}-\d{2}$/.test(pd) && !isNaN(parseDay(pd))) currentPlantDate = pd;
  } catch (_) {}

  renderHeaderBits();
  initSheet();

  ['all', 'blast', 'hdb', 'bercak', 'wereng'].forEach(id => {
    $('ftab-' + id).addEventListener('click', () => { currentForecastDisease = id; if (lastData) renderForecast(); });
  });
  ['rh', 'suhu', 'hujan'].forEach(t => {
    $('wtab-' + t).addEventListener('click', () => { currentWeatherTab = t; renderWeatherChart(); });
  });
  $('share-home').addEventListener('click', () => shareAlert(null));
  $('plant-date').addEventListener('change', e => setPlantDate(e.target.value));
  $('plant-clear').addEventListener('click', () => { setPlantDate(null); $('plant-date').focus(); });
  $('share-detail').addEventListener('click', () => shareAlert(currentDetailId));
  $('share-detail-top').addEventListener('click', () => shareAlert(currentDetailId));

  window.addEventListener('hashchange', route);
  route();
  fetchAndRender();
  detectGeolocation();
  weatherTimer = setInterval(() => {
    if (Date.now() - lastWeatherUpdate >= WEATHER_REFRESH_MS) fetchAndRender();
  }, 60000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
