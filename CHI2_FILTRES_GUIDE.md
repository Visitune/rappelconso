# 🔄 Chi² & Filtres — Comment Ça Marche?

## 🎯 La Grande Question
**"Pourquoi le Chi² dit 'pas assez de catégories' quand je filtre?"**

---

## 🔍 Explication Simple

### Le Chi² a BESOIN de:
```
✅ Au MOINS 2 catégories de produits
✅ Au MOINS 2 types de risques distincts
```

### Quand tu FILTRES:
```
Avant filtre:   24 catégories × 182 risques = Chi² CALCULE ✓
                ↓
Filtre: "viandes" 
                ↓
Après filtre:   1 catégorie (viandes) × 69 risques = Chi² IMPOSSIBLE ✗
                "Pas assez de catégories!"
```

---

## 📊 Exemple Visuel

### SANS FILTRE (Tous les données)
```
            Listeria  Salmonella  Pesticide  Allergène
Lait          1512      456         12         256
Viande        1295      673         18         145
Poisson        89       201         5          34
Céréales       82       145        425         98
[20 autres]    ...       ...        ...         ...

= 24 catégories × 182 risques = Chi² POSSIBLE ✓
```

**Résultat:** Chi² = 542.3 (LIÉ) ✓

---

### AVEC FILTRE "Viandes"
```
            Listeria  Salmonella  Pesticide  Allergène
Viande        1295      673         18         145

= 1 seule catégorie × 69 risques = Chi² IMPOSSIBLE ✗
"Pas assez de catégories!"
```

**Raison:** Chi² compare les catégories ENTRE ELLES. Avec 1 seule, pas de comparaison possible!

---

## 🎯 Quand Chi² Fonctionne vs Pas?

| Filtre | Catégories | Risques | Chi² | Raison |
|--------|-----------|---------|------|--------|
| **Aucun** | 24 | 182 | ✅ OUI | Données complètes |
| **Viandes** | 1 | 69 | ❌ NON | 1 seule catégorie |
| **Lait** | 1 | 78 | ❌ NON | 1 seule catégorie |
| **30 jours** | 3 | 45 | ✅ PEUT | 3 catégories = OK |
| **Lait + Listeria** | 1 | 1 | ❌ NON | 1×1 = impossible |
| **Listeria** (risque) | 24 | 1 | ❌ NON | 1 seul risque |

---

## 💡 Règles à Retenir

### ✅ Chi² FONCTIONNE quand:
```
• Vous AVEZ au moins 2 catégories de produits
• Vous AVEZ au moins 2 types de risques
```

### ❌ Chi² NE FONCTIONNE PAS quand:
```
• Vous filtrez sur 1 seule catégorie (ex: "viandes")
• Vous filtrez sur 1 seul risque (ex: "listeria")
• Les données filtrées = trop peu de variété
```

---

## 🚀 Comment Avoir Un Chi² Valid?

### Option 1: NE PAS FILTRER
```
Allez sur Analyses sans filtre → Chi² calcule ✓
Montre le lien pour TOUTES les données
```

### Option 2: FILTRER INTELLIGEMMENT
```
Filtre: "30 derniers jours" 
→ 3+ catégories × 45 risques = Chi² possible ✓
```

### Option 3: FILTRER PAR RISQUE (pas catégorie)
```
Filtre: "Listeria" (risque)
→ 24 catégories × 1 risque = ❌ NE MARCHE PAS
Car besoin 2+ risques aussi!
```

### Option 4: UTILISER REQUÊTES PAGE
```
Au lieu de filtrer → utiliser page REQUÊTES
Pour interrogation ciblée sans casser Chi²
```

---

## 📋 Cas d'Usage — Comment Bien L'Utiliser

### Cas 1: Analyser Toutes Les Données
```
✓ Pas de filtre
✓ Aller en Analyses
✓ Lire Chi² (calcule automatiquement)
= Voir le lien statistique global
```

### Cas 2: Analyser Periode Récente
```
✓ Filtre: "30 jours" OU "3 mois"
✓ Aller en Analyses
✓ Chi² se recalcule sur données filtrées
= Voir si tendance change (récemment vs avant)
```

### Cas 3: Analyser Viande Spécifiquement
```
❌ NE FAITES PAS: Filtrer "viandes" → Chi² cassé

✓ FAITES PLUTÔT:
  1. Allez page REQUÊTES
  2. Interrogation: "viande" × "listeria"
  3. Voir corrélation spécifique (926 rappels)
```

### Cas 4: Comparer Avant/Après
```
✓ Sans filtre → Chi² (global)
✓ Notez le résultat
✓ Filtre: "3 mois" → Chi² se recalcule
✓ Comparez les deux résultats
= Voir si lien statistique change
```

---

## 🎓 Interprétation Par Situation

### SANS FILTRE → Chi² FONCTIONNE
```
Vous voyez:
Chi² = 542.3
V = 0.42
Résultat: LIÉ ✓

Signification:
"Dans le GLOBAL, certains produits 
ont des risques spécifiques"
```

### AVEC FILTRE "Viandes" → Chi² NE FONCTIONNE PAS
```
Vous voyez:
"Pas assez de catégories/risques distincts"

Signification:
"Avec UNE SEULE catégorie (viandes),
je ne peux pas faire de test de lien.
J'ai besoin de COMPARER au moins 2 catégories."
```

---

## 💡 Pourquoi c'est Normal?

**Le Chi² c'est un test de COMPARAISON entre catégories:**

```
Question: "Est-ce que Listeria 
affecte DIFFÉREMMENT les différentes catégories?"

Pour répondre, j'ai besoin de:
✓ Catégorie 1 (Lait)     → Listeria
✓ Catégorie 2 (Viande)   → Listeria  
✓ Catégorie 3 (Poisson)  → Listeria
[Puis comparer les différences]

Avec 1 seule catégorie → impossible de comparer!
```

---

## 🎯 Checklist: Quand Utiliser Quoi

### ANALYSES PAGE (Chi²)
```
☑ Quand: Vous voulez voir le lien GLOBAL
☑ Filtres OK: Aucun, "30j", "3m", "1an" 
☑ Filtres PROBLÉMATIQUES: Une seule catégorie
☑ Résultat: Chi² avec interprétation
```

### REQUÊTES PAGE (Interrogation)
```
☑ Quand: Vous voulez analyser UNE catégorie
☑ Filtres OK: "viandes", "lait", "listeria"
☑ Résultat: Corrélation + fréquence
☑ Pas de Chi² ici, mais c'est normal!
```

---

## ❓ FAQ

### Q: Pourquoi pas de Chi² sur catégorie filtrée?
R: Chi² = test de LIEN entre plusieurs catégories. 1 catégorie = pas de lien à tester.

### Q: Comment avoir Chi² sur "Viandes"?
R: Pas possible (besoin 2+ catégories). À la place:
   - Page REQUÊTES: "viandes" → voir corrélations
   - Ou filtre "30j" (garde 3+ catégories)

### Q: Les résultats changent si je filtre par période?
R: OUI! Chi² se recalcule:
   - 30 jours: données récentes
   - 1 an: données annuelles
   - Peut montrer des tendances différentes

### Q: Et si je filtre marque (Andrieux)?
R: ✅ Ça marche!
   - Marque filtre sur les RAPPELS, pas les catégories
   - Chi² garde 24 catégories (car c'est juste moins de rappels par catégorie)

### Q: Page Requêtes vs Analyses?
R: 
   - **Analyses**: Voir le lien GLOBAL (Chi²)
   - **Requêtes**: Interroger spécifique (pas Chi²)

---

## 🚀 Exemple Pratique Complet

### Étape 1: Analyser Global
```
1. Allez ANALYSES (aucun filtre)
2. Regardez Chi² → 542.3 = LIÉ ✓
3. Notez: "Lien significatif global"
```

### Étape 2: Analyser Récent
```
1. Filtre: "30 jours"
2. Allez ANALYSES
3. Chi² se recalcule → résultat peut être différent
4. Comparez avec global
5. Conclusion: "La tendance est-elle pareille?"
```

### Étape 3: Analyser Viandes
```
1. Page REQUÊTES (pas Analyses!)
2. Interrogation: "viandes"
3. Voir corrélations (Listeria, Salmonella)
4. Fréquence + Récurrence par marque
5. N'attendez pas Chi² (normal qu'il soit absent)
```

---

## 📝 Résumé en 1 Phrase

**"Chi² fonctionne quand vous avez plusieurs catégories à COMPARER. Si vous filtrez sur 1 catégorie = Chi² s'arrête car il n'y a rien à comparer. Utilisez REQUÊTES à la place pour analyser une catégorie spécifique."**

---

*Complément à CHI2_EXPLICATION_SIMPLE.md et ANALYSES_MODE_EMPLOI.md*
