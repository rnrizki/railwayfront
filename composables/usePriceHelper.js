

export function usePriceHelper({product, productInventory}) {

    const productPrice = computed(() => {

        if (productInventory.value?.inventory_attributes?.length > 0 && productInventory.value?.price > 0) {
            return productInventory.value?.price
        }
        return product.value.price > 0
            ? product.value.price : product.value.offered > 0
                ? product.value.offered : product.value.selling
    });

    const reducedPercent = computed(() => {
        return 100 - parseInt(((currentPricing.value / prevPrice.value) * 100).toString());
    });

    const flashPrice = computed(() => {
        return product.value?.price !== null ? parseFloat(product.value?.price) : null
    });

    const sellPrice = computed(() => {
        return parseFloat(product.value?.selling || 0)
    });

    const offeredPrice = computed(() => {
        return parseFloat(product.value?.offered || 0)
    });

    const prevPrice = computed(() => {
        return parseFloat(offeredPrice.value > 0 ? sellPrice.value : flashPrice.value ? sellPrice.value : 0)
    });

    const currentPricing = computed(() => {
        return parseFloat(flashPrice.value !== null ? flashPrice.value
            : offeredPrice.value > 0 ? offeredPrice.value
                : sellPrice.value)
    });

    const inventoryPrice = computed(() => {
        if(inventory.value?.inventory_attributes.length > 0) {
            return parseFloat(inventory.value?.price) || 0
        }
        return 0
    });

    const currentInventoryPrice = computed(() => {
        return parseFloat(inventoryPrice.value > 0 ? inventoryPrice.value : currentPricing.value)
    });


    return {
        prevPrice, currentPricing, reducedPercent, productPrice
    }
}


