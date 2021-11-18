import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { coordDrawerArmy, coordDrawerCitadel, DrawerTypes } from 'src/app/drawer/drawer.model';
import { Color } from '../color.model';
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
  colorGreen = "green"

  userIsAuthenticated = false;
  userId = null;

  showFiller = true;
  l_gamme = "";
  l_type = "";

  //Abonnement
  private authStatusSub: Subscription;
  private colorsSub: Subscription;

  constructor(private colorService: ColorsService,
    private drawerService: DrawersService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.colorService.getColors();

    this.colorsSub = this.colorService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {

        this.colors = colorData.color;
        this.totalColors = colorData.color.length;
      })

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(color: Color) {
    const colorID = color.id;
    const drawerName = color.drawerName;
    const position  = {x: color.positionX, y: color.positionY};
    const slot = (color.gamme == DrawerTypes[0]) ? coordDrawerCitadel.findIndex(e => e.x == position.x && e.y == position.y) : coordDrawerArmy.findIndex(e => e.x == position.x && e.y == position.y);

    this.drawerService.freeSlot(slot, drawerName);

    this.colorService.deleteColor(colorID).subscribe(() => {
      this.colorService.getColors();
    });
  }

  buyColor(color: Color){
    this.colorService.updateColor(
      color.id,
      color.name,
      color.gamme,
      color.type,
      color.colorCode,
      color.drawerName,
      color.positionX,
      color.positionY,
      false
    )
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  selectGamme(gamme: string){
    this.l_gamme = (gamme == "tout" ? "" : gamme);

    this.colorService.getColorsFiltre(this.l_gamme, this.l_type);
  }

  selectType(type: string){
    this.l_type = (type == "tout" ? "" : type);

    this.colorService.getColorsFiltre(this.l_gamme, this.l_type);
  }

  selectToBuy(toBuy: any){
    this.colorService.getColorsToBuy(toBuy.checked);
  }

  search(event){
    this.colorService.getColorsName(event.target.value);
  }
}
