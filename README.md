# cobaltinou-workoutgen

# Workout Gen

`cobaltinou-workoutgen-v2.1`

Générateur de séances d'entraînement à la kettlebell, au poids de corps, au TRX et à l'élastique. Application web autonome, installable sur écran d'accueil iOS et utilisable hors ligne.

---

## 1. Description

### Objectif

Produire une séance d'entraînement cohérente en un clic, pour les jours sans inspiration. L'outil ne remplace pas un coach et ne propose aucun suivi de progression : il sert de banque d'idées structurée, à partir de règles de programmation issues des méthodes CrossFit et StrongFirst.

### Principe

L'utilisateur ne choisit que trois paramètres : la **zone** travaillée, la **durée**, la **difficulté**, plus une option cardio. Tout le reste — format de séance, sélection des mouvements, nombre de répétitions, nombre de rounds — est déterminé par le générateur selon un jeu de règles fixes. Cette répartition est volontaire : elle garantit la variété d'une séance à l'autre tout en empêchant les combinaisons incohérentes.

### Banque de mouvements

61 mouvements, chacun porteur de deux attributs :

| Attribut | Valeurs |
|---|---|
| **Type** | `Ballistic` (explosif, phase de vol) · `Grind` (lent, tension continue) · `N/A` (cyclique, ex. course) |
| **Class** | `Upper body` · `Lower body` · `Posterior chain` · `Abs` · `Core` · `Cardio` |

Un mouvement peut appartenir à plusieurs classes. La première listée est la classe principale, celle qui détermine son appartenance à une zone.

Matériel couvert : kettlebell, TRX, élastique, corde à sauter, poids de corps.

### Formats de séance

| Format | Principe |
|---|---|
| **EMOM** | Une station par minute, cycles complets répétés |
| **AMRAP** | Un maximum de tours du circuit dans le temps imparti |
| **Rounds for Time** | Volume fixe, le plus vite possible |
| **Complex** | Enchaînement sans reposer la kettlebell, un côté puis l'autre |
| **Intervals** | 30 s de travail / 30 s de repos sur chaque station |

### Barèmes de répétitions

Un « type global » caché est tiré à chaque génération et fixe la logique de répétitions :

| Barème | Ballistic | Grind | Esprit |
|---|---|---|---|
| **CrossFit** | 20 | 10 | Volume, densité métabolique |
| **StrongFirst** | 10 | 5 | Qualité de force, séries courtes |
| **Equal** | identique | identique | Un même chiffre partout (4, 5, 8 ou 10) |

Les mouvements unilatéraux prennent la moitié des répétitions par côté (sauf en barème Equal, où le chiffre est identique de chaque côté).

### Difficulté

| Niveau | Multiplicateur |
|---|---|
| **Base** | ×1 |
| **Inter** | ×1,5 |
| **Expert** | ×2 |

S'applique aux répétitions, aux gainages tenus et aux portés. Les mouvements cardio ont des valeurs fixes (voir §2).

---

## 2. Conditions

Règles appliquées par le générateur. Chacune est vérifiée automatiquement sur 12 000 générations à chaque livraison.

### Composition par zone

| Zone | Composition |
|---|---|
| **Upper body** | Tendance Grind, avec exactement 1 mouvement Ballistic |
| **Lower body** | Tendance Grind, avec exactement 1 mouvement Ballistic |
| **Fullbody** | 100 % Ballistic, aucun Grind |
| **Core** | 100 % Grind, uniquement abdos et gainage |

- `Posterior chain` alimente les zones **Lower body** et **Fullbody**.
- Pour Upper body et Lower body, un mouvement n'est éligible que si sa classe **principale** n'est ni `Abs`, ni `Core`, ni `Cardio` — sans quoi un gainage pourrait apparaître dans une séance de jambes.

### Zone Core

- Le format **Complex** est exclu : la banque Core est majoritairement TRX et poids de corps, incompatible avec un enchaînement kettlebell.
- Le barème **StrongFirst** est exclu : 5 répétitions de sit-ups n'ont aucun sens. Seuls CrossFit et Equal sont tirés.
- L'option cardio est **grisée** dans l'interface : la zone reste 100 % abdos et gainage.

### Zone Fullbody

- **Bloquée en dessous de 14 minutes.** Le bouton est désactivé et la sélection bascule automatiquement sur Upper body.

### Option cardio

Indisponible dans quatre situations :

| Condition | Raison |
|---|---|
| Durée < 14 min | Séance trop courte pour intégrer un élément purement cardio |
| Zone Core | Zone réservée aux abdos et au gainage |
| Format Complex | S'exécute sans reposer la kettlebell |
| Format Intervals | Travaille au temps sur chaque station |

Quand elle est disponible, l'option **ajoute un créneau** au circuit plutôt que d'en remplacer un. Le cardio n'apparaît spontanément qu'en zone Fullbody, et jamais si l'option en ajoute déjà un : **maximum 1 élément cardio par séance**, toutes sources confondues.

Valeurs cardio fixes, indépendantes du barème global :

| Mouvement | Base | Inter | Expert |
|---|---|---|---|
| Double-unders | 30 | 40 | 50 |
| Mountain climbers | 20 | 30 | 40 |
| Burpees | 5 | 10 | 15 |
| Burpees over KB | 5 | 10 | 15 |

Les courses (400 m, 800 m) sont réservées aux formats **AMRAP** et **Rounds for Time**, et conservent leur distance quelle que soit la difficulté — la distance fait partie du nom du mouvement.

### Contraintes de format

- **Complex** : ne pioche que dans les mouvements kettlebell. Ni portés, ni gainages tenus, ni cardio. Barème StrongFirst ou Equal uniquement.
- **Intervals** : ignore le barème global, le travail étant chronométré.
- **EMOM et Intervals** : la durée réelle est arrondie au multiple entier du cycle le plus proche de la durée demandée, pour ne jamais tronquer le dernier cycle. L'ajustement est signalé dans la consigne.

### Familles de mouvements

Deux mouvements d'une même famille ne peuvent jamais coexister dans une séance. Un mouvement composite appartient à plusieurs familles : le thruster est un squat **et** un press, il exclut donc les deux.

Familles définies : swing · clean · clean & jerk · snatch · row · press · thruster · deadlift · overhead squat · lunge · push-up · burpee · run · flexion du tronc · hollow · plank · side plank · rollout · rotation · anti-rotation.

### Dimensionnement

| Durée | Mouvements | Cardio |
|---|---|---|
| 8–12 min | 3 | Bloqué |
| 14–20 min | 4 (+1 si cardio) | Disponible |
| 22–30 min | 5 (+1 si cardio) | Disponible |

Le format **Complex** fait exception : 5 mouvements jusqu'à 20 min, 6 au-delà.

Calcul des rounds :

- **Rounds for Time** et **Complex** : `durée / 4`, borné entre 3 et 8
- **EMOM** et **Intervals** : `durée réelle / nombre de mouvements`

### Autres règles

- **Maximum 2 gainages tenus par séance** — un circuit entièrement isométrique n'a pas d'intérêt. Le surplus est remplacé par du travail en répétitions.
- **Anti-répétition** : les mouvements, le format et le barème de la génération précédente sont défavorisés au tirage suivant, sans jamais être bloqués.
- **Pas deux mouvements balistiques consécutifs** dans un circuit, quand la composition le permet.

### Boutons

| Bouton | Effet |
|---|---|
| **Forger la séance** | Nouvelle séance entièrement tirée au sort |
| **Ajuster** | Conserve les mouvements, le format et le barème. N'applique que la nouvelle difficulté et l'état de la case cardio |
| **Enregistrer** | Sauvegarde la séance dans le stockage local du navigateur (20 maximum) |

Si un ajustement est impossible (ajout de cardio sur un Complex, par exemple), le ticket affiche un avertissement explicite et applique tout de même le reste. Si le stockage local est indisponible, le bouton affiche « Stockage indisponible » plutôt que d'échouer en silence.

---

## 3. Inventaire des fichiers

| Fichier | Objectif |
|---|---|
| **`index.html`** | L'application complète : banque de mouvements, moteur de génération, interface et styles. Fichier autonome, sans dépendance externe. Utilise les polices système iOS pour éviter toute requête réseau |
| **`sw.js`** | Service worker. Met l'application en cache au premier chargement pour un fonctionnement hors ligne, et vérifie le réseau en arrière-plan pour récupérer les nouvelles versions |
| **`manifest.json`** | Manifeste PWA. Définit le nom, les icônes, l'affichage plein écran et les couleurs de l'application installée sur l'écran d'accueil |
| **`icon-192.png`** | Icône de l'application, 192 × 192 px |
| **`icon-512.png`** | Icône de l'application, 512 × 512 px |
| **`README.md`** | Ce document |

### Point de vigilance

Le fichier `sw.js` contient une constante `CACHE_VERSION`. **Elle doit être incrémentée à chaque nouvelle version publiée**, sans quoi les appareils continueront de servir l'ancienne version depuis leur cache, même après la mise à jour du dépôt.

---

## Installation

L'application est hébergée via GitHub Pages depuis la branche `main`.

**Sur iPhone :**

1. Ouvrir l'URL du site dans **Safari**
2. Attendre le chargement complet — c'est à ce moment que le cache hors ligne se constitue
3. Bouton Partager → **Sur l'écran d'accueil**

Après une mise à jour du dépôt, l'application récupère la nouvelle version en arrière-plan et l'applique au lancement suivant.

## Versionnement

`vMAJEURE.MINEURE`

- La **mineure** est incrémentée à chaque livraison
- La **majeure** est incrémentée lors de la validation d'un palier fonctionnel
