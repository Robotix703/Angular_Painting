// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Color } from '../color.model';
import { ColorsService } from '../color.service';


// Définition du composant
@Component({
  //Nom
  selector: 'app-color-create',
  //Chemin vers le fichier HTML
  templateUrl: './color-create.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./color-create.component.css']
})

// Composant
export class ColorCreateComponent implements OnInit {

  //ID
  private ColorID: string;

  //Couleur à modifier
  color: Color;

  //Formulaire
  formulaire: FormGroup;
  myControl = new FormControl();

  constructor(public ColorsService: ColorsService, public route: ActivatedRoute) { }

  //Gestion des options
  gammes: string[] = ['Citadel', 'Army Painter', 'Air Printer'];
  filteredGamme: Observable<string[]>;

  types: string[] = ['Air', 'Dry', 'Base', 'Layer', 'Contrast', 'Shader', 'Texture', 'Dry', 'Technical', 'Glaze'];
  filteredTypes: Observable<string[]>;

  private _filterGammes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.gammes.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.types.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {

    //Chargement des gammes
    this.filteredGamme = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGammes(value))
    );

    //Chargement des types
    this.filteredTypes = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTypes(value))
    );

    //Initialisation du formulaire
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      gamme: new FormControl(null, {
        validators: [Validators.required]
      }),
      type: new FormControl(null, {
        validators: [Validators.required]
      }),
      colorCode: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  //Gestion du click
  onSaveInstruction() {
    //Vérification de la validité du formulaire
    if (this.formulaire.invalid) {
      return;
    }

    //Publication de la couleur
    this.ColorsService.writeColor(this.formulaire.value.name, this.formulaire.value.gamme, this.formulaire.value.type, this.formulaire.value.colorCode);
  }
}
