# syntax = docker/dockerfile:experimental
ARG RUN_TESTS=yes
ARG DEBUG=false

FROM node:lts-buster-slim AS base

FROM base AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn --pure-lockfile --production true

FROM base AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn --pure-lockfile --production false
COPY tsconfig.json tsconfig.build.json .jestrc.json ./
COPY src ./src
COPY tests ./tests
RUN yarn build

FROM build AS test
WORKDIR /app
RUN yarn test:unit && yarn test:integration

FROM build AS no
FROM test AS yes

FROM build AS true
FROM dependencies AS false

FROM ${RUN_TESTS} AS dist
FROM ${DEBUG} AS node_modules

FROM base AS release
WORKDIR /app
COPY --from=node_modules /app/node_modules ./node_modules
COPY --from=dist /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

CMD [ "yarn", "start" ]

