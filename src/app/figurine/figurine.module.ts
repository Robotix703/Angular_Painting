import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //Gestion des formulaires
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.component';
import { FigurineCreateComponent } from './create/figurine-create.component';
import { FigurineListComponent } from './list/figurine-list.component';


@NgModule({
    declarations: [
        FigurineListComponent,
        FigurineCreateComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class FigurineModule {}
