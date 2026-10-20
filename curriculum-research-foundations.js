/* Firecrawl-assisted research references and cautious, lesson-specific image notes.
   Sources were opened and reviewed on 2026-10-20. Rules only activate when the
   selected image filename/metadata matches the declared subject. */
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
          desc: "Учебный материал показывает, как археологические предметы и архивные свидетельства вместе помогают реконструировать прошлое; используйте его как пример метода, а не как обзор всех археологических традиций.",
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
          desc: "Практическое руководство по поиску документов, газет, фотографий и других первичных материалов; отдельно напоминает учитывать состав и ограничения цифровых коллекций. Примеры в основном американские.",
          lang: "Английский"
        },
        {
          type: "ГОСУДАРСТВЕННЫЙ АРХИВ",
          title: "U.S. National Archives — Finding Primary Sources for Teachers and Students",
          url: "https://www.archives.gov/education/research/primary-sources",
          desc: "Путеводитель к первичным документам, архивному каталогу и правилам цитирования. Архивные собрания преимущественно посвящены истории США; источник полезен для освоения метода поиска и атрибуции.",
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
          desc: "На конкретном примере нацистской Германии разбирает связь пропаганды, цензуры, массовых мероприятий, прессы и учебников. Это исторический кейс с документированными примерами, а не универсальная модель для всех эпох.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИЧЕСКИЙ АНАЛИЗ ПРОПАГАНДЫ",
          title: "Bundeszentrale für politische Bildung — Methoden der Kriegspropaganda",
          url: "https://www.bpb.de/themen/medien-journalismus/krieg-in-den-medien/130699/methoden-der-kriegspropaganda/",
          desc: "Немецкий аналитический материал о приёмах военной пропаганды и визуальных образах. Сравнивайте его тезисы с датированными плакатами и другими свидетельствами; не переносите выводы автоматически на любую политическую коммуникацию.",
          lang: "Немецкий"
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
    meta.researchSourcesVersion = Math.max(meta.researchSourcesVersion || 0, 1);
    row[6] = meta;
  });

  window.HISTORY_FOUNDATION_IMAGE_NOTES = [
    {
      day: 4,
      re: /stratigraph|excavation layers|archaeological context|archaeological section|soil section|стратиграф|археологическ.*сло|разрез раскопа/i,
      title: "Археологический разрез и последовательность слоёв",
      description: "Расположение слоя и его связь с соседними находками помогают археологам выстраивать относительную последовательность событий и проверять контекст предмета. Если слой нарушен позднейшими раскопками или строительством, простой вывод по глубине может оказаться неверным.",
      why: "Зачем это изображение важно: урок «Археология и естественно-научные методы» показывает, что доказательство — это не только сам предмет, но и документированное место его обнаружения. Сопоставьте видимые слои с описанием раскопа и методикой датирования.",
      sourceUrl: "https://www.nps.gov/articles/000/what-is-archeological-context.htm"
    },
    {
      day: 4,
      re: /obsidian|flint tool|stone tool|projectile point|stone artifact|наконечник|обсидиан|каменн(?:ое орудие|ый инструмент)/i,
      title: "Каменное орудие как археологическое свидетельство",
      description: "Форма и материал предмета могут указывать на технологию изготовления и возможное использование, однако сами по себе не раскрывают весь образ жизни создавших его людей. Для выводов важны место находки, слой, соседние предметы и лабораторные данные.",
      why: "Зачем это изображение важно: это пример материального свидетельства. Отделите то, что видно на фотографии, от гипотез о возрасте, назначении и владельцах предмета; подтвердите эти данные музейной или археологической карточкой.",
      sourceUrl: "https://www.nps.gov/articles/000/what-is-archeological-context.htm"
    },
    {
      day: 5,
      re: /primary source|historical document|charter|manuscript|letter|diary|newspaper|archive|первичн.*источник|историческ.*документ|рукопис|хартия|письмо|дневник|газета|архив/i,
      title: "Документ как свидетельство своего времени",
      description: "Этот документ следует изучать через происхождение и контекст: кто его создал, когда, для кого и с какой целью. Первичный источник может быть близок к событию, но отражает ограниченную позицию автора и не доказывает автоматически, что таков был опыт всего общества.",
      why: "Зачем это изображение важно: урок «Первичные и вторичные источники» учит связывать вывод с конкретным свидетельством. Сначала опишите видимые детали, затем назовите автора, дату и адресата по карточке источника и укажите, что документ не позволяет установить.",
      sourceUrl: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/finding/"
    },
    {
      day: 6,
      re: /propaganda|political poster|election poster|political cartoon|book burning|censorship|political rally|wartime poster|агитационн.*плакат|пропаганд|цензур|сожжен.*книг|сожжение книг|агитплакат/i,
      title: "Пропагандистское изображение и его аудитория",
      description: "Плакат или политическое изображение создаётся не только для отражения событий: оно пытается убедить определённую аудиторию. Слоганы, символы, выбор героя и образ противника показывают, какую реакцию хотел вызвать автор; сообщение изображения нужно проверять по независимым свидетельствам.",
      why: "Зачем это изображение важно: оно помогает разобрать методы убеждения в теме «Пропаганда, память и спорные события». Установите дату, заказчика и предполагаемую аудиторию, а затем спросите, какие факты выделены, искажаются или опущены.",
      sourceUrl: "https://encyclopedia.ushmm.org/content/en/article/nazi-propaganda-and-censorship"
    },
    {
      day: 6,
      re: /memorial|commemorat|monument to|historical memory|memory of|памятник|мемориал|увековеч|историческ.*памят/i,
      title: "Памятник и общественная память",
      description: "Памятник отражает не только прошлое, но и выбор общества или власти — что именно следует помнить и как представлять участников событий. Дата установки, надписи, заказчики и последующие изменения могут отличаться от времени самого события.",
      why: "Зачем это изображение важно: оно позволяет различить событие прошлого и более позднюю память о нём. Сравните надпись и обстоятельства создания памятника с источниками об историческом событии; не принимайте мемориальную версию за нейтральное описание.",
      sourceUrl: "https://www.bpb.de/themen/medien-journalismus/krieg-in-den-medien/130699/methoden-der-kriegspropaganda/"
    }
  ];

  window.HISTORY_FOUNDATION_RESEARCH_STATS = {
    version: 1,
    lessons: packs.map(function (pack) { return pack.day; }),
    addedSourceCount: packs.reduce(function (total, pack) { return total + pack.sources.length; }, 0),
    imageNoteCount: window.HISTORY_FOUNDATION_IMAGE_NOTES.length
  };
})();
