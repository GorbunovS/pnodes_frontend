import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "./style.css";
import App from "./App.vue";
import { Button } from "primevue";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import { router } from "./router";

const app = createApp(App);
app.component("Button", Button);
app.use(router)


const pnodes_preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#9EC8FF',
            100: '#9EC8FF',
            200: '#86bafdff',
            300: '#70aeffff',
            400: '#9EFFD5',
            500: '#5dd9c1',
            600: '#3ab8a3',
            700: '#2a9585',
            800: '#1f7169',
            900: '#1a5a57',
            950: '#0d3734'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#9EC8FF',
                    contrastColor: '#000000'
                },
                surface: {
                    0: '#000000',
                    50: '#0a0a0a',
                    100: '#151515',
                    200: '#262626',
                    300: '#404040',
                    400: '#9EC8FF',
                    500: '#9EC8FF',
                    600: '#9EC8FF',
                    700: '#ffffffff',
                    800: '#cccccc',
                    900: '#e6e6e6',
                    950: '#f2f2f2'
                }
            },
            dark: {
                primary: {
                    color: '#9EC8FF',
                    contrastColor: '#000000'
                },
                surface: {
                  0: '#000000',
                    50: '#0a0a0a',
                    100: '#151515',
                    200: '#262626',
                    300: '#404040',
                    400: '#9EC8FF',
                    500: '#9EC8FF',
                    600: '#9EC8FF',
                    700: '#ffffffff',
                    800: '#cccccc',
                    900: '#e6e6e6',
                    950: '#f2f2f2'
                }
            }
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: pnodes_preset,
        options: {
            cssLayer: false
        }
    }
});


app.use(PrimeVue, {
    theme: {
        preset: pnodes_preset,
        options: {
            cssLayer: false
        }
    }
});


app.use(ToastService);
app.mount("#app");
