import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Gestion des formulaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ColorCreateComponent } from './create/color-create.component';
import { ColorListComponent } from './list/color-list.component';

@NgModule({
  declarations: [
    ColorCreateComponent,
    ColorListComponent
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
export class ColorModule { }
