// === ПРЕСЕТЫ ДЛЯ НОД ===
// Организованы по категориям и подтипам

// === LIGHTING (Свет) ===
export const lightingPresets = {
  // Искусственный свет
  artificial: [
    { id: 'neon', name: 'Неоновые вывески', prompt: 'neon light, cyberpunk atmosphere, vibrant glow' },
    { id: 'city_night', name: 'Огни ночного города', prompt: 'city night ambient lighting, street lights' },
    { id: 'candlelight', name: 'Свет от свечи', prompt: 'warm candlelight, flickering glow, intimate' },
    { id: 'projector_gobo', name: 'Проектор с Гобо', prompt: 'projector gobo patterns, theatrical light' },
    { id: 'led_panel', name: 'LED панель', prompt: 'LED panel light, adjustable color temperature' },
    { id: 'rgb_lighting', name: 'RGB подсветка', prompt: 'RGB colored lighting, creative color mix' }
  ],
  
  // Студийный свет
  studio: [
    { id: 'softbox', name: 'Софтбокс', prompt: 'softbox lighting, soft diffused light, no harsh shadows' },
    { id: 'beauty_dish', name: 'Портретная тарелка', prompt: 'beauty dish lighting, fashion setup, crisp shadows' },
    { id: 'ring_light', name: 'Кольцевая лампа', prompt: 'ring light, frontal even illumination, catchlights' },
    { id: 'octabox', name: 'Октобокс', prompt: 'large octabox, very soft wrap-around light' },
    { id: 'umbrella', name: 'Зонт', prompt: 'umbrella lighting, broad soft light' },
    { id: 'strip_softbox', name: 'Полосовой софтбокс', prompt: 'strip softbox, narrow soft light, edge lighting' }
  ],
  
  // Схемы света (setup)
  setup: [
    { id: 'rembrandt', name: 'Схема Рембрандт', prompt: 'Rembrandt lighting, dramatic portrait setup, triangle highlight' },
    { id: 'butterfly', name: 'Схема Бабочка', prompt: 'butterfly lighting, glamour setup, nose shadow' },
    { id: 'clamshell', name: 'Схема Ракушка', prompt: 'clamshell lighting, two-source setup, flat even light' },
    { id: 'split', name: 'Сплит (разделение)', prompt: 'split lighting, half face light, dramatic contrast' },
    { id: 'loop', name: 'Петля (Loop)', prompt: 'loop lighting, small nose shadow, classic portrait' },
    { id: 'rim_light', name: 'Контровой', prompt: 'rim backlight, edge light silhouette, separation' }
  ],
  
  // Направление света
  direction: [
    { id: 'frontal', name: 'Фронтальный', prompt: 'frontal lighting, flat illumination, minimal shadows' },
    { id: 'frontal_up', name: 'Фронтально-верхний 45°', prompt: '45-degree butterfly lighting, above camera' },
    { id: 'side_90', name: 'Боковой 90°', prompt: 'side lighting 90 degrees, dramatic half shadow' },
    { id: 'side_45', name: 'Боковой 45°', prompt: 'side lighting 45 degrees, three-quarter view' },
    { id: 'top_down', name: 'Верхний', prompt: 'top-down lighting, overhead, eye sockets shadow' },
    { id: 'bottom_up', name: 'Нижний', prompt: 'bottom-up lighting, horror style, unnatural shadows' },
    { id: 'backlight', name: 'Подсветка сзади', prompt: 'backlight, hair light, atmospheric glow' }
  ],
  
  // Качество света
  quality: [
    { id: 'soft_diffused', name: 'Мягкий рассеянный', prompt: 'soft diffused light, blurry shadows, gentle transition' },
    { id: 'hard_specular', name: 'Жёсткий с бликами', prompt: 'hard specular light, sharp shadows, crisp edges' },
    { id: 'balanced', name: 'Сбалансированный', prompt: 'balanced lighting, moderate shadows, natural look' },
    { id: 'high_contrast', name: 'Высококонтрастный', prompt: 'high contrast lighting, deep shadows, dramatic' },
    { id: 'low_contrast', name: 'Низкоконтрастный', prompt: 'low contrast flat lighting, minimal shadows' }
  ],
  
  // Естественный свет
  natural: [
    { id: 'golden_hour', name: 'Золотой час', prompt: 'golden hour lighting, warm sunset glow, long shadows' },
    { id: 'blue_hour', name: 'Синий час', prompt: 'blue hour lighting, cool twilight, soft shadows' },
    { id: 'midday_sun', name: 'Яркое полуденное солнце', prompt: 'harsh midday sun, strong shadows, overhead' },
    { id: 'overcast', name: 'Пасмурный день', prompt: 'soft overcast lighting, diffused, no shadows' },
    { id: 'window_light', name: 'Свет от окна', prompt: 'soft window light, natural illumination, directional' },
    { id: 'dappled', name: 'Пятнистый свет', prompt: 'dappled light through foliage, patterned shadows' },
    { id: 'open_shade', name: 'Открытая тень', prompt: 'open shade, soft even lighting, no direct sun' },
    { id: 'fog_mist', name: 'Туман/Дымка', prompt: 'foggy mist lighting, atmospheric haze, diffused' }
  ]
}

// === CAMERA (Камеры) ===
export const cameraPresets = {
  // Типы камер
  camera: [
    { id: 'portrait_85mm', name: 'Портрет 85mm f/1.8', prompt: '85mm lens portrait, f1.8, shallow depth of field, creamy bokeh, natural proportions' },
    { id: 'portrait_105mm', name: 'Портрет 105mm f/2', prompt: '105mm telephoto portrait, f2.0, background compression, soft bokeh' },
    { id: 'cinematic_50mm', name: 'Кино 50mm f/1.4', prompt: '50mm cinematic, f1.4, filmic perspective, soft rolloff' },
    { id: 'anamorphic_40mm', name: 'Анаморфный 40mm', prompt: 'anamorphic 40mm, widescreen, horizontal flares, oval bokeh' },
    { id: 'wide_24mm', name: 'Широкий 24mm', prompt: '24mm wide angle, environmental portrait, deep perspective' },
    { id: 'street_35mm', name: 'Стрит 35mm', prompt: '35mm street photography, natural perspective, realistic' },
    { id: 'tele_135mm', name: 'Теле 135mm', prompt: '135mm telephoto, compressed background, dramatic perspective' },
    { id: 'macro_100mm', name: 'Макро 100mm', prompt: '100mm macro, extreme detail, beauty close-up' }
  ],
  
  // Линзы / Оптика
  lens: [
    { id: 'bokeh_creamy', name: 'Кремовое боке', prompt: 'creamy bokeh, smooth background blur, circular highlights' },
    { id: 'bokeh_busy', name: 'Плотное боке', prompt: 'busy bokeh, swirling background, character lens' },
    { id: 'lens_vintage', name: 'Винтажная оптика', prompt: 'vintage lens, soft glow, chromatic aberration, character' },
    { id: 'lens_modern', name: 'Современная оптика', prompt: 'modern sharp lens, crisp detail, clean rendering' },
    { id: 'lens_tilt', name: 'Tilt-Shift', prompt: 'tilt-shift effect, selective focus plane, miniature look' },
    { id: 'lens_fisheye', name: 'Рыбий глаз', prompt: 'fisheye lens, ultra wide 180 degree, barrel distortion' },
    { id: 'lens_pinhole', name: 'Пинхол', prompt: 'pinhole camera effect, infinite depth of field, soft focus' }
  ]
}

// === ENVIRONMENT (Окружение) ===
export const environmentPresets = {
  // Студии
  studio: [
    { id: 'studio_white', name: 'Белая студия', prompt: 'white cyclorama studio, seamless white background' },
    { id: 'studio_black', name: 'Чёрная студия', prompt: 'black studio, dark background, dramatic' },
    { id: 'studio_grey', name: 'Серая студия', prompt: 'grey background studio, neutral tone' },
    { id: 'studio_infinite', name: 'Бесконечность', prompt: 'infinite white background, seamless floor' },
    { id: 'studio_colored', name: 'Цветная студия', prompt: 'colored backdrop studio, solid color background' }
  ],
  
  // Интерьеры
  interior: [
    { id: 'loft', name: 'Лофт', prompt: 'loft interior, industrial, brick walls, large windows' },
    { id: 'modern_apartment', name: 'Современная квартира', prompt: 'modern apartment, minimal interior, clean lines' },
    { id: 'classic_room', name: 'Классическая комната', prompt: 'classic interior, elegant furniture, warm tones' },
    { id: 'office', name: 'Офис', prompt: 'office interior, professional setting, work environment' },
    { id: 'cafe', name: 'Кафе', prompt: 'cafe interior, cozy atmosphere, ambient lighting' }
  ],
  
  // Экстерьеры
  exterior: [
    { id: 'urban_street', name: 'Городская улица', prompt: 'urban street scene, city environment, buildings' },
    { id: 'urban_night', name: 'Ночной город', prompt: 'city night, neon lights, urban atmosphere' },
    { id: 'park', name: 'Парк', prompt: 'park setting, trees, nature in city, green' },
    { id: 'beach', name: 'Пляж', prompt: 'beach setting, sand, sea, open sky' },
    { id: 'forest', name: 'Лес', prompt: 'forest environment, trees, natural setting' }
  ],
  
  // Специальные локации
  special: [
    { id: 'sci_fi_lab', name: 'Sci-Fi лаборатория', prompt: 'sci-fi laboratory, futuristic, high-tech, clean' },
    { id: 'industrial', name: 'Индустриальная', prompt: 'industrial location, factory, warehouse, gritty' },
    { id: 'theater', name: 'Театр/Сцена', prompt: 'theater stage, curtains, dramatic setting' },
    { id: 'outdoor_nature', name: 'Природа', prompt: 'natural outdoor setting, landscape background' },
    { id: 'rooftop', name: 'Крыша', prompt: 'rooftop setting, city skyline, open air' }
  ]
}

// === STYLE (Стиль) ===
export const stylePresets = {
  digital: [
    { id: 'photorealistic', name: 'Фотореализм', prompt: 'photorealistic, hyper detailed, 8k, lifelike' },
    { id: 'digital_art', name: 'Digital Art', prompt: 'digital art, detailed, professional illustration' },
    { id: 'concept_art', name: 'Concept Art', prompt: 'concept art, design focused, artstation quality' },
    { id: '3d_render', name: '3D Render', prompt: '3D render, octane, blender, perfect lighting, CG' }
  ],
  
  traditional: [
    { id: 'oil_painting', name: 'Масляная живопись', prompt: 'oil painting, traditional art, visible brushstrokes, canvas texture' },
    { id: 'watercolor', name: 'Акварель', prompt: 'watercolor painting, soft edges, paper texture, flowing' },
    { id: 'pencil', name: 'Карандаш', prompt: 'pencil sketch, line art, monochrome, drawing' },
    { id: 'charcoal', name: 'Уголь', prompt: 'charcoal drawing, bold strokes, high contrast, sketch' }
  ],
  
  stylized: [
    { id: 'anime', name: 'Аниме', prompt: 'anime style, clean lineart, soft shading, expressive' },
    { id: 'comic', name: 'Комикс', prompt: 'comic book style, bold lines, vibrant colors, dynamic' },
    { id: 'pixel_art', name: 'Pixel Art', prompt: 'pixel art, retro game, limited palette, crisp pixels' },
    { id: 'vector', name: 'Вектор', prompt: 'vector art, flat colors, clean shapes, graphic design' }
  ],
  
  cinematic: [
    { id: 'cinematic', name: 'Кинематографичный', prompt: 'cinematic, film grain, color graded, movie still' },
    { id: 'film_noir', name: 'Нуар', prompt: 'film noir, high contrast black and white, dramatic shadows' },
    { id: 'vintage', name: 'Винтаж', prompt: 'vintage photo, sepia tone, aged, retro' },
    { id: 'cyberpunk', name: 'Киберпанк', prompt: 'cyberpunk, neon, dystopian, high tech low life' }
  ]
}

// === MOOD (Настроение) ===
export const moodPresets = {
  emotion: [
    { id: 'calm', name: 'Спокойное', prompt: 'calm serene atmosphere, peaceful, tranquil' },
    { id: 'dramatic', name: 'Драматичное', prompt: 'dramatic intense atmosphere, emotional tension' },
    { id: 'mysterious', name: 'Загадочное', prompt: 'mysterious enigmatic atmosphere, intrigue, moody' },
    { id: 'joyful', name: 'Радостное', prompt: 'joyful happy atmosphere, positive energy, bright' },
    { id: 'melancholic', name: 'Меланхоличное', prompt: 'melancholic mood, nostalgic, contemplative' },
    { id: 'epic', name: 'Эпичное', prompt: 'epic grand atmosphere, awe-inspiring, powerful' },
    { id: 'intimate', name: 'Интимное', prompt: 'intimate atmosphere, close, personal, warm' },
    { id: 'tense', name: 'Напряжённое', prompt: 'tense atmosphere, suspenseful, anxious' }
  ]
}

// === CHARACTER (Персонаж) - заглушка ===
export const characterPresets = {
  // Пока пусто, будет заполнено позже
  template: [],
  face_constructor: []
}

// === GENERATION (Генерация) - заглушка ===
export const generationPresets = {
  // Пока пусто, будет заполнено позже
  photo: [],
  video: []
}
