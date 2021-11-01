// Importation de l'outil composant de Angular
import { Component, Injectable, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { DrawersService } from '../drawer.service';
import { Subscription } from 'rxjs';

import { Drawer, DrawerTypes, sizeDrawerArmy, sizeDrawerCitadel } from 'src/app/drawer/drawer.model';
import { Color, colorHTMLDisplay } from 'src/app/color/color.model';
import { ColorsService } from 'src/app/color/color.service';

// Définition du composant
@Component({
    //Nom
    selector: 'app-drawer-view',
    //Chemin vers le fichier HTML
    templateUrl: './drawer-view.component.html',
    //Lien vers la fichier CSS
    styleUrls: ['./drawer-view.component.css']
})

@Injectable({ providedIn: "root" })

// Composant
export class DrawerViewComponent implements OnInit {

    public DrawerName: string;
    public DrawerType: string;

    private drawer: Drawer;
    private colors: Color;

    private drawersSub: Subscription;
    private colorsSub: Subscription;

    //Structure des peintures
    //private colorExemple = new colorHTMLDisplay("Test", "green");
    public drawerColorsMapping = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    DisplayColors(drawerColors: Color[]){
        let drawerSize = (this.DrawerType == DrawerTypes[0]) ? sizeDrawerCitadel : sizeDrawerArmy;

        let columns = [];
        for(let i = 0 ; i <= drawerSize.X ; i++){
            columns[i] = drawerColors.filter(e => e.positionX == i);
            columns[i].sort(e => e.positionY);

            for(let j = 0 ; j <= drawerSize.Y ; j++){
                if(columns[i][j]){
                    this.drawerColorsMapping[j][i] = new colorHTMLDisplay(columns[i][j].name, columns[i][j].colorCode).getHTML();
                }
            }
        }
    }

    constructor(public DrawersService: DrawersService, public route: ActivatedRoute, public ColorService: ColorsService) {}

    ngOnInit() {
        //Récupération de l'ID du tiroir
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has("drawerName")) {
                this.DrawerName = paramMap.get('drawerName');

                this.DrawersService.getDrawerByName(this.DrawerName).subscribe(drawerData => {
                    this.drawer = {
                        id: drawerData.Drawers[0]._id,
                        name: drawerData.Drawers[0].name,
                        type: drawerData.Drawers[0].type
                    }
                    this.DrawerType = drawerData.Drawers[0].type;

                    //Récupération des couleurs
                    this.ColorService.getColorsFromDrawer(this.DrawerName);
                    this.colorsSub = this.ColorService.getColorUpdateListener()
                    .subscribe((colorData: { color: Color[] }) => {
                        this.DisplayColors(colorData.color);
                    })
                });
            }
        });
    }
}
