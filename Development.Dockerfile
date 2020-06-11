# syntax = docker/dockerfile:experimental
FROM node:lts-buster-slim

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn global add lerna

WORKDIR /app
COPY package.json yarn.lock lerna.json ./
COPY ./packages ./packages
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked lerna bootstrap
RUN lerna run build
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn --pure-lockfile --production false
COPY tsconfig.json tsconfig.build.json .jestrc.json ./
COPY src ./src
RUN yarn build

ENV NODE_ENV=development

CMD [ "yarn", "debug" ]
