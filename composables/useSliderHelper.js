import {useUtils} from "~/composables/useUtils";

export function useSliderHelper(activeSlide, sliderLoaded) {

    const onChange = ({index}, id="home-hero") => {
        activeSlide.value = index;
        const {getImageURL} = useUtils();

        const img = loadedImage(index, id);
        const setLoadingState = () => {
            img.style.opacity = 1;
        };

        img?.addEventListener('load', setLoadingState)
        img?.addEventListener('error', () => {
            img.style.opacity = 1;
            img.src = getImageURL();
        })
    };

    const onFirstImageLoad = (index = 0, id="home-hero") => {
        activeSlide.value = index;
        const img = loadedImage(index, id)
        const setLoadingState = () => {
            sliderLoaded.value = true
            img.style.opacity = 1
        }

        img?.addEventListener('load', setLoadingState)
        img?.addEventListener('error', () => {
            sliderLoaded.value = true;
            img.style.opacity = 1;
            img.src = getImageURL();
        })
    };

    const loadedImage = (index = 0, id="home-hero") => {
        const firstImg = document.getElementById(`${id}-${index}`);
        firstImg?.setAttribute('src', firstImg?.getAttribute('data-src'));
        return firstImg;
    }

    return {
        onChange, onFirstImageLoad
    }
}


