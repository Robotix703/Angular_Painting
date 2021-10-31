import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Gestion des formulaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.component';
import { MatExpansionModule } from '@angular/material/expansion';

import { PaintCreateComponent } from './create/paint-create.component';
import { PaintListComponent } from './list/paint-list.component';
import { PaintEditComponent } from './edit/paint-edit.component';

@NgModule({
  declarations: [
    PaintCreateComponent,
    PaintListComponent,
    PaintEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    MatFormFieldModule,
    RouterModule,
    MatExpansionModule
  ]
})
export class PaintModule { }
