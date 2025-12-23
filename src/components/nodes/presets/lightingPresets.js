export const lightingPresets = {
  // Общий характер света
  type: [
    { id: "natural", label: "Естественный свет" },
    { id: "studio", label: "Студийный свет" },
    { id: "artificial_creative", label: "Искусственный/Креативный" },
  ],

  // Конкретная схема или основной источник света
  setup: [
    // Естественный
    { id: "golden_hour", label: "Золотой час (тёплый, мягкий)" },
    { id: "blue_hour", label: "Синий час (холодный, рассеянный)" },
    { id: "midday_sun_hard", label: "Яркое полуденное солнце (жёсткий)" },
    { id: "overcast_day_soft", label: "Пасмурный день (мягкий, рассеянный)" },
    { id: "window_light_soft", label: "Свет от окна (мягкий)" },
    { id: "dappled_light", label: "Пятнистый свет (через листву)" },
    { id: "open_shade", label: "Открытая тень (мягкий, ровный)" },
    { id: "fog_mist_diffused", label: "Туман/Дымка (очень рассеянный)" },
    
    // Студийный
    { id: "softbox_key", label: "Ключевой свет от софтбокса" },
    { id: "beauty_dish", label: "Портретная тарелка (Beauty Dish)" },
    { id: "ring_light_frontal", label: "Кольцевая лампа (фронтально)" },
    { id: "octabox_large", label: "Большой октобокс (очень мягкий)" },
    { id: "rembrandt_setup", label: "Схема \"Рембрандт\"" },
    { id: "butterfly_paramount", label: "Схема \"Бабочка\" (Paramount)" },
    { id: "clamshell_setup", label: "Схема \"Ракушка\" (два источника)" },
    
    // Искусственный/Креативный
    { id: "neon_lights", label: "Неоновые вывески" },
    { id: "city_night_ambient", label: "Огни ночного города" },
    { id: "candlelight_warm", label: "Свет от свечи (тёплый, мерцающий)" },
    { id: "projector_gobo", label: "Проектор с маской Гобо (узоры)" },
  ],

  // Угол падения основного света
  direction: [
    { id: "frontal", label: "Фронтальный (в лоб)" },
    { id: "frontal_up_45", label: "Фронтально-верхний (45°)" },
    { id: "side_90", label: "Боковой (90°)" },
    { id: "side_45", label: "Боковой (45°, ¾)" },
    { id: "rim_backlight", label: "Контровой (сзади, по контуру)" },
    { id: "top_down", label: "Верхний (сверху вниз)" },
    { id: "bottom_up", label: "Нижний (снизу вверх, \"ужастик\")" },
  ],
  
  // Качество и жёсткость теней
  quality: [
      { id: "soft_diffused", label: "Мягкий, рассеянный (размытые тени)"},
      { id: "hard_specular", label: "Жёсткий, с бликами (чёткие тени)"},
      { id: "balanced", label: "Сбалансированный (умеренно резкие тени)"}
  ]
};
