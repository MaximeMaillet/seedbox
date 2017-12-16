FROM debian:jessie

ENV USER=torrent

RUN apt-get update && \
    apt-get install -y rtorrent \
    supervisor \
    nginx

RUN mkdir -p /home/$USER && \
    addgroup --system --gid 1000 $USER && \
    useradd -l --system --home-dir /home/$USER --uid 1000 --gid 1000 $USER && \
    mkdir -p /var/rtorrent/session /var/rtorrent/torrents /var/rtorrent/downloaded /var/rtorrent/logs && \
    mkdir -p /var/log/supervisor && \
    chown -R $USER. /var/rtorrent && \
    chown -R $USER. /home/$USER

ADD ./supervisor /etc/supervisor
ADD ./nginx/sites-enabled/default.conf /etc/nginx/sites-enabled/default
ADD ./rtorrent /home/$USER

CMD ["/usr/bin/supervisord"]