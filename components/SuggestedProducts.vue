<template>
  <transition name="fade" mode="out-in">
    <div v-if="!fetchingSuggested">
      <products-dynamic
        v-if="suggested1.length"
        :title="$t('suggestedProducts.recommendedForYou')"
        :item-list="suggested1"
        :per-page="perPageSuggested1"
        :total-item="totalSuggested1"
        @change="change(1, $event)"
        class="b-t pt-20 pt-sm-15 npb-5"
      />

      <products-dynamic
        v-if="suggested2.length"
        :title="$t('suggestedProducts.alsoViewed')"
        :item-list="suggested2"
        :total-item="totalSuggested2"
        :per-page="perPageSuggested2"
        @change="change(2, $event)"
        class="b-t pt-20 pt-sm-15 pb-15 pb-sm-5"
      />
    </div>
    <div
      class="spinner-wrapper flex "
      v-else
    >
      <spinner
        :radius="100"
      />
    </div>

  </transition>
</template>

<script>
  import util from '~/mixin/util'
  import ProductsSlider from '~/components/ProductsSlider'
  import Spinner from "./Spinner";
  import ProductsDynamic from "~/components/ProductsDynamic";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "../utils/fetchClient";
  import {useCommonStore} from "../store/common";

  export default {
    setup(){
      const languageStore = useLanguageStore()
      const {langCode} = storeToRefs(languageStore)

      const commonStore = useCommonStore()
      const {unAuthGet} = commonStore

      return {unAuthGet, langCode}
    },

    name: 'SuggestedProducts',
    data() {
      return {
        fetchingSuggested: true,
        suggestedData: null,
        lastPage: 1,
        currentPage: 1,
        totalSuggested1: 0,
        totalSuggested2: 0,
        perPageSuggested1: 0,
        perPageSuggested2: 0,
        suggested1: [],
        suggested2: [],
        loaded: []
      }
    },
    watch: {},
    props: {
      productId: {
        type: String,
        default: ''
      },
    },
    components: {ProductsDynamic, Spinner, ProductsSlider },
    computed: {

    },
    mixins: [util],
    methods: {
      async fetchSuggested(page, type = 0) {
        if(type === 1){
          this.suggested1 = this.suggested1.concat(['', '', '', '', ''])
        }else if(type === 2) {
          this.suggested2 = this.suggested2.concat(['', '', '', '', ''])
        }else{
          this.suggested1 = this.suggested1.concat(['', '', '', '', ''])
          this.suggested2 = this.suggested2.concat(['', '', '', '', ''])
        }

        this.loaded.push(page)
        const response = await this.unAuthGet({
          api: 'suggested_products',
          params: `/${this.productId}?${prepareGetUrl({
            page: page
          })}`,
          lang: this.langCode
        })
        this.fetchingSuggested = false
        this.suggestedData = response.data


        if(type === 1){
          this.suggested1.splice(this.suggested1.length - 5, 5)
        }else if(type === 2) {
          this.suggested2.splice(this.suggested2.length - 5, 5)
        }else{
          this.suggested1.splice(this.suggested1.length - 5, 5)
          this.suggested2.splice(this.suggested2.length - 5, 5)
        }


        if(this.suggestedData?.suggestion_1?.data){
          this.suggested1 = this.suggested1.concat(this.suggestedData?.suggestion_1?.data)
        }

        if(this.suggestedData?.suggestion_2?.data){
          this.suggested2 = this.suggested2.concat(this.suggestedData?.suggestion_2?.data)
        }


        if(page === 1){

          const total1 = this.suggestedData?.suggestion_1?.total
          const perPage1 = this.suggestedData?.suggestion_1?.per_page
          const lastPage1 = this.suggestedData?.suggestion_1?.last_page

          if(total1 < perPage1){
            this.totalSuggested1 = lastPage1 * perPage1
           // this.totalSuggested1 = total1
          }else {
            this.totalSuggested1 = total1
          }

          const total2 = this.suggestedData?.suggestion_2?.total
          const perPage2 = this.suggestedData?.suggestion_2?.per_page
          const lastPage2 = this.suggestedData?.suggestion_2?.last_page

          if(total2 < perPage2){
            this.totalSuggested2 = lastPage2 * perPage2
          }else {
            this.totalSuggested2 = total2
          }

          this.perPageSuggested1 = perPage1
          this.perPageSuggested2 = perPage2

          const lastPageSug1 = lastPage1 ?? 0
          const lastPageSug2 = lastPage2 ?? 0
          if(lastPageSug2 > lastPageSug1){
            this.lastPage = lastPageSug2
          }else{
            this.lastPage = lastPageSug1
          }
        }
      },
      async change(type, evt){
        this.currentPage += evt

        if(this.currentPage < 1){
          this.currentPage = this.lastPage
        }else if(this.currentPage > this.lastPage){
          this.currentPage = 1
        }
        if(this.loaded.indexOf(this.currentPage) === -1){
          await this.fetchSuggested(this.currentPage, type)
        }
      }
    },
    created() {
    },
    async mounted() {
      await this.fetchSuggested(this.currentPage)
    }
  }
</script>

