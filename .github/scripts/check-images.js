"use strict";
const assert = (ok, message) => { if (!ok) throw new Error(message); };
global.window = {};
require("../../curriculum.js");
require("../../curriculum-visuals.js");

const fs = require("node:fs");
const path = require("node:path");
const course = window.HISTORY_CURRICULUM;
const visuals = window.HISTORY_EPOCH_VISUALS;
const html = fs.readFileSync(path.join(__dirname, "../../index.html"), "utf8");

assert(course && course.lessons.length === 182, "Media audit expected exactly 182 lessons");
assert(visuals && Object.keys(visuals).length === 26, "Expected image-search data for all 26 modules");

const missing = [];
const weakQueries = [];
for (let i = 0; i < course.lessons.length; i++) {
  const row = course.lessons[i];
  const day = i + 1;
  const wiki = row[5];
  const imageSearch = row[6] && row[6].imageSearch;
  if (typeof wiki !== "string" || !wiki.trim()) missing.push(day + ": missing article/image key");
  if (typeof imageSearch !== "string" || imageSearch.trim().length < 5) missing.push(day + ": missing descriptive image-search query");
  if (typeof imageSearch === "string" && /^(image|photo|picture|historical image|изображение|картинка)$/i.test(imageSearch.trim())) {
    weakQueries.push(day + ": generic query \"" + imageSearch + "\"");
  }
}
assert(missing.length === 0, "Lessons without an image/article route: " + missing.join("; "));
assert(weakQueries.length === 0, "Image queries too generic to be useful: " + weakQueries.join("; "));

function lessonImageQuery(title) {
  const row = course.lessons.find(item => item[0] === title);
  return String(row && row[6] && row[6].imageSearch || "");
}
assert(/evidence|source|document/i.test(lessonImageQuery("Что изучает история?")),
  "Lesson 1 image query must represent historical evidence and sources");
assert(/timeline|chronology/i.test(lessonImageQuery("Хронология и историческое время")),
  "Lesson 2 image query must represent chronology or timelines");
assert(/map|geography/i.test(lessonImageQuery("География и карта как источник")),
  "Lesson 3 image query must represent maps or historical geography");
assert(html.includes('if (l.day === 2 && /(genealog|souverain|family of|family tree|house of|dynasty|lineage|dukes|emperors to|kings of)/i.test(title))'),
  "Lesson 2 gallery must suppress genealogy-heavy matches");
assert(html.includes('if (l.day === 3 && /\\b(cover|covers|title page|contents|frontispiece)\\b/i.test(title))'),
  "Lesson 3 gallery must suppress atlas covers and title pages");


for (let week = 1; week <= 26; week++) {
  const item = visuals[week];
  assert(item && typeof item.query === "string" && item.query.trim().length >= 8, "Missing descriptive background query for module " + week);
  assert(typeof item.label === "string" && item.label.trim(), "Missing Russian background label for module " + week);
  assert(typeof item.focus === "string" && item.focus.trim().length >= 3, "Missing single-topic focus for module " + week);
  assert(item.query.toLocaleLowerCase().includes(item.focus.toLocaleLowerCase()),
    "Background query must include its declared focus for module " + week + ": " + item.query);
}

assert(/id="readerImage"[^>]*alt="[^"]+"/.test(html), "Reader image needs non-empty alt text");
assert(/id="image"[^>]*alt="[^"]+"/.test(html), "Cover image needs non-empty alt text");
assert(/id="taskImage"[^>]*alt="[^"]+"/.test(html), "Image-task photo needs non-empty alt text");
assert(/id="imageViewerImage"/.test(html) && /id="imageViewerClose"/.test(html), "Image viewer controls are missing");
assert(/img.dataset.sourcePage=source/.test(html), "Displayed lesson images must keep their own source URL");
assert(/source=img.dataset.sourcePage||el("taskPhotoLink").href/.test(html), "Viewer must open the source belonging to the clicked image");
assert(/function handleTopicImageError\(l,fromCommons\)/.test(html), "Image error fallback handler is missing");
assert(/imageLoadGuard.fallbackStarted/.test(html), "Image fallback must be limited to one Commons retry");
assert(/piprop=name%7Cthumbnail%7Coriginal/.test(html), "Primary image request should use the MediaWiki Action API with filename/original metadata");
const loadImageStart = html.indexOf("function loadImage(l){");
const loadImageEnd = html.indexOf("function renderSources(){", loadImageStart);
const primaryImageLoader = loadImageStart >= 0 && loadImageEnd > loadImageStart ? html.slice(loadImageStart, loadImageEnd) : "";
assert(primaryImageLoader && !primaryImageLoader.includes("api/rest_v1/page/summary/"), "Primary image loader must use the updated MediaWiki Action API path");
assert(/MIN_READER_GALLERY_IMAGES = 5/.test(html) && /MAX_READER_GALLERY_IMAGES = 9/.test(html),
  "Every lesson should target 5–10 relevant images in total: main image plus 5–9 gallery items");
assert(/l\.imageQuery \|\|/.test(html), "Gallery must use the actual per-lesson curated image query");
assert(!/l\.imageSearch/.test(html),
  "Primary image fallback, chapter background and image gallery must all use runtime l.imageQuery rather than a nonexistent property");
assert(/function loadCommonsImage\(l\)[\s\S]*?queries=\[l\.imageQuery\|\|""/.test(html),
  "Primary image Commons fallback must use the lesson-specific curated image query");
assert(/function loadEpochBackground\(l\)[\s\S]*?l\.imageQuery/.test(html),
  "Chapter background fallback must use the runtime lesson image query");
assert(!/Historical_method.{0,80}Thucydides/.test(html), "A generic historical-method lesson must not be hardwired to Thucydides as its image subject");
assert(!/Thucydides Peloponnesian War/.test(html), "Gallery fallback must not replace the lesson query with an unrelated named person");
assert(/collected\.slice\(0, MAX_READER_GALLERY_IMAGES\)/.test(html), "Gallery must cap the number of supplemental images");
assert(/function localizedGalleryImage/.test(html), "Every gallery image needs a Russian topic-specific caption");
assert(!/description:cleanAttribution\(ext\.ImageDescription/.test(html),
  "Raw English Wikimedia ImageDescription must never be rendered as the pupil-facing caption");
assert(/localizedLicenseLabel/.test(html), "Image licence labels must be localized into Russian");
assert(/pointerdown/.test(html) && /pointermove/.test(html) && /scrollLeft=imagePanState/.test(html),
  "Zoomed images must support pointer drag-to-pan");
assert(/e\.target===el\("imageViewer"\)/.test(html) && /e\.key==="Escape"/.test(html),
  "Viewer must close on backdrop click and Escape");
assert(/data-source-page/.test(html) && /reader-gallery-source/.test(html), "Gallery images need per-file source links");
assert(/localizedLicenseLabel/.test(html) && /ext.LicenseShortName/.test(html), "Image licences must stay available as localized labels and source links");
assert(!/class="factnote">'+notes[i]/.test(html), "Repeated generic guidance still appears under every lesson fact");
assert(/epochImageFailed/.test(html), "Background loading should skip a candidate that already failed");
assert(/id="viewPageBackground"/.test(html), "Home page must expose a way to open the background image in the viewer");
assert(/function drawHome\(\)[\s\S]{0,1800}loadEpochBackground\(current\(\)\)/.test(html),
  "Home page background must load before the first lesson is opened");
assert(/function parseRetryAfterMs/.test(require("node:fs").readFileSync(__filename, "utf8")),
  "Media audit must handle Retry-After delta-seconds and HTTP-date");
assert(/function isUsableEpochImage\(page,info\)/.test(html),
  "Background loader must accept explicit image MIME or a safe image extension when MIME is omitted");
assert(/el\("viewPageBackground"\)\.addEventListener\("click"/.test(html),
  "Background viewer control must open the source for the selected epoch");

console.log("Image checks OK: 182/182 lesson routes, 26 backgrounds, 5–10 total image target, Russian captions and licences, original-source links, zoom/pan/close viewer.");

/* Optional live smoke test. This checks the endpoints and one returned image, not all 182
   search results; automatic search results still require editorial relevance review. */
async function withTimeout(url, timeoutMs = 15000, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { "User-Agent": "istoriya-vdvoem-media-check/1.0 (GitHub Actions)", ...(options.headers || {}) }
    });
  } finally {
    clearTimeout(timer);
  }
}
function parseRetryAfterMs(value, now = Date.now()) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(raw);
  if (Number.isFinite(date)) return Math.max(0, date - now);
  return null;
}
assert(parseRetryAfterMs("12", 0) === 12000, "Retry-After delta-seconds must be parsed");
assert(parseRetryAfterMs("Thu, 01 Jan 1970 00:00:05 GMT", 0) === 5000,
  "Retry-After HTTP-date must be parsed");
assert(parseRetryAfterMs("not a date", 0) === null, "Invalid Retry-After must be ignored");
async function retry(label, fn) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { return await fn(); }
    catch (error) {
      last = error;
      if (attempt < 3) {
        const rawDelay = Number(error && error.retryAfterMs);
        const delay = Number.isFinite(rawDelay) && rawDelay >= 0 ? rawDelay : attempt * 1500;
        console.log(label + ": retry " + (attempt + 1) + "/3 after " + delay + " ms");
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(label + " failed after 3 attempts: " + String(last && last.message || last));
}
function hasUsableImageMetadata(page) {
  const info = page && page.imageinfo && page.imageinfo[0] || {};
  const title = String(page && page.title || "");
  const mime = String(info.mime || "");
  if (!(info.thumburl || info.url) || !info.descriptionurl || !info.url) return false;
  if (/\.(pdf|djvu?|ogg|oga|opus|mp3|mp4|webm|wav|flac|zip|tar)$/i.test(title)) return false;
  if (mime) return /^image\//i.test(mime);
  return /\.(jpe?g|png|gif|webp|tiff?|svg|avif|xcf)$/i.test(title);
}

async function checkBackgroundQueries() {
  const items = [];
  for (let week = 1; week <= 26; week++) {
    const row = course.lessons[(week - 1) * 7];
    const entry = visuals[week];
    items.push({
      week, label: entry.label, article: entry.article || "",
      preferredFile: entry.preferredFile || "",
      queries: [...new Set([entry.query, row[6] && row[6].imageSearch, row[0]].filter(Boolean))]
    });
  }
  const results = [], missing = [];
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  function isUsable(page) {
    const info = page && page.imageinfo && page.imageinfo[0];
    if (!page || !info || !info.thumburl || !info.descriptionurl || !info.url) return false;
    const title = String(page.title || "").toLowerCase();
    const mime = String(info.mime || "").toLowerCase();
    if (/\.(pdf|djvu|epub)$/i.test(title)) return false;
    if (mime && !mime.startsWith("image/")) return false;
    return true;
  }
  async function getJson(url, label) {
    return retry(label, async () => {
      const response = await withTimeout(url);
      if (response.status === 429 || response.status === 503) {
        const error = new Error(label + " returned HTTP " + response.status);
        error.retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after")) ?? 12000;
        throw error;
      }
      assert(response.ok, label + " returned HTTP " + response.status);
      const payload = await response.json();
      if (payload && payload.error) {
        const code = String(payload.error.code || "");
        const message = String(payload.error.info || payload.error.message || code);
        const error = new Error(label + " API error " + code + ": " + message);
        if (/maxlag|ratelimit|readonly|throttl/i.test(code + " " + message)) error.retryAfterMs = 12000;
        throw error;
      }
      return payload;
    });
  }
  function saveCandidate(item, found) {
    results.push(found);
    console.log("BACKGROUND CANDIDATE " + JSON.stringify({
      week:found.week,label:found.label,file:found.file,method:found.method,
      preferredFile:item.preferredFile || "",fallbackUsed:!!found.fallbackUsed,source:found.source
    }));
  }
  async function stoppedByRateLimit(error, item) {
    const message = String(error && error.message || error);
    if (!/HTTP 429|HTTP 503|maxlag|rate.?limit|throttl/i.test(message)) return false;
    const note = "Live background audit INCONCLUSIVE: " + results.length +
      "/26 modules checked; Wikimedia rate limit while checking module " + item.week +
      ". The rest remain unverified, not missing.";
    console.log(note);
    throw new Error(note);
  }

  for (const item of items) {
    let found = null;
    // 1) Check the exact, editorially selected Commons file first.
    if (item.preferredFile) {
      const url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
        encodeURIComponent(item.preferredFile) +
        "&prop=imageinfo&iiprop=url%7Cextmetadata%7Cmime%7Csize&iiurlwidth=240&format=json&origin=*";
      try {
        const payload = await getJson(url, "Pinned Commons file for module " + item.week);
        await pause(10000);
        const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
        const candidate = pages.find(page => page.title === item.preferredFile && isUsable(page));
        if (candidate) {
          const info = candidate.imageinfo[0];
          found = {
            week:item.week,label:item.label,article:item.article,file:candidate.title,
            source:info.descriptionurl,method:"pinned-file",fallbackUsed:false
          };
        } else {
          console.log("PINNED FILE UNAVAILABLE " + JSON.stringify({week:item.week,file:item.preferredFile}));
        }
      } catch (error) {
        await stoppedByRateLimit(error,item);
        console.log("PINNED FILE LOOKUP FAILED " + JSON.stringify({week:item.week,file:item.preferredFile,error:String(error.message||error)}));
      }
    }
    if (found) { saveCandidate(item,found); continue; }

    // 2) Use the declared Wikipedia article thumbnail before a text search.
    if (item.article) {
      const url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cinfo&piprop=thumbnail%7Coriginal%7Cname&pithumbsize=600&inprop=url&redirects=1&titles=" +
        encodeURIComponent(item.article) + "&format=json&origin=*";
      try {
        const payload = await getJson(url,"Wikipedia article image for module " + item.week);
        await pause(10000);
        const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
        const page = pages.find(p => !p.missing && p.thumbnail && p.thumbnail.source && p.pageimage);
        if (page) {
          found = {
            week:item.week,label:item.label,article:item.article,file:"File:"+page.pageimage,
            source:page.fullurl || "https://en.wikipedia.org/wiki/"+encodeURIComponent(String(page.title||item.article).replace(/ /g,"_")),
            method:"article-thumbnail",fallbackUsed:!!item.preferredFile
          };
        }
      } catch (error) {
        await stoppedByRateLimit(error,item);
        console.log("ARTICLE IMAGE FALLBACK " + JSON.stringify({week:item.week,article:item.article,error:String(error.message||error)}));
      }
    }
    if (found) { saveCandidate(item,found); continue; }

    // 3) Commons text-search is the last resort, with PDF/DjVu and non-image results rejected.
    for (let queryIndex = 0; queryIndex < item.queries.length; queryIndex++) {
      const query = item.queries[queryIndex];
      const url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
        encodeURIComponent(query) + "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cextmetadata%7Cmime%7Csize&iiurlwidth=240&format=json&origin=*";
      try {
        const payload = await getJson(url,"Commons search for module " + item.week);
        await pause(10000);
        const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
        const candidate = pages.find(isUsable);
        if (candidate) {
          const info = candidate.imageinfo[0];
          found = {week:item.week,label:item.label,article:item.article,file:candidate.title,
            source:info.descriptionurl,method:"commons-search",fallbackUsed:true};
          break;
        }
      } catch (error) {
        await stoppedByRateLimit(error,item);
        console.log("COMMONS QUERY FAILED " + JSON.stringify({week:item.week,query,error:String(error.message||error)}));
      }
    }
    if (found) saveCandidate(item,found);
    else {
      missing.push(item.week);
      console.log("BACKGROUND MISSING " + JSON.stringify({week:item.week,label:item.label,article:item.article,preferredFile:item.preferredFile||"",queries:item.queries}));
    }
  }

  const manifest = results.map(item => ({
    week:item.week,label:item.label,file:item.file,method:item.method,
    preferredFile:item.preferredFile||"",fallbackUsed:!!item.fallbackUsed
  }));
  console.log("Background candidate manifest (compact): " + JSON.stringify(manifest));
  if (missing.length) throw new Error("No usable background image candidate for module(s): " + missing.join(", "));
  const fileMatches = results.filter(item => item.method === "pinned-file").length;
  console.log("Live background audit OK: " + results.length + "/26 usable candidates; " +
    fileMatches + " pinned files verified; remaining candidates use article thumbnails or Commons search.");
}


async function liveAuditLessonQueries(range) {
  const match = String(range || "").match(/^(\d+)-(\d+)$/);
  assert(match, "Lesson audit range must look like 1-3");
  const startDay = Number(match[1]), endDay = Number(match[2]);
  assert(startDay >= 1 && endDay >= startDay && endDay <= 182, "Lesson audit range is outside the course");
  const stopWords = new Set(("the and for with from into that this these those about image images photo photos photograph " +
    "photographs historical history picture pictures painting paintings illustration illustrations museum archive " +
    "ancient medieval modern early late century period old new source sources artifact artifacts").split(/\s+/));
  const shortfalls = [];
  for (let day = startDay; day <= endDay; day++) {
    const row = course.lessons[day - 1], reading = row && row[6] || {};
    assert(row && reading.imageSearch, "Lesson " + day + " has no curated image query");
    const title = String(row[0] || ""), wiki = String(row[5] || "");
    const batchSpecificQueries = {
      1: ["historical letter manuscript document", "handwritten letter historical document", "historical manuscript letter archive", "historical source inscription tablet manuscript"],
      2: ["world history chronology timeline chart", "historical chronological table timeline", "world history timeline dates periods", "timeline of world history"],
      3: ["historical atlas world map geography physical features", "world map rivers mountains geography", "historical atlas map continents regions", "old world map physical geography"]
    };
    Object.assign(batchSpecificQueries, {
    4: ["archaeological excavation stratigraphy soil section layers","archaeological excavation pottery bones tools in situ","archaeological assemblage flint tools animal remains excavation"],
    5: ["medieval charter parchment wax seal historical document","historical handwritten letter diary manuscript archive","ancient cuneiform tablet papyrus manuscript inscription","Magna Carta historical charter manuscript parchment","Declaration of Independence original document handwriting archive","historical treaty manuscript original signed document","archival collection historic handwritten letter paper document","ancient Egyptian papyrus manuscript text museum","historic legal deed parchment seal archive","primary historical source document manuscript letter signed scan"],
    6: ["World War propaganda recruitment poster archival collection","historical political propaganda poster museum archive","war memorial monument commemorative plaque public memory"],
    7: ["historical source manuscript document analysis", "historical handwritten charter letter archive scan", "ancient cuneiform tablet inscription museum", "medieval parchment charter manuscript seal archive"],
    8: ["Homo sapiens Neanderthal Denisovan fossil skull museum", "Neanderthal cranium fossil scientific collection", "early Homo sapiens fossil skull Jebel Irhoud", "Denisovan fossil tooth human evolution museum"],
    9: ["Paleolithic hunter gatherer stone tools Mesolithic artifacts museum", "Mesolithic microlith flint tools archaeological excavation", "Upper Paleolithic cave art prehistoric hunter gatherer", "hunter gatherer camp reconstruction archaeology museum"]
  });
    const queryList = [
      reading.imageSearch || "",
      ...(batchSpecificQueries[day] || [
        wiki.replace(/_/g, " ") + " historical image",
        wiki.replace(/_/g, " ") + " museum archive artifact",
        title + " historical photograph painting document",
        title + " map monument primary source"
      ])
    ].filter((query, index, all) => query && all.indexOf(query) === index);
    const topicTokens = Array.from(new Set((title + " " + wiki + " " + String(reading.imageSearch || "")).toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, " ").split(/\s+/)
      .filter(token => token.length >= 4 && !stopWords.has(token))));
    const lessonAuditTerms = {
      4: ["archaeolog", "excavation", "stratigraph", "pottery", "bone", "artifact", "flint", "skeleton", "burial", "layer", "trench", "remains"],
      5: ["primary", "document", "charter", "manuscript", "letter", "diary", "papyrus", "tablet", "parchment", "seal", "inscription", "declaration"],
      6: ["propaganda", "poster", "monument", "memorial", "commemorative", "plaque", "political", "campaign", "memory", "recruitment"],
      7: ["historical", "source", "manuscript", "document", "charter", "letter", "cuneiform", "tablet", "inscription", "parchment", "archive"],
      8: ["homo", "sapiens", "neanderthal", "denisovan", "fossil", "skull", "cranium", "hominin", "evolution", "jebel", "tooth"],
      9: ["paleolithic", "mesolithic", "hunter", "gatherer", "stone", "flint", "microlith", "cave", "prehistoric", "camp", "foraging"]
    };
    topicTokens.push(...(lessonAuditTerms[day] || []));
    const minimumScore = day === 5 ? 1 : (day >= 2 && day <= 9 ? 2 : 1);
    const seen = new Set(), families = new Set(), collected = [];
    function sourceFamily(raw) {
      const value = String(raw || "").toLowerCase().replace(/\([^)]*\)/g, " ")
        .replace(/\b\d{6,}\b/g, " ").replace(/\b\d{4}\b/g, " ")
        .replace(/[^a-z0-9а-яё]+/gi, " ").replace(/\s+/g, " ").trim();
      return value.split(" ").slice(0, 7).join(" ");
    }
    for (const query of queryList) {
      const url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
        encodeURIComponent(query) + "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cextmetadata%7Cmime&iiurlwidth=500&format=json&origin=*";
      const payload = await retry("Live Commons query for lesson " + day, async () => {
        const response = await withTimeout(url, 15000);
        if (response.status === 429 || response.status === 503) {
          const error = new Error("Commons query for lesson " + day + " returned HTTP " + response.status);
          error.retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after")) ?? 12000;
          throw error;
        }
        assert(response.ok, "Commons query for lesson " + day + " returned HTTP " + response.status);
        const data = await response.json();
        assert(!data.error, "Commons query for lesson " + day + " returned API error");
        return data;
      });
      const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
      const candidates = pages.map(page => {
        const info = page && page.imageinfo && page.imageinfo[0] || {};
        const file = String(page && page.title || "").replace(/^File:/, "");
        const mime = String(info.mime || "").toLowerCase();
        const ext = info.extmetadata || {};
        const description = String(ext.ImageDescription && ext.ImageDescription.value || "").replace(/<[^>]*>/g, " ");
        if (!info.thumburl || !info.url || !info.descriptionurl) return null;
        if (/\.(pdf|djvu?|epub|ogg|oga|opus|mp3|mp4|webm|wav|flac|zip|tar)$/i.test(file)) return null;
        if (day === 2 && /(genealog|souverain|family of|family tree|house of|dynasty|lineage|dukes|emperors to|kings of)/i.test(file)) return null;
        if (day === 3 && /\b(cover|covers|title page|contents|frontispiece)\b/i.test(file)) return null;
        if (day === 4 && /(mosaic|medallion|portrait|sculpture|statue|artwork)/i.test(file) && !/(excavat|archaeolog|stratigraph|in situ|findid)/i.test(file)) return null;
        if (day === 5 && /(fictional|novel|album|movie|film|fan art|comic|cartoon)/i.test(file)) return null;
        if (day === 6 && /(uniform|clothing|helmet|side cap|malaria|health museum|medical exhibit|comic|cartoon)/i.test(file)) return null;
        if (mime && mime.indexOf("image/") !== 0) return null;
        const words = (file + " " + description).toLowerCase().replace(/[^a-z0-9а-яё]+/gi, " ").split(/\s+/);
        const score = topicTokens.reduce((sum, token) => sum + (words.some(word =>
          word === token || (word.length >= 5 && token.length >= 5 &&
            (word.indexOf(token) === 0 || token.indexOf(word) === 0))) ? 1 : 0), 0);
        return score >= minimumScore ? {file, score, mime: mime || "unspecified", source: info.descriptionurl, query} : null;
      }).filter(Boolean);
      candidates.sort((a,b) => b.score - a.score);
      candidates.forEach(item => {
        const family = sourceFamily(item.file);
        if (!seen.has(item.source) && !families.has(family) && collected.length < 9) {
          seen.add(item.source); families.add(family); collected.push(item);
        }
      });
      if (collected.length >= 9) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log("LIVE LESSON GALLERY AUDIT " + JSON.stringify({
      day, title, queryList, minimumScore, candidateCount: collected.length,
      candidates: collected.slice(0, 9).map(item => ({
        file: item.file, score: item.score, mime: item.mime, query: item.query, source: item.source
      }))
    }));
    if (collected.length < 5) {
      const message = "Lesson " + day + " has only " + collected.length + " usable images after relevance and type filters; expected at least 5.";
      console.log("LIVE LESSON GALLERY NOTE " + JSON.stringify({day, title, note: message}));
      shortfalls.push(message);
    }
  }
  if (shortfalls.length) throw new Error(shortfalls.join(" | "));
}

async function onlineCheck() {
  const wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cinfo&piprop=name%7Cthumbnail%7Coriginal&pithumbsize=600&inprop=url&titles=Hammurabi&format=json&origin=*";
  const wikiData = await retry("Wikipedia Action API", async () => {
    const response = await withTimeout(wikiUrl);
    assert(response.ok, "Wikipedia Action API returned HTTP " + response.status);
    const data = await response.json();
    assert(data.query && data.query.pages, "Wikipedia Action API returned no pages");
    return data;
  });
  const wikiPages = Object.values(wikiData.query.pages);
  assert(wikiPages.some(p => p.title && (p.thumbnail && p.thumbnail.source || p.pageimage)), "Wikipedia image endpoint gave no image filename/thumbnail for Hammurabi");

  const commonsUrl = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=Hammurabi%20code%20stele%20Louvre&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=500&format=json&origin=*";
  const commonsData = await retry("Wikimedia Commons API", async () => {
    const response = await withTimeout(commonsUrl);
    assert(response.ok, "Commons API returned HTTP " + response.status);
    const data = await response.json();
    assert(data.query && data.query.pages, "Commons API returned no image results");
    return data;
  });
  const candidate = Object.values(commonsData.query.pages)
    .map(p => ({ title: p.title, info: p.imageinfo && p.imageinfo[0] }))
    .find(p => p.info && p.info.thumburl && p.info.descriptionurl && p.info.url);
  assert(candidate, "Commons returned no usable thumbnail/source/original URLs");

  const imageResponse = await retry("Wikimedia thumbnail response", async () => {
    const response = await withTimeout(candidate.info.thumburl, 15000, { headers: { Range: "bytes=0-0" } });
    assert(response.ok, "Thumbnail returned HTTP " + response.status);
    const type = response.headers.get("content-type") || "";
    assert(/^image\//i.test(type), "Thumbnail returned non-image content type: " + type);
    if (response.body && response.body.getReader) {
      const reader = response.body.getReader();
      await reader.read();
      await reader.cancel().catch(() => {});
    }
    return { status: response.status, type };
  });
  console.log("Live image smoke test OK: Wikipedia Action API returned page data; Commons returned \"" + candidate.title + "\"; thumbnail returned " + imageResponse.status + " (" + imageResponse.type + ").");
  const auditArg = process.argv.find(arg => arg.startsWith("--lesson-audit="));
  if (auditArg) await liveAuditLessonQueries(auditArg.split("=")[1]);
}

if (process.argv.includes("--background-audit")) {
  checkBackgroundQueries().catch(error => {
    console.error("Live background audit FAILED:", error && error.stack || error);
    process.exitCode = 1;
  });
} else if (process.argv.includes("--online")) {
  onlineCheck().catch(error => {
    console.error("Live image smoke test FAILED:", error && error.stack || error);
    process.exitCode = 1;
  });
}
