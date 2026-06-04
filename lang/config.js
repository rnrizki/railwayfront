/** ./i18n/i18n.config.ts */
import en from "./en.json"
import fr from "./fr.json"
import ar from "./ar.json"
import tr from "./tr.json"
import hi from "./hi.json"

export default defineI18nConfig(() => ({
    messages: {
        en,
        fr,
        ar,
        tr,
        hi
    }
}))
