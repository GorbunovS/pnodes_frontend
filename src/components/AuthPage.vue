<template>
    <div class="flex h-screen w-full  overflow-hidden bg-black text-white font-sans">
        <div class="flex h-full flex-1 flex-col items-center justify-between pb-40 pt-40 px-4 relative z-10">
            <div
                class="mb-20 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-neutral-800 text-4xl font-bold">
                <img :src="logo" />
            </div>
            <div class="flex w-full max-w-[320px] flex-col gap-3">
                <span class="ml-1 mb-1 text-sm text-neutral-500 font-medium">вход</span>

                <Button severity="contrast" variant="outlined">
                    <img class="w-5" :src="yandex_logo" />
                    Яндекс
                </Button>
                <Button severity="contrast" variant="outlined"><img class="w-5" :src="google_logo" />
                    Google
                </Button>
                <Button label="VK" severity="primary" />
            </div>
            <section class="flex flex-col items-center gap-3">
                <img :src="row_logo" alt="P nodes" class="h-10" />
                <p class="text-xl text-gray-400">
                    нодовый конструктор промптов
                </p>
            </section>
        </div>
        <div class="hidden h-full md:grid w-1/2 grid-cols-2 grid-rows-2 gap-0 bg-neutral-900">
            <div v-for="(img, idx) in collageImages" :key="idx"
                class="relative w-full h-full overflow-hidden border border-black/10" :class="img.class">
                <img :src="img.src" alt="Collage" class="h-full w-full object-cover block" />
            </div>
        </div>

    </div>
</template>

<script setup>
import logo from '../assets/logo_1x1.svg'
import row_logo from '../assets/p_nodes.svg'
import yandex_logo from '../assets/ya.png'
import google_logo from '../assets/g.png'
const collageImages = [
    { src: 'https://d8j0ntlcm91z4.cloudfront.net/user_2xhU8YobI5F1MpYpnLSnJB1Rn8Y/f668dc04-f14e-420b-8f14-3844d22c31fe_min.webp', class: '' }, 
    { src: 'https://d8j0ntlcm91z4.cloudfront.net/user_2xhU8YobI5F1MpYpnLSnJB1Rn8Y/741219cd-be9c-49ee-b142-3ae3f5b6053c_min.webp', class: '' }, 
    { src: 'https://d8j0ntlcm91z4.cloudfront.net/user_36icwpEe7kvGumBplwxXiRVESNH/a4e74991-dafd-4f32-b38a-b01ecc1e239f_min.webp', class: '' }, 
    { src: 'https://d8j0ntlcm91z4.cloudfront.net/user_36eKnJxOSWym6vz8XxWA9hyGSZH/06bfcca1-cfe0-4c7c-8aaf-a71c00e25516_min.webp', class: '' },
]
</script>
