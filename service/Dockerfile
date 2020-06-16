# syntax = docker/dockerfile:experimental
FROM node:lts-buster-slim AS base

FROM base AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn --pure-lockfile --production true

FROM base AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked yarn --pure-lockfile --production false
COPY tsconfig.json tsconfig.json .jestrc.json ./
COPY src ./src
COPY tests ./tests
RUN yarn test:unit && yarn test:integration
RUN yarn build

FROM base AS release
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

CMD [ "yarn", "start" ]

