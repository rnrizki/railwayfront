const state = () => ({
  userToken: null,
  profile: null,
  vouchers: null,
  allAddress: []
});

const actions = {
  updateAddress(address) {
    const index = this.allAddress.data.findIndex(obj => {
      return parseInt(obj.id) === parseInt(address.id)
    })
    if (index > -1) {
      this.allAddress.data.splice(index, 1, address)
    } else {
      this.allAddress.data.unshift(address)
    }
  },
  setUserToken(userToken) {
    localStorage.setItem('user_token', userToken)
    this.userToken = userToken
  },
  getUserToken() {
    if (!this.userToken) {
      let token = localStorage.getItem('user_token', null)
      if(!token) {
        token = Math.random().toString(36).slice(2, 5) + (+new Date * Math.random()).toString(36).substring(0, 12) +
          Math.random().toString(36).slice(2, 5)
      }
      this.setUserToken(token)
    }
    return this.userToken
  },
  setProfile(params) {
    this.profile = {...this.profile, ...params}
  },
  setVouchers(vouchers) {
    this.vouchers = vouchers;
  },
  setAllAddress(allAddress) {
    this.allAddress = allAddress;
  },
  emptyVoucher() {
    this.vouchers = null
  },
}

export const useUserStore = defineStore('user', {
  state,
  actions
});

