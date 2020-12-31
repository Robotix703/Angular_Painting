import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    //Connexion
    { path: 'login', component: LoginComponent },
    //Inscription
    { path: 'signup', component: SignupComponent }
]

@NgModule({
    imports: [
        //Routes fils de la route principale
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class AuthRoutingModule {}