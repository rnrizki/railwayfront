import {defineNuxtPlugin, showError} from "nuxt/app";
import {useIndexStore} from "../store";
import {useCommonStore} from "../store/common";
import {storeToRefs} from "pinia";
import {useLanguageStore} from "../store/language";
import {useAuthStore} from "../store/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    try{
        const config = useRuntimeConfig();
        const token = useCookie(config.public.auth_token_key);

        const {setToken} = useAuthStore()

        if(token.value) {
            setToken(token.value);
        }

        const commonStore = useCommonStore()
        const {hasCommonData} = storeToRefs(commonStore)
        if (hasCommonData.value){
            return false
        }

        const cookieLang = useCookie('currentLanguage');

        const {setCommonData, unAuthGet} = commonStore

        const response = await unAuthGet({api: 'common', params: '', lang: cookieLang.value})

        const responseData = response.data

        const {setMediaData} = useIndexStore()
        setMediaData(responseData)

        const languageStore = useLanguageStore()
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


    }catch(e){
        showError({
            statusCode: 400,
            message: e.message
        })
    }


});
