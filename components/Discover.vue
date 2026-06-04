<template>
  <div
    class="home-section"
  >
    <div class="area">
      <h4 class="title">
        {{ $t('discover.dailyDiscover') }}
      </h4>
      <div
        class="area-content"
      >
        <div class="tile-container">
          <transition name="fade" mode="out-in">
            <div
              class="shimmer-wrapper"
              v-if="loading"
              key="shimmer"
            >
              <tile-shimmer
                v-for="index in 15"
                :key="index"
              />
            </div>
            <div
              v-else
              class="flex wrap align-start discover-area"
              key="products"
            >
              <product-tile
                v-for="(value, index) in currentItems"
                :key="index"
                :product="value"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div
      class="center-text mt-20 mt-sm-15"
    >
      <nuxt-link
        :to="listingLink({slug: 'daily-discover'})"
        class="w-100 br-primary outline-btn btn-lg plr-35 plr-sm-20"
      >
        {{ $t('discover.showMore') }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  import util from '~/mixin/util'
  import TileShimmer from "./TileShimmer";
  import ProductTile from "./ProductTile";
  import {useLanguageStore} from "~/store/language";
  import {useHomeStore} from "~/store/home";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "../utils/fetchClient";
  import {useCommonStore} from "../store/common";

  export default {
    setup(){
      const languageStore = useLanguageStore()
      const {langCode} = storeToRefs(languageStore)

      const homeStore = useHomeStore()
      const {products} = storeToRefs(homeStore)
      const {fetchProducts, setHomeProducts} = homeStore

      const commonStore = useCommonStore()
      const {unAuthGet} = commonStore

      return {langCode, products, fetchProducts, unAuthGet, setHomeProducts}
    },
    name: 'Discover',
    data() {
      return {
        currentItems: [],
        loading: true
      }
    },
    watch: {},
    props: {},
    components: {ProductTile, TileShimmer},
    computed: {

    },
    mixins: [util],
    methods: {

    },
    created() {
    },
    async mounted() {
      if(!this.products){
        try {
          this.loading = true

          const response = await this.unAuthGet({
            api: 'products',
            params: `?${prepareGetUrl({is_home_page: true})}`,
            lang: this.langCode})

          const result = response.data.result

          this.setHomeProducts(result)

          this.currentItems = result.data
          this.loading = false

        } catch (e) {
          showError({
            statusCode: 400,
            message: e.message
          })
        }
      } else {

        this.currentItems = this.products?.data
        this.loading = false
      }
    }
  }
</script>
