import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

// ============================================================
// CONFIG
// ============================================================
const BASE = 'https://www.reunion.gouv.fr';
const RAA_ROOT = `${BASE}/Publications/Publications-administratives-et-legales/Recueil-des-actes-administratifs-RAA`;

const MOIS_FR = [
  'JANVIER','FEVRIER','MARS','AVRIL','MAI','JUIN',
  'JUILLET','AOUT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DECEMBRE'
];

// ✅ CORRECTION : uniquement les URLs MAJUSCULES (observées sur le site)
// Les variantes « Février », « Août », « Septembre » renvoyaient 404.
const MOIS_VARIANTS = {
  JANVIER:    ['JANVIER'],
  FEVRIER:    ['FEVRIER'],
  MARS:       ['MARS'],
  AVRIL:      ['AVRIL'],
  MAI:        ['MAI'],
  JUIN:       ['JUIN'],
  JUILLET:    ['JUILLET'],
  AOUT:       ['AOUT'],
  SEPTEMBRE:  ['SEPTEMBRE'],
  OCTOBRE:    ['OCTOBRE'],
  NOVEMBRE:   ['NOVEMBRE'],
  DECEMBRE:   ['DECEMBRE']
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; RAA-Monitor/1.0)',
  'Accept': 'text/html,application/xhtml+xml'
};

const DELAY_MS = 800;

// ============================================================
// HELPERS
// ============================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));
function log(...a){ console.log('[RAA]', ...a); }
function warn(...a){ console.warn('[WARN]', ...a); }

async function fetchHtml(url, retries = 1){
  for (let i = 0; i <= retries; i++){
    try {
      const r = await fetch(url, { headers: HEADERS, redirect: 'follow' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = await r.arrayBuffer();
      return new TextDecoder('utf-8').decode(buf);
    } catch(err){
      if (i === retries) throw err;
      warn(`Retry ${i+1}/${retries} pour ${url} : ${err.message}`);
      await sleep(1000 * (i+1));
    }
  }
}

function detectType(txt){
  const t = txt.toLowerCase();
  if (/nominatif|nomination|promotion|avancement/.test(t)) return 'nominatif';
  if (/spécial|special/.test(t)) return 'special';
  if (/décision|decision/.test(t)) return 'decision';
  if (/arrêté|arrete/.test(t)) return 'arrete';
  if (/recueil/.test(t)) return 'recueil';
  return 'autre';
}

function hashId(s){
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return 'r974-' + (h >>> 0).toString(36);
}

// ============================================================
// PARSING D'UNE PAGE DE MOIS
// ============================================================
function parseMonthPage(html, annee, moisLabel){
  const $ = cheerio.load(html);
  const actes = [];
  const seen = new Set();         // dédoublonnage par URL
  const seenTitles = new Set();   // ✅ dédoublonnage par titre normalisé

  // --- 1) Liens PDF / téléchargement ---
  $('a[href*="/contenu/telechargement/"], a[href$=".pdf"]').each((_, el) => {
    const $a = $(el);
    let href = $a.attr('href') || '';
    if (!href) return;
    if (href.startsWith('/')) href = BASE + href;
    if (seen.has(href)) return;
    seen.add(href);

    let label = $a.text().trim().replace(/\s+/g, ' ');
    if (!label || label.length < 5){
      label = $a.closest('li, p, div').text().trim().replace(/\s+/g, ' ').slice(0, 250);
    }
    label = label.replace(/^Télécharger\s+/i, '').trim();
    if (label.length < 5) return;

    // ✅ Dédoublonnage par titre normalisé
    const titleKey = label.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
    if (seenTitles.has(titleKey)) return;
    seenTitles.add(titleKey);

    const dateMatch = label.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const datePub = dateMatch ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` : null;

    const numMatch = label.match(/n[°o]\s*([0-9\-\/A-Z]+)/i);
    const numero = numMatch ? numMatch[1] : null;

    actes.push({
      id: hashId(href),
      titre: label.slice(0, 400),
      numero,
      url: href,
      date_publication: datePub,
      annee,
      mois: moisLabel,
      departement: '974',
      nom_departement: 'La Réunion',
      prefecture: 'Saint-Denis',
      region: 'La Réunion',
      type: detectType(label)
    });
  });

  // --- 2) Actes listés en texte brut (Récépissé OSP, etc. sans PDF) ---
  $('li, p').each((_, el) => {
    const txt = $(el).text().trim().replace(/\s+/g, ' ');
    if (!txt || txt.length < 15 || txt.length > 500) return;
    if (!/^Récépissé|^Arrêté|^Décision|^Avis|^Délibération|^Déclaration/i.test(txt)) return;

    const titleKey = txt.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
    if (seenTitles.has(titleKey)) return;
    seenTitles.add(titleKey);

    const key = 'TXT:' + txt.slice(0, 80);
    if (seen.has(key)) return;
    seen.add(key);

    actes.push({
      id: hashId(key),
      titre: txt.slice(0, 400),
      numero: null,
      url: null,
      date_publication: null,
      annee,
      mois: moisLabel,
      departement: '974',
      nom_departement: 'La Réunion',
      prefecture: 'Saint-Denis',
      region: 'La Réunion',
      type: detectType(txt)
    });
  });

  return actes;
}

// ============================================================
// DÉCOUVERTE DES URLs DE MOIS (✅ corrigée)
// ============================================================
async function getMonthUrls(annee){
  const yearUrl = `${RAA_ROOT}/Recueil-des-actes-administratifs-${annee}`;
  log(`Découverte pour ${annee} : ${yearUrl}`);

  // Tenter de lire la page de l'année pour extraire les vrais liens
  let html = null;
  try {
    html = await fetchHtml(yearUrl);
  } catch(err){
    warn(`Page année inaccessible (${err.message}). Mode heuristique.`);
  }

  const candidates = new Map(); // url -> label canonique

  if (html){
    const $ = cheerio.load(html);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const txt = $(el).text().trim().toUpperCase();
      if (!href) return;

      for (const [canonical, variants] of Object.entries(MOIS_VARIANTS)){
        // Correspondance par URL
        const urlMatch = variants.some(v => new RegExp(`/${v}(/|$)`, 'i').test(href));
        // Correspondance par texte du lien
        const txtMatch = txt === canonical;

        if (urlMatch || txtMatch){
          const full = href.startsWith('http')
            ? href
            : BASE + (href.startsWith('/') ? href : '/' + href);
          candidates.set(full, canonical);
          return;
        }
      }
    });
  }

  // ✅ Fallback : URLs MAJUSCULES uniquement (validé par le test réel)
  if (candidates.size === 0){
    log('  → Mode heuristique (URLs MAJUSCULES uniquement)');
    for (const canonical of MOIS_FR){
      candidates.set(`${yearUrl}/${canonical}`, canonical);
    }
  }

  // ✅ Filtrer les mois futurs (pour l'année en cours)
  const now = new Date();
  const moisMax = (now.getFullYear() === annee) ? now.getMonth() + 1 : 12;

  const ordered = [...candidates.entries()]
    .filter(([, mois]) => MOIS_FR.indexOf(mois) < moisMax)
    .sort(([, a], [, b]) => MOIS_FR.indexOf(a) - MOIS_FR.indexOf(b));

  log(`  → ${ordered.length} mois à scraper`);
  return ordered;
}

// ============================================================
// SCRAPE D'UNE ANNÉE
// ============================================================
async function scrapeYear(annee){
  const moisUrls = await getMonthUrls(annee);
  const allActes = [];

  for (const [url, moisLabel] of moisUrls){
    try {
      log(`  Scraping ${annee}/${moisLabel} → ${url}`);
      const html = await fetchHtml(url);
      const actes = parseMonthPage(html, annee, moisLabel);
      log(`    → ${actes.length} actes`);
      allActes.push(...actes);
      await sleep(DELAY_MS);
    } catch(err){
      warn(`  Échec ${url} : ${err.message}`);
    }
  }

  return allActes;
}

// ============================================================
// MAIN
// ============================================================
async function main(){
  const annees = process.argv.slice(2).length
    ? process.argv.slice(2).map(Number)
    : [new Date().getFullYear()];

  log(`Années à scraper : ${annees.join(', ')}`);

  const all = [];
  for (const annee of annees){
    log(`\n=== Année ${annee} ===`);
    const actes = await scrapeYear(annee);
    all.push(...actes);
  }

  // ✅ Dédoublonnage global (URL ou titre)
  const unique = [];
  const seenKeys = new Set();
  for (const a of all){
    const key = a.url || a.titre.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    unique.push(a);
  }

  // Tri par date décroissante
  unique.sort((a, b) => {
    const da = a.date_publication || `${a.annee}-00-00`;
    const db = b.date_publication || `${b.annee}-00-00`;
    return db.localeCompare(da);
  });

  // Écriture
  const outDir = path.resolve('json');
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'raa_reunion.json');

  const payload = {
    source: RAA_ROOT,
    generated_at: new Date().toISOString(),
    departement: '974',
    prefecture: 'Saint-Denis',
    region: 'La Réunion',
    total: unique.length,
    results: unique
  };

  await writeFile(outFile, JSON.stringify(payload, null, 2), 'utf-8');
  log(`\n✅ ${unique.length} actes écrits dans ${outFile}`);
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err);
  process.exit(1);
});