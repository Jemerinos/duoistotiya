/* Combine the four independently editable reading packs with the base curriculum. */
(function(){
  "use strict";
  var course=window.HISTORY_CURRICULUM,details=window.HISTORY_LESSON_DETAILS||{};
  if(!course||!Array.isArray(course.lessons))throw new Error("Expanded lesson text requires curriculum.js");
  var missing=[];
  course.lessons.forEach(function(row,i){
    var meta=row[6]||(row[6]={}),text=details[i+1];
    if(typeof text!=="string"||text.trim().length<220){missing.push(i+1);return}
    meta.detailedText=text.trim();
    meta.detailedTextVersion=1;
  });
  if(missing.length)throw new Error("Expanded reading missing for lesson(s): "+missing.join(", "));
  window.HISTORY_DETAIL_STATS={lessons:course.lessons.length,version:1};
})();