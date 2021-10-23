// Importation de l'outil composant de Angular
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';

//gestion des abonnements
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Drawer } from '../drawer.model';
import { DrawersService } from '../drawer.service';

// Définition du composant
@Component({
  //Nom
  selector: 'app-drawer-list',
  //Chemin vers le fichier HTML
  templateUrl: './drawer-list.component.html',
  //Chemin vers le fichier CSS
  styleUrls: ['./drawer-list.component.css']
})

@Injectable({ providedIn: "root" })

// Composant
export class DrawerListComponent implements OnInit, OnDestroy {

  drawers = [];

  totalDrawers = 0;

  //Système de connexion
  userIsAuthenticated = false;
  userId = null;

  showFiller = true;

  //Système de filtre
  l_type = "";

  //Abonnement
  private authStatusSub: Subscription;
  private drawersSub: Subscription;

  constructor(private drawerService: DrawersService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  //Exécuté à l'init
  ngOnInit() {
    this.drawerService.getDrawers();

    this.drawersSub = this.drawerService.getDrawerUpdateListener()
      .subscribe((drawerData: { drawer: Drawer[] }) => {

        this.drawers = drawerData.drawer;
        this.totalDrawers = this.drawers.length;
      })

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  //Gestion de la suppression des données
  onDelete(drawerID: string) {
    //Appel au système de suppression
    this.drawerService.deleteDrawer(drawerID).subscribe(() => {
      this.drawerService.getDrawers();
    });
  }

  //Destructeur
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  //Selection d'un type
  selectType(type: string){
    this.l_type = (type == "tout" ? "" : type);
    this.drawerService.getDrawersFiltre(this.l_type);
  }

  //Recherche
  search(event){
    //Appel service
    this.drawerService.getDrawersName(event.target.value);
  }
}
