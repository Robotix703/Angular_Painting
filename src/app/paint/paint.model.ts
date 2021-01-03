//Définition d'un type de donnée
export interface Instruction {
  //ID
  id: string;
  //FigurineID
  figurineID: string;
  //Nom du type de peinture
  name: string;
  //Texte de l'instructions
  content: string;
  //Liste des peintures
  paintID: string[];
  //Etape
  step: number;
}
