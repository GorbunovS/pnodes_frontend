import { defineStore } from "pinia"

export const useAiApiStore = defineStore("aiApi", {
    state: () => ({
        gen_token: import.meta.env.VITE_AI_API_KEY || "sk-8EHZVYO8ZUZHdRlEfBneeZT1DyVrQsm2VkdxioExsgrAZ5koaMbvkrdQw8Ij",
        url_endpoint: "https://api.gen-api.ru/api/v1/networks/nano-banana-pro",
        task_endpoint: "https://api.gen-api.ru/api/v1/tasks", // Для проверки статуса
        task_id: null,
        status: null, // pending, completed, failed
        result: null,
        loading: false,
        error: null,
        poll_interval: null
    }),

    actions: {
        // 🎯 Главная функция - запускает генерацию + авто-проверку
        async generateImage(prompt, options = {}) {
            this.reset() // Очищаем предыдущее состояние
            
            try {
                // 1️⃣ Создаем задачу
                this.task_id = await this.createTask(prompt, options)
                
                // 2️⃣ Автоматически запускаем polling
                this.startPolling()
                
            } catch (err) {
                this.error = err.message
                this.loading = false
            }
        },

        // Создание задачи генерации
        async createTask(prompt, { width = 1024, height = 1024, n = 1 } = {}) {
            this.loading = true
            this.status = 'pending'

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.gen_token}`
            }

            const body = {
                prompt,
                n,
                size: `${width}x${height}`,
                response_format: 'url'
                // callback_url НЕ указываем = null
            }

            const response = await fetch(this.url_endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error(`Создание задачи: ${response.status}`)
            }

            const data = await response.json()
            return data.task_id
        },

        // Проверка статуса задачи
        async checkStatus() {
            if (!this.task_id) return

            try {
                const response = await fetch(
                    `${this.task_endpoint}/${this.task_id}`,
                    { 
                        headers: { 
                            'Authorization': `Bearer ${this.gen_token}` 
                        } 
                    }
                )

                const data = await response.json()
                this.status = data.status

                if (data.status === 'completed') {
                    this.stopPolling()
                    this.result = data.result?.data?.[0]?.url || data.result
                    this.loading = false
                    return this.result
                } 
                else if (data.status === 'failed') {
                    this.stopPolling()
                    this.error = data.error || 'Ошибка генерации'
                    this.loading = false
                }

            } catch (err) {
                console.error('Проверка статуса:', err)
            }
        },

        // 🚀 Автоматическая проверка каждые 3 сек
        startPolling() {
            this.poll_interval = setInterval(() => {
                this.checkStatus()
            }, 3000)
        },

        stopPolling() {
            if (this.poll_interval) {
                clearInterval(this.poll_interval)
                this.poll_interval = null
            }
        },

        // Сброс состояния
        reset() {
            this.stopPolling()
            this.task_id = null
            this.status = null
            this.result = null
            this.error = null
            this.loading = false
        }
    }
})
