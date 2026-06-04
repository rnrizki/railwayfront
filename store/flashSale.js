const state = () => ({
  products: null,
});

const actions = {
  emptyFlashProducts () {
    this.products = null
  },
  setFlashProducts (products) {
    this.products = products
  }
}

export const useFlashSaleStore = defineStore('flashSale', {
  state,
  actions
});
