# PNodes Frontend

## Project Overview

PNodes is a Vue 3-based visual node editor for AI image prompt engineering. It provides a node-based interface for constructing complex prompts for AI image generation APIs (specifically GenAPI.ru with GPT-Image-1 model). The application allows users to visually compose scenes, characters, lighting, and styling through an intuitive graph editor built with BaklavaJS.

**Key Features:**
- Visual node-based prompt constructor
- Character builder with detailed facial feature controls (skin, nose, mouth, eyes, hair)
- Scene composition with environment, lighting, and camera settings
- Integration with GenAPI.ru for AI image generation
- Yandex OAuth authentication
- Project templates and preset system

## Technology Stack

- **Framework:** Vue 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite 7
- **State Management:** Pinia
- **Routing:** Vue Router 4 (memory history mode)
- **UI Components:** PrimeVue 4 with custom Aura-based theme
- **Styling:** Tailwind CSS 4
- **Node Editor:** BaklavaJS 2
- **Icons:** PrimeIcons
- **Drag & Drop:** @dnd-kit/vue
- **Gestures:** @vueuse/gesture
- **Pan/Zoom:** vue-panzoom

## Project Structure

```
src/
├── main.js                 # Application entry point, plugin initialization
├── App.vue                 # Root component with layout
├── style.css               # Global styles, Tailwind imports, custom fonts
├── router/
│   └── index.js            # Vue Router configuration
├── store/
│   ├── user.js             # User authentication (Yandex OAuth)
│   ├── aistore.js          # AI API integration (GenAPI.ru)
│   └── pro.js              # Project management state
├── components/
│   ├── HeaderComp.vue      # Navigation header
│   ├── HomePage.vue        # Landing page
│   ├── AuthPage.vue        # Authentication page
│   ├── ErorrPage.vue       # 404 error page
│   ├── NodesView.vue       # Main node editor view
│   ├── ProfileView.vue     # User profile page
│   ├── nodes/
│   │   ├── nodes.js        # Node type definitions (BaklavaJS)
│   │   ├── types.js        # Interface type definitions
│   │   ├── presets/        # Preset configurations for nodes
│   │   │   ├── cameraPreset.js
│   │   │   ├── envPresets.js
│   │   │   ├── eyePresets.js
│   │   │   ├── hairPresets.js
│   │   │   ├── lightingPresets.js
│   │   │   ├── mouthPreset.js
│   │   │   ├── nosePreset.js
│   │   │   ├── skinPresets.js
│   │   │   └── stylesPresets.js
│   │   └── custom_nodes/   # Custom Vue components for nodes
│   │       ├── CustomActionBtn.vue
│   │       └── ImageInput.vue
│   ├── userLib/
│   │   ├── ManLibView.vue  # Template library view
│   │   ├── ProjCard.vue    # Project card component
│   │   └── TemplateCardMini.vue
│   └── helpers/
│       └── lockScroll.js   # Scroll locking utility
├── customCanvas/           # Custom canvas components
│   ├── BoardCanvas.vue
│   ├── BoardViewer.vue
│   └── DraggableNote.vue
├── data/
│   └── ProjMocks.js        # Project template mock data
├── engine/
│   └── canvas.js           # Canvas engine utilities
└── utils/
    ├── exportPerson.js     # Character export utility
    ├── exportScene.js      # Scene export utility
    ├── exportUniversal.js  # Universal graph export
    └── helpers.js          # General helper functions
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite dev server)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Configuration Files

### Environment Variables

- `.env` - Production environment variables
  - `VITE_REDIRECT_URI` - Yandex OAuth redirect URI for production
  - `VITE_YANDEX_CLIENT_ID` - Yandex OAuth client ID

- `.env.development` - Development environment variables
  - `VITE_REDIRECT_URI` - Local development redirect URI (http://localhost:5173/)

### Vite Configuration (vite.config.js)

- Base path: `/pnodes_frontend` (for GitHub Pages deployment)
- Plugins: Vue plugin, Tailwind CSS plugin

## Code Style Guidelines

### Vue Components
- Use `<script setup>` syntax exclusively
- Composition API preferred over Options API
- Component names use PascalCase
- File names match component names

### Styling
- Tailwind CSS for utility-first styling
- Custom CSS in `style.css` for global styles and BaklavaJS overrides
- Russian comments in CSS for project-specific overrides
- Dark theme is default and enforced

### JavaScript Conventions
- ES6+ syntax (ES modules)
- Semicolons optional but consistent within files
- Russian language used for UI text and comments
- Async/await for asynchronous operations

### Node Editor Architecture

The application uses BaklavaJS for the visual node editor:

1. **Node Types** (defined in `src/components/nodes/nodes.js`):
   - `CompositionNode` - Scene composition root
   - `CharacterNode` / `CharacterFullNode` - Character definitions
   - `EnvironmentNode` - Scene environment settings
   - `LightingNode` - Lighting configuration
   - `CameraNode` - Camera settings
   - `StyleNode` - Stylistic presets
   - `SkinNode`, `NoseNode`, `MouthNode`, `EyesNode`, `HairNode` - Facial features
   - `ResultNode` - Output/generation node

2. **Interface Types** (defined in `src/components/nodes/types.js`):
   - Typed connections between nodes (character, environment, light, etc.)
   - Color-coded ports for visual distinction

3. **Presets** (in `src/components/nodes/presets/`):
   - JSON-like preset definitions for various node parameters
   - Organized by category (lighting, environment, facial features, etc.)

## Authentication Flow

1. User clicks "Войти" (Login) button
2. Redirect to Yandex OAuth with client ID
3. Yandex redirects back with access token in URL hash
4. `handleYandexAuth()` in `user.js` extracts and stores token
5. User info fetched from Yandex API and stored in Pinia
6. Token persisted in localStorage as `yandex_token`

## AI Image Generation Flow

1. User constructs prompt using nodes
2. `exportUniversal.js` traverses the graph and builds structured prompt
3. User clicks generate in ResultNode
4. API token checked (prompted if missing)
5. `aistore.js` creates task via GenAPI.ru API
6. Polling mechanism checks task status every 3 seconds
7. Result displayed when generation completes

## Deployment

The project is configured for GitHub Pages deployment via GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Trigger: Push to `main` branch
- Build output: `dist/` directory
- Deployment target: GitHub Pages

## Security Considerations

- API tokens stored in localStorage (client-side only)
- Yandex OAuth client ID exposed in frontend (standard for SPA)
- No backend proxy for API calls - direct browser-to-API communication
- No sensitive server-side configuration in repository

## Notes for AI Agents

- The application is Russian-language focused (UI, comments, documentation)
- BaklavaJS theme overrides are in `style.css` (transparent backgrounds, custom node sizing)
- Memory history mode used in router (not hash mode) - important for OAuth redirects
- Project templates are hardcoded in `ProjMocks.js` (not fetched from API)
- Dark mode is enforced; light mode CSS exists but is not actively used
