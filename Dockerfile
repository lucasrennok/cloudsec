# CloudSec — imagem mínima, servindo o site estático por NGINX (não-root).
FROM nginx:1.27-alpine

# Remove a configuração padrão e usa a nossa, com cabeçalhos de segurança.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/cloudsec.conf

# Copia apenas os arquivos estáticos necessários.
COPY index.html /usr/share/nginx/html/index.html
COPY src/ /usr/share/nginx/html/src/

# A imagem nginx:alpine já traz o usuário não-root "nginx".
# Ajusta permissões para que o NGINX rode sem privilégios de root.
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
