export default {

  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {

      const ignoreData = event.target.getAttribute('data-ignore')
      const ignoreId = el.getAttribute('id')


      if (ignoreData && ignoreId) {
        return false
      }

      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided method
        if (typeof binding.value === "function") {
          binding.value(event);
        }
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
    el.clickOutsideHandler = null;
  },
};

