// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Drawer } from '../drawer.model';
import { DrawerService } from '../drawer.service';
import { consts } from '../../consts';

// Définition du composant
@Component({
  //Nom
  selector: 'app-color-create',
  //Chemin vers le fichier HTML
  templateUrl: './drawer-create.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./drawer-create.component.css']
})

// Composant
export class DrawerCreateComponent implements OnInit {

  //ID
  private DrawerID: string;

  //Formulaire
  formulaire: FormGroup;
  myControl = new FormControl();

  constructor(public DrawerService: DrawerService, public route: ActivatedRoute) { }

  //Gestion des options
  filteredGamme: Observable<string[]>;
  filteredTypes: Observable<string[]>;

  private _filterGammes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return consts.gammes.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return consts.types.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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
    //this.ColorsService.writeColor(this.formulaire.value.name, this.formulaire.value.gamme, this.formulaire.value.type, this.formulaire.value.colorCode);
  }
}
