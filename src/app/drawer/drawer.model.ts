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

export const coordDrawerCitadel = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },

    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },

    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },

    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },

    { x: 0, y: 4 },
    { x: 1, y: 4 },
    { x: 2, y: 4 }
]

export const coordDrawerArmy = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },

    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },

    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },

    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },

    { x: 0, y: 4 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },

    { x: 0, y: 5 },
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 }
]

export const DrawerTypes = ["Citadel", "Army Painter"];