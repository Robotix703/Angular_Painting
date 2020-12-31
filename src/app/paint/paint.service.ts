import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//Variables globales
import { environment } from "../../environments/environment";
import { Instruction } from './paint.model';

const URL_BACKEND = environment.apiURL + "paint/";

@Injectable({ providedIn: 'root' })

//Gestion des Peintures
export class PaintsService {

  //Mémoire interne des instructions
  private instructions: Instruction[] = [];

  //Système de mise à jour des instruction
  private instructionUpdated = new Subject<{ instructions: Instruction[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  //Permet de s'abonner aux événement sur les figurines
  getInstructionUpdateListener() {
    return this.instructionUpdated.asObservable();
  }

  //Récupération des instructions
  getInstructions(figurineID: string) {

    const queryParams = `?figurineID=${figurineID}`;

    //Récupération des instructions
    this.http.get<{ Instructions: any }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          instructions: data.Instructions.map(instruction => {
            return {
              id: instruction._id,
              figurineID: instruction.figurineID,
              name: instruction.name,
              content: instruction.content,
              paintID: instruction.paintID,
              creator: instruction.creator
            }
          })
        }
      }))
      .subscribe((transformedInstructions) => {
        this.instructions = transformedInstructions.instructions;
        this.instructionUpdated.next({ instructions: [...this.instructions] });
      });
  }

  //Sauvegarde d'une instruction
  writeInstruction(name: string, content: string, figurineID: string, paintID: string[]) {
    //Stockage image et données
    const instructionData = {
      name: name,
      content: content,
      figurineID: figurineID,
      paintID: paintID
    }

    //Requête POST
    this.http.post<Instruction>(URL_BACKEND, instructionData)
      .subscribe((responseData: Instruction) => {
        //Redirection de l'utilisateur
        this.router.navigate(["/"]);
      });
  }

  //Demande de destruction des données au niveau de la BDD
  deleteInstruction(instructionID: string) {
    //Requête DELTE
    return this.http.delete(URL_BACKEND + instructionID);
  }

  //Récupération d'une instruction
  getInstruction(id: string) {
    return this.http.get<{ _id: string, name: string, content: string, figurineID: string, paintID: [string] }>(URL_BACKEND + id);
  }

  //MAJ instruction
  updateInstruction(id: string, name: string, content: string, figurineID: string, paintID: [string]) {

    //Initialisation
    let instructionData = {
      id: id,
      name: name,
      content: content,
      figurineID: figurineID,
      paintID: paintID
    }

    //Appel AJAX
    this.http.put(URL_BACKEND + id, instructionData)
      .subscribe(reponse => {
        //Redirection de l'utilisateur
        this.router.navigate(["/"]);
      });
  }
}
