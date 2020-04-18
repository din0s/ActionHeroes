#!/usr/bin/env bash

set -e
./node_modules/.bin/deploy-node-app --generate-default-env --overwrite
docker-compose up --remove-orphans --quiet-pull -d
./node_modules/.bin/deploy-node-app --generate-local-ports-env --format compose --overwrite
