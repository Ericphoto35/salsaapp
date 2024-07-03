import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[]),
    new Route("/signin", "Inscription", "/pages/signin.html",["disconnected"],"js/auth/signin.js",),
    new Route("/debutant", "Débutant", "/pages/debutant.html",["ROLE_DEBUTANT","ROLE_ADMIN"]),
    new Route("/contact", "Contact", "/pages/contact.html",[],"js/auth/contact.js",),
    new Route("/inter", "Intermédiaire", "/pages/inter.html",["ROLE_INTER","ROLE_ADMIN"]),
    new Route("/avance", "Avancé", "/pages/avance.html",["ROLE_AVANCE","ROLE_ADMIN"]),
    new Route("/admin", "Admin", "/pages/admin.html",["ROLE_ADMIN"],"js/auth/admin.js",),
    new Route("/signup", "Inscription", "/pages/signup.html",["disconnected"],"js/auth/signup.js",),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Salsa Dance App";