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
/**
 * Affiche une bannière très visible en haut de l'écran.
 * @param {string} message
 * @param {boolean} isError
 * @param {boolean} persist - si true, ne se ferme pas automatiquement
 */
function odyShowBanner(message, isError, persist) {
  var existing = document.getElementById("ody-save-banner");
  if (existing) existing.remove();
  var banner = document.createElement("div");
  banner.id = "ody-save-banner";
  banner.style.cssText = "position:fixed;top:42px;left:0;right:0;z-index:999999;padding:12px 16px;" +
    "text-align:center;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#fff;" +
    "background:" + (isError ? "#DC2626" : "#16A34A") + ";box-shadow:0 2px 10px rgba(0,0,0,.25);";
  banner.textContent = message;
  if (isError) {
    var closeBtn = document.createElement("span");
    closeBtn.textContent = "  ✕ Fermer";
    closeBtn.style.cssText = "cursor:pointer;margin-left:12px;text-decoration:underline;";
    closeBtn.onclick = function () { banner.remove(); };
    banner.appendChild(closeBtn);
  }
  document.body.appendChild(banner);
  if (!persist) {
    setTimeout(function () { if (banner.parentNode) banner.remove(); }, 5000);
  }
}

/**
 * fetch() avec un délai maximum, pour détecter les blocages silencieux
 * (extensions, pare-feu, antivirus) qui ne renvoient jamais de réponse.
 */
function odyFetchWithTimeout(url, options, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () {
      reject(new Error("Le serveur ne répond pas après " + Math.round(timeoutMs / 1000) + "s. Une extension du navigateur (bloqueur de pub, Brave Shields, antivirus) bloque peut-être la connexion à api.github.com."));
    }, timeoutMs);
    fetch(url, options).then(function (r) {
      clearTimeout(timer);
      resolve(r);
    }).catch(function (err) {
      clearTimeout(timer);
      reject(err);
    });
  });
}

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
  odyShowBanner("⏳ Enregistrement en cours, merci de patienter (ne pas quitter la page)...", false, true);
  var apiUrl = "https://api.github.com/repos/" + ODY_GH_USER + "/" + ODY_GH_REPO + "/contents/" + filePath;
  var headers = { "Authorization": "token " + ODY_GH_TOKEN, "Accept": "application/vnd.github.v3+json" };

  return odyFetchWithTimeout(apiUrl, { headers: headers }, 15000)
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var sha = data.sha;
    var encoded = btoa(unescape(encodeURIComponent(html)));
    return odyFetchWithTimeout(apiUrl, {
      method: "PUT",
      headers: Object.assign({}, headers, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        message: "Mise a jour dashboard " + new Date().toLocaleString("fr-FR"),
        content: encoded,
        sha: sha
      })
    }, 20000);
  })
  .then(function (r) {
    window.__ODY_SAVING__ = false;
    if (!r.ok) { return r.json().then(function(d){ throw new Error(d.message || "Erreur GitHub"); }); }
    odyShowBanner("✓ Enregistré et publié ! Visible par tous dans 1-2 minutes.", false);
    return r.json();
  })
  .catch(function (err) {
    window.__ODY_SAVING__ = false;
    odyShowBanner("✗ Échec de l'enregistrement : " + (err.message || "erreur inconnue"), true, true);
    throw err;
  });
}
