"use strict";
global.window = {};
require("../../curriculum.js");
require("../../curriculum-details-01.js");
require("../../curriculum-details-02.js");
require("../../curriculum-details-03.js");
require("../../curriculum-details-04.js");
require("../../curriculum-depth.js");
require("../../curriculum-details-apply.js");
require("../../curriculum-research.js");
require("../../curriculum-participants.js");
require("../../curriculum-participant-sources.js");
require("../../curriculum-glossary.js");
const course = window.HISTORY_CURRICULUM;
const assert = (ok, message) => { if (!ok) throw new Error(message); };
assert(course && course.weeks.length === 26, "Expected 26 course modules");
assert(course.lessons.length === 182, "Expected 182 lessons");
const titles = new Set();
const depths = [];
for (let i = 0; i < course.lessons.length; i++) {
  const row = course.lessons[i], day = i + 1, week = course.weeks[Math.floor(i / 7)];
  assert(row[0] && row[1] && row[2] && row[2].endsWith("?") && row[3], "Missing basic fields on lesson " + day);
  assert(!titles.has(row[0]), "Duplicate lesson title: " + row[0]);
  titles.add(row[0]);
  assert(Array.isArray(row[4]) && row[4].length === 3 && row[4].every(Boolean), "Expected three facts on lesson " + day);
  assert(row[6] && row[6].imageSearch && row[6].examPrompt && row[6].rubric, "Missing lesson metadata on day " + day);
  assert(week && week[0] && week[3] && week[4] && week[5], "Incomplete module metadata for lesson " + day);
  const d = row[6].depth;
  assert(d && d.terms && d.people && d.groups && d.chronology && d.cause && d.mechanism && d.effect, "Missing depth fields on lesson " + day);
  assert(d.terms.length >= 3, "Too few terms on lesson " + day);
  assert(d.cause.text && d.mechanism.text && d.effect.text, "Incomplete cause/effect scaffold on lesson " + day);
  assert(Array.isArray(d.causes) && d.causes.length >= 1, "Missing causal evidence on lesson " + day);
  assert(Array.isArray(d.development) && d.development.length >= 1, "Missing event development notes on lesson " + day);
  assert(Array.isArray(d.consequences) && d.consequences.length >= 1, "Missing consequence notes on lesson " + day);
  assert(Array.isArray(d.chronology) && d.chronology.length >= 3, "Incomplete chronology on lesson " + day);
  assert(row[6].detailedText && row[6].detailedText.length >= 220, "Missing expanded reading on lesson " + day);
  assert(row[6].lessonContentVersion === 2, "Missing content coverage layer on lesson " + day);
  assert(Array.isArray(row[6].researchSources) && row[6].researchSources.length >= 2, "Missing topic/source starting points on lesson " + day);
  assert(row[6].researchSources.every(source => /^https:\/\//.test(source.url) && source.title && source.desc), "Invalid source card on lesson " + day);
  depths.push(d);
}
// Audit exact repeated sentences in actual runtime lesson data, including expanded readings.
const sentenceKey = value => String(value || "").toLocaleLowerCase("ru")
  .replace(/ё/g, "е").replace(/[«»„“”"]/g, "")
  .replace(/[^а-яa-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
const splitSentences = value => String(value || "").replace(/\s+/g, " ")
  .split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«„0-9])/u).map(x => x.trim()).filter(Boolean);
const globalSentenceUse = new Map();
let repeatedWithinLesson = 0;
for (let i = 0; i < course.lessons.length; i++) {
  const row = course.lessons[i], day = i + 1, meta = row[6] || {};
  const fields = [["summary", row[3]], ["expanded reading", meta.detailedText],
    ...((row[4] || []).map((value, j) => ["fact " + (j + 1), value]))];
  const seenHere = new Map();
  for (const [field, value] of fields) {
    for (const sentence of splitSentences(value)) {
      const key = sentenceKey(sentence);
      if (key.length < 65) continue;
      const entry = {day, field, sentence};
      if (seenHere.has(key) && seenHere.get(key).field !== field) repeatedWithinLesson++;
      else seenHere.set(key, entry);
      if (!globalSentenceUse.has(key)) globalSentenceUse.set(key, []);
      globalSentenceUse.get(key).push(entry);
    }
  }
}
const crossLessonRepeats = [...globalSentenceUse.entries()]
  .map(([key, uses]) => ({key, uses, days: [...new Set(uses.map(x => x.day))]}))
  .filter(item => item.days.length >= 3);
assert(crossLessonRepeats.length === 0,
  "Identical long sentences are reused across 3+ lessons: " +
  crossLessonRepeats.slice(0, 12).map(item => item.days.join(",") + " → " + item.uses[0].sentence).join(" | "));
const readerHtml = require("node:fs").readFileSync(require("node:path").join(__dirname, "../../index.html"), "utf8");
assert(/detailedTextWithoutSummaryRepeat/.test(readerHtml), "Reader must filter exact summary repeats from expanded reading");
assert(/uniqueReaderFacts/.test(readerHtml), "Fact cards must filter sentences already present in summary/reading");
assert(/depth-evidence-expand/.test(readerHtml) && /depth-chronology-expand/.test(readerHtml),
  "Extracted evidence and chronology must be collapsed by default to avoid repeating the reading");
assert(!/id="depthCheckPoints"/.test(readerHtml), "Repeated generic checklist must be removed from lesson cards");
assert(readerHtml.includes('el("readerExample").classList.toggle("hidden",!l.example)') && !readerHtml.includes("Свяжите исторический процесс с конкретными решениями"),
  "Missing lesson examples must be hidden instead of filled with a generic paragraph");
assert(readerHtml.includes('peopleCard.classList.toggle("hidden",!(peopleHtml||groupsHtml))') && !readerHtml.includes("В тексте не выделена конкретная историческая персоналия"),
  "Empty participant cards must be hidden instead of showing boilerplate");
assert(/id="viewPageBackground"/.test(readerHtml) && /loadEpochBackground\(current\(\)\)/.test(readerHtml),
  "Home screen must load the historical background and provide its viewer control");
console.log("Exact-text audit OK: " + repeatedWithinLesson +
  " long exact sentence overlaps detected inside lessons are hidden by reader de-duplication; no long sentence is reused across 3+ lessons.");

for (const field of ["causes", "development", "consequences"]) {
  const byStatement = new Map();
  for (let i = 0; i < course.lessons.length; i++) {
    for (const value of (course.lessons[i][6].depth[field] || [])) {
      const statement = String(value).trim();
      if (statement.length < 55) continue;
      if (!byStatement.has(statement)) byStatement.set(statement, []);
      byStatement.get(statement).push(i + 1);
    }
  }
  const repeatedBoilerplate = [...byStatement].filter(([, days]) => days.length >= 4);
  assert(repeatedBoilerplate.length === 0,
    "Repeated generic " + field + " statements: " +
    repeatedBoilerplate.map(([statement, days]) => days.join(",") + " → " + statement).join(" | "));
}
assert(course.weeks[3][0] === "Ранние общества Азии, Африки и Америк", "Unexpected module 4 title");
assert(course.lessons[0][6].depth.people.some(p => p.name === "Фукидид"), "Thucydides example missing from first lesson");
const researchStats = window.HISTORY_RESEARCH_CONTENT_STATS;
assert(researchStats && researchStats.version === 2 && researchStats.lessons === 7, "Expected seven researched content packs");
const eventStats = window.HISTORY_EVENT_DEPTH_STATS;
assert(eventStats && eventStats.version === 1 && eventStats.lessons === 23,
  "Expected 23 source-backed event-depth supplements");
for (const day of eventStats.days) {
  const row = course.lessons[day - 1], meta = row && row[6], d = meta && meta.depth;
  assert(meta && meta.eventDepthVersion === 1, "Missing event-depth supplement on day " + day);
  assert(meta.detailedText && meta.detailedText.length >= 850, "Event lesson lacks expanded context on day " + day);
  assert(d.causes.length >= 2 && d.development.length >= 2 && d.consequences.length >= 2,
    "Event lesson needs multiple concrete causes, developments, and consequences on day " + day);
  assert(meta.researchSources.length >= 2 && meta.researchSources.every(s => /^https:\/\//.test(s.url) && s.title && s.desc),
    "Event lesson lacks source links on day " + day);
  for (const field of ["causes", "development", "consequences"]) {
    for (const item of d[field]) assert(item.length >= 45 && item.length <= 420,
      "Suspicious short/long event evidence in " + field + " on day " + day);
  }
}
for (const day of researchStats.days) {
  const meta = course.lessons[day - 1][6];
  assert(meta.detailedText && meta.detailedText.length >= 700, "Expanded research text too short on day " + day);
  assert(meta.depthVersion === 2 && meta.depth.chronology.length >= 3, "Missing curated chronology on day " + day);
  assert(meta.researchSources && meta.researchSources.length >= 2, "Missing curated sources on day " + day);
  assert(meta.researchSources.every(source => /^https:\/\//.test(source.url) && source.title && source.desc), "Invalid source card on day " + day);
}
const participantStats = window.HISTORY_PARTICIPANT_STATS;
assert(participantStats && participantStats.lessons >= 25 && participantStats.addedPeople >= 40, "Curated participant data missing");
const participantSourceStats = window.HISTORY_PARTICIPANT_SOURCE_STATS;
assert(participantSourceStats && participantSourceStats.people >= 100, "Participant source layer missing or incomplete");
assert(participantSourceStats.withDirectSource >= 10, "Expected individually curated person references");
assert(participantSourceStats.withSearch + participantSourceStats.withDirectSource === participantSourceStats.people, "Some participant cards lack a source pathway");
for (const row of course.lessons) {
  for (const person of (row[6].depth.people || [])) {
    assert(person.sourceSearch && /^https:\/\//.test(person.sourceSearch.url), "Missing transparent source-search link for " + person.name);
    assert(Array.isArray(person.sources), "Missing direct-source field for " + person.name);
    assert(person.sources.every(source => /^https:\/\//.test(source.url) && source.title && source.note), "Invalid direct reference for " + person.name);
  }
}
assert(course.lessons.some(row => row[6].depth.people.some(person => person.sources.some(source => /louvre\.fr/.test(source.url)))), "Louvre reference missing from participant layer");
assert(course.lessons.some(row => row[6].depth.people.some(person => person.sources.some(source => /archives\.gov/.test(source.url)))), "National Archives reference missing from participant layer");
const glossary = window.HISTORY_GLOSSARY;
assert(glossary && glossary.entries.length >= 200 && glossary.stats.clickableTerms >= 100, "Glossary index is unexpectedly incomplete");
assert(glossary.find("Первичный источник") && glossary.find("Фукидид") && glossary.find("Деколонизация"), "Core glossary lookups failed");
const avgTerms = depths.reduce((sum, d) => sum + d.terms.length, 0) / depths.length;
const peopleCoverage = depths.filter(d => d.people.length > 0).length;
const groupsCoverage = depths.filter(d => d.groups.length > 0).length;
console.log("Course data OK: 26 modules, 182 readings, 182 chronology/causality/source frameworks, " + participantStats.lessons + " curated participant lessons, " + participantStats.addedPeople + " added people entries, " + participantSourceStats.withDirectSource + " with individually curated references / " + participantSourceStats.people + " with source pathways, and " + glossary.entries.length + " glossary entries. Actor coverage: " + peopleCoverage + "/182; social-group coverage: " + groupsCoverage + "/182. Average terms per lesson: " + avgTerms.toFixed(1) + ".");
