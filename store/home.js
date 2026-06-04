const state = () => ({
  slider: null,
  banners: null,
  collections: null,
  siteFeatures: null,
  featuredCategories: null,
  featuredBrands: null,
  flashSales: null,
  hasHomeData: null,
  products: null
});

const actions = {
  setHomeProducts(data){
    this.products = data
  },
  setFlashSale(data){
    this.flashSales =  data
  },
  setHomeData(data){
    const home = data.data

    this.hasHomeData = true
    this.slider = home?.slider
    this.siteFeatures = home?.site_features
    this.banners =  home?.banners
    this.collections =  home?.collections
    this.featuredCategories =  home?.featured_categories
    this.featuredBrands =  home?.featured_brands
    this.flashSales =  home?.flash_sales
  }
}

export const useHomeStore = defineStore('home', {
  state,
  actions
});
