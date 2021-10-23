import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
//Variables globales
import { environment } from "../../environments/environment";
import { Drawer } from './drawer.model';
import { Injectable } from "@angular/core";

const URL_BACKEND = environment.apiURL + "drawer/";

@Injectable({ providedIn: 'root' })

export class DrawersService {

  private drawer: Drawer[] = [];

  private drawerUpdated = new Subject<{ drawer: Drawer[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  writeDrawer(name: string, type: string) {
    const drawerData = {
      name: name,
      type: type
    }

    //Requête POST
    this.http.post<Drawer>(URL_BACKEND, drawerData)
      .subscribe((responseData: Drawer) => {
        //Redirection de l'utilisateur
        this.router.navigate(["/drawer/list"]);
      });
  }

  getDrawerUpdateListener() {
    return this.drawerUpdated.asObservable();
  }

  getDrawersID(IDList: string[]){

  }

  getDrawers() {
    this.http.get<{ Drawers: any }>(URL_BACKEND)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              id: drawer._id,
              name: drawer.name,
              type: drawer.type
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawersFiltre(type: string) {
    //Construction query
    const queryParams = `filtre?type=${type}`;

    this.http.get<{ Drawers: any }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              id: drawer._id,
              name: drawer.name,
              type: drawer.type
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawersName(name: string) {
    //Construction query
    const queryParams = `nom?nom=${name}`;

    this.http.get<{ Drawers: any }>(URL_BACKEND + queryParams)
      //Ajout d'une opération sur les données
      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              id: drawer._id,
              name: drawer.name,
              type: drawer.type
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  //Demande de destruction des données au niveau de la BDD
  deleteDrawer(drawerID: string) {
    //Requête DELTE
    return this.http.delete(URL_BACKEND + drawerID);
  }
}
