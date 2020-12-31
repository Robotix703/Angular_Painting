//Définition d'un type de donnée
export interface Figurine {
  //ID
  id: string
  //Nom de la figurine
  name: string;
  //Groupe de figurine
  categorie: string;
  //Chemin vers l'image
  imagePath: string;
  //Créateur
  creator: string;
}
