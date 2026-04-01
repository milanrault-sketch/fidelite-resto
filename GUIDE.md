# Guide de déploiement — Carte Fidélité

## Ce que tu as déjà fait ✅
- Compte Supabase créé
- Base de données configurée (tables créées)

---

## Étape 1 — Créer un compte GitHub (5 min)

1. Va sur https://github.com
2. Clique "Sign up"
3. Crée ton compte (c'est gratuit)

---

## Étape 2 — Uploader le projet sur GitHub (3 min)

1. Une fois connecté sur GitHub, clique le "+" en haut à droite → "New repository"
2. Nom du repo : `fidelite-resto`
3. Laisse tout par défaut, clique "Create repository"
4. Sur la page qui apparaît, clique "uploading an existing file"
5. **Glisse-dépose le dossier `fidelite` entier** dans la zone
6. Clique "Commit changes"

---

## Étape 3 — Déployer sur Vercel (5 min)

1. Va sur https://vercel.com
2. Clique "Sign up" → connecte-toi avec GitHub (c'est le plus simple)
3. Clique "Add New Project"
4. Tu vois ton repo `fidelite-resto` → clique "Import"
5. **IMPORTANT** — Avant de cliquer Deploy, clique sur "Environment Variables" et ajoute :

   | Nom | Valeur |
   |-----|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://iqmopgfgiejdjcjjetis.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_s7U3i90Yj1V2pzbnrWPVxg_ONxtcr7z` |

6. Clique "Deploy"
7. Attends 2-3 minutes → ton app est en ligne ! 🎉

---

## Étape 4 — Configurer le restaurant (2 min)

1. Va sur `ton-app.vercel.app/commercant`
2. Entre le PIN : **1234**
3. Va dans l'onglet "Config"
4. Entre le nom de ton restaurant, le ratio de points
5. Clique "Enregistrer"

---

## Comment utiliser l'app

### Côté commerçant
- URL : `ton-app.vercel.app/commercant`
- PIN par défaut : `1234`
- Pour ajouter des points : tape le numéro du client → entre le montant → clique "+ Ajouter les points"

### Côté client
- URL d'inscription : `ton-app.vercel.app`
- Le client entre son prénom + téléphone → sa carte est créée
- Il peut sauvegarder le lien ou l'installer en PWA

---

## Changer le PIN commerçant

Dans le fichier `pages/commercant.tsx`, ligne ~13 :
```
const PIN = '1234' // Change cette valeur
```

---

## Support
En cas de problème, reviens sur Claude avec une capture d'écran de l'erreur !
