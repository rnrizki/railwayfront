<script setup>


  import {storeToRefs} from "pinia";
  import {useLanguageStore} from "./store/language";

  const props = defineProps({
    error: Object
  })

  const languageStore = useLanguageStore()
  const {currentLanguage} = storeToRefs(languageStore)


  const reload = () => {
    window.location.reload()
  }

  onMounted(() => {
    document.body.classList.add(currentLanguage?.direction || 'ltr')
    window.scrollTo(0,0);
  })


</script>

<template>
  <NuxtLayout>
  <div class="container-fluid mtb-20 mtb-sm-15">
    <div class="flex error-wrapper reverse">

      <div class="img-wrap mb-sm-20 mlr-xs-auto">
        <img src="~/assets/images/error.png"
             alt="Error image"
             height="50"
             width="50"
        >
      </div>

      <div class="mr-50 mr-sm">

        <h1 class="big-title">
          {{ $t('error.sorry') }}
        </h1>
        <h2 class=" mb-15">{{ error.message }}</h2>

        <h4 class="mb-30">
          {{ $t('error.try') }}
          <button
                  aria-label="submit"
                  class="outline-btn plr-25 mlr-5"
                  @click.prevent="reload"
          >
            {{ $t('error.reload') }}
          </button>
          {{ $t('error.or') }}
          <nuxt-link
                  class="color-primary mlr-5"
                  to="/">
            <strong>
              {{ $t('error.goHome') }}
            </strong>
          </nuxt-link>
        </h4>
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>
<style lang="stylus" scoped>
  .big-title
    font-weight 300
    font-size 6em

  .error-wrapper
    min-height 400px

    .img-wrap
      max-width 350px

  @media only screen and (max-width: 768px)
    .big-title
      font-size 4em

  @media only screen and (max-width: 576px)
    .error-wrapper
      text-align center
      min-height 0
      display block

</style>
