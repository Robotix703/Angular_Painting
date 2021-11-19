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
  private colorLimite = 100;

  constructor(private http: HttpClient, private router: Router) { }

  writeColor(name: string, gamme: string, type: string, colorCode: string, drawerName: string, positionX: Number, positionY: Number, toBuy: Boolean) {
    const colorData = {
      name: name,
      gamme: gamme,
      type: type,
      colorCode: colorCode,
      drawerName: drawerName,
      positionX: positionX,
      positionY: positionY,
      toBuy: toBuy
    }

    this.http.post<Color>(URL_BACKEND, colorData)
      .subscribe((responseData: Color) => {
        this.router.navigate(["/color/list"]);
      });
  }

  updateColor(id:string, name: string, gamme: string, type: string, colorCode: string, drawerName: string, positionX: Number, positionY: Number, toBuy: Boolean) {
    const colorData = {
      name: name,
      gamme: gamme,
      type: type,
      colorCode: colorCode,
      drawerName: drawerName,
      positionX: positionX,
      positionY: positionY,
      toBuy: toBuy
    }

    this.http.put<Color>(URL_BACKEND + "/" + id, colorData)
      .subscribe((responseData: Color) => {
        this.getColors();
      });
  }

  getColorUpdateListener() {
    return this.colorUpdated.asObservable();
  }

  getColors() {
    this.http.get<{ Colors: any }>(URL_BACKEND + '?limit=' + this.colorLimite)
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
              positionY: color.positionY,
              toBuy: color.toBuy ? color.toBuy : false,
              backgroundToBuy: color.toBuy ? "#cbd800" : undefined
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
    const queryParams = `filtre?gamme=${gamme}&type=${type}&limit=${this.colorLimite}`;

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
              positionY: color.positionY,
              toBuy: color.toBuy ? color.toBuy : false,
              backgroundToBuy: color.toBuy ? "#cbd800" : undefined
            }
          })
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color] });
      });
  }

  getColorsToBuy(toBuy: boolean) {
    const l_toBuy = toBuy ? "true" : "false";
    const queryParams = `toBuy?toBuy=${l_toBuy}`;

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
              positionY: color.positionY,
              toBuy: color.toBuy ? color.toBuy : false,
              backgroundToBuy: color.toBuy ? "#cbd800" : undefined
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
              positionY: color.positionY,
              toBuy: color.toBuy ? color.toBuy : false,
              backgroundToBuy: color.toBuy ? "#cbd800" : undefined
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
              positionY: color.positionY,
              toBuy: color.toBuy ? color.toBuy : false,
              backgroundToBuy: color.toBuy ? "#cbd800" : undefined
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
