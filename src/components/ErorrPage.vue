<template>
  <main
    class="min-h-screen bg-black text-white flex flex-col items-center justify-between pb-100 pt-24 pb-16"
  >


    <!-- Контент 404 -->
    <section class="flex flex-col items-center gap-6 text-center">
      <h1 class="text-10xl font-bold tracking-tight">404</h1>

      <p class="max-w-md text-sm text-gray-300 leading-relaxed">
        страницы не существует или находится в разработке.
        подпишитесь на наш телеграм, чтобы следить за обновлениями.
      </p>

      <!-- Кнопка / инпут под подписку -->
      <Button  severity="primary"
       
      >
        перейти в телеграм
      </Button>
    </section>

    <!-- Нижний блок -->
    <section class="flex flex-col items-center gap-3">

 <img :src="logo" alt="P nodes" class="h-20" />
      <p class="text-xs text-gray-400">
        нодовый конструктор промптов
      </p>
    </section>
  </main>
</template>

<script setup> 
    import logo from '../assets/logo_1x1.svg'
    
</script>
