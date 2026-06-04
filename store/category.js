const state = () => ({
  categories: null
});

const actions = {
   emptyCategories () {
       this.categories = null
  }
}

export const useCategoryStore = defineStore('category', {
  state,
  actions
});
