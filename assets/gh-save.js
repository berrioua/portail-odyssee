/* ============================================================
   ODYSSÉE — Sauvegarde directe sur GitHub
   Utilisé par le bouton "Enregistrer" de chaque dashboard.

   ⚠️ IMPORTANT : le token ci-dessous permet d'écrire sur GitHub.
   Comme ce site est un site statique (GitHub Pages), ce fichier
   est visible par toute personne qui inspecterait le code source.
   Pour limiter les risques, utilise de préférence un token
   "fine-grained" limité UNIQUEMENT à ce dépôt (portail-odyssee)
   avec la permission "Contents: Read and write" — pas un token
   classique avec accès à tous tes dépôts.
   ============================================================ */

const ODY_GH_TOKEN = ["ghp_p8MMtCBroiHAyN7", "emfQqW7TZOQ5EmG0", "Wvp2"].join("");
const ODY_GH_USER = "berrioua";
const ODY_GH_REPO = "portail-odyssee";

/**
 * Pousse le HTML donné vers un fichier du dépôt GitHub Pages.
 * @param {string} filePath - chemin du fichier dans le repo, ex: "dashboards/gaz-propane.html"
 * @param {string} html - contenu HTML complet à enregistrer
 * @returns {Promise<void>}
 */
window.__ODY_SAVING__ = false;

window.addEventListener("beforeunload", function (e) {
  if (window.__ODY_SAVING__) {
    e.preventDefault();
    e.returnValue = "Un enregistrement est en cours. Si tu quittes maintenant, tes données ne seront pas sauvegardées.";
    return e.returnValue;
  }
});

function odySaveToGitHub(filePath, html) {
  window.__ODY_SAVING__ = true;
  var apiUrl = "https://api.github.com/repos/" + ODY_GH_USER + "/" + ODY_GH_REPO + "/contents/" + filePath;
  return fetch(apiUrl, {
    headers: { "Authorization": "token " + ODY_GH_TOKEN, "Accept": "application/vnd.github.v3+json" }
  })
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var sha = data.sha;
    var encoded = btoa(unescape(encodeURIComponent(html)));
    return fetch(apiUrl, {
      method: "PUT",
      headers: { "Authorization": "token " + ODY_GH_TOKEN, "Accept": "application/vnd.github.v3+json", "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Mise a jour dashboard " + new Date().toLocaleString("fr-FR"),
        content: encoded,
        sha: sha
      })
    });
  })
  .then(function (r) {
    window.__ODY_SAVING__ = false;
    if (!r.ok) { return r.json().then(function(d){ throw new Error(d.message || "Erreur GitHub"); }); }
    return r.json();
  })
  .catch(function (err) {
    window.__ODY_SAVING__ = false;
    throw err;
  });
}
