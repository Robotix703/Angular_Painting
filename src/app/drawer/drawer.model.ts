export interface Drawer {
    id: string;
    name: string;
    type: string;
    emptySlot: Number[];
    isFull: Boolean;
}

export const sizeDrawerCitadel = {
    X: 3,
    Y: 5,
    totalSize: 15
}

export const sizeDrawerArmy = {
    X: 4,
    Y: 6,
    totalSize: 24
}

export const DrawerTypes = ["Citadel", "Army Painter"];