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
        out.push((prefix||"") + sentence);
      });
    });
    return out;
  }
  function assembleContext(row,meta){
    var depth=meta.depth||{},seen=new Set(),base=String(meta.detailedText||""),title=String(row[0]||"это занятие");
    base.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«„0-9])/u).forEach(function(sentence){var k=key(sentence);if(k.length>=45)seen.add(k)});
    var blocks=[];
    var dates=uniqueSentences(depth.chronology,seen,4,"В хронологии темы «"+title+"» важно отметить: ");
    if(dates.length)blocks.push(dates.join(" "));
    var causes=uniqueSentences(depth.causes,seen,3,"Для объяснения темы «"+title+"» существенная предпосылка такова: ");
    if(causes.length)blocks.push(causes.join(" "));
    var development=uniqueSentences(depth.development,seen,3,"В ходе темы «"+title+"» развитие событий описывает следующий шаг: ");
    if(development.length)blocks.push(development.join(" "));
    var effects=uniqueSentences(depth.consequences,seen,3,"Одно из последствий, важных для темы «"+title+"»: ");
    if(effects.length)blocks.push(effects.join(" "));
    var facts=uniqueSentences(row[4]||[],seen,3,"Для проверки вывода по теме «"+title+"» полезен факт: ");
    if(facts.length)blocks.push(facts.join(" "));
    var actors=(depth.people||[]).slice(0,4).map(function(person){
      var parts=[String(person.name||""),String(person.role||""),String(person.why||"")].filter(Boolean);
      return "В контексте занятия «"+title+"» "+parts[0]+": "+parts.slice(1).join(" Значение для этой темы: ").replace(/[.!?]+\s*/g,"; ").replace(/[;,\s]+$/,"")+".";
    }).filter(Boolean);
    actors=uniqueSentences(actors,seen,4,"");
    if(actors.length)blocks.push(actors.join(" "));
    var groups=(depth.groups||[]).map(function(group){
      return "Для темы «"+title+"» группа «"+String(group.name||"")+"» важна так: "+
        String(group.description||"").replace(/[.!?]+\s*/g,"; ").replace(/[;,\s]+$/,"")+".";
    });
    groups=uniqueSentences(groups,seen,2,"");
    if(groups.length)blocks.push(groups.join(" "));
    var terms=(depth.terms||[]).filter(function(term){return Array.isArray(term)&&term[0]&&term[1]})
      .slice(0,4).map(function(term){
        return "Для понимания занятия «"+title+"» термин «"+String(term[0])+"» означает: "+
          String(term[1]).replace(/[.!?]+\s*/g,"; ").replace(/[;,\s]+$/,"")+".";
      });
    terms=uniqueSentences(terms,seen,4,"");
    if(terms.length)blocks.push(terms.join(" "));
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