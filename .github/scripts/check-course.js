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
assert(course.weeks[3][0] === "Ранние общества Азии, Африки и Америк", "Unexpected module 4 title");
assert(course.lessons[0][6].depth.people.some(p => p.name === "Фукидид"), "Thucydides example missing from first lesson");
const researchStats = window.HISTORY_RESEARCH_CONTENT_STATS;
assert(researchStats && researchStats.version === 2 && researchStats.lessons === 7, "Expected seven researched content packs");
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
