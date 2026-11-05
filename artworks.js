function getArtImage(filename) {
  if (typeof ARTWORK_IMAGES !== 'undefined' && ARTWORK_IMAGES[filename]) {
    return ARTWORK_IMAGES[filename];
  }
  return 'images/' + filename;
}

/**
 * ====================================================
 * Virtual Art Gallery - 56 Real World Masterpieces
 * 8 Grand Thematic Halls of the 180m Imperial Palace
 * Perfect Solid-Wall Mounts & Museum Alignment
 * ====================================================
 */

const GALLERY_ARTWORKS = [
  {
    "id": "mona-lisa",
    "titleKu": "مۆنا لیزا (لۆ جۆکۆندا)",
    "titleEn": "Mona Lisa (La Gioconda)",
    "artist": "لیۆناردۆ دا ڤینچی (Leonardo da Vinci)",
    "year": "1503 - 1519",
    "genre": "ڕێنیسانسی باڵا • High Renaissance",
    "technique": "ڕۆنی لەسەر داری سپیدار",
    "dimensions": "77 × 53 cm",
    "hall": "هۆڵی باکوور: ڕێنیسانسی باڵا",
    "location": "مۆزەخانەی لۆڤەر، پاریس (Louvre, Paris)",
    "isVip": true,
    "localImage": "images/mona_lisa.jpg",
    "wallPosition": {
      "x": 0,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 3.8,
    "height": 5,
    "descKu": "بەناوبانگترین تابلۆ لە مێژووی مرۆڤایەتیدا. زەردەخەنە پڕ لە نهێنییەکەی لیسا جێراردینی و تەکنیکی ناسکی (Sfumato)ی دا ڤینچی جیهانی سەرسام کردووە.",
    "descEn": "The most famous portrait in human history. Leonardo da Vinci’s mastery of sfumato creates Mona Lisa’s enigmatic smile and ethereal background."
  },
  {
    "id": "creation-of-adam",
    "titleKu": "دروستکردنی ئادەم",
    "titleEn": "The Creation of Adam",
    "artist": "میکێلانجێلۆ (Michelangelo)",
    "year": "1512",
    "genre": "ڕێنیسانس • Sistine Chapel Fresco",
    "technique": "فرێسکۆ لەسەر گەچ",
    "dimensions": "280 × 570 cm",
    "hall": "هۆڵی باکوور: ڕێنیسانسی باڵا",
    "location": "کەنیسەی سیستین، ڤاتیکان (Vatican)",
    "isVip": true,
    "localImage": "images/creation_of_adam.jpg",
    "wallPosition": {
      "x": 12.5,
      "y": 3.8,
      "z": -33
    },
    "rotationY": -Math.PI / 2,
    "width": 6.2,
    "height": 3.5,
    "descKu": "لووتکەی شاکارەکانی هونەری ڕێنیسانس. تیشکی بەخشینی ژیان کاتێک پەنجەی خودا و ئادەم نزیک دەبنەوە، هێمایە بۆ دروستبوونی هۆشیاری مرۆڤ.",
    "descEn": "A cornerstone of Renaissance art on the Sistine Chapel ceiling, depicting the near-touching fingers of God and Adam sparking human life."
  },
  {
    "id": "last-supper",
    "titleKu": "شێوی کۆتایی",
    "titleEn": "The Last Supper (Il Cenacolo)",
    "artist": "لیۆناردۆ دا ڤینچی (Leonardo da Vinci)",
    "year": "1495 - 1498",
    "genre": "ڕێنیسانس • Mural",
    "technique": "تێمپێرا و ڕۆن لەسەر دیوار",
    "dimensions": "460 × 880 cm",
    "hall": "هۆڵی باکوور: ڕێنیسانسی باڵا",
    "location": "دێری سانتا ماریا دێلی گرازی، میلان (Milan)",
    "isVip": true,
    "localImage": "images/last_supper.jpg",
    "wallPosition": {
      "x": -12.5,
      "y": 3.8,
      "z": -70
    },
    "rotationY": Math.PI / 2,
    "width": 6.8,
    "height": 3.8,
    "descKu": "ساتەوەختی دراماتیکی ڕاگەیاندنی خیانەت لەلایەن مەسیحەوە بۆ حەوارییەکان. شێوازی پرسپێکتیڤی ئەندازیاری و دەربڕینی هەستی کارەکتەرەکان بێ وێنەیە.",
    "descEn": "One of history’s most revered religious masterpieces, capturing the psychological drama as Christ reveals one disciple will betray him."
  },
  {
    "id": "school-of-athens",
    "titleKu": "قوتابخانەی ئەسینا",
    "titleEn": "The School of Athens (Scuola di Atene)",
    "artist": "ڕافایێل (Raphael)",
    "year": "1509 - 1511",
    "genre": "ڕێنیسانسی باڵا • Fresco",
    "technique": "فرێسکۆ",
    "dimensions": "500 × 770 cm",
    "hall": "هۆڵی باکوور: ڕێنیسانسی باڵا",
    "location": "کۆشکی پاپا، ڤاتیکان (Apostolic Palace, Vatican)",
    "isVip": false,
    "localImage": "images/school_of_athens.jpg",
    "wallPosition": {
      "x": -12.5,
      "y": 3.8,
      "z": -33
    },
    "rotationY": Math.PI / 2,
    "width": 6.2,
    "height": 4.4,
    "descKu": "کۆبوونەوەی گەورە فەیلەسووف و بیرمەندانی گریک وەک ئەفلاتوون، ئەرستۆ و سوکرات لە ژێر کەوانە و بیناسازییەکی کلاسیکی باڵادا.",
    "descEn": "Raphael’s celebration of philosophy and classical antiquity, uniting Plato, Aristotle, and other ancient thinkers beneath grand Roman arches."
  },
  {
    "id": "pearl-earring",
    "titleKu": "کچێک بە گوارەی یاقووتەوە",
    "titleEn": "Girl with a Pearl Earring",
    "artist": "یۆهانس ڤێرمیر (Johannes Vermeer)",
    "year": "1665",
    "genre": "سەردەمی زێڕینی هۆڵەندا • Baroque Tronie",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "44.5 × 39 cm",
    "hall": "باڵی باکووری ڕۆژهەڵات: بارۆک و هۆڵەندا",
    "location": "مۆزەخانەی مۆریتسویس، لاهای (Mauritshuis, The Hague)",
    "isVip": true,
    "localImage": "images/pearl_earring.jpg",
    "wallPosition": {
      "x": 26,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 3.4,
    "height": 4.2,
    "descKu": "ناسراو بە \"مۆنا لیزای باکوور\". نیگای سەرنجڕاکێشی کچەکە لەگەڵ یاقووتە بریسکەدارەکەی گوێی، بە ڕۆشناییەکی ناسک و پەتی سەرسوڕهێنەر دەدرەوشێتەوە.",
    "descEn": "Often called the Dutch Mona Lisa, Vermeer captures an intimate, luminous moment with a shimmering pearl against a deep dark background."
  },
  {
    "id": "night-watch",
    "titleKu": "ئێشکگری شەوانە",
    "titleEn": "The Night Watch (Militia Company)",
    "artist": "ڕێمبرانت ڤان ڕین (Rembrandt van Rijn)",
    "year": "1642",
    "genre": "بارۆکی هۆڵەندی • Baroque Masterpiece",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "363 × 437 cm",
    "hall": "باڵی باکووری ڕۆژهەڵات: بارۆک و هۆڵەندا",
    "location": "مۆزەخانەی ڕایکس، ئەمستردام (Rijksmuseum, Amsterdam)",
    "isVip": true,
    "localImage": "images/night_watch.jpg",
    "wallPosition": {
      "x": 57.5,
      "y": 3.8,
      "z": -64
    },
    "rotationY": -Math.PI / 2,
    "width": 6.4,
    "height": 4.6,
    "descKu": "شاکاری گەورەی ڕێمبرانت لە بەکارهێنانی تیشک و سێبەر (Chiaroscuro). تابلۆکە پاسەوانانی شاری ئەمستردام نیشان دەدات لە جووڵەیەکی دراماتیکدا.",
    "descEn": "Rembrandt’s colossal militia portrait, famous for dramatic use of chiaroscuro light and lifelike perception of motion in civic guards."
  },
  {
    "id": "arnolfini-portrait",
    "titleKu": "پۆرترێتی هاوسەرگیری ئارنۆڵفینی",
    "titleEn": "The Arnolfini Portrait",
    "artist": "یان ڤان ئایک (Jan van Eyck)",
    "year": "1434",
    "genre": "ڕێنیسانسی سەرەتایی هۆڵەندی",
    "technique": "ڕۆنی لەسەر دار بەڕوو",
    "dimensions": "82.2 × 60 cm",
    "hall": "باڵی باکووری ڕۆژهەڵات: بارۆک و هۆڵەندا",
    "location": "گەلەری نیشتمانی، لەندەن (National Gallery, London)",
    "isVip": false,
    "localImage": "images/arnolfini_portrait.jpg",
    "wallPosition": {
      "x": 46,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 3.2,
    "height": 4.2,
    "descKu": "شاکارێکی تژی لە هێماگەری ئایینی و کۆمەڵایەتی. ئاوێنەی بازنەیی پاشەوە وێنەی دوو شایەتی ناو ژوورەکە دەردەخات بە وردەکارییەکی بێ هاوتا.",
    "descEn": "Van Eyck’s astonishingly detailed double portrait, acclaimed for its convex mirror reflecting the room and symbolic domestic iconography."
  },
  {
    "id": "las-meninas",
    "titleKu": "کچە خزمەتکارەکان (لاس مێنیناس)",
    "titleEn": "Las Meninas (The Ladies-in-Waiting)",
    "artist": "دیێگۆ ڤێلازکێز (Diego Velázquez)",
    "year": "1656",
    "genre": "بارۆکی ئیسپانی • Spanish Golden Age",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "318 × 276 cm",
    "hall": "باڵی باکووری ڕۆژهەڵات: بارۆک و هۆڵەندا",
    "location": "مۆزەخانەی پرادۆ، مەدرید (Museo del Prado, Madrid)",
    "isVip": false,
    "localImage": "images/las_meninas.jpg",
    "wallPosition": {
      "x": 57.5,
      "y": 3.8,
      "z": -46
    },
    "rotationY": -Math.PI / 2,
    "width": 4.2,
    "height": 4.8,
    "descKu": "یەکێک لە لێکۆڵینەوە کراوەترین تابلۆکانی مێژوو سەبارەت بە پەیوەندی نێوان بینەر، شێوەکار، و کەسایەتییە شاهانەییەکان.",
    "descEn": "Velázquez’s complex spatial illusion exploring reality and illusion, showing the young Infanta Margarita and the artist at his easel."
  },
  {
    "id": "starry-night",
    "titleKu": "شەوە ئەستێرەباراناوییەکە",
    "titleEn": "The Starry Night",
    "artist": "ڤینسێنت ڤان گۆگ (Vincent van Gogh)",
    "year": "1889",
    "genre": "پۆست-ئیمپڕێشنیزم • Post-Impressionism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "73.7 × 92.1 cm",
    "hall": "هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم و تیشک",
    "location": "مۆزەخانەی هونەری مۆدێرن، نیویۆرک (MoMA, New York)",
    "isVip": true,
    "localImage": "images/starry_night.jpg",
    "wallPosition": {
      "x": 77.5,
      "y": 3.8,
      "z": 0
    },
    "rotationY": -Math.PI / 2,
    "width": 5.2,
    "height": 4,
    "descKu": "گەورەترین شاکاری ڤان گۆگ، وێنەی ئاسمانی شەو لە نەخۆشخانەی سان ڕێمی بە گێژەڵووکەی ئەستێرە زێڕینەکان و درەختی سەروی بەرزەوە.",
    "descEn": "Van Gogh’s visionary sky filled with whirling nocturnal eddies and glowing stars painted from his asylum window in Saint-Rémy."
  },
  {
    "id": "sunflowers",
    "titleKu": "گوڵەبەڕۆژەکان",
    "titleEn": "Sunflowers (Tournesols)",
    "artist": "ڤینسێنت ڤان گۆگ (Vincent van Gogh)",
    "year": "1888",
    "genre": "پۆست-ئیمپڕێشنیزم",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "92.1 × 73 cm",
    "hall": "هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم و تیشک",
    "location": "گەلەری نیشتمانی، لەندەن (National Gallery, London)",
    "isVip": false,
    "localImage": "images/sunflowers.jpg",
    "wallPosition": {
      "x": 28,
      "y": 3.8,
      "z": -12.5
    },
    "rotationY": 0,
    "width": 3.4,
    "height": 4.4,
    "descKu": "سەمفۆنیای ڕەنگی زەرد و تیشکی ڕۆژ. تابلۆیەکە کە خۆشەویستی و هیوا نیشان دەدات لە ڕێگەی سروشتی گوڵەبەڕۆژەی ئارلەوە.",
    "descEn": "Van Gogh’s luminous symphony in yellow celebrating gratitude, vibrancy, and the radiant sunlight of Arles."
  },
  {
    "id": "cafe-terrace",
    "titleKu": "تەراسەی کافێ لە شەودا",
    "titleEn": "Café Terrace at Night",
    "artist": "ڤینسێنت ڤان گۆگ (Vincent van Gogh)",
    "year": "1888",
    "genre": "پۆست-ئیمپڕێشنیزم",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "80.7 × 65.3 cm",
    "hall": "هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم و تیشک",
    "location": "مۆزەخانەی کرۆلەر-مۆلەر (Kröller-Müller Museum)",
    "isVip": false,
    "localImage": "images/cafe_terrace.jpg",
    "wallPosition": {
      "x": 28,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 3.5,
    "height": 4.4,
    "descKu": "یەکەم تابلۆی ڤان گۆگ کە ئاسمانی پڕ لە ئەستێرەی تێدا دەکێشێت بەبێ بەکارهێنانی ڕەنگی ڕەش بۆ شەو، تەنها بە زەردی تیشک و شینی قووڵ.",
    "descEn": "The first painting where Van Gogh depicted a starry nocturnal sky using pure glowing yellow and vibrant ultramarine blue without black."
  },
  {
    "id": "water-lilies",
    "titleKu": "نیلووفەرە ئاوییەکان",
    "titleEn": "Water Lilies (Nymphéas)",
    "artist": "کلۆد مۆنێ (Claude Monet)",
    "year": "1916 - 1919",
    "genre": "ئیمپڕێشنیزم • Impressionism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "200 × 180 cm",
    "hall": "هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم و تیشک",
    "location": "مۆزەخانەی ئۆرسای، پاریس (Musée d’Orsay, Paris)",
    "isVip": false,
    "localImage": "images/water_lilies.jpg",
    "wallPosition": {
      "x": 68,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 6.4,
    "height": 3.4,
    "descKu": "بەشێک لە زنجیرە شاکارەکەی مۆنێ لە باخچەی گیڤێرنی، تیشکدانەوەی هەورەکان و ئاو و نیلووفەرە نەرمەکان لە نێو شەپۆلی تیشکدا.",
    "descEn": "Monet’s meditation on light and reflection in his water garden at Giverny, dissolving water surface and reflections into serene color."
  },
  {
    "id": "impression-sunrise",
    "titleKu": "ئیمپڕێشن، خۆرهەڵاتن",
    "titleEn": "Impression, Sunrise (Impression, soleil levant)",
    "artist": "کلۆد مۆنێ (Claude Monet)",
    "year": "1872",
    "genre": "ئیمپڕێشنیزم (ناونانی بزووتنەوەکە)",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "48 × 63 cm",
    "hall": "باڵی باشووری ڕۆژهەڵات: خاڵکاری و ڕێنیسانس",
    "location": "مۆزەخانەی مارمۆتان مۆنێ، پاریس (Marmottan, Paris)",
    "isVip": false,
    "localImage": "images/impression_sunrise.jpg",
    "wallPosition": {
      "x": 26,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 4.6,
    "height": 3.4,
    "descKu": "ئەو تابلۆ مێژووییەی کە ناوی تەواوی بزووتنەوەی (ئیمپڕێشنیزم)ی لێ کەوتەوە. تەمومژی بەندەری لۆ هاڤر لە کاتی هەڵاتنی خۆری پرتەقاڵیدا.",
    "descEn": "The monumental canvas that gave the Impressionist movement its name, depicting the morning haze and orange sun of Le Havre harbor."
  },
  {
    "id": "woman-with-parasol",
    "titleKu": "ژنێک بە چەترەوە لە تیشکی خۆردا",
    "titleEn": "Woman with a Parasol (Madame Monet and Her Son)",
    "artist": "کلۆد مۆنێ (Claude Monet)",
    "year": "1875",
    "genre": "ئیمپڕێشنیزم",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "100 × 81 cm",
    "hall": "باڵی باشووری ڕۆژهەڵات: خاڵکاری و ڕێنیسانس",
    "location": "گەلەری نیشتمانی هونەر، واشنتۆن (NGA, Washington)",
    "isVip": false,
    "localImage": "images/woman_with_parasol.jpg",
    "wallPosition": {
      "x": 57.5,
      "y": 3.8,
      "z": 46
    },
    "rotationY": -Math.PI / 2,
    "width": 3.4,
    "height": 4.4,
    "descKu": "کامیل مۆنێ و کوڕەکەی جۆن لە گردێکی سەوزدا لە ژێر شنەبای تیشکاوی هاویندا بە هەڵکردنی چەترە سەوزەکە بەرامبەر باکە.",
    "descEn": "Monet captures his wife Camille and son Jean on a windy summer hill, brilliant with sunlight filtering through her green parasol."
  },
  {
    "id": "sunday-grande-jatte",
    "titleKu": "ڕۆژێکی یەکشەممە لە دوورگەی گراند ژات",
    "titleEn": "A Sunday on La Grande Jatte",
    "artist": "ژۆرج سیۆرا (Georges Seurat)",
    "year": "1884 - 1886",
    "genre": "پۆینتیلیزم • Pointillism / Neo-Impressionism",
    "technique": "ڕۆنی خاڵکاری ورد لەسەر کانڤاس",
    "dimensions": "207.5 × 308.1 cm",
    "hall": "باڵی باشووری ڕۆژهەڵات: خاڵکاری و ڕێنیسانس",
    "location": "پەیمانگای هونەری شیکاگۆ (Art Institute of Chicago)",
    "isVip": true,
    "localImage": "images/sunday_grande_jatte.jpg",
    "wallPosition": {
      "x": 57.5,
      "y": 3.8,
      "z": 64
    },
    "rotationY": -Math.PI / 2,
    "width": 6.2,
    "height": 4.2,
    "descKu": "شاکاری تەکنیکی خاڵکاری زانستی (پۆینتیلیزم). ملیۆنان خاڵی ڕەنگاوڕەنگی سەر کانڤاس لە چاوی بینەردا یەکدەگرنەوە بۆ نیشاندانی ژیانی پاریسی سەدە نۆزدەهەم.",
    "descEn": "Seurat’s pointillist triumph composed of millions of precise dots that optical blend in the viewer’s eye, depicting Parisian park leisure."
  },
  {
    "id": "birth-of-venus",
    "titleKu": "لەدایکبوونی ڤینۆس",
    "titleEn": "The Birth of Venus (Nascita di Venere)",
    "artist": "ساندرۆ بۆتیچێلی (Sandro Botticelli)",
    "year": "1485 - 1486",
    "genre": "سەرەتای ڕێنیسانس • Early Renaissance",
    "technique": "تێمپێرا لەسەر کانڤاس",
    "dimensions": "172.5 × 278.5 cm",
    "hall": "باڵی باشووری ڕۆژهەڵات: خاڵکاری و ڕێنیسانس",
    "location": "گەلەری ئۆفیزی، فلۆرێنس (Uffizi Gallery, Florence)",
    "isVip": true,
    "localImage": "images/birth_of_venus.jpg",
    "wallPosition": {
      "x": 46,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 6.4,
    "height": 4,
    "descKu": "هاتنەدەری خوداوەندی جوانی و خۆشەویستی لە قاوغێکی زەبەلاحی دەریاییەوە لە کەناراوەکان، یەکێک لە پیرۆزترین شاکارەکانی فلۆرێنس.",
    "descEn": "Botticelli’s legendary Renaissance icon depicting goddess Venus emerging from sea foam on a giant scallop shell pushed by wind gods."
  },
  {
    "id": "the-kiss",
    "titleKu": "ماچەکە (دێر کوس)",
    "titleEn": "The Kiss (Der Kuss)",
    "artist": "گوستاڤ کلیمت (Gustav Klimt)",
    "year": "1907 - 1908",
    "genre": "ڤیەنا سێسێشن • Symbolism & Art Nouveau",
    "technique": "ڕۆن و گەڵای زێڕینی تەنک لەسەر کانڤاس",
    "dimensions": "180 × 180 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "مۆزەخانەی بێلڤیدێر، ڤیەنا (Österreichische Galerie Belvedere)",
    "isVip": true,
    "localImage": "images/the_kiss.jpg",
    "wallPosition": {
      "x": 0,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 4.4,
    "height": 4.4,
    "descKu": "لووتکەی سەردەمی زێڕینی کلیمت. دوو هاوسەر لە نێو باوەشێکی زێڕین و ڕازاوەی نەخشی ئەندازیاریدا لەسەر لێواری گوڵزارێک یەک دەگرن.",
    "descEn": "Klimt’s golden phase masterpiece capturing passion draped in shimmering gold leaf and intricate geometric mosaic patterns."
  },
  {
    "id": "the-scream",
    "titleKu": "هاوارەکە (سکریم)",
    "titleEn": "The Scream (Skrik)",
    "artist": "ئێدڤارد مونک (Edvard Munch)",
    "year": "1893",
    "genre": "ئێکسپرێشنیزم • Expressionism",
    "technique": "ڕۆن، تێمپێرا و پاستێل لەسەر کارتۆن",
    "dimensions": "91 × 73.5 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "مۆزەخانەی نیشتمانی، ئۆسلۆ (National Museum, Oslo)",
    "isVip": true,
    "localImage": "images/the_scream.jpg",
    "wallPosition": {
      "x": 12.5,
      "y": 3.8,
      "z": 33
    },
    "rotationY": -Math.PI / 2,
    "width": 3.4,
    "height": 4.4,
    "descKu": "ڕەمزی پەژارە و دڵەڕاوکێی مرۆڤی مۆدێرن. شێوەیەکی مرۆیی لەسەر پردێک هاواری دەرەکی و ناوەکی خۆی بەرامبەر ئاسمانی خوێناوی دەردەبڕێت.",
    "descEn": "The iconic modern symbol of universal anxiety, depicting an agonized human figure clutching its face under an apocalyptic blood-red sky."
  },
  {
    "id": "great-wave",
    "titleKu": "شەپۆلە مەزنەکەی کاناگاوا",
    "titleEn": "The Great Wave off Kanagawa",
    "artist": "کاتسوشیکا هۆکوسای (Katsushika Hokusai)",
    "year": "1831",
    "genre": "ئۆکیۆ-ئی ژاپۆنی • Japanese Woodblock Print",
    "technique": "داری هەڵکۆڵراوی ڕەنگاوڕەنگ",
    "dimensions": "25.7 × 37.8 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "مۆزەخانەی میترۆپۆلیتان، نیویۆرک (Metropolitan Museum of Art)",
    "isVip": false,
    "localImage": "images/great_wave.jpg",
    "wallPosition": {
      "x": -7.5,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 5.2,
    "height": 3.6,
    "descKu": "بەناوبانگترین کاری هونەری ژاپۆن لە مێژوودا. شەپۆلێکی شینی نیلی بە هێزەوە بەرز دەبێتەوە لە کاتێکدا چیای پیرۆزی فوجی لە دوورەوە بچووک دەردەکەوێت.",
    "descEn": "Japan’s most famous woodblock print, showing a towering crested wave framing majestic Mount Fuji in vibrant Prussian blue."
  },
  {
    "id": "liberty-leading",
    "titleKu": "ئازادی ڕێبەری گەل دەکات",
    "titleEn": "Liberty Leading the People",
    "artist": "ئۆژین دێلاکروا (Eugène Delacroix)",
    "year": "1830",
    "genre": "ڕۆمانتیسیزم • Romanticism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "260 × 325 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "مۆزەخانەی لۆڤەر، پاریس (Louvre, Paris)",
    "isVip": false,
    "localImage": "images/liberty_leading.jpg",
    "wallPosition": {
      "x": -12.5,
      "y": 3.8,
      "z": 33
    },
    "rotationY": Math.PI / 2,
    "width": 5.4,
    "height": 4.2,
    "descKu": "هێمای شۆڕشی فەڕەنسی و خەبات بۆ ئازادی. ژنێک کە هێمای ماریانە ئاڵای سێ ڕەنگی فەڕەنسا بەرز دەکاتەوە بەسەر بەربەستەکاندا.",
    "descEn": "The stirring embodiment of the French Revolution, depicting Lady Liberty brandishing the tricolor flag and leading the populace."
  },
  {
    "id": "american-gothic",
    "titleKu": "گۆتیکی ئەمریکی",
    "titleEn": "American Gothic",
    "artist": "گرانت وود (Grant Wood)",
    "year": "1930",
    "genre": "ڕیالیزمی ئەمریکی • Regionalism",
    "technique": "ڕۆنی لەسەر تەختەی بیڤەربۆرد",
    "dimensions": "78 × 65.3 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "پەیمانگای هونەری شیکاگۆ (Art Institute of Chicago)",
    "isVip": false,
    "localImage": "images/american_gothic.jpg",
    "wallPosition": {
      "x": 12.5,
      "y": 3.8,
      "z": 70
    },
    "rotationY": -Math.PI / 2,
    "width": 3.4,
    "height": 4.2,
    "descKu": "ئایکۆنی کۆمەڵگەی گوندنشینی ئەمریکا. جووتیارێک بە داسێکی سێ چڵی لە دەستیدا لە تەنیشت کچەکەیەوە بەرامبەر خانوویەکی دارینی نەریتی وەستاوە.",
    "descEn": "One of the most recognizable icons of American 20th-century art, depicting a stalwart farmer with a pitchfork alongside his daughter."
  },
  {
    "id": "nighthawks",
    "titleKu": "بازەکانی شەو (نایت هۆکس)",
    "titleEn": "Nighthawks",
    "artist": "ئێدوارد هاپەر (Edward Hopper)",
    "year": "1942",
    "genre": "ڕیالیزمی مۆدێرن • Modern Realism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "84.1 × 152.4 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "پەیمانگای هونەری شیکاگۆ (Art Institute of Chicago)",
    "isVip": false,
    "localImage": "images/nighthawks.jpg",
    "wallPosition": {
      "x": -12.5,
      "y": 3.8,
      "z": 70
    },
    "rotationY": Math.PI / 2,
    "width": 5.4,
    "height": 3.4,
    "descKu": "شاکاری گۆشەگیری و تەنیایی شار لە کاتی شەودا. چێشتخانەیەکی شووشەیی ڕووناککراوە لە کۆڵانێکی چۆڵی نیویۆرکدا چوار کەسی بێدەنگ لەخۆ دەگرێت.",
    "descEn": "Hopper’s timeless portrayal of urban alienation, showing four solitary late-night patrons bathed in fluorescent light inside a diner."
  },
  {
    "id": "persistence-of-memory",
    "titleKu": "کاتی بەردەوام (کاتژمێرە تواوەکان)",
    "titleEn": "The Persistence of Memory",
    "artist": "سەلڤادۆر دالی (Salvador Dalí)",
    "year": "1931",
    "genre": "سوریالیزم • Surrealism Masterpiece",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "24 × 33 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی هونەری مۆدێرن، نیویۆرک (MoMA, New York)",
    "isVip": true,
    "localImage": "images/persistence_of_memory.jpg",
    "wallPosition": {
      "x": -20,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 4.6,
    "height": 3.4,
    "descKu": "شاکارە جیهانییەکەی دالی کە چەمکی کاتی تێدا شێواندووە. کاتژمێرە گیرفانییەکان وەک پەنیرێکی نەرم بەسەر لقە وشکەکان و پێکهاتە نامۆکاندا توواونەتەوە.",
    "descEn": "Dalí’s definitive surrealist masterpiece featuring melting pocket watches in a desolate dream landscape, challenging the rigidity of time."
  },
  {
    "id": "son-of-man",
    "titleKu": "کوڕی مرۆڤ (سێوی سەوز و کڵاوی ڕەش)",
    "titleEn": "The Son of Man (Le Fils de l’Homme)",
    "artist": "ڕێنێ ماگریت (René Magritte)",
    "year": "1964",
    "genre": "سوریالیزم • Surrealism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "116 × 89 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆکراوەی تایبەت (Private Collection)",
    "isVip": true,
    "localImage": "images/son_of_man.jpg",
    "wallPosition": {
      "x": -29,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 3.4,
    "height": 4.6,
    "descKu": "پیاوێک لە بەرگی فەرمی و کڵاوی ڕەشدا، سێوێکی سەوزی گەش دەموچاوی شاردووەتەوە لە کاتێکدا چاوە شاراوەکانی لە پشتییەوە لە بینەر دەڕوانن.",
    "descEn": "Magritte’s enigmatic self-portrait of a man in an overcoat with a floating green apple obscuring his face, exploring the visible vs hidden."
  },
  {
    "id": "garden-of-delights",
    "titleKu": "باخچەی چێژە زەمینییەکان",
    "titleEn": "The Garden of Earthly Delights",
    "artist": "هیرۆنیمۆس بۆش (Hieronymus Bosch)",
    "year": "1490 - 1510",
    "genre": "ڕێنیسانسی باکوور • Proto-Surrealism Triptych",
    "technique": "ڕۆن لەسەر تەختەی دار بی",
    "dimensions": "220 × 389 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی پرادۆ، مەدرید (Museo del Prado, Madrid)",
    "isVip": true,
    "localImage": "images/garden_of_earthly_delights.jpg",
    "wallPosition": {
      "x": -40,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 6.8,
    "height": 3.8,
    "descKu": "سەرسوڕهێنەرترین و شێتانەترین تابلۆی مێژوو. گەشتێکە لە بەهەشتەوە بۆ چێژە سەیرەکانی زەمین و جەهەننەمی پڕ لە دەعبا و مۆسیقای سزا.",
    "descEn": "Bosch’s fantastical, psychedelic triptych depicting Eden, an opulent garden of human indulgence, and a nightmarish, hellish inferno."
  },
  {
    "id": "treachery-of-images",
    "titleKu": "فریودانی وێنەکان (ئەمە پیپێک نییە)",
    "titleEn": "The Treachery of Images (Ceci n’est pas une pipe)",
    "artist": "ڕێنێ ماگریت (René Magritte)",
    "year": "1929",
    "genre": "سوریالیزمی فەلسەفی • Conceptual Surrealism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "60 × 81 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی هونەری لۆس ئەنجلس (LACMA, Los Angeles)",
    "isVip": false,
    "localImage": "images/treachery_of_images.jpg",
    "wallPosition": {
      "x": -50,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 4.2,
    "height": 3.2,
    "descKu": "پارادۆکسێکی فەلسەفی مەزن: وێنەی پیپێک کە لە ژێریدا نووسراوە \"ئەمە پیپ نییە\"؛ چونکە ناتوانی بیخەیتە دەمت و تووتنی تێدا بکێشیت، بەڵکو تەنها وێنەیەکە!",
    "descEn": "Magritte’s visual philosophy highlighting that a painting of an object is merely a representation, not the tangible reality itself."
  },
  {
    "id": "escher-relativity",
    "titleKu": "ڕێژەیی (پلیکانە مەحاڵەکان و دژە-کێشکردن)",
    "titleEn": "Relativity (Impossible Staircases)",
    "artist": "مۆریتس کۆرنێلیس ئێشەر (M.C. Escher)",
    "year": "1953",
    "genre": "پارادۆکسی بینایی و ماتماتیکی • Optical Paradox",
    "technique": "لێتۆگرافی سەر بەرد",
    "dimensions": "27.7 × 29.2 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی ئێشەر لە کۆشک، لاهای (Escher in Het Paleis)",
    "isVip": true,
    "localImage": "images/escher_relativity.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": 72
    },
    "rotationY": Math.PI / 2,
    "width": 4.2,
    "height": 4.4,
    "descKu": "جیهانێک کە تێیدا سێ هێزی کێشکردنی جیاواز لە یەک کاتدا بوونیان هەیە! کەسایەتییەکان لەسەر هەمان پلیکانە بە ئاراستەی دژ بەیەک بە شێوەیەکی مەحاڵ هەنگاو دەنێن.",
    "descEn": "Escher’s gravity-defying masterpiece where sixteen figures inhabit three simultaneous gravitational worlds, walking on impossible shared stairs."
  },
  {
    "id": "escher-drawing-hands",
    "titleKu": "دەستە وێنەکێشەکان (پارادۆکسی بوون)",
    "titleEn": "Drawing Hands",
    "artist": "مۆریتس کۆرنێلیس ئێشەر (M.C. Escher)",
    "year": "1948",
    "genre": "پارادۆکسی بینایی و خود-دروستبوون",
    "technique": "لێتۆگرافی",
    "dimensions": "28.2 × 33.2 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆکراوەی هاگسمنت، لاهای (Haags Gemeentemuseum)",
    "isVip": false,
    "localImage": "images/escher_drawing_hands.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": 62
    },
    "rotationY": Math.PI / 2,
    "width": 4.4,
    "height": 3.4,
    "descKu": "دوو دەست کە لەسەر لاپەڕەیەکی ڕووت لە کانڤاسەوە بەرز دەبنەوە و بە پێنووس یەکتر دەکێشن! وێنەیەک کە سنووری نێوان دروستکەر و دروستکراو تێکدەشکێنێت.",
    "descEn": "A paradoxical cycle where two hands rise from a 2D sheet of paper, each actively sketching the other into three-dimensional existence."
  },
  {
    "id": "escher-waterfall",
    "titleKu": "تاڤگەی بێ کۆتایی (جووڵەی ئەبەدی)",
    "titleEn": "Waterfall (Perpetual Motion)",
    "artist": "مۆریتس کۆرنێلیس ئێشەر (M.C. Escher)",
    "year": "1961",
    "genre": "ئەندازەی مەحاڵ و مەتەڵی بینایی",
    "technique": "لێتۆگرافی",
    "dimensions": "37.8 × 30 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی نەتەوەیی، ئەمستردام",
    "isVip": false,
    "localImage": "images/escher_waterfall.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": 52
    },
    "rotationY": Math.PI / 2,
    "width": 3.6,
    "height": 4.6,
    "descKu": "ئاو بە جۆگەیەکی پێچاوپێچی ئەندازیاریدا بە سەرکەوتن دەڕوات تاوەکو دەگاتە لووتکەی تاڤگەکە و دیسان دەکەوێتە خوارەوە لە سووڕێکی جووڵەی ئەبەدیدا.",
    "descEn": "Based on the Penrose impossible triangle, Escher creates an impossible aqueduct where water appears to flow uphill to drive a waterwheel perpetually."
  },
  {
    "id": "magritte-golconda",
    "titleKu": "گۆڵکۆندا (بارانی پیاوانی کڵاودار)",
    "titleEn": "Golconda (Golconde)",
    "artist": "ڕێنێ ماگریت (René Magritte)",
    "year": "1953",
    "genre": "سوریالیزم • Surrealism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "81 × 100 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆکراوەی مێنێل، هیوستن (Menil Collection, Houston)",
    "isVip": false,
    "localImage": "images/magritte_golconda.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": 42
    },
    "rotationY": Math.PI / 2,
    "width": 4.4,
    "height": 3.6,
    "descKu": "بارانێکی سەیر لە پیاوانی ڕێکوپێکی کڵاوبەسەر کە وەک دڵۆپە باران بە ئاسمانی شارۆچکەیەکدا هەڵواسراون لە نێوان فڕین و نیشتنەوەدا.",
    "descEn": "Magritte depicts raining men in matching dark bowler hats and coats, suspended motionless across suburban rooftops like raindrops."
  },
  {
    "id": "dali-elephants",
    "titleKu": "فیلە باڵابەرزەکان",
    "titleEn": "The Elephants (Les Éléphants)",
    "artist": "سەلڤادۆر دالی (Salvador Dalí)",
    "year": "1948",
    "genre": "سوریالیزم • Surrealism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "49 × 60 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆکراوەی تایبەت (Private Collection)",
    "isVip": false,
    "localImage": "images/dali_elephants.jpg",
    "wallPosition": {
      "x": -54,
      "y": 3.8,
      "z": 33.5
    },
    "rotationY": 0,
    "width": 4.6,
    "height": 3.4,
    "descKu": "فیلە زەبەلاحەکان بە پێست و باڵای باریک و چەندین مەترییەوە وەک جاڵجاڵۆکە بەسەر بیابانێکی ڕەنگ ئاڵتوونیدا ڕێدەکەن و پایەی کێشی بەردین هەڵدەگرن.",
    "descEn": "Dalí’s surrealist dreamscapes with majestic elephants striding on impossibly elongated, multi-jointed spider legs carrying obelisks."
  },
  {
    "id": "arcimboldo-vertumnus",
    "titleKu": "ڤێرتۆمنۆس (ڕوخساری میوە و گوڵەکان)",
    "titleEn": "Vertumnus (Rudolf II in Fruit and Flora)",
    "artist": "جۆسێپێ ئارچیمبۆڵدۆ (Giuseppe Arcimboldo)",
    "year": "1591",
    "genre": "مانێریزم و فەنتازیای بینایی • Mannerist Illusion",
    "technique": "ڕۆنی لەسەر تەختە داری بی",
    "dimensions": "70.5 × 57.5 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆشکی سکۆکلۆستەر، سوید (Skokloster Castle, Sweden)",
    "isVip": false,
    "localImage": "images/arcimboldo_vertumnus.jpg",
    "wallPosition": {
      "x": -47.5,
      "y": 3.8,
      "z": 33.5
    },
    "rotationY": 0,
    "width": 3.4,
    "height": 4.4,
    "descKu": "پۆرترێتێکی سەرسوڕهێنەر کە تەنها لە میوە، سەوزە، و گوڵی وەرزەکان پێکهاتووە بۆ شێوەپێدانی ڕوخساری ئیمپراتۆری ڕۆم، مێشک تووشی شۆکی بینین دەکات.",
    "descEn": "Arcimboldo’s mind-bending composite portrait composed entirely of fruits, vegetables, and blooms to represent Emperor Rudolf II."
  },
  {
    "id": "chirico-street",
    "titleKu": "نهێنی و پەژارەی کۆڵانێک",
    "titleEn": "The Mystery and Melancholy of a Street",
    "artist": "جۆرجیۆ دێ کیریکۆ (Giorgio de Chirico)",
    "year": "1914",
    "genre": "هونەری مێتافیزیکی • Metaphysical Art",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "88 × 72 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "کۆکراوەی تایبەت (Private Collection)",
    "isVip": false,
    "localImage": "images/chirico_street.jpg",
    "wallPosition": {
      "x": -55,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 3.6,
    "height": 4.6,
    "descKu": "کچێکی بچووک بە تەوقەبازێکی یارییەوە لە کۆڵانێکی چۆڵی مێتافیزیکیدا بە تەنیا ڕادەکات، لە کاتێکدا سێبەری ترسناکی پەیکەرێکی نەناسراو لە سووچەکەوە درێژ دەبێتەوە.",
    "descEn": "De Chirico’s eerie metaphysical dreamscape with exaggerated perspectives, deep haunting shadows, and an innocent child rolling a hoop."
  },
  {
    "id": "rousseau-the-dream",
    "titleKu": "خەون (جیهانی ئەفسووناوی دارستان)",
    "titleEn": "The Dream (Le Rêve)",
    "artist": "ئەنری ڕوسۆ (Henri Rousseau)",
    "year": "1910",
    "genre": "سوریالیزمی سەرەتایی و نایڤ ئارت",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "204.5 × 298.5 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی هونەری مۆدێرن، نیویۆرک (MoMA, New York)",
    "isVip": false,
    "localImage": "images/rousseau_the_dream.jpg",
    "wallPosition": {
      "x": -13.5,
      "y": 3.8,
      "z": 70
    },
    "rotationY": -Math.PI / 2,
    "width": 5.4,
    "height": 3.8,
    "descKu": "ژنێک بە ڕووتی لەسەر قەنەفەیەکی مخمەلی لە نێو دارستانێکی چڕی پڕ لە شێر، مار، فیل و شمشاڵژەنێکی ئەفسووناوی خەوی لێ کەوتووە.",
    "descEn": "Rousseau’s hypnotic paradise featuring a woman lounging on a plush velvet sofa amidst exotic jungle foliage, wild beasts, and a mysterious flute player."
  },
  {
    "id": "bruegel-rebel-angels",
    "titleKu": "کەوتنی فریشتە یاخییەکان",
    "titleEn": "The Fall of the Rebel Angels",
    "artist": "پیتەر برۆگلی باوک (Pieter Bruegel the Elder)",
    "year": "1562",
    "genre": "فەنتازیای پاشایەتی باکوور",
    "technique": "ڕۆنی لەسەر دار بی",
    "dimensions": "117 × 162 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی شاهانەی بەلجیکا، برۆکسل (KMSKB, Brussels)",
    "isVip": false,
    "localImage": "images/bruegel_rebel_angels.jpg",
    "wallPosition": {
      "x": -13.5,
      "y": 3.8,
      "z": 59
    },
    "rotationY": -Math.PI / 2,
    "width": 5.2,
    "height": 3.8,
    "descKu": "میکائیلی فریشتە لەگەڵ فریشتە پیرۆزەکاندا دەعبا و بوونەوەرە سەیرییە نیوە-ماسی و نیوە-تیرۆریستەکان بەرەو دۆزەخ پاڵ پێوە دەنێن بە تێکەڵەیەکی خەیاڵی پڕ لە شۆک.",
    "descEn": "Bruegel’s hallucinatory apocalypse depicting Archangel Michael casting grotesque chimeric hybrid beasts and fallen angels from heaven."
  },
  {
    "id": "goya-sleep-of-reason",
    "titleKu": "خەوی عەقڵ دەعبا دەخوڵقێنێت",
    "titleEn": "The Sleep of Reason Produces Monsters",
    "artist": "فرانسیسکۆ گۆیا (Francisco Goya)",
    "year": "1799",
    "genre": "ڕۆمانتیسیزمی تاریک و سایکۆلۆجی",
    "technique": "ئێکواتینت و ئێچینگ لەسەر کاغەز",
    "dimensions": "21.5 × 15 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی پرادۆ، مەدرید (Museo del Prado, Madrid)",
    "isVip": false,
    "localImage": "images/goya_sleep_of_reason.jpg",
    "wallPosition": {
      "x": -13.5,
      "y": 3.8,
      "z": 48
    },
    "rotationY": -Math.PI / 2,
    "width": 3.4,
    "height": 4.6,
    "descKu": "کاتێک هۆشیاری و عەقڵ دەخەوێت، تارماییەکانی شەو و شەمشەمەکوێرە و کوندەپەپۆکان دەبنە کابووسێکی دەروونی قووڵ لەسەر جەستەی نوستوو.",
    "descEn": "Goya’s psychological triumph illustrating a slumbering scholar assaulted by screeching bats and owls, showing monsters born when reason sleeps."
  },
  {
    "id": "redon-cyclops",
    "titleKu": "سایکڵۆپس (چاوە گەورە ئەفسانەییەکە)",
    "titleEn": "The Cyclops (Le Cyclope)",
    "artist": "ئۆدیلۆن ڕێدۆن (Odilon Redon)",
    "year": "1914",
    "genre": "سیمبۆلیزم و خەیاڵکاری سوریال",
    "technique": "ڕۆنی لەسەر پانێڵی دار",
    "dimensions": "64 × 51 cm",
    "hall": "هۆڵی سوریالیزم، خەیاڵ و پارادۆکسی ئەقڵتەزێن",
    "location": "مۆزەخانەی کرۆلەر-مۆلەر، هۆڵەندا (Kröller-Müller)",
    "isVip": false,
    "localImage": "images/redon_cyclops.jpg",
    "wallPosition": {
      "x": -13.5,
      "y": 3.8,
      "z": 38
    },
    "rotationY": -Math.PI / 2,
    "width": 3.4,
    "height": 4.4,
    "descKu": "دێوی یەک چاوی پۆلیفێمۆس لەسەرووی گردێکی گوڵاوی بە چاوە زەبەلاح و پڕ لە حەسرەتەکەیەوە لە پەرییەکی نوستوو دەڕوانێت لە نێو خەیاڵێکی شێوەپەپوولەیدا.",
    "descEn": "Redon’s poetic dreamscape showing giant one-eyed Polyphemus peering tenderly over a lush floral hill at the sleeping nymph Galatea."
  },
  {
    "id": "wanderer-fog",
    "titleKu": "گەڕۆک لەسەرووی دەریای تەمەوە",
    "titleEn": "Wanderer above the Sea of Fog",
    "artist": "کاسپار دەیڤید فریدریش (Caspar David Friedrich)",
    "year": "1818",
    "genre": "ڕۆمانتیسیزمی ئەڵمانی • German Romanticism",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "94.8 × 74.8 cm",
    "hall": "هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم",
    "location": "مۆزەخانەی کونسثالێ، هامبۆرگ (Hamburger Kunsthalle)",
    "isVip": false,
    "localImage": "images/wanderer_fog.jpg",
    "wallPosition": {
      "x": 7.5,
      "y": 3.8,
      "z": 77.5
    },
    "rotationY": Math.PI,
    "width": 3.6,
    "height": 4.6,
    "descKu": "هێمای ڕۆحی گەڕۆک و بیرکردنەوە لە گەردوون. پیاوێک لەسەر لووتکەی بەردینێکی تیژ لە دوورەدەست لە دەریای تەم و دۆڵی بێ کۆتایی دەڕوانێت.",
    "descEn": "The supreme embodiment of romantic sublimity, showing a solitary traveler gazing out over a sweeping mountain valley shrouded in thick fog."
  },
  {
    "id": "erbil-citadel",
    "titleKu": "قەڵای دێرینی هەولێر (قەڵات)",
    "titleEn": "The Citadel of Erbil (Qelay Hewlêr)",
    "artist": "شارستانیەتی کوردستان و مێزۆپۆتامیا",
    "year": "نزیکەی ٦٠٠٠ ساڵ پێش زایین تا ئێستا",
    "genre": "کەلەپووری جیهانی یونسکۆ • World Heritage",
    "technique": "بیناسازی خشتی قوڕ و کەلەپووری دێرین",
    "dimensions": "پانتایی ١١٠،٠٠٠ مەتری چوارگۆشە",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "ناوەندی شاری هەولێر، پایتەختی هەرێمی کوردستان",
    "isVip": true,
    "localImage": "images/erbil_citadel.jpg",
    "wallPosition": {
      "x": -77.5,
      "y": 3.8,
      "z": 0
    },
    "rotationY": Math.PI / 2,
    "width": 6.2,
    "height": 4,
    "descKu": "کۆنترین شوێنی نیشتەجێبوونی مرۆڤ لە جیهاندا کە بە بەردەوامی ژیانی تێدا ماوەتەوە بۆ ماوەی ٦٠٠٠ ساڵ. شاکارێکی بیناسازی و شکۆی نەتەوەیی کوردستانە.",
    "descEn": "One of the oldest continuously inhabited settlements on Earth spanning over 6,000 years, an iconic UNESCO World Heritage fortress in Kurdistan."
  },
  {
    "id": "kirkuk-citadel",
    "titleKu": "قەڵای کەرکووکی دێرین",
    "titleEn": "The Ancient Citadel of Kirkuk",
    "artist": "شارستانیەتە کۆنەکانی کوردستان و گۆتییەکان",
    "year": "سەدەی ٨ی پێش زایین",
    "genre": "ئاسەوار و کەلەپووری مێژوویی • Ancient Citadel",
    "technique": "شوێنەواری سەر تەپۆڵکەی سروشتی و خشت",
    "dimensions": "تەپۆڵکەی ١٣٠ پێ بەرز",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "کەرکووک، کوردستان",
    "isVip": false,
    "localImage": "images/kirkuk_citadel.jpg",
    "wallPosition": {
      "x": -77.5,
      "y": 3.8,
      "z": -7
    },
    "rotationY": Math.PI / 2,
    "width": 4.6,
    "height": 3.4,
    "descKu": "تەپۆڵکە و قەڵا مێژووییەکەی کەرکووک کە پێگەی شاری کۆنی (ئاراپخا) بووە. شوێنی پێکەوەژیانی چەندین شارستانیەت و فەرهەنگی دێرین بووە بەدرێژایی سەدەکان.",
    "descEn": "The legendary Citadel of Kirkuk erected upon the ancient mound of Arrapkha, a testament to millennia of civilization and diverse heritage."
  },
  {
    "id": "shanidar-cave",
    "titleKu": "ئەشکەوتی شانەدەر (گۆڕستانی گوڵی نیاندەرتاڵ)",
    "titleEn": "Shanidar Cave (Neanderthal Flower Burial)",
    "artist": "سەردەمی بەردینی دێرین (Paleolithic Era)",
    "year": "نزیکەی ٦٥،٠٠٠ ساڵ پێش ئێستا",
    "genre": "شوێنەواری جیهانی و مرۆڤناسی",
    "technique": "ئەشکەوتی سروشتی شاخی برادۆست",
    "dimensions": "دەمی ئەشکەوت: ٥٣ پێ پانی، ٨ م قوڵی",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "شاخی برادۆست، پارێزگای هەولێر، کوردستان",
    "isVip": true,
    "localImage": "images/shanidar_cave.jpg",
    "wallPosition": {
      "x": -77.5,
      "y": 3.8,
      "z": 7
    },
    "rotationY": Math.PI / 2,
    "width": 4.8,
    "height": 3.4,
    "descKu": "یەکێک لە گرنگترین شوێنەوارەکانی مرۆڤایەتی. دۆزینەوەی گۆڕی نیاندەرتاڵەکان کە گوڵ و ڕووەکی دەرمانییان لەگەڵ نێژراوە، دەریخست کە مرۆڤی سەرەتایی هەست و سۆزی هەبووە.",
    "descEn": "World-renowned archaeological cave in the Bradost Mountain where Neanderthal skeletons buried with floral offerings redefined prehistoric human empathy."
  },
  {
    "id": "lalish-temple",
    "titleKu": "پەرستگای پیرۆزی لالش",
    "titleEn": "The Sacred Temple of Lalish",
    "artist": "کەلەپوور و باوەڕی دێرینی ئێزدیاتی",
    "year": "سەدەی ١٢ی زایینی و دێرینتر",
    "genre": "بیناسازی ئایینی و کلتووری • Yazidi Spiritual Center",
    "technique": "قوبەی کلاوی سەنگین و بەردی پیرۆز",
    "dimensions": "کۆمەڵگەی پیرۆزی نێو دۆڵ",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "دۆڵی لالش، شێخان، هەرێمی کوردستان",
    "isVip": false,
    "localImage": "images/lalish_temple.jpg",
    "wallPosition": {
      "x": -28,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 4.8,
    "height": 3.4,
    "descKu": "پیرۆزترین شوێنی باوەڕی ئێزدی لە جیهاندا بە قوبە قوچەکییە ناوازەکانیەوە لە نێو دارستانی چڕی دۆڵی لالش، سیمبۆلی ئاشتی، ڕۆشنایی و سروشتە.",
    "descEn": "The holiest sanctuary and pilgrimage destination of the Yazidi faith, distinguished by its conical fluted spires nestled in a serene sacred valley."
  },
  {
    "id": "kurdish-carpet",
    "titleKu": "بافتی فەرشی کوردی دێرین",
    "titleEn": "Antique Kurdish Tribal Rug",
    "artist": "هونەرمەندانی چنین و بافتی هۆزە کوردییەکان",
    "year": "سەدەی ١٩ی زایینی",
    "genre": "هونەری دەستی و کەلەپوور • Tribal Textile Art",
    "technique": "خوری سروشتی، ڕەنگی گیایی و گرێی کوردی",
    "dimensions": "220 × 140 cm",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "کۆکراوەی مۆزەخانەی نەتەوەیی کوردستان",
    "isVip": false,
    "localImage": "images/kurdish_carpet.jpg",
    "wallPosition": {
      "x": -35,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 3.4,
    "height": 4.8,
    "descKu": "نموونەیەکی دەگمەنی فەرش و مافووری دەستچنی هۆزەکانی کوردستان. نەخشە ئەندازیارییەکان و ڕەنگە توند و زیندووەکانی هێمای خۆڕاگری و فەرهەنگی کوردیین.",
    "descEn": "Exquisite antique Kurdish tribal rug woven with hand-spun wool and natural botanical dyes, celebrated for striking geometric emblems and vibrant spirit."
  },
  {
    "id": "kurdish-clothing",
    "titleKu": "جلوبەرگی ڕەسەنی کوردی (شاژن و جەنگاوەر)",
    "titleEn": "Traditional Royal & Folk Kurdish Attire",
    "artist": "کەلەپوور و هونەری دروومانی کوردەواری",
    "year": "کەلەپووری سەدەکان • Living Heritage",
    "technique": "قوماشی ئاوریشمی، سیمدۆزی و زێڕین",
    "dimensions": "تەواوی بەژن و باڵا",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "ئەرشیفی کەلەپووری نیشتمانی کوردستان",
    "isVip": false,
    "localImage": "images/kurdish_clothing.jpg",
    "wallPosition": {
      "x": -64,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 3.8,
    "height": 4.6,
    "descKu": "جلوبەرگی پڕ شکۆی کوردی بە کەوا و سەڵتە و کڵاو و کۆفی و شاتی قەدەوە. ڕەنگدانەوەی ئازادی، سروشتی دەوڵەمەندی کوردستان و شانازیی مێژووییە.",
    "descEn": "Splendid traditional Kurdish royal and cultural attire featuring rich silk fabrics, gold brocade embroidery, and graceful headdresses."
  },
  {
    "id": "kurdish-newroz",
    "titleKu": "ئاهەنگی ئاگری نەورۆزی ئاکرێ",
    "titleEn": "Sacred Newroz Fire Celebration in Akre",
    "artist": "جەژنی نەتەوەیی و ئاگری نەورۆز",
    "year": "سالیانە لە ٢١ی ئادار (مێژووی ٢٧٠٠ ساڵە)",
    "genre": "جەژنی ئازادی و فەرهەنگ • National Epic Festival",
    "technique": "مەشخەڵی ئاگر لەسەر شاخی سەربەرز",
    "dimensions": "سیمفۆنیای ئاگر بەسەر چیادا",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "شاری ئاکرێ، پایتەختی نەورۆزی کوردستان",
    "isVip": true,
    "localImage": "images/kurdish_newroz.jpg",
    "wallPosition": {
      "x": -72,
      "y": 3.8,
      "z": 12.5
    },
    "rotationY": Math.PI,
    "width": 4.8,
    "height": 3.4,
    "descKu": "پایتەختی نەورۆزی کوردستان لە ئاکرێ کاتێک هەزاران لاو بە مەشخەڵی ئاگرەوە بە قەدپاڵی چیاکاندا سەردەکەون بۆ پیرۆزبایی سەرهەڵدانی ئازادی و بەهار.",
    "descEn": "The awe-inspiring Newroz fire walk along the rocky precipices of Akre, where thousands carrying flaming torches commemorate freedom and renewal."
  },
  {
    "id": "hawraman-village",
    "titleKu": "تەلارسازی بەردینی هەورامان",
    "titleEn": "Stone Terraced Architecture of Hawraman",
    "artist": "کەلەپووری نژیاروانی هەورامان (Hawraman Heritage)",
    "year": "میراتی مێژوویی پارێزراو • UNESCO Heritage",
    "technique": "بیناسازی بەردینی وشکەچین لەسەر چیا",
    "dimensions": "نژیاروانی پلیکانەیی سروشتی",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "هەورامان، ڕۆژهەڵات و باشووری کوردستان",
    "isVip": false,
    "localImage": "images/hawraman_village.jpg",
    "wallPosition": {
      "x": -28,
      "y": 3.8,
      "z": -12.5
    },
    "rotationY": 0,
    "width": 4.8,
    "height": 3.4,
    "descKu": "تەلارسازییەکی بێ وێنە لە جیهاندا کە سەقفی هەر ماڵێک دەبێتە حەوشەی ماڵەکەی سەرەوەی. گونجانی تەواوی مرۆڤی کورد لەگەڵ چیای سەختی زاگرۆسدا.",
    "descEn": "UNESCO World Heritage terraced stone architecture in Hawraman, where the flat roof of each house forms the courtyard of the house above it."
  },
  {
    "id": "zagros-mountains",
    "titleKu": "لووتکە سەرکەشەکانی زاگرۆس",
    "titleEn": "The Majestic Peaks of Mount Zagros",
    "artist": "هونەری سروشتی کوردستان",
    "year": "مێژووی خاک و سروشت",
    "genre": "دیمەنی سروشتی و ژینگەیی",
    "technique": "فۆتۆگرافی پانۆرامایی شاکاری سروشت",
    "dimensions": "دیمەنی پانۆراما",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "زنجیرە چیاکانی زاگرۆس، کوردستان",
    "isVip": false,
    "localImage": "images/zagros_mountains.jpg",
    "wallPosition": {
      "x": -35,
      "y": 3.8,
      "z": -12.5
    },
    "rotationY": 0,
    "width": 4.8,
    "height": 3.4,
    "descKu": "چیاکانی زاگرۆس، قەڵغانی پارێزەری گەلی کورد بەدرێژایی هەزاران ساڵ لە بەرامبەر زۆرداراندا، بە لووتکە بەفراوی و دۆڵە سەوز و ئاوە سازگارەکانییەوە.",
    "descEn": "The heroic Zagros Mountains, ancient bastion and cultural cradle of the Kurdish people standing proud against the horizon with snowcapped heights."
  },
  {
    "id": "zagros-nomads",
    "titleKu": "کۆچەرییەکانی زاگرۆس و کۆچی باوان",
    "titleEn": "Nomads of Zagros (Migration of the Ancestors)",
    "artist": "ژیانی ڕەسەنی هۆزەکانی کورد",
    "year": "کەلەپووری سەدەها ساڵە",
    "genre": "ژیانی کۆمەڵایەتی و فۆلکلۆر",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "120 × 180 cm",
    "hall": "کۆشکی کەلەپوور و شارستانیەتی دێرینی کوردستان",
    "location": "گەلەری نەتەوەیی کوردستان",
    "isVip": false,
    "localImage": "images/zagros_nomads.jpg",
    "wallPosition": {
      "x": -68,
      "y": 3.8,
      "z": -12.5
    },
    "rotationY": 0,
    "width": 5.2,
    "height": 3.4,
    "descKu": "وێنەی کۆچی وەرزی هۆزە کۆچەرییەکان بە ئەسپ و مەڕ و ماڵاتەوە بەناو دۆڵ و کەندەڵانە سەختەکانی زاگرۆسدا، شاکارێکی زیندووی ئازادی و فەرهەنگە.",
    "descEn": "Vibrant portrayal of seasonal migration by Kurdish pastoralists across high mountain passes, preserving an ancestral bond with earth and livestock."
  },
  {
    "id": "ishtar-gate",
    "titleKu": "دەروازەی عەشتاری بابیلۆن",
    "titleEn": "The Ishtar Gate of Babylon",
    "artist": "شارستانیەتی بابیلۆنی نوێ (شا نەبوخودنەسر دووەم)",
    "year": "نزیکەی ٥٧٥ پێش زایین",
    "genre": "بیناسازی و هونەری مێزۆپۆتامیا • Ancient Antiquity",
    "technique": "خشتی مینایی شینی قووڵ و نەخشی بەرز",
    "dimensions": "14 × 15.7 meters (Original reconstructed)",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مۆزەخانەی پێرگامۆن، بەرلین (Pergamon Museum, Berlin)",
    "isVip": true,
    "localImage": "images/ishtar_gate.jpg",
    "wallPosition": {
      "x": -40,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 6.4,
    "height": 4.4,
    "descKu": "هەشتەمین دەروازەی شاری پیرۆزی بابیلۆن. بە خشتی گەوهەری شینی لاجوەردی ڕازاوەتەوە و نەخشی ئەژدیهای موشخوشو و گای کێوی لەسەر تاشراوە.",
    "descEn": "The eighth inner gate to Babylon, reconstructed in Berlin with radiant lapis-blue glazed bricks portraying sacred dragons and young bulls."
  },
  {
    "id": "processional-way",
    "titleKu": "ڕێڕەوی کاروانی بابیلۆن و شێری زێڕین",
    "titleEn": "The Processional Way of Babylon (Striding Lion)",
    "artist": "شارستانیەتی مێزۆپۆتامیا (بابل)",
    "year": "نزیکەی ٥٧٥ پێش زایین",
    "genre": "خشتی مینایی و پەیکەرتاشی دیوار",
    "technique": "خشتی میناکراوی فەخاری",
    "dimensions": "180 × 230 cm",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مۆزەخانەی پێرگامۆن، بەرلین / مۆزەخانەی عێراق",
    "isVip": true,
    "localImage": "images/processional_way.jpg",
    "wallPosition": {
      "x": -24,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 5.2,
    "height": 3.4,
    "descKu": "شێری هەنگاونەری پیرۆزی دەروازەی عەشتار بە خشتی مینایی درەوشاوە. هێمای هێز، شکۆ، و دەسەڵاتی دێرینی مێزۆپۆتامیا لە بۆنە ئایینییەکاندا.",
    "descEn": "The monumental striding lion in glazed relief from the Babylonian Processional Way leading to the Ishtar Gate, dedicated to goddess Ishtar."
  },
  {
    "id": "lion-of-babylon",
    "titleKu": "پەیکەری شێری بابیلۆن",
    "titleEn": "The Lion of Babylon",
    "artist": "پەیکەرتاشانی مێزۆپۆتامیای کۆن",
    "year": "سەدەی ٦ی پێش زایین",
    "genre": "پەیکەرسازی بەردی بازاڵتی ڕەش",
    "technique": "بەردی بازاڵتی ڕەشی ڕەق",
    "dimensions": "درێژی ٢ مەتر، کێشی چەندین تەن",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "شاری شوێنەواری بابیلۆن، عێراق",
    "isVip": false,
    "localImage": "images/lion_of_babylon.jpg",
    "wallPosition": {
      "x": -52,
      "y": 3.8,
      "z": -77.5
    },
    "rotationY": 0,
    "width": 4.6,
    "height": 3.4,
    "descKu": "پەیکەرێکی بەردینی مێژوویی شێرێک کە بەسەر پیاوێکی کەوتوودا زاڵ بووە، سیمبۆلی شکۆ و سەرکەوتنی ئیمپراتۆریەتی دێرینی بابلە.",
    "descEn": "Ancient monumental black basalt sculpture of a triumphant lion trampling a recumbent foe, enduring symbol of Mesopotamian dominance."
  },
  {
    "id": "gilgamesh-tablet",
    "titleKu": "تاتەبەردی لافاوەکەی گیلگامێش (مێخی کۆن)",
    "titleEn": "The Gilgamesh Deluge Tablet (Tablet XI)",
    "artist": "کتێبخانەی شاهانەی ئاشووربانیپاڵ لە نەینەوا",
    "year": "نزیکەی سەدەی ٧ی پێش زایین",
    "genre": "نووسینی بزماری (مێخی) و ئەدەبیاتی دێرین",
    "technique": "قوڕی سوورەوەکراو بە پیتی بزماری",
    "dimensions": "15 × 13 cm",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مۆزەخانەی بەریتانی، لەندەن (British Museum, London)",
    "isVip": true,
    "localImage": "images/gilgamesh_tablet.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": -68
    },
    "rotationY": Math.PI / 2,
    "width": 3.8,
    "height": 4.6,
    "descKu": "یازدەهەمین تاتەبەردی داستانە نەمرییەکەی گیلگامێش کە لە نەینەوا دۆزراوەتەوە. باسی بەسەرهاتی لافاوە گەورەکەی ئوتناپیشتیم دەکات بە نووسینی مێخی.",
    "descEn": "The famous Flood Tablet from the Epic of Gilgamesh, discovered in Nineveh, recounting the ancient flood myth inscribed in Akkadian cuneiform."
  },
  {
    "id": "hasanlu-gold-bowl",
    "titleKu": "قاپە زێڕینەکەی حەسەنلوو",
    "titleEn": "The Golden Bowl of Hasanlu",
    "artist": "شارستانیەتی ماننایی و زاگرۆسی دێرین",
    "year": "نزیکەی سەدەی ٩ی پێش زایین",
    "genre": "زێڕینکاری و میتۆلۆژیای دێرین • Ancient Gold Repoussé",
    "technique": "زێڕی پەتی نەخشێندراو بە دەست",
    "dimensions": "بەرزی ٢٠ سم، کێش ٩٥٠ گرام",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مۆزەخانەی نیشتمانی ئێران، تاران",
    "isVip": false,
    "localImage": "images/hasanlu_gold_bowl.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": -56
    },
    "rotationY": Math.PI / 2,
    "width": 4.4,
    "height": 3.6,
    "descKu": "قاپێکی زێڕینی ناوازە کە لە گردی حەسەنلوو لە باشووری دەریاچەی ورمێ دۆزراوەتەوە. نەخشەکانی ئەفسانەی خوداوەندی کەشوهەوا و ئەژدیها دەگێڕنەوە.",
    "descEn": "Masterpiece of ancient Near Eastern repoussé gold found at Tepe Hasanlu, depicting weather deities, winged chariots, and mythical combat."
  },
  {
    "id": "taq-bostan",
    "titleKu": "تاقی وەسان / نەخشەبەردینەکانی کرماشان",
    "titleEn": "Taq-e Bostan Rock Reliefs (Kermanshah)",
    "artist": "شارستانیەتی ساسانی و هونەری شاخەوانی زاگرۆس",
    "year": "سەدەی ٤ی زایینی",
    "genre": "نەخشەبەردینی شاخەوانی • Monumental Rock Carving",
    "technique": "هەڵکۆڵینی بەردی شاخی پیرۆز",
    "dimensions": "تاقی گەورە: بەرزی ٩ مەتر",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "کرماشان، ڕۆژهەڵاتی کوردستان",
    "isVip": false,
    "localImage": "images/taq_bostan.jpg",
    "wallPosition": {
      "x": -57.5,
      "y": 3.8,
      "z": -44
    },
    "rotationY": Math.PI / 2,
    "width": 5.2,
    "height": 3.6,
    "descKu": "تاقە بەردینە مەزنەکانی تاقی وەسان لە کرماشان کە تاجگووزاری شا و ڕاوەبەراز لە تاڤگەکانی زاگرۆس بە وردەکارییەکی بەرز نیشان دەدەن.",
    "descEn": "Magnificent rock reliefs carved into the sacred cliffs of Kermanshah, depicting royal coronations, boar hunts, and court musicians beside crystal springs."
  },
  {
    "id": "arch-of-ctesiphon",
    "titleKu": "تاقی کەسرا (کەوانەی تیسفۆن)",
    "titleEn": "The Arch of Ctesiphon (Taq Kasra)",
    "artist": "ئەندازیارانی کۆنی مێزۆپۆتامیا",
    "year": "نزیکەی ٥٤٠ی زایینی",
    "genre": "بیناسازی خشتی مێژوویی",
    "technique": "کەوانەی خشتی بێ قاڵب",
    "dimensions": "بەرزی ٣٧ مەتر، پانی ٢٦ مەتر",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مەدائین (تیسفۆن)، عێراق",
    "isVip": false,
    "localImage": "images/arch_of_ctesiphon.jpg",
    "wallPosition": {
      "x": -50,
      "y": 3.8,
      "z": -32.5
    },
    "rotationY": Math.PI,
    "width": 4.8,
    "height": 3.4,
    "descKu": "گەورەترین کەوانەی خشتی یەکپارچە لە هەموو جیهاندا کە بەبێ کۆڵەکە ڕاگیراوە، شاکارێکی ئەندازیاری بێ وێنەیە لە مێژووی بیناسازی مرۆڤدا.",
    "descEn": "The largest single-span vault of unreinforced brickwork in the world, an engineering wonder of ancient Mesopotamian masonry."
  },
  {
    "id": "kurdish-folklore",
    "titleKu": "تابلۆی ژیانی فۆلکلۆری و بەیتە کۆنەکان",
    "titleEn": "Kurdish Folklore and Epic Ballads",
    "artist": "هونەری گەلێری و فۆلکلۆری کوردی",
    "year": "سەدەی بیستەم",
    "genre": "فۆلکلۆر و ڕەنگدانەوەی بەیت و حەیران",
    "technique": "ڕۆنی لەسەر کانڤاس",
    "dimensions": "100 × 150 cm",
    "hall": "باڵی مێزۆپۆتامیا و ئاسەوارە کۆنەکان",
    "location": "مۆزەخانەی کەلەپووری سلێمانی",
    "isVip": false,
    "localImage": "images/kurdish_folklore.jpg",
    "wallPosition": {
      "x": -13.5,
      "y": 3.8,
      "z": -70
    },
    "rotationY": -Math.PI / 2,
    "width": 4.6,
    "height": 3.4,
    "descKu": "دەنگبێژ و حەیرانبێژانی کورد بە دەوری مەنقەڵی ئاگرەوە بەیت و بالۆری مەم و زین و قەڵای دمدم دەچڕن بۆ پاراستنی فەرهەنگی نەتەوەیی.",
    "descEn": "Traditional bards (Dengbêj) reciting ancient epic ballads around fireside gatherings, keeping centuries of oral history and lore alive."
  }
];

function getArtworkById(id) {
  return GALLERY_ARTWORKS.find(art => art.id === id);
}

function createArtworkCanvasFallback(art, resolution = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, resolution, resolution);
  grad.addColorStop(0, '#1c1f26');
  grad.addColorStop(1, '#0e1014');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, resolution, resolution);

  ctx.strokeStyle = '#cba358';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, resolution - 20, resolution - 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(art.titleEn || art.titleKu, resolution / 2, resolution / 2 - 20);

  ctx.fillStyle = '#d4af37';
  ctx.font = '20px "Segoe UI", sans-serif';
  ctx.fillText(art.artist, resolution / 2, resolution / 2 + 25);

  return canvas;
}

// Automatically resolve and bind high-resolution Base64 data for all 56 artworks
(function resolveArtworkAssets() {
  if (typeof GALLERY_ARTWORKS !== 'undefined') {
    GALLERY_ARTWORKS.forEach((art) => {
      const filename = (art.localImage || '').replace(/^images\//, '');
      if (typeof ARTWORK_IMAGES !== 'undefined' && ARTWORK_IMAGES[filename]) {
        art.base64 = ARTWORK_IMAGES[filename];
        art.resolvedImageSrc = ARTWORK_IMAGES[filename];
      } else {
        art.resolvedImageSrc = art.localImage;
      }
    });
  }
})();
