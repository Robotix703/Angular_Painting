// Importation de l'outil composant de Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Instruction } from '../paint.model';
import { PaintsService } from '../paint.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ColorsService } from 'src/app/color/color.service';
import { Color } from 'src/app/color/color.model';

// Définition du composant
@Component({
  //Nom
  selector: 'app-paint-create',
  //Chemin vers le fichier HTML
  templateUrl: './paint-create.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./paint-create.component.css']
})

export class PaintCreateComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  couleurCtrl = new FormControl();
  filteredCouleurs: Observable<string[]>;
  couleurs: string[] = [];
  allCouleurs: string[] = [];

  private InstructionID: string;
  instruction: Instruction;
  figurineID = "";
  colors = [];
  nextInstruc = 0;

  formulaire: FormGroup;
  private colorsSub: Subscription;
  private instrucSub: Subscription;

  @ViewChild('couleurInput') couleurInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public PaintsService: PaintsService,
    public ColorsService: ColorsService,
    public route: ActivatedRoute
    ) {
    this.filteredCouleurs = this.couleurCtrl.valueChanges.pipe(
      map((color: string | null) => color ? this._filter(color) : this.allCouleurs.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) this.couleurs.push(value.trim());

    if (input) input.value = '';

    this.couleurCtrl.setValue(null);
  }

  remove(color: string): void {
    const index = this.couleurs.indexOf(color);

    if (index >= 0) this.couleurs.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.couleurs.push(event.option.viewValue);
    this.couleurInput.nativeElement.value = '';
    this.couleurCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCouleurs.filter(color => color.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
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

    this.colorsSub = this.ColorsService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {
        this.colors = colorData.color;
        this.allCouleurs = this.colors.map(a => a.name);

        this.filteredCouleurs = this.couleurCtrl.valueChanges.pipe(
          map((color: string | null) => color ? this._filter(color) : this.allCouleurs.slice()));
      })

    this.refreshColors();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("figurineID")) this.figurineID = paramMap.get('figurineID');
      this.PaintsService.getInstructions(this.figurineID);
    });

    this.instrucSub = this.PaintsService.getInstructionUpdateListener()
      .subscribe((instructionData: { instructions: Instruction[], maxInstructions: number }) => {
        this.formulaire.patchValue({step: instructionData.maxInstructions + 1});
      });
  }  

  onSaveInstruction() {
    if (this.formulaire.invalid) return;

    let colorsID = [];
    for(let i = 0 ; i < this.couleurs.length ; i++)
    {
      colorsID.push(this.colors[this.colors.findIndex(o => o.name === this.couleurs[i])].id);
    }

    this.PaintsService.writeInstruction(this.formulaire.value.name, this.formulaire.value.content, this.figurineID, colorsID, this.formulaire.value.step);
  }

  refreshColors() {
    this.ColorsService.getColors();
  }
}