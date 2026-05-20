# Requêtes Avancées — Guide d'Utilisation

## Vue d'ensemble

La page **Requêtes** permet une exploration approfondie de la base de 12 945 rappels alimentaires en croisant différentes dimensions: **produits, risques, marques, fréquence, récurrence**.

## 1. Interrogation par Type de Produit

### Utilisation
Utilise des **expressions régulières (regex)** pour trouver tous les rappels d'une catégorie de produit.

### Exemples
```
viande       → 2,941 rappels (tous les produits carnés)
lait         → 3,152 rappels (produits laitiers)
cereal|ble   → Céréales ET blé (le | signifie OU)
poisson      → 1,039 rappels (produits de la pêche)
charcuterie  → Charcuteries, salaisons
```

### Informations fournies
- **Total rappels** correspondant à la requête
- **Marques distinctes** impliquées
- **Top 8 marques** par fréquence (récurrence)
- **Graphique temporel** (évolution par mois)
- **Table détaillée** (Catégorie, Marque, Produit, Risque, Date)

### Cas d'usage
- "Quels produits de la marque X ont été rappelés?"
- "Combien de rappels concernent les produits étrangers?"
- "Quelle marque a le plus de rappels?"

---

## 2. Interrogation par Type de Risque

### Utilisation
Interroge la base sur les **risques spécifiques** avec normalisation automatique (les risques séparés par `|` sont décomposés).

### Exemples
```
listeria     → 3,245 rappels (formes multiples unifiées)
salmonella   → 1,142 rappels
pesticide    → 1,423 rappels
allergène    → 580 rappels
botulisme    → 72 rappels
```

### Normalisation automatique
La base contient parfois plusieurs risques séparés par des pipes:
```
"listeria|salmonella" → Décomposé en deux risques distincts
```
La requête trouve **chaque occurence** du motif recherché.

### Informations fournies
- **Total rappels** pour le risque
- **Formes distinctes** (variations du même risque)
- **Top 5 risques** correspondant au motif
- **Récurrence par marque** (quelles marques confrontées à ce risque?)
- **Évolution temporelle**

### Cas d'usage
- "Quel est l'historique des rappels Listeria?"
- "Combien de rappels liés aux pesticides?"
- "Quelles marques rencontrent le plus Salmonella?"

---

## 3. Analyse de Corrélation (Produit × Risque)

### Utilisation
Croise **deux dimensions** pour mesurer la **force du lien** entre un type de produit et un risque.

### Exemple d'analyse
```
Produit: "viande"
Risque:  "listeria"
Résultat: 1,295 rappels (10% de la base) → LIEN FORT
```

### Interprétation
| % Corrélation | Signification |
|---|---|
| **> 5%** | Lien très fort (problème systémique) |
| **2-5%** | Lien fort |
| **0.5-2%** | Lien modéré |
| **< 0.5%** | Lien faible |

### Exemples de corrélations
```
Viande × Listeria       → 1,295 rappels (10%)  [FORT]
Lait × Listeria         → 1,512 rappels (11.7%) [FORT]
Lait × Allergène        → 256 rappels (2%)     [MODÉRÉ]
Céréales × Pesticide    → 425 rappels (3.3%)   [MODÉRÉ]
Poisson × Histamine     → 89 rappels (0.7%)    [FAIBLE]
```

### Cas d'usage
- "Listeria affecte-t-elle plus les produits laitiers que carnés?"
- "Quel produit a le risque allergène le plus important?"
- "Comment les pesticides se distribuent-ils par catégorie?"

---

## 4. Statistiques Dynamiques

### Récurrence par Marque
Montre les marques les plus impliquées dans la requête actuelle.

Exemple (Viande):
```
Sans marque   → 517 rappels
Andrieux      → 101 rappels
Gast          → 48 rappels
```

**Interprétation:** Marques avec plus de rappels = plus de risques ou meilleure détection/déclaration.

### Fréquence Temporelle
Graphique en barres montrant l'évolution des rappels par mois.

**Utilité:**
- Identifier les pics de rappels (contaminations saisonnières?)
- Voir si un produit/risque est en hausse ou baisse
- Détecter des anomalies temporelles

### Table Détaillée
Affiche les premiers 50 rappels correspondant à la requête avec:
- Catégorie produit
- Marque
- Libellé produit
- Risque
- Date de publication

---

## 5. Syntaxe Regex — Guide Rapide

### Caractères spéciaux
| Pattern | Exemple | Signification |
|---------|---------|---------------|
| `.` | `sal.` | Salmonella, Salinity, Saline... |
| `*` | `lister*a` | Listeria (zéro ou plus du caractère précédent) |
| `+` | `li+` | Listeria, Lii... (un ou plus) |
| `\|` | `lait\|latte` | Lait OU Latte (alternative) |
| `^` | `^liste` | Commence par "liste" |
| `$` | `emia$` | Finit par "emia" |
| `[abc]` | `[aeiou]` | Contient a, e, i, o, ou u |
| `[^abc]` | `[^xyz]` | Contient n'importe quel caractère SAUF x, y, z |

### Exemples pratiques
```
listeria|salmonella   → Listeria OU Salmonella
viande|poisson|crusta → Viande OU Poisson OU Crustacés
[a-z]+lait           → Mots finissant en "lait"
^lait                → Produits COMMENÇANT par "lait"
produit.*france$     → Produits finissant par "france"
```

---

## 6. Exemples d'Analyses Complètes

### Cas 1: Impact Listeria sur Produits Laitiers
```
1. Query: "lait" → Retrouver tous rappels laitiers
2. Query: "listeria" → Voir le problème Listeria global
3. Corrélation: "lait" × "listeria" → Mesurer l'impact exact
Résultat: 1,512 rappels (11.7%) = Lien TRÈS FORT
Action: Renforcer les contrôles sur la chaîne du froid
```

### Cas 2: Contamination Bactérienne vs Chimique
```
Query produits: "viande"
Query risques: "listeria|salmonella|e.coli" → Risques bactériens
→ 1,800+ rappels = Viande très exposée
→ Marques top: Andrieux, Gast...
→ Pic temporel en hiver (froid protège??)
```

### Cas 3: Redondances de Risques
```
Query: "pesticide"
Affiche toutes les formes de ce risque:
- "dépassement des limites autorisées de pesticides"
- "produits phytosanitaires non autorisés"
→ Voir comment les risques sont enregistrés
```

---

## 7. Limitations et Pièges

### ⚠️ À noter
- Les regex sont **sensibles à la casse sauf si on utilise `(i)` implicitement**
  → Utilise `listeria` pas `Listeria`
- Les risques contiennent parfois des parenthèses:
  ```
  "listeria monocytogenes (agent responsable de la listériose)"
  ```
  → Utilise `listeria` pour matcher tout
- Une requête vide = pas de résultat (n'oublie pas d'entrer un motif)

### 💡 Conseils
- **Commence simple:** `viande` avant `viande|poisson|œuf`
- **Teste d'abord:** Regarde le top 3 des résultats avant d'analyser
- **Combines avec Analyses:** Après requête avancée, va voir la page "Analyses" pour contexte global

---

## 8. Intégration avec le Dashboard

| Page | Utilité |
|------|---------|
| **Dashboard** | Vue globale des KPIs et tendances |
| **Recherche** | Recherche textuelle simple (marque, produit) |
| **Analyses** | Statistiques détaillées (Chi², Pareto, corrélation globale) |
| **Requêtes** ← | Interrogation fine par regex |
| **À Propos** | Metadata et sources |

---

## 9. Données de Référence

### Chiffres clés
- **Total rappels:** 12,945
- **Produits distincts:** 24 catégories
- **Risques distincts:** 182 types
- **Marques distinctes:** ~1,400
- **Période:** 2013-2024

### Top risques globaux
1. **Listeria:** 24.7%
2. **Contaminants chimiques:** 14.8%
3. **Pesticides:** 11.0%
4. **Salmonella:** 8.6%
5. **Inertes (verre, métal):** 4.9%

### Top produits
1. **Lait & produits laitiers:** 24.3%
2. **Viandes:** 22.7%
3. **Produits de pêche:** 8.0%
4. **Autres:** 7.6%
5. **Plats préparés:** 7.0%

---

## 10. Feedback et Itérations Futures

### Améliorations possibles
- [ ] Export des résultats (CSV, JSON)
- [ ] Sauvegarde de requêtes favorites
- [ ] Alertes pour nouveaux rappels matching une requête
- [ ] Comparaison de deux requêtes (A vs B)
- [ ] Analyse de tendance par période (YoY)

**Suggestions?** Propose une issue sur GitHub!

---

*Dernière mise à jour: Mai 2026*
*RappelConso — Exploration Alimentaire*
