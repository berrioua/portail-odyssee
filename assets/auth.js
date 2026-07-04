/* ============================================================
   ODYSSÉE — Portail Supervision
   Configuration des comptes + gestion de session

   ⚠️ IMPORTANT :
   Ce site est hébergé sur GitHub Pages (site statique, sans serveur).
   Cela veut dire que ce fichier est visible par toute personne qui
   ouvrirait le code source de la page. Ce n'est donc pas un vrai
   coffre-fort — plutôt une porte fermée à clé qui empêche les gens
   d'entrer par erreur ou sans y être invités. Pour une vraie sécurité
   (comptes cachés), il faudrait un petit serveur derrière — dis-le moi
   si tu veux qu'on mette ça en place plus tard.

   Pour ajouter / modifier un compte : modifie la liste ci-dessous.
   ============================================================ */

const ODY_ACCOUNTS = [
  { user: "Samir",    pass: "tHkZYfVcBF", name: "Samir" },
  { user: "Benamira", pass: "2m7BkWa62I", name: "Benamira" },
  { user: "Bachir",   pass: "3UMkRT5yHL", name: "Bachir" },
];

const ODY_SESSION_KEY = "ody_portal_session";
const ODY_SESSION_HOURS = 10; // durée de la session avant reconnexion

function odyLogin(username, password) {
  const u = (username || "").trim().toLowerCase();
  const account = ODY_ACCOUNTS.find(
    (a) => a.user.toLowerCase() === u && a.pass === password
  );
  if (!account) return false;
  const session = {
    user: account.user,
    name: account.name,
    expires: Date.now() + ODY_SESSION_HOURS * 3600 * 1000,
  };
  localStorage.setItem(ODY_SESSION_KEY, JSON.stringify(session));
  return true;
}

function odyGetSession() {
  try {
    const raw = localStorage.getItem(ODY_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.expires || Date.now() > session.expires) {
      localStorage.removeItem(ODY_SESSION_KEY);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

function odyLogout() {
  localStorage.removeItem(ODY_SESSION_KEY);
}
