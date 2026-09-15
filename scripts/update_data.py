"""
Extraction des fiches RappelConso depuis l'API publique.
Utilisé par le workflow GitHub Actions .github/workflows/update-data.yml.

Usage:
    python scripts/update_data.py
"""
import requests, json, os

API = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces"

# Champs effectivement lus par index.html (cf. grep sur d.xxx / r.xxx) — l'export
# complet expose une trentaine de champs, dont une dizaine (numero_fiche,
# identification_produits, informations_complementaires*, preconisations_sanitaires,
# rappel_guid, numero_contact, lien_vers_la_liste_des_distributeurs, categorie_produit,
# numero_version) ne sont jamais utilisés côté client : les garder doublerait le poids
# de data.json téléchargé par chaque visiteur pour rien.
FIELDS = [
    "id", "marque_produit", "libelle", "modeles_ou_references", "date_publication",
    "nature_juridique_rappel", "sous_categorie_produit", "risques_encourus",
    "motif_rappel", "date_debut_commercialisation", "date_date_fin_commercialisation",
    "date_de_fin_de_la_procedure_de_rappel", "distributeurs", "conditionnements",
    "temperature_conservation", "marque_salubrite", "zone_geographique_de_vente",
    "modalites_de_compensation", "conduites_a_tenir_par_le_consommateur",
    "lien_vers_la_liste_des_produits", "lien_vers_la_fiche_rappel",
    "lien_vers_affichette_pdf", "liens_vers_les_images",
]

def fetch(path, retries=5):
    for attempt in range(retries):
        try:
            r = requests.get(API + path, timeout=60)
            r.raise_for_status()
            return r
        except Exception as e:
            if attempt == retries - 1:
                raise
            print(f"Retry {attempt+1}/{retries} for {path}: {e}")

def main():
    meta = fetch("/records?limit=1&refine=categorie_produit:alimentation").json()
    total = meta["total_count"]
    print(f"Total records (API): {total}")

    # /records ne pagine que jusqu'à offset+limit <= 10000 (limite Opendatasoft) :
    # au-delà, l'API renvoie HTTP 400 et toute pagination par offset finit par
    # échouer une fois le dataset passé 10 000 fiches. /exports/json renvoie le
    # jeu complet en un seul appel, sans plafond.
    url = "/exports/json?refine=categorie_produit%3Aalimentation"
    raw_records = fetch(url).json()
    all_records = [{k: r.get(k) for k in FIELDS} for r in raw_records]

    if len(all_records) < total * 0.95:
        raise RuntimeError(f"Only fetched {len(all_records)}/{total} records — aborting to avoid overwriting with incomplete data")

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dst = os.path.join(repo_root, "data.json")
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False)

    print(f"Extracted {len(all_records)} records -> {dst}")

if __name__ == "__main__":
    main()
