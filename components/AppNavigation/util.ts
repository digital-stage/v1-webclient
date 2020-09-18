export function isActive(
    arr: Array<any>,
    item: any,
    activeItem: any,
): boolean {
    let active = false;
    for (let i = 0; i < arr.length; i++) {
        const elm = arr[i];
        if (elm === item) {
            if (item === activeItem) return true;
            return isActive(
                (item && item.nav) || [],
                activeItem,
                activeItem,
            );
        } else if (elm.nav) {
            active = isActive(elm.nav || [], item, activeItem);
        }
    }
    return active;
}

export function renderItem(item: any) {
    return item.label;
}