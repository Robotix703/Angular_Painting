// Importation de l'outil composant de Angular
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// Définition du composant
@Component({
    //Nom
    selector: 'app-header',
    //Chemin vers le fichier HTML
    templateUrl: './header.component.html',
    //CSS
    styleUrls: ["./header.component.css"]
})

// Composant
export class HeaderComponent implements OnInit, OnDestroy {
    //Ajout système de connexion
    constructor(private authService: AuthService) {}

    private authListenerSubs : Subscription;

    userIsAuthenticated = false;

    ngOnInit(){
        //Première vérification de l'état de connexion
        this.userIsAuthenticated = this.authService.getIsAuth();

        //Connexion au système de connexion pour connaitre l'état de connexion
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}