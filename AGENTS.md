# PNodes Frontend

## Project Overview

PNodes — это визуальный нодовый редактор промптов для генерации изображений с помощью AI. Приложение позволяет конструировать сложные промпты через интуитивный графический интерфейс, соединяя ноды различных типов (персонажи, освещение, окружение, стиль) в единую композицию.

**Основные возможности:**
- Визуальный конструктор промптов на основе нод
- Детальный билдер персонажей с настройкой черт лица (кожа, нос, губы, глаза, волосы)
- Композитор сцен с окружением, освещением и камерой
- Интеграция с GenAPI.ru для генерации изображений (модель GPT-Image-1)
- Аутентификация через Yandex OAuth
- Система шаблонов и пресетов
- Мультисессионная работа с проектами (вкладки)
- История изменений (undo/redo)
- Импорт/экспорт проектов в JSON-формате

## Technology Stack

- **Framework:** Vue 3.5+ (Composition API с `<script setup>`)
- **Build Tool:** Vite 7
- **State Management:** Pinia 3
- **Router:** Vue Router 4 (memory history mode)
- **UI Components:** PrimeVue 4 с кастомной темой на базе Aura
- **Styling:** Tailwind CSS 4
- **Анимации:** @vueuse/motion
- **Gestures:** @vueuse/gesture
- **Pan/Zoom:** vue-panzoom
- **Icons:** PrimeIcons
- **Drag & Drop:** @dnd-kit/vue

## Project Structure

```
src/
├── main.js                    # Точка входа, инициализация плагинов
├── App.vue                    # Корневой компонент с layout
├── style.css                  # Глобальные стили, Tailwind, кастомные шрифты
├── router/
│   └── index.js               # Конфигурация Vue Router (memory history)
├── store/                     # Pinia stores
│   ├── user.js                # Аутентификация (Yandex OAuth)
│   ├── aistore.js             # Интеграция с GenAPI.ru (GPT-Image-1)
│   ├── boardStore.js          # Состояние canvas (ноды, связи, выделение)
│   ├── historyStore.js        # История изменений (undo/redo)
│   ├── generationStore.js     # Состояние генерации изображений
│   ├── sessionStore.js        # Управление сессиями проектов (CRUD, импорт/экспорт)
│   └── pro.js                 # Управление проектами
├── components/
│   ├── HeaderComp.vue         # Навигационный хедер
│   ├── HomePage.vue           # Лендинг
│   ├── AuthPage.vue           # Страница авторизации (Yandex OAuth)
│   ├── ErorrPage.vue          # 404 страница
│   ├── ProfileView.vue        # Профиль пользователя
│   ├── CustomToggleSwitch.vue # Кастомный переключатель
│   ├── MotionButton.vue       # Кнопка с анимацией
│   ├── user/
│   │   └── ApiKeysManager.vue # Управление API ключами
│   └── userLib/
│       ├── ManLibView.vue     # Основной view с вкладками проектов
│       ├── TemplateCardMini.vue # Карточка шаблона
│       └── ProjCard.vue       # Карточка проекта
├── customCanvas/              # Кастомная реализация node editor
│   ├── BoardViewer.vue        # Контейнер с pan/zoom и viewport
│   ├── BoardCanvas.vue        # Canvas с нодами и связями (SVG + DOM)
│   ├── NodesTemplate.vue      # Компоненты нод (5 типов)
│   ├── NodePanel.vue          # Панель добавления нод
│   ├── ActionPanel.vue        # Панель действий (undo/redo/центрирование)
│   └── Minimap.vue            # Миникарта canvas
├── data/                      # Конфигурация и данные
│   ├── nodeConfig.js          # Конфигурация типов нод, рангов, правил соединений
│   ├── nodePresets.js         # Пресеты для сцен (свет, камера, окружение, стиль, настроение)
│   ├── characterPresets.js    # Пресеты для персонажей и частей лица
│   ├── providersConfig.js     # Конфигурация AI провайдеров
│   └── ProjMocks.js           # Демо-шаблоны проектов (3 примера)
├── utils/
│   └── helpers.js             # Вспомогательные функции
└── assets/                    # Статика (шрифты, изображения, SVG)
    ├── fonts/                 # SoyuzGroteskBold, Racama-U
    ├── galery/                # Демо изображения для шаблонов
    └── *.svg/png
```

## Build and Development Commands

```bash
# Установка зависимостей
npm install

# Запуск dev сервера (Vite)
npm run dev

# Сборка для production
npm run build

# Превью production сборки
npm run preview
```

**Dev сервер:** http://localhost:5173/

## Configuration

### Environment Variables

**Файл `.env` (production):**
```
VITE_REDIRECT_URI=https://gorbunovs.github.io/pnodes_frontend/
VITE_YANDEX_CLIENT_ID=f95826a56ebf4246b5ce7349ad22b7dc
```

**Файл `.env.development` (local):**
```
VITE_REDIRECT_URI=http://localhost:5173/
VITE_YANDEX_CLIENT_ID=f95826a56ebf4246b5ce7349ad22b7dc
```

### Vite Configuration (vite.config.js)

- Base path: `/pnodes_frontend` (для GitHub Pages)
- Plugins: Vue plugin, Tailwind CSS plugin

## Code Style Guidelines

### Vue Components

- Использовать **только** `<script setup>` синтаксис
- Composition API вместо Options API
- Имена компонентов в PascalCase
- Имена файлов соответствуют именам компонентов

### Styling

- Tailwind CSS для utility-first стилизации
- Кастомные CSS переменные в `style.css` для глобальных настроек
- Тёмная тема по умолчанию (принудительно включена в `App.vue`)
- Русские комментарии в CSS для project-specific override'ов
- Кастомный шрифт SoyuzGroteskBold для заголовков, Onest для UI

### JavaScript Conventions

- ES6+ синтаксис (ES модули)
- Точки с запятыми опционны, но консистентны в рамках файла
- Русский язык для UI текста и комментариев
- Async/await для асинхронных операций

## Node Editor Architecture

Кастомная реализация визуального редактора нод:

### Типы нод (src/data/nodeConfig.js)

**Ранги нод (иерархия):**
```
PART (1) → ASSEMBLY (2) → ELEMENT (3) → COMPOSER (4) → OUTPUT (5)
```

**Категории нод:**
- **Свет** (`lighting`) — янтарный (#fbbf24), пресеты: artificial, studio, natural
- **Окружение** (`environment`) — светло-зелёный (#86efac), пресеты: studio, interior, exterior
- **Камеры** (`camera`, `lens`) — розовый (#f9a8d4), пресеты: camera types, lens types
- **Стиль** (`style`) — фиолетовый (#c4b5fd), пресеты: digital, traditional, cinematic
- **Настроение** (`mood`) — розово-красный (#fca5a5), пресеты: emotions
- **Персонаж** (`character`, `skin`, `nose`, `eyes`, `mouth`, `hair`) — голубой/оранжевый
- **Композитор** (`composer`) — голубой (#93c5fd), собирает входы от всех элементов
- **Результат** (`result`, `generation`) — мятный/красный, вывод промпта/генерация

### Правила соединений

- Соединения работают по принципу Output → Input
- Нода может принимать входы только от нод с меньшим рангом
- Композитор принимает множественные входы (lighting, environment, camera, character)
- Character принимает части лица (skin, nose, eyes, mouth, hair)
- Result и Generation принимают только от Composer

### Keyboard Shortcuts

| Клавиша | Действие |
|---------|----------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+C` | Копировать выбранные ноды |
| `Ctrl+V` | Вставить ноды |
| `Delete` | Удалить выбранные ноды (не Backspace!) |
| `Escape` | Сбросить выделение / отменить соединение |
| `Ctrl+Click` на связи | Удалить связь |
| `Средняя кнопка мыши` | Панорамирование canvas |
| `Колесико мыши` | Зум canvas |

## Authentication Flow

1. Пользователь нажимает "Войти" в хедере
2. Редирект на Yandex OAuth с `client_id`
3. Yandex редиректит обратно с `access_token` в URL hash
4. `handleYandexAuth()` в `user.js` извлекает и сохраняет токен
5. Данные пользователя загружаются с `login.yandex.ru/info`
6. Токен сохраняется в `localStorage` как `yandex_token`

## AI Image Generation Flow

1. Пользователь строит промпт через ноды
2. Данные собираются из подключённых нод в композитор
3. В ноде Generation выбирается провайдер и настройки
4. При нажатии "Генерировать":
   - Проверяется наличие API токена (хранится в `localStorage` как `ai_api_token`)
   - Создаётся задача через API GenAPI.ru
   - Запускается polling статуса каждые 3 секунды
   - Результат отображается при завершении

**API Endpoints:**
- Создание задачи: `POST https://api.gen-api.ru/api/v1/networks/gpt-image-1`
- Проверка статуса: `GET https://api.gen-api.ru/api/v1/request/get/{request_id}`

## Session Management

- Каждый проект — отдельная сессия с уникальным ID (`sess_${timestamp}_${random}`)
- Состояние canvas сохраняется в `localStorage` с префиксом `canvasState_{sessionId}`
- Viewport (pan/zoom) сохраняется отдельно с префиксом `canvasViewport_{sessionId}`
- Список сессий хранится в `pnodes_sessions_list`
- Полные данные сессии в `pnodes_session_data_{sessionId}`
- Вкладки проектов в `ManLibView.vue`
- Поддержка импорта/экспорта проектов в JSON (`.pnodes.json`)

## Deployment

**GitHub Pages** через GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Триггер: push в `main` ветку
- Node версия: 20
- Сборка: `npm run build`
- Выходная директория: `dist/`
- Base URL: `/pnodes_frontend`

## Security Considerations

- API токены хранятся в `localStorage` (только клиентская сторона)
- Yandex OAuth `client_id` доступен в фронтенде (стандартно для SPA)
- Прямое общение браузера с API (без бэкенд-прокси)
- Нет чувствительной серверной конфигурации в репозитории

## State Management Details

### boardStore
- Управление нодами и связями
- Выделение и мульти-выделение
- Drag & drop нод
- Clipboard (копирование/вставка)
- Hint system (подсветка совместимых нод)
- Автосохранение в localStorage

### historyStore
- Undo/redo стек (максимум 50 состояний)
- Сохранение состояния при значимых изменениях

### sessionStore
- CRUD операции с сессиями
- Импорт/экспорт проектов
- Управление открытыми вкладками
- Отслеживание несохранённых изменений

### generationStore
- Состояние генерации (idle, pending, generating, success, error)
- Результат генерации
- Параметры генерации

## Canvas Specifications

- Размер canvas: 6000x4000 пикселей
- Минимальный зум: 0.38
- Максимальный зум: 1.0
- Grid size: 80px
- Node width: 320px (Composer: 340px, Result: 380px)

## Assets

**Шрифты:**
- `SoyuzGroteskBold` — основной шрифт приложения для заголовков
- `Onest` — UI шрифт (Google Fonts)
- `Racama-U` — дополнительный декоративный

**Изображения:**
- `fog_bg.png` / `fog_boll.png` — фоновые эффекты
- `logo_1x1.svg` / `P_nodes.svg` — логотипы
- `galery/` — демо изображения для шаблонов

## Notes for AI Agents

- Приложение полностью на русском языке (UI, комментарии)
- Тёмная тема принудительно включена, светлая есть но не используется
- **Важно:** router использует `createMemoryHistory`, не hash mode
- Для OAuth редиректов важен правильный `VITE_REDIRECT_URI`
- Тестирование OAuth локально: использовать `localhost:5173/` в `.env.development`
- Node editor — кастомная реализация на SVG + DOM (не используется BaklavaJS)
- При добавлении новых типов нод — обновлять `nodeConfig.js`, `RANKS`, и `connectionRules`
- Сессии изолированы друг от друга, каждая имеет собственное состояние в localStorage
