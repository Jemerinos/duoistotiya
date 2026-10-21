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
      day: 1,
      expectedTitle: "Что изучает история?",
      sources: [
        {
          type: "УНИВЕРСИТЕТСКИЙ МЕТОД ИСТОРИИ",
          title: "UCLA Department of History — Primary & Secondary Sources",
          url: "https://history.ucla.edu/primary-secondary-sources/",
          desc: "Кратко объясняет отличие первичных и вторичных источников. Используйте классификацию в зависимости от конкретного вопроса, а не как шкалу от «плохого» к «хорошему».",
          lang: "Английский"
        },
        {
          type: "АРХИВНО-МЕТОДИЧЕСКОЕ РУКОВОДСТВО",
          title: "Library of Congress — Getting Started with Primary Sources",
          url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/",
          desc: "Практический разбор того, как выявлять точку зрения автора, контекст, аудиторию и ограничения первичного источника. Примеры в основном американские; метод можно применять к другим эпохам.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 2,
      expectedTitle: "Хронология и историческое время",
      sources: [
        {
          type: "НАУЧНАЯ СТАТЬЯ",
          title: "PNAS / PMC — The importance of year zero in interdisciplinary studies of climate and history",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7776855/",
          desc: "Объясняет отсутствие нулевого года в традиционном летосчислении и показывает, как ошибки календарного пересчёта влияют на сопоставление исторических и естественно-научных дат.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИКО-КУЛЬТУРНЫЙ ОБЗОР",
          title: "World History Encyclopedia — The Origin & History of the BCE/CE Dating System",
          url: "https://www.worldhistory.org/article/1041/the-origin--history-of-the-bcece-dating-system/",
          desc: "Описывает происхождение и применение обозначений BCE/CE и отсутствие нулевого года в традиционной системе. Для технического вопроса пересчёта сверяйтесь также с научной публикацией о хронологии.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 3,
      expectedTitle: "География и карта как источник",
      sources: [
        {
          type: "АРХИВ И ИСТОРИЧЕСКАЯ КАРТОГРАФИЯ",
          title: "Library of Congress — Maps From The World Digital Library",
          url: "https://www.loc.gov/classroom-materials/maps-from-the-world-digital-library/",
          desc: "Подборка исторических карт разных мест и эпох. Материал помогает изучать, что картограф выделял и как карта отражает представления своего времени.",
          lang: "Английский"
        },
        {
          type: "УЧЕБНЫЙ ОБЗОР",
          title: "OpenStax — World History, Volume 1: Introduction",
          url: "https://openstax.org/books/world-history-volume-1/pages/1-introduction",
          desc: "Вводит в исторический метод и контекст ранних обществ. Используйте вместе с конкретной картой: дата, масштаб, легенда и цель создателя требуют отдельной проверки.",
          lang: "Английский"
        }
      ]
    },
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
        },
        {
          type: "МУЗЕЙНАЯ КАРТОЧКА ПЕРВИЧНОГО ПАМЯТНИКА",
          title: "Musée du Louvre — The Code of Hammurabi",
          url: "https://www.louvre.fr/en/the-code-of-hammurabi",
          desc: "Официальная карточка стелы, созданной при Хаммурапи в XVIII веке до н. э.; помогает проверять датировку и материальный контекст используемого примера.",
          lang: "Английский"
        },
      ]
    },
    {
      day: 10,
      expectedTitle: "Когнитивная революция: язык, символы и сотрудничество",
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
        },
        {
          type: "МУЗЕЙНАЯ КОЛЛЕКЦИЯ",
          title: "Smithsonian Human Origins Program — Blombos Ocher Plaque",
          url: "https://humanorigins.si.edu/evidence/behavior/recording-information/blombos-ocher-plaque",
          desc: "Описывает гравированную охру из пещеры Бломбос возрастом примерно 77–75 тысяч лет. Находка показывает намеренное нанесение узора, но не устанавливает его точный смысл.",
          lang: "Английский"
        },
      ]
    },
    {
      day: 8,
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
        {
          type: "МУЗЕЙНАЯ НАУКА",
          title: "Smithsonian Human Origins Program — Our species arose at least 300,000 years ago",
          url: "https://humanorigins.si.edu/research/whats-hot-human-origins/our-species-arose-least-300000-years-ago",
          desc: "Поясняет, почему останки из Джебель-Ирхуд в Марокко датируют примерно 300 тысячами лет назад и как находки поддерживают африканское происхождение Homo sapiens.",
          lang: "Английский"
        },
      ]
    },
    {
      day: 9,
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
        {
          type: "АКАДЕМИЧЕСКИЙ ОБЗОР АРХЕОЛОГИИ",
          title: "Columbia University — The Natufian Culture in the Levant, Threshold to the Origins of Agriculture",
          url: "https://www.columbia.edu/itc/anthropology/v1007/baryo.pdf",
          desc: "Разбирает поздние общества охотников-собирателей Леванта, долговременные поселения и переходные стратегии до широкого распространения земледелия. Выводы относятся к конкретному региону.",
          lang: "Английский"
        },
      ]
    },
    {
      day: 11,
      expectedTitle: "Общие истории, нормы и большие сообщества",
      sources: [
        {
          type: "МУЗЕЙНАЯ НАУКА О СОЦИАЛЬНОМ ПОВЕДЕНИИ",
          title: "Smithsonian Human Origins Program — Social Life",
          url: "https://humanorigins.si.edu/human-characteristics/social-life",
          desc: "Материал связывает заботу о детях, совместное питание, обмен ресурсами и расширение социальных сетей с адаптацией ранних людей. Современные формы сотрудничества помогают ставить вопросы, но не являются прямой копией доисторических обществ.",
          lang: "Английский"
        },
        {
          type: "МУЗЕЙНЫЙ ОБЗОР СИМВОЛОВ И КОММУНИКАЦИИ",
          title: "Smithsonian Human Origins Program — Language & Symbols",
          url: "https://humanorigins.si.edu/human-characteristics/language-symbols",
          desc: "Обзор материальных свидетельств символического поведения — пигментов, украшений и предметов с отметками. Он помогает обсуждать роль общих знаков, не позволяя восстановить конкретные мифы или правила только по одному артефакту.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 12,
      expectedTitle: "Что археология может сказать о ранней религии?",
      sources: [
        {
          type: "НАУЧНАЯ СТАТЬЯ ПО АРХЕОЛОГИИ РИТУАЛА",
          title: "Cambridge Archaeological Journal — Ritual Burial of Cultic Objects: The Earliest Evidence",
          url: "https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/ritual-burial-of-cultic-objects-the-earliest-evidence/2368F7D446DD98F7C9810BCDEE505DF8",
          desc: "Исследование рассматривает погребение предметов в неолитическом и халколитическом Ближнем Востоке. Конкретные случаи показывают, как исследователи аргументируют ритуальную интерпретацию, но не дают универсального ответа о происхождении религии.",
          lang: "Английский"
        },
        {
          type: "АКАДЕМИЧЕСКИЙ ОБЗОР МАТЕРИАЛЬНОЙ РЕЛИГИИ",
          title: "Archaeology and Material Religion: An Introduction — PubMed Central",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3272428/",
          desc: "Обзор обсуждает, как археологи выводят возможное ритуальное значение из материальных остатков и почему такие интерпретации нельзя считать самоочевидными. Полезен для различения находки, гипотезы и доказанного вывода.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 13,
      expectedTitle: "Гёбекли-Тепе: ритуал до полного перехода к земледелию?",
      sources: [
        {
          type: "ОФИЦИАЛЬНЫЙ АРХЕОЛОГИЧЕСКИЙ ПРОЕКТ",
          title: "German Archaeological Institute — Göbekli Tepe",
          url: "https://www.dainst.org/en/research/projects/noslug/5746",
          desc: "Страница археологического проекта и полевых исследований Гёбекли-Тепе. Используйте её для проверки данных о раскопках и объектах; значение сооружений и конкретные функции отдельных пространств остаются предметом научной интерпретации.",
          lang: "Английский"
        },
        {
          type: "ВСЕМИРНОЕ НАСЛЕДИЕ ЮНЕСКО",
          title: "UNESCO World Heritage Centre — Göbekli Tepe",
          url: "https://whc.unesco.org/en/list/1572/",
          desc: "Официальное описание датирует монументальные сооружения докерамическим неолитом и связывает их с общественными событиями и ритуалами. ЮНЕСКО отмечает охотников-собирателей как строителей; нельзя сводить этот пример к простой формуле «сначала земледелие, потом сложное общество».",
          lang: "Английский"
        }
      ]
    },
    {
      day: 14,
      expectedTitle: "Религия: социальная функция, вера и историческое доказательство",
      sources: [
        {
          type: "АКАДЕМИЧЕСКАЯ ЭНЦИКЛОПЕДИЯ ФИЛОСОФИИ",
          title: "Stanford Encyclopedia of Philosophy — Philosophy of Religion",
          url: "https://plato.stanford.edu/entries/philosophy-religion/",
          desc: "Разбирает разные определения религии и показывает, почему исследователи не сводят её к одному обязательному признаку. Это философский обзор понятий и аргументов, а не свидетельство о верованиях конкретного древнего общества.",
          lang: "Английский"
        },
        {
          type: "АКАДЕМИЧЕСКИЙ ОБЗОР МАТЕРИАЛЬНОЙ РЕЛИГИИ",
          title: "Archaeology and Material Religion: An Introduction — PubMed Central",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3272428/",
          desc: "Обсуждает, как предметы, места и практики могут быть интерпретированы как ритуальные и религиозные свидетельства. Материальные данные позволяют изучать исторические действия и контексты, но не доказывают и не опровергают метафизические утверждения сами по себе.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 15,
      expectedTitle: "Почему возникло земледелие?",
      sources: [
        {
          type: "ОБЗОР НЕОЛИТИЧЕСКОЙ РЕВОЛЮЦИИ",
          title: "Encyclopaedia Britannica — Neolithic Revolution",
          url: "https://www.britannica.com/event/Neolithic-Revolution",
          desc: "Кратко описывает одомашнивание растений и животных и переход к земледелию. Этот обзор полезен как рамка, но изменения происходили неодновременно в разных регионах и не были одним внезапным изобретением.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИЧЕСКИЙ ОБЗОР",
          title: "Domestication and early agriculture in the Mediterranean Basin — PubMed Central",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2575338/",
          desc: "Научный обзор рассматривает археологические данные о раннем одомашнивании растений и животных в восточном Средиземноморье. Он полезен для проверки дат и региональных различий, но его выводы не следует автоматически переносить на все центры земледелия.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 16,
      expectedTitle: "Плодородный полумесяц и первые деревни",
      sources: [
        {
          type: "МУЗЕЙНАЯ ХРОНОЛОГИЯ",
          title: "The Metropolitan Museum of Art — Mesopotamia, 8000–2000 B.C.",
          url: "https://www.metmuseum.org/toah/ht/02/wam.html",
          desc: "Хронология показывает долгий переход от ранних земледельческих сообществ к городам и государствам Месопотамии. Она охватывает конкретный регион, а не единую траекторию всех обществ.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИКО-ГЕОГРАФИЧЕСКИЙ ОБЗОР",
          title: "Encyclopaedia Britannica — Fertile Crescent",
          url: "https://www.britannica.com/place/Fertile-Crescent",
          desc: "Объясняет географическое значение региона ранних земледельческих сообществ. Плодородный полумесяц охватывает неоднородные территории и не был одной культурой или государством.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 17,
      expectedTitle: "Шумерские города и клинопись",
      sources: [
        {
          type: "МУЗЕЙНОЕ ИССЛЕДОВАНИЕ",
          title: "The Metropolitan Museum of Art — Uruk: The First City",
          url: "https://www.metmuseum.org/essays/uruk-the-first-city",
          desc: "Рассматривает рост Урука, монументальную архитектуру, ремесло и городскую организацию. Археологические данные показывают сложность города, но не сводят его возникновение к одной причине.",
          lang: "Английский"
        },
        {
          type: "МУЗЕЙНЫЙ МАТЕРИАЛ О ПИСЬМЕННОСТИ",
          title: "The British Museum — How to write cuneiform",
          url: "https://www.britishmuseum.org/blog/how-write-cuneiform",
          desc: "Объясняет развитие клинописи из практик учёта и её последующее использование для разных языков и задач. Ранние таблички важны для истории управления, но письмо было лишь частью городской жизни.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 18,
      expectedTitle: "Вавилон и законы Хаммурапи",
      sources: [
        {
          type: "МУЗЕЙНАЯ ХРОНОЛОГИЯ",
          title: "The Metropolitan Museum of Art — Mesopotamia, 2000–1000 B.C.",
          url: "https://www.metmuseum.org/toah/ht/03/wam.html",
          desc: "Помещает Хаммурапи в политический контекст Месопотамии второго тысячелетия до н. э. Хронология помогает ориентироваться, но не показывает, как каждая норма применялась в конкретных делах.",
          lang: "Английский"
        },
        {
          type: "БИОГРАФИЧЕСКИЙ ИСТОРИЧЕСКИЙ ОБЗОР",
          title: "Encyclopaedia Britannica — Hammurabi",
          url: "https://www.britannica.com/biography/Hammurabi",
          desc: "Обобщает сведения о царе Вавилона и его законодательной стеле. Текст следует читать как правовой и царский источник, а не доказательство одинакового исполнения каждой статьи на практике.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 19,
      expectedTitle: "Древний Египет и Нил",
      sources: [
        {
          type: "МУЗЕЙНАЯ ХРОНОЛОГИЯ",
          title: "The Metropolitan Museum of Art — Egypt, 8000–2000 B.C.",
          url: "https://www.metmuseum.org/toah/ht/02/afe.html",
          desc: "Показывает длительное развитие поселений, материальной культуры и политических институтов долины Нила. Это обзор через музейные коллекции, а не исчерпывающая история всех групп Египта.",
          lang: "Английский"
        },
        {
          type: "МУЗЕЙНЫЙ ОБЗОР РАННЕГО ЕГИПТА",
          title: "The British Museum — Early Egypt",
          url: "https://www.britishmuseum.org/collection/galleries/early-egypt",
          desc: "Объясняет значение ежегодного разлива Нила и ранних земледельческих поселений. Река создавала возможности, но государственное объединение также зависело от труда, институтов, конфликтов и решений людей.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 20,
      expectedTitle: "Ремесло, торговля и бронзовый век",
      sources: [
        {
          type: "НАУЧНЫЙ МУЗЕЙНЫЙ КАТАЛОГ",
          title: "The Metropolitan Museum of Art — Art, Trade, and Diplomacy in the Second Millennium B.C.",
          url: "https://www.metmuseum.org/met-publications/beyond-babylon-art-trade-and-diplomacy-in-the-second-millenium-bc",
          desc: "Исследует обмен предметами, художественными приёмами и дипломатическими дарами между Западной Азией, Египтом и Эгейским миром. Это обзор конкретных сетей второго тысячелетия до н. э., а не доказательство равноправной торговли.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИЧЕСКАЯ ЭНЦИКЛОПЕДИЯ",
          title: "World History Encyclopedia — Bronze Age",
          url: "https://www.worldhistory.org/Bronze_Age/",
          desc: "Обобщает распространение бронзы и развитие обществ бронзового века. Металлургия зависела от сырья, технологий и обмена; сроки и формы использования металла различались по регионам.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 21,
      expectedTitle: "Практикум 3: сравнить речные цивилизации",
      sources: [
        {
          type: "СРАВНИТЕЛЬНАЯ МУЗЕЙНАЯ ХРОНОЛОГИЯ",
          title: "The Metropolitan Museum of Art — Mesopotamia, 8000–2000 B.C.",
          url: "https://www.metmuseum.org/toah/ht/02/wam.html",
          desc: "Даёт материал о поселениях, хозяйстве и городах Месопотамии для сравнения с долиной Нила. Сопоставляйте конкретные периоды, а не выстраивайте универсальную лестницу развития.",
          lang: "Английский"
        },
        {
          type: "СРАВНИТЕЛЬНАЯ МУЗЕЙНАЯ ХРОНОЛОГИЯ",
          title: "The Metropolitan Museum of Art — Egypt, 8000–2000 B.C.",
          url: "https://www.metmuseum.org/toah/ht/02/afe.html",
          desc: "Позволяет сравнить ранние поселения и политическую централизацию Египта с Месопотамией. География важна, но не объясняет общественные институты автоматически без анализа труда, конфликтов и власти.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 22,
      expectedTitle: "Хараппа и Мохенджо-Даро",
      sources: [
        {
          type: "ВСЕМИРНОЕ НАСЛЕДИЕ ЮНЕСКО",
          title: "UNESCO — Archaeological Ruins at Moenjodaro",
          url: "https://whc.unesco.org/en/list/138/",
          desc: "Описывает городскую планировку Мохенджо-Даро, кирпичную архитектуру и археологическое значение памятника. Письменность цивилизации Инда до сих пор не прочитана общепринятым способом.",
          lang: "Английский"
        },
        {
          type: "ВСЕМИРНОЕ НАСЛЕДИЕ ЮНЕСКО",
          title: "UNESCO — Dholavira: a Harappan City",
          url: "https://whc.unesco.org/en/list/1645/",
          desc: "Показывает разнообразие харрапских городов и сложные системы водосбора в Дхолавире. Это помогает не считать Мохенджо-Даро единственной моделью поселения цивилизации Инда.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 23,
      expectedTitle: "Ведийский мир и социальная иерархия",
      sources: [
        {
          type: "ИСТОРИЧЕСКИЙ ОБЗОР",
          title: "Encyclopaedia Britannica — India: Early Vedic period",
          url: "https://www.britannica.com/place/India/Early-Vedic-period",
          desc: "Рассматривает ранние ведийские тексты, хозяйство и социальные изменения. Веды долго передавались устно и не являются прямой переписью повседневной жизни всех жителей региона.",
          lang: "Английский"
        },
        {
          type: "ОБЗОР СОЦИАЛЬНОЙ ИСТОРИИ",
          title: "Encyclopaedia Britannica — Varna",
          url: "https://www.britannica.com/topic/varna-Hinduism",
          desc: "Объясняет понятие варны и его связь с идеализированными моделями социального порядка. Нормативные схемы не следует принимать за точное описание каждой общины или неизменной практики.",
          lang: "Английский"
        }
      ]
    },
    {
      day: 24,
      expectedTitle: "Шан и Чжоу: власть, ритуал и бронза",
      sources: [
        {
          type: "ИСТОРИЧЕСКАЯ ЭНЦИКЛОПЕДИЯ",
          title: "Encyclopaedia Britannica — Shang dynasty",
          url: "https://www.britannica.com/topic/Shang-dynasty",
          desc: "Обобщает сведения о государстве Шан, бронзовых ритуальных сосудах и гадательных костях. Сохранившиеся письменные свидетельства особенно информативны о дворе и элите.",
          lang: "Английский"
        },
        {
          type: "ИСТОРИЧЕСКАЯ ЭНЦИКЛОПЕДИЯ",
          title: "Encyclopaedia Britannica — Zhou dynasty",
          url: "https://www.britannica.com/topic/Zhou-dynasty",
          desc: "Описывает смену Шан династией Чжоу и развитие идей о праве на власть. Поздние тексты могли морально оправдывать завоевание, поэтому их важно сопоставлять с датируемыми свидетельствами.",
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
    meta.researchSourcesVersion = Math.max(meta.researchSourcesVersion || 0, 3);
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
      day: 10,
      re: /cave art|prehistoric art|symbolic behavior|engraved ochre|bead necklace|shell beads|ritual site|пещерн.*искусств|наскальн.*рис|символическ.*поведен|гравиров.*охр|бусы из раковин|ритуальн.*мест/i,
      title: "Символический предмет и пределы археологической интерпретации",
      description: "Украшения, гравировки и изображения могут свидетельствовать о символическом поведении, но их точное значение часто неизвестно. Археологи сравнивают контекст находки, повторяемость мотивов, датировку и другие независимые данные, прежде чем предлагать объяснение.",
      why: "Зачем это изображение важно: оно показывает, как исследуют язык символов и возможные ритуалы без письменных объяснений. Не приписывайте древним людям конкретный миф или веру, если источник этого не подтверждает.",
      sourceUrl: "https://humanorigins.si.edu/evidence/behavior"
    },
    {
      day: 8,
      re: /neanderthal|denisovan|hominin|human evolution fossil|homo sapiens skull|днк неандерталь|неандертал|денисов|гоминин|ископаем.*череп|эволюц.*человек/i,
      title: "Ископаемые останки и древняя ДНК: разные линии доказательств",
      description: "Форма костей помогает сравнивать древние популяции, а древняя ДНК выявляет родство и эпизоды смешения. Ни один из этих типов данных сам по себе не даёт полной картины поведения, языка или самоидентификации древних людей.",
      why: "Зачем это изображение важно: оно иллюстрирует ветвящуюся эволюцию людей и контакты между разными популяциями. Сверяйте подпись с конкретным образцом и не делайте вывод о происхождении человека только по внешнему сходству черепов.",
      sourceUrl: "https://humanorigins.si.edu/evidence/genetics/ancient-dna-and-neanderthals"
    },
    {
      day: 9,
      re: /hunter.?gatherer|forager|mammoth house|paleolithic camp|stone tool|охотник.*собирател|стоянк.*палеолит|мамонт.*жилищ|палеолитическ.*стоянк/i,
      title: "Повседневность охотников-собирателей: адаптация к среде",
      description: "Орудия, очаги, жилища и пищевые остатки помогают исследовать, как люди добывали и распределяли ресурсы, перемещались и приспосабливались к условиям среды. Образ жизни сильно различался по регионам и периодам.",
      why: "Зачем это изображение важно: оно показывает повседневные решения людей, а не «примитивную ступень» на пути к земледелию. Не переносите напрямую образ жизни современных охотников-собирателей на доисторические группы без археологических подтверждений.",
      sourceUrl: "https://hraf.yale.edu/ehc/summaries/hunter-gatherers"
    },
    {
      day: 11,
      re: /shell beads|bead necklace|social network|shared symbols|symbolic artifact|раковин.*бус|бус.*раковин|социальн.*сет|символическ.*предмет|украшени.*доистор/i,
      title: "Украшения и материальные следы дальних контактов",
      description: "Украшения из раковин, найденные вдали от побережья, могут свидетельствовать о перемещении предметов и связях между группами. По одной бусине нельзя уверенно восстановить конкретные правила, мифы или устройство сообщества.",
      why: "Зачем это изображение важно: оно показывает, как общий символ или предмет мог связывать людей за пределами одной стоянки. Проверьте материал, место находки и датировку, а затем отделите подтверждённый обмен от гипотезы о его смысле.",
      sourceUrl: "https://humanorigins.si.edu/human-characteristics/social-life"
    },
    {
      day: 12,
      re: /ritual burial|grave goods|burial offering|cultic object|prehistoric burial|погребальн.*обряд|погребальн.*инвентар|ритуальн.*погребен|погребен.*неандертал|предмет.*погребен/i,
      title: "Погребение и предметы: гипотеза о ритуале",
      description: "Положение останков и сопровождающие предметы позволяют обсуждать намеренное погребение и возможные ритуалы. Однако необычное расположение находки само по себе не доказывает конкретную веру: важны контекст, датировка, тафономические процессы и сравнение с другими памятниками.",
      why: "Зачем это изображение важно: на нём можно увидеть материальные данные, из которых строят осторожную гипотезу о ритуале. Сформулируйте, что видно непосредственно, что предполагается и какие дополнительные данные помогли бы проверить объяснение.",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3272428/"
    },
    {
      day: 13,
      re: /g[oö]bekli tepe|gobekli|t-shaped pillar|pillar 43|neolithic enclosure|г[её]бекли.?тепе|т.?образн.*столб|каменн.*огражден.*неолит/i,
      title: "Гёбекли-Тепе: монументальные сооружения и резные столбы",
      description: "Круглые и прямоугольные сооружения и Т-образные известняковые столбы с рельефами относятся к докерамическому неолиту. Исследователи связывают памятник с коллективными событиями и ритуалами, но назначение отдельных изображений и пространств нельзя считать окончательно установленным.",
      why: "Зачем это изображение важно: Гёбекли-Тепе помогает проверить упрощённую схему, будто монументальное строительство возможно только после повсеместного перехода к земледелию. Сопоставьте датировку, архитектуру и осторожные формулировки археологов.",
      sourceUrl: "https://whc.unesco.org/en/list/1572/"
    },
    {
      day: 14,
      re: /religious ritual|religion and society|ritual practice|religious artifact|religious belief|sacred object|религиозн.*ритуал|религи.*общество|религиозн.*артефакт|священн.*предмет|религиозн.*верован/i,
      title: "Религиозная практика как исторический предмет исследования",
      description: "Артефакты, тексты, места поклонения и повторяющиеся действия могут помочь исследовать религиозные практики в определённом обществе. Исторический метод описывает доступные свидетельства и их контекст, а не объявляет истинными или ложными метафизические убеждения людей.",
      why: "Зачем это изображение важно: оно помогает различить социальную практику, её историческую интерпретацию и вопрос личной веры. Подпись должна назвать конкретный предмет или действие и объяснить, какие выводы подтверждены источником, а какие остаются дискуссионными.",
      sourceUrl: "https://plato.stanford.edu/entries/philosophy-religion/"
    },
    {
      day: 15,
      re: /agriculture|farming|domestication|neolithic revolution|early farmer|земледел|одомашнив|неолитическ.*поселен|первые земледельцы/i,
      title: "Первые земледельцы и одомашненные растения",
      description: "Зерновые остатки, серпы, жернова и кости домашних животных помогают исследовать переход к земледелию. Находки показывают хозяйственные практики, но не доказывают единую причину или одновременное начало земледелия во всех регионах.",
      why: "Зачем это изображение важно: оно связывает изменение образа жизни с конкретными археологическими свидетельствами. Уточните, что именно найдено — семена, орудие или останки животного — и не путайте отдельную находку с полной картиной питания общества.",
      sourceUrl: "https://www.britannica.com/event/Neolithic-Revolution"
    },
    {
      day: 16,
      re: /fertile crescent|early farming village|jericho|catalh[oö]y[uü]k|плодородн.*полумесяц|иерихон|ранн.*земледельческ.*деревн/i,
      title: "Ранние земледельческие поселения Плодородного полумесяца",
      description: "Остатки домов, хранилищ, керамики и хозяйственных орудий помогают проследить изменения в поселениях Западной Азии. Регион включал разные сообщества; не все жители сразу отказались от охоты и собирательства.",
      why: "Зачем это изображение важно: оно показывает материальную среду ранних деревень, а не условную картинку «первого фермера». Различайте оседлость, выращивание растений и полное доминирование земледелия.",
      sourceUrl: "https://www.metmuseum.org/toah/ht/02/wam.html"
    },
    {
      day: 17,
      re: /uruk|cuneiform|clay tablet|sumerian city|клинопис|шумерск.*город|табличк.*глин|урук/i,
      title: "Урук и клинописная табличка",
      description: "Глиняные таблички и остатки монументальных сооружений показывают, как городская жизнь, учёт и ремесло развивались в южной Месопотамии. Ранние записи часто связаны с хозяйственными задачами, а не с повествованием о событиях.",
      why: "Зачем это изображение важно: оно связывает письменность с управлением ресурсами и ростом города. Проверьте, относится ли табличка к ранней клинописи и что известно о её датировке и содержании.",
      sourceUrl: "https://www.britishmuseum.org/blog/how-write-cuneiform"
    },
    {
      day: 18,
      re: /hammurabi|law code|stele.*shamash|code of laws|кодекс.*хаммурапи|стела.*хаммурапи|вавилонск.*зако/i,
      title: "Стела законов Хаммурапи",
      description: "На стеле царь представлен перед божеством, а клинописный текст содержит правовые предписания. Это источник о нормах и царская репрезентация власти; он не доказывает, что каждый суд применял каждую статью одинаково.",
      why: "Зачем это изображение важно: рельеф и текст позволяют обсудить, как правитель связывал закон, справедливость и легитимность. Отличайте текст памятника от выводов о реальной судебной практике.",
      sourceUrl: "https://www.metmuseum.org/toah/ht/03/wam.html"
    },
    {
      day: 19,
      re: /nile|ancient egypt|egyptian farming|egyptian agriculture|египет.*нил|разлив.*нил|нильск.*долин|ранн.*египет/i,
      title: "Долина Нила и ранний Египет",
      description: "Плодородная пойма Нила поддерживала земледелие и связывала поселения, но государство возникло не из одной географической причины. Археологические предметы и поселения показывают долгий процесс политического объединения.",
      why: "Зачем это изображение важно: оно показывает среду, в которой развивались ранние египетские общества. Уточните, изображён ли природный ландшафт, сельскохозяйственная сцена или археологический объект.",
      sourceUrl: "https://www.britishmuseum.org/collection/galleries/early-egypt"
    },
    {
      day: 20,
      re: /bronze age|bronze tool|copper tin|trade.*diplomacy|bronze vessel|бронзов.*век|мед.*олов|ремесл.*торгов|бронзов.*оруд/i,
      title: "Бронзовые изделия и обмен между регионами",
      description: "Бронзовые сосуды, инструменты и украшения помогают исследовать литьё, специализацию ремесленников и перемещение сырья или готовых предметов. Состав металла и стиль могут указывать на связи, но не позволяют уверенно восстановить маршрут сами по себе.",
      why: "Зачем это изображение важно: предмет связывает технологию с экономикой и контактами обществ бронзового века. Сверьте материал, происхождение и датировку; похожие вещи не обязательно изготовлены в одном месте.",
      sourceUrl: "https://www.metmuseum.org/met-publications/beyond-babylon-art-trade-and-diplomacy-in-the-second-millenium-bc"
    },
    {
      day: 21,
      re: /mesopotamia.*egypt|tigris|euphrates|nile valley|river civilizations|тигр.*евфрат|речн.*цивилизац|месопотам.*египет|долин.*нил/i,
      title: "Сравнение речных обществ: Нил и Месопотамия",
      description: "Карты рек и археологические планы помогают сопоставить ландшафты Египта и Месопотамии. Обе области зависели от воды и организации труда, но различались режимами рек, политической историей и отношениями с соседями.",
      why: "Зачем это изображение важно: сравнение помогает проверить, а не просто повторить идею о «цивилизациях рек». Выделите сходства и различия и не выводите политическое устройство напрямую из географии.",
      sourceUrl: "https://www.metmuseum.org/toah/ht/02/afe.html"
    },
    {
      day: 22,
      re: /mohenjo.?daro|moenjodaro|harappa|dholavira|harappan|харапп|мохенджо|дхолавира|цивилизац.*инда/i,
      title: "Города цивилизации Инда",
      description: "Планы улиц, кирпичные здания, колодцы и водоотводы показывают продуманную городскую инфраструктуру. Из-за непрочитанной письменности многие вопросы о политической организации и языке жителей остаются открытыми.",
      why: "Зачем это изображение важно: оно показывает признаки городского планирования и позволяет сравнить разные харрапские центры. Не приписывайте памятнику конкретных правителей или законы, для которых нет надёжных свидетельств.",
      sourceUrl: "https://whc.unesco.org/en/list/138/"
    },
    {
      day: 23,
      re: /rigveda|vedic|varna|vedic society|ригвед|ведийск.*мир|варн|ранн.*индия|ведийск.*обще/i,
      title: "Ведийские тексты и социальные модели",
      description: "Ригведа и другие ведийские тексты сохранились через длительную устную передачу и отражают определённые ритуальные традиции. Они важны, но не описывают напрямую повседневность всех жителей Южной Азии.",
      why: "Зачем это изображение важно: текстовый памятник или ритуальная сцена помогает обсуждать источник, а не иллюстрирует все стороны жизни древней Индии. Различайте нормативные представления о варнах и реальную практику.",
      sourceUrl: "https://www.britannica.com/place/India/Early-Vedic-period"
    },
    {
      day: 24,
      re: /shang|zhou|oracle bone|bronze ritual vessel|шан|чжоу|гадательн.*кость|ритуальн.*бронз.*сосуд|древнекитайск.*бронз/i,
      title: "Ритуальные бронзовые сосуды и гадательные кости Шан",
      description: "Бронзовые сосуды и надписи на гадательных костях свидетельствуют о ритуалах, элитной власти и практике предсказания при дворе Шан. Они особенно информативны о правителях и ритуальных специалистах, но меньше рассказывают о повседневности большинства населения.",
      why: "Зачем это изображение важно: оно позволяет изучить материальные основания ранней китайской государственности и роль ритуала. Уточните, относится ли предмет к Шан или Чжоу, и не переносите сведения об одной династии на другую без проверки датировки.",
      sourceUrl: "https://www.britannica.com/topic/Shang-dynasty"
    }
  ];

  window.HISTORY_FOUNDATION_RESEARCH_STATS = {
    version: 3,
    lessons: packs.map(function (pack) { return pack.day; }),
    addedSourceCount: packs.reduce(function (total, pack) { return total + pack.sources.length; }, 0),
    imageNoteCount: window.HISTORY_FOUNDATION_IMAGE_NOTES.length
  };
})();
