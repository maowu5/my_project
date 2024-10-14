FROM php:8.2-fpm

RUN pecl install igbinary redis \
    && docker-php-ext-enable igbinary redis \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-install mysqli \
    && rm -rf /var/cache/apk/* /tmp/*

WORKDIR /var/www/html
COPY . /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
