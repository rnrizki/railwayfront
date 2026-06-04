import Service from '@/services/service.js'
import json from '~/jsConfig.json'
import {showError} from "nuxt/app";

const state = () => ({
  products: null,
  allCategories: null,
  categoryData: null,
  brands: null,
  collections: null,
  shippingRules: null,
  searched: '',
  searchedSuggestion: null
});

const actions = {
  setProducts(data) {
    this.products = data?.data?.result;

    if(data?.data?.all_categories){
      this.allCategories = data.data.all_categories
    }

    if(data?.data?.category){
      this.categoryData = data.data.category
    }

    if(data?.data?.collections){
      this.collections = data.data.collections
    }

    if(data?.data?.brands){
      this.brands = data.data.brands
    }

    if(data?.data?.shipping){
      this.shippingRules = data.data.shipping
    }
  },
  updateSearch(data) {
    this.searched = data
  },
  setSearchedSuggestion(search = null) {
    this.searchedSuggestion = search
  },
  emptyProducts() {
    this.products = null
  },
  async fetchProducts (params) {
    try {
      const {data} = await Service.unAuthGet(json.api.products, params)

      if(data?.status === 200){
        this.setProducts(data)

      } else {
        showError({
          statusCode: 400,
          message: data?.message
        })
      }
    } catch (e) {

      showError({
        statusCode: 400,
        message: e.message
      })
    }
  }
}

export const useListingStore = defineStore('listing', {
  state,
  actions
});
