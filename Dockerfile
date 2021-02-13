FROM node:14-buster-slim

ENV NODE_ENV=development

USER 1000
RUN mkdir /home/node/app && chown node:node -R /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node .npmrc /home/node/.npmrc
COPY --chown=node:node package*.json ./

#RUN npm ci --loglevel warn

COPY --chown=node:node . .
