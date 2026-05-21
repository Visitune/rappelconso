"""
Extraction des fiches RappelConso depuis l'API publique.
Utilisé par le workflow GitHub Actions .github/workflows/update-data.yml.

Usage:
    python scripts/update_data.py
"""
import requests, json, math, os

API = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces"

def fetch(path):
    r = requests.get(API + path, timeout=30)
    r.raise_for_status()
    return r.json()

def main():
    meta = fetch("/records?limit=1&refine=categorie_produit:alimentation")
    total = meta["total_count"]
    pages = math.ceil(total / 100)

    urls = [
        f"/records?limit=100&offset={i*100}&refine=categorie_produit:alimentation&order_by=date_publication+desc"
        for i in range(pages)
    ]

    import asyncio
    # Use requests synchronously (simpler for Actions)
    all_records = []
    for url in urls:
        data = fetch(url)
        all_records.extend(data.get("results", []))

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dst = os.path.join(repo_root, "data.json")
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False)

    print(f"Extracted {len(all_records)} records -> {dst}")

if __name__ == "__main__":
    main()
