# FROM php:7.4-fpm
FROM php:8.0-fpm

RUN apt update -y \
    && apt install -y nginx

RUN apt update -y && apt install -y openssl zip unzip git libzip-dev \
    supervisor \
    libpng-dev \
    nano\
    libonig-dev \
    libxml2-dev \
    libjpeg62-turbo-dev
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd

RUN apt-get install -y libz-dev libmemcached-dev && \
    pecl install memcached && \
    docker-php-ext-enable memcached

WORKDIR /var/www/html

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx.conf /etc/nginx/sites-enabled/default
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker.conf /usr/local/etc/php-fpm.d/docker.conf
COPY php.ini-development /usr/local/etc/php/php.ini

RUN mkdir -p -m777 /var/run/php/

RUN rm /usr/local/etc/php-fpm.d/zz-docker.conf
COPY entrypoint.sh /etc/entrypoint.sh
COPY --chown=www-data:www-data . /var/www/html

RUN chmod -R 777 public
RUN chmod -R 777 storage
RUN chmod -R 777 bootstrap/cache
RUN composer install
# RUN php artisan migrate
CMD php artisan cache:clear
CMD php artisan config:clear
CMD php artisan config:cache
CMD php artisan route:cache

EXPOSE 8000
ENTRYPOINT ["sh", "/etc/entrypoint.sh"]
