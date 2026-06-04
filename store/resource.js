const state = () => ({
  countryList: null,
  phoneList: null,
});

const actions = {
  setCountryList (list) {
    this.countryList = list
  },
  setPhoneList (list) {
    this.phoneList = list
  }
}

export const useResourceStore = defineStore('resource', {
  state,
  actions
});
