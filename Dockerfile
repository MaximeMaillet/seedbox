FROM node:8.9.1

RUN mkdir -p /var/app

ADD . /var/app

WORKDIR /var/app

RUN chown -R node. /var/app

USER node
WORKDIR /var/app
RUN mkdir public && mkdir sessions && npm i

CMD ["npm", "start"]