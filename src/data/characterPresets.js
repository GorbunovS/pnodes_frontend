// === ПРЕСЕТЫ ДЛЯ ПЕРСОНАЖА ===

// === КОЖА ===
export const skinPresets = [
  // Тип кожи
  { id: 'skin_porcelain', name: 'Фарфоровая', prompt: 'porcelain skin, fair complexion, delicate' },
  { id: 'skin_fair', name: 'Светлая', prompt: 'fair skin, light complexion' },
  { id: 'skin_medium', name: 'Средняя', prompt: 'medium skin tone, warm undertone' },
  { id: 'skin_olive', name: 'Оливковая', prompt: 'olive skin, mediterranean complexion' },
  { id: 'skin_tan', name: 'Загорелая', prompt: 'tan skin, sun-kissed complexion' },
  { id: 'skin_dark', name: 'Тёмная', prompt: 'dark skin, rich deep complexion' },
  { id: 'skin_ebony', name: 'Эбонитовая', prompt: 'ebony skin, very dark complexion' },
  
  // Текстура
  { id: 'skin_smooth', name: 'Гладкая', prompt: 'smooth skin, flawless texture' },
  { id: 'skin_soft', name: 'Мягкая', prompt: 'soft skin, velvety texture' },
  { id: 'skin_high_porcelain', name: 'Высокоплотная', prompt: 'high porcelain skin, glass-like texture' },
  { id: 'skin_matte', name: 'Матовая', prompt: 'matte skin, no shine' },
  { id: 'skin_dewy', name: 'Сияющая', prompt: 'dewy skin, healthy glow' },
  { id: 'skin_freckled', name: 'Веснушчатая', prompt: 'freckled skin, scattered sun kisses' },
  
  // Детали
  { id: 'skin_youthful', name: 'Молодая', prompt: 'youthful skin, fresh appearance' },
  { id: 'skin_mature', name: 'Зрелая', prompt: 'mature skin, graceful aging' },
  { id: 'skin_scar', name: 'Шрам', prompt: 'character scar on skin, distinctive mark' },
  { id: 'skin_birthmark', name: 'Родинка', prompt: 'beauty mark, distinctive birthmark' }
]

// === НОС ===
export const nosePresets = [
  // Форма профиля
  { id: 'nose_straight', name: 'Прямой', prompt: 'straight nose, straight bridge' },
  { id: 'nose_roman', name: 'Римский (горбинка)', prompt: 'roman nose, prominent bridge, aquiline' },
  { id: 'nose_greek', name: 'Греческий', prompt: 'greek nose, straight with high bridge' },
  { id: 'nose_snub', name: 'Вздёрнутый', prompt: 'snub nose, button nose, turned up tip' },
  { id: 'nose_upturned', name: 'Приподнятый', prompt: 'upturned nose, slightly elevated tip' },
  { id: 'nose_hawk', name: 'Орлиный', prompt: 'hawk nose, prominent curved bridge' },
  
  // Кончик
  { id: 'nose_round_tip', name: 'Округлый кончик', prompt: 'round nose tip, soft contours' },
  { id: 'nose_pointed_tip', name: 'Заострённый кончик', prompt: 'pointed nose tip, defined shape' },
  { id: 'nose_bulbous', name: 'Бульбозный', prompt: 'bulbous nose tip, rounded end' },
  { id: 'nose_narrow', name: 'Узкий', prompt: 'narrow nose, thin nostrils' },
  { id: 'nose_wide', name: 'Широкий', prompt: 'wide nose, broad nostrils' },
  
  // Длина
  { id: 'nose_long', name: 'Длинный', prompt: 'long nose, elongated' },
  { id: 'nose_short', name: 'Короткий', prompt: 'short nose, compact' },
  { id: 'nose_average', name: 'Средний', prompt: 'average nose length, proportional' }
]

// === ГЛАЗА ===
export const eyesPresets = [
  // Форма
  { id: 'eyes_almond', name: 'Миндальные', prompt: 'almond shaped eyes, elegant' },
  { id: 'eyes_round', name: 'Круглые', prompt: 'round eyes, wide open' },
  { id: 'eyes_hooded', name: 'С нависшим веком', prompt: 'hooded eyes, mysterious' },
  { id: 'eyes_monolid', name: 'Монолид', prompt: 'monolid eyes, sleek eyelid' },
  { id: 'eyes_downturned', name: 'Опущенные', prompt: 'downturned eyes, gentle slope' },
  { id: 'eyes_upturned', name: 'Приподнятые', prompt: 'upturned eyes, cat-like' },
  { id: 'eyes_deep_set', name: 'Глубоко посаженные', prompt: 'deep set eyes, prominent brow' },
  
  // Размер
  { id: 'eyes_large', name: 'Большие', prompt: 'large eyes, expressive' },
  { id: 'eyes_small', name: 'Маленькие', prompt: 'small eyes, delicate' },
  { id: 'eyes_average', name: 'Средние', prompt: 'average eye size' },
  
  // Цвет (описательный)
  { id: 'eyes_brown', name: 'Карие', prompt: 'brown eyes, warm' },
  { id: 'eyes_hazel', name: 'Ореховые', prompt: 'hazel eyes, golden-green' },
  { id: 'eyes_green', name: 'Зелёные', prompt: 'green eyes, emerald' },
  { id: 'eyes_blue', name: 'Голубые', prompt: 'blue eyes, ice blue' },
  { id: 'eyes_gray', name: 'Серые', prompt: 'gray eyes, stormy' },
  { id: 'eyes_amber', name: 'Янтарные', prompt: 'amber eyes, golden honey' },
  
  // Особенности
  { id: 'eyes_doe', name: 'Оленьи (добрые)', prompt: 'doe eyes, innocent, wide' },
  { id: 'eyes_fox', name: 'Лисьи (хитрые)', prompt: 'fox eyes, sharp, cunning' },
  { id: 'eyes_sleepy', name: 'Сонные', prompt: 'sleepy eyes, heavy lids' },
  { id: 'eyes_intense', name: 'Пронзительные', prompt: 'intense eyes, piercing gaze' }
]

// === ГУБЫ / РОТ ===
export const mouthPresets = [
  // Форма
  { id: 'lips_heart', name: 'Сердечком', prompt: 'heart shaped lips, cupid bow' },
  { id: 'lips_full', name: 'Пухлые', prompt: 'full lips, plump, voluminous' },
  { id: 'lips_heavy_lower', name: 'С нижней потолще', prompt: 'heavy lower lip, pouty' },
  { id: 'lips_heavy_upper', name: 'С верхней потолще', prompt: 'heavy upper lip, pronounced' },
  { id: 'lips_thin', name: 'Тонкие', prompt: 'thin lips, refined' },
  { id: 'lips_balanced', name: 'Сбалансированные', prompt: 'balanced lips, proportional' },
  { id: 'lips_wide', name: 'Широкий рот', prompt: 'wide mouth, broad smile' },
  { id: 'lips_small', name: 'Маленький рот', prompt: 'small mouth, petite lips' },
  
  // Тип
  { id: 'lips_dry', name: 'Матовые', prompt: 'matte lips, dry texture' },
  { id: 'lips_glossy', name: 'Глянцевые', prompt: 'glossy lips, wet look' },
  { id: 'lips_natural', name: 'Естественные', prompt: 'natural lips, soft pink' },
  { id: 'lips_pale', name: 'Бледные', prompt: 'pale lips, nude' },
  { id: 'lips_dark', name: 'Тёмные', prompt: 'dark lips, deep color' },
  
  // Детали
  { id: 'lips_crooked_smile', name: 'Кривая улыбка', prompt: 'crooked smile, charming asymmetry' },
  { id: 'lips_smile_lines', name: 'Морщинки от улыбки', prompt: 'smile lines, laugh wrinkles' },
  { id: 'lips_gold_tooth', name: 'Золотой зуб', prompt: 'single gold tooth, distinctive' }
]

// === ВОЛОСЫ ===
export const hairPresets = [
  // Длина
  { id: 'hair_long', name: 'Длинные', prompt: 'long hair, flowing' },
  { id: 'hair_medium', name: 'Средние', prompt: 'medium length hair, shoulder length' },
  { id: 'hair_short', name: 'Короткие', prompt: 'short hair, cropped' },
  { id: 'hair_buzz', name: 'Ежик', prompt: 'buzz cut, very short' },
  { id: 'hair_bald', name: 'Лысый', prompt: 'bald, shaved head' },
  
  // Цвет
  { id: 'hair_blonde', name: 'Блонд', prompt: 'blonde hair, golden' },
  { id: 'hair_platinum', name: 'Платиновый блонд', prompt: 'platinum blonde, almost white' },
  { id: 'hair_brown', name: 'Шатен', prompt: 'brown hair, chestnut' },
  { id: 'hair_dark_brown', name: 'Тёмно-каштановый', prompt: 'dark brown hair, chocolate' },
  { id: 'hair_black', name: 'Чёрные', prompt: 'black hair, jet black' },
  { id: 'hair_red', name: 'Рыжие', prompt: 'red hair, ginger' },
  { id: 'hair_auburn', name: 'Каштан-рыжий', prompt: 'auburn hair, reddish brown' },
  { id: 'hair_gray', name: 'Седые', prompt: 'gray hair, silver' },
  { id: 'hair_white', name: 'Белые', prompt: 'white hair, snow white' },
  { id: 'hair_unnatural', name: 'Неестественный цвет', prompt: 'unnatural hair color, dyed' },
  
  // Текстура
  { id: 'hair_straight', name: 'Прямые', prompt: 'straight hair, sleek' },
  { id: 'hair_wavy', name: 'Волнистые', prompt: 'wavy hair, beach waves' },
  { id: 'hair_curly', name: 'Кудрявые', prompt: 'curly hair, ringlets' },
  { id: 'hair_coily', name: 'Афро-кудри', prompt: 'coily hair, tight curls' },
  { id: 'hair_frizzy', name: 'Пушистые', prompt: 'frizzy hair, voluminous' },
  
  // Стиль
  { id: 'hair_slicked', name: 'Зачёсанные назад', prompt: 'slicked back hair, gelled' },
  { id: 'hair_ponytail', name: 'Хвост', prompt: 'ponytail, tied back' },
  { id: 'hair_bun', name: 'Пучок', prompt: 'hair bun, elegant updo' },
  { id: 'hair_braided', name: 'Коса/плетение', prompt: 'braided hair, intricate' },
  { id: 'hair_messy', name: 'Растрёпанные', prompt: 'messy hair, tousled' },
  { id: 'hair_undercut', name: 'Андеркат', prompt: 'undercut, shaved sides' },
  
  // Детали
  { id: 'hair_dark_roots', name: 'Тёмные корни', prompt: 'dark roots, grown out' },
  { id: 'hair_highlights', name: 'Мелирование', prompt: 'highlighted hair, streaks' },
  { id: 'hair_balayage', name: 'Балаяж', prompt: 'balayage, gradient color' },
  { id: 'hair_bangs', name: 'Чёлка', prompt: 'bangs, fringe' }
]

// === ПЕРСОНАЖ (основная нода) ===
export const characterMainPresets = {
  // Пол
  gender: [
    { id: 'gender_male', name: 'Мужской', prompt: 'male character, masculine' },
    { id: 'gender_female', name: 'Женский', prompt: 'female character, feminine' },
    { id: 'gender_androgynous', name: 'Андрогинный', prompt: 'androgynous appearance, gender neutral' }
  ],
  
  // Возраст (числовой ввод, но есть пресеты)
  ageGroup: [
    { id: 'age_child', name: 'Ребёнок (0-12)', prompt: 'child, young, youthful face' },
    { id: 'age_teen', name: 'Подросток (13-19)', prompt: 'teenager, adolescent' },
    { id: 'age_young_adult', name: 'Молодой (20-30)', prompt: 'young adult, prime age' },
    { id: 'age_adult', name: 'Взрослый (30-50)', prompt: 'adult, mature' },
    { id: 'age_middle', name: 'Средний (50-65)', prompt: 'middle aged, distinguished' },
    { id: 'age_elderly', name: 'Пожилой (65+)', prompt: 'elderly, aged, wise appearance' }
  ],
  
  // Телосложение
  build: [
    { id: 'build_petite', name: 'Миниатюрное', prompt: 'petite build, small frame' },
    { id: 'build_slim', name: 'Стройное', prompt: 'slim build, lean' },
    { id: 'build_athletic', name: 'Атлетичное', prompt: 'athletic build, muscular' },
    { id: 'build_average', name: 'Среднее', prompt: 'average build, normal' },
    { id: 'build_heavy', name: 'Крупное', prompt: 'heavy build, large frame' },
    { id: 'build_muscular', name: 'Мускулистое', prompt: 'muscular build, buff' }
  ],
  
  // Этнические черты
  ethnicity: [
    { id: 'ethnic_caucasian', name: 'Европейские', prompt: 'caucasian features' },
    { id: 'ethnic_asian', name: 'Азиатские', prompt: 'asian features' },
    { id: 'ethnic_african', name: 'Африканские', prompt: 'african features' },
    { id: 'ethnic_latino', name: 'Латиноамериканские', prompt: 'latino features' },
    { id: 'ethnic_indian', name: 'Индийские', prompt: 'indian features' },
    { id: 'ethnic_middle_eastern', name: 'Ближневосточные', prompt: 'middle eastern features' },
    { id: 'ethnic_mixed', name: 'Смешанные', prompt: 'mixed ethnicity features' }
  ]
}
