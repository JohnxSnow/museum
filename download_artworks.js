/**
 * Download real high-res images of all 32 masterpiece paintings via Wikimedia API
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const ARTWORKS = [
  // Original 20
  { filename: 'mona_lisa.jpg', fileTitle: 'File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg' },
  { filename: 'starry_night.jpg', fileTitle: 'File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg' },
  { filename: 'pearl_earring.jpg', fileTitle: 'File:1665_Girl_with_a_Pearl_Earring.jpg' },
  { filename: 'creation_of_adam.jpg', fileTitle: 'File:Michelangelo_-_Creation_of_Adam_(cropped).jpg' },
  { filename: 'night_watch.jpg', fileTitle: 'File:The_Night_Watch_-_HD.jpg' },
  { filename: 'birth_of_venus.jpg', fileTitle: 'File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg' },
  { filename: 'sunflowers.jpg', fileTitle: 'File:Vincent_Willem_van_Gogh_127.jpg' },
  { filename: 'cafe_terrace.jpg', fileTitle: 'File:Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_(Yorck).jpg' },
  { filename: 'water_lilies.jpg', fileTitle: 'File:Claude_Monet,_Water-Lily_Pond_and_Weeping_Willow.JPG' },
  { filename: 'impression_sunrise.jpg', fileTitle: 'File:Monet_-_Impression,_Sunrise.jpg' },
  { filename: 'the_kiss.jpg', fileTitle: 'File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg' },
  { filename: 'the_scream.jpg', fileTitle: 'File:Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg' },
  { filename: 'great_wave.jpg', fileTitle: 'File:Tsunami_by_hokusai_19th_century.jpg' },
  { filename: 'wanderer_fog.jpg', fileTitle: 'File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg' },
  { filename: 'liberty_leading.jpg', fileTitle: 'File:Eugène_Delacroix_-_Le_28_Juillet._La_Liberté_guidant_le_peuple.jpg' },
  { filename: 'erbil_citadel.jpg', fileTitle: 'File:Hawler_Castle.jpg' },
  { filename: 'zagros_mountains.jpg', fileTitle: 'File:Zagros_mountains.jpg' },
  { filename: 'hawraman_village.jpg', fileTitle: 'File:Palangan_Village_in_Hawraman,_Kamyaran,Kurdistan,_Iran.JPG' },
  { filename: 'ishtar_gate.jpg', fileTitle: 'File:Ishtar_Gate_at_Berlin_Museum.jpg' },
  { filename: 'zagros_nomads.jpg', fileTitle: 'File:Kurdish_nomad_girl_with_lambs.jpg' },

  // 12 New World Masterpieces
  { filename: 'last_supper.jpg', fileTitle: 'File:Leonardo_da_Vinci_(1452-1519)_-_The_Last_Supper_(1495-1498).jpg' },
  { filename: 'school_of_athens.jpg', fileTitle: 'File:Raphael_School_of_Athens.jpg' },
  { filename: 'las_meninas.jpg', fileTitle: 'File:Diego_Velázquez_Las_Meninas_Die_Hoffräulein.jpg' },
  { filename: 'arnolfini_portrait.jpg', fileTitle: 'File:Jan_van_Eyck_001.jpg' },
  { filename: 'sunday_grande_jatte.jpg', fileTitle: "File:Georges_Seurat_-_Un_dimanche_après-midi_à_l'île_de_la_Grande_Jatte.jpg" },
  { filename: 'american_gothic.jpg', fileTitle: 'File:Grant_DeVolson_Wood_-_American_Gothic.jpg' },
  { filename: 'nighthawks.jpg', fileTitle: 'File:Nighthawks_by_Edward_Hopper_1942.jpg' },
  { filename: 'garden_of_delights.jpg', fileTitle: 'File:Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_The_Earthly_Paradise_(Garden_of_Eden).jpg' },
  { filename: 'woman_with_parasol.jpg', fileTitle: 'File:Claude_Monet_023.jpg' },
  { filename: 'lion_of_babylon.jpg', fileTitle: 'File:Processional_Way,_Babylon_-_Google_Art_Project.jpg' },
  { filename: 'arch_of_ctesiphon.jpg', fileTitle: 'File:ArchOfCtesiphon.jpg' },
  { filename: 'kurdish_folklore.jpg', fileTitle: 'File:The_people_of_Kurdish_land_in_Iran.jpg' }
];

const USER_AGENT = 'VirtualArtGalleryBot/1.0 (https://github.com/example; artgallery@example.com)';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('========================================================');
  console.log(`Checking and Downloading all ${ARTWORKS.length} Masterpiece Paintings`);
  console.log('========================================================');

  let successCount = 0;

  for (const art of ARTWORKS) {
    const dest = path.join(IMAGES_DIR, art.filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log(`[Already Exists] ${art.filename} (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
      successCount++;
      continue;
    }

    try {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(art.fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
      const json = await fetchJson(apiUrl);
      const page = Object.values(json.query.pages)[0];

      if (!page || !page.imageinfo || !page.imageinfo[0]) {
        console.warn(`[No info for] ${art.fileTitle}`);
        continue;
      }

      const thumbUrl = page.imageinfo[0].thumburl || page.imageinfo[0].url;
      console.log(`Downloading ${art.filename}...`);
      await downloadBinary(thumbUrl, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`[Success] ${art.filename} (${size} KB)`);
      successCount++;
    } catch (err) {
      console.warn(`[Failed ${art.filename}] ${err.message}`);
    }
  }

  console.log('========================================================');
  console.log(`Done! ${successCount} of ${ARTWORKS.length} real images ready in images/`);
  console.log('========================================================');
}

run();
