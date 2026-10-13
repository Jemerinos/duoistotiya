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
assert(html.includes("collected.slice(0,3)"), "Lesson image gallery should render up to three results");
assert(/data-source-page/.test(html) && /reader-gallery-source/.test(html), "Gallery images need per-file source links");
assert(/ext.ImageDescription/.test(html) && /ext.LicenseShortName/.test(html), "Gallery cards should display available source metadata");
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

console.log("Image structure OK: 182/182 lesson routes, 26/26 single-focus background queries, per-image source routing, retry/fallback and up-to-three sourced gallery results.");

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
      week,
      label: entry.label,
      article: entry.article,
      queries: [...new Set([entry.query, row[6] && row[6].imageSearch, row[0]].filter(Boolean))]
    });
  }
  const results = [];
  const missing = [];
  for (const item of items) {
    let found = null;
    // Article lead images are preferred; broad Commons search is a fallback.
    if (item.article) {
      const articleUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cinfo&piprop=thumbnail%7Coriginal%7Cname&pithumbsize=600&inprop=url&redirects=1&titles=" +
        encodeURIComponent(item.article) + "&format=json&origin=*";
      try {
        const payload = await retry("Wikipedia article image for module " + item.week, async () => {
          const response = await withTimeout(articleUrl);
          if (response.status === 429 || response.status === 503) {
            const error = new Error("Wikipedia article image lookup returned HTTP " + response.status);
            error.retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after")) ?? 12000;
            throw error;
          }
          assert(response.ok, "Wikipedia article image lookup returned HTTP " + response.status);
          return await response.json();
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
        const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
        const page = pages.find(p => !p.missing && p.thumbnail && p.thumbnail.source && p.pageimage);
        if (page) {
          found = {
            week: item.week, label: item.label, article: item.article,
            file: "File:" + page.pageimage, mime: "Wikipedia article thumbnail",
            source: page.fullurl || "https://en.wikipedia.org/wiki/" + encodeURIComponent(page.title.replace(/ /g, "_")),
            thumbnail: page.thumbnail.source,
            original: page.original && page.original.source || page.thumbnail.source,
            fallbackUsed: false, method: "article-first"
          };
          results.push(found);
          console.log("BACKGROUND CANDIDATE " + JSON.stringify(found));
          continue;
        }
        console.log("ARTICLE IMAGE EMPTY " + JSON.stringify({week:item.week,article:item.article}));
      } catch (error) {
        console.log("ARTICLE IMAGE FALLBACK " + JSON.stringify({week:item.week,article:item.article,error:String(error && error.message || error)}));
      }
    }
    for (let queryIndex = 0; queryIndex < item.queries.length; queryIndex++) {
      const query = item.queries[queryIndex];
      const url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
        encodeURIComponent(query) + "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cextmetadata%7Cmime%7Csize&iiurlwidth=200&format=json&origin=*";
      let payload;
      try {
        payload = await retry("Commons background search for module " + item.week, async () => {
          const response = await withTimeout(url);
          if (response.status === 429 || response.status === 503) {
            const error = new Error("Commons background query returned HTTP " + response.status);
            error.retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after")) ?? 12000;
            throw error;
          }
          assert(response.ok, "Commons background query returned HTTP " + response.status);
          const data = await response.json();
          if (data && data.error) {
            const code = String(data.error.code || "");
            const message = String(data.error.info || data.error.message || code);
            const error = new Error("Commons API error " + code + ": " + message);
            if (/maxlag|ratelimit|readonly|throttl/i.test(code + " " + message)) error.retryAfterMs = 12000;
            throw error;
          }
          return data;
        });
      } catch (error) {
        if (/HTTP 429|HTTP 503/.test(String(error && error.message || error))) {
          console.log("Live background image audit INCONCLUSIVE: " + results.length +
            "/26 modules verified before Wikimedia rate limiting at module " + item.week +
            ". Remaining modules are unverified, not classified as missing.");
          return;
        }
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
      const pages = payload.query && payload.query.pages ? Object.values(payload.query.pages) : [];
      const candidate = pages.find(hasUsableImageMetadata);
      if (!candidate) {
        console.log("BACKGROUND QUERY EMPTY " + JSON.stringify({
          week: item.week, query, resultPages: pages.length,
          sampleFiles: pages.slice(0, 4).map(page => {
            const info = page.imageinfo && page.imageinfo[0] || {};
            return {title: page.title,mime: info.mime || "not-returned",thumbnail: !!info.thumburl,source: !!info.descriptionurl};
          })
        }));
      }
      if (candidate) {
        const info = candidate.imageinfo && candidate.imageinfo[0] || {};
        found = {
          week:item.week,label:item.label,article:item.article||"",query,fallbackUsed:queryIndex>0,
          file:candidate.title,mime:info.mime||"unknown",source:info.descriptionurl||"",
          thumbnail:info.thumburl||info.url||"",
          author:info.extmetadata&&info.extmetadata.Artist&&info.extmetadata.Artist.value||"",
          license:info.extmetadata&&info.extmetadata.LicenseShortName&&info.extmetadata.LicenseShortName.value||"",
          method:"commons"
        };
        break;
      }
    }
    if (found) {
      results.push(found);
      console.log("BACKGROUND CANDIDATE " + JSON.stringify(found));
    } else {
      missing.push(item.week + " (" + item.label + "; article: " + (item.article||"none") + "; queries: " + item.queries.join(" / ") + ")");
      console.log("BACKGROUND MISSING " + JSON.stringify({week:item.week,label:item.label,article:item.article||"",queries:item.queries}));
    }
  }
  if (missing.length) {
    console.log("Background candidate manifest: " + JSON.stringify(results.map(item => ({week:item.week,label:item.label,article:item.article||"",file:item.file||"",source:item.source||"",method:item.method||"commons",fallbackUsed:!!item.fallbackUsed}))));
    throw new Error("No live image result for module(s): " + missing.join("; "));
  }
  const fallbacks = results.filter(item => item.fallbackUsed).map(item => item.week);
  console.log("Live background audit OK: " + results.length + "/26 modules have usable image candidates. Full manifest: " +
    JSON.stringify(results.map(item => ({week:item.week,label:item.label,article:item.article||"",file:item.file||"",source:item.source||"",thumbnail:item.thumbnail||"",method:item.method||"commons",fallbackUsed:!!item.fallbackUsed}))) +
    ". Commons fallback query used for module(s): " + (fallbacks.length ? fallbacks.join(", ") : "none") + ".");
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
  await checkBackgroundQueries();
}

if (process.argv.includes("--online")) {
  onlineCheck().catch(error => {
    console.error("Live image smoke test FAILED:", error && error.stack || error);
    process.exitCode = 1;
  });
}
