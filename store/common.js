import Service from '@/services/service.js'
import {useAuthStore} from "./auth";
import json from '~/jsConfig.json'
import {showError} from "nuxt/app";
import {useUtils} from "../composables/useUtils";
import {storeToRefs} from "pinia";

const state = () => ({
  location: {countryCode: 'AF', region: 'BDS'},
  site_setting: {},
  current_year: 2024,
  currencyIcon: '$',
  setting: {
    currency: 'USD',
    currency_icon: '$',
    decimal_format: 'en-US',
    currency_position: 1,
    phone: '',
    email: '',
  },
  subCategoriesMap: null,
  categories: null,
  hasCommonData: false,
  customScripts: null,
  topBanner: null,
  popupBanner: null,
  headerLinks: {
    left: [],
    right: [],
  },
  services: null,
  about: null,
  payment: null,
  social: null,
  paymentGateway: null,
  toastMessage: "",
  toastMessageStatus: false,
  toastError: false
})

const actions = {
  setLoading(data) {
    this.loading = data
  },
  setCommonData(data) {
    const common = data;

    this.current_year = new Date().getFullYear();

    if (common?.setting) {
      this.setting = common?.setting

      this.location = {
        countryCode: common?.setting?.default_country,
        region: common?.setting?.default_state
      }

      this.currencyIcon = this.setting.currency_icon
    }

    if (common?.site_setting) {
      const {getImageURL} = useUtils();
      this.site_setting = {
        ...common.site_setting,
        ...{image_url: getImageURL(common.site_setting.header_logo)}
      };
    }

    this.headerLinks = common?.header_links
    this.popupBanner = common?.popup_banner
    this.topBanner = common?.top_banner
    this.categories = common?.categories
    this.customScripts = common?.custom_scripts

    this.services = common?.services
    this.about = common?.about
    this.payment = common?.payment
    this.social = common?.social

    this.hasCommonData = true
  },
  setPaymentGateway(paymentGateway) {
    this.paymentGateway = paymentGateway;
  },
  setSubCatMap(categories) {
    const subCategoriesMap = {}
    categories?.forEach(i => {
      i?.public_sub_categories?.forEach(j => {
        subCategoriesMap[j.id] = {title: i.id, slug: i.slug}
      })
    })
    this.subCategoriesMap = subCategoriesMap
  },
  async postRequest({params, api, lang}) {
    try {
      const authStore = useAuthStore();
      const {token} = storeToRefs(authStore);
      return await Service.postRequest(json.api[api], params, token.value, lang);
    } catch (e) {

      if (e?.status === 401) {
        logUserOut();
        return navigateTo('/login');
      } else {
        showError({
          statusCode: 400,
          message: e.message
        })
      }
    }
  },
  async deleteRequest({api, params}) {
    const authStore = useAuthStore();
    const {token} = storeToRefs(authStore);

    try {
      return await Service.deleteRequest(`${json.api[api]}${params}`, token.value)
    } catch (e) {

      if (e?.status === 401) {
        logUserOut();
        return navigateTo('/login');

      } else {
        showError({
          statusCode: 400,
          message: e.message
        })
      }
    }
  },
  async unAuthPost({params, api, lang}) {
    try {
      return await Service.unAuthPost(json.api[api], params, lang)
    } catch (e) {

      showError({
        statusCode: 400,
        message: e.message
      })
    }
  },
  async unAuthGet({api, params, lang}) {
    try {
      const data = await Service.unAuthGet(`${json.api[api]}${params}`, lang);

      if (data?.status === 200) {
        return data
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
  },

  async bgGetRequest({params, api, lang}) {
    try {
      const authStore = useAuthStore();
      const {token} = storeToRefs(authStore);
      return await Service.getRequest(`${json.api[api]}${params}`, token.value, lang)
    } catch (e) {
      if (e?.status === 401) {
        logUserOut();
        return navigateTo('/login');
      } else {
        console.error(e)
      }
    }
  },
  async getRequest({params, api, lang}) {
    const authStore = useAuthStore();
    const {token} = storeToRefs(authStore);
    const {logUserOut} = authStore;

    try {
      const data = await Service.getRequest(`${json.api[api]}${params}`, token.value, lang)

      if (data?.status) {
        return data
      } else {

        showError({
          statusCode: 400,
          message: data?.message
        })

      }
    } catch (e) {
      if (e?.status === 401) {
        logUserOut();
        return navigateTo('/login');
      } else {
        showError({
          statusCode: 400,
          message: e.message
        })
      }
    }
  },
  setToastMessage(message) {
    this.toastError = false
    this.toastMessageStatus = true
    this.toastMessage = message
  },
  setToastError(message) {
    this.toastError = true
    this.toastMessageStatus = true
    this.toastMessage = message
  },
  hideToast() {
    this.toastMessageStatus = false
    this.toastError = false
    this.toastMessage = ''
  },
}

export const useCommonStore = defineStore('common', {
  state,
  actions
});
