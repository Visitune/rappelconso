"""
Extraction des fiches RappelConso depuis l'API publique.
Utilisé par le workflow GitHub Actions .github/workflows/update-data.yml.

Usage:
    python scripts/update_data.py
"""
import requests, json, math, os

API = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces"

def fetch(path, retries=3):
    for attempt in range(retries):
        try:
            r = requests.get(API + path, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            if attempt == retries - 1:
                raise
            print(f"Retry {attempt+1}/{retries} for {path}: {e}")

def main():
    meta = fetch("/records?limit=1&refine=categorie_produit:alimentation")
    total = meta["total_count"]
    pages = math.ceil(total / 100)
    print(f"Total records: {total}, pages: {pages}")

    all_records = []
    for i in range(pages):
        url = f"/records?limit=100&offset={i*100}&refine=categorie_produit:alimentation&order_by=date_publication+desc"
        data = fetch(url)
        batch = data.get("results", [])
        all_records.extend(batch)
        if (i+1) % 10 == 0:
            print(f"  Page {i+1}/{pages} — {len(all_records)} records so far")

    if len(all_records) < total * 0.95:
        raise RuntimeError(f"Only fetched {len(all_records)}/{total} records — aborting to avoid overwriting with incomplete data")

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dst = os.path.join(repo_root, "data.json")
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False)

    print(f"Extracted {len(all_records)} records -> {dst}")

if __name__ == "__main__":
    main()
