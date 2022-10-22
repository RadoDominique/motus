# DOCUMENTATION MOTUS GAME

## AXEL SERROR ET DOMINIQUE RADO RAKOTO 

### Description
Une application reprenant le principe du jeu de motus, c'est-à-dire essayer de deviner le mot du jour. Arriver sur la page du jeu, le joueur n'aura que le nombre de lettre du mot comme information pour pouvoir deviner le mot, le joueur aura néanmoins un nombre d'essai illimité pour deviner ce dernier. A chaque tentative, la proposition du joueur sera affichée sur l'écran et chaque lettre de sa proposition sera colorée par une couleur en fonction de si oui ou non la lettre se trouve ou non dans le mot et si la lettre est située à la bonne place.

### Usage
Nous avons essayé de créer un dockerfile pour lancer le projet ensemble. Il existe donc deux méthodes pour lancer ce dernier.
La première methode serait de lancer les services une par une, pour cela, il faut naviguer dans le repertoire de chaque microservice et lancer le script js.
Faire :

```
cd mcs_motus puis faire tous les npm install suivant : dotenv --save / typescript -s -g / ts-node --save-dev /  oidc-client --save / mustache-express --save / openid-client --save /  @types/express -s / express express-session cookie-parser
 puis tsc index.ts puis node -r dotenv/config index.js
cd mcs_score puis node index.js
localhost:3005
```

La deuxième est de le lancer avec docker, il faut installer au prealable docker en suivant ce lien : https://docs.docker.com/ pour la documentation officielle.
Puis après installation de docker, il faut juste taper :
 
```
    sudo docker-compose up
    - ajouter l'option --remove-orphan en cas d'erreur de "flag"
    localhost:3005

```

### Fonctionnalité

Un joueur se connecte au site via la page de login qui redirige vers la page de connexion Google. Après avoir réussi la connexion, le joueur pourra ensuite jouer au jeu Motus implémenté et il essaiera de deviner le mot du jour.
Le joueur a aussi la possibilité de regarder son score, il gagne un point quand il aura trouver le mot; le joueur aura juste à cliquer sur la partie "Voir votre score".

### Diagramme de sequence

```mermaid

sequenceDiagram
    Client->>+Nodejs(Express): GET localhost:3005/register.html
    Nodejs(Express)->>+Client: 302 Redirect Location : https://accounts.google.com/o/oauth/v2/auth?...
    Client->>+Authentification Google: GET https://accounts.google.com/o/oauth/v2/auth?...
    Authentification Google->>+Client: 200 ok private.mustache
    Client->>+Authentification Google: POST private body: credentials
    Authentification Google->>+Client: 302 Redirect Location : localhost:3005/auth/callback?code={AUTH_CODE}code={AUTH_CODE}...
    Client->>+Nodejs(Express): GET localhost:3005/auth/callback?...
    Nodejs(Express)->>+Authentification Google: POST https://oauth2.googleapis.com/token client_id client_secret redirect_uri grant_type...
    Authentification Google->>+Nodejs(Express): 200 ok access_token id_token refresh_token ...
    Nodejs(Express)->>+Client: 202 ok Set-Cookie
    Client->>+Nodejs(Express): Get /private cookie:session={SESSION}
    Nodejs(Express)->>+Authentification Google: true valid access_token, protected 
    Authentification Google->>+Client: 202 ok private.mustache
    Note right of Client: Le client a maintenant accès à la page d'accueil du jeu de motus
    Motus->>+Client : 
    note right of Client : le serveur retourne le mot du jour
    Client->>+Client: localhost:3005
    note right of Client: le client essaie de trouver le mot du jour
    Client->>+Score: localhost:3006
    note right of Client: Le client peut verifier son score en allant sur cette page qui se trouve dans le serveur score
    Score->>+Client: 
    Score->>+Client: localhost:3005
    note right of Client: Le client peut revenir sur le jeu motus en cliquant sur le lien pour y aller
 ```
Pour la conception du microservice score : 

```
    - Créer un deuxième serveur qui gère la fonctionnalité Score
    - Le mettre dans un autre port que celui du serveur du jeu Motus
    - A chaque fois que le joueur trouve le bon mot, le serveur motus envoie une variable qui est utilisée par le serveur score pour actualiser et augmenter le score du joueur selon les traitements réalisés par le serveur score. Le score du joueur est stocké dans un fichier txt qui se nomme "data.txt" et le serveur score n'aura qu'à lire le contenu de ce fichier pour avoir accès au score du joueur.

```
Pour la conception de l'Authentification Google: 

```
    - Nous avons mis en place une authentification avec le serveur de Google, c'est donc google qui s'occupe de la partie microservice du serveur. L'authentification reste dans le serveur du jeu du motus.
    - Dans un middleware, nous allons initialiser l'émetteur openid-client permettant de faire la configuration OpenID accessile au public et effectuer tous les appels HTTP sous jacents
    - Pour se connecter, on a un point d'entrée d'authentification nommé /auth/login permettant de rediriger vers la bonne page d'authentification du fournisseur oidc et lançant l'ensemble du flux d'authentification
    - Pour la redirection, on a /auth/callback permettant de revenir sur la page d'authentification contre les jetons d'accès, d'identification et d'actualisation appropriés
    - Pour la déconnection, on a /auth/logout permettant de se déconnecter de notre application.

```

### Suite possible

Pour la suite du projet, au niveau du score il aurait été pas mal d'implementer aussi le nombre d'essai moyen du joueur pour avoir un peu plus d'information pour son score.
Nous aurions pu ameliorer le visuel du projet.
Nous aurions pu mettre en place le système de reverse proxy mais le temps ne nous a pas permis de le faire. Ceci est donc une amelioration possible.

### Conclusion
Nous avons pu expériementer, cette nouvelle technique de développement, ce qui nous a permis de travailler avec un nouveau style d'architecture.
Nous remercions encore Monsieur Simon Gomez pour votre encadrement durant ces plusieurs séances de cours. Votre aide tout au long des séances nous a permis de comprendre le fonctionnement de cette architecture.