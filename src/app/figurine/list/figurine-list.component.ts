// Importation de l'outil composant de Angular
import { Component, OnDestroy, OnInit } from '@angular/core'

//gestion des abonnements
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FigurinesService } from '../figurine.service';
import { Figurine } from './../figurine.model';

// Définition du composant
@Component({
  //Nom
  selector: 'app-figurine-list',
  //Chemin vers le fichier HTML
  templateUrl: './figurine-list.component.html',
  styleUrls: ['./figurine-list.component.css']
})

// Composant
export class FigurineListComponent implements OnInit, OnDestroy {

  isLoading = false;
  figurines: Figurine[] = [];

  //Système de connexion
  userIsAuthenticated = false;
  userId = null;

  totalFigurines = 0;
  figurinePerPage = 10;
  currentPage = 0;

  //Abonnement
  private authStatusSub: Subscription;
  private figurinesSub: Subscription;

  constructor(private figurineService: FigurinesService, private authService: AuthService) { }

  ngOnInit() {

    this.figurineService.getFigurines(10, 1);

    this.figurinesSub = this.figurineService.getFigurineUpdateListener().subscribe((figurineData: { figurines: Figurine[], maxFigurines: number }) => {
      this.figurines = figurineData.figurines;
      this.totalFigurines = figurineData.maxFigurines;
      this.isLoading = false;
    });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(figurineID: string) {
    const figurineName = this.figurines.find(e => e.id == figurineID).name;
    if(this.clickMethod(figurineName))
    {
      this.figurineService.deleteFigurine(figurineID).subscribe(() => {
        this.figurineService.getFigurines(this.figurinePerPage, this.currentPage)
      });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }
}
