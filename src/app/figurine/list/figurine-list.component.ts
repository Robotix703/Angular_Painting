// Importation de l'outil composant de Angular
import { ContentObserver } from '@angular/cdk/observers';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
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
  isDone: boolean = undefined;
  isFavoris: boolean = undefined;
  category: string = "";

  categoryList: string[] = [];

  //Abonnement
  private authStatusSub: Subscription;
  private figurinesSub: Subscription;

  constructor(private figurineService: FigurinesService, private authService: AuthService) { }

  ngOnInit() {

    this.userID = this.authService.getUserId();

    this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.figurines, data.maxFigurines);
    });

    this.figurineService.getCategories()
    .subscribe((data) => {
      this.categoryList = data;
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
        this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
          this.displayFigurines(data.figurines, data.maxFigurines);
        });
      });
    }
  }

  displayFigurines(figurines: Figurine[], maxFigurines: number){
    if(figurines){
      figurines.forEach(element => {
        element.isFavoris = element.favoris.includes(this.userID);
      });
    }
    
    this.figurines = (figurines)? figurines : [];
    this.length = maxFigurines;
    this.isLoading = false;
    this.currentPage = 0;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  clickMethod(name: string) {
    return confirm("Confirmez la suppression de " + name);
  }

  getFigurinesData(event?:PageEvent){
    this.figurineService.getFigurines(event.pageSize, event.pageIndex).subscribe((data) => {
      this.displayFigurines(data.figurines, data.maxFigurines);
    });
    this.currentPage = event.pageIndex;
  }

  setFavoris(figurineID: string, isFavoris){
    this.figurineService.updateFavoris(figurineID, this.userID, !isFavoris)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
        this.displayFigurines(data.figurines, data.maxFigurines);
      });
    });
  }

  setPainted(figurineID: string, isPainted: boolean){
    this.figurineService.updatePainted(figurineID, isPainted)
    .subscribe(() => {
      this.figurineService.getFigurines(this.pageSize, this.currentPage).subscribe((data) => {
        this.displayFigurines(data.figurines, data.maxFigurines);
      });
    })
  }

  selectCategory(selectedCategory: string){
    this.category = selectedCategory;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    this.figurineService.getFilteredFigurines(userIDForFavoris, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }

  toggleFavoris(value: boolean){
    this.isFavoris = value;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    console.log(userIDForFavoris)
    this.figurineService.getFilteredFigurines(userIDForFavoris, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }

  toggleDone(value: boolean){
    this.isDone = value;
    const userIDForFavoris = (this.isFavoris) ? this.userID : "";
    this.figurineService.getFilteredFigurines(userIDForFavoris, this.isDone, this.category, this.pageSize, this.currentPage).subscribe((data) => {
      this.displayFigurines(data.Figurines, data.maxFigurines);
    })
  }
}
