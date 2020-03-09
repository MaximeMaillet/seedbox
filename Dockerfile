FROM node:10.18.0-alpine

RUN mkdir -p /var/app
COPY --chown=node:node "." "/var/app"
USER node
WORKDIR /var/app

#RUN mkdir public

CMD ["npm", "start"]
