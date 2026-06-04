export function useMetaData() {
    const route = useRoute();

    const getCurrentPath = () => {
        return route.fullPath;
    };

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const slugToText = (text) => {
        let ser = text.replace('--', '-& ')
        ser = ser.replace('-', ' ')
        ser = ser.replace('-', ' ')
        return capitalize(ser)
    };


    const convertToSlug = (text) => {
        return text?.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
    };

    const generatingMeta = (name, content) => {
        return {
            hid: name,
            name: name,
            content: content
        }
    };

    const preloadScript = (href, as = 'script') => {
        return {
            rel: 'preload',
            as,
            href
        }
    };

    const pageMeta = ({meta_title, meta_description, meta_keywords, image_url}) => {
        return {
            title: meta_title,
            meta: [
                generatingMeta('description', meta_description),
                generatingMeta('keywords', meta_keywords),
                generatingMeta('og:image', image_url),
                generatingMeta('og:title', meta_title),
                generatingMeta('og:description', meta_description)
            ]
        }
    };



    const commonMeta = ({meta_title, meta_description, meta_keywords, image_url, api_base, site_url}) => {
        const path = site_url?.replace(/\/+$/, '') + getCurrentPath();

        return {
            title: meta_title,
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                {charset: 'utf-8'},
                {
                    name: 'viewport',
                    content: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1'
                },
                {hid: 'description', name: 'description', content: meta_description},
                {hid: 'keywords', name: 'keywords', content: meta_keywords},
                {hid: 'og:title', name: 'og:title', content: meta_title, 'data-rh': "true"},
                {hid: 'og:type', name: 'og:type', content: 'website', 'data-rh': "true"},
                {hid: 'robots', name: 'robots', content: 'all', 'data-rh': "true"},
                {hid: 'og:url', name: 'og:url', content: path, 'data-rh': "true"},
                {hid: 'og:image', name: 'og:image', 'xmlns:og': "http://opengraphprotocol.org/schema/", content: image_url},
                {hid: 'og:description', name: 'og:description', 'xmlns:og': "http://opengraphprotocol.org/schema/", content: meta_description}
            ],
            link: [
                {rel: 'icon', type: 'image/png', href: '/favicon.png'},
                {rel: 'canonical', path},
                {rel: 'dns-prefetch', href: api_base},
                {
                    rel: 'preload',
                    as: 'font',
                    href: `https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&display=swap`
                }
            ]
        }
    };

    return {
        route,
        capitalize,
        pageMeta,
        slugToText,
        generatingMeta,
        commonMeta,
        preloadScript
    }
}


