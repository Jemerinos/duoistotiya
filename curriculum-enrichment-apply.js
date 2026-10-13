/* Append a curated, lesson-specific historical detail paragraph to each of 182 lesson readings. */
(function(){
  "use strict";
  var course=window.HISTORY_CURRICULUM,extra=window.HISTORY_LESSON_DEEPENING||{};
  if(!course||!Array.isArray(course.lessons)||course.lessons.length!==182)throw new Error("Historical enrichment expects exactly 182 lessons");
  var missing=[],stats={lessons:0,wordsBefore:0,wordsAfter:0};
  course.lessons.forEach(function(row,index){
    var day=index+1,meta=row[6]||(row[6]={}),addition=extra[day];
    if(typeof addition!=="string"||addition.trim().length<180){missing.push(day);return}
    var base=String(meta.detailedText||"").trim();
    if(base.indexOf(addition.trim())>=0)return;
    if(!base)missing.push(day);
    var combined=base+"\n\n"+addition.trim();
    meta.detailedText=combined;
    meta.detailedTextVersion=2;
    meta.enrichmentVersion=1;
    stats.lessons++;
    stats.wordsBefore+=base.split(/\s+/).filter(Boolean).length;
    stats.wordsAfter+=combined.split(/\s+/).filter(Boolean).length;
  });
  if(missing.length)throw new Error("Expanded historic detail missing for lesson(s): "+missing.join(", "));
  window.HISTORY_ENRICHMENT_STATS={lessons:stats.lessons,version:1,averageWordsBefore:Math.round(stats.wordsBefore/182),averageWordsAfter:Math.round(stats.wordsAfter/182)};
})();