/* =========================================================================
   CONFIGURATION FIREBASE — À COMPLÉTER
   =========================================================================
   1. Va sur https://console.firebase.google.com
   2. Utilise un projet existant (par ex. "turabo-self") ou crées-en un nouveau.
   3. Dans "Paramètres du projet" > "Général" > section "Vos applications",
      ajoute une application web et copie ici les valeurs fournies.
   4. Active "Authentication" > méthode "E-mail/Mot de passe", puis crée
      manuellement un compte (ton adresse + un mot de passe) : ce sera le
      seul compte capable de modifier le site. Le mot de passe n'existe
      jamais dans ce fichier ni dans le code : il est stocké et vérifié par
      Firebase, donc invisible même en inspectant la page.
   5. Active "Firestore Database" (mode production), puis règle les règles
      de sécurité comme ceci (onglet "Règles") :

      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /site/contenu {
            allow read: if true;
            allow write: if request.auth != null;
          }
        }
      }

   Cela permet à tout le monde de LIRE le contenu du site, mais seule une
   personne connectée (donc identifiée par Firebase) peut ÉCRIRE dessus.
   ========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyCr5Y2vEQe2dRG-scoIb-UI4psKtbPGRo8",
  authDomain: "campus-rosa-parks-1890a.firebaseapp.com",
  projectId: "campus-rosa-parks-1890a",
  storageBucket: "campus-rosa-parks-1890a.firebasestorage.app",
  messagingSenderId: "601758761286",
  appId: "1:601758761286:web:0236d5aaf9ddd4d5ca2547"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
