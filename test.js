/**
 * Automated Verification Suite for Iron Man Comic 3D Portfolio
 * Tests Identity, Exclusions, Bookshelf, Comic Theme, Photos, and Zero Emojis
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('[TEST] Running Iron Man Comic Portfolio Verification Suite...\n');

// 1. Identity Verification
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(ROOT_DIR, 'main.js'), 'utf8');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');

assert(
  indexHtml.includes('Sabhaym Trivedi') && indexHtml.includes('sabhyamtrivedy@gmail.com'),
  'Identity verified: Sabhaym Trivedi and sabhyamtrivedy@gmail.com present'
);

// 2. Strict Exclusions Check
const hasHoloverse = /holoverse\s*ai/i.test(indexHtml) || /holoverse\s*ai/i.test(mainJs);
const hasVirtualTryOn = /virtual\s*try-?on/i.test(indexHtml) || /virtual\s*try-?on/i.test(mainJs);
const hasInspiredBy = /inspired\s*by/i.test(indexHtml) || /inspired\s*by/i.test(mainJs);

assert(
  !hasHoloverse && !hasVirtualTryOn && !hasInspiredBy,
  'Exclusions verified: No HoloVerse AI, No Virtual Try-On, No "inspired by"'
);

// 3. Bookshelf Check
const hasSteveJobs = indexHtml.includes('steve-jobs');
const hasZeroToOne = indexHtml.includes('zero-to-one');
const hasBuildDontTalk = indexHtml.includes('build-dont-talk');
const bookItemsCount = (indexHtml.match(/class="stark-book-item"/g) || []).length;

assert(
  hasSteveJobs && hasZeroToOne && hasBuildDontTalk && bookItemsCount === 3,
  'Bookshelf verified: Contains exactly 3 books (Steve Jobs, Zero to One, Build Don\'t Talk)'
);

// 4. Projects Verification
const hasSpark2Ship = indexHtml.includes('Spark2Ship');
const hasSabhyamAi = indexHtml.includes('Sabhyam AI');
const hasGestureSpatial = indexHtml.includes('Gesture Spatial Engine');

assert(
  hasSpark2Ship && hasSabhyamAi && hasGestureSpatial,
  'Projects verified: Spark2Ship, Sabhyam AI, Gesture Spatial Engine present'
);

// 5. Iron Man Theme & Comic Elements
const hasBangersFont = indexHtml.includes('family=Bangers');
const hasComicNeue = indexHtml.includes('family=Comic+Neue');
const hasOrbitron = indexHtml.includes('family=Orbitron');
const hasSpeechBalloon = stylesCss.includes('comic-speech-balloon');
const hasArcReactorCanvas = indexHtml.includes('id="arc-reactor-webgl-canvas"');
const hasThreeJsReactor = mainJs.includes('initThreeJsArcReactor');

assert(
  hasBangersFont && hasComicNeue && hasOrbitron && hasSpeechBalloon && hasArcReactorCanvas && hasThreeJsReactor,
  'Theme verified: Comic fonts (Bangers, Comic Neue, Orbitron), speech balloons, 3D WebGL Arc Reactor'
);

// 6. Iron Man Photos Verification
const imagesDir = path.join(ROOT_DIR, 'assets', 'images');
const imagesOnDisk = fs.readdirSync(imagesDir);
const ironManPhotos = imagesOnDisk.filter(f => 
  f.toLowerCase().includes('iron_man') || 
  f.toLowerCase().includes('hulkbuster') || 
  f.toLowerCase().includes('arc_reactor')
);

assert(
  ironManPhotos.length >= 8,
  `Photos verified: Found ${ironManPhotos.length} Iron Man photos/renders in assets/images`
);

// 7. Strict Zero Emojis Check
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F200}-\u{1F2FF}\u{1F680}-\u{1F6FF}\u{1F600}-\u{1F64F}\u{1F900}-\u{1F9FF}]/u;

let foundEmojis = [];
function checkEmojisInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      foundEmojis.push(`${path.basename(filePath)}:${idx + 1}`);
    }
  });
}

checkEmojisInFile(path.join(ROOT_DIR, 'index.html'));
checkEmojisInFile(path.join(ROOT_DIR, 'styles.css'));
checkEmojisInFile(path.join(ROOT_DIR, 'main.js'));

assert(
  foundEmojis.length === 0,
  foundEmojis.length === 0
    ? 'Strict zero emojis verified: 0 emojis across HTML, CSS, and JS'
    : `Emojis detected in: ${foundEmojis.join(', ')}`
);

console.log(`\n[RESULTS] ${passed}/${total} tests passed.\n`);

if (passed !== total) {
  process.exit(1);
}
