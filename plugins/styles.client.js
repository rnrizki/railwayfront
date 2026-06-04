import {useCommonStore} from "~/store/common";
import {storeToRefs} from "pinia";

export default defineNuxtPlugin(() => {
    const {site_setting} = storeToRefs(useCommonStore());
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = site_setting.value?.styling;
    document.head.appendChild(style);
})
