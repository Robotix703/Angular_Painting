// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';

import { Figurine } from '../figurine.model';
import { FigurinesService } from '../figurine.service';

import { mimeType } from "./mime-type.validator";

// Définition du composant
@Component({
  //Nom
  selector: 'app-figurine-create',
  //Chemin vers le fichier HTML
  templateUrl: './figurine-create.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./figurine-create.component.css']
})

// Composant
export class FigurineCreateComponent implements OnInit {

  //Mode d'édition ou de création
  private mode = 'create';
  //ID
  private figurineID: string;
  //Figurine à modifier
  figurine: Figurine;

  //Formulaire
  formulaire: FormGroup;
  //Image
  imagePreview: string;

  constructor(public FigurinesService: FigurinesService, public route: ActivatedRoute) {}

  //Au lancement
  ngOnInit() {
    //Initialisation du formulaire
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      categorie: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    //Paramètres passés dans l'URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //Recherche de la présence d'un ID
      if(paramMap.has("figurineID"))
      {
        this.mode = 'edit';
        //Récupération de l'ID
        this.figurineID = paramMap.get('figurineID');
        //Récupération du Post
        this.FigurinesService.getFigurine(this.figurineID).subscribe(figurineData => {
          this.figurine = {
            id: figurineData._id,
            name: figurineData.name,
            categorie: figurineData.categorie,
            imagePath: figurineData.imagePath
          }

          //MAJ du formulaire
          this.formulaire.setValue({
            name: this.figurine.name,
            categorie: this.figurine.categorie,
            image: this.figurine.imagePath
          });
        });
      }else{
        this.mode = 'create';
        this.figurineID = null;
      }
    });
  }

  //Gestiond de la récupération de l'image
  onImagePicked(event: Event) {
    //Récupération de l'image
    const file = (event.target as HTMLInputElement).files[0];

    //Ajout de l'image dans le formulaire
    this.formulaire.patchValue({image: file});

    //Signalement de la validité
    this.formulaire.get('image').updateValueAndValidity();
    //Lecture de l'image
    const reader = new FileReader();
    //Chargement de l'image
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    //URL de l'image
    reader.readAsDataURL(file);
  }

  //Gestion du click
  onSavePost(){
    //Vérification de la validité du formulaire
    if(this.formulaire.invalid)
    {
      return;
    }

    //Vérification du mode
    if(this.mode == "create")
    {
      this.FigurinesService.addFigurine(this.formulaire.value.name, this.formulaire.value.categorie, this.formulaire.value.image);
    }
    else
    {
      this.FigurinesService.updateFigurine(this.figurineID, this.formulaire.value.name, this.formulaire.value.categorie, this.formulaire.value.image);
    }

    //vide le formulaire
    this.formulaire.reset();
  }
}
