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

## Technology Stack

- **Framework:** Vue 3.5+ (Composition API с `<script setup>`)
- **Build Tool:** Vite 7
- **State Management:** Pinia 3
- **Router:** Vue Router 4 (memory history mode)
- **UI Components:** PrimeVue 4 с кастомной темой на базе Aura
- **Styling:** Tailwind CSS 4
- **Анимации:** @vueuse/motion
- **Drag & Drop:** @dnd-kit/vue
- **Gestures:** @vueuse/gesture
- **Pan/Zoom:** vue-panzoom
- **Icons:** PrimeIcons

## Project Structure

```
src/
├── main.js                    # Точка входа, инициализация плагинов
├── App.vue                    # Корневой компонент с layout
├── style.css                  # Глобальные стили, Tailwind, кастомные шрифты
├── router/
│   └── index.js               # Конфигурация Vue Router
├── store/                     # Pinia stores
│   ├── user.js                # Аутентификация (Yandex OAuth)
│   ├── aistore.js             # Интеграция с GenAPI.ru
│   ├── boardStore.js          # Состояние canvas (ноды, связи, выделение)
│   ├── historyStore.js        # История изменений (undo/redo)
│   ├── generationStore.js     # Состояние генерации изображений
│   ├── sessionStore.js        # Управление сессиями проектов
│   └── pro.js                 # Управление проектами
├── components/
│   ├── HeaderComp.vue         # Навигационный хедер
│   ├── HomePage.vue           # Лендинг
│   ├── AuthPage.vue           # Страница авторизации
│   ├── ErorrPage.vue          # 404
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
│   ├── BoardViewer.vue        # Контейнер с pan/zoom и панелями
│   ├── BoardCanvas.vue        # Canvas с нодами и связями
│   ├── NodesTemplate.vue      # Компоненты нод (5 типов)
│   ├── NodePanel.vue          # Панель добавления нод
│   ├── ActionPanel.vue        # Панель действий (undo/redo/центрирование)
│   ├── Minimap.vue            # Миникарта canvas
│   └── DraggableNote.vue      # Заметки на canvas
├── data/                      # Конфигурация и данные
│   ├── nodeConfig.js          # Конфигурация типов нод и правил соединений
│   ├── nodePresets.js         # Пресеты для сцен (свет, камера, окружение)
│   ├── characterPresets.js    # Пресеты для персонажей
│   ├── providersConfig.js     # Конфигурация AI провайдеров
│   └── ProjMocks.js           # Шаблоны проектов (3 демо)
├── utils/
│   └── helpers.js             # Вспомогательные функции
└── assets/                    # Статика (шрифты, изображения, SVG)
    ├── fonts/                 # SoyuzGroteskBold, Racama-U
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
- Кастомный шрифт SoyuzGroteskBold для заголовков, Inter для UI

### JavaScript Conventions

- ES6+ синтаксис (ES модули)
- Точки с запятыми опциональны, но консистентны в рамках файла
- Русский язык для UI текста и комментариев
- Async/await для асинхронных операций

## Node Editor Architecture

Кастомная реализация визуального редактора нод (вместо BaklavaJS в текущей версии):

### Типы нод (src/data/nodeConfig.js)

**Ранги нод (иерархия):**
```
PART (1) → ASSEMBLY (2) → ELEMENT (3) → COMPOSER (4) → OUTPUT (5)
```

**Категории нод:**
- **Свет** (`lighting`) — янтарный цвет, пресеты: artificial, studio, natural
- **Окружение** (`environment`) — светло-зелёный, пресеты: studio, interior, exterior
- **Камеры** (`camera`, `lens`) — розовый, пресеты: camera types, lens types
- **Стиль** (`style`) — фиолетовый, пресеты: digital, traditional, cinematic
- **Настроение** (`mood`) — розово-красный, пресеты: emotions
- **Персонаж** (`character`, `skin`, `nose`, `eyes`, `mouth`, `hair`) — голубой/оранжевый
- **Композитор** (`composer`) — голубой, собирает входы от всех элементов
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

- Каждый проект — отдельная сессия с уникальным ID
- Состояние canvas сохраняется в `localStorage` с префиксом `canvasState_{sessionId}`
- Список сессий хранится в `canvasSessions`
- Вкладки проектов в `ManLibView.vue`
- Шаблоны (1, 2, 3) загружаются из `ProjMocks.js`

## Deployment

**GitHub Pages** через GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Триггер: push в `main` ветку
- Node версия: 20
- Сборка: `npm run build`
- Выходная директория: `dist/`

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

### historyStore
- Undo/redo стек (максимум 50 состояний)
- Сохранение состояния при значимых изменениях

### generationStore
- Состояние генерации (idle, pending, generating, success, error)
- Результат генерации
- Параметры генерации

## Assets

**Шрифты:**
- `SoyuzGroteskBold` — основной шрифт приложения
- `Inter` — UI шрифт
- `Racama-U` — дополнительный декоративный

**Изображения:**
- `fog_bg.png` / `fog_boll.png` — фоновые эффекты
- `logo_1x1.svg` / `P_nodes.svg` — логотипы
- `galery/` — демо изображения для шаблонов

## Notes for AI Agents

- Приложение полностью на русском языке (UI, комментарии)
- Тёмная тема принудительно включена, светлая есть но не используется
- Важно: router использует `createMemoryHistory`, не hash mode
- Для OAuth редиректов важен правильный `VITE_REDIRECT_URI`
- Тестирование OAuth локально: использовать `localhost:5173/` в `.env.development`
- Шаблоны проектов захардкожены в `ProjMocks.js`, не загружаются с API
- Node editor — кастомная реализация, не BaklavaJS (хотя есть следы в style.css)
- При добавлении новых типов нод — обновлять `nodeConfig.js`, `RANKS`, и `connectionRules`
