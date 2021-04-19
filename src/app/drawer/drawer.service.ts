import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//Variables globales
import { environment } from "../../environments/environment";
import { Drawer } from './drawer.model';
import { Injectable } from "@angular/core";

const URL_BACKEND = environment.apiURL + "color/";

@Injectable({ providedIn: 'root' })

//Gestion des tiroirs
export class DrawerService {

  //Mémoire interne des couleurs
  //private color: Color[] = [];

  //Système de mise à jour des couleur
  //private colorUpdated = new Subject<{ color: Color[] }>();

  constructor(private http: HttpClient, private router: Router) { }
}
