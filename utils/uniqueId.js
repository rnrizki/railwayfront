let idCounter = 0;

export function generateUniqueId(prefix = 'id') {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
}
