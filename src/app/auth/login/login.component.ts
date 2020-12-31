import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
    //Nom
    selector: 'login',
    //HTML
    templateUrl: './login.component.html',

    styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit, OnDestroy{
    //Gestion du chargement
    isLoading = false;

    private authStatusSub: Subscription;

    constructor(public authService: AuthService) {};

    //Récupération de l'état de 
    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
            this.isLoading = false;
        });
    }

    //Désabonnement
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }

    //Gestion du formulaire de connexion
    onLogin(form: NgForm){
        //Gestion formulaire invalid
        if(form.invalid){
            return;
        }

        //Interrogation du service de connexion
        this.authService.login(form.value.email, form.value.password);
    }
}