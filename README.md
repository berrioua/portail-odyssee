# Portail Odyssée

Site statique regroupant tes dashboards avec une page d'accueil et une connexion par compte.

## Structure

```
/index.html               → Page d'accueil (liste des dashboards)
/login.html                → Page de connexion
/assets/auth.js            → Comptes + gestion de la session (à modifier)
/dashboards/gaz-propane.html
/dashboards/electricite.html
/dashboards/maintenance.html
```

## Avant de mettre en ligne

1. Ouvre `assets/auth.js`
2. Change les identifiants et mots de passe dans `ODY_ACCOUNTS` (ajoute/supprime des comptes si besoin)
3. ⚠️ Ce site est un site statique (GitHub Pages) — n'importe qui peut voir le code source, donc ce fichier n'est pas un vrai coffre-fort. C'est une porte fermée à clé, pas un coffre blindé. Si tu veux une vraie sécurité (mots de passe cachés), il faut un petit serveur derrière — dis-moi si tu veux qu'on regarde ça plus tard.

## Mettre en ligne sur GitHub Pages

1. Crée un nouveau repo (ou réutilise-en un existant) sur ton compte `berrioua`, par exemple `portail-odyssee`
2. Mets tous les fichiers de ce dossier à la racine du repo
3. Va dans **Settings → Pages** du repo
4. Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`
5. Le site sera accessible à `https://berrioua.github.io/portail-odyssee/`

## Ajouter un nouveau dashboard plus tard

1. Copie ton fichier HTML dans `/dashboards/`
2. En haut du fichier, juste après `<head>`, ajoute :

```html
<script src="../assets/auth.js"></script>
<script>
  var __session = odyGetSession();
  if (!__session) { window.location.replace("../login.html"); }
</script>
```

3. Ajoute une carte dans `index.html` (copie une carte existante dans la `<div class="grid">` et change le titre, la description et le lien `href`)
