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
  private colorUpdated = new Subject<{ color: Color[], maxColors: number }>();
  public colorLimite = -1;

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

  getColors(colorLimite: number = this.colorLimite) {
    this.http.get<{ Colors: any, maxColors: number }>(URL_BACKEND + '?limit=' + colorLimite)
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
          }),
          maxColors : data.maxColors
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color], maxColors: transformedColor.maxColors });
      });
  }

  getColorsFiltre(gamme: string, type: string) {
    const queryParams = `filtre?gamme=${gamme}&type=${type}&limit=${this.colorLimite}`;

    this.http.get<{ Colors: any, maxColors: number }>(URL_BACKEND + queryParams)
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
          }),
          maxColors : data.maxColors
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color], maxColors: transformedColor.maxColors });
      });
  }

  getColorsToBuy(toBuy: boolean) {
    const l_toBuy = toBuy ? "true" : "false";
    const queryParams = `toBuy?toBuy=${l_toBuy}`;

    this.http.get<{ Colors: any, maxColors: number }>(URL_BACKEND + queryParams)
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
          }),
          maxColors : data.maxColors
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color], maxColors: transformedColor.maxColors });
      });
  }

  getColorsName(name: string) {
    const queryParams = `nom?nom=${name}`;

    this.http.get<{ Colors: any, maxColors: number }>(URL_BACKEND + queryParams)
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
          }),
          maxColors : data.maxColors
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color], maxColors: transformedColor.maxColors });
      });
  }

  getColorsFromDrawer(drawerName: string) {
    const queryParams = `drawerName?drawerName=${drawerName}`;

    this.http.get<{ Colors: any, maxColors: number }>(URL_BACKEND + queryParams)
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
          }),
          maxColors : data.maxColors
        }
      }))
      .subscribe((transformedColor) => {
        this.color = transformedColor.colors;
        this.colorUpdated.next({ color: [...this.color], maxColors: transformedColor.maxColors });
      });
  }

  deleteColor(colorID: string) {
    return this.http.delete(URL_BACKEND + colorID);
  }
}
