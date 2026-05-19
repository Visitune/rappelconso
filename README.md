# RappelConso — Exploration Alimentation

Dashboard interactif pour explorer les fiches de rappel de produits alimentaires publiées sur [data.economie.gouv.fr](https://data.economie.gouv.fr).

## Fonctionnement

Application **100% statique** (HTML/CSS/JS + JSON). Pas de backend, pas de base de données.

1. **`index.html`** — Application monopage avec 4 vues :
   - **Dashboard** — KPIs, graphiques (catégories, risques, tendance mensuelle, top marques)
   - **Recherche** — Tableau filtré avec pagination, tris, recherche texte
   - **Analyses** — Pareto 80/20, matrice de corrélation, Khi², V de Cramer, tendance linéaire
   - **À propos** — Source et statut du cache

2. **`data.json`** — Fichier statique contenant l'intégralité des fiches de rappel (format JSON array).

3. **Chart.js** — Chargé depuis CDN pour les graphiques.

## Extraction et mise à jour des données

Les données proviennent de l'API publique RappelConso :
```
https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces
```

### Mise à jour manuelle

```powershell
# Récupérer le nombre total d'enregistrements
$meta = curl.exe -s "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces/records?limit=1&refine=categorie_produit:alimentation" | ConvertFrom-Json
$total = $meta.total_count
$pages = [Math]::Ceiling([Math]::Min($total, 3000) / 100)

# Télécharger toutes les pages (max 3000 fiches)
$all = @()
for ($i = 0; $i -lt $pages; $i++) {
  $page = curl.exe -s "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces/records?limit=100&offset=$($i*100)&refine=categorie_produit:alimentation&order_by=date_publication+desc" | ConvertFrom-Json
  $all += $page.results
}

# Sauvegarder
$all | ConvertTo-Json -Depth 10 | Set-Content data.json -Encoding UTF8
```

### Python

```python
import requests, json, math

meta = requests.get(
    "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces/records",
    params={"limit": 1, "refine": "categorie_produit:alimentation"}
).json()

total = meta["total_count"]
pages = math.ceil(min(total, 3000) / 100)
all_records = []

for i in range(pages):
    data = requests.get(
        "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces/records",
        params={"limit": 100, "offset": i*100, "refine": "categorie_produit:alimentation", "order_by": "date_publication desc"}
    ).json()
    all_records.extend(data.get("results", []))

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(all_records, f, ensure_ascii=False)
```

> Le nombre de fiches est plafonné à 3 000 par l'API gratuite.

### Automatisation (GitHub Actions)

Un workflow peut être ajouté pour rafraîchir `data.json` périodiquement :

```yaml
# .github/workflows/update-data.yml
name: Update data
on:
  schedule:
    - cron: '0 6 * * 1'  # chaque lundi 6h UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.x' }
      - run: pip install requests
      - run: python scripts/update_data.py
      - run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add data.json
          git commit -m "chore: update data.json" || echo "No changes"
          git push
```

## Déploiement

### Vercel (recommandé)

Connecter le dépôt GitHub à Vercel. Aucune configuration nécessaire (projet statique).

```bash
npx vercel --prod
```

### Serveur statique

```bash
npx serve .
# ou
python -m http.server 8000
```

Ouvrir `http://localhost:8000`.

> ⚠️ L'ouverture directe de `index.html` en `file://` ne fonctionne pas (CORS bloque `fetch`).

## Personnalisation

- Modifier `data.json` pour changer le jeu de données (respecter le format tableau d'objets)
- Les filtres, tris et analyses s'adaptent automatiquement aux colonnes disponibles
- Le thème (dark/light) est sauvegardé dans `localStorage`

## Stack

- Vanilla JS (ES2022) — aucune dépendance build
- Chart.js 4.4 — graphiques
- Police Inter + JetBrains Mono — typographie
- CSS custom properties — thème dark/light
- API RappelConso v2.1 — source de données
