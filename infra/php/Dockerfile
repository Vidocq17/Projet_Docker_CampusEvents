FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    git \
    unzip \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    rabbitmq-c-dev

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    opcache \
    gd \
    zip \
    mbstring \
    intl

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install apcu redis amqp \
    && docker-php-ext-enable apcu redis amqp \
    && apk del .build-deps

COPY --link \
    --from=ghcr.io/symfony-cli/symfony-cli:latest \
    /usr/local/bin/symfony /usr/local/bin/symfony

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY infra/php/php.ini /usr/local/etc/php/conf.d/zz-custom.ini

WORKDIR /var/www/backend
