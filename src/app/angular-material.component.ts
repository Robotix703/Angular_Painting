import { NgModule } from '@angular/core';

import { MatInputModule } from '@angular/material/input'; //Gestion du module Material Input (Voir documentation / API)
import { MatCardModule } from '@angular/material/card'; //Gestion du module Material Card (Voir documentation / API)
import { MatButtonModule } from '@angular/material/button'; //Gestion du module Material Button (Voir documentation / API)
import { MatToolbarModule } from '@angular/material/toolbar'; //Gestion du module Material toolbar (Voir documentation / API)
import { MatExpansionModule } from '@angular/material/expansion'; //Gestion du module Material expansion (Voir documentation / API)
import { MatFormFieldModule } from '@angular/material/form-field'; //Gestion du module Material expansion (Voir documentation / API)
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator'; //Gestion des numéros de page
import { MatDialogModule } from '@angular/material/dialog'; //Gestion des messages d'erreurs
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    exports: [
        MatPaginatorModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatIconModule,
        MatTableModule,
        MatSidenavModule,
        MatSelectModule,
        MatGridListModule,
        MatCheckboxModule
    ]
})

export class AngularMaterialModule {}
