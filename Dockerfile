FROM node:8.16.0

ENV NODE_ENV=production

RUN mkdir -p /var/app

ADD . /var/app

WORKDIR /var/app

RUN chown -R node. /var/app

USER node
WORKDIR /var/app
RUN mkdir public

CMD ["npm", "start"]
