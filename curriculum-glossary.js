/* Searchable course glossary, assembled from the same lesson data used by the reader.
   It can be loaded in the browser or required by the course tests without a DOM. */
(function () {
  "use strict";
  var course = window.HISTORY_CURRICULUM;
  if (!course || !Array.isArray(course.lessons)) throw new Error("Glossary requires HISTORY_CURRICULUM");
  var byKey = Object.create(null);
  var all = [];
  function norm(value) { return String(value || "").toLocaleLowerCase("ru").replace(/[ё]/g, "е").replace(/\s+/g, " ").trim(); }
  function add(word, definition, day, kind, category) {
    word = String(word || "").trim();
    definition = String(definition || "").trim();
    if (!word || !definition) return;
    var key = norm(word);
    if (!key) return;
    var entry = byKey[key];
    if (!entry) {
      entry = byKey[key] = { term: word, definition: definition, kind: kind || "term", category: category || "Термин курса", lessons: [] };
      all.push(entry);
    } else if (definition.length > entry.definition.length && definition.length < 650) {
      entry.definition = definition;
    }
    if (day && !entry.lessons.some(function (item) { return item.day === day; })) {
      var row = course.lessons[day - 1];
      if (row) entry.lessons.push({ day: day, title: row[0] });
    }
  }

  var manual = [
    ["Первичный источник","Свидетельство, созданное в изучаемую эпоху или участником события: письмо, закон, монета, фотография, предмет быта. Он помогает увидеть конкретную перспективу, но не гарантирует объективности."],
    ["Вторичный источник","Позднейшее исследование, которое сопоставляет и интерпретирует другие свидетельства. Его оценивают по качеству аргументации, источников и научного контекста."],
    ["Периодизация","Разделение прошлого на периоды ради объяснения определённого процесса. Границы эпох условны и могут различаться для разных регионов."],
    ["Археологический контекст","Место, слой и связи, в которых обнаружена находка. Без контекста предмет часто труднее точно датировать и истолковать."],
    ["Неолитическая революция","Условное название длительного перехода ряда обществ к выращиванию растений, управлению стадами и более оседлому образу жизни. Это не было одним событием и происходило неодновременно."],
    ["Феодализм","Обобщающий термин для ряда средневековых систем, в которых земля, служба и власть связывали правителей, знать и зависимое население. Историки спорят о границах применения этого понятия."],
    ["Колониализм","Установление и поддержание внешнего господства над территорией и её населением, часто с контролем земли, труда и ресурсов."],
    ["Империализм","Расширение политического, военного или экономического влияния над другими территориями и обществами. Мотивы и способы имперской экспансии различались."],
    ["Индустриализация","Рост промышленного производства и изменение экономики, труда, транспорта и жизни городов; темпы и последствия отличались по регионам."],
    ["Индустриальная революция","Переход к механизированному фабричному производству и новым энергетическим системам, начавшийся в Великобритании в XVIII веке и позднее распространившийся в другие регионы."],
    ["Реформация","Религиозные движения XVI века, изменившие западное христианство, церковную политику и отношения между религией и государством."],
    ["Ренессанс","Совокупность культурных и интеллектуальных движений, особенно заметных в Европе XIV–XVI веков, связанных в том числе с переосмыслением античного наследия."],
    ["Просвещение","Разнородные интеллектуальные движения XVII–XVIII веков, подчёркивавшие силу рассуждения, исследования и обсуждения общественных институтов; мыслители не были едины во взглядах."],
    ["Меркантилизм","Семейство экономических политик раннего Нового времени, при которых государства стремились укреплять ресурсы и торговые позиции, часто через регулирование торговли и колониальные связи."],
    ["Капитализм","Экономическая система, в которой значительную роль играют частная собственность, рынки и вложение капитала в производство. Исторические формы капитализма менялись."],
    ["Национализм","Идеи, согласно которым нация имеет особое значение для политической принадлежности и государства. Национализм мог поддерживать независимость, объединение или исключение меньшинств."],
    ["Абсолютизм","Модель монархии, стремившейся сосредоточить власть в руках правителя. Реальная власть монархов всегда зависела от институтов, элит, финансов и местных условий."],
    ["Суверенитет","Притязание государства или политического сообщества на верховную власть внутри территории и самостоятельность во внешних отношениях; на практике эти возможности ограничивались."],
    ["Бюрократия","Система управления через должности, правила, документы и специализированных чиновников."],
    ["Коллективизация","Принудительное объединение крестьянских хозяйств в коллективные структуры в СССР, особенно в конце 1920-х — 1930-е годы; сопровождалась сопротивлением, репрессиями и голодом."],
    ["Тотальная война","Война, при которой государство мобилизует значительную часть экономики и общества, а граница между фронтом и тылом становится менее чёткой."],
    ["Холокост","Систематическое преследование и убийство нацистской Германией и её пособниками примерно шести миллионов европейских евреев; нацистский режим также преследовал и убивал другие группы."],
    ["Геноцид","Действия, совершаемые с намерением уничтожить полностью или частично национальную, этническую, расовую или религиозную группу; юридическая квалификация требует анализа конкретных фактов и намерения."],
    ["Деколонизация","Процессы прекращения колониального господства и появления независимых государств. Они включали переговоры, массовую политику и вооружённые конфликты."],
    ["Холодная война","Глобальное соперничество США и СССР и их союзников после Второй мировой войны; оно включало идеологию, гонку вооружений, союзы, прокси-войны и конкуренцию за влияние."],
    ["Глобализация","Усиление связей между регионами через торговлю, миграции, финансы, технологии, политику и культурный обмен; связи создают и возможности, и уязвимости."],
    ["Революция","Быстрое и глубокое изменение политических институтов или общественных отношений; причины, масштабы и исход революций необходимо объяснять в конкретном контексте."],
    ["Республика","Политическая форма, в которой верховная власть не оформлена как наследственная монархия. Исторические республики могли ограничивать участие значительной части населения."],
    ["Демократия","Способ организации политической власти, при котором граждане участвуют в принятии решений напрямую или через представителей. Историческое гражданство часто было ограниченным."],
    ["Город-государство","Политическое сообщество с городским центром и окружающей территорией, собственными институтами и внешними отношениями."],
    ["Декларация независимости","Документ, которым политическое сообщество публично заявляет о прекращении подчинения другой власти и обосновывает свой новый статус."],
    ["Пропаганда","Систематическая коммуникация, стремящаяся повлиять на убеждения и действия аудитории. Она может использовать правдивые детали, выбирая их и исключая неудобный контекст."],
    ["Историография","Совокупность исторических исследований и интерпретаций определённой темы, а также изучение того, как эти интерпретации менялись."],
    ["Причинность","Анализ связей между условиями, мотивами, решениями, механизмами и результатами. События обычно имеют несколько причин, а не одну."],
    ["Корроборация","Сопоставление независимых свидетельств для проверки утверждения. Несколько текстов, скопированных из одного источника, не являются независимыми подтверждениями."]
  ];
  manual.forEach(function (item) { add(item[0], item[1], 0, "term", "Базовое понятие"); });

  course.weeks.forEach(function (week, wi) {
    (week[3] || []).forEach(function (item) { if (Array.isArray(item)) add(item[0], item[1], 0, "term", "Термин курса"); });
  });
  course.lessons.forEach(function (row, i) {
    var day = i + 1, meta = row[6] || {}, depth = meta.depth || {};
    (meta.terms || []).forEach(function (item) { if (Array.isArray(item)) add(item[0], item[1], day, "term", "Термин курса"); });
    (depth.terms || []).forEach(function (item) { if (Array.isArray(item)) add(item[0], item[1], day, "term", "Термин урока"); });
    (depth.people || []).forEach(function (person) {
      add(person.name, [person.role, person.why].filter(Boolean).join(" "), day, "person", "Историческая персоналия");
    });
  });
  all.forEach(function (entry) { entry.lessons.sort(function (a, b) { return a.day - b.day; }); });
  all.sort(function (a, b) { return a.term.localeCompare(b.term, "ru", { sensitivity: "base" }); });

  function find(term) { return byKey[norm(term)] || all.find(function (entry) { return norm(entry.term) === norm(term); }) || null; }
  var clickable = all.filter(function (entry) {
    if (entry.kind === "person") return entry.term.length >= 7;
    var key = norm(entry.term);
    if (["история","контекст","город","город-государство?","государство","общество","процесс","событие","власть","изменение","источник","империя","республика","археология"].indexOf(key) >= 0) return false;
    return entry.term.indexOf(" ") >= 0 || entry.term.length >= 8;
  }).sort(function (a, b) { return b.term.length - a.term.length; });
  var clickableByKey = Object.create(null);
  clickable.forEach(function (entry) { clickableByKey[norm(entry.term)] = entry; });
  var pattern = clickable.map(function (entry) { return entry.term.replace(/[.*+?^$()|[\]\\]/g, "\\$&"); }).join("|");
  var termRegex = pattern ? new RegExp("(^|[^\\p{L}\\p{N}])(" + pattern + ")(?=$|[^\\p{L}\\p{N}])", "giu") : null;
  var modal = null, previousFocus = null, selectedKey = null;

  function setDefinition(entry) {
    if (!entry) return;
    selectedKey = norm(entry.term);
    var type = document.getElementById("glossaryType");
    var title = document.getElementById("glossaryTermHeading");
    var description = document.getElementById("glossaryDefinitionText");
    var related = document.getElementById("glossaryRelated");
    if (type) type.textContent = entry.category || (entry.kind === "person" ? "Историческая персоналия" : "Термин курса");
    if (title) title.textContent = entry.term;
    if (description) description.textContent = entry.definition;
    if (related) {
      related.textContent = "";
      entry.lessons.slice(0, 6).forEach(function (lesson) {
        var button = document.createElement("button");
        button.type = "button";
        button.dataset.glossaryDay = String(lesson.day);
        button.textContent = "День " + lesson.day + " · " + lesson.title;
        related.appendChild(button);
      });
    }
    renderList(document.getElementById("glossarySearch").value);
  }

  function renderList(query) {
    if (typeof document === "undefined") return;
    var host = document.getElementById("glossaryResults"), count = document.getElementById("glossaryCount");
    if (!host || !count) return;
    var q = norm(query);
    var matches = all.filter(function (entry) {
      if (!q) return true;
      return norm(entry.term + " " + entry.definition + " " + entry.lessons.map(function (item) { return item.title; }).join(" ")).indexOf(q) >= 0;
    });
    count.textContent = matches.length + " понятий и персоналий" + (matches.length > 100 ? " · показаны первые 100" : "");
    host.textContent = "";
    if (!matches.length) {
      var empty = document.createElement("p"); empty.className = "glossary-empty"; empty.textContent = "Ничего не найдено. Попробуй другое слово или часть имени."; host.appendChild(empty); return;
    }
    matches.slice(0, 100).forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button"; button.className = "glossary-item" + (selectedKey === norm(entry.term) ? " active" : "");
      button.dataset.glossaryTerm = entry.term;
      var title = document.createElement("b"); title.textContent = entry.term;
      var small = document.createElement("small"); small.textContent = entry.kind === "person" ? "Персоналия" : (entry.lessons.length ? "Уроков: " + entry.lessons.length : entry.category);
      button.appendChild(title); button.appendChild(small); host.appendChild(button);
    });
  }

  function open(term) {
    if (typeof document === "undefined") return;
    modal = modal || document.getElementById("glossaryOverlay");
    if (!modal) return;
    previousFocus = document.activeElement;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    var search = document.getElementById("glossarySearch");
    search.value = "";
    var entry = term ? find(term) : null;
    if (entry) {
      search.value = entry.term;
      selectedKey = norm(entry.term);
      setDefinition(entry);
    } else {
      selectedKey = null;
      renderList("");
      setDefinition(all[0]);
    }
    search.focus();
  }

  function close() {
    if (typeof document === "undefined") return;
    modal = modal || document.getElementById("glossaryOverlay");
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function linkify(root) {
    if (!root || !termRegex || typeof document === "undefined") return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent || !node.nodeValue.trim() || parent.closest("a,button,input,textarea,script,style,code,.glossary-inline")) continue;
      nodes.push(node);
    }
    nodes.forEach(function (textNode) {
      var text = textNode.nodeValue, regex = new RegExp(termRegex.source, termRegex.flags), match, cursor = 0, fragment = document.createDocumentFragment(), changed = false;
      while ((match = regex.exec(text))) {
        var entry = clickableByKey[norm(match[2])];
        if (!entry) continue;
        if (match.index > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        if (match[1]) fragment.appendChild(document.createTextNode(match[1]));
        var button = document.createElement("button");
        button.type = "button"; button.className = "glossary-inline"; button.dataset.glossaryTerm = entry.term;
        button.textContent = match[2]; button.title = "Открыть определение: " + entry.term;
        button.setAttribute("aria-label", "Открыть определение: " + entry.term);
        fragment.appendChild(button);
        cursor = match.index + match[0].length; changed = true;
      }
      if (changed) {
        if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  var api = {
    entries: all,
    find: find,
    open: open,
    close: close,
    decorateReader: function () {
      if (typeof document === "undefined") return;
      ["readerLead", "readerIntro2", "readerFacts", "depthPeople", "depthCausality", "depthChronology"].forEach(function (id) {
        linkify(document.getElementById(id));
      });
    },
    stats: { entries: all.length, clickableTerms: clickable.length }
  };
  window.HISTORY_GLOSSARY = api;

  if (typeof document !== "undefined") {
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("#openGlossary,[data-glossary-term]");
      if (trigger) {
        event.preventDefault();
        var term = trigger.dataset.glossaryTerm;
        open(term || "");
        return;
      }
      var related = event.target.closest("[data-glossary-day]");
      if (related) {
        var day = Number(related.dataset.glossaryDay);
        if (day >= 1 && day <= course.lessons.length) window.location.href = "?day=" + day;
        return;
      }
      if (event.target.id === "glossaryClose" || event.target.id === "glossaryOverlay") close();
    });
    var searchInput = document.getElementById("glossarySearch");
    if (searchInput) searchInput.addEventListener("input", function () { selectedKey = null; renderList(searchInput.value); });
    document.addEventListener("keydown", function (event) {
      var overlay = document.getElementById("glossaryOverlay");
      if (!overlay || overlay.classList.contains("hidden")) return;
      if (event.key === "Escape") { close(); return; }
      if (event.key === "Tab") {
        var items = Array.prototype.slice.call(overlay.querySelectorAll("button:not([disabled]),input:not([disabled])")).filter(function (item) { return item.offsetParent !== null; });
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    renderList("");
    setDefinition(find("Первичный источник") || all[0]);
  }
})();