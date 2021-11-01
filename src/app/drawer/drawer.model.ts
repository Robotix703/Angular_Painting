//Définition d'un type de donnée
export interface Drawer {
    //ID
    id: string;
    //Nom de la couleur
    name: string;
    //Type de peinture
    type: string;
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