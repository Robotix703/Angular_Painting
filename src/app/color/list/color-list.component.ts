import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { coordDrawerArmy, coordDrawerCitadel, DrawerTypes } from 'src/app/drawer/drawer.model';
import { Color, colorGammes, colorTypes } from '../color.model';
import { ColorsService } from '../color.service';
import { DrawersService } from 'src/app/drawer/drawer.service';

// Définition du composant
@Component({
  //Nom
  selector: 'app-color-list',
  //Chemin vers le fichier HTML
  templateUrl: './color-list.component.html',
  //Chemin vers le fichier CSS
  styleUrls: ['./color-list.component.css']
})

@Injectable({ providedIn: "root" })

// Composant
export class ColorListComponent implements OnInit, OnDestroy {

  colors = [];
  totalColors;

  userIsAuthenticated = false;
  userId = null;

  showFiller = true;
  l_gamme = "";
  l_type = "";
  l_toBuy = "false";
  l_colorLimit = "100";
  gammeList: string[] = colorGammes;
  colorList: string[] = colorTypes;

  //Abonnement
  private authStatusSub: Subscription;
  private colorsSub: Subscription;

  constructor(private colorService: ColorsService,
    private drawerService: DrawersService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.colorService.getColors(parseInt(this.l_colorLimit));

    this.colorsSub = this.colorService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[], maxColors: number }) => {

        this.colors = colorData.color;
        this.totalColors = colorData.maxColors;
      })

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(color: Color) {
    if(this.clickMethod(color.name))
    {
      const colorID = color.id;
      const drawerName = color.drawerName;
      const position  = {x: color.positionX, y: color.positionY};
      const slot = (color.gamme == DrawerTypes[0]) ? coordDrawerCitadel.findIndex(e => e.x == position.x && e.y == position.y) : coordDrawerArmy.findIndex(e => e.x == position.x && e.y == position.y);

      this.drawerService.freeSlot(slot, drawerName);

      this.colorService.deleteColor(colorID).subscribe(() => {
        this.colorService.getColorsFiltre(this.l_gamme, this.l_type, this.l_toBuy);
      });
    }
  }

  buyColor(color: Color){
    this.colorService.updateToBuy(
      color.id,
      (color.toBuy == true)? false : true
    ).subscribe(() => {
      this.colorService.getColorsFiltre(this.l_gamme, this.l_type, this.l_toBuy);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  selectGamme(gamme: string){
    this.l_gamme = (gamme == "tout" ? "" : gamme);

    this.colorService.getColorsFiltre(this.l_gamme, this.l_type, this.l_toBuy);
  }

  selectType(type: string){
    this.l_type = (type == "tout" ? "" : type);

    this.colorService.getColorsFiltre(this.l_gamme, this.l_type, this.l_toBuy);
  }

  selectToBuy(toBuy: any){
    this.l_toBuy = (toBuy.checked == true) ? "true" : "false";

    this.colorService.getColorsFiltre(this.l_gamme, this.l_type, this.l_toBuy);
  }

  search(event){
    this.colorService.getColorsName(event.target.value);
  }

  updateLimit(limit){
    this.l_colorLimit = limit;
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }
}
