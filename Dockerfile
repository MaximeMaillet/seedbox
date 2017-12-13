FROM debian:jessie

ARG UUID=1000
ARG GGID=1000
ARG USER=torrent

RUN apt-get update && \
    apt-get install -y rtorrent \
    supervisor \
    nginx

RUN if [ ! -z $(getent group $GGID) ] ; then groupmod -o -g 2019292 $(getent group $GGID | cut -d: -f1) ; fi && \
    addgroup --system --gid $GGID $USER && \
    if [ ! -z $(getent passwd $UUID) ] ; then usermod -o -u 2019292 $(getent passwd $UUID | cut -d: -f1) ; fi && \
    useradd -l --system --home-dir /home/$USER --uid $UUID --gid $GGID $USER

RUN mkdir -p /var/rtorrent/session /var/rtorrent/torrents /var/rtorrent/downloaded /var/rtorrent/logs && \
    chown -R root. /var/rtorrent

ADD Docker/supervisor /etc/supervisor
ADD Docker/nginx/conf.d /etc/nginx/conf.d
ADD Docker/rtorrent /root

RUN mkdir -p /var/log/supervisor

CMD ["/usr/bin/supervisord"]