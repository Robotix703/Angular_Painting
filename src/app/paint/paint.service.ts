import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

import { Instruction } from './paint.model';

const URL_BACKEND = environment.apiURL + "paint/";

@Injectable({ providedIn: 'root' })

export class PaintsService {

  private instructions: Instruction[] = [];
  private instructionUpdated = new Subject<{ instructions: Instruction[], maxInstructions: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getInstructionUpdateListener() {
    return this.instructionUpdated.asObservable();
  }

  getInstructions(figurineID: string) {
    const queryParams = `?figurineID=${figurineID}`;

    this.http.get<{ Instructions: any, maxInstructions: number }>(URL_BACKEND + queryParams)
      .pipe(map((data) => {
        return {
          instructions: data.Instructions.map(instruction => {
            return {
              id: instruction._id,
              figurineID: instruction.figurineID,
              name: instruction.name,
              content: instruction.content,
              paintID: instruction.paintID,
              step: instruction.step
            }
          }),
          maxInstructions: data.maxInstructions
        }
      }))
      .subscribe((transformedInstructions) => {
        this.instructions = transformedInstructions.instructions;
        this.instructionUpdated.next({ instructions: [...this.instructions], maxInstructions: transformedInstructions.maxInstructions });
      });
  }

  writeInstruction(name: string, content: string, figurineID: string, paintID: string[], step: number) {
    const instructionData = {
      name: name,
      content: content,
      figurineID: figurineID,
      paintID: paintID,
      step: step
    }

    this.http.post<Instruction>(URL_BACKEND, instructionData)
      .subscribe((responseData: Instruction) => {
        this.router.navigate(["/paint/" + figurineID]);
      });
  }

  deleteInstruction(instructionID: string) {
    return this.http.delete(URL_BACKEND + instructionID);
  }

  getInstruction(id: string) {
    return this.http.get<{ _id: string, name: string, content: string, figurineID: string, paintID: [string], step: number }>(URL_BACKEND + id);
  }

  updateInstruction(id: string, name: string, content: string, figurineID: string, paintID: string[], step: number) {
    let instructionData = {
      id: id,
      name: name,
      content: content,
      figurineID: figurineID,
      paintID: paintID,
      step: step
    }

    this.http.put(URL_BACKEND + id, instructionData)
      .subscribe(reponse => {
        this.router.navigate(["/paint/" + figurineID]);
      });
  }
}
