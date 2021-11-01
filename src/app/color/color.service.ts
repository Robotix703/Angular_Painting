import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";
import { Color } from './color.model';
import { Injectable } from "@angular/core";

const URL_BACKEND = environment.apiURL + "color/";

@Injectable({ providedIn: 'root' })

export class ColorsService {

  private color: Color[] = [];
  private colorUpdated = new Subject<{ color: Color[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  writeColor(name: string, gamme: string, type: string, colorCode: string, drawerName: string, positionX: Number, positionY: Number) {
    const colorData = {
      name: name,
      gamme: gamme,
      type: type,
      colorCode: colorCode,
      drawerName: drawerName,
      positionX: positionX,
      positionY: positionY
    }

    this.http.post<Color>(URL_BACKEND, colorData)
      .subscribe((responseData: Color) => {
        //Redirection de l'utilisateur
        this.router.navigate(["/color/list"]);
      });
  }

  getColorUpdateListener() {
    return this.colorUpdated.asObservable();
  }

  getColors() {
    this.http.get<{ Colors: any }>(URL_BACKEND)
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode,
              drawerName: color.drawerName,
              positionX: color.positionX,
              positionY: color.positionY
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  getColorsFiltre(gamme: string, type: string) {
    const queryParams = `filtre?gamme=${gamme}&type=${type}`;

    this.http.get<{ Colors: any }>(URL_BACKEND + queryParams)
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode,
              drawerName: color.drawerName,
              positionX: color.positionX,
              positionY: color.positionY
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  getColorsName(name: string) {
    const queryParams = `nom?nom=${name}`;

    this.http.get<{ Colors: any }>(URL_BACKEND + queryParams)
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode,
              drawerName: color.drawerName,
              positionX: color.positionX,
              positionY: color.positionY
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  getColorsFromDrawer(drawerName: string) {
    const queryParams = `drawerName?drawerName=${drawerName}`;

    this.http.get<{ Colors: any }>(URL_BACKEND + queryParams)
      .pipe(map((data) => {
        return {
          colors: data.Colors.map(color => {
            return {
              id: color._id,
              name: color.name,
              gamme: color.gamme,
              type: color.type,
              colorCode: color.colorCode,
              drawerName: color.drawerName,
              positionX: color.positionX,
              positionY: color.positionY
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  deleteColor(colorID: string) {
    return this.http.delete(URL_BACKEND + colorID);
  }
}
