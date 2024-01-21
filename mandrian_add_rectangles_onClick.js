const CANVA_WIDTH = 1000; // largeur du canva
const CANVA_HEIGHT = 1000; // hauteur du canva
const MAX_RATIO_RECT = 0.8; // ratio maximum d'un rectangle (prend un pourcentage de la taille du rectangle qui le contient)
const MIN_RATIO_RECT = 0.3; // ratio minimum d'un rectangle
const MIN_DEPTH = 4; // nombre d'itération minimum -> influe sur le nommbre de rectangles affichés
const MAX_DEPTH = 5; // nombre d'itération maximum
const BUILD_RECT = 0.7; // Probabilité de construire un rectangle dans la fonction drawRect()
const BACK_COLOR = "#f5ebe0"; // couleur du fond
const MODULO_1 = 50; // Modulo qui va conditionner le placement des rectangles (x et y)
const MODULO_2 = 100; // Modulo qui va conditionner la taille des rectangles (largeur, hauteur)

// Palette de couleur n°1
const TAB_COLOR1 = [
    "#f9ef69", //jaune
    "#f9ef69", //jaune
    "#321d0d", //marron 1 (foncé)
    "#96e072", //vert menthe
    "#32557e", //bleu canard
    "#2977d0", //bleu
    "#fb8b24", //orange
    "#0c625b", //vert canard
    "#560bad", //violet (foncé)
    "#ad2222", //rouge
];

// Palette de couleur n°2
const TAB_COLOR2 = [
    "#f9ef69", //jaune
    "#96e072", //vert menthe
    "#32557e", //bleu canard
    "#2977d0", //bleu
    "#fb8b24", //orange
    "#0c625b", //vert canard
    "#9d4edd", //violet (clair)
    "#c9184a", //rose framboise
    "#64c197", //vert menthe 2
];
const TAB_COLORS = [TAB_COLOR1, TAB_COLOR2]; // Tableau qui regroupe les deux palettes de couleurs créées pour en choisir une aléatoire dan sla fonction draw

// On définit tous les prérequis pour la création de l'oeuvre
function setup() {
    document.body.style.margin = 0; // On définit la bordure de la page web à 0 (8 par défaut dans le navigateur)
    createCanvas(CANVA_WIDTH, CANVA_HEIGHT); // On crée notre canva

    stroke(0); // On définie la couleur des bordures en noir

    strokeWeight(random([5, 7, 10, 12])); // On ajuste l'épaisseur des bordures

    noLoop(); // On dit au programme de s'exécuter une seule fois
}

// La fonction draw s'exécute par défaut après la fonction setup -> quand tout est initialisé, l'oeuvre est générée
function draw() {
    background(BACK_COLOR); // On définit la couleur de fond de l'oeuvre

    let depth = Math.floor(random(MIN_DEPTH, MAX_DEPTH)); // On déclare et donne une valeur aléatoire bornée à une variable qui va définir le nombre de rectangles à créer

    let colors = random(TAB_COLORS); // On choisit aléatoirement une des deux palettes pour colorier les rectangles avec les couleurs de l'une ou de l'autre
    let nbIterations = random(4, 12); // Nombre d'itération -> nombre de fois que l'on va superposé des rectangles (pour créer des formes plus complexes)
    for (let i = 0; i < nbIterations; i++) {
        drawRect(0, 0, CANVA_WIDTH, CANVA_HEIGHT, depth, depth, colors); // on crée une couche de rectangles à chaque itération dans la boucle
    }
    let clicks = document.querySelectorAll(".click"); // on récupère tous les éléments qui ont la classe "click" (ce sont des div qui sont créées par dessus chaque rectangles pour que l'on puisse cliquer dessus et ajouter un évènement lors de ce clic). Ainsi on peut simuler une action lors d'un clic sur un rectangle.
    addEventToRect(clicks, colors); // C'est ici qu'est ajouté l'évènement lors d'un clic sur un rectangle
}

// la fonction drawRect est ue fonction recursive basée sur l'algorithme Mondrian
// Elle crée un premier rectangle, puis le divise en deux autres de largeur aléatoire ou de longueur aléatoire
// Elle recommence ce processus autant de fois qu'il lui est demandé (plus depth est grand, plus il y aura de rectangles)
// Ainsi chaque rectangle crée lui-même deux autres rectangles au fur et à mesure, ce qui diminue la taille
// des rectangles au fil de la récursivité -> c'est comme cela que nous obtenons des rectangles de taille variable.
function drawRect(x, y, w, h, depth, startDepth, tabColor) {
    if (depth > 0) {
        let size = random(MIN_RATIO_RECT, MAX_RATIO_RECT); // on définit un coefficient qui va modifier la largeur ou la hauteur du rectangle
        // une fois sur deux, on va créer 2 rectangles soit horizontalement, soit verticalement
        if (depth % 2) {
            drawRect(
                gridCanva(x, MODULO_1),
                gridCanva(y, MODULO_1),
                gridCanva(w * size, MODULO_2),
                gridCanva(h - 0.1 * h, MODULO_2),
                depth - 1,
                startDepth,
                tabColor
            );
            drawRect(
                gridCanva(x + w * size, MODULO_1),
                gridCanva(y, MODULO_1),
                gridCanva(w * (1 - size), MODULO_2),
                gridCanva(h - 0.1 * h, MODULO_2),
                depth - 1,
                startDepth,
                tabColor
            );
        } else {
            drawRect(
                gridCanva(x, MODULO_1),
                gridCanva(y, MODULO_1),
                gridCanva(w - 0.1 * w, MODULO_2),
                gridCanva(h * size, MODULO_2),
                depth - 1,
                startDepth,
                tabColor
            );
            drawRect(
                gridCanva(x, MODULO_1),
                gridCanva(y + h * size, MODULO_1),
                gridCanva(w - 0.1 * w, MODULO_2),
                gridCanva(h * (1 - size), MODULO_2),
                depth - 1,
                startDepth,
                tabColor
            );
        }
    } else {
        // ici on vérifie que le rectangle créé n'est pas collé au bord de l'écran pour éviter qu'ils soient collés au bord
        if (
            !(x <= 0 || y <= 0 || x >= CANVA_WIDTH - w || y >= CANVA_HEIGHT - h)
        ) {
            // on crée un rectangle avec une probabilité inititalisé auparavent dans la variable BUILD_RECT
            if (random() < BUILD_RECT) {
                fill(tabColor[Math.floor(random(0, tabColor.length))]); // on change la couleur de remplissage aléatoirement
                // on construit un rectangles aux coordonnées données et avec la largeur et la hauteur données
                rect(
                    gridCanva(x, MODULO_1),
                    gridCanva(y, MODULO_1),
                    gridCanva(w, MODULO_2),
                    gridCanva(h, MODULO_2)
                );
                // on crée une div par dessus chaque rectangle de cette manière pour pouvoir interragir avec au clic
                createClickableDiv(
                    gridCanva(x, MODULO_1),
                    gridCanva(y, MODULO_1),
                    gridCanva(w, MODULO_2),
                    gridCanva(h, MODULO_2)
                );
            }
        }
    }
}

// Cette fonction appelée lorsqu'il faut entrer des coordonnées permet de vérifier que les coordonnées x et y ainsi que la largeur et la hauteur sont bien calculée
// pour que chaque rectangle soient créés selon un intervalle régulier (c'est comme si le canva était quadrillé et qu'un rectangle ne pouvait pas être créé en dehors
// des coordonnées d'un carré qui compose ce quadrillage)
function gridCanva(value, modulo) {
    if (value % modulo != 0) {
        if (value - (value % modulo) == 0) {
            value = value + (modulo - (modulo - (value % modulo)));
        } else {
            value = value - (value % modulo);
        }
    }
    return value;
}

// Cette fonction crée une div HTML et l'injecte sur la page à des coordonnées précises (qui correpondent à chaque fois à celles d'un rectangle étant donnée
// qu'elle est appelée dès lors qu'un rectangle est créé -> une div prend exactement les valeurs du rectangle qui lui est associé)
function createClickableDiv(x, y, w, h) {
    let newDiv = document.createElement("div");
    newDiv.style.position = "absolute";
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";
    newDiv.style.width = w + "px";
    newDiv.style.height = h + "px";
    newDiv.className = "click";
    document.body.appendChild(newDiv);
}

// Cette fonction permet, après récupération de toutes les div qui se placent sur chaque rectangle, d'ajouter un évènement lors du clic de l'utilisateur
// sur une div. Cela simule le clic sur un rectangle et montre le principe de l'algorithme utilisé :
// En effet on recrée des rectangles dans le rectangle cliqué de la même manière que ceux affichés à au cahrgement de la page (avec une seule itération)
function addEventToRect(tab, tabColor) {
    for (let i = 0; i < tab.length; i++) {
        tab[i].addEventListener("click", () => {
            let left = tab[i].style.left.slice(0, -2);
            let top = tab[i].style.top.slice(0, -2);
            let width = tab[i].style.width.slice(0, -2);
            let height = tab[i].style.height.slice(0, -2);

            let ratio = random(MIN_RATIO_RECT, MAX_RATIO_RECT);

            if (random() < 0.5) {
                drawRect(
                    left,
                    top,
                    width * ratio,
                    height - 0.1 * height,
                    1,
                    1,
                    tabColor
                );
                drawRect(
                    left + width * ratio,
                    top,
                    width * (1 - ratio),
                    height - 0.1 * height,
                    1,
                    1,
                    tabColor
                );
            } else {
                drawRect(
                    left,
                    top,
                    width - 0.1 * width,
                    height * ratio,
                    1,
                    1,
                    tabColor
                );
                drawRect(
                    left,
                    top + height * ratio,
                    width - 1 * width,
                    height * (1 - ratio),
                    1,
                    1,
                    tabColor
                );
            }
        });
    }
}
