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
  options: string[] = ['Citadel', 'Army Painter'];
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {

    //Chargement des gammes
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    //Initialisation du formulaire
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      gamme: new FormControl(null, {
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
    this.ColorsService.writeColor(this.formulaire.value.name, this.formulaire.value.gamme);
  }
}
