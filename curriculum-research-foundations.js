/* Firecrawl-assisted, source-backed lesson references and image notes.
   Search results and source pages reviewed on 2026-10-20.
   Each note is limited to a matching lesson AND matching filename/metadata. */
(function () {
  "use strict";
  var course = window.HISTORY_CURRICULUM;
  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 182) {
    throw new Error("Foundation research requires the 182-lesson history curriculum");
  }

  var packs = [
    {
      day: 4,
      expectedTitle: "Археология и естественно-научные методы",
      sources: [
        {
          type: "МЕТОД АРХЕОЛОГИИ",
          title: "U.S. National Park Service — What Is Archaeological Context?",
          url: "https://www.nps.gov/articles/000/what-is-archeological-context.htm",
          desc: "Объясняет, почему место находки, последовательность слоёв, датировка и соседние материалы важны для вывода. Примеры связаны с археологией США, но принцип контекста применим шире.",
          lang: "Английский"
        },
        {
          type: "МУЗЕЙ И АРХЕОЛОГИЯ",
          title: "Smithsonian National Museum of Natural History — Unlocking Hidden Worlds through Archaeology and Archives",
          url: "https://naturalhistory.si.edu/education/teaching-resources/anthropology-and-social-studies/unlocking-hidden-worlds-through-archaeology-and-archives",
          desc: "Учебный материал показывает, как археологические предметы и архивные свидетельства вместе помогают реконструировать прошлое; это пример метода, а не обзор всех археологических традиций.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 5,
      expectedTitle: "Первичные и вторичные источники",
      sources: [
        {
          type: "АРХИВНЫЙ МЕТОД",
          title: "Library of Congress — Finding Primary Sources",
          url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/finding/",
          desc: "Практическое руководство по поиску документов, газет, фотографий и других первичных материалов; полезно для освоения происхождения источника и ограничений цифровых коллекций. Примеры преимущественно американские.",
          lang: "Английский"
        },
        {
          type: "ГОСУДАРСТВЕННЫЙ АРХИВ",
          title: "U.S. National Archives — Finding Primary Sources for Teachers and Students",
          url: "https://www.archives.gov/education/research/primary-sources",
          desc: "Путеводитель к первичным документам, архивному каталогу и правилам работы с источниками. Архивные собрания преимущественно посвящены истории США; здесь он служит примером метода.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 6,
      expectedTitle: "Пропаганда, память и спорные события",
      sources: [
        {
          type: "МУЗЕЙНЫЙ ИСТОРИЧЕСКИЙ КЕЙС",
          title: "United States Holocaust Memorial Museum — Nazi Propaganda and Censorship",
          url: "https://encyclopedia.ushmm.org/content/en/article/nazi-propaganda-and-censorship",
          desc: "На конкретном примере нацистской Германии разбирает связь пропаганды, цензуры, массовых мероприятий, прессы и учебников. Это документированный исторический кейс, а не универсальная модель для всех эпох.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИЧЕСКИЙ АНАЛИЗ ПРОПАГАНДЫ",
          title: "Bundeszentrale für politische Bildung — Methoden der Kriegspropaganda",
          url: "https://www.bpb.de/themen/medien-journalismus/krieg-in-den-medien/130699/methoden-der-kriegspropaganda/",
          desc: "Немецкий аналитический материал о приёмах военной пропаганды и визуальных образах. Сопоставляйте тезисы с датированными свидетельствами и не переносите выводы автоматически на любую эпоху.",
          lang: "Немецкий"
        }
      ]
    },
    {
      day: 7,
      expectedTitle: "Практикум 1: разбор источника",
      sources: [
        {
          type: "МЕТОД ИСТОРИЧЕСКОГО ЧТЕНИЯ",
          title: "Digital Inquiry Group — History Lessons / Reading Like a Historian",
          url: "https://www.inquirygroup.org/history-lessons",
          desc: "Описывает работу с документами через происхождение, контекст, сопоставление свидетельств и внимательное чтение. Большая часть готовых уроков посвящена истории США; здесь используется именно методика анализа.",
          lang: "Английский"
        },
        {
          type: "АРХИВНАЯ ПРАКТИКА",
          title: "Library of Congress — Finding Primary Sources",
          url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/finding/",
          desc: "Помогает находить первичные материалы и учитывать их происхождение. Для практикума полезно требовать от ученика не просто пересказ, а указание автора, даты, аудитории и ограничения свидетельства.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 8,
      expectedTitle: "Homo sapiens: язык, мифы и религия",
      sources: [
        {
          type: "МУЗЕЙНАЯ НАУКА",
          title: "Smithsonian Human Origins Program — Human Evolution Evidence: Behavior",
          url: "https://humanorigins.si.edu/evidence/behavior",
          desc: "Собирает свидетельства раннего поведения людей — следы, орудия, символы и искусство. Материальные находки помогают формулировать гипотезы о символическом поведении, но обычно не раскрывают напрямую содержание верований.",
          lang: "Английский"
        },
        {
          type: "НАУЧНЫЙ ОБЗОР",
          title: "The evolution of early symbolic behavior in Homo sapiens — Proceedings of the National Academy of Sciences / PMC",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7060673/",
          desc: "Научная работа рассматривает развитие раннего символического поведения по археологическим данным. Используйте её как исследовательскую интерпретацию конкретных свидетельств, а не как доказательство единственной причины возникновения языка или религии.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 9,
      expectedTitle: "Homo sapiens и другие человеческие виды",
      sources: [
        {
          type: "МУЗЕЙНАЯ НАУКА И ГЕНЕТИКА",
          title: "Smithsonian Human Origins Program — Ancient DNA and Neanderthals",
          url: "https://humanorigins.si.edu/evidence/genetics/ancient-dna-and-neanderthals",
          desc: "Объясняет, как древняя ДНК свидетельствует о скрещивании неандертальцев и Homo sapiens и помогает изучать расселение людей. Генетические данные нужно сопоставлять с ископаемыми останками и археологией.",
          lang: "Английский"
        },
        {
          type: "НАУЧНО-ПОПУЛЯРНЫЙ ОБЗОР МУЗЕЯ",
          title: "Natural History Museum, London — Neanderthals and Homo sapiens interbred within the past 50,000 years",
          url: "https://www.nhm.ac.uk/discover/news/2024/december/neanderthals-homo-sapiens-interbred-within-past-50000-years.html",
          desc: "Материал музея о научных данных по времени контактов и смешения популяций. Это изложение конкретного исследования; детали датировок следует соотносить с первичной публикацией и последующими работами.",
          lang: "Английский"
        }
      ]
    }

    {
      day: 10,
      expectedTitle: "Повседневность охотников-собирателей",
      sources: [
        {
          type: "АНТРОПОЛОГИЧЕСКИЙ ОБЗОР",
          title: "Human Relations Area Files, Yale University — Hunter-Gatherers (Foragers)",
          url: "https://hraf.yale.edu/ehc/summaries/hunter-gatherers",
          desc: "Сравнивает разные общества, добывающие пищу охотой и собирательством, и подчёркивает, что современные сообщества не являются неизменными копиями доисторических людей. Для выводов о прошлом нужны археологические данные.",
          lang: "Английский"
        },
        {
          type: "НАУЧНЫЙ ОБЗОР",
          title: "Hunter-gatherer studies and human evolution: a very selective review",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5875731/",
          desc: "Научный обзор показывает, как этнографические наблюдения и археология помогают изучать мобильность, разделение пищи и повседневную жизнь, а также где аналогии между современными и древними группами ограничены.",
          lang: "Английский"
        }
      ]
    }
  ];

  packs.forEach(function (pack) {
    var row = course.lessons[pack.day - 1];
    if (!row || row[0] !== pack.expectedTitle) {
      throw new Error("Research pack title mismatch on day " + pack.day + ": expected " + pack.expectedTitle);
    }
    var meta = row[6] || {};
    var existing = Array.isArray(meta.researchSources) ? meta.researchSources.slice() : [];
    var seen = new Set(existing.map(function (source) { return source && source.url; }).filter(Boolean));
    meta.researchSources = existing.concat(pack.sources.filter(function (source) {
      if (seen.has(source.url)) return false;
      seen.add(source.url);
      return true;
    }));
    meta.researchSourcesVersion = Math.max(meta.researchSourcesVersion || 0, 2);
    row[6] = meta;
  });

  window.HISTORY_FOUNDATION_IMAGE_NOTES = [
    {
      day: 4,
      re: /stratigraph|excavation layers|archaeological context|archaeological section|soil section|стратиграф|археологическ.*сло|разрез раскопа/i,
      title: "Археологический разрез и последовательность слоёв",
      description: "Расположение слоя и его связь с соседними находками помогают выстраивать относительную последовательность событий и проверять контекст предмета. Если слой нарушен позднейшими раскопками или строительством, вывод только по глубине может оказаться неверным.",
      why: "Зачем это изображение важно: оно показывает, что археологическое доказательство — не только предмет, но и документированное место его обнаружения. Сопоставьте слои с описанием раскопа и методом датирования.",
      sourceUrl: "https://www.nps.gov/articles/000/what-is-archeological-context.htm"
    },
    {
      day: 4,
      re: /obsidian|flint tool|stone tool|projectile point|stone artifact|наконечник|обсидиан|каменн(?:ое орудие|ый инструмент)/i,
      title: "Каменное орудие как археологическое свидетельство",
      description: "Форма и материал могут подсказать технологию изготовления и возможное использование, но сами по себе не раскрывают весь образ жизни создателей. Важны место находки, слой, соседние предметы и лабораторные данные.",
      why: "Зачем это изображение важно: это пример материального свидетельства. Отделите видимые детали от гипотез о возрасте, назначении и владельцах предмета; проверьте данные по музейной или археологической карточке.",
      sourceUrl: "https://www.nps.gov/articles/000/what-is-archeological-context.htm"
    },
    {
      day: 5,
      re: /primary source|historical document|charter|manuscript|letter|diary|newspaper|archive|первичн.*источник|историческ.*документ|рукопис|хартия|письмо|дневник|газета|архив/i,
      title: "Документ как свидетельство своего времени",
      description: "Изучайте документ через происхождение и контекст: кто его создал, когда, для кого и с какой целью. Первичный источник может быть близок к событию, но отражает ограниченную позицию автора и не доказывает автоматически, что таков был опыт всего общества.",
      why: "Зачем это изображение важно: урок учит связывать вывод с конкретным свидетельством. Опишите видимые детали, затем проверьте автора, дату и адресата по каталогу и обозначьте, чего документ установить не позволяет.",
      sourceUrl: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/finding/"
    },
    {
      day: 6,
      re: /propaganda|political poster|election poster|political cartoon|book burning|censorship|political rally|wartime poster|агитационн.*плакат|пропаганд|цензур|сожжен.*книг|сожжение книг|агитплакат/i,
      title: "Пропагандистское изображение и его аудитория",
      description: "Плакат или политическое изображение не просто отражает события: оно пытается убедить определённую аудиторию. Слоганы, символы, выбранные герои и образ противника показывают, какую реакцию хотел вызвать автор; сообщение нужно проверять по независимым свидетельствам.",
      why: "Зачем это изображение важно: оно помогает разобрать методы убеждения. Установите дату, заказчика и аудиторию, затем спросите, какие факты выделены, искажены или опущены.",
      sourceUrl: "https://encyclopedia.ushmm.org/content/en/article/nazi-propaganda-and-censorship"
    },
    {
      day: 6,
      re: /memorial|commemorat|monument to|historical memory|memory of|памятник|мемориал|увековеч|историческ.*памят/i,
      title: "Памятник и общественная память",
      description: "Памятник отражает не только прошлое, но и выбор общества или власти — что именно помнить и как представлять участников событий. Дата установки, надписи, заказчики и последующие изменения могут отличаться от времени самого события.",
      why: "Зачем это изображение важно: оно помогает различить событие прошлого и более позднюю память о нём. Сравните надпись и обстоятельства создания памятника с источниками об историческом событии.",
      sourceUrl: "https://www.bpb.de/themen/medien-journalismus/krieg-in-den-medien/130699/methoden-der-kriegspropaganda/"
    },
    {
      day: 7,
      re: /primary source|historical document|charter|manuscript|letter|diary|newspaper|archive|historical source|первичн.*источник|историческ.*документ|рукопис|хартия|письмо|дневник|газета|архив|разбор источника/i,
      title: "Разбор исторического источника: автор, цель и ограничения",
      description: "Для анализа документа важно установить, кто его создал, когда, для какой аудитории и с какой целью. Отдельно различайте то, что прямо сказано или изображено, и вывод, который вы делаете на основе свидетельства.",
      why: "Зачем это изображение важно: практикум тренирует доказательный ответ. Назовите конкретную деталь источника, объясните её значение и укажите, какой вопрос этот источник не позволяет решить самостоятельно.",
      sourceUrl: "https://www.inquirygroup.org/history-lessons"
    },
    {
      day: 8,
      re: /cave art|prehistoric art|symbolic behavior|engraved ochre|bead necklace|shell beads|ritual site|пещерн.*искусств|наскальн.*рис|символическ.*поведен|гравиров.*охр|бусы из раковин|ритуальн.*мест/i,
      title: "Символический предмет и пределы археологической интерпретации",
      description: "Украшения, гравировки и изображения могут свидетельствовать о символическом поведении, но их точное значение часто неизвестно. Археологи сравнивают контекст находки, повторяемость мотивов, датировку и другие независимые данные, прежде чем предлагать объяснение.",
      why: "Зачем это изображение важно: оно показывает, как исследуют язык символов и возможные ритуалы без письменных объяснений. Не приписывайте древним людям конкретный миф или веру, если источник этого не подтверждает.",
      sourceUrl: "https://humanorigins.si.edu/evidence/behavior"
    },
    {
      day: 9,
      re: /neanderthal|denisovan|hominin|human evolution fossil|homo sapiens skull|днк неандерталь|неандертал|денисов|гоминин|ископаем.*череп|эволюц.*человек/i,
      title: "Ископаемые останки и древняя ДНК: разные линии доказательств",
      description: "Форма костей помогает сравнивать древние популяции, а древняя ДНК выявляет родство и эпизоды смешения. Ни один из этих типов данных сам по себе не даёт полной картины поведения, языка или самоидентификации древних людей.",
      why: "Зачем это изображение важно: оно иллюстрирует ветвящуюся эволюцию людей и контакты между разными популяциями. Сверяйте подпись с конкретным образцом и не делайте вывод о происхождении человека только по внешнему сходству черепов.",
      sourceUrl: "https://humanorigins.si.edu/evidence/genetics/ancient-dna-and-neanderthals"
    }

    {
      day: 10,
      re: /hunter.?gatherer|forager|mammoth house|paleolithic camp|stone tool|охотник.*собирател|стоянк.*палеолит|мамонт.*жилищ|палеолитическ.*стоянк/i,
      title: "Повседневность охотников-собирателей: адаптация к среде",
      description: "Орудия, очаги, жилища и пищевые остатки помогают исследовать, как люди добывали и распределяли ресурсы, перемещались и приспосабливались к условиям среды. Образ жизни сильно различался по регионам и периодам.",
      why: "Зачем это изображение важно: оно показывает повседневные решения людей, а не «примитивную ступень» на пути к земледелию. Не переносите напрямую образ жизни современных охотников-собирателей на доисторические группы без археологических подтверждений.",
      sourceUrl: "https://hraf.yale.edu/ehc/summaries/hunter-gatherers"
    }
  ];

  window.HISTORY_FOUNDATION_RESEARCH_STATS = {
    version: 2,
    lessons: packs.map(function (pack) { return pack.day; }),
    addedSourceCount: packs.reduce(function (total, pack) { return total + pack.sources.length; }, 0),
    imageNoteCount: window.HISTORY_FOUNDATION_IMAGE_NOTES.length
  };
})();
