//Définition d'un type de donnée
export interface Color {
  //ID
  id: string;
  //Nom de la couleur
  name: string;
  //Gamme de peinture
  gamme: string;
  //Type de peinture
  type: string;
  //Code couleur
  colorCode: string;
  //Nom du tiroir
  drawerName: string;
  //Position X dans le tiroir
  positionX: number;
  //Position Y dans le tiroir
  positionY: number;
}

export class colorHTMLDisplay {
  private html;
  constructor(colorName: string, colorCode: string) {
      this.html = `<h1>` + colorName + `</h1>`;
  }

  getHTML() {
    return this.html;
  }
}