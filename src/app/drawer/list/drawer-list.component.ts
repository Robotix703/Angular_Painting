// Importation de l'outil composant de Angular
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

import { Drawer } from '../drawer.model';
import { DrawersService } from '../drawer.service';

@Component({
  selector: 'app-drawer-list',
  templateUrl: './drawer-list.component.html',
  styleUrls: ['./drawer-list.component.css']
})

@Injectable({ providedIn: "root" })

export class DrawerListComponent implements OnInit, OnDestroy {

  drawers = [];
  totalDrawers = 0;

  //Système de connexion
  userIsAuthenticated = false;
  userId = null;

  l_type = "";
  showFiller = true;

  //Abonnement
  private authStatusSub: Subscription;
  private drawersSub: Subscription;

  constructor(private drawerService: DrawersService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

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

  onDelete(drawerID: string) {
    const drawerName = this.drawers.find(e => e.id == drawerID).name;
    if(this.clickMethod(drawerName))
    {
      this.drawerService.deleteDrawer(drawerID).subscribe(() => {
        this.drawerService.getDrawers();
      });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  selectType(type: string){
    type == "tout" ? 
      this.drawerService.getDrawers() 
      : this.drawerService.getDrawersByType(type);
  }

  search(event){
    this.drawerService.getDrawerByName(event.target.value);
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }
}
