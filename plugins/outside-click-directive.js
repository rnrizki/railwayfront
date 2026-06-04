import outsideClick from '~/directives/outside-click'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('outside-click', outsideClick)
})
