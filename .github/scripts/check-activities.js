"use strict";
global.window = {};
require("../../curriculum.js");
require("../../curriculum-depth.js");
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const course = window.HISTORY_CURRICULUM;
const L = course.lessons.map((r, i) => ({
  day:i+1, week:Math.floor(i/7)+1, title:r[0], period:r[1], question:r[2],
  summary:r[3], facts:r[4], wiki:r[5], ...(r[6] || {})
}));
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const unique = xs => new Set(xs).size === xs.length;
const between = (name, next) => {
  const start = html.indexOf("function " + name + "(");
  const end = html.indexOf("\nfunction " + next + "(", start);
  assert(start >= 0 && end > start, "Cannot isolate " + name);
  return html.slice(start, end).trim();
};
const rotateChoices = (list, shift) => list.slice(shift % list.length).concat(list.slice(0, shift % list.length));
const quickQuizSet = new Function("L", "rotateChoices", "return (" + between("quickQuizSet", "renderQuiz") + ")")(L, rotateChoices);
const examQuestionSet = new Function("L", "rotateChoices", "return (" + between("examQuestionSet", "renderExamPractice") + ")")(L, rotateChoices);
const imageTaskConfig = new Function("state", "rotateChoices", "return (" + between("imageTaskConfig", "renderImageTask") + ")")({
  imageChoicesDay: 1,
  imageChoices: [
    {title:"A",src:"https://example.test/a.jpg",href:"https://example.test/a",correct:true},
    {title:"B",src:"https://example.test/b.jpg",href:"https://example.test/b",correct:false},
    {title:"C",src:"https://example.test/c.jpg",href:"https://example.test/c",correct:false}
  ]
}, rotateChoices);
let generated = 0;
for (const lesson of L) {
  const quiz = quickQuizSet(lesson);
  assert(quiz.length === 5, "Expected 5 knowledge questions on day " + lesson.day);
  for (const [i, q] of quiz.entries()) {
    assert(q.options.length === 3 && unique(q.options), "Duplicate/missing options at day " + lesson.day + ", q" + (i+1));
    assert(q.correct >= 0 && q.options[q.correct] === q.fact, "Bad correct answer key at day " + lesson.day + ", q" + (i+1));
    assert(q.why, "Missing explanation at day " + lesson.day + ", q" + (i+1));
    generated++;
  }
  const chronology = lesson.depth && Array.isArray(lesson.depth.chronology) ? lesson.depth.chronology : [];
  const normalizedShort = value => {
    let text = String(value || "").split(/(?<=[.!?])\\s+/).slice(0, 2).join(" ");
    if (text.length > 200) text = text.slice(0, 197).replace(/\\s+\\S*$/, "") + "…";
    return text;
  };
  assert(quiz[4].title.includes(lesson.title),
    "The fifth question must be specific to day " + lesson.day + " (" + lesson.title + ")");
  assert(quiz[4].why.includes(lesson.title),
    "The fifth question explanation must refer to day " + lesson.day);
  assert(chronology.some(item => normalizedShort(item) === quiz[4].fact),
    "The fifth question must use lesson-specific chronology on day " + lesson.day);
  assert(![lesson.summary, ...lesson.facts].some(item => normalizedShort(item) === quiz[4].fact),
    "The fifth question must add a different learning point on day " + lesson.day);
  const exam = examQuestionSet(lesson);
  assert(exam.length === 3, "Expected 3 optional practice questions on day " + lesson.day);
  for (const [i, q] of exam.entries()) {
    assert(q.options.length === 3 && unique(q.options.map(x => x.text)), "Bad optional exam options at day " + lesson.day + ", q" + (i+1));
    assert(q.options.filter(x => x.correct).length === 1, "Expected one correct exam option at day " + lesson.day + ", q" + (i+1));
  }
}
for (const step of [0, 1, 2]) {
  const q = imageTaskConfig(L[0], step);
  assert(q.options.length === 3, "Image task " + (step + 1) + " must provide three options");
  assert(q.options.filter(x => x.correct).length === 1, "Image task " + (step + 1) + " must have one correct option");
}
console.log("Interactions OK: " + generated + " knowledge-check items across 182 lessons; optional exam and image-choice tasks validated.");
