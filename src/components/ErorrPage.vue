<template>
    <main class="min-h-[95vh] text-white flex flex-col items-center justify-center gap-50 ">

        <section class="flex flex-col items-center gap-6 text-center">
            <img :src="erorrSvg" alt="404" class="h-50" />

            <p class="max-w-2xl  text-gray-300 leading-relaxed">
                страницы не существует или находится в разработке.
                подпишитесь на наш телеграм, чтобы следить за обновлениями.
            </p>

            <!-- Кнопка / инпут под подписку -->
            <Button severity="primary">
                перейти в телеграм
            </Button>
        </section>

        <section class="flex flex-col items-center gap-3">

            <img :src="logo" alt="P nodes" class="h-20" />
            <p class="text-xl text-gray-400">
                нодовый конструктор промптов
            </p>
        </section>
    </main>
</template>

<script setup>
import logo from '../assets/logo_1x1.svg'
import erorrSvg from '../assets/404.svg'

</script>
