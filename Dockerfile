FROM node:8.9.1

RUN mkdir -p /var/app

ADD . /var/app

WORKDIR /var/app

RUN chown -R node. /var/app

USER node

RUN npm i

CMD ["npm", "start"]