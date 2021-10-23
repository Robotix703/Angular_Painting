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

import { DrawerCreateComponent } from './drawer/create/drawer-create.component';
import { DrawerListComponent } from './drawer/list/drawer-list.component';

const routes: Routes = [
    //Main page
    { path: '', component: FigurineListComponent },

    //Figurine
    { path: 'create', component: FigurineCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:figurineID', component: FigurineCreateComponent, canActivate: [AuthGuard] },

    //Peinture
    { path: 'paint/:figurineID', component: PaintListComponent, canActivate: [AuthGuard] },

    //Instruction
    { path: 'instruction/create/:figurineID', component: PaintCreateComponent, canActivate: [AuthGuard] },
    { path: 'instruction/edit/:instructionID', component: PaintEditComponent, canActivate: [AuthGuard] },

    //Couleurs
    { path: 'color/create', component: ColorCreateComponent, canActivate: [AuthGuard] },
    { path: 'color/list', component: ColorListComponent, canActivate: [AuthGuard] },

    //Drawer
    { path: 'drawer/create', component: DrawerCreateComponent, canActivate: [AuthGuard] },
    { path: 'drawer/list', component: DrawerListComponent, canActivate: [AuthGuard] },

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
