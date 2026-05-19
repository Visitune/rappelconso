"""
Compresse data.json (format tableau d'objets) vers un format
tabulaire {keys, rows} pour réduire la taille de ~42%.

Usage:
    python compress_data.py                    # data.json -> data.json (écrase)
    python compress_data.py data.json          # idem
    python compress_data.py chemin/vers/data.json data_compressé.json

Le fichier compressé reste compatible : l'app JS détecte
automatiquement le format {keys, rows} et le décompresse.
"""
import json, sys, math

def compress(data):
    if isinstance(data, dict) and "keys" in data and "rows" in data:
        print("Déjà au format compressé.")
        return data
    if not isinstance(data, list) or not data:
        print("Pas un tableau JSON valide.")
        return data
    keys = list(data[0].keys())
    rows = [[obj.get(k) for k in keys] for obj in data]
    return {"keys": keys, "rows": rows}

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "data.json"
    dst = sys.argv[2] if len(sys.argv) > 2 else src
    with open(src, "r", encoding="utf-8-sig") as f:
        data = json.load(f)
    compressed = compress(data)
    before = len(json.dumps(data, ensure_ascii=False))
    after = len(json.dumps(compressed, ensure_ascii=False))
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(compressed, f, ensure_ascii=False, separators=(",", ":"))
    pct = (1 - after / before) * 100 if before else 0
    print(f"{src} -> {dst}")
    print(f"  Avant : {before / 1024 / 1024:.1f} Mo")
    print(f"  Après : {after / 1024 / 1024:.1f} Mo")
    print(f"  Gain  : {pct:.1f}%")

if __name__ == "__main__":
    main()
