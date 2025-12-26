import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "./style.css";
import App from "./App.vue";
import { Button } from "primevue";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import { router } from "./router";
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App);
app.component("Button", Button);
app.use(pinia)
app.use(router)


const pnodes_preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#9EC8FF',
            100: '#9EC8FF',
            200: '#86bafdff',
            300: '#70aeffff',
            400: '#5899ecff',
            500: '#4b8bdfff',
            600: '#4281d3ff',
            700: '#3679d1ff',
            800: '#276ac2ff',
            900: '#1452a1ff',
            950: '#0d3734'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#9EC8FF',
                    contrastColor: '#000000'
                },
                surface: {
                    0: '#000000', //фон панели в светлой теме 
                    50: '#3e587aff', //Ховер внутри кнопки  contrast в светлой теме 
                    100: '#151515',
                    200: '#5d7697ff',
                    300: '#404040',
                    400: '#9EC8FF',
                    500: '#9EC8FF',
                    600: '#9EC8FF',
                    700: '#ffffffff', //текст в панели в светлой теме
                    800: '#cccccc',
                    900: '#0d3734',//Панель
                    950: '#f2f2f2'
                }
            },
            dark: {
                primary: {
                    color: '#9EC8FF',
                    contrastColor: '#000000'
                },
                surface: {
                  0: '#f1f1f1ff', //текст внутри панели в темной теме 

                    50: '#0a0a0a',
                    100: '#151515',
                    200: '#262626',
                    300: '#404040',
                    400: '#9EC8FF',
                    500: '#9EC8FF',
                    600: '#9EC8FF',
                    700: '#5d7697ff',//Бордер панели в темной теиме
                    800: '#3e587aff', //Ховер внутри кнопки  contrast
                    900: '#000000',//фон панели в темной теме 
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


app.use(ToastService);
app.mount("#app");
