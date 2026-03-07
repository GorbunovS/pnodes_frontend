// === ПРЕСЕТЫ ДЛЯ НОДОВОГО КОНСТРУКТОРА ПРОМПТОВ ===
// Исследование проведено по: Civitai, PromptHero, Higgsfield, OpenArt, Gemini3 Prompt
// Структура сохранена, промты улучшены для максимальной эффективности

// === LIGHTING (Свет) ===
export const lightingPresets = {
  // Искусственный свет
  artificial: [
    { id: 'neon', name: 'Неоновые вывески', prompt: 'neon lighting, vibrant magenta and cyan glow, cyberpunk atmosphere, edge lighting, reflective surfaces' },
    { id: 'city_night', name: 'Огни ночного города', prompt: 'city night ambient lighting, bokeh street lights, sodium vapor orange glow, urban atmosphere' },
    { id: 'candlelight', name: 'Свет от свечи', prompt: 'warm candlelight, flickering flame glow, chiaroscuro lighting, intimate atmosphere, fire illumination' },
    { id: 'projector_gobo', name: 'Проектор с Гобо', prompt: 'projector gobo patterns, theatrical light, patterned shadows, dramatic spotlight effect' },
    { id: 'led_panel', name: 'LED панель', prompt: 'LED panel light, adjustable color temperature, even illumination, professional studio lighting' },
    { id: 'rgb_lighting', name: 'RGB подсветка', prompt: 'RGB colored lighting, creative color mix, gradient light wash, atmospheric colored glow' },
    { id: 'sodium_vapor', name: 'Натриевые фонари', prompt: 'sodium vapor lighting, distinct orange streetlight glow, gritty urban night, industrial atmosphere' },
    { id: 'blacklight_uv', name: 'Ультрафиолет', prompt: 'ultraviolet blacklight, UV reactive glow, fluorescent colors, deep purple ambient, neon accents' }
  ],
  
  // Студийный свет
  studio: [
    { id: 'softbox', name: 'Софтбокс', prompt: 'softbox lighting, soft diffused light, no harsh shadows, gentle wrap-around illumination' },
    { id: 'beauty_dish', name: 'Портретная тарелка', prompt: 'beauty dish lighting, fashion photography setup, crisp shadows with soft edges, glamorous portrait light' },
    { id: 'ring_light', name: 'Кольцевая лампа', prompt: 'ring light, frontal even illumination, circular catchlights in eyes, beauty lighting' },
    { id: 'octabox', name: 'Октобокс', prompt: 'large octabox, very soft wrap-around light, flattering portrait illumination, minimal shadows' },
    { id: 'umbrella', name: 'Зонт', prompt: 'umbrella lighting, broad soft light, even coverage, classic portrait setup' },
    { id: 'strip_softbox', name: 'Полосовой софтбокс', prompt: 'strip softbox, narrow soft light, edge lighting, rim light effect, dramatic side illumination' },
    { id: 'para_beauty', name: 'Параболический софтбокс', prompt: 'parabolic softbox, focused soft light, long throw illumination, fashion photography lighting' }
  ],
  
  // Схемы света (setup)
  setup: [
    { id: 'rembrandt', name: 'Схема Рембрандт', prompt: 'Rembrandt lighting, dramatic portrait setup, triangle highlight on cheek, chiaroscuro effect, classical painting light' },
    { id: 'butterfly', name: 'Схема Бабочка', prompt: 'butterfly lighting, glamour setup, butterfly shadow under nose, beauty photography, symmetrical frontal light' },
    { id: 'clamshell', name: 'Схема Ракушка', prompt: 'clamshell lighting, two-source setup, flat even light, beauty portrait, minimal shadows' },
    { id: 'split', name: 'Сплит (разделение)', prompt: 'split lighting, half face light half shadow, dramatic contrast, film noir style, edgy portrait' },
    { id: 'loop', name: 'Петля (Loop)', prompt: 'loop lighting, small nose shadow, classic portrait setup, professional headshot lighting' },
    { id: 'rim_light', name: 'Контровой', prompt: 'rim backlight, edge light silhouette, hair light, subject separation, dramatic outline' },
    { id: ' Paramount', name: 'Парамаунт', prompt: 'Paramount lighting, butterfly setup with elevated key, classic Hollywood glamour, dramatic shadows' }
  ],
  
  // Направление света
  direction: [
    { id: 'frontal', name: 'Фронтальный', prompt: 'frontal lighting, flat illumination, minimal shadows, even coverage, straightforward portrait light' },
    { id: 'frontal_up', name: 'Фронтально-верхний 45°', prompt: '45-degree butterfly lighting, above camera position, flattering portrait angle, professional setup' },
    { id: 'side_90', name: 'Боковой 90°', prompt: 'side lighting 90 degrees, dramatic half shadow, split face effect, edgy dramatic portrait' },
    { id: 'side_45', name: 'Боковой 45°', prompt: 'side lighting 45 degrees, three-quarter view, Rembrandt style, classic portrait angle' },
    { id: 'top_down', name: 'Верхний', prompt: 'top-down lighting, overhead light, eye sockets shadow, mysterious mood, dramatic downward light' },
    { id: 'bottom_up', name: 'Нижний', prompt: 'bottom-up lighting, horror style, unnatural shadows, under-chin light, spooky atmosphere' },
    { id: 'backlight', name: 'Подсветка сзади', prompt: 'backlight, hair light, atmospheric glow, rim illumination, subject separation' },
    { id: 'three_point', name: 'Трёхточечный', prompt: 'three-point lighting, key fill and rim light, professional studio setup, balanced illumination' }
  ],
  
  // Качество света
  quality: [
    { id: 'soft_diffused', name: 'Мягкий рассеянный', prompt: 'soft diffused light, blurry shadows, gentle transition, overcast quality, flattering illumination' },
    { id: 'hard_specular', name: 'Жёсткий с бликами', prompt: 'hard specular light, sharp shadows, crisp edges, direct sunlight quality, dramatic contrast' },
    { id: 'balanced', name: 'Сбалансированный', prompt: 'balanced lighting, moderate shadows, natural look, professional even illumination' },
    { id: 'high_contrast', name: 'Высококонтрастный', prompt: 'high contrast lighting, deep shadows, dramatic chiaroscuro, bold light and dark' },
    { id: 'low_contrast', name: 'Низкоконтрастный', prompt: 'low contrast flat lighting, minimal shadows, even tone, soft atmospheric light' },
    { id: 'volumetric', name: 'Объёмный (туман)', prompt: 'volumetric lighting, light rays through haze, atmospheric god rays, dusty air illumination' }
  ],
  
  // Естественный свет
  natural: [
    { id: 'golden_hour', name: 'Золотой час', prompt: 'golden hour lighting, warm sunset glow, long shadows, orange amber tones, magical hour light' },
    { id: 'blue_hour', name: 'Синий час', prompt: 'blue hour lighting, cool twilight, soft shadows, deep blue tones, dusk atmosphere' },
    { id: 'midday_sun', name: 'Яркое полуденное солнце', prompt: 'harsh midday sun, strong shadows, overhead light, high contrast, bright direct sunlight' },
    { id: 'overcast', name: 'Пасмурный день', prompt: 'soft overcast lighting, diffused clouds, no harsh shadows, even natural light, muted tones' },
    { id: 'window_light', name: 'Свет от окна', prompt: 'soft window light, natural illumination, directional diffused light, gentle shadows' },
    { id: 'dappled', name: 'Пятнистый свет', prompt: 'dappled light through foliage, patterned shadows, tree canopy light, natural filtering' },
    { id: 'open_shade', name: 'Открытая тень', prompt: 'open shade, soft even lighting, no direct sun, flattering outdoor light, neutral tones' },
    { id: 'fog_mist', name: 'Туман/Дымка', prompt: 'foggy mist lighting, atmospheric haze, diffused glow, ethereal atmosphere, soft ambient light' },
    { id: 'bioluminescence', name: 'Биолюминесценция', prompt: 'bioluminescence, glowing plants, organic neon light, deep blue night, magical atmosphere' }
  ]
}

// === CAMERA (Камеры) ===
export const cameraPresets = {
  // Типы камер / Фокусные расстояния
  camera: [
    { id: 'portrait_85mm', name: 'Портрет 85mm f/1.8', prompt: '85mm lens portrait, f1.8 aperture, shallow depth of field, creamy bokeh, natural facial proportions, professional portrait lens' },
    { id: 'portrait_105mm', name: 'Портрет 105mm f/2', prompt: '105mm telephoto portrait, f2.0, background compression, soft bokeh, flattering perspective' },
    { id: 'cinematic_50mm', name: 'Кино 50mm f/1.4', prompt: '50mm cinematic lens, f1.4, filmic perspective, soft rolloff, standard focal length, versatile portrait' },
    { id: 'anamorphic_40mm', name: 'Анаморфный 40mm', prompt: 'anamorphic 40mm lens, widescreen cinematic, horizontal lens flares, oval bokeh, 2.39:1 aspect ratio' },
    { id: 'wide_24mm', name: 'Широкий 24mm', prompt: '24mm wide angle, environmental portrait, deep perspective, expansive scene, slight distortion' },
    { id: 'street_35mm', name: 'Стрит 35mm', prompt: '35mm street photography, natural perspective, realistic proportions, documentary style, versatile focal length' },
    { id: 'tele_135mm', name: 'Теле 135mm', prompt: '135mm telephoto, compressed background, dramatic perspective, portrait lens, shallow depth of field' },
    { id: 'macro_100mm', name: 'Макро 100mm', prompt: '100mm macro lens, extreme detail, beauty close-up, 1:1 magnification, sharp fine details' },
    { id: 'super_tele_200mm', name: 'Супер-теле 200mm', prompt: '200mm telephoto, extreme compression, isolated subject, sports photography look, creamy bokeh' }
  ],
  
  // Линзы / Оптика
  lens: [
    { id: 'bokeh_creamy', name: 'Кремовое боке', prompt: 'creamy bokeh, smooth background blur, circular highlights, pleasing out-of-focus areas, lens character' },
    { id: 'bokeh_busy', name: 'Плотное боке', prompt: 'busy bokeh, swirling background, soap bubble bokeh, character lens, vintage rendering' },
    { id: 'lens_vintage', name: 'Винтажная оптика', prompt: 'vintage lens rendering, soft glow, subtle chromatic aberration, lens character, film era optics' },
    { id: 'lens_modern', name: 'Современная оптика', prompt: 'modern sharp lens, crisp detail, clean rendering, high resolution optics, clinical precision' },
    { id: 'lens_tilt', name: 'Tilt-Shift', prompt: 'tilt-shift effect, selective focus plane, miniature look, Scheimpflug principle, toy-like scene' },
    { id: 'lens_fisheye', name: 'Рыбий глаз', prompt: 'fisheye lens, ultra wide 180 degree, barrel distortion, extreme perspective, hemispherical view' },
    { id: 'lens_pinhole', name: 'Пинхол', prompt: 'pinhole camera effect, infinite depth of field, soft focus, no lens distortion, dreamy quality' },
    { id: 'lens_petzval', name: 'Петцваль', prompt: 'Petzval lens, swirly bokeh, vintage portrait lens, center sharpness, artistic edge falloff' }
  ],
  
  // Фильмы / Эмуляция
  film: [
    { id: 'kodak_portra', name: 'Kodak Portra 400', prompt: 'Kodak Portra 400 film, warm skin tones, fine grain, professional color negative, soft contrast' },
    { id: 'kodak_gold', name: 'Kodak Gold 200', prompt: 'Kodak Gold 200 film, warm saturated colors, vintage look, consumer film aesthetic, nostalgic tones' },
    { id: 'fuji_velvia', name: 'Fuji Velvia 50', prompt: 'Fuji Velvia 50 film, vivid saturated colors, high contrast, slide film look, punchy tones' },
    { id: 'fuji_pro400h', name: 'Fuji Pro 400H', prompt: 'Fuji Pro 400H film, cool tones, professional portrait film, subtle colors, smooth grain' },
    { id: 'ilford_hp5', name: 'Ilford HP5 Plus', prompt: 'Ilford HP5 Plus black and white, classic monochrome, rich tonal range, documentary style' },
    { id: 'cinestill_800t', name: 'CineStill 800T', prompt: 'CineStill 800T film, tungsten balanced, halation effect, cinematic look, night photography film' }
  ]
}

// === ENVIRONMENT (Окружение) ===
export const environmentPresets = {
  // Студии
  studio: [
    { id: 'studio_white', name: 'Белая студия', prompt: 'white cyclorama studio, seamless white background, clean minimal space, professional photography studio' },
    { id: 'studio_black', name: 'Чёрная студия', prompt: 'black studio, dark background, dramatic void, moody professional space, low key setup' },
    { id: 'studio_grey', name: 'Серая студия', prompt: 'grey background studio, neutral tone, versatile backdrop, professional middle gray' },
    { id: 'studio_infinite', name: 'Бесконечность', prompt: 'infinite white background, seamless floor, no horizon line, floating effect, clean studio' },
    { id: 'studio_colored', name: 'Цветная студия', prompt: 'colored backdrop studio, solid color background, vibrant seamless paper, fashion studio setup' },
    { id: 'studio_gradient', name: 'Градиентная студия', prompt: 'gradient backdrop studio, smooth color transition, artistic background, modern studio setup' }
  ],
  
  // Интерьеры
  interior: [
    { id: 'loft', name: 'Лофт', prompt: 'loft interior, industrial space, exposed brick walls, large factory windows, high ceilings, urban living' },
    { id: 'modern_apartment', name: 'Современная квартира', prompt: 'modern apartment interior, minimal design, clean lines, contemporary furniture, neutral palette' },
    { id: 'classic_room', name: 'Классическая комната', prompt: 'classic interior, elegant furniture, warm wood tones, traditional decor, timeless atmosphere' },
    { id: 'office', name: 'Офис', prompt: 'office interior, professional workspace, corporate environment, modern desk setup, business atmosphere' },
    { id: 'cafe', name: 'Кафе', prompt: 'cafe interior, cozy atmosphere, ambient lighting, coffee shop vibe, warm inviting space' },
    { id: 'library', name: 'Библиотека', prompt: 'library interior, bookshelves, warm wood, quiet atmosphere, academic setting, reading space' },
    { id: 'kitchen', name: 'Кухня', prompt: 'modern kitchen interior, clean countertops, natural light, domestic setting, food photography space' }
  ],
  
  // Экстерьеры
  exterior: [
    { id: 'urban_street', name: 'Городская улица', prompt: 'urban street scene, city environment, buildings background, metropolitan atmosphere, street photography' },
    { id: 'urban_night', name: 'Ночной город', prompt: 'city night, neon lights, urban atmosphere, street illumination, nightlife scene' },
    { id: 'park', name: 'Парк', prompt: 'park setting, trees and greenery, nature in city, outdoor recreational space, garden atmosphere' },
    { id: 'beach', name: 'Пляж', prompt: 'beach setting, sand and sea, open sky, coastal atmosphere, shoreline environment' },
    { id: 'forest', name: 'Лес', prompt: 'forest environment, trees and foliage, natural woodland setting, outdoor nature scene' },
    { id: 'desert', name: 'Пустыня', prompt: 'desert landscape, sand dunes, arid environment, dramatic sky, vast open space' },
    { id: 'mountain', name: 'Горы', prompt: 'mountain landscape, alpine scenery, dramatic peaks, outdoor adventure setting, majestic views' }
  ],
  
  // Специальные локации
  special: [
    { id: 'sci_fi_lab', name: 'Sci-Fi лаборатория', prompt: 'sci-fi laboratory, futuristic high-tech interior, clean white surfaces, holographic displays, advanced technology' },
    { id: 'industrial', name: 'Индустриальная', prompt: 'industrial location, factory warehouse, gritty atmosphere, metal structures, urban decay' },
    { id: 'theater', name: 'Театр/Сцена', prompt: 'theater stage, velvet curtains, dramatic setting, spotlight atmosphere, performance space' },
    { id: 'outdoor_nature', name: 'Природа', prompt: 'natural outdoor setting, landscape background, scenic environment, wilderness atmosphere' },
    { id: 'rooftop', name: 'Крыша', prompt: 'rooftop setting, city skyline view, open air, urban heights, panoramic background' },
    { id: 'cyberpunk_alley', name: 'Киберпанк переулок', prompt: 'cyberpunk alley, rain-soaked street, neon signs, futuristic urban, dystopian atmosphere' },
    { id: 'space_station', name: 'Космическая станция', prompt: 'space station interior, zero gravity environment, sci-fi corridor, futuristic spacecraft, cosmic view' }
  ]
}

// === STYLE (Стиль) ===
export const stylePresets = {
  digital: [
    { id: 'photorealistic', name: 'Фотореализм', prompt: 'photorealistic, hyper detailed, 8k resolution, lifelike rendering, professional photography quality, ultra sharp' },
    { id: 'digital_art', name: 'Digital Art', prompt: 'digital art, detailed illustration, professional digital painting, concept art quality, polished finish' },
    { id: 'concept_art', name: 'Concept Art', prompt: 'concept art, design focused, artstation quality, visual development, professional game art' },
    { id: '3d_render', name: '3D Render', prompt: '3D render, octane render, blender, perfect lighting, CG quality, physically based rendering' },
    { id: 'unreal_engine', name: 'Unreal Engine', prompt: 'Unreal Engine 5 render, ray tracing, photorealistic game graphics, lumen lighting, high fidelity' }
  ],
  
  traditional: [
    { id: 'oil_painting', name: 'Масляная живопись', prompt: 'oil painting, traditional art, visible brushstrokes, canvas texture, impasto technique, rich colors' },
    { id: 'watercolor', name: 'Акварель', prompt: 'watercolor painting, soft edges, paper texture, flowing pigments, translucent layers, delicate washes' },
    { id: 'pencil', name: 'Карандаш', prompt: 'pencil sketch, graphite drawing, line art, monochrome, detailed shading, artistic illustration' },
    { id: 'charcoal', name: 'Уголь', prompt: 'charcoal drawing, bold expressive strokes, high contrast, sketch style, textured marks, dramatic shadows' },
    { id: 'pastel', name: 'Пастель', prompt: 'pastel painting, soft powdery texture, blended colors, delicate tones, impressionistic style' }
  ],
  
  stylized: [
    { id: 'anime', name: 'Аниме', prompt: 'anime style, clean lineart, soft cel shading, expressive features, Japanese animation aesthetic' },
    { id: 'comic', name: 'Комикс', prompt: 'comic book style, bold outlines, vibrant colors, dynamic composition, graphic novel aesthetic' },
    { id: 'pixel_art', name: 'Pixel Art', prompt: 'pixel art, retro game aesthetic, limited palette, crisp pixels, 8-bit or 16-bit style' },
    { id: 'vector', name: 'Вектор', prompt: 'vector art, flat colors, clean shapes, graphic design, scalable illustration, bold minimal style' },
    { id: 'low_poly', name: 'Low Poly', prompt: 'low poly 3D, geometric shapes, faceted surfaces, stylized minimal 3D, game art aesthetic' }
  ],
  
  cinematic: [
    { id: 'cinematic', name: 'Кинематографичный', prompt: 'cinematic, film grain, color graded, movie still, anamorphic lens, professional cinematography' },
    { id: 'film_noir', name: 'Нуар', prompt: 'film noir, high contrast black and white, dramatic shadows, crime thriller aesthetic, classic Hollywood' },
    { id: 'vintage', name: 'Винтаж', prompt: 'vintage photo, sepia tone, aged photograph, retro aesthetic, nostalgic film look' },
    { id: 'cyberpunk', name: 'Киберпанк', prompt: 'cyberpunk, neon lights, dystopian future, high tech low life, rain-soaked streets, futuristic urban' },
    { id: 'retro_80s', name: 'Ретро 80s', prompt: '1980s aesthetic, synthwave, retro futurism, neon colors, VHS grain, nostalgic 80s vibe' },
    { id: 'teal_orange', name: 'Teal & Orange', prompt: 'teal and orange color grading, cinematic look, complementary colors, blockbuster film style, professional grade' }
  ],
  
  artistic: [
    { id: 'impressionism', name: 'Импрессионизм', prompt: 'impressionist painting, visible brushstrokes, light and color focus, Monet style, atmospheric effect' },
    { id: 'surrealism', name: 'Сюрреализм', prompt: 'surrealist art, dreamlike imagery, unexpected juxtapositions, subconscious exploration, Dalí style' },
    { id: 'minimalist', name: 'Минимализм', prompt: 'minimalist art, simple forms, negative space, limited palette, essential elements only, clean aesthetic' },
    { id: 'abstract', name: 'Абстракция', prompt: 'abstract art, non-representational, geometric shapes, color and form focus, expressive composition' },
    { id: 'double_exposure', name: 'Двойная экспозиция', prompt: 'double exposure, layered images, silhouette blend, artistic overlay, dreamlike composition' }
  ]
}

// === MOOD (Настроение) ===
export const moodPresets = {
  emotion: [
    { id: 'calm', name: 'Спокойное', prompt: 'calm serene atmosphere, peaceful mood, tranquil setting, gentle lighting, relaxed vibe' },
    { id: 'dramatic', name: 'Драматичное', prompt: 'dramatic intense atmosphere, emotional tension, high contrast, powerful mood, cinematic drama' },
    { id: 'mysterious', name: 'Загадочное', prompt: 'mysterious enigmatic atmosphere, intrigue, moody shadows, unknown quality, suspenseful mood' },
    { id: 'joyful', name: 'Радостное', prompt: 'joyful happy atmosphere, positive energy, bright colors, uplifting mood, cheerful setting' },
    { id: 'melancholic', name: 'Меланхоличное', prompt: 'melancholic mood, nostalgic atmosphere, contemplative, bittersweet feeling, reflective emotion' },
    { id: 'epic', name: 'Эпичное', prompt: 'epic grand atmosphere, awe-inspiring, powerful scale, majestic feeling, cinematic scope' },
    { id: 'intimate', name: 'Интимное', prompt: 'intimate atmosphere, close personal feeling, warm connection, private moment, emotional closeness' },
    { id: 'tense', name: 'Напряжённое', prompt: 'tense atmosphere, suspenseful anxious mood, anticipation, thriller feeling, uneasy tension' },
    { id: 'romantic', name: 'Романтичное', prompt: 'romantic atmosphere, love and passion, soft warm lighting, dreamy mood, affectionate feeling' },
    { id: 'eerie', name: 'Жуткое', prompt: 'eerie unsettling atmosphere, creepy mood, supernatural feeling, ominous presence, haunting vibe' }
  ]
}

// === COMPOSITION (Композиция) ===
export const compositionPresets = {
  framing: [
    { id: 'rule_of_thirds', name: 'Правило третей', prompt: 'rule of thirds composition, off-center subject, dynamic placement, professional framing, balanced asymmetry' },
    { id: 'centered', name: 'Центрированная', prompt: 'centered composition, symmetrical subject, direct focus, formal framing, balanced center' },
    { id: 'golden_ratio', name: 'Золотое сечение', prompt: 'golden ratio composition, fibonacci spiral, harmonious proportions, aesthetically pleasing placement' },
    { id: 'leading_lines', name: 'Ведущие линии', prompt: 'leading lines composition, converging perspective, depth and flow, guiding eye to subject' },
    { id: 'symmetry', name: 'Симметрия', prompt: 'symmetrical composition, mirror balance, perfect alignment, formal order, harmonious reflection' },
    { id: 'negative_space', name: 'Негативное пространство', prompt: 'negative space dominant, minimalist composition, subject isolation, breathing room, clean aesthetic' }
  ],
  
  shot_type: [
    { id: 'close_up', name: 'Крупный план', prompt: 'close-up shot, intimate framing, detail focus, facial features, emotional intensity' },
    { id: 'medium_shot', name: 'Средний план', prompt: 'medium shot, waist up framing, balanced composition, conversational distance, standard portrait' },
    { id: 'full_body', name: 'В полный рост', prompt: 'full body shot, complete figure, environmental context, fashion framing, entire subject' },
    { id: 'wide_shot', name: 'Широкий план', prompt: 'wide shot, environmental framing, scene establishment, location context, expansive view' },
    { id: 'extreme_close', name: 'Экстремальный крупный', prompt: 'extreme close-up, detail macro, texture focus, abstract framing, intense detail' },
    { id: 'over_shoulder', name: 'Через плечо', prompt: 'over the shoulder shot, perspective framing, conversation setup, cinematic angle, subject view' }
  ],
  
  angle: [
    { id: 'eye_level', name: 'На уровне глаз', prompt: 'eye level angle, neutral perspective, direct connection, standard viewpoint, natural framing' },
    { id: 'low_angle', name: 'Снизу вверх', prompt: 'low angle shot, looking up, heroic perspective, powerful subject, dramatic elevation' },
    { id: 'high_angle', name: 'Сверху вниз', prompt: 'high angle shot, looking down, overhead perspective, diminished subject, bird eye view' },
    { id: 'dutch_angle', name: 'Голландский угол', prompt: 'dutch angle, tilted horizon, dynamic tension, unsettling mood, diagonal composition' },
    { id: 'aerial', name: 'Аэрофотография', prompt: 'aerial view, bird perspective, top-down angle, drone photography, overhead landscape' }
  ]
}

// === QUALITY (Качество) ===
export const qualityPresets = {
  resolution: [
    { id: '8k', name: '8K Ultra HD', prompt: '8k resolution, ultra high definition, maximum detail, crisp sharpness, premium quality' },
    { id: '4k', name: '4K HD', prompt: '4k resolution, high definition, excellent detail, professional quality, sharp rendering' },
    { id: 'hd', name: 'HD', prompt: 'high definition, good detail, standard quality, clear rendering' }
  ],
  
  detail: [
    { id: 'hyper_detailed', name: 'Гипер-детализация', prompt: 'hyper detailed, intricate details, fine textures, maximum complexity, elaborate rendering' },
    { id: 'highly_detailed', name: 'Высокая детализация', prompt: 'highly detailed, rich textures, clear elements, professional quality, sharp features' },
    { id: 'moderate_detail', name: 'Умеренная детализация', prompt: 'moderate detail, balanced complexity, clean rendering, clear without overwhelming' }
  ],
  
  effects: [
    { id: 'lens_flare', name: 'Блик объектива', prompt: 'lens flare, anamorphic streak, light bloom, cinematic flare effect, optical artifact' },
    { id: 'chromatic_aberration', name: 'Хроматическая аберрация', prompt: 'subtle chromatic aberration, color fringing, lens artifact, vintage optical effect, edge color shift' },
    { id: 'film_grain', name: 'Зернистость плёнки', prompt: 'film grain, photographic texture, analog noise, cinematic grain, vintage film look' },
    { id: 'vignette', name: 'Виньетка', prompt: 'vignette effect, darkened edges, focus on center, classic portrait framing, subtle edge darkening' },
    { id: 'motion_blur', name: 'Размытие движения', prompt: 'motion blur, dynamic movement, speed effect, action streak, kinetic energy' }
  ]
}

// === CHARACTER (Персонаж) ===
export const characterPresets = {
  // Типы портретов
  portrait_type: [
    { id: 'fashion', name: 'Модный', prompt: 'fashion portrait, editorial style, high-end photography, stylish pose, magazine quality' },
    { id: 'beauty', name: 'Бьюти', prompt: 'beauty portrait, flawless skin, makeup focus, glamorous lighting, cosmetic photography' },
    { id: 'headshot', name: 'Хэдшот', prompt: 'professional headshot, corporate portrait, clean background, approachable expression, business photo' },
    { id: 'environmental', name: 'Экологический', prompt: 'environmental portrait, subject in context, storytelling composition, location integrated, lifestyle photography' },
    { id: 'character', name: 'Характерный', prompt: 'character portrait, personality expression, distinctive features, authentic emotion, individual character' }
  ],
  
  // Возраст
  age: [
    { id: 'child', name: 'Ребёнок', prompt: 'child portrait, young age, innocent expression, youthful features, childhood moment' },
    { id: 'teen', name: 'Подросток', prompt: 'teenager portrait, youthful energy, transitional age, adolescent features' },
    { id: 'young_adult', name: 'Молодой', prompt: 'young adult portrait, prime age, vibrant energy, fresh appearance' },
    { id: 'adult', name: 'Взрослый', prompt: 'adult portrait, mature age, confident presence, established character' },
    { id: 'senior', name: 'Пожилой', prompt: 'senior portrait, elderly wisdom, aged features, dignified presence, life experience' }
  ],
  
  // Эмоции
  expression: [
    { id: 'neutral', name: 'Нейтральное', prompt: 'neutral expression, calm face, relaxed features, natural look, no strong emotion' },
    { id: 'smile', name: 'Улыбка', prompt: 'genuine smile, happy expression, warm eyes, friendly demeanor, positive emotion' },
    { id: 'serious', name: 'Серьёзное', prompt: 'serious expression, intense gaze, focused look, determined demeanor, strong presence' },
    { id: 'surprised', name: 'Удивление', prompt: 'surprised expression, wide eyes, open mouth, shocked reaction, unexpected moment' },
    { id: 'mysterious', name: 'Загадочное', prompt: 'mysterious expression, enigmatic gaze, intriguing look, secretive demeanor, alluring mystery' }
  ],
  
  // Позирование
  pose: [
    { id: 'standing', name: 'Стоя', prompt: 'standing pose, upright posture, confident stance, full body visible, grounded position' },
    { id: 'sitting', name: 'Сидя', prompt: 'sitting pose, relaxed posture, seated position, casual demeanor, comfortable pose' },
    { id: 'profile', name: 'В профиль', prompt: 'profile view, side angle, silhouette outline, facial structure visible, elegant pose' },
    { id: 'three_quarter', name: '3/4 поворот', prompt: 'three-quarter view, angled pose, flattering angle, dynamic positioning, classic portrait angle' },
    { id: 'looking_away', name: 'Взгляд в сторону', prompt: 'looking away, gaze directed off-camera, contemplative pose, candid moment, natural expression' }
  ]
}

// === GENERATION (Генерация) ===
export const generationPresets = {
  // Режимы генерации
  mode: [
    { id: 'txt2img', name: 'Text to Image', prompt: 'text to image generation, AI created from description, prompt-based creation' },
    { id: 'img2img', name: 'Image to Image', prompt: 'image to image generation, style transfer, reference-based creation, transformation' }
  ],
  
  // Сэмплеры (общие названия)
  sampler: [
    { id: 'euler', name: 'Euler', prompt: 'Euler sampler, fast generation, good quality, efficient sampling' },
    { id: 'euler_a', name: 'Euler a', prompt: 'Euler ancestral sampler, creative variation, artistic results, good for stylized' },
    { id: 'dpmpp_2m', name: 'DPM++ 2M', prompt: 'DPM++ 2M sampler, high quality, detailed results, recommended for photorealistic' },
    { id: 'dpmpp_sde', name: 'DPM++ SDE', prompt: 'DPM++ SDE sampler, smooth results, good for portraits, high quality' }
  ],
  
  // Негативные промты (базовые)
  negative: [
    { id: 'basic', name: 'Базовый', prompt: 'blurry, low quality, distorted, deformed, ugly, duplicate, watermark, signature, text, cropped' },
    { id: 'portrait', name: 'Для портрета', prompt: 'disfigured, bad anatomy, extra limbs, poorly drawn face, mutation, mutated, extra fingers, fused fingers, too many fingers, long neck, cross-eyed' },
    { id: 'photo', name: 'Для фото', prompt: 'painting, drawing, illustration, cartoon, anime, 3d render, cg, digital art, sketch, artificial' },
    { id: 'quality', name: 'Для качества', prompt: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username' }
  ]
}

// === EXPORT ALL ===
export default {
  lightingPresets,
  cameraPresets,
  environmentPresets,
  stylePresets,
  moodPresets,
  compositionPresets,
  qualityPresets,
  characterPresets,
  generationPresets
}