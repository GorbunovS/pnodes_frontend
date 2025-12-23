import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import './style.css'
import App from './App.vue'
import { Button } from 'primevue';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';

const app = createApp(App);

app.component('Button', Button);

const pnodes_preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316', // Orange-500 (Основной акцент)
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#fafafa',  // Zinc-50
                    100: '#f4f4f5', // Zinc-100
                    200: '#e4e4e7', // Zinc-200
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b'  // Zinc-950
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b'
                }
            }
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: pnodes_preset,
         options: {
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
    
});
app.use(ToastService);

app.mount('#app');



