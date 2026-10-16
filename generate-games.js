
// AUTO GENERATOR - Scan folder covers/ dan evaluasi genre otomatis
// File ini akan generate games.json dari isi folder covers/ di GitHub

const GENRE_DB = {
  "Action Adventure": [
    "gta",
    "grand theft auto",
    "uncharted",
    "god of war",
    "gow",
    "spider-man",
    "spiderman",
    "ghost of tsushima",
    "ghost",
    "horizon",
    "last of us",
    "tlou",
    "tomb raider",
    "assassin",
    "assassins",
    "batman",
    "arkham",
    "star wars",
    "jedi",
    "fallen order",
    "sekiro",
    "devil may cry",
    "dmc",
    "resident evil",
    "re ",
    "darksiders",
    "infamous",
    "prototype",
    "watch dogs",
    "sleeping dogs",
    "mafia",
    "yakuza",
    "dying light"
  ],
  "Open World": [
    "red dead",
    "rdr",
    "far cry",
    "farcry",
    "cyberpunk",
    "witcher",
    "skyrim",
    "elder scrolls",
    "assassin",
    "gta",
    "watch dogs",
    "ghost of tsushima",
    "horizon",
    "days gone",
    "mad max",
    "just cause",
    "saints row",
    "metal gear",
    "mgs",
    "death stranding"
  ],
  "FPS / Shooting": [
    "call of duty",
    "cod",
    "battlefield",
    "bf ",
    "doom",
    "overwatch",
    "pubg",
    "fortnite",
    "apex",
    "destiny",
    "borderlands",
    "far cry",
    "crysis",
    "wolfenstein",
    "halo",
    "rainbow six",
    "r6",
    "counter",
    "csgo",
    "valorant",
    "warzone",
    "black ops",
    "modern warfare",
    "ghost recon",
    "division"
  ],
  "RPG / Anime / Musou": [
    "final fantasy",
    "ff ",
    "persona",
    "dragon ball",
    "dbz",
    "naruto",
    "one piece",
    "elden ring",
    "dark souls",
    "bloodborne",
    "demon souls",
    "dragon quest",
    "tales of",
    "nier",
    "kingdom hearts",
    "monster hunter",
    "mh ",
    "genshin",
    "honkai",
    "fate",
    "sword art",
    "sao",
    "attack on titan",
    "aot",
    "my hero",
    "demon slayer",
    "jujutsu",
    "one punch",
    "bleach",
    "dynasty warriors",
    "samurai warriors",
    "berserk",
    "nier",
    "atelier",
    "disgaea",
    "dragon's dogma",
    "witcher"
  ],
  "Fighting": [
    "mortal kombat",
    "mk ",
    "tekken",
    "street fighter",
    "sf ",
    "dragon ball fighterz",
    "fighterz",
    "soulcalibur",
    "injustice",
    "guilty gear",
    "king of fighters",
    "kof",
    "smash",
    "marvel vs",
    "naruto storm",
    "jump force",
    "brawlhalla",
    "wwe 2k",
    "ufc"
  ],
  "Racing": [
    "gran turismo",
    "gt ",
    "need for speed",
    "nfs",
    "f1 ",
    "motogp",
    "forza",
    "dirt",
    "wrc",
    "project cars",
    "crew",
    "burnout",
    "hot wheels",
    "trackmania",
    "grid",
    "assetto",
    "nascar",
    "mxgp"
  ],
  "Sports": [
    "fifa",
    "efootball",
    "pes ",
    "pro evolution",
    "nba",
    "2k",
    "wwe",
    "ufc",
    "football manager",
    "fm ",
    "madden",
    "nhl",
    "mlb",
    "tennis",
    "golf",
    "pga",
    "olympic"
  ],
  "Family / Casual": [
    "minecraft",
    "lego",
    "crash bandicoot",
    "crash",
    "ratchet",
    "clank",
    "spyro",
    "sackboy",
    "little big planet",
    "lbp",
    "astro",
    "rayman",
    "sonic",
    "mario",
    "fall guys",
    "overcooked",
    "moving out",
    "stardew",
    "animal crossing",
    "sims",
    "plants vs",
    "angry birds",
    "just dance",
    "singstar"
  ]
};

function evaluateGenre(title) {
  const t = title.toLowerCase();
  let bestGenre = "Action Adventure";
  let bestScore = 0;
  for (const [genre, keywords] of Object.entries(GENRE_DB)) {
    let score = 0;
    for (const kw of keywords) {
      if (t.includes(kw.toLowerCase())) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestGenre = genre;
    }
  }
  return bestGenre;
}

function prettyTitle(filename) {
  return filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

async function generateGamesJson() {
  const apiUrl = 'https://api.github.com/repos/ps4Aligames/listps4/contents/covers';
  const res = await fetch(apiUrl);
  const files = await res.json();
  const imageFiles = files.filter(f => f.type === 'file' && /\.(jpe?g|png|webp|gif)$/i.test(f.name));
  
  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const f of imageFiles) {
    const lower = f.name.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      unique.push(f);
    }
  }
  
  const games = unique.map(f => {
    const title = prettyTitle(f.name);
    return {
      title: title,
      file: f.name,
      cover: 'covers/' + f.name,
      genre: evaluateGenre(title),
      code: 'covers/' + f.name
    };
  });
  
  console.log('Generated games.json:', games);
  console.log('Grouped by genre:', games.reduce((acc, g) => {
    acc[g.genre] = (acc[g.genre] || 0) + 1;
    return acc;
  }, {}));
  
  return games;
}

// Untuk generate di browser console: generateGamesJson().then(g => console.log(JSON.stringify(g, null, 2)))
