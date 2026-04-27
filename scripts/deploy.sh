#!/usr/bin/env bash
# deploy.sh — appelé par GitHub Actions (ou manuellement) sur le serveur Ubuntu
set -euo pipefail

echo "==> [$(date '+%Y-%m-%d %H:%M:%S')] Début du déploiement"

# 1. Mise à jour du code
echo "==> git pull"
git pull origin main

# 2. Rebuild et redémarrage du conteneur
echo "==> docker compose up"
docker compose up -d --build --remove-orphans

# 3. Nettoyage des images obsolètes
echo "==> docker image prune"
docker image prune -f

echo "==> [$(date '+%Y-%m-%d %H:%M:%S')] Déploiement terminé"
echo "==> Site accessible sur http://$(hostname -I | awk '{print $1}')"
