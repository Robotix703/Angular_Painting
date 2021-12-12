// Importation de l'outil composant de Angular
import { ContentObserver } from '@angular/cdk/observers';
import { Component, OnDestroy, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator';

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

  pageSizeOptions:number[] = [10, 25, 50, 100];
  pageSize:number = 10;
  length:number;
  currentPage: number = 0;
  userID: string;

  //Abonnement
  private authStatusSub: Subscription;
  private figurinesSub: Subscription;

  constructor(private figurineService: FigurinesService, private authService: AuthService) { }

  ngOnInit() {

    this.userID = this.authService.getUserId();

    this.figurineService.getFigurines(this.pageSize, this.currentPage);

    this.figurinesSub = this.figurineService.getFigurineUpdateListener().subscribe((figurineData: { figurines: Figurine[], maxFigurines: number }) => {
      figurineData.figurines.forEach(element => {
        element.isFavoris = element.favoris.includes(this.userID);
      });
      this.figurines = figurineData.figurines;
      this.length = figurineData.maxFigurines;
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
        this.figurineService.getFigurines(this.pageSize, this.currentPage)
      });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getFigurinesData(event?:PageEvent){
    this.figurineService.getFigurines(event.pageSize, event.pageIndex);
    this.currentPage = event.pageIndex;
  }

  setFavoris(figurineID: string, isFavoris){
    this.figurineService.updateFavoris(figurineID, this.userID, !isFavoris)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage);
    });
  }

  setPainted(figurineID: string, isPainted: boolean){
    this.figurineService.updatePainted(figurineID, isPainted)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage);
    })
  }
}
