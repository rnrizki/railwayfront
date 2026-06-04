const state = () => ({
  orderedList: [],
  ordered: {}
})

const actions = {
  updateOrderData(order) {
    this.ordered = {... this.ordered, ...order};
  },
  setOrderList(orderedList) {
    this.orderedList = orderedList;
  },
}

export const useOrderStore = defineStore('order', {
  state,
  actions
});
