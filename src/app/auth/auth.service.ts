import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

//Variables globales
import { environment } from "../../environments/environment";

const URL_BACKEND = environment.apiURL + "user";
@Injectable({ providedIn: "root" })

export class AuthService {

  //Sauvegarde du token
  private token: string;
  //Etat de connexion
  private authStatus = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer;
  private userId: string;

  //Gestion connexion à NodeJs
  constructor(private http: HttpClient, private router: Router) { }

  //Récupération du token
  getToken() {
    return this.token;
  }

  //Récupération de l'état de connexion
  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  //Création d'utilisateur
  createUser(email: string, password: string) {
    //Gestion des identifiants
    const authData: AuthData = { email: email, password: password };

    //Requête
    this.http.post(URL_BACKEND + "/signup", authData)
      .subscribe(reponse => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatus.next(false);
      });
  }

  //Récupération user ID
  getUserId() {
    return this.userId;
  }

  //Connexion
  login(email: string, password: string) {
    //Gestion des identifiants
    const authData: AuthData = { email: email, password: password };

    //Requête
    this.http.post<{ token: string, expiresIn: number, userId: string }>(URL_BACKEND + "/login", authData)
      .subscribe(reponse => {
        //Récupération du token
        const token = reponse.token;
        this.token = token;

        if (token) {
          //Signalement à tout ceux qui écoutent
          this.authStatus.next(true);
          this.isAuthenticated = true;

          //User ID
          this.userId = reponse.userId;

          //Récupération du temps d'expiration
          const expiresDuration = reponse.expiresIn;
          this.setAuthTimer(expiresDuration);

          //Sauvegarde du token
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);

          //Redirection
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatus.next(false);
      });
  }

  //Connexion auto avec le token sauvegardé
  autoAuthUser() {
    //Récupérationd es informations
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    //Calcul de la date d'expiration
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    //Connexion
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.userId = authInformation.userId;
      this.authStatus.next(true);
    }
  }

  //Déconnexion
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;

    //Redirection
    this.router.navigate(['/']);
  }

  //Gestion sauvegarde du token
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    //Utilisation du local Storage du navigateur
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  //Suppression de la mémoire locale
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  //Récupération des informations du localStorage
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  //MAJ du timer d'expiration
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
