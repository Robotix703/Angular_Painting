import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Drawer, DrawerTypes } from '../drawer.model';
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

  private DrawerID: string;
  drawer: Drawer;

  //Formulaire
  formulaire: FormGroup;
  myControl = new FormControl();

  constructor(public DrawersService: DrawersService, public route: ActivatedRoute) { }

  types: string[] = DrawerTypes;
  filteredTypes: Observable<string[]>;

  private _filterTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.types.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.filteredTypes = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTypes(value))
    );

    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^\S*$/)]
      }),
      type: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSaveInstruction() {
    if (this.formulaire.invalid) return;

    this.DrawersService.createDrawer(this.formulaire.value.name, this.formulaire.value.type);
  }
}
