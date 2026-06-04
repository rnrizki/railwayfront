import {defineNuxtPlugin, showError} from "nuxt/app";
import {useIndexStore} from "../store";
import {useCommonStore} from "../store/common";
import {storeToRefs} from "pinia";
import {useLanguageStore} from "../store/language";
import {useUserStore} from "../store/user";
import {useAuthStore} from "../store/auth";
import {prepareGetUrl} from "../utils/fetchClient";

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie(config.public.auth_token_key);

    const {setToken} = useAuthStore()

    if (token.value) {
      setToken(token.value);
    }

    const commonStore = useCommonStore()
    const {hasCommonData} = storeToRefs(commonStore)

    const cookieLang = useCookie('currentLanguage');

    const languageStore = useLanguageStore()
    const userStore = useUserStore()
    const {setCommonData, unAuthGet, getRequest} = commonStore

    const {setProfile, getUserToken} = userStore
    const {langCode} = storeToRefs(languageStore)

    const data = await getRequest({
      params: `?${prepareGetUrl({
        user_token: getUserToken()
      })}`,
      lang: langCode.value,
      api: 'profile'
    });

    if (data?.status === 200) {
      setProfile(data.data)
    }

    if (hasCommonData.value) {
      return false
    }

    const response = await unAuthGet({api: 'common', params: '', lang: cookieLang.value})
    const responseData = response.data

    const {setMediaData} = useIndexStore()
    setMediaData(responseData)

    const {setLanguages, setDefaultLanguage, setLangCode, setCurrentLanguage, getLangData} = languageStore
    const {languages, defaultLanguage} = storeToRefs(languageStore)

    setLanguages(responseData.languages)

    if (responseData?.default_language) {
      setDefaultLanguage(responseData.default_language)
    }

    if (cookieLang.value && languages.value[cookieLang.value]) {
      setCurrentLanguage(languages.value[cookieLang.value])

    } else if (responseData.default_language) {
      setCurrentLanguage(responseData.default_language)
    }

    if (cookieLang.value !== defaultLanguage?.value?.code) {
      setLangCode(cookieLang.value)
    } else {
      setLangCode(null)
    }

    await getLangData()

    setCommonData(responseData)

  } catch (e) {
    showError({
      statusCode: 400,
      message: e.message
    })
  }
});
