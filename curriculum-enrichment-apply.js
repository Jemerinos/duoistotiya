/* Append a curated, lesson-specific historical detail paragraph to each of 182 lesson readings. */
(function(){
  "use strict";
  var course=window.HISTORY_CURRICULUM,extra=window.HISTORY_LESSON_DEEPENING||{};
  if(!course||!Array.isArray(course.lessons)||course.lessons.length!==182)throw new Error("Historical enrichment expects exactly 182 lessons");
  var missing=[],stats={lessons:0,wordsBefore:0,wordsAfter:0};
  function key(value){
    return String(value||"").toLocaleLowerCase("ru").replace(/ё/g,"е")
      .replace(/[«»„“”"']/g,"").replace(/[^а-яa-z0-9\s]/gi," ").replace(/\s+/g," ").trim();
  }
  function uniqueSentences(values, seen, max, prefix){
    var out=[];
    (values||[]).forEach(function(value){
      if(out.length>=max||typeof value!=="string")return;
      value.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«„0-9])/u).forEach(function(sentence){
        if(out.length>=max)return;
        sentence=sentence.trim();var k=key(sentence);
        if(sentence.length<48||k.length<45||seen.has(k))return;
        seen.add(k);
        // The contextual prefix keeps common evidence labels from becoming identical
        // sentences across dozens of different lessons.
        // Add a concise label once per block, never once per sentence.
      out.push((out.length===0?(prefix||""):"") + sentence);
      });
    });
    return out;
  }
  function assembleContext(row,meta){
    var depth=meta.depth||{},seen=new Set(),base=String(meta.detailedText||"");
    base.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«„0-9])/u).forEach(function(sentence){var k=key(sentence);if(k.length>=45)seen.add(k)});
    var blocks=[];
    var dates=uniqueSentences(depth.chronology,seen,6,"Хронология: ");
    if(dates.length)blocks.push(dates.join(" "));
    var causes=uniqueSentences(depth.causes,seen,4,"Причины: ");
    if(causes.length)blocks.push(causes.join(" "));
    var development=uniqueSentences(depth.development,seen,4,"Развитие событий: ");
    if(development.length)blocks.push(development.join(" "));
    var effects=uniqueSentences(depth.consequences,seen,4,"Последствия: ");
    if(effects.length)blocks.push(effects.join(" "));
    var facts=uniqueSentences(row[4]||[],seen,3,"Факт: ");
    if(facts.length)blocks.push(facts.join(" "));
    function words(text){return String(text||"").trim().split(/\s+/).filter(Boolean).length;}
    function clause(value){return String(value||"").replace(/\s+/g," ").replace(/[.!?]+/g,";").replace(/[;,]+\s*$/,"").trim();}
    function appendIfShort(values,max,prefix){
      if(words(base+" "+blocks.join(" "))>=200)return;
      var candidates=uniqueSentences(values,seen,max,prefix),picked=[],projected=words(base+" "+blocks.join(" "));
      for(var i=0;i<candidates.length&&projected<200;i++){
        picked.push(candidates[i]);projected+=words(candidates[i]);
      }
      if(picked.length)blocks.push(picked.join(" "));
    }
    // Most concepts already appear in the base reading or a dedicated card.
    // Only add people/groups/terms when the core narrative plus concrete evidence is too short.
    var people=(depth.people||[]).slice(0,4).map(function(person){
      var name=clause(person.name),role=clause(person.role),why=clause(person.why);
      return name && role ? name+" — "+role+(why?"; значение: "+why:"")+"." : "";
    }).filter(Boolean);
    appendIfShort(people,4,"Персоналии: ");
    var groups=(depth.groups||[]).map(function(group){
      var name=clause(group.name),description=clause(group.description);
      return name && description ? name+" — "+description+"." : "";
    }).filter(Boolean);
    appendIfShort(groups,3,"Группы: ");
    var terms=(depth.terms||[]).filter(function(term){return Array.isArray(term)&&term[0]&&term[1]})
      .slice(0,5).map(function(term){
        return clause(term[0])+" — "+clause(term[1])+".";
      });
    appendIfShort(terms,5,"Термины: ");
    return blocks.join("\n\n");
  }
  course.lessons.forEach(function(row,index){
    var day=index+1,meta=row[6]||(row[6]={}),addition=extra[day];
    if(typeof addition!=="string"||addition.trim().length<180){missing.push(day);return}
    var base=String(meta.detailedText||"").trim();
    if(!base)missing.push(day);
    if(base.indexOf(addition.trim())<0)base=base+"\n\n"+addition.trim();
    meta.detailedText=base;
    meta.detailedTextVersion=Math.max(meta.detailedTextVersion||1,2);
    meta.enrichmentVersion=1;
    if(meta.narrativeAssemblyVersion!==1){
      // Keep the authored reading separate for exact-duplicate checks; contextual supplements
      // may deliberately repeat a core term or a person's background across related lessons.
      meta.narrativeBaseText=String(meta.detailedText).trim();
      var contextual=assembleContext(row,meta);
      if(contextual){
        meta.detailedText=String(meta.detailedText).trim()+"\n\n"+contextual;
        meta.detailedTextVersion=Math.max(meta.detailedTextVersion||1,3);
        meta.narrativeAssemblyVersion=1;
      } else {
        missing.push(day);
      }
    }
    stats.lessons++;
    stats.wordsBefore+=base.split(/\s+/).filter(Boolean).length;
    stats.wordsAfter+=String(meta.detailedText).split(/\s+/).filter(Boolean).length;
  });
  if(missing.length)throw new Error("Expanded historic detail missing for lesson(s): "+missing.join(", "));
  window.HISTORY_ENRICHMENT_STATS={lessons:stats.lessons,version:1,averageWordsBefore:Math.round(stats.wordsBefore/182),averageWordsAfter:Math.round(stats.wordsAfter/182)};
})();