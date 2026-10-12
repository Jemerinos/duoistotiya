"use strict";
global.window = {};
require("../../curriculum.js");
require("../../curriculum-depth.js");
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
  assert(Array.isArray(d.checkPoints) && d.checkPoints.length >= 3, "Missing retrieval goals on lesson " + day);
  depths.push(d);
}
assert(course.weeks[3][0] === "Ранние общества Азии, Африки и Америк", "Unexpected module 4 title");
assert(course.lessons[0][6].depth.people.some(p => p.name === "Фукидид"), "Thucydides example missing from first lesson");
const avgTerms = depths.reduce((sum, d) => sum + d.terms.length, 0) / depths.length;
console.log("Course data OK: 26 modules, 182 lessons, complete depth layer. Average terms per lesson: " + avgTerms.toFixed(1) + ".");
