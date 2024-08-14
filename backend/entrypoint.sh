#!/bin/sh

# php-fpm -D && sleep 3 && service nginx start && tail -f /dev/null

php /var/www/html/artisan migrate
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf -j /var/run/supervisord.pid
