<template>
    <main class="h-full overflow-auto text-white flex flex-col items-center justify-center gap-12 p-8">
        <section class="flex flex-col items-center gap-6 text-center max-w-4xl">
            <img class="h-30" :src="logo" />
            <p class="text-4xl text-gray-300 leading-relaxed font-display">
                Добро пожаловать в pnodes
            </p>
            <p class="text-base text-gray-300 leading-relaxed">
                Это универсальный нодовый конструктор для промтинга. Больше не нужно записывать или искать качественные
                промты в интернете. Мы собрали лучшие вариации и обернули их в удобный и понятный интерфейс, чтобы ваши
                генерации выглядели качественно и дорого.

                Используйте готовые ноды и создавайте свои собственные шаблоны, делитесь ими с сообществом и
                вдохновляйтесь работами других авторов. Отлично подходит для фэшн-индустрии, профессионального
                продакшена или обучения.
            </p>
        </section>
        <Button label="Попробовать" @click="router.push('/prompting')" size="large" severity="primary"/>
    </main>
</template>
<script setup>
import logo from '../assets/logo_1x1.svg'
import { useRoute, useRouter } from 'vue-router'; 
const router = useRouter()
</script>
