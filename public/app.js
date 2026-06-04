const API_BASE_URL = window.location.origin;
const WEATHER_REFRESH_MS = 300000;
const VARIETY_STORAGE_KEY  = 'sipopt:varietyId';
const PROVINCE_STORAGE_KEY = 'sipopt:provinceId';
const CITY_STORAGE_KEY     = 'sipopt:cityName';

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
  { id: 'cakrabuana',       name: 'Cakrabuana Agritan (2018)',    group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: 'AT', bercak: null, note: 'Super genjah 104 HSS (panen 75–80 HST). Potensi 10,2 t/ha. Agak tahan WBC 1-2-3. Hindari lahan endemis HDB IV/VIII.' },
  { id: 'padjadjaran',      name: 'Padjadjaran Agritan (2018)',   group: 'rekomendasi', hdb: 'AT', blas: 'R',  wereng: 'AT', bercak: null, note: 'Potensi 11,0 t/ha; genjah 105 HSS. Agak tahan WBC 1-2. Hindari lahan endemis HDB IV/VIII.' },
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
let lastWeatherUpdate = 0;
let weatherChart = null;
let rainChart = null;
let lastForecast = null;
let lastWeatherSnapshot = null;
let currentForecastDisease = 'all';
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

// ── Province & City Selectors ────────────────────────────────────────────────

function initProvinceSelector() {
  const sel = document.getElementById('province-selector');
  PROVINCES.forEach((prov, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = prov.name;
    if (i === currentProvinceIndex) opt.selected = true;
    sel.appendChild(opt);
  });
}

function populateCitySelector() {
  const sel    = document.getElementById('city-selector');
  const cities = PROVINCES[currentProvinceIndex].cities;
  clearChildren(sel);
  cities.forEach((city, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = city.name;
    if (i === currentCityIndex) opt.selected = true;
    sel.appendChild(opt);
  });
}

function onProvinceChange() {
  const sel = document.getElementById('province-selector');
  currentProvinceIndex = parseInt(sel.value, 10);
  currentCityIndex = 0;
  populateCitySelector();
  saveLocation();
  lastWeatherUpdate = 0;
  fetchAndRender();
}

function onCityChange() {
  const sel = document.getElementById('city-selector');
  currentCityIndex = parseInt(sel.value, 10);
  saveLocation();
  lastWeatherUpdate = 0;
  fetchAndRender();
}

// ── GPS Geolocation ──────────────────────────────────────────────────────────

function detectGeolocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      let minDist = Infinity;
      let nearestProv = 0;
      let nearestCity = 0;

      PROVINCES.forEach((prov, pi) => {
        prov.cities.forEach((city, ci) => {
          const d = haversineKm(latitude, longitude, city.lat, city.lon);
          if (d < minDist) { minDist = d; nearestProv = pi; nearestCity = ci; }
        });
      });

      if (nearestProv === currentProvinceIndex && nearestCity === currentCityIndex) return;

      currentProvinceIndex = nearestProv;
      currentCityIndex = nearestCity;

      const provSel = document.getElementById('province-selector');
      provSel.value = String(currentProvinceIndex);
      populateCitySelector();
      document.getElementById('city-selector').value = String(currentCityIndex);

      saveLocation();

      const geoStatus = document.getElementById('geo-status');
      if (geoStatus) {
        geoStatus.textContent = `📡 GPS: ${PROVINCES[currentProvinceIndex].cities[currentCityIndex].name}`;
        geoStatus.classList.remove('hidden');
        setTimeout(() => geoStatus.classList.add('hidden'), 6000);
      }

      lastWeatherUpdate = 0;
      fetchAndRender();
    },
    null,
    { timeout: 10000, maximumAge: 300000 }
  );
}

// ── Variety Selector (searchable combobox) ───────────────────────────────────

const VARIETY_GROUP_LABELS = {
  default:     'Default',
  rekomendasi: 'Rekomendasi tanam Kalbar (Tabel 1 & 1B)',
  referensi:   'Varietas referensi / kontrol (Tabel 2)',
};

let varietyFilteredList = [];
let varietyHighlightIndex = -1;

function initVarietySelector() {
  const stored = localStorage.getItem(VARIETY_STORAGE_KEY);
  if (stored && RICE_VARIETIES.some(v => v.id === stored)) currentVarietyId = stored;

  const trigger = document.getElementById('variety-trigger');
  const search  = document.getElementById('variety-search');
  const list    = document.getElementById('variety-list');
  const wrap    = document.getElementById('variety-selector-wrap');

  setVarietyTriggerLabel();
  renderVarietyNote();

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isVarietyPanelOpen()) closeVarietyPanel();
    else openVarietyPanel();
  });

  search.addEventListener('input', () => {
    varietyHighlightIndex = -1;
    renderVarietyList(search.value.trim());
  });

  search.addEventListener('keydown', onVarietySearchKeydown);

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeVarietyPanel();
  });

  list.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('[data-variety-id]');
    if (!btn) return;
    e.preventDefault();
    selectVariety(btn.dataset.varietyId);
  });
}

function setVarietyTriggerLabel() {
  const label = document.getElementById('variety-label');
  if (label) label.textContent = getCurrentVariety().name;
}

function isVarietyPanelOpen() {
  return !document.getElementById('variety-panel').classList.contains('hidden');
}

function openVarietyPanel() {
  const panel  = document.getElementById('variety-panel');
  const search = document.getElementById('variety-search');
  const trigger = document.getElementById('variety-trigger');
  varietyHighlightIndex = -1;
  search.value = '';
  renderVarietyList('');
  panel.classList.remove('hidden');
  trigger.setAttribute('aria-expanded', 'true');
  setTimeout(() => search.focus(), 0);
}

function closeVarietyPanel() {
  const panel  = document.getElementById('variety-panel');
  const search = document.getElementById('variety-search');
  const trigger = document.getElementById('variety-trigger');
  panel.classList.add('hidden');
  trigger.setAttribute('aria-expanded', 'false');
  search.value = '';
  varietyHighlightIndex = -1;
}

function filterVarieties(query) {
  const q = query.trim().toLowerCase();
  if (!q) return RICE_VARIETIES;
  return RICE_VARIETIES.filter(v =>
    v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
  );
}

function renderVarietyList(query) {
  const list = document.getElementById('variety-list');
  varietyFilteredList = filterVarieties(query);
  list.innerHTML = '';

  if (varietyFilteredList.length === 0) {
    list.innerHTML = '<p class="px-3 py-2 text-xs text-gray-500">Varietas tidak ditemukan</p>';
    return;
  }

  let lastGroup = null;
  varietyFilteredList.forEach((v, i) => {
    if (v.group !== lastGroup) {
      lastGroup = v.group;
      const label = document.createElement('div');
      label.className = 'px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100';
      label.textContent = VARIETY_GROUP_LABELS[v.group] || v.group;
      list.appendChild(label);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.varietyId = v.id;
    btn.dataset.listIndex = String(i);
    btn.className = 'variety-option block w-full text-left px-3 py-2 text-sm hover:bg-green-50'
      + (v.id === currentVarietyId ? ' bg-green-50 font-medium text-green-800' : ' text-gray-800');
    btn.textContent = v.name;
    list.appendChild(btn);
  });
  updateVarietyHighlight();
}

function updateVarietyHighlight() {
  const list = document.getElementById('variety-list');
  list.querySelectorAll('.variety-option').forEach(el => {
    const hi = Number(el.dataset.listIndex) === varietyHighlightIndex;
    el.classList.toggle('variety-option-highlight', hi);
    if (hi) el.scrollIntoView({ block: 'nearest' });
  });
}

function onVarietySearchKeydown(e) {
  const n = varietyFilteredList.length;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!n) return;
    varietyHighlightIndex = varietyHighlightIndex < n - 1 ? varietyHighlightIndex + 1 : 0;
    updateVarietyHighlight();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!n) return;
    varietyHighlightIndex = varietyHighlightIndex > 0 ? varietyHighlightIndex - 1 : n - 1;
    updateVarietyHighlight();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (varietyHighlightIndex >= 0 && varietyFilteredList[varietyHighlightIndex]) {
      selectVariety(varietyFilteredList[varietyHighlightIndex].id);
    } else if (n === 1) {
      selectVariety(varietyFilteredList[0].id);
    }
  } else if (e.key === 'Escape') {
    closeVarietyPanel();
    document.getElementById('variety-trigger').focus();
  }
}

function selectVariety(id) {
  if (!RICE_VARIETIES.some(v => v.id === id)) return;
  currentVarietyId = id;
  setVarietyTriggerLabel();
  closeVarietyPanel();
  applyVarietyChange();
}

function applyVarietyChange() {
  try { localStorage.setItem(VARIETY_STORAGE_KEY, currentVarietyId); } catch (_) {}
  renderVarietyNote();
  if (lastWeatherSnapshot) {
    const { current, cumulative } = lastWeatherSnapshot;
    const diseases = calculateDiseaseRisks(current.suhu, current.rh, current.hujan_7hari, cumulative);
    updateRiskSection(diseases);
  }
  if (lastForecast) updateForecastSection(lastForecast);
}

function renderVarietyNote() {
  const v   = getCurrentVariety();
  const box = document.getElementById('variety-note');
  if (!v.note) { box.classList.add('hidden'); box.textContent = ''; return; }
  box.classList.remove('hidden');
  box.textContent = v.note;
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
  const variety  = getCurrentVariety();
  if (variety.id === 'umum') return disease;

  const reactKey = diseaseReactionKey(disease.id);
  const reaction = reactKey ? variety[reactKey] : null;
  if (!reaction) {
    disease.detail = `${disease.detail} · ${variety.name.split(' ')[0]} ${variety.name.split(' ')[1] || ''}: data ${diseaseReactionTag(disease.id)} tidak diuji`;
    return disease;
  }

  const extreme  = isExtremePressure(disease.id, ctx);
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

// ── Disease Risk ─────────────────────────────────────────────────────────────

function calculateDiseaseRisks(suhu, rh, hujan7hari, cum) {
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
  return diseases.map(d => applyVarietyToDisease(d, ctx));
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

function getForecastRiskLevel(suhu_avg, rh_max, hujan7hari, disease) {
  if (disease === 'all') {
    const levels = ['blast','bercak','hdb','wereng'].map(d => getForecastRiskLevel(suhu_avg, rh_max, hujan7hari, d));
    if (levels.includes('TINGGI')) return 'TINGGI';
    if (levels.includes('SEDANG')) return 'SEDANG';
    return 'RENDAH';
  }
  const base = getForecastBaseLevel(suhu_avg, rh_max, hujan7hari, disease);
  return applyForecastVarietyModifier(base, disease, suhu_avg, rh_max, hujan7hari);
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

function setLabel(id, info) {
  const el = document.getElementById(id);
  el.textContent = info.label;
  el.className   = `text-xs mt-1 font-medium ${info.color}`;
}

function updateWeatherCards(current) {
  document.getElementById('weather-suhu').textContent    = current.suhu;
  document.getElementById('weather-rh').textContent      = current.rh;
  document.getElementById('weather-tekanan').textContent = current.tekanan ?? '--';
  document.getElementById('weather-hujan').textContent   = current.hujan_7hari;
  setLabel('weather-suhu-label',    getSuhuInfo(current.suhu));
  setLabel('weather-rh-label',      getRhInfo(current.rh));
  setLabel('weather-tekanan-label', getPressureInfo(current.tekanan));
  setLabel('weather-hujan-label',   getHujanInfo(current.hujan_7hari));
  document.getElementById('weather-section').classList.remove('hidden');
}

function updateRiskSection(diseases) {
  const container = document.getElementById('risk-cards');
  clearChildren(container);
  diseases.forEach(d => {
    const card  = mk('div', `rounded-lg border px-3 py-2 flex items-center gap-2 ${d.cls}`);
    const icon  = mk('span', 'text-base flex-shrink-0', d.icon);
    const body  = mk('div', 'flex-1 min-w-0');
    const label = mk('div', 'font-semibold text-xs', `${d.name} — ${d.level}`);
    const det   = mk('div', 'text-xs opacity-75 truncate', d.detail);
    body.appendChild(label);
    body.appendChild(det);
    card.appendChild(icon);
    card.appendChild(body);
    container.appendChild(card);
  });
  document.getElementById('risk-section').classList.remove('hidden');
}

function showWeatherTab(tab) {
  document.getElementById('weather-chart-suhu-rh').classList.toggle('hidden', tab !== 'suhu-rh');
  document.getElementById('weather-chart-hujan').classList.toggle('hidden',   tab !== 'hujan');
  document.getElementById('wtab-suhu-rh').classList.toggle('active', tab === 'suhu-rh');
  document.getElementById('wtab-hujan').classList.toggle('active',   tab === 'hujan');
}

function updateWeatherChart(history) {
  const labels   = history.map(r => new Date(r.created_at).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }));
  const suhuData = history.map(r => r.suhu);
  const rhData   = history.map(r => r.rh);
  const ctx      = document.getElementById('weatherChart').getContext('2d');
  if (weatherChart) {
    weatherChart.data.labels = labels;
    weatherChart.data.datasets[0].data = suhuData;
    weatherChart.data.datasets[1].data = rhData;
    weatherChart.update();
  } else {
    weatherChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [
        { label:'Suhu (°C)', data:suhuData, borderColor:'rgb(239,68,68)',  backgroundColor:'rgba(239,68,68,0.08)',  tension:0.4, fill:false, pointRadius:2, yAxisID:'yLeft'  },
        { label:'RH (%)',    data:rhData,   borderColor:'rgb(59,130,246)', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, fill:false, pointRadius:2, yAxisID:'yRight' },
      ]},
      options: {
        responsive:true, maintainAspectRatio:false,
        interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ display:true, position:'top', labels:{ boxWidth:10, font:{ size:11 } } } },
        scales: {
          yLeft:  { type:'linear', position:'left',  min:20, max:40,  ticks:{ callback:v => v+'°C', color:'rgb(239,68,68)',  font:{size:10} }, grid:{ color:'rgba(0,0,0,0.05)' } },
          yRight: { type:'linear', position:'right', min:40, max:100, ticks:{ callback:v => v+'%',  color:'rgb(59,130,246)', font:{size:10} }, grid:{ drawOnChartArea:false } },
          x: { ticks:{ maxRotation:45, minRotation:45, maxTicksLimit:8, font:{size:10} } },
        },
      },
    });
  }
  updateRainChart(history);
  document.getElementById('weather-chart-section').classList.remove('hidden');
}

function updateRainChart(history) {
  const labels = history.map(r => new Date(r.created_at).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }));
  const values = history.map(r => r.hujan_mm);
  const ctx    = document.getElementById('rainChart').getContext('2d');
  if (rainChart) {
    rainChart.data.labels = labels;
    rainChart.data.datasets[0].data = values;
    rainChart.update();
  } else {
    rainChart = new Chart(ctx, {
      type:'bar',
      data:{ labels, datasets:[{ label:'Hujan (mm/jam)', data:values, backgroundColor:'rgba(59,130,246,0.6)', borderColor:'rgb(59,130,246)', borderWidth:1 }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false } },
        scales:{
          y:{ beginAtZero:true, ticks:{ callback:v => v+'mm', font:{size:10} } },
          x:{ ticks:{ maxRotation:45, minRotation:45, maxTicksLimit:8, font:{size:10} } },
        },
      },
    });
  }
}

function changeForecastTab(disease) {
  currentForecastDisease = disease;
  ['all','blast','bercak','hdb','wereng'].forEach(id => {
    const btn = document.getElementById('ftab-' + id);
    if (btn) btn.classList.toggle('active', id === disease);
  });
  if (lastForecast) updateForecastSection(lastForecast);
}

function updateForecastSection(forecast) {
  if (!forecast || !forecast.length) return;
  lastForecast = forecast;
  const container = document.getElementById('forecast-scroll');
  clearChildren(container);

  const dayNames   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  const riskColors = { TINGGI:'bg-red-50 border-red-400', SEDANG:'bg-yellow-50 border-yellow-400', RENDAH:'bg-green-50 border-green-400' };
  const riskIcons  = { TINGGI:'🚨', SEDANG:'⚠️', RENDAH:'🌿' };
  const riskText   = { TINGGI:'text-red-700', SEDANG:'text-yellow-700', RENDAH:'text-green-700' };

  forecast.forEach((day, i) => {
    const date    = new Date(day.date + 'T00:00:00');
    const suhuAvg = +((day.suhu_max + day.suhu_min) / 2).toFixed(0);
    const level   = getForecastRiskLevel(suhuAvg, day.rh_max, day.hujan_7hari, currentForecastDisease);
    const rainIcon = day.hujan > 8 ? '🌧️' : day.hujan > 1 ? '🌦️' : '☀️';
    const isToday  = i === 0;

    const card = mk('div', `flex-shrink-0 w-[68px] rounded-lg border-2 p-1.5 text-center ${riskColors[level]}${isToday ? ' ring-2 ring-green-500' : ''}`);
    card.title = `${day.date} — Risiko ${level}\nRH maks ${day.rh_max}%, Hujan 7hr ${day.hujan_7hari}mm`;
    card.appendChild(mk('div', 'text-xs font-bold text-gray-700 leading-tight', isToday ? 'Hari ini' : dayNames[date.getDay()]));
    card.appendChild(mk('div', 'text-xs text-gray-500', `${date.getDate()} ${monthNames[date.getMonth()]}`));
    card.appendChild(mk('div', 'text-lg my-0.5', rainIcon));
    card.appendChild(mk('div', 'text-xs font-semibold text-gray-800', `${day.suhu_max}°/${day.suhu_min}°`));
    card.appendChild(mk('div', 'text-xs text-gray-500', `${day.rh_max}%`));
    card.appendChild(mk('div', 'text-base mt-0.5', riskIcons[level]));
    card.appendChild(mk('div', `text-xs font-bold leading-tight ${riskText[level]}`, level));
    container.appendChild(card);
  });

  document.getElementById('forecast-section').classList.remove('hidden');
}

function toggleDiseaseInfo() {
  const panel = document.getElementById('disease-info-panel');
  const label = document.getElementById('info-toggle-label');
  const open  = panel.classList.toggle('hidden');
  label.textContent = open ? 'Cara hitung' : 'Tutup';
}

// ── Weather Fetch ─────────────────────────────────────────────────────────────

function showLoadError() {
  const section = document.getElementById('loading-section');
  clearChildren(section);
  section.classList.remove('pulse');
  const icon = mk('div', 'text-4xl mb-2', '⚠️');
  const msg  = mk('div', 'text-red-500 text-sm', 'Gagal memuat data. Coba lagi nanti.');
  section.appendChild(icon);
  section.appendChild(msg);
}

async function fetchAndRender() {
  try {
    const city = getCurrentCity();
    const url  = `${API_BASE_URL}/api/weather?lat=${city.lat}&lon=${city.lon}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    document.getElementById('loading-section').classList.add('hidden');
    updateWeatherCards(data.current);
    updateWeatherChart(data.history);
    lastWeatherSnapshot = { current: data.current, cumulative: data.cumulative };
    const diseases = calculateDiseaseRisks(data.current.suhu, data.current.rh, data.current.hujan_7hari, data.cumulative);
    updateRiskSection(diseases);
    if (data.forecast) updateForecastSection(data.forecast);
    document.getElementById('weather-dummy-warning').classList.toggle('hidden', !data.isDummy);
    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString('id-ID');
    lastWeatherUpdate = Date.now();
  } catch (err) {
    console.error('fetchAndRender error:', err);
    showLoadError();
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

function init() {
  restoreLocation();
  initProvinceSelector();
  populateCitySelector();
  initVarietySelector();
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
