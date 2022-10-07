# DOCUMENTATION MOTUS GAME

## AXEL SERROR ET DOMINIQUE RADO RAKOTO 

### Description
Une application reprenant le principe du jeu de motus

### Usage
Il faut installer au prealable express avec 

```
npm install express express-session cookie-parser

```

Demarrer avec 

```
node script.js

```

### Fonctionnalité

Un joueur se connecte au site via la page de login du jeu. Après avoir réussi la connexion, le joueur pourra ensuite jouer au jeu Motus implémenté et il essaiera de deviner le mot du jour.
Le joueur a aussi la possibilité de regarder son score, c'est-à-dire le nombre d'essai qu'il a effectué pour pouvoir trouver le bon mot et la moyenne de ces essais; le joueur aura juste à cliquer sur la partie "Voir votre score"

### Diagramme de sequence

```mermaid

sequenceDiagram
    Client->>+Athentification: /login
    Athentification->>+Client: /login
    Client->>Athentification: name/mdp
    Athentification->>Client:/front.html
    Note right of Client: Le client a maintenant accès à la page d'accueil du jeu de motus
    Server->>+Client : 
    note right of Client : le serveur retourne le mot du jour
    Client->>+Client: 
    note right of Client: le client essaie de trouver le mot du jour
    Client->>+Score: /score.html
    note right of Client: Le client peut verifier son score en allant sur cette page
    Score->>+Client: /score.html
    Score->>+Client: /front.html
    note right of Client: Le client peut revenir sur le jeu motus en cliquant sur le lien pour y aller
 ```
Pour la conception du microservice score : 

```
    - Créer un deuxième serveur qui gère la fonctionnalité Score
    - Le mettre dans un autre port que celui du serveur du jeu Motus
    -Appeler l'API Motus pour recuperer le score à chaque fois que l'utilisateur rentre les réponses

```