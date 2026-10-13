/* Integrate available historical detail into the primary reading.
   Optional supplements cover only some lessons; every lesson gets a coherent, tested narrative. */
(function () {
  "use strict";
  var course = window.HISTORY_CURRICULUM, supplements = window.HISTORY_LESSON_DEEPENING || {};
  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 182) {
    throw new Error("Narrative assembly requires the complete 182-lesson course");
  }
  function sentences(value) {
    return String(value || "").replace(/\s+/g, " ").trim()
      .split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«„0-9])/u).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function key(value) {
    return String(value || "").toLocaleLowerCase("ru").replace(/ё/g, "е").replace(/[«»„“”"]/g, "")
      .replace(/[^а-яa-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
  }
  function textOf(value) {
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) return String(value[0] || "") + (value[1] ? " — " + String(value[1]) : "");
    return "";
  }
  function unique(values, max) {
    var out = [], seen = new Set();
    (values || []).forEach(function (value) {
      var text = textOf(value), normalized = key(text);
      if (!text || !normalized || seen.has(normalized)) return;
      seen.add(normalized);
      out.push(text);
    });
    return out.slice(0, max || out.length);
  }
  function build(row, index) {
    var day = index + 1, meta = row[6] || (row[6] = {}), d = meta.depth || {};
    var base = String(meta.detailedText || row[3] || "").trim();
    if (base.length < 220) throw new Error("Missing core reading for lesson " + day);
    var blocks = [base], supplement = String(supplements[day] || "").trim();
    if (supplement.length >= 180 && base.indexOf(supplement) < 0) blocks.push(supplement);

    var causes = unique(d.causes || [], 4);
    if (causes.length < 2 && d.cause && d.cause.text) causes = unique(causes.concat([d.cause.text]), 4);
    if (causes.length) blocks.push("Причины и предпосылки. " + causes.join(" "));

    var sequence = unique((d.chronology || []).concat(d.development || []), 7);
    if (sequence.length) blocks.push("Как развивались события. " + sequence.join(" "));
    else if (d.mechanism && d.mechanism.text) blocks.push("Как действовали участники. " + d.mechanism.text);

    var people = (d.people || []).filter(function (p) { return p && p.name && (p.role || p.why); }).slice(0, 4);
    if (people.length) {
      blocks.push("Люди и их решения. " + people.map(function (p) {
        return p.name + (p.role ? " — " + p.role : "") + (p.why ? " Это важно, потому что " + p.why : "");
      }).join(" "));
    } else {
      var groups = (d.groups || []).filter(function (g) { return g && g.name && g.description; }).slice(0, 4);
      if (groups.length) blocks.push("Какие группы участвовали. " + groups.map(function (g) { return g.name + ": " + g.description; }).join(" "));
    }

    var terms = unique(d.terms || [], 4).filter(function (t) { return t.indexOf(" — ") > 0; }).slice(0, 3);
    if (terms.length) blocks.push("Ключевые понятия. " + terms.join(" "));

    var consequences = unique(d.consequences || [], 4);
    if (consequences.length < 2 && d.effect && d.effect.text) consequences = unique(consequences.concat([d.effect.text]), 4);
    if (consequences.length) blocks.push("Последствия и значение. " + consequences.join(" "));

    var facts = unique(row[4] || [], 3);
    if (facts.length) blocks.push("Проверьте рассказ на конкретных примерах. " + facts.join(" "));
    if (d.methodNote && String(d.methodNote).trim().length >= 70) blocks.push(String(d.methodNote).trim());
    return { day: day, meta: meta, base: base, blocks: blocks };
  }

  var plans = course.lessons.map(build), counts = new Map();
  plans.forEach(function (plan) {
    plan.blocks.slice(1).forEach(function (block) {
      sentences(block).forEach(function (sentence) {
        var k = key(sentence);
        if (k.length < 65) return;
        if (!counts.has(k)) counts.set(k, new Set());
        counts.get(k).add(plan.day);
      });
    });
  });

  var minChars = Infinity, minDay = 0, totalChars = 0, totalWords = 0;
  plans.forEach(function (plan) {
    var paragraphs = plan.base.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    var seen = new Set();
    paragraphs.forEach(function (p) { sentences(p).forEach(function (s) { seen.add(key(s)); }); });
    var assembled = paragraphs.slice();
    plan.blocks.slice(1).forEach(function (block) {
      var keep = sentences(block).filter(function (sentence) {
        var k = key(sentence);
        if (!k || seen.has(k)) return false;
        var days = counts.get(k);
        if (k.length >= 65 && days && days.size >= 3) return false;
        seen.add(k);
        return true;
      });
      if (keep.length) assembled.push(keep.join(" "));
    });
    var reading = assembled.join("\n\n").trim();
    if (reading.length < 1000) {
      var d = plan.meta.depth || {};
      var spare = [d.cause && d.cause.text, d.mechanism && d.mechanism.text, d.effect && d.effect.text].filter(Boolean).join(" ");
      var extra = sentences(spare).filter(function (s) { var k = key(s); if (!k || seen.has(k)) return false; seen.add(k); return true; });
      if (extra.length) reading += "\n\n" + extra.join(" ");
    }
    if (reading.length < 1000) throw new Error("Lesson " + plan.day + " remains too short after assembly: " + reading.length + " characters");
    plan.meta.detailedText = reading;
    plan.meta.expandedNarrativeVersion = 2;
    plan.meta.narrativeCharCount = reading.length;
    plan.meta.narrativeParagraphs = reading.split(/\n\s*\n/).filter(Boolean).length;
    plan.meta.narrativeSupplementApplied = !!(supplements[plan.day] && String(supplements[plan.day]).trim().length >= 180);
    plan.meta.depth = plan.meta.depth || {};
    plan.meta.depth.narrativeIntegrated = true;
    totalChars += reading.length;
    totalWords += reading.split(/\s+/).filter(Boolean).length;
    if (reading.length < minChars) { minChars = reading.length; minDay = plan.day; }
  });
  window.HISTORY_NARRATIVE_STATS = {
    version: 2, lessons: plans.length, enrichedLessons: plans.length,
    targetedSupplementLessons: Object.keys(supplements).filter(function (day) { return String(supplements[day] || "").trim().length >= 180; }).length,
    minCharacters: minChars, minCharacterDay: minDay,
    averageCharacters: Math.round(totalChars / plans.length), averageWords: Math.round(totalWords / plans.length)
  };
})();