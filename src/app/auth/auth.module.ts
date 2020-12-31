import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule
    ]
})

export class AuthModule {}
