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
AUTHENTIFICATION

```mermaid

sequenceDiagram
    Client->>+Server: /login
    Server->>+Client: /login
    Client->>Server: name/mdp
    Server->>Client:/front.html
    Note right of Client: Le client a maintenant accès à la page d'accueil du jeu de motus
    
 ```

 PRINCIPE DU JEU DE MOTUS ET LE SCORE
 
 ```mermaid

sequenceDiagram
    Client->>+Server: /login
    Server->>+Client: /login
    Client->>Server: name/mdp
    Server->>Client:/front.html
    Note right of Client: Le client a maintenant accès à la page d'accueil du jeu de motus
    
 ```