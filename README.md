# RappelConso — Guide Rapide

Dashboard interactif: 12,945+ rappels alimentaires (2021-2026 dans le cache local actuel) avec filtres, analyses statistiques et recherche avancée.
**Données mises à jour automatiquement** — voir section "Mise à Jour des Données" ci-dessous.

## 5 Pages

| Page | Fait |
|------|------|
| **Dashboard** | KPIs: +29% tendance, 85% volontaires, top catégories/risques |
| **Recherche** | Recherche simple par marque/produit, tableau sortable |
| **Analyses** | Chi² réel, p-value, V de Cramer, résidus standardisés, Pareto, anomalies temporelles, saisonnalité, criticité, marques, géographie |
| **Requêtes** | Regex avancées: `viandes`, `listeria`, `viandes\|salmonella` |
| **À propos** | Infos source |

## Filtres: Comment les Utiliser

### ✅ Gardent Chi²
- Aucun filtre
- Période: "1 an", "3 mois", "6 mois" (≥3 catégories)
- Marque (ex: "Andrieux") (≥24 catégories)

### ❌ Cassent Chi²
- Catégorie unique (ex: "viandes") → 1 catégorie = impossible de comparer
- Risque unique (ex: "listeria") → 1 risque = impossible de comparer

**Solution:** Page **Requêtes** pour analyser une catégorie/risque seul

---

## Méthodes Statistiques Ajoutées

### Chi² — Indépendance Catégorie × Risque

- **Question:** les catégories de produits ont-elles des profils de risques différents ?
- **Calcul:** `χ² = somme((observé - attendu)^2 / attendu)`.
- **Degrés de liberté:** `(nb_categories - 1) * (nb_risques - 1)`.
- **Décision:** lien statistique si `p-value < 0.05`, pas avec un seuil fixe unique.
- **Force:** `V de Cramer = sqrt(χ² / (n * min(lignes-1, colonnes-1)))`.
- **Qualité:** la page signale la part des cellules avec effectif attendu `< 5`, car trop de petites cellules fragilisent le test.

### Résidus Standardisés

- **Formule:** `résidu = (observé - attendu) / sqrt(attendu)`.
- **Lecture:** `résidu > 2` = couple catégorie-risque surreprésenté ; `résidu < -2` = sous-représenté.
- **Utilité:** identifie les couples responsables du Chi², par exemple `Viandes × Salmonella`.

### Anomalies Temporelles

- **Formule:** `z = (volume_mois - moyenne_mensuelle) / écart_type`.
- **Lecture:** `z > 2` indique un mois atypiquement élevé.
- **Complément:** comparaison au même mois N-1 quand disponible pour limiter les faux signaux saisonniers.

### Saisonnalité Normalisée

- **Indice:** `moyenne du mois / moyenne mensuelle globale`.
- **Lecture:** `1.25` = mois 25% au-dessus de la normale ; `0.80` = mois 20% sous la normale.

### Score de Criticité

Score opérationnel sur 100, non officiel, combinant:

- gravité du risque ;
- rappel imposé ou volontaire ;
- couverture géographique ;
- durée de commercialisation ;
- conservation au froid ;
- récurrence de la marque.

### Récurrence Marques

- **Score:** `rappels * log(1 + mois_distincts) * risques_distincts`.
- **Utilité:** repère les marques qui reviennent souvent, dans le temps, avec plusieurs types de problèmes.

### Géographie

- Détecte `France entière`.
- Extrait les départements via les codes entre parenthèses, par exemple `(59)`.
- Conserve aussi le nombre de zones brutes, car le champ source mélange départements, régions, villes et texte libre.

Tous les blocs disposent de boutons `?` ou `i` dans l'interface pour expliquer la méthode aux utilisateurs.

---

## Page Requêtes — Exemples

```
viande              → 2,941 rappels
listeria            → 3,245 rappels
viande|salmonella   → Viande OU Salmonella
```

**Affiche:** Fréquence, marques, graphique temporel, détails (50 first)

---

## Données (Vue Globale)

- **Total:** 12,945+ rappels (cache local: 2021-03-26 à 2026-05-19)
- **Catégories:** 24 (Lait 24%, Viande 23%, Poisson 8%)
- **Risques:** 57 libellés normalisés par séparation `|`
- **Tendance:** +29% sur 3 mois
- **Volontaires:** 85%, Obligatoires: 15%

---

## Mise à Jour des Données

### Fonctionnement Automatique

**Deux couches de données** garantissent toujours les rappels les plus récents:

1. **Cache statique** (`data.json` — 14.6 MB)
   - Mis à jour **quotidiennement à 6h UTC** par GitHub Actions
   - Contient les rappels alimentaires disponibles dans le cache local
   - Récupérés via API publique: `data.economie.gouv.fr`

2. **Fusion API temps réel** (au chargement de l'app)
   - Récupère les **100 derniers rappels des 7 derniers jours**
   - Filtre par catégorie "alimentation"
   - Déduplique par ID (évite les doublons)
   - **Ajoute automatiquement** les nouveaux rappels manquants

### Résultat

- **Au démarrage:** Affiche `data.json` + rappels API récents fusionnés
- **Badge en bas à gauche:** Affiche le nombre de fiches en cache + les nouvelles ajoutées
  - Ex: `12,969 fiches (+24)` = 24 nouveaux rappels depuis la dernière mise à jour

### Comment Vérifier

Ouvrez **Developer Tools** (F12) → **Console**, puis visitez l'app:

```
API: fetched 40 recent (last 7 days) alimentation records
Fusion API...
```

**Le nombre total devrait augmenter** si des rappels récents ont été ajoutés.

---

## Stack Technique

- **Frontend:** Vanilla JS (ES2022) — pas de dépendances
- **Graphiques:** Chart.js 4.4 — 14+ charts responsifs
- **Théme:** CSS custom properties — dark/light mode avec persistance
- **Infrastructure:**
  - Déployé sur Vercel (CDN global)
  - GitHub Actions pour mise à jour quotidienne de data.json
  - API source: `data.economie.gouv.fr` (publique, sans auth)
- **Performance:**
  - Single-page app (SPA) — pas de rechargement
  - Fusion API côté client — aucun backend nécessaire
  - Cache local possible via localStorage (optionnel)
