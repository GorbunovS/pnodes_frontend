import { defineStore } from "pinia"

export const useAiApiStore = defineStore("aiApi", {
    state: () => ({

        url_endpoint: "https://api.gen-api.ru/api/v1/networks/gpt-image-1",
        task_endpoint: "https://api.gen-api.ru/api/v1/request/get", // Для проверки статуса
        task_id: null,
        status: null,
        result: null,
        loading: false,
        error: null,
        poll_interval: null,

    }),
    getters: {
        gen_token: () => localStorage.getItem('ai_api_token') || null,
    },
    actions: {

        async generateImage(prompt, options = {

        }) {
            this.reset() // Очищаем предыдущее состояние

            try {

                this.task_id = await this.createTask(prompt, options)
                this.startPolling()

            } catch (err) {
                this.error = err.message
                this.loading = false
            }
        },

        // Создание задачи генерации
        async createTask(prompt, { width = 1024, height = 1024, n = 1 } = {}) {
            console.log("Используемый токен:", this.gen_token);
            console.log("Длина токена:", this.gen_token?.length);
            console.log("Начинается с:", this.gen_token?.slice(0, 10));
            this.loading = true
            this.status = 'pending'
            const token = this.gen_token
            if (!token) {
                throw new Error("API токен отсутствует. Введите токен в настройках.")
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.gen_token}`
            }

            const body = {
                prompt,
                n,
                size: `${width}x${height}`,
                quality: 'low',
                response_format: 'url'

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
            console.log(data)
            return data.request_id
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
                console.log('Данные опроса', data)
                this.status = data.status

                if (data.status === 'success') {
                    this.stopPolling()
                    this.result = data.result[0]
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


        startPolling() {
            this.poll_interval = setInterval(() => {
                console.log('Cработал таймер полинга' + this.task_id)
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
