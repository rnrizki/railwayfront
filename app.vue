<template>
    <NuxtLayout>
        <VitePwaManifest/>
        <NuxtPage/>
    </NuxtLayout>
</template>
<script setup>
    import {useLanguageStore} from "~/store/language";

    const languageStore = useLanguageStore();
    const {setLocaleMessage, locale} = useI18n();
    const {langData, currentLanguage} = storeToRefs(languageStore);

    if (langData.value) {
      setLocaleMessage(currentLanguage.value.code, langData.value);
    }

    locale.value = currentLanguage.value.code;
</script>
