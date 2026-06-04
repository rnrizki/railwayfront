const state = () => ({
  product: null,
  suggested: null,
});

const actions = {
  updateWishlist(data){
    this.product = {...this.product, ...{wishlisted: data?.data ? 1 : null}}
  },
  setProduct(data){
    this.product = data
  },
  emptySuggestedProducts () {
    this.suggested = null
  }
}

export const useDetailStore = defineStore('detail', {
  state,
  actions
});
