# RappelConso — Guide Rapide

Dashboard interactif: 12,945 rappels alimentaires (2013-2024) avec filtres, analyses statistiques et recherche avancée.

## 5 Pages

| Page | Fait |
|------|------|
| **Dashboard** | KPIs: +29% tendance, 85% volontaires, top catégories/risques |
| **Recherche** | Recherche simple par marque/produit, tableau sortable |
| **Analyses** | Chi² (test indépendance), Pareto 80/20, Corrélation, Tendance |
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

## Chi² — Les 3 Points Essentiels

1. **Question:** "Certains produits ont-ils des risques spécifiques?"
2. **Résultat:**
   - `χ² > 3.84` = **LIÉ** (oui, lien statistique)
   - `χ² ≤ 3.84` = **INDÉPENDANT** (non, c'est aléatoire)
3. **Condition:** Besoin ≥2 catégories ET ≥2 risques

**Erreur "Pas assez de catégories"?** = Vous avez filtré à 1 catégorie. Passez à **Requêtes**.

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

- **Total:** 12,945 rappels (2013-2024)
- **Catégories:** 24 (Lait 24%, Viande 23%, Poisson 8%)
- **Risques:** 182 types (Listeria 25%, Chimique 15%, Pesticides 11%)
- **Tendance:** +29% sur 3 mois
- **Volontaires:** 85%, Obligatoires: 15%

---

## Stack Technique

- Vanilla JS (ES2022) — pas de dépendances
- Chart.js 4.4 — graphiques
- CSS custom properties — dark/light mode
- Déployé sur Vercel
- Source: data.economie.gouv.fr
