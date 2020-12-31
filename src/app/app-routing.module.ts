import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router"

import { AuthGuard } from './auth/auth.guard';
import { ColorCreateComponent } from './color/create/color-create.component';
import { ColorListComponent } from './color/list/color-list.component';
import { FigurineCreateComponent } from './figurine/create/figurine-create.component';
import { FigurineListComponent } from './figurine/list/figurine-list.component';
import { PaintCreateComponent } from './paint/create/paint-create.component';
import { PaintEditComponent } from './paint/edit/paint-edit.component';
import { PaintListComponent } from './paint/list/paint-list.component';

const routes: Routes = [
    //Main page
    { path: '', component: FigurineListComponent },
    //Création de figurines
    { path: 'create', component: FigurineCreateComponent, canActivate: [AuthGuard] },
    //Edition des figurines
    { path: 'edit/:figurineID', component: FigurineCreateComponent, canActivate: [AuthGuard] },

    //Affichage Peinture
    { path: 'paint/:figurineID', component: PaintListComponent, canActivate: [AuthGuard] },

    //Edition instruction
    { path: 'instruction/create/:figurineID', component: PaintCreateComponent, canActivate: [AuthGuard] },
    //Edition instruction
    { path: 'instruction/edit/:instructionID', component: PaintEditComponent, canActivate: [AuthGuard] },

    //Création de couleurs
    { path: 'color/create', component: ColorCreateComponent, canActivate: [AuthGuard] },
    //Lecture des couleurs
    { path: 'color/list', component: ColorListComponent, canActivate: [AuthGuard] },

    //Routes filles
    { path: "auth", loadChildren: () => import("./auth/auth.module").then(module => module.AuthModule) }
];

@NgModule({
    //Utilisation des routes
    imports: [RouterModule.forRoot(routes)],
    //Utilisation du routeur
    exports: [RouterModule],
    //Gestion des autorisations
    providers: [AuthGuard]
})

//Gestion des différentes pages
export class AppRoutingModule {}
