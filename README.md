# Painting

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Ajout du module Angular material

ng add @angular/material

## Génération du docker

    sudo docker build -t angular_decouverte .

## Lancement du docker

    sudo docker run --name myangular -d -p 4200:80 angular_decouverte

    docker run --name angular_painting -p 8082:80 robotix703/angular_painting:latest &

## Déploiement du docker

  ssh robotix703@62.210.144.226

  Stopper et supprimer les dockers et les images des conteneurs précédents

  docker pull robotix703/api_rest_painting:latest

  docker pull robotix703/angular_painting:latest
