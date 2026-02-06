up:
	docker compose up -d

down:
	docker compose down

logs-php:
	docker compose logs -f php

install-symfony:
	docker compose run --rm php symfony new . --webapp --no-git

composer-install:
	docker compose run --rm php composer install

migration:
	docker compose exec php symfony console make:migration

migrate:
	docker compose exec php symfony console doctrine:migrations:migrate --no-interaction

entity:
	docker compose exec php symfony console make:entity

cache-clear:
	docker compose exec php symfony console cache:clear
