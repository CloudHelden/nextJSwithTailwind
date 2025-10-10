FROM alpine:latest
RUN apk add --no-cache nginx bash
RUN mkdir -p /run/nginx && \
    mkdir -p /var/www/html && \
    mkdir -p /var/www/html-google && \
    mkdir -p /var/www/html-default

ADD ./examples/index.html /var/www/html/index.html
ADD ./examples/nginx.conf /etc/nginx/nginx.conf
ADD ./examples/conf.d/*.conf /etc/nginx/conf.d/
ADD ./examples/index-google.html /var/www/html-google/index.html
ADD ./examples/html/*.html /var/www/html-default/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]