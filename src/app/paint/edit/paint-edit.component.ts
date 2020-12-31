// Importation de l'outil composant de Angular
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
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

// Composant
export class PaintEditComponent implements OnInit {

  //ID
  private InstructionID: string;
  //Instruction à modifier
  instruction: Instruction;

  //Formulaire
  formulaire: FormGroup;

  constructor(public PaintsService: PaintsService, public route: ActivatedRoute) { }

  ngOnInit() {
    //Initialisation du formulaire
    this.formulaire = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    //Récupération de l'ID de la figurine
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //Recherche de la présence d'un ID
      if(paramMap.has("instructionID"))
      {
        this.InstructionID = paramMap.get('instructionID');

        this.PaintsService.getInstruction(this.InstructionID).subscribe(instructionData => {
          this.instruction = {
            id: instructionData._id,
            name: instructionData.name,
            content: instructionData.content,
            figurineID: instructionData.figurineID,
            paintID: [""]
          }

          //MAJ du formulaire
          this.formulaire.setValue({
            name: this.instruction.name,
            content: this.instruction.content
          });
        });
      }
    });
  }

  //Gestion du click
  onSaveInstruction() {
    //Vérification de la validité du formulaire
    if (this.formulaire.invalid) {
      return;
    }

    //Vérification du mode
    this.PaintsService.updateInstruction(this.InstructionID, this.formulaire.value.name, this.formulaire.value.content, this.instruction.figurineID, [""]);
  }
}
