import drag from '~/directives/drag'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('drag', drag)
})
