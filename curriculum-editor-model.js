/* Stable named-field contract for the reading-first site.
   Existing curriculum layers remain the editorial source of truth during migration.
   This adapter lets rendering code depend on one predictable lesson object. */
(function () {
  "use strict";
  var course = window.HISTORY_CURRICULUM;
  if (!course || !Array.isArray(course.weeks) || !Array.isArray(course.lessons)) {
    throw new Error("curriculum-editor-model.js must load after the course data layers");
  }
  var weeks = course.weeks;
  var rows = course.lessons;
  if (weeks.length !== 26 || rows.length !== 182) {
    throw new Error("The editor model requires 26 weeks and 182 lessons");
  }
  function normalize(row, index) {
    var weekIndex = Math.floor(index / 7);
    var week = weeks[weekIndex];
    var meta = row[6] || {};
    var depth = meta.depth || {};
    if (!row[0] || !row[1] || !row[2] || !row[3] || !Array.isArray(row[4]) || row[4].length !== 3) {
      throw new Error("Cannot normalize incomplete lesson data at day " + (index + 1));
    }
    var lesson = {
      id: "lesson-" + String(index + 1).padStart(3, "0"),
      day: index + 1,
      week: weekIndex + 1,
      weekTitle: week[0],
      title: row[0],
      period: row[1],
      question: row[2],
      summary: row[3],
      facts: row[4],
      wiki: row[5],
      reading: meta,
      imageQuery: meta.imageQuery || meta.imageSearch || row[0],
      examPrompt: meta.examPrompt || "Сформулируйте тезис, приведите точное доказательство и объясните, как оно поддерживает вывод.",
      examRubric: meta.rubric || "Убедительный ответ содержит тезис, конкретный факт или источник, объяснение связи и оговорку об ограничениях.",
      source: meta.source || week[4],
      researchSources: meta.researchSources || [],
      terms: meta.terms || week[3],
      skill: meta.skill || week[2],
      example: meta.example || week[6],
      overview: meta.weekOverview || week[5],
      harariLens: meta.harariLens || "",
      depth: depth,
      detailedText: meta.detailedText || "",
      /* Grouped authoring fields form the first step toward a single editor-friendly schema. */
      learning: {
        objective: row[2],
        overview: row[3],
        facts: row[4],
        detailedText: meta.detailedText || "",
        terms: depth.terms || meta.terms || week[3],
        chronology: depth.chronology || [],
        causes: depth.causes || [],
        development: depth.development || [],
        consequences: depth.consequences || []
      },
      assessment: {
        examPrompt: meta.examPrompt || "",
        rubric: meta.rubric || "",
        knowledgeCheckFacts: row[4]
      },
      media: {
        query: meta.imageQuery || meta.imageSearch || row[0]
      }
    };
    return lesson;
  }
  var model = {
    version: 1,
    weeks: weeks,
    lessons: rows.map(normalize)
  };
  if (model.lessons.some(function (lesson, index) {
    return lesson.day !== index + 1 || lesson.week !== Math.floor(index / 7) + 1 ||
      lesson.title !== rows[index][0] || !lesson.depth || !lesson.detailedText;
  })) {
    throw new Error("Normalized lesson model failed consistency checks");
  }
  window.HISTORY_LESSON_MODEL = model;
})();