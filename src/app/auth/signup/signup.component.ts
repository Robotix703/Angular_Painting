import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  //Nom
  selector: 'signup',
  //HTML
  templateUrl: './signup.component.html',

  styleUrls: ["./signup.component.css"]
})

export class SignupComponent implements OnInit, OnDestroy {
  //Gestion du chargement
  isLoading = false;

  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { };

  //Récupération de l'état de
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  //Désabonnement
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  //Gestion du formulaire de création d'utilisateur
  onSignup(form: NgForm) {
    //Vérification invalidité
    if (form.invalid) {
      return;
    }

    this.authService.createUser(form.value.email, form.value.password);
  }
}
