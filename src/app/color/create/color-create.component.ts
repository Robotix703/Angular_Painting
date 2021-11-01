// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Color } from '../color.model';
import { ColorsService } from '../color.service';
import { DrawersService } from 'src/app/drawer/drawer.service';
import { Drawer } from 'src/app/drawer/drawer.model';


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

  private ColorID: string;
  color: Color;

  //Formulaire
  formulaire: FormGroup;
  myControl = new FormControl();

  //Abonnement
  private drawerSub: Subscription;
  
  drawer: Drawer;
  drawersName = [];
  filteredDrawers: Observable<string[]>;

  constructor(public ColorsService: ColorsService, public route: ActivatedRoute, public DrawersService: DrawersService) { }

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

  private _filterDrawers(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.drawersName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {

    //Gestion de la récupération des tiroirs
    this.DrawersService.getDrawersNames();
    this.drawerSub = this.DrawersService.getDrawerUpdateListener()
      .subscribe((drawersData: { drawer: Drawer[] }) => {
        this.drawersName = drawersData.drawer.map(a => a.name);
        this.filteredDrawers = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDrawers(value))
        );
      })


    //Filtre
    this.filteredGamme = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGammes(value))
    );
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
      }),
      drawerName: new FormControl(null, {
        validators: [Validators.minLength(1)]
      }),
      positionX: new FormControl(null, {
        validators: [Validators.min(0), Validators.max(4)]
      }),
      positionY: new FormControl(null, {
        validators: [Validators.min(0), Validators.max(6)]
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
    this.ColorsService.writeColor(this.formulaire.value.name, this.formulaire.value.gamme, this.formulaire.value.type, this.formulaire.value.colorCode, this.formulaire.value.drawerName, this.formulaire.value.positionX, this.formulaire.value.positionY);
  }
}
