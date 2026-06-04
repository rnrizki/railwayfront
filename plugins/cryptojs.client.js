import VueCryptojs from 'vue-cryptojs'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueCryptojs)
})

