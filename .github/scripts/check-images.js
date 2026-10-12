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
assert(/items=items.slice(0,3)/.test(html), "Lesson image gallery should render up to three results");
assert(/data-source-page/.test(html) && /reader-gallery-source/.test(html), "Gallery images need per-file source links");
assert(/ext.ImageDescription/.test(html) && /ext.LicenseShortName/.test(html), "Gallery cards should display available source metadata");
assert(!/class="factnote">'+notes[i]/.test(html), "Repeated generic guidance still appears under every lesson fact");
assert(/epochImageFailed/.test(html), "Background loading should skip a candidate that already failed");

console.log("Image structure OK: 182/182 lesson routes, 26/26 background queries, per-image source routing, retry/fallback and up-to-three sourced gallery results.");

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
async function retry(label, fn) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { return await fn(); }
    catch (error) {
      last = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 700));
    }
  }
  throw new Error(label + " failed after 3 attempts: " + String(last && last.message || last));
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
}

if (process.argv.includes("--online")) {
  onlineCheck().catch(error => {
    console.error("Live image smoke test FAILED:", error && error.stack || error);
    process.exitCode = 1;
  });
}
