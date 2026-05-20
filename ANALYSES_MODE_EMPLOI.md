# 📊 Mode d'Emploi Complet — Page Analyses

## Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Section 1: Saisonnalité](#section-1-saisonnalité)
3. [Section 2: Pareto 80/20](#section-2-pareto-8020)
4. [Section 3: Matrice de Corrélation](#section-3-matrice-de-corrélation)
5. [Section 4: Résumé des Données](#section-4-résumé-des-données)
6. [Section 5: Test Chi²](#section-5-test-chi²)
7. [Section 6: Tendance Temporelle](#section-6-tendance-temporelle)
8. [Section 7: Indicateurs KPI](#section-7-indicateurs-kpi)
9. [Section 8: Analyses Avancées](#section-8-analyses-avancées)
10. [Cas d'Usage Pratiques](#cas-dusage-pratiques)

---

## Vue d'ensemble

La page **Analyses** contient 8 sections interdépendantes qui répondent à des questions clés:

| Section | Question | Réponse |
|---------|----------|---------|
| **Saisonnalité** | Quand les rappels augmentent? | Distribution par mois |
| **Pareto** | Quelles catégories sont critiques? | Top 20% = 80% des problèmes |
| **Corrélation** | Quel risque touche quel produit? | Matrice produit × risque |
| **Résumé** | Combien de catégories/risques? | Diversité & concentration |
| **Chi²** | Y a-t-il un lien statistique? | Test d'indépendance |
| **Tendance** | Les rappels augmentent? | Pente de régression linéaire |
| **KPIs** | Croissance et conformité? | Indicateurs de tendance |
| **Avancés** | Profils de sévérité? | Matrice sévérité × fréquence |

---

## Section 1: Saisonnalité

### 📅 Qu'est-ce que c'est?
Graphique en barres montrant comment les rappels se distribuent par mois (janvier à décembre).

### 🎯 À chercher
- **Pic en hiver?** → Listeria prospère au froid (chaîne du froid)
- **Pic en été?** → Contaminations bactériennes (chaleur)
- **Stable toute l'année?** → Problèmes systémiques (processus, procédure)

### 💡 Exemple Réel
```
Données: 
  Jan: 850 rappels
  Fév: 920 rappels  ← Pic (hiver = chaîne du froid)
  Juil: 650 rappels ← Creux (été = moins de produits laitiers?)
```
**Action:** Renforcer les contrôles en hiver sur la chaîne du froid

### 📊 Interprétation
| Pattern | Signification | Action |
|---------|---------------|--------|
| Pics hivernaux | Listeria/froid | Auditer chaîne du froid |
| Pics estivaux | Bactéries/chaleur | Améliorer conservation |
| Plat toute l'année | Problème structural | Réviser processus |

---

## Section 2: Pareto 80/20

### 📊 Le Principe
**80% des rappels proviennent de ~20% des catégories de produits.**

C'est le "Principe de Pareto" — dans la plupart des systèmes, 80% des effets viennent de 20% des causes.

### 🎯 Comment le Lire
```
Barre 1 (Lait):             24% (orange)  ← Top priorité
Barre 2 (Viande):           23% (orange)  ← Top priorité
Barre 3 (Poisson):          8%  (orange)  ← Top priorité
[50 autres catégories]:     45% (gris)    ← Moins critiques
                           ────────
                      Cumul: 80% atteint!
```

### 💪 À Faire
1. Identifiez la ligne **verticale 80%** (cumul atteint)
2. Tout ce qui est **avant = CRITIQUE** (barres orange)
3. Concentrez les ressources de contrôle **là-dessus**

### 🚀 Cas d'Usage
- **Budget limité?** Audit les top 20%
- **Planifier inspections?** Commencez par les barres orange
- **Allouer personnel?** Plus de contrôles sur lait/viande

---

## Section 3: Matrice de Corrélation

### 🔗 Qu'est-ce que c'est?
Tableau croisé **produits × risques** montrant le nombre de rappels pour chaque combinaison.

### 📖 Comment Lire

**LIGNES** = Catégories de produits (lait, viande, céréales...)
**COLONNES** = Types de risques (Listeria, Salmonella, pesticides...)
**COULEUR DE LA CELLULE** = Force du lien

```
                Listeria  Salmonella  Pesticides
Lait              1512      456         12      ← Lait + Listeria = fort!
                  (🟠🟠)    (🟠)       (⬜)
Viande            1295      673         18
                  (🟠🟠)    (🟠🟠)    (⬜)
Céréales           82       145        425
                  (⬜)      (⬜)       (🟠🟠) ← Céréales + Pesticides!
```

### 🎨 Légende des Couleurs
| Couleur | Signification | Nombre rappels |
|---------|---------------|---|
| 🟠🟠 Très orange | Lien TRÈS FORT | > 400 |
| 🟠 Orange | Lien FORT | 100-400 |
| ⬜ Gris clair | Lien FAIBLE | 0-100 |

### 💡 Exemple d'Analyse
```
Observation: Lait × Listeria = 1512 rappels (très fort)
Interprétation: Les produits laitiers rencontrent BEAUCOUP Listeria
Raison probable: Chaîne du froid insuffisante (Listeria = bactérie du froid)
Action: Audit des températoires stockage lait
```

### 🚀 À Faire
1. Scannez la matrice pour les **cellules orange**
2. Pour chaque orange = **paire critique**
3. Noterez: "Pourquoi ce lien?"
4. Planifiez des **contrôles ciblés**

---

## Section 4: Résumé des Données

### 📊 Qu'est-ce que c'est?
Affiche 2 metrics clés:

**CATÉGORIES DISTINCTES:**
```
24 catégories de produits
Top 3 = 55.4% des rappels
```

**TYPES DE RISQUES:**
```
182 types de risques (!) 
Top 3 = 44.3% des rappels
```

### 📈 Interprétation

| Métrique | Valeur | Signification |
|----------|--------|---------------|
| Catégories distinctes | 24 | Peu = risques concentrés | 
| Top 3 concentration | 55% | Moyen = 3 produits dominent |
| Types de risques | 182 | Beaucoup = système complexe |

### 💡 Clés
- **Concentration élevée (> 60%)** = Peu de catégories problématiques
- **Diversité élevée (> 100 risques)** = Système complexe
- **Top 3 < 50%** = Distribution équilibrée

---

## Section 5: Test Chi²

### 📐 C'est Quoi?
Test statistique répondant à: **"Y a-t-il un lien entre types de produits et types de risques?"**

### 🔢 Les 3 Métriques

#### 1️⃣ **Chi² (χ²)**
- **Valeur brute** du test
- Plus élevé = lien plus fort
- **> 3.84 = significatif**

Exemple:
- Chi² = 542 → Très significatif
- Chi² = 1.2 → Non significatif

#### 2️⃣ **V de Cramer**
- **Force du lien** (0.0 à 1.0)
- Comparable entre études

Interprétation:
```
0.0 - 0.1 = Lien très faible
0.1 - 0.3 = Lien faible
0.3 - 0.5 = Lien modéré
0.5+ = Lien FORT
```

#### 3️⃣ **Résultat (LIÉ / INDÉPENDANT)**

- **LIÉ** (Chi² > 3.84) 
  - Certains produits ont des risques SPÉCIFIQUES
  - Pas au hasard → Pattern identifiable
  
- **INDÉPENDANT** 
  - Risques aléatoires
  - Pas de relation produit-risque

### 💡 Exemple Réel

```
Chi² = 542.3
V de Cramer = 0.42
Résultat: LIÉ ✓

Interprétation:
→ Lait affecte BEAUCOUP Listeria (pas hasard)
→ Viande affecte BEAUCOUP Salmonella (pas hasard)
→ Céréales affectent BEAUCOUP pesticides (pas hasard)

Action: Contrôles ciblés JUSTIFIÉS pour chaque catégorie
```

### 🎓 Quand C'est Utile?

| Chi² | V Cramer | Décision |
|-----|----------|----------|
| > 3.84 | > 0.3 | Implantet contrôles ciblés ✓ |
| > 3.84 | < 0.3 | Lien faible, éviter surcontrôle |
| < 3.84 | N/A | Pas de lien, approche générique |

---

## Section 6: Tendance Temporelle

### 📈 Qu'est-ce que c'est?
Graphique montrant l'**évolution des rappels dans le temps** avec une **ligne de tendance mathématique**.

### 🎯 Comment Lire

```
Lignes:
  🔵 Bleue = données réelles (chaque mois)
  🟠 Orange pointillée = tendance calculée (lissage)

Pente:
  ↗ Remonte = augmentation (alerte!)
  ↘ Descend = diminution (amélioration)
  ➡️ Plate = stable
```

### 💡 Exemple

```
Période: 2023-2026
Ligne bleue: Fluctue entre 800-1200 rappels/mois
Ligne orange: Remonte doucement vers 1000

Pente = +2.5 rappels/mois
= +30 rappels par an

Interprétation:
→ Tendance à la hausse (lente)
→ À monitorer (nouvelle contamination détectée?)
→ Ou meilleure détection?
```

### 🚨 À Chercher

| Pattern | Alerte | Action |
|---------|--------|--------|
| Pic soudain | ⚠️ CRITIQUE | Enquête urgente |
| Hausse progressive | ⚠️ MOYENNE | Monitorer |
| Stable | ✓ NORMAL | Continuer surveillance |
| Baisse | ✓ BON SIGNE | Audit améliorations |

---

## Section 7: Indicateurs KPI

### 🚨 Indicateur de Croissance (3 mois)

```
📈 +29.1% 
   AUGMENTATION

Actuellement: 1000 rappels/mois
Vs 3 mois avant: 775 rappels/mois
```

**Interprétation:**
- Positif = Plus de rappels détectés (bon? mauvais?)
- Voir "Indice de Conformité" pour contexte

### ✅ Indice de Conformité Volontaire

```
85% Volontaires

= 85% des rappels sont volontaires
= Bonne autorégulation (les entreprises rappellent d'elles-mêmes)
= 15% obligatoires (gouvernement force les rappels)
```

**Benchmark:**
```
> 80% = Excellent (industrie responsable)
50-80% = Bon
< 50% = À améliorer (manque autorégulation)
```

---

## Section 8: Analyses Avancées

### 🔴 Matrice Sévérité × Fréquence

Classe les risques en 4 quadrants:

```
         FRÉQUENCE →
S       Risque A  | Risque B
É       1000x     | 3000x
V       
É    ──────────────────────
R    Risque C  | Risque D
I    100x      | 500x
T   
E       
```

**Quadrant critique:** Haute sévérité + haute fréquence = **TOP PRIORITÉ**

### 📦 Risque Dominant par Catégorie

```
Lait:        → Listeria (principal risque)
Viande:      → Salmonella (principal risque)
Céréales:    → Pesticides (principal risque)
```

**Utilité:** Adapter les contrôles par catégorie (chaîne du froid pour lait, etc.)

---

## Cas d'Usage Pratiques

### 📋 Cas 1: Audit de Conformité

**Question:** Où concentrer les ressources d'audit?

**Réponses:**
1. Pareto → Identifiez top 20% (lait + viande)
2. Corrélation → Lien produit-risque spécifique
3. Chi² → Justifie contrôles ciblés
4. Action: Audit intensif lait (Listeria) + viande (Salmonella)

### 🚨 Cas 2: Détection Anomalie

**Question:** Les rappels augmentent-ils anormalement?

**Réponses:**
1. Tendance → +29% en 3 mois = hausse anormale
2. Saisonnalité → Est-ce saisonnier (hiver) ou réel?
3. Corrélation → Quel produit/risque a augmenté?
4. Action: Enquête produit + risque spécifiques

### 📊 Cas 3: Planification Contrôles

**Question:** Comment allouer 100 inspecteurs?

**Réponses:**
1. Pareto → 80% des rappels = 20% catégories
2. Corrélation → Lait = Listeria, Viande = Salmonella
3. KPIs → 85% volontaire = bonne autorégulation
4. Action: 60 inspecteurs lait/viande, 40 autres

### 🎯 Cas 4: Rapport Exécutif

**Question:** Que dire au directeur en 30 secondes?

**Réponses clés:**
- "2 catégories (lait+viande) = 50% des rappels"
- "Chi² significatif: certains produits ont des risques spécifiques"
- "Tendance +29% en 3 mois: à monitorer"
- "85% volontaire: bonne autorégulation"

---

## Checklist d'Utilisation

**À chaque visite de la page Analyses:**

- [ ] Vérifier la saisonnalité (mois haut = alerte?)
- [ ] Regarder Pareto (top 20% identifiés?)
- [ ] Scaner corrélation (cellules orange = paires critiques?)
- [ ] Lire Chi² (lien statistique confirmé?)
- [ ] Vérifier tendance (hausse? baisse? stable?)
- [ ] Checker KPIs (croissance + conformité)
- [ ] Noter 2-3 actions concrètes

---

## Filtres et Interactions

### 🔄 Les Analyses se Recalculent Quand:

1. Vous changez de page (Dashboard → Analyses)
2. Vous appliquez un **filtre global:**
   - Marque
   - Catégorie
   - Type de risque
   - Période (30j, 3 mois, 1 an)
3. Vous cliquez un **chip** (Contamination bactérienne, etc.)

### 💡 Conseil
Les analyses filtrées montrent des **sous-populations**. Comparez avant/après pour voir l'impact des filtres.

---

## Troubleshooting

### ❌ "Chi² dit 'pas assez de catégories'"
**Cause:** Filtre appliqué = trop peu de données
**Solution:** Élargissez la période ou enlevez filtres

### ❌ "Corrélation vide"
**Cause:** Données filtrées ne croisent pas produits × risques
**Solution:** Chargez toutes les données (Tout > 30j)

### ❌ "Graphique pétablement vide"
**Cause:** Rendu Chart.js lent
**Solution:** Rafraîchissez la page (F5)

---

## Ressources

- **ADVANCED_QUERIES.md** → Interrogations regex avancées
- **README.md** → Installation et données
- **Dashboard** → Vue globale KPIs
- **Requêtes** → Recherche par produit/risque

---

*Dernière mise à jour: Mai 2026*
*RappelConso — Exploration Alimentaire*
