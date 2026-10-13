/* Per-person evidence links. Curated URLs are assigned only where the linked
   institution/reference page was identified during source review. All other
   people receive a clearly labelled discovery search, never a false "verified" badge. */
(function () {
  "use strict";
  var course = window.HISTORY_CURRICULUM;
  if (!course || !Array.isArray(course.lessons)) throw new Error("Participant sources require the history curriculum");

  var direct = {
    "Ксеркс I": [{title:"Xerxes — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Xerxes",kind:"historical-reference",note:"Оцифрованная статья старого издания Britannica. Для современных интерпретаций сверьте её с новыми исследованиями."}],
    "Дарий I": [{title:"Xerxes — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Xerxes",kind:"historical-reference",note:"Статья указывает родство Ксеркса с Дарием I и описывает династический контекст; это не отдельная современная биография Дария."}],
    "Фемистокл": [{title:"Themistocles — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Themistocles",kind:"historical-reference",note:"Историческая энциклопедическая статья; оценки и детали сверяйте с современными исследованиями и античными источниками."}],
    "Папа Урбан II": [{title:"Urban II — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Urban_%28popes%29",kind:"historical-reference",note:"Раздел об Урбане II в старом энциклопедическом издании; используйте как справочную отправную точку."}],
    "Саладин": [{title:"Saladin — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Saladin",kind:"historical-reference",note:"Историческая энциклопедическая статья; современные исследования могут иначе трактовать политический контекст и источники."}],
    "Туссен-Лувертюр": [{title:"Toussaint L'Ouverture — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Toussaint_l%27Ouverture%2C_Pierre-Dominique",kind:"historical-reference",note:"Оцифрованная статья 1911 года. Для современной истории Гаитянской революции важно сопоставить её с новыми исследованиями."}],
    "Симон Боливар": [{title:"Simón Bolívar — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Bolivar%2C_Simon",kind:"historical-reference",note:"Оцифрованная статья 1911 года; используйте её вместе с современными исследованиями независимости Латинской Америки."}],
    "Джеймс Уатт": [{title:"James Watt — Encyclopaedia Britannica (издание 1911 года)",url:"https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Watt%2C_James",kind:"historical-reference",note:"Справка старого издания. Не объясняйте промышленную революцию одним изобретателем: важны также капитал, энергия, труд и рынки."}],
    "Борис Годунов": [{title:"Boris Godunov — Encyclopedia.com",url:"https://www.encyclopedia.com/people/history/russian-soviet-and-cis-history-biographies/boris-godunov",kind:"reference",note:"Биографическая справка с библиографией исследований о правлении Годунова и Смутном времени."}],
    "Хаммурапи": [{title:"Стела законов Хаммурапи — Лувр",url:"https://www.louvre.fr/en/the-code-of-hammurabi",kind:"museum",note:"Музейное описание самого памятника, его датировки, правовых решений и изображения Шамаша. Это первоисточник в музейном контексте."}],
    "Шамаш": [{title:"Стела законов Хаммурапи — Лувр",url:"https://www.louvre.fr/en/the-code-of-hammurabi",kind:"museum",note:"Описание рельефа, на котором Хаммурапи представлен перед богом Шамашем."}],
    "Нармер": [{title:"Narmer — коллекция Британского музея",url:"https://www.britishmuseum.org/collection/term/BIOG54663",kind:"museum",note:"Музейная справка о раннем египетском правителе и связанных предметах коллекции."}],
    "Джордж Вашингтон": [{title:"Founders Online — документы американских основателей",url:"https://founders.archives.gov/",kind:"primary-source-archive",note:"Архив аннотированных писем и документов; это первичные источники, а не беспристрастные биографии."}],
    "Томас Джефферсон": [{title:"Национальный архив США — история Декларации независимости",url:"https://www.archives.gov/founding-docs/declaration-history",kind:"archive",note:"Официальный архивный материал об авторах, редакции и контексте Декларации независимости."},{title:"Founders Online — документы американских основателей",url:"https://founders.archives.gov/",kind:"primary-source-archive",note:"Письма и документы Джефферсона и его современников; оценивайте автора, адресата и обстоятельства документа."}],
    "Бенджамин Франклин": [{title:"Национальный архив США — основатели Конституции",url:"https://www.archives.gov/founding-docs/founding-fathers",kind:"archive",note:"Архивная справка о делегатах Конституционного конвента и их роли в основании США."},{title:"Founders Online — документы американских основателей",url:"https://founders.archives.gov/",kind:"primary-source-archive",note:"Аннотированные письма и документы Франклина и современников."}],
    "Гарри Трумэн": [{title:"Библиотека Трумэна — истоки холодной войны",url:"https://www.trumanlibrary.gov/museum/presidential-years/origins-of-the-cold-war",kind:"presidential-library",note:"Музейная экспозиция и документы президентского периода; показывает несколько участников и дискуссий, а не только одну версию событий."}],
    "Джордж Кеннан": [{title:"Библиотека Трумэна — идеологические основы холодной войны",url:"https://www.trumanlibrary.gov/library/online-collections/ideological-foundations-of-cold-war",kind:"presidential-library",note:"Документы и обзор роли «длинной телеграммы» Кеннана и споров об американской стратегии."}],
    "Честер Нимиц": [{title:"Naval History and Heritage Command — биографический очерк о Честере Нимице (PDF)",url:"https://www.history.navy.mil/content/dam/nhhc/research/publications/publication-508-pdf/Best_Beloved_508.pdf",kind:"official-history",note:"Издание военно-морской исторической службы США; институциональная биография требует чтения с пониманием контекста ведомства."}]
  };

  var counts = {people:0,withDirectSource:0,withSearch:0,sourceLinks:0};
  course.lessons.forEach(function (row, index) {
    var meta = row[6] || {}, depth = meta.depth || {};
    (depth.people || []).forEach(function (person) {
      counts.people++;
      var sources = direct[person.name] || [];
      person.sources = sources.map(function (source) {
        return {title:source.title,url:source.url,note:source.note,kind:source.kind};
      });
      person.sourceSearch = {
        title: "Найти биографические материалы в Encyclopaedia Britannica",
        url: "https://www.britannica.com/search?query=" + encodeURIComponent(person.name),
        note: "Это поиск, а не проверенная статья. Откройте конкретный материал и проверьте автора, датировку и библиографию; по спорным вопросам сравните несколько независимых источников."
      };
      if (person.sources.length) counts.withDirectSource++;
      else counts.withSearch++;
      counts.sourceLinks += person.sources.length;
    });
    meta.depth = depth;
    meta.participantSourcesVersion = 1;
    row[6] = meta;
  });
  window.HISTORY_PARTICIPANT_SOURCE_STATS = counts;
})();