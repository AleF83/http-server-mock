FROM node:lts-buster-slim

RUN yarn global add lerna

WORKDIR /http-server-mock

COPY package.json yarn.lock lerna.json ./

COPY ./service/package.json ./service/tsconfig.json ./service/
COPY ./packages ./packages
RUN lerna bootstrap
COPY ./service/package.json ./service
COPY ./service/src ./service/src

RUN lerna run build

ENV NODE_ENV=development

WORKDIR /http-server-mock/service

CMD [ "yarn", "start" ]
