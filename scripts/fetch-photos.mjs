#!/usr/bin/env node
/**
 * Downloads openly licensed photos from Wikimedia Commons, crops and compresses them to WebP,
 * and records author and licence for the credits page.
 *
 *   npm run photos               fetch every photo not yet downloaded
 *   npm run photos -- --force    refetch everything
 *   npm run photos -- crew-lion  fetch only the given ids
 *   npm run photos -- --pick 2 crew-lion   use the 3rd search result instead of the 1st
 *   npm run photos -- --dry      print what would be fetched
 *
 * Only CC0, public domain, CC BY and CC BY-SA files are accepted. Files under
 * those licences may be used in a game other families play, as long as the
 * credits page shows the author and licence, which this script records.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'public/img');
const CREDITS = path.join(ROOT, 'src/content/credits.json');
const UA = 'AnimalRally/0.1 (https://github.com/dxxx/Kids-Development; educational kids game)';
const API = 'https://commons.wikimedia.org/w/api.php';
const OK_LICENCE = /^(cc0|public domain|pd|cc[- ]by(-sa)?[- ]\d)/i;
const SIZES = { square: { w: 640, h: 640 }, wide: { w: 1600, h: 900 } };

const args = process.argv.slice(2);
const force = args.includes('--force');
const dry = args.includes('--dry');
const pickIdx = args.indexOf('--pick');
const pick = pickIdx >= 0 ? Number(args[pickIdx + 1]) : 0;
const only = args.filter((a, i) => !a.startsWith('--') && !(pickIdx >= 0 && i === pickIdx + 1));

const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status} for ${url}`);
  return res.json();
}

/** Returns candidate files with licence info, best first. */
async function candidates(entry) {
  const base = { prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: '1800' };
  const data = entry.file
    ? await api({ action: 'query', titles: entry.file.startsWith('File:') ? entry.file : `File:${entry.file}`, ...base })
    : await api({
        action: 'query',
        generator: 'search',
        gsrsearch: `${entry.query} filetype:bitmap`,
        gsrnamespace: '6',
        gsrlimit: '20',
        ...base,
      });
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const m = ii.extmetadata ?? {};
      return {
        title: p.title,
        page: ii.descriptionurl,
        url: ii.thumburl || ii.url,
        width: ii.width,
        height: ii.height,
        mime: ii.mime,
        licence: stripHtml(m.LicenseShortName?.value),
        licenceUrl: m.LicenseUrl?.value ?? '',
        author: stripHtml(m.Artist?.value) || 'Unknown',
      };
    })
    .filter((c) => c && /image\/(jpeg|png|webp)/.test(c.mime) && OK_LICENCE.test(c.licence) && c.width >= 800);
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, 'scripts/photos.json'), 'utf8'));
  const entries = Object.entries(manifest)
    .filter(([k]) => !k.startsWith('_'))
    .flatMap(([group, list]) => list.map((e) => ({ ...e, group })))
    .filter((e) => !only.length || only.includes(e.id));

  const credits = existsSync(CREDITS) ? JSON.parse(await readFile(CREDITS, 'utf8')) : {};
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  const failed = [];

  for (const entry of entries) {
    const out = path.join(OUT_DIR, `${entry.id}.webp`);
    if (!force && !only.length && existsSync(out) && credits[entry.id]) continue;
    try {
      const list = await candidates(entry);
      const c = list[Math.min(pick, list.length - 1)];
      if (!c) throw new Error('no openly licensed result; adjust the query or pin a file');
      if (dry) {
        console.log(`${entry.id}: ${c.title} [${c.licence}] by ${c.author}`);
        continue;
      }
      const res = await fetch(c.url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const { w, h } = SIZES[entry.shape] ?? SIZES.square;
      await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize(w, h, { fit: 'cover', position: sharp.strategy.attention })
        .webp({ quality: 78 })
        .toFile(out);
      credits[entry.id] = { file: c.title, author: c.author, licence: c.licence, licenceUrl: c.licenceUrl, source: c.page };
      console.log(`✓ ${entry.id}  ${c.title}  [${c.licence}]`);
      ok++;
      await new Promise((r) => setTimeout(r, 300)); // be polite to Wikimedia
    } catch (err) {
      failed.push(entry.id);
      console.error(`✗ ${entry.id}: ${err.message}`);
    }
  }

  if (!dry) {
    const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)));
    await writeFile(CREDITS, JSON.stringify(sorted, null, 2) + '\n');
  }
  console.log(`\n${ok} downloaded, ${failed.length} failed${failed.length ? ': ' + failed.join(', ') : ''}`);
  if (failed.length) process.exitCode = 1;
}

main();
