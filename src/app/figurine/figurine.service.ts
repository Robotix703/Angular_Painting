import { Injectable } from '@angular/core';
import { Figurine } from './figurine.model'
import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//Variables globales
import { environment } from "../../environments/environment";

const URL_BACKEND = environment.apiURL + "figurines/";

@Injectable({ providedIn: 'root' })

//Gestion des Figurines
export class FigurinesService {

  //Mémoire interne des figurines
  private figurines: Figurine[] = [];

  //Système de mise à jour des posts
  private figurineUpdated = new Subject<{ figurines: Figurine[], maxFigurines: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  //Retourne une copie des figurines
  getFigurines(figurinesPerPage: number, currentPage: number) {
    //Paramètre de la requête
    const queryParams = `?pageSize=${figurinesPerPage}&currentPage=${currentPage}`;

    this.http.get<{ figurines: any, maxFigurines: number }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          figurines: data.figurines.map(figurine => {
            return {
              id: figurine._id,
              name: figurine.name,
              categorie: figurine.categorie,
              imagePath: figurine.imagePath
            }
          }),
          maxFigurines: data.maxFigurines
        }
      }))
      .subscribe((transformedFigurines) => {
        this.figurines = transformedFigurines.figurines;
        this.figurineUpdated.next({ figurines: [...this.figurines], maxFigurines: transformedFigurines.maxFigurines });
      });
  }

  //Permet de s'abonner aux événement sur les figurines
  getFigurineUpdateListener() {
    return this.figurineUpdated.asObservable();
  }

  //Récupération d'une figurine
  getFigurine(id: string) {
    return this.http.get<{ _id: string, name: string, categorie: string, imagePath: string, creator: string }>(URL_BACKEND + id);
  }

  //Création de figurine
  addFigurine(name: string, categorie: string, image: File) {
    //Stockage image et données
    const figurineData = new FormData();
    figurineData.append("name", name);
    figurineData.append("categorie", categorie);
    figurineData.append("image", image, name);

    //Requête POST
    this.http.post<Figurine>(URL_BACKEND, figurineData)
      .subscribe((responseData: Figurine) => {
        //Redirection de l'utilisateur
        this.router.navigate(["/"]);
      });
  }

  //MAJ figurine
  updateFigurine(id: string, name: string, categorie: string, image: File | string) {

    //Initialisation
    let figurineData: Figurine | FormData;

    //Distinction MAJ post ou MAJ image + post
    if (typeof (image) === "object") {
      //Il y a une image
      figurineData = new FormData();
      figurineData.append('id', id)
      figurineData.append('name', name);
      figurineData.append('categorie', categorie);
      figurineData.append('image', image, name);
    }
    else {
      //Il n'y a que du text
      figurineData = { id: id, name: name, categorie: categorie, imagePath: image };
    }

    //Appel AJAX
    this.http.put(URL_BACKEND + id, figurineData)
      .subscribe(reponse => {
        //Redirection de l'utilisateur
        this.router.navigate(["/"]);
      });
  }

  //Demande de destruction des données au niveau de la BDD
  deleteFigurine(figurineId: string) {
    //Requête DELTE
    return this.http.delete(URL_BACKEND + figurineId);
  }
}
