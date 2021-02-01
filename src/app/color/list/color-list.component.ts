// Importation de l'outil composant de Angular
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';

//gestion des abonnements
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Color } from '../color.model';
import { ColorsService } from '../color.service';

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

  //Liste des couleurs
  colors = [];

  //Nombre de couleurs
  totalColors = 0;

  //Système de connexion
  userIsAuthenticated = false;
  userId = null;

  showFiller = true;

  //Système de filtre
  l_gamme = "";
  l_type = "";

  //Abonnement
  private authStatusSub: Subscription;
  private colorsSub: Subscription;

  //Créé un membre de la classe de type ColorService
  constructor(private colorService: ColorsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  //Exécuté à l'init
  ngOnInit() {
    //Demande récupération des couleurs
    this.colorService.getColors();

    //Gestion de la récupération des couleurs
    this.colorsSub = this.colorService.getColorUpdateListener()
      .subscribe((colorData: { color: Color[] }) => {
        //Récupération des posts
        this.colors = colorData.color;
      })

    //Première mise à jour de l'état de connexion
    this.userIsAuthenticated = this.authService.getIsAuth();

    //Abonnement au système de connexion
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  //Gestion de la suppression des données
  onDelete(colorID: string) {
    //Appel au système de suppression
    this.colorService.deleteColor(colorID).subscribe(() => {
      this.colorService.getColors();
    });
  }

  //Destructeur
  ngOnDestroy() {
    //Désabonnement
    this.authStatusSub.unsubscribe();
  }

  //Selection d'une gamme
  selectGamme(gamme: string){
    //MAJ gamme
    this.l_gamme = gamme;
    //Demande récupération des couleurs via les filtres
    this.colorService.getColorsFiltre(this.l_gamme, this.l_type);
  }

  //Selection d'un type
  selectType(type: string){
    //MAJ type
    this.l_type = type;
   //Demande récupération des couleurs via les filtres
   this.colorService.getColorsFiltre(this.l_gamme, this.l_type);
  }

  //Recherche
  search(event){
    //Appel service
    this.colorService.getColorsName(event.target.value);
  }
}
