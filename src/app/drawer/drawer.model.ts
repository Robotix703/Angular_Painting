//Définition d'un type de donnée
export interface Drawer {
  //ID
  id: string;
  //Nom du tiroir
  name: string;
  //Gamme de peinture dans le tiroir
  gamme: string;
  //Type de peinture dans le tiroir
  type: string;
  //ID des couleurs
  colorsID: string[];
}
