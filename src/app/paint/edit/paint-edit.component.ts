// Importation de l'outil composant de Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Instruction } from '../paint.model';
import { PaintsService } from '../paint.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ColorsService } from 'src/app/color/color.service';
import { map, startWith } from 'rxjs/operators';
import { Color } from 'src/app/color/color.model';

// Définition du composant
@Component({
  //Nom
  selector: 'app-paint-edit',
  //Chemin vers le fichier HTML
  templateUrl: './paint-edit.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./paint-edit.component.css']
})

// Composant
export class PaintEditComponent implements OnInit {

  //ID
  private InstructionID: string;
  //Instruction à modifier
  instruction: Instruction;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  couleurCtrl = new FormControl();
  filteredCouleurs: Observable<string[]>;
  couleurs: string[] = [];
  allCouleurs: string[] = [];

  //Formulaire
  formulaire: FormGroup;

  //Color
  colors = [];

  //Abonnement aux couleurs
  private colorsSub: Subscription;

  @ViewChild('couleurInput') couleurInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public PaintsService: PaintsService, public ColorsService: ColorsService, public route: ActivatedRoute) {
    this.filteredCouleurs = this.couleurCtrl.valueChanges.pipe(
      startWith(null),
      map((color: string | null) => color ? this._filter(color) : this.allCouleurs.slice()));
  }

  //Suppression d'un élément
  remove(fruit: string): void {
    const index = this.couleurs.indexOf(fruit);

    if (index >= 0) {
      this.couleurs.splice(index, 1);
    }
  }

  //Ajoute un élément sélectionné
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.couleurs.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.couleurCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.couleurs.push(event.option.viewValue);
    this.couleurInput.nativeElement.value = '';
    this.couleurCtrl.setValue(null);
  }

  ngOnInit() {
    //Initialisation du formulaire
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      step: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    //Demande récupération des couleurs
    this.ColorsService.getColors();

    //Gestion de la récupération des couleurs
    this.colorsSub = this.ColorsService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {
        //Récupération des posts
        this.colors = colorData.color;
        this.allCouleurs = this.colors.map(a => a.name);
      })

    //Récupération de l'ID de la figurine
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //Recherche de la présence d'un ID
      if (paramMap.has("instructionID")) {
        this.InstructionID = paramMap.get('instructionID');

        this.PaintsService.getInstruction(this.InstructionID).subscribe(instructionData => {
          this.instruction = {
            id: instructionData._id,
            name: instructionData.name,
            content: instructionData.content,
            figurineID: instructionData.figurineID,
            paintID: instructionData.paintID,
            step: instructionData.step
          }

          //MAJ du formulaire
          this.formulaire.setValue({
            name: this.instruction.name,
            content: this.instruction.content,
            step: this.instruction.step
          });

          //MAJ de la selection des couleurs
          for(let i = 0 ; i < this.instruction.paintID.length ; i++){
            this.couleurs.push(this.colors.find(e => e.id === this.instruction.paintID[i]).name)
          }
        });
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCouleurs.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  //Gestion du click
  onSaveInstruction() {
    //Vérification de la validité du formulaire
    if (this.formulaire.invalid) {
      return;
    }

    //Recherche des ID des couleurs selectionnées
    let colorsID = [];
    for (let i = 0; i < this.couleurs.length; i++) {
      colorsID.push(this.colors[this.colors.findIndex(o => o.name === this.couleurs[i])].id);
    }

    //Vérification du mode
    this.PaintsService.updateInstruction(this.InstructionID, this.formulaire.value.name, this.formulaire.value.content, this.instruction.figurineID, colorsID, this.formulaire.value.step);
  }
}
