import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  return allRoutes.find(element => element.url === url) || route404;
};

// Fonction pour vérifier les autorisations
const checkAuthorization = (route) => {
  const AllRolesArray = route.authorize;
  if (AllRolesArray.length === 0) return true;

  if (AllRolesArray.includes("disconnected")) {
    return !isConnected();
  } else {
    const roleUser = getRole();
    return AllRolesArray.includes(roleUser);
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  if (!checkAuthorization(actualRoute)) {
    window.location.replace("/");
    return;
  }

  try {
    const response = await fetch(actualRoute.pathHtml);
    if (!response.ok) throw new Error('Erreur lors du chargement de la page');
    const html = await response.text();
    document.getElementById("main-page").innerHTML = html;

    if (actualRoute.pathJS) {
      const scriptTag = document.createElement("script");
      scriptTag.src = actualRoute.pathJS;
      document.body.appendChild(scriptTag);
    }

    document.title = `${actualRoute.title} - ${websiteName}`;

    showAndHideElementsForRoles();
  } catch (error) {
    console.error('Erreur:', error);
    // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
  }
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();