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

  //Gestion du spinner
  isLoading = false;

  //Liste des figurines
  figurines: Figurine[] = [];

  //Système de connexion
  userIsAuthenticated = false;
  userId = null;

  //Gestion des figurines par pages
  totalFigurines = 0;
  figurinePerPage = 10;
  currentPage = 0;

  //Abonnement
  private authStatusSub: Subscription;
  private figurinesSub: Subscription;

  //Créé un membre de la classe de type PostService
  constructor(private figurineService: FigurinesService, private authService: AuthService) { }

  //Exécuté à l'init
  ngOnInit() {

    //Demande de récupération des figurines
    this.figurineService.getFigurines(10, 1);

    this.figurinesSub = this.figurineService.getFigurineUpdateListener().subscribe((figurineData: { figurines: Figurine[], maxFigurines: number }) => {
      //Récupération des posts
      this.figurines = figurineData.figurines;
      //MAJ du nombre max de posts
      this.totalFigurines = figurineData.maxFigurines;
      this.isLoading = false;
    });

    //Première mise à jour de l'état de connexion
    this.userIsAuthenticated = this.authService.getIsAuth();

    //Abonnement au système de connexion
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  //Gestion de la suppression des données
  onDelete(figurineID: string) {
    //Appel au système de suppression
    this.figurineService.deleteFigurine(figurineID).subscribe(() => {
      this.figurineService.getFigurines(this.figurinePerPage, this.currentPage)
    });
  }

  //Destructeur
  ngOnDestroy() {
    //Désabonnement
    this.authStatusSub.unsubscribe();
  }
}
