import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//Variables globales
import { environment } from "../../environments/environment";
import { Color } from './color.model';
import { Injectable } from "@angular/core";

const URL_BACKEND = environment.apiURL + "color/";

@Injectable({ providedIn: 'root' })

//Gestion des Peintures
export class ColorsService {

  //Mémoire interne des couleurs
  private color: Color[] = [];

  //Système de mise à jour des couleur
  private colorUpdated = new Subject<{ color: Color[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  //Ecriture d'une couleur
  writeColor(name: string, gamme: string, type: string, colorCode: string) {
    //Stockage image et données
    const colorData = {
      name: name,
      gamme: gamme,
      type: type,
      colorCode: colorCode
    }

    //Requête POST
    this.http.post<Color>(URL_BACKEND, colorData)
      .subscribe((responseData: Color) => {
        //Redirection de l'utilisateur
        this.router.navigate(["/"]);
      });
  }

  //Permet de s'abonner aux événement sur les couleurs
  getColorUpdateListener() {
    return this.colorUpdated.asObservable();
  }

  //Récupération d'une liste de couleurs en fonction d'une liste d'ID
  getColorsID(IDList: string[]){

  }

  //Récupération des couleurs
  getColors() {
    //Récupération des couleurs
    this.http.get<{ Colors: any }>(URL_BACKEND)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  //Récupération des couleurs via les filtres
  getColorsFiltre(gamme: string, type: string) {
    //Construction query
    const queryParams = `filtre?gamme=${gamme}&type=${type}`;

    //Récupération des couleurs
    this.http.get<{ Colors: any }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  //Récupération des couleurs via le nom
  getColorsName(name: string) {
    //Construction query
    const queryParams = `nom?nom=${name}`;

    //Récupération des couleurs
    this.http.get<{ Colors: any }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  //Demande de destruction des données au niveau de la BDD
  deleteColor(colorID: string) {
    //Requête DELTE
    return this.http.delete(URL_BACKEND + colorID);
  }
}
