import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

import { Drawer, DrawerTypes, sizeDrawerArmy, sizeDrawerCitadel } from './drawer.model';

const URL_BACKEND = environment.apiURL + "drawer/";

@Injectable({ providedIn: 'root' })

export class DrawersService {

  private drawer: Drawer[] = [];
  private drawerUpdated = new Subject<{ drawer: Drawer[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  getDrawerUpdateListener() {
    return this.drawerUpdated.asObservable();
  }

  createDrawer(name: string, type: string) {
    const emptySlots = [...Array( (type == DrawerTypes[0]) ? sizeDrawerCitadel.totalSize : sizeDrawerArmy.totalSize ).keys()];

    const drawerData = {
      name: name,
      type: type,
      emptySlot: emptySlots,
      isFull: false
    };

    this.http.post<Drawer>(URL_BACKEND, drawerData)
      .subscribe((responseData: Drawer) => {
        this.router.navigate(["/drawer/list"]);
      });
  }

  takeSlot(slot: Number, drawerName: string){
    const data = {
      slot: slot,
      name: drawerName
    }

    this.http.post<Drawer>(URL_BACKEND + "takeSlot", data)
      .subscribe((responseData: Drawer) => {
        //console.log(responseData);
      });
  }

  freeSlot(slot: Number, drawerName: string){
    const data = {
      slot: slot,
      name: drawerName
    }

    this.http.post<Drawer>(URL_BACKEND + "freeSlot", data)
      .subscribe((responseData: Drawer) => {
        console.log(responseData);
      });
  }
  
  getDrawers() {
    this.http.get<{ Drawers: any }>(URL_BACKEND)

      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              id: drawer._id,
              name: drawer.name,
              type: drawer.type,
              emptySlot: drawer.emptySlot,
              isFull: drawer.isFull
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawersNames() {
    this.http.get<{ Drawers: any }>(URL_BACKEND)

      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              name: drawer.name
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawersNotFullNames() {
    this.http.get<{ Drawers: any }>(URL_BACKEND + "/notFull")

      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              name: drawer.name
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawersByType(type: string) {
    const queryParams = `type?type=${type}`;

    this.http.get<{ Drawers: any }>(URL_BACKEND + queryParams)
      .pipe(map((data) => {
        return {
          drawers: data.Drawers.map(drawer => {
            return {
              id: drawer._id,
              name: drawer.name,
              type: drawer.type,
              emptySlot: drawer.emptySlot,
              isFull: drawer.isFull
            }
          })
        }
      }))
      .subscribe((transformedDrawer) => {
        this.drawer = transformedDrawer.drawers;
        this.drawerUpdated.next({ drawer: [...this.drawer] });
      });
  }

  getDrawerByName(name: string) {
    const queryParams = `nom?nom=${name}`;

    return this.http.get<{ Drawers: any }>(URL_BACKEND + queryParams);
  }

  deleteDrawer(drawerID: string) {
    return this.http.delete(URL_BACKEND + drawerID);
  }
}
