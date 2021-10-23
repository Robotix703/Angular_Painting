// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Drawer } from '../drawer.model';
import { DrawersService } from '../drawer.service';


// Définition du composant
@Component({
  //Nom
  selector: 'app-drawer-create',
  //Chemin vers le fichier HTML
  templateUrl: './drawer-create.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./drawer-create.component.css']
})

// Composant
export class DrawerCreateComponent implements OnInit {

  //ID
  private DrawerID: string;

  //Tiroir à modifier
  drawer: Drawer;

  //Formulaire
  formulaire: FormGroup;
  myControl = new FormControl();

  constructor(public DrawersService: DrawersService, public route: ActivatedRoute) { }

  types: string[] = ['Air', 'Dry', 'Base', 'Layer', 'Contrast', 'Shader', 'Texture', 'Dry', 'Technical', 'Glaze'];
  filteredTypes: Observable<string[]>;

  private _filterTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.types.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {

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

    //Publication du tiroir
    this.DrawersService.writeDrawer(this.formulaire.value.name, this.formulaire.value.type);
  }
}
