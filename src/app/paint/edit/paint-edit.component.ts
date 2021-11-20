// Importation de l'outil composant de Angular
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

import { ColorsService } from 'src/app/color/color.service';
import { Color } from 'src/app/color/color.model';
import { Instruction } from '../paint.model';
import { PaintsService } from '../paint.service';

// Définition du composant
@Component({
  //Nom
  selector: 'app-paint-edit',
  //Chemin vers le fichier HTML
  templateUrl: './paint-edit.component.html',
  //Lien vers la fichier CSS
  styleUrls: ['./paint-edit.component.css']
})

export class PaintEditComponent implements OnInit {

  private InstructionID: string;
  instruction: Instruction;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  couleurCtrl = new FormControl();
  filteredCouleurs: Observable<string[]>;
  couleurs: string[] = [];
  allCouleurs: string[] = [];
  colors = [];

  formulaire: FormGroup;

  private colorsSub: Subscription;

  @ViewChild('couleurInput') couleurInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public PaintsService: PaintsService, 
    public ColorsService: ColorsService, 
    public route: ActivatedRoute,
    public cdr: ChangeDetectorRef) {
    this.filteredCouleurs = this.couleurCtrl.valueChanges.pipe(
      startWith(null),
      map((color: string | null) => color ? this._filter(color) : this.allCouleurs.slice()));
  }

  remove(color: string): void {
    const index = this.couleurs.indexOf(color);

    if (index >= 0) this.couleurs.splice(index, 1);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) this.couleurs.push(value.trim());

    if (input) input.value = '';

    this.couleurCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.couleurs.push(event.option.viewValue);
    this.couleurInput.nativeElement.value = '';
    this.couleurCtrl.setValue(null);
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

    this.ColorsService.getColors();

    this.colorsSub = this.ColorsService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {
        this.colors = colorData.color;
        this.allCouleurs = this.colors.map(a => a.name);

        if(this.instruction) this.displayColor(this.instruction.paintID);
      })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
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

          this.formulaire.setValue({
            name: this.instruction.name,
            content: this.instruction.content,
            step: this.instruction.step
          });

          if(this.colors.length != 0){
            for(let i = 0 ; i < this.instruction.paintID.length ; i++){
              this.couleurs.push(this.colors.find(e => e.id === this.instruction.paintID[i]).name)
            }
          }
        });
      }
    });
  }

  displayColor(colorIDs: any[]){
    if(this.colors){
      for(let i = 0 ; i < colorIDs.length ; i++){
        const colorName = this.colors.find(e => e.id == colorIDs[i]).name;
        this.couleurs.push(colorName);
        this.couleurInput.nativeElement.value = '';
        this.couleurCtrl.setValue(null);
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCouleurs.filter(color => color.toLowerCase().indexOf(filterValue) === 0);
  }

  onSaveInstruction() {
    if (this.formulaire.invalid) return;

    let colorsID = [];
    for (let i = 0; i < this.couleurs.length; i++) {
      colorsID.push(this.colors[this.colors.findIndex(o => o.name === this.couleurs[i])].id);
    }

    this.PaintsService.updateInstruction(this.InstructionID, this.formulaire.value.name, this.formulaire.value.content, this.instruction.figurineID, colorsID, this.formulaire.value.step);
  }
}
