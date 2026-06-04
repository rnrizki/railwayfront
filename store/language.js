import Service from '@/services/service.js'
import json from '~/jsConfig.json'
import {prepareGetUrl} from "../utils/fetchClient";
import {showError} from "nuxt/app";

const state = () => ({
  langData: null,
  langCode: false,
  languages: {},
  defaultLanguage: {
    name: 'English',
    code: 'en'
  },
  currentLanguage: {
    name: 'English',
    code: 'en'
  },
});

const actions = {
  setLanguages(languages) {
    languages.forEach(i => {
      this.languages[i.code] = i
    })
  },

  setLangCode(langCode) {
    this.langCode = langCode
  },
  setCurrentLanguage(currentLanguage) {
    this.currentLanguage = currentLanguage
  },
  setDefaultLanguage(defaultLanguage) {
    this.defaultLanguage = defaultLanguage
  },
  async setLocalMessages(i18n) {
    if(!this?.langData){

      await this.getLangData(i18n)

    } else if(!this?.currentLanguage?.predefined) {

      i18n.setLocaleMessage(this?.currentLanguage?.code, this?.langData)
    }
  },
  async getLangData() {
    if (!this?.currentLanguage?.predefined) {
      try {
        const fullUrl = `${json.api.localization}?${prepareGetUrl({
          locale_code: this?.currentLanguage?.code
        })}`;

        const data = await Service.unAuthGet(fullUrl)
        if (data?.status && data?.status === 200) {
          this.langData = data.data
         // i18n.setLocaleMessage(this?.currentLanguage?.code, data?.data)

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
  },
}

export const useLanguageStore = defineStore('language', {
  state,
  actions
});
