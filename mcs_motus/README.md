# DOCUMENTATION MOTUS GAME

## AXEL SERROR ET DOMINIQUE RADO RAKOTO 

### Description
Une application reprenant le principe du jeu de motus, c'est-à-dire essayer de deviner le mot du jour. Arriver sur la page du jeu, le joueur n'aura que le nombre de lettre du mot comme information pour pouvoir deviner le mot, il joueur aura néanmoins un nombre d'essai illimité pour deviner ce dernier. A chaque tentative, la proposition du joueur sera affichée sur l'écran et chaque lettre de sa proposition sera colorée par une couleur en fonction de si oui ou non la lettre se trouve ou non dans le mot et si la lettre est située à la bonne place.

### Usage
Nous avons essayé de créer un dockerfile pour lancer le projet ensemble mais ...
Il faut donc lancer les services une par une comme ci-dessous:
Faire

```
cd Motus node script.js
cd score node index.js

```

### Fonctionnalité

Un joueur se connecte au site via la page de login du jeu. Après avoir réussi la connexion, le joueur pourra ensuite jouer au jeu Motus implémenté et il essaiera de deviner le mot du jour.
Le joueur a aussi la possibilité de regarder son score, il gagne un point quand il aura trouver le mot; le joueur aura juste à cliquer sur la partie "Voir votre score"

### Diagramme de sequence

```mermaid

sequenceDiagram
    Client->>+Athentification: /login
    Athentification->>+Client: /login
    Client->>Athentification: name/mdp
    Athentification->>Client:/front.html
    Note right of Client: Le client a maintenant accès à la page d'accueil du jeu de motus
    Motus->>+Client : 
    note right of Client : le serveur retourne le mot du jour
    Client->>+Client: localhost:3005
    note right of Client: le client essaie de trouver le mot du jour
    Client->>+Score: localhost:3006
    note right of Client: Le client peut verifier son score en allant sur cette page qui se trouve dans le serveur score
    Score->>+Client: 
    Score->>+Client: localhost:3005/front.html
    note right of Client: Le client peut revenir sur le jeu motus en cliquant sur le lien pour y aller
 ```
Pour la conception du microservice score : 

```
    - Créer un deuxième serveur qui gère la fonctionnalité Score
    - Le mettre dans un autre port que celui du serveur du jeu Motus
    - A chaque fois que le joueur trouve le bon mot, le serveur motus envoie une variable qui est utilisée par le serveur score pour actualiser et augmenter le score du joueur selon les traitements réalisés par le serveur score

```
Pour la conception du microservice Authentification : 

```
    - nous avons essayer de mettre en place une authentification avec le serveur de Google
    - nous avons réussi à avoir 

```