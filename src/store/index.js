import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("yandex_token") || null,
  }),

  actions: {
    setUser(user) {
      this.user = user;
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("yandex_token");
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("yandex_token", token);
    },
        async handleYandexAuth() {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        if (accessToken) {
          this.setToken(accessToken)
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
      if (!this.token) return

      if (!this.user) {
        this.loading = true
        this.error = null
        
        try {
          const response = await fetch('https://login.yandex.ru/info?format=json', {
            headers: { 'Authorization': `OAuth ${this.token}` }
          })

          if (!response.ok) throw new Error(`Yandex API Error: ${response.status}`)

          const userData = await response.json()
          this.setUser(userData)
          console.log('✅ Yandex Auth Success:', userData)

        } catch (err) {
          console.error('❌ Auth Error:', err)
          this.error = err.message
          // Если токен протух — логаут
          if (err.message.includes('401') || err.message.includes('403')) {
            this.logout()
          }
        } finally {
          this.loading = false
        }
      }
    }
  },
});
